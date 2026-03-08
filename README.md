# Cloud Task Manager
Adam Demski 
Nr albumu - 94456


## Opis projektu
Aplikacja webowa do zarządzania zadaniami w architekturze 3-warstwowej.
Umożliwia tworzenie, edycję, usuwanie oraz przeglądanie zadań.
Projekt realizowany jako aplikacja cloud-native w Azure.

## Stos Technologiczny:
| Warstwa | Komponent Lokalny | Usługa Azure |
| :--- | :--- | :--- |
| **Presentation** | React 19 (Vite) | Azure Static Web Apps |
| **Application** | API (.NET 9) | Azure App Service |
| **Data** | Azure SQL | Azure SQL Database (Serverless) |

## Diagram architektury
![Architecture](docs/architecture.png)

## Status projektu
- [x] Artefakt 1 – Architektura i struktura projektu
- [x] Artefakt 2 – Docker Compose i środowisko wielokontenerowe
- [x] Artefakt 3 - Działająca warstwa prezentacji