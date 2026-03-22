namespace CloudBackend.DTOs;
public class TaskReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
}
 
public class TaskCreateDto
{
    public string Name { get; set; } = string.Empty;
    // Nie potrzebujemy Id, bo nada je baza danych
}