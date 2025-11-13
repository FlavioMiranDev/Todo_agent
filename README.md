# ChatBot Project

## Descrição
Sistema de chatbot com backend em C# .NET e frontend em React + TypeScript + Vite.

## Tecnologias
- Backend: C# .NET 9+
- Frontend: React, TypeScript, Vite, Scss
- Banco de Dados: PostgreSQL

## Pré-requisitos
- .NET 9.0 SDK
- Node.js 18+
- PostgreSQL

## Instalação

### Backend
```bash
cd chatbot
dotnet restore
dotnet ef database update
dotnet run
```
API disponível em: http://localhost:5111

### Frontend
```bash
cd chatbot_react
npm install
npm run dev
```
Frontend disponível em: http://localhost:5173

## Configuração

### Backend (appsettings.json)

Crie os arquivos ```appsettings.json``` e ```appsettin.Development.json```:

```json
{
  "Gemini": {
    "ApiKey": "SUA_CHAVE_API_GEMINI_AI"
  },
  "ConnectionStrings": {
    "DefaultConnection": "CONNECT_STRING_DO_POSTGRESQL"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Frontend

No arquivo ```src/api/httpClient.ts```:

```TypeScript
export const apiClient = axios.create({
  baseURL: "URL_DO_BACKEND",
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Estrutura do Projeto
```
project/
  chatbot/
    Controllers/
    Data/
    Interfaces/
    Migrations/
    Models/
    Repositories/
    Services/
  chatbot_react/
    src/
        api/
        assets/
        components/
        contexts/
        pages/
        routes/
        services/
        types

```

## Desenvolvimento
- Backend: `dotnet run` na pasta backend
- Frontend: `npm run dev` na pasta frontend
