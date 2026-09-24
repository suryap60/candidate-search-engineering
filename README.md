# Candidate Search Engineering Assessment

A full-stack candidate search application built as part of the Candidate Search Engineering Assessment.

The application provides candidate registration and authentication, followed by a protected candidate search interface with filtering, sorting, and database-level pagination.

---

## Tech Stack

### Backend

- ASP.NET Core Web API
- .NET 10
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- BCrypt password hashing
- Swagger / OpenAPI

### Frontend

- React
- TypeScript
- Vite
- Axios
- CSS

---

# Project Structure

```text
candidate-search/
│
├── candidate-search-backend/
│   ├── Controllers/
│   ├── Configuration/
│   ├── Data/
│   ├── DTOs/
│   ├── Exceptions/
│   ├── Middleware/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   ├── appsettings.json
│   ├── appsettings.Development.example.json
│   └── CandidateSearch.Api.csproj
│
├── candidate-search-frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

Backend and frontend are separate projects inside the same Git repository, as required by the assessment.

---

# Features

## Authentication

- Candidate registration
- Unique email validation
- Password hashing using BCrypt
- Candidate login
- JWT access token authentication
- Refresh token support
- Token expiration
- Last login tracking
- Protected candidate search endpoint
- Current authenticated candidate excluded from search results

## Candidate Search

The candidate search API supports:

- Minimum age
- Maximum age
- Gender
- Location
- Multiple education filters
- Created date range
- Last login date range
- Sorting
- Pagination
- Total result count

Filtering, sorting, counting, and pagination are performed at the database/query level using Entity Framework Core rather than loading the complete candidate dataset into application memory.

---

# API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

Example request:

```json
{
  "email": "candidate@example.com",
  "password": "Password@123"
}
```

### Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "candidate@example.com",
  "password": "Password@123"
}
```

### Refresh Token

```http
POST /api/auth/refresh
```

---

## Candidate Search

```http
GET /api/candidates/search
```

This endpoint requires JWT authentication.

Example:

```http
GET /api/candidates/search?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc
```

Example with filters:

```http
GET /api/candidates/search?page=1&pageSize=20&minAge=25&maxAge=35&gender=Male&location=Kochi&education=B.Tech,M.Tech&sortBy=createdAt&sortOrder=desc
```

---

# Search Parameters

| Parameter | Description |
|---|---|
| `page` | Page number |
| `pageSize` | Number of results per page |
| `minAge` | Minimum candidate age |
| `maxAge` | Maximum candidate age |
| `gender` | Gender filter |
| `location` | Location filter |
| `education` | Comma-separated education values |
| `createdFrom` | Candidate creation start date |
| `createdTo` | Candidate creation end date |
| `lastLoginFrom` | Last login start date |
| `lastLoginTo` | Last login end date |
| `sortBy` | `createdAt`, `lastLoginAt`, or `age` |
| `sortOrder` | `asc` or `desc` |

---

# Database Design

The application uses PostgreSQL.

```text
Users
  │
  │ 1 : 1
  │
  ▼
Candidates
```

## Users

- Id
- Email
- PasswordHash
- CreatedAt
- LastLoginAt

## Candidates

- Id
- UserId
- Name
- DateOfBirth
- Gender
- Location
- Education
- CreatedAt

---

# PostgreSQL Setup

## Requirements

Install:

- PostgreSQL
- .NET 10 SDK
- Node.js and npm

Create a PostgreSQL database:

```text
candidate_search
```

---

# Backend Configuration

The backend uses `appsettings.json` for non-secret configuration and local development configuration for machine-specific secrets.

Copy:

```text
candidate-search-backend/appsettings.Development.example.json
```

to:

```text
candidate-search-backend/appsettings.Development.json
```

Then update the local PostgreSQL password and JWT secret.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=candidate_search;Username=postgres;Password=YOUR_POSTGRES_PASSWORD"
  },
  "Jwt": {
    "SecretKey": "YOUR_LONG_RANDOM_JWT_SECRET_KEY"
  }
}
```

The actual `appsettings.Development.json` file is excluded from Git and must not be committed.

No real passwords or secrets are stored in the repository.

---

# Backend Setup

Navigate to the backend:

```bash
cd candidate-search-backend
```

Restore dependencies:

```bash
dotnet restore
```

---

# Entity Framework Core Migrations

The repository contains the initial Entity Framework Core migration.

To apply the migration to PostgreSQL:

```bash
dotnet ef database update
```

If the EF Core CLI is not installed:

```bash
dotnet tool install --global dotnet-ef
```

Then:

```bash
dotnet ef database update
```

To create a new migration after a model change:

```bash
dotnet ef migrations add MigrationName
```

Then:

```bash
dotnet ef database update
```

---

# Seed Data

The application contains development seed data.

The seed process creates sample users and candidates when the database is initially empty.

Sample login:

```text
Email: anjali@example.com
Password: Password@123
```

Other seeded users use the same password.

The seed data contains candidates with different:

- Ages
- Genders
- Locations
- Education values
- Created dates
- Last login dates

This allows the search functionality and filters to be tested immediately.

---

# Run the Backend

From the backend folder:

```bash
dotnet run
```

The API runs at:

```text
http://localhost:5222
```

Swagger:

```text
http://localhost:5222/swagger
```

---

# Frontend Setup

Navigate to the frontend:

```bash
cd candidate-search-frontend
```

Install dependencies:

```bash
npm install
```

---

# Frontend Configuration

Copy:

```text
.env.example
```

to:

```text
.env
```

Set:

```env
VITE_API_BASE_URL=http://localhost:5222/api
```

The `.env` file is excluded from Git.

---

# Run the Frontend

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

Open:

```text
http://localhost:5173
```

---

# Running the Complete Application

## Terminal 1 — Backend

```bash
cd candidate-search-backend
dotnet run
```

## Terminal 2 — Frontend

```bash
cd candidate-search-frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# Application Flow

```text
React Frontend
      │
      │ HTTP + JWT
      ▼
ASP.NET Core API
      │
      │ EF Core
      ▼
PostgreSQL
```

Candidate search flow:

```text
React
  ↓
GET /api/candidates/search
  ↓
JWT Authentication
  ↓
CandidateService
  ↓
EF Core IQueryable
  ↓
PostgreSQL
  ↓
WHERE + ORDER BY + COUNT + OFFSET/LIMIT
  ↓
API Response
  ↓
React Table
```

Filtering, sorting, counting, and pagination are performed by the database query.

---

# Search Behavior

## Current Candidate Exclusion

The currently authenticated candidate is excluded from search results at the database query level.

## Education Multi-Select

Multiple education values can be supplied as comma-separated values:

```text
education=B.Tech,M.Tech,MBA
```

The values are translated into a database-level `IN`-style query through Entity Framework Core.

## Date Filters

Created date and last-login date filters are date-based and inclusive.

For example:

```text
createdFrom=2026-09-01
createdTo=2026-09-15
```

includes candidates created during the complete September 15 date.

## Never Logged-In Candidates

Candidates whose `LastLoginAt` is `null` are displayed as never having logged in.

They do not match last-login date filters.

---

# Assumptions

The assessment brief leaves some parts of the data model open. The following assumptions were made:

1. Each registered user has one candidate profile.
2. A candidate profile is associated with a user through `UserId`.
3. Candidate education is stored as a single education value.
4. Multiple education filters are supplied as comma-separated values.
5. Created-date and last-login filters are date-based and inclusive.
6. A candidate who has never logged in has a `null` `LastLoginAt`.
7. Candidates with `null` `LastLoginAt` do not match last-login date filters.
8. The currently authenticated candidate is excluded from search results.
9. PostgreSQL is the application's persistent database.
10. Seed data is provided to make the search functionality immediately testable.
11. JWT access tokens are used for protected candidate endpoints.
12. Refresh-token support was added as an additional authentication capability.

---

# Security Considerations

- Passwords are hashed using BCrypt.
- Passwords are never stored as plain text.
- Candidate search endpoints require authentication.
- JWT tokens are validated by the API.
- The current candidate ID is obtained from the authenticated JWT claims.
- The current candidate is excluded at database query level.
- Development secrets are excluded from Git.
- PostgreSQL credentials are supplied through local configuration.
- No real development secrets are committed to the repository.

---

# Error Handling

The API includes centralized exception handling for application errors.

Handled cases include:

- Invalid credentials
- Duplicate email
- Unauthorized requests
- Invalid or expired tokens
- Invalid application requests
- Unexpected server errors

---

# Swagger

Swagger/OpenAPI is enabled during development.

Open:

```text
http://localhost:5222/swagger
```

The Swagger UI supports Bearer authentication for testing protected endpoints.

---

# Frontend States

The candidate search interface handles:

- Loading state
- Search results
- Empty results
- API errors
- Unauthorized responses
- Pagination
- Filter reset
- Candidate count
- Sorting

---

# Git Repository Structure

The assessment is submitted as one Git repository containing two separate projects:

```text
candidate-search/
│
├── candidate-search-backend/
├── candidate-search-frontend/
├── .gitignore
└── README.md
```

The backend and frontend are separate projects while sharing the same repository, as required by the assessment.

---

# Configuration and Secrets

The following local configuration files are excluded from Git:

```text
.env
.env.local
appsettings.Development.json
```

Example configuration files are provided:

```text
candidate-search-backend/appsettings.Development.example.json
candidate-search-frontend/.env.example
```

These contain placeholders only and can be copied for local setup.

---

# Testing Checklist

## Authentication

- [ ] Register a new candidate
- [ ] Register using an existing email
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Access protected endpoint without JWT
- [ ] Access protected endpoint with valid JWT
- [ ] Refresh an access token

## Candidate Search

- [ ] Search without filters
- [ ] Minimum age
- [ ] Maximum age
- [ ] Gender
- [ ] Location
- [ ] Single education
- [ ] Multiple education values
- [ ] Created-from date
- [ ] Created-to date
- [ ] Last-login-from date
- [ ] Last-login-to date
- [ ] Candidates who never logged in
- [ ] Sort by created date
- [ ] Sort by last login
- [ ] Sort by age
- [ ] Ascending order
- [ ] Descending order
- [ ] Pagination
- [ ] Page size
- [ ] Current candidate exclusion
- [ ] Empty search results

---

# Time Spent

Approximately:


The assessment time window was 24 hours. The value above should represent the actual development time spent rather than the allowed assessment duration.

---

# What I Would Do Next With More Time

With additional development time, I would consider:

- Add unit tests for authentication and candidate search services.
- Add integration tests for API endpoints.
- Add stronger request validation and standardized validation responses.
- Add refresh-token persistence and revocation.
- Add URL query synchronization for search filters.
- Add debounced search where appropriate.
- Add Docker Compose for PostgreSQL and local application setup.
- Add CI checks for build, tests, and linting.
- Add more comprehensive API documentation.
- Add automated dependency and security checks.

---

# Submission Checklist

Before submitting the repository, verify the following:

- [ ] Backend and frontend are in separate folders.
- [ ] PostgreSQL migration files are included.
- [ ] Seed data is documented.
- [ ] README contains PostgreSQL setup instructions.
- [ ] README contains migration instructions.
- [ ] README contains backend run instructions.
- [ ] README contains frontend run instructions.
- [ ] README documents assumptions.
- [ ] README documents actual time spent.
- [ ] README documents next steps with more time.
- [ ] No real passwords or secrets are committed.
- [ ] `.env` is not committed.
- [ ] `appsettings.Development.json` is not committed.
- [ ] `node_modules` is not committed.
- [ ] `bin` and `obj` are not committed.
- [ ] Nested `.git` folders have been removed.
- [ ] The repository has meaningful incremental commits.
- [ ] The application can be started using the documented commands.
- [ ] The database can be created using the documented migration commands.

---

# Assessment Submission

This repository contains:

1. Backend source code
2. Frontend source code
3. PostgreSQL Entity Framework Core migrations
4. Development seed data
5. Setup and execution instructions
6. Configuration examples
7. Assumptions and implementation notes
8. Time-spent and future-improvement notes
