using CloudBackend.Data;
using Microsoft.EntityFrameworkCore;
using CloudBackend.Models;
using Azure.Identity;
using Azure.Extensions.AspNetCore.Configuration.Secrets;

var builder = WebApplication.CreateBuilder(args);

// --- KEY VAULT (BEZ WARUNKU - NA TEST) ---
var keyVaultEndpoint = new Uri("https://kv-cloud-task-manager3.vault.azure.net/");
builder.Configuration.AddAzureKeyVault(keyVaultEndpoint, new DefaultAzureCredential());

// --- DEBUG LOGI ---
Console.WriteLine("ENV: " + builder.Environment.EnvironmentName);
Console.WriteLine("KV Name: " + builder.Configuration["KeyVaultName"]);
Console.WriteLine("CS: " + builder.Configuration["DbConnectionString"]);

// --- SEKCJA USŁUG ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Pobranie connection stringa
var connectionString = builder.Configuration["DbConnectionString"] 
                       ?? builder.Configuration.GetConnectionString("DefaultConnection");

// 🔴 dodatkowy check (żeby nie crashowało bez info)
if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("Connection string is NULL!");
}

// Rejestracja bazy danych
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString,
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null)
    ));

builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// --- SEED ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        if (!context.Tasks.Any())
        {
            context.Tasks.AddRange(
                new CloudTask { Name = "Zrobić kawę", IsCompleted = true },
                new CloudTask { Name = "Zabezpieczyć aplikację w Azure", IsCompleted = true }
            );
            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Błąd bazy: {ex.Message}");
    }
}

// --- MIDDLEWARE ---
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cloud API V1");
    c.RoutePrefix = string.Empty; 
});

app.UseCors();
app.MapControllers();
app.Run();