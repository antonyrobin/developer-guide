export const dotnetApiCourse = {
  id: 'dotnet-api',
  title: '.NET Core Web API',
  description: 'Build high-performance RESTful APIs with C# and .NET 10, featuring Entity Framework Core and ADO.NET data access, JWT authentication, rate limiting, security headers, and 100% test coverage.',
  officialDocs: 'https://learn.microsoft.com/en-us/aspnet/core/web-api/',
  tutorialLink: 'https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api',
  exerciseLink: null,
  sections: [
    {
      title: 'What is ASP.NET Core Web API',
      image: '/images/dotnet-api/dotnet-api-overview.svg',
      content: `**ASP.NET Core Web API** is a framework for building HTTP-based RESTful services using C#. It is cross-platform, high-performance, and consistently benchmarks among the **fastest web frameworks** globally.

### .NET 10 Features

.NET 10 introduces **Native AOT** for faster startup, improved performance with span-based memory management, and enhanced C# features like records, primary constructors, and pattern matching.

### Two API Styles

Modern ASP.NET Core uses **Controller-based APIs** (structured, attribute-routed) or **Minimal APIs** (less boilerplate). It provides built-in middleware for authentication, CORS, exception handling, and **OpenAPI** documentation.

### Repository–Service–Controller Pattern

\`\`\`text
HTTP Request
  → Controller (validates & delegates)
    → Service (business logic, DTO ↔ Entity mapping)
      → Repository (data access — EF Core or ADO.NET)
        → Database (PostgreSQL)
\`\`\`

### Two Data Access Strategies

This project demonstrates both **Entity Framework Core** (ORM) and **raw ADO.NET / Npgsql** (manual SQL) for data access, allowing you to compare approaches and choose based on your requirements.`,
      keyPoints: [
        'One of the fastest web frameworks benchmarked.',
        'Cross-platform: runs on Windows, macOS, Linux.',
        'Controller-based APIs with attribute routing.',
        'Repository–Service–Controller pattern for clean architecture.',
        'Built-in OpenAPI/Swagger documentation.',
        'Supports both EF Core and ADO.NET data access.'
      ]
    },

    {
      title: 'Prerequisites & Installation',
      image: '/images/dotnet-api/installation.svg',
      content: `### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| **.NET 10 SDK** | 10.0+ | Build & run the API |
| **PostgreSQL** | 14+ | Database (or use Supabase cloud) |
| **Docker Desktop** | Latest | Container deployment & integration tests |
| **Visual Studio 2022** or **VS Code** | Latest | IDE |
| **dotnet-reportgenerator** | 5.x | Code coverage HTML reports |

### Install .NET 10 SDK

\`\`\`powershell
# Using winget
winget install Microsoft.DotNet.SDK.10

# Verify
dotnet --version   # 10.0.xxx
dotnet --list-sdks # List all installed SDKs
\`\`\`

### Global Tools

\`\`\`powershell
# Entity Framework Core CLI
dotnet tool install --global dotnet-ef

# Code coverage report generator
dotnet tool install -g dotnet-reportgenerator-globaltool

# HTTPS development certificate
dotnet dev-certs https --trust
\`\`\`

### VS Code Extensions

- ms-dotnettools.csharp — C# language support
- ms-dotnettools.csdevkit — C# Dev Kit
- patcx.vscode-nuget-gallery — NuGet package browser
- humao.rest-client — HTTP request testing`,
      keyPoints: [
        'Install .NET 10 SDK via winget or Visual Studio.',
        'PostgreSQL 14+ for the database (or Supabase cloud).',
        'Docker Desktop for containerized deployment and integration tests.',
        'Install dotnet-ef and reportgenerator global tools.',
        'Trust HTTPS certificate for development.'
      ]
    },

    {
      title: 'Project Creation & Structure',
      image: '/images/dotnet-api/project-structure.svg',
      content: `### Create the Project

\`\`\`powershell
dotnet new webapi -n dot-net-core-rest-api -controllers
cd dot-net-core-rest-api
\`\`\`

### Install NuGet Packages

\`\`\`powershell
# Main Project
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.ComponentModel.Annotations
dotnet add package Microsoft.AspNetCore.OpenApi

# Test Project
cd Tests
dotnet add package Moq
dotnet add package Microsoft.EntityFrameworkCore.InMemory
dotnet add package Microsoft.AspNetCore.Mvc.Testing
dotnet add package Testcontainers.PostgreSql
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package coverlet.msbuild
dotnet add package coverlet.collector
\`\`\`

### Project Structure

\`\`\`text
dot-net-core-rest-api/
├── Controllers/
│   ├── CategoriesController.cs          # EF Core endpoints (JWT-protected)
│   └── SubCategoriesController.cs       # ADO.NET endpoints (JWT-protected)
├── Data/
│   ├── AppDbContext.cs                   # EF Core DbContext
│   └── Configurations/
│       └── CategoryConfiguration.cs     # Fluent API table mapping
├── Dtos/
│   ├── CategoryDtos.cs                  # Category request/response records
│   └── SubCategoryDtos.cs              # SubCategory request/response records
├── Entities/
│   ├── Category.cs                      # Category domain model
│   └── SubCategory.cs                   # SubCategory domain model
├── Migrations/
│   ├── 000_create_categories.sql        # Categories table DDL
│   └── 001_create_sub_categories.sql    # SubCategories table DDL
├── Repositories/
│   ├── ICategoryRepository.cs           # Category repository interface
│   ├── CategoryRepository.cs            # EF Core implementation
│   ├── ISubCategoryRepository.cs        # SubCategory repository interface
│   └── SubCategoryRepository.cs         # ADO.NET / Npgsql implementation
├── Services/
│   ├── ICategoryService.cs              # Category service interface
│   ├── CategoryService.cs               # Business logic + DTO mapping
│   ├── ISubCategoryService.cs           # SubCategory service interface
│   └── SubCategoryService.cs            # Business logic + DTO mapping
├── Tests/
│   ├── CategoriesControllerTests.cs     # Controller unit tests
│   ├── CategoryServiceTests.cs          # Service unit tests
│   ├── CategoryRepositoryTests.cs       # Repository unit tests (InMemory)
│   ├── SubCategoryRepositoryTests.cs    # Repository integration tests
│   ├── CategoriesIntegrationTests.cs    # Full-stack integration tests
│   ├── IntegrationTestFactory.cs        # WebApplicationFactory + Testcontainers
│   └── dot-net-core-rest-api.Tests.csproj
├── Program.cs                           # Entry point, DI, middleware, security
├── appsettings.json                     # Configuration (JWT, CORS, DB)
├── Dockerfile                           # Multi-stage Docker build
└── dot-net-core-rest-api.csproj
\`\`\``,
      keyPoints: [
        'Use dotnet new webapi -controllers for controller-based API.',
        'Separate layers: Controllers, Services, Repositories, Entities, DTOs.',
        'Two repository implementations: EF Core (Category) and ADO.NET (SubCategory).',
        'Tests folder mirrors the main project structure.',
        'SQL migrations in Migrations/ folder for manual DDL.'
      ]
    },

    {
      title: 'Entities & DTOs',
      content: `**Entities** represent database tables. **DTOs** (Data Transfer Objects) use C# \`record\` types for immutability and control what data is exposed at the API boundary.

### Entities

\`\`\`csharp
// Entities/Category.cs
namespace dot_net_core_rest_api.Entities;

public class Category
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

// Entities/SubCategory.cs
public class SubCategory
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int CategoryId { get; set; }
}
\`\`\`

### DTOs with Validation

DTOs use validation attributes to enforce constraints at the API boundary **before reaching the service layer**. This prevents over-posting and data injection.

\`\`\`csharp
// Dtos/CategoryDtos.cs
using System.ComponentModel.DataAnnotations;

namespace dot_net_core_rest_api.Dtos;

public record CategoryDto(
    int Id, DateTime CreatedAt, string Code, string Name
);

public record CreateCategoryRequest(
    [Required, StringLength(50, MinimumLength = 1)] string Code,
    [Required, StringLength(200, MinimumLength = 1)] string Name
);

public record UpdateCategoryRequest(
    [StringLength(50)] string? Code,
    [StringLength(200)] string? Name
);
\`\`\`

\`\`\`csharp
// Dtos/SubCategoryDtos.cs
public record SubCategoryDto(
    int Id, DateTime CreatedAt, string Code,
    string Name, int CategoryId
);

public record CreateSubCategoryRequest(
    [Required, StringLength(50, MinimumLength = 1)] string Code,
    [Required, StringLength(200, MinimumLength = 1)] string Name,
    [Range(1, int.MaxValue)] int CategoryId
);

public record UpdateSubCategoryRequest(
    [StringLength(50)] string? Code,
    [StringLength(200)] string? Name,
    [Range(1, int.MaxValue)] int? CategoryId
);
\`\`\`

### Why DTOs Matter

| Concern | Without DTOs | With DTOs |
|---|---|---|
| **Over-posting** | Client sends extra fields that update unintended columns | Only declared fields are accepted |
| **Data exposure** | Internal IDs, timestamps, foreign keys leak to client | API shape is controlled explicitly |
| **Validation** | Validation mixed into entity or controller logic | Attributes on DTO enforce constraints at boundary |
| **Versioning** | Entity changes break all clients | DTOs decouple API contract from database schema |`,
      keyPoints: [
        'Entities map to database tables — internal objects.',
        'DTOs use C# record types for immutability and value equality.',
        'Validation attributes enforce constraints at the API boundary.',
        'DTOs prevent over-posting and control API response shape.',
        'UpdateRequest uses nullable fields for partial updates.'
      ]
    },

    {
      title: 'Database Configuration',
      content: `### Connection String

Configure the PostgreSQL connection in \`appsettings.json\`:

\`\`\`json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=mydb;Username=postgres;Password=SET_VIA_ENV_VAR"
  }
}
\`\`\`

> **Security:** Never commit passwords. Use environment variables or \`dotnet user-secrets\`.

### DbContext

\`\`\`csharp
// Data/AppDbContext.cs
using dot_net_core_rest_api.Entities;
using Microsoft.EntityFrameworkCore;

namespace dot_net_core_rest_api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AppDbContext).Assembly
        );
    }
}
\`\`\`

### Fluent API Configuration

\`\`\`csharp
// Data/Configurations/CategoryConfiguration.cs
public class CategoryConfiguration
    : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("categories");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();
        builder.Property(c => c.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamptz")
            .HasDefaultValueSql("now()");
        builder.Property(c => c.Code)
            .HasColumnName("code")
            .HasColumnType("varchar")
            .IsRequired();
        builder.Property(c => c.Name)
            .HasColumnName("name")
            .HasColumnType("varchar")
            .IsRequired();

        builder.HasIndex(c => c.Code).IsUnique();
        builder.HasIndex(c => c.Name).IsUnique();
    }
}
\`\`\`

### SQL Migrations

\`\`\`sql
-- Migrations/000_create_categories.sql
CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    code        VARCHAR     NOT NULL UNIQUE,
    name        VARCHAR     NOT NULL UNIQUE
);

-- Migrations/001_create_sub_categories.sql
CREATE TABLE IF NOT EXISTS sub_categories (
    id          SERIAL PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    code        VARCHAR     NOT NULL UNIQUE,
    name        VARCHAR     NOT NULL UNIQUE,
    category_id INT         NOT NULL REFERENCES categories(id)
                            ON DELETE CASCADE
);
\`\`\``,
      keyPoints: [
        'DbContext manages database connections and entity tracking.',
        'Fluent API maps C# PascalCase to PostgreSQL snake_case columns.',
        'ValueGeneratedOnAdd() lets PostgreSQL generate id and timestamps.',
        'Unique indexes enforce code and name uniqueness.',
        'SQL migrations provide manual DDL for table creation.'
      ]
    },

    {
      title: 'Data Access — Entity Framework Core',
      image: '/images/dotnet-api/ef-core.svg',
      content: `The Category repository uses **Entity Framework Core** with \`AppDbContext\`. EF Core tracks changes, generates SQL automatically, and manages connection lifetimes.

### Request Flow

\`\`\`text
HTTP Request
  → Controller (validates & delegates)
    → Service (business logic, DTO ↔ Entity mapping)
      → Repository (EF Core DbContext)
        → DbContext.SaveChangesAsync()
          → PostgreSQL
\`\`\`

### Repository Interface

\`\`\`csharp
public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync(CancellationToken ct);
    Task<Category?> GetByIdAsync(int id, CancellationToken ct);
    Task<Category> CreateAsync(Category category, CancellationToken ct);
    Task UpdateAsync(Category category, CancellationToken ct);
    Task<bool> DeleteAsync(int id, CancellationToken ct);
}
\`\`\`

### Repository Implementation

\`\`\`csharp
public class CategoryRepository(AppDbContext db)
    : ICategoryRepository
{
    public async Task<List<Category>> GetAllAsync(CancellationToken ct)
        => await db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .ToListAsync(ct);

    public async Task<Category?> GetByIdAsync(
        int id, CancellationToken ct)
        => await db.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, ct);

    public async Task<Category> CreateAsync(
        Category category, CancellationToken ct)
    {
        db.Categories.Add(category);
        await db.SaveChangesAsync(ct);
        return category;
    }

    public async Task UpdateAsync(
        Category category, CancellationToken ct)
    {
        db.Categories.Update(category);
        await db.SaveChangesAsync(ct);
    }

    public async Task<bool> DeleteAsync(
        int id, CancellationToken ct)
    {
        var category = await db.Categories.FindAsync([id], ct);
        if (category is null) return false;
        db.Categories.Remove(category);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
\`\`\`

### Key EF Core Features

| Feature | Purpose |
|---|---|
| \`AsNoTracking()\` | Disables change tracking for read-only queries (better performance) |
| \`SaveChangesAsync()\` | Wraps all pending changes in a database transaction automatically |
| \`ValueGeneratedOnAdd()\` | Lets PostgreSQL generate \`id\` and \`created_at\` values |
| Fluent API | Maps C# PascalCase properties to PostgreSQL snake_case columns |
| LINQ queries | Type-safe queries translated to SQL at runtime |`,
      keyPoints: [
        'EF Core tracks changes and generates SQL automatically.',
        'AsNoTracking() improves performance for read-only queries.',
        'SaveChangesAsync() wraps changes in a transaction automatically.',
        'Repository pattern abstracts data access behind interfaces.',
        'Primary constructor injection (C# 12) reduces boilerplate.'
      ]
    },

    {
      title: 'Data Access — ADO.NET / Npgsql',
      content: `The SubCategory repository uses **raw ADO.NET** via \`NpgsqlDataSource\` and \`NpgsqlCommand\` with **parameterized queries** to prevent SQL injection. This provides full control over the SQL being executed.

### Request Flow

\`\`\`text
HTTP Request
  → Controller (validates & delegates)
    → Service (business logic, DTO ↔ Entity mapping)
      → Repository (NpgsqlDataSource → NpgsqlCommand)
        → cmd.Parameters.AddWithValue("@param", value)  ← parameterized
        → cmd.ExecuteReaderAsync() / cmd.ExecuteNonQueryAsync()
          → PostgreSQL
\`\`\`

### How Parameterized Queries Work

\`\`\`csharp
// DANGEROUS — SQL injection vulnerability
var sql = $"SELECT * FROM sub_categories WHERE id = {id}";

// SAFE — Parameterized query
const string sql = "SELECT * FROM sub_categories WHERE id = @id";
cmd.Parameters.AddWithValue("id", id);
\`\`\`

The database engine receives the SQL structure and parameter values independently, making it **impossible to inject malicious SQL**.

### Transaction / Commit / Rollback Pattern

For operations that need **atomicity** (multiple statements that must all succeed or all fail), use explicit transactions:

\`\`\`csharp
await using var conn = await dataSource.OpenConnectionAsync(ct);
await using var transaction =
    await conn.BeginTransactionAsync(ct);

try
{
    await using var cmd1 = new NpgsqlCommand(
        "INSERT INTO orders (customer_id, total) "
        + "VALUES (@customerId, @total) RETURNING id",
        conn, transaction);
    cmd1.Parameters.AddWithValue("customerId", customerId);
    cmd1.Parameters.AddWithValue("total", orderTotal);
    var orderId = (int)(await cmd1.ExecuteScalarAsync(ct))!;

    // Insert each order item
    foreach (var item in orderItems)
    {
        await using var cmd2 = new NpgsqlCommand(
            "INSERT INTO order_items "
            + "(order_id, product_id, quantity, price) "
            + "VALUES (@orderId, @productId, @qty, @price)",
            conn, transaction);
        cmd2.Parameters.AddWithValue("orderId", orderId);
        cmd2.Parameters.AddWithValue("productId", item.ProductId);
        cmd2.Parameters.AddWithValue("qty", item.Quantity);
        cmd2.Parameters.AddWithValue("price", item.Price);
        await cmd2.ExecuteNonQueryAsync(ct);
    }

    await transaction.CommitAsync(ct);   // ✅ All succeed
}
catch
{
    await transaction.RollbackAsync(ct); // ❌ All rolled back
    throw;
}
\`\`\`

### Repository Implementation

\`\`\`csharp
public class SubCategoryRepository(NpgsqlDataSource dataSource)
    : ISubCategoryRepository
{
    public async Task<SubCategory?> GetByIdAsync(
        int id, CancellationToken ct)
    {
        const string sql = """
            SELECT id, created_at, code, name, category_id
            FROM sub_categories WHERE id = @id
            """;

        await using var conn =
            await dataSource.OpenConnectionAsync(ct);
        await using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("id", id);
        await using var reader =
            await cmd.ExecuteReaderAsync(ct);

        return await reader.ReadAsync(ct)
            ? MapRow(reader)
            : null;
    }

    public async Task<SubCategory> CreateAsync(
        SubCategory sub, CancellationToken ct)
    {
        const string sql = """
            INSERT INTO sub_categories
                (code, name, category_id, created_at)
            VALUES (@code, @name, @categoryId, @createdAt)
            RETURNING id, created_at
            """;

        await using var conn =
            await dataSource.OpenConnectionAsync(ct);
        await using var cmd = new NpgsqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("code", sub.Code);
        cmd.Parameters.AddWithValue("name", sub.Name);
        cmd.Parameters.AddWithValue("categoryId", sub.CategoryId);
        cmd.Parameters.AddWithValue("createdAt", sub.CreatedAt);
        await using var reader =
            await cmd.ExecuteReaderAsync(ct);

        if (await reader.ReadAsync(ct))
        {
            sub.Id = reader.GetInt32(0);
            sub.CreatedAt = reader.GetDateTime(1);
        }
        return sub;
    }

    private static SubCategory MapRow(NpgsqlDataReader reader)
        => new()
    {
        Id         = reader.GetInt32(0),
        CreatedAt  = reader.GetDateTime(1),
        Code       = reader.GetString(2),
        Name       = reader.GetString(3),
        CategoryId = reader.GetInt32(4)
    };
}
\`\`\`

### Key ADO.NET Features

| Feature | Purpose |
|---|---|
| \`NpgsqlDataSource\` | Connection pool managed by Npgsql (registered as Singleton) |
| \`Parameters.AddWithValue()\` | Parameterized queries preventing SQL injection |
| \`RETURNING\` clause | Retrieves server-generated values in the same round-trip |
| Manual \`NpgsqlDataReader\` | Full control over how rows become objects |
| \`BeginTransactionAsync()\` | Explicit transactions for atomicity |`,
      keyPoints: [
        'ADO.NET provides full SQL control with NpgsqlDataSource.',
        'Always use parameterized queries — never concatenate user input into SQL.',
        'Use BeginTransaction / Commit / Rollback for multi-statement atomicity.',
        'RETURNING clause retrieves server-generated values in one round-trip.',
        'NpgsqlDataSource is registered as Singleton for connection pooling.'
      ]
    },

    {
      title: 'EF Core vs ADO.NET Comparison',
      content: `Both data access strategies are used in this project. Choose based on your specific requirements.

### Feature Comparison

| Aspect | Entity Framework Core | ADO.NET / Npgsql |
|---|---|---|
| **Abstraction Level** | High — LINQ queries, change tracking | Low — raw SQL strings |
| **SQL Control** | Generated automatically | Written manually |
| **SQL Injection Protection** | Built-in (parameterized by default) | Manual — must use \`Parameters.AddWithValue()\` |
| **Transaction Management** | Automatic via \`SaveChangesAsync()\` | Manual — \`BeginTransaction\` / \`Commit\` / \`Rollback\` |
| **Performance** | Slight overhead (tracking, LINQ translation) | Minimal overhead (direct SQL execution) |
| **Connection Management** | Managed by DbContext (Scoped lifetime) | Manual via \`NpgsqlDataSource\` (Singleton) |
| **Mapping** | Automatic (Fluent API / conventions) | Manual (\`NpgsqlDataReader\` → entity) |
| **Migration Support** | Built-in EF migrations | Manual SQL scripts |
| **Learning Curve** | Lower (C# LINQ) | Higher (must know SQL) |
| **Best For** | Standard CRUD, rapid development | Complex queries, performance-critical paths |
| **Used By (this project)** | \`CategoryRepository\` | \`SubCategoryRepository\` |

### When to Use Which

- **EF Core** — Default choice for most CRUD operations. Saves development time, prevents common mistakes, and the performance overhead is negligible for typical workloads.
- **ADO.NET** — Use when you need full SQL control: complex joins, CTEs, bulk operations, calling stored procedures, or when microsecond-level performance matters.

### Transaction Comparison

\`\`\`csharp
// EF Core — Automatic transaction
db.Categories.Add(category1);
db.Categories.Add(category2);
await db.SaveChangesAsync(ct); // Both wrapped in one transaction

// ADO.NET — Manual transaction
await using var transaction =
    await conn.BeginTransactionAsync(ct);
try
{
    // Multiple INSERT/UPDATE commands...
    await transaction.CommitAsync(ct);
}
catch
{
    await transaction.RollbackAsync(ct);
    throw;
}
\`\`\``,
      keyPoints: [
        'EF Core — high-level ORM with automatic SQL and change tracking.',
        'ADO.NET — low-level with full SQL control and manual mapping.',
        'EF Core: automatic transactions via SaveChangesAsync().',
        'ADO.NET: manual BeginTransaction / Commit / Rollback.',
        'Use EF Core for standard CRUD; ADO.NET for complex queries and bulk operations.'
      ]
    },

    {
      title: 'Services & Controllers',
      content: `The **Service layer** contains business logic, maps between Entities and DTOs, and depends only on repository interfaces. **Controllers** handle HTTP requests, apply authorization, and delegate to services.

### Service Implementation

\`\`\`csharp
public class CategoryService(
    ICategoryRepository repository,
    ILogger<CategoryService> logger) : ICategoryService
{
    public async Task<List<CategoryDto>> GetAllAsync(
        CancellationToken ct)
    {
        var categories = await repository.GetAllAsync(ct);
        return categories.Select(ToDto).ToList();
    }

    public async Task<CategoryDto?> GetByIdAsync(
        int id, CancellationToken ct)
    {
        var category = await repository.GetByIdAsync(id, ct);
        return category is null ? null : ToDto(category);
    }

    public async Task<CategoryDto> CreateAsync(
        CreateCategoryRequest request, CancellationToken ct)
    {
        var category = new Category
        {
            Code = request.Code,
            Name = request.Name,
            CreatedAt = DateTime.UtcNow
        };
        await repository.CreateAsync(category, ct);
        logger.LogInformation(
            "Category created: {Id} {Code}",
            category.Id, category.Code);
        return ToDto(category);
    }

    private static CategoryDto ToDto(Category c)
        => new(c.Id, c.CreatedAt, c.Code, c.Name);
}
\`\`\`

### Controller Implementation

\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController(
    ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType<List<CategoryDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var categories =
            await categoryService.GetAllAsync(ct);
        return Ok(categories);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(
        int id, CancellationToken ct)
    {
        var category =
            await categoryService.GetByIdAsync(id, ct);
        return category is null ? NotFound() : Ok(category);
    }

    [HttpPost]
    [ProducesResponseType<CategoryDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(
        StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        CreateCategoryRequest request, CancellationToken ct)
    {
        var category =
            await categoryService.CreateAsync(request, ct);
        return CreatedAtAction(
            nameof(GetById),
            new { id = category.Id },
            category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id, UpdateCategoryRequest request,
        CancellationToken ct)
    {
        var updated =
            await categoryService.UpdateAsync(id, request, ct);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(
        int id, CancellationToken ct)
    {
        var deleted =
            await categoryService.DeleteAsync(id, ct);
        return deleted ? NoContent() : NotFound();
    }
}
\`\`\`

### Authorization Rules

| Annotation | Scope | Effect |
|---|---|---|
| \`[Authorize]\` on class | All endpoints | Require valid JWT by default |
| \`[AllowAnonymous]\` | GET endpoints | Read operations are public |
| No annotation | POST/PUT/DELETE | Require authentication |

### API Endpoints

| Method | URL | Auth | Description |
|---|---|---|---|
| \`GET\` | \`/api/categories\` | Public | Get all categories |
| \`GET\` | \`/api/categories/{id}\` | Public | Get by ID |
| \`POST\` | \`/api/categories\` | JWT | Create category |
| \`PUT\` | \`/api/categories/{id}\` | JWT | Update category |
| \`DELETE\` | \`/api/categories/{id}\` | JWT | Delete category |
| \`GET\` | \`/api/subcategories\` | Public | Get all subcategories |
| \`GET\` | \`/api/subcategories/by-category/{categoryId}\` | Public | Get by category |
| \`POST\` | \`/api/subcategories\` | JWT | Create subcategory |`,
      keyPoints: [
        'Services contain business logic and map Entity ↔ DTO.',
        'Controllers handle HTTP, apply auth, delegate to services.',
        '[Authorize] on class protects all endpoints; [AllowAnonymous] exempts reads.',
        'Primary constructor injection (C# 12) reduces boilerplate.',
        'ProducesResponseType documents expected status codes for OpenAPI.'
      ]
    },

    {
            title: 'Caching Layer: Redis & In-Memory',
            image: '/images/dotnet-api/caching.svg',
            content: `**Caching** drastically improves response times and reduces database load by storing frequently accessed, rarely changing data in memory. .NET supports both In-Memory and Distributed caching.

### In-Memory Cache (IMemoryCache)

Best suited for **single-instance applications** where cache consistency across multiple servers is not required.

\`\`\`csharp
// 1. Register in Program.cs
builder.Services.AddMemoryCache();

// 2. Inject and use in a service
public async Task<string> GetConfigDataAsync()
{
    if (!_cache.TryGetValue("ConfigKey", out string value))
    {
        value = await _db.GetConfigAsync(); // Expensive DB call
        
        var options = new MemoryCacheEntryOptions()
            .SetSlidingExpiration(TimeSpan.FromMinutes(5))     // Expires if inactive
            .SetAbsoluteExpiration(TimeSpan.FromHours(1));     // Hard expiration limit
            
        _cache.Set("ConfigKey", value, options);
    }
    return value;
}
\`\`\`

### Distributed Cache with Redis (IDistributedCache)

Mandatory for **multi-instance deployments** (load-balanced environments) to ensure all nodes access the same synchronized cache state.

\`\`\`csharp
// 1. Register in Program.cs
builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

// 2. Inject and use in a service
public async Task<string> GetUserSession(string userId)
{
    var cachedData = await _cache.GetStringAsync($"session:{userId}");
    if (cachedData != null) return cachedData;

    var sessionData = await _db.GetSessionFastAsync(userId);
    await _cache.SetStringAsync($"session:{userId}", sessionData, new DistributedCacheEntryOptions
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
    });
    
    return sessionData;
}
\`\`\`

### Caching Strategies Comparison

| Strategy | Speed | Sharing | Persistence | Cost/Complexity |
|---|---|---|---|---|
| **IMemoryCache** | Extremely Fast (Gen0 heap) | Local to 1 server | Lost on restart | None / Low |
| **Redis** | Network bound (< 1ms) | Shared across servers | Configurable | Needs Redis Server |
`,
            keyPoints: [
                'Use IMemoryCache for monolithic, single-server applications.',
                'Use Redis (IDistributedCache) for clustered or microservices environments.',
                'Always set cache expirations (Sliding or Absolute) to prevent memory leaks.',
                'Cache aggressively for frequent reads, but implement eviction on data writes.',
                'Never store raw PII in cache without encryption.'
            ]
        },

    {
      title: 'Security — Authentication & Authorization',
      image: '/images/dotnet-api/jwt-auth.svg',
      content: `A comprehensive security implementation covering JWT authentication, authorization policies, CORS, rate limiting, security headers, and input validation.

### JWT Bearer Authentication

\`\`\`csharp
builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer =
                builder.Configuration["Jwt:Issuer"],
            ValidAudience =
                builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:Key"]!))
        };
    });
\`\`\`

### Authorization Policies

\`\`\`csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly",
        policy => policy.RequireRole("Admin"));
    options.AddPolicy("ReadAccess",
        policy => policy.RequireAuthenticatedUser());
});
\`\`\`

### CORS — Allow Only Trusted Origins

\`\`\`csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowTrustedOrigins", policy =>
    {
        var origins = builder.Configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>()
            ?? ["http://localhost:3000"];
        policy
            .WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
\`\`\`

### Rate Limiting

Fixed-window rate limiting per IP address: 100 requests per minute.

\`\`\`csharp
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode =
        StatusCodes.Status429TooManyRequests;
    options.AddPolicy("fixed", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection
                .RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
});
\`\`\`

### Security Headers Middleware

\`\`\`csharp
app.Use(async (context, next) =>
{
    var headers = context.Response.Headers;
    headers["X-Content-Type-Options"] = "nosniff";
    headers["X-Frame-Options"] = "DENY";
    headers["Referrer-Policy"] =
        "strict-origin-when-cross-origin";
    headers["X-XSS-Protection"] = "1; mode=block";
    await next();
});
\`\`\`

| Header | Purpose |
|---|---|
| \`X-Content-Type-Options: nosniff\` | Prevents MIME-type sniffing |
| \`X-Frame-Options: DENY\` | Prevents clickjacking via iframes |
| \`Referrer-Policy\` | Limits referrer information leakage |
| \`X-XSS-Protection\` | Legacy XSS filter (defense-in-depth) |

### Security Checklist

| Measure | Implementation |
|---|---|
| **HTTPS Enforcement** | \`app.UseHttpsRedirection()\` redirects HTTP → HTTPS |
| **HSTS** | \`app.UseHsts()\` in production — browsers only use HTTPS |
| **JWT Validation** | Validate issuer, audience, lifetime, and signing key |
| **Role/Policy Authorization** | \`[Authorize(Policy = "AdminOnly")]\` on endpoints |
| **Input Validation** | \`[Required]\`, \`[StringLength]\`, \`[Range]\` on all DTOs |
| **DTO Pattern** | Prevents over-posting; controls exposed data |
| **CORS** | Only trusted origins allowed |
| **Rate Limiting** | 100 req/min per IP to block brute-force |
| **Error Suppression** | \`app.UseExceptionHandler()\` hides stack traces in production |
| **No Sensitive Logging** | Never log tokens, passwords, or PII |
| **Security Headers** | HSTS, X-Content-Type-Options, X-Frame-Options |
| **Parameterized Queries** | All ADO.NET uses \`Parameters.AddWithValue()\` |
| **Remove Unused Endpoints** | Default WeatherForecast controller removed |
| **Cookie Security** | \`HttpOnly\`, \`Secure\`, \`SameSite=Strict\` on all cookies |
| **NuGet Updates** | Regularly update packages to fix vulnerabilities |`,
      keyPoints: [
        'Validate JWT issuer, audience, lifetime, and signing key.',
        'Use role-based and policy-based authorization — not hardcoded values.',
        'CORS allows only trusted origins — never use AllowAnyOrigin in production.',
        'Rate limiting (100 req/min per IP) blocks brute-force attacks.',
        'Security headers (HSTS, X-Frame-Options, nosniff) on every response.',
        'Never log tokens, passwords, or sensitive user data.'
      ]
    },

    {
            title: 'JWT Creation & Management',
            image: '/images/dotnet-api/jwt-creation.svg',
            content: `**JWTs (JSON Web Tokens)** provide stateless, secure authentication for modern web applications. In development and production, you must efficiently generate, manage, and validate these tokens.

### Anatomy of a JWT

A JWT consists of three parts, separated by dots:
- **Header**: Specifies the token type (\`JWT\`) and signing algorithm (\`HS256\`).
- **Payload**: Contains the claims (e.g., user ID, roles, expiration).
- **Signature**: Ensures the token cannot be tampered with.

### Generating a JWT (C#)

\`\`\`csharp
public string GenerateToken(User user)
{
    var secretKey = builder.Configuration["Jwt:Key"]!;
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var claims = new[] 
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(ClaimTypes.Role, user.Role),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    var token = new JwtSecurityToken(
        issuer: builder.Configuration["Jwt:Issuer"],
        audience: builder.Configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
\`\`\`

### Validating a JWT

Token validation occurs automatically in ASP.NET Core when configured in \`Program.cs\`.

\`\`\`csharp
// Program.cs
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,         // Checks expiration
            ValidateIssuerSigningKey = true, // Checks signature
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
\`\`\`

### Generating a Refresh Token

Because JWTs should have short lifetimes, **Refresh Tokens** are used to maintain user sessions without re-authenticating. A refresh token is typically a cryptographically secure random string stored in the database.

\`\`\`csharp
public string GenerateRefreshToken()
{
    var randomNumber = new byte[64];
    using var rng = RandomNumberGenerator.Create();
    rng.GetBytes(randomNumber);
    return Convert.ToBase64String(randomNumber);
}

// Storing the refresh token during login
user.RefreshToken = GenerateRefreshToken();
user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
await _db.SaveChangesAsync();
\`\`\`


### Tools for JWT Generation

| Tool | Purpose | Link |
|---|---|---|
| **jwt.io** | Web interface for manual creation and decoding | [jwt.io](https://jwt.io/) |
| **dotnet user-jwts** | CLI for managing local dev tokens | [Manage JWTs in dev](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/jwt-authn?view=aspnetcore-8.0#manage-jwts-in-development-with-dotnet-user-jwts) |

### Best Practices

- **Strong Keys**: Use a cryptographically strong, random signing key (minimum 32 characters for HMAC SHA256).
- **Short Lifetimes**: Set short expirations (e.g., 15-60 minutes) and use Refresh Tokens for long-lived sessions.
- **Never Store Secrets**: Never hardcode or commit your signing key. Use environment variables.
- **Minimize Payload**: Do not place sensitive or PII data inside the token payload, as it is base64 encoded and publicly readable.
`,
            keyPoints: [
                'JWTs are used for secure, stateless API authentication.',
                'Generate JWTs using C# JwtSecurityToken, the .NET CLI, or jwt.io.',
                'Always use strong, minimum 32-character keys for HMAC SHA256.',
                'Keep tokens short-lived and implement refresh token strategies.',
                'Do not store sensitive personal information inside a JWT.'
            ]
        },

    {
      title: 'Program.cs — DI & Middleware Pipeline',
      image: '/images/dotnet-api/middleware-pipeline.svg',
      content: `\`Program.cs\` is the entry point that configures dependency injection, middleware pipeline, and security. **Middleware order matters** — each component sees the request before passing it to the next.

### Full Program.cs

\`\`\`csharp
using System.Threading.RateLimiting;
using dot_net_core_rest_api.Data;
using dot_net_core_rest_api.Repositories;
using dot_net_core_rest_api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// ── Database ──
var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Database connection string not configured.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddSingleton(
    NpgsqlDataSource.Create(connectionString));

// ── DI — Repository → Service ──
builder.Services
    .AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services
    .AddScoped<ICategoryService, CategoryService>();
builder.Services
    .AddScoped<ISubCategoryRepository, SubCategoryRepository>();
builder.Services
    .AddScoped<ISubCategoryService, SubCategoryService>();

// ── JWT Authentication ──
builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { /* see Security section */ });

// ── Authorization + CORS + Rate Limiting ──
builder.Services.AddAuthorization();
builder.Services.AddCors(/* ... */);
builder.Services.AddRateLimiter(/* ... */);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// ── Middleware Pipeline (order matters!) ──
app.UseHttpsRedirection();           // HTTPS enforcement
app.UseCors("AllowTrustedOrigins");  // CORS
app.UseRateLimiter();                // Rate limiting
app.UseAuthentication();             // Must come before Authorization
app.UseAuthorization();

// Security headers
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"]
        = "nosniff";
    context.Response.Headers["X-Frame-Options"]
        = "DENY";
    await next();
});

app.MapControllers()
    .RequireRateLimiting("fixed");

app.Run();
\`\`\`

### Middleware Order

| Order | Middleware | Purpose |
|---|---|---|
| 1 | \`UseHttpsRedirection\` | Redirect HTTP → HTTPS |
| 2 | \`UseCors\` | Handle CORS preflight requests |
| 3 | \`UseRateLimiter\` | Block excessive requests |
| 4 | \`UseAuthentication\` | Validate JWT tokens |
| 5 | \`UseAuthorization\` | Enforce [Authorize] attributes |
| 6 | Security headers | X-Content-Type-Options, X-Frame-Options |
| 7 | \`MapControllers\` | Route to controller actions |

### Service Lifetimes

| Lifetime | Used For | Example |
|---|---|---|
| **Transient** | Lightweight, stateless | Validators |
| **Scoped** | Per-request | Repositories, Services, DbContext |
| **Singleton** | Shared across all requests | NpgsqlDataSource, configuration |`,
      keyPoints: [
        'Middleware order matters — Authentication must come before Authorization.',
        'DbContext is Scoped; NpgsqlDataSource is Singleton.',
        'All services registered via DI with appropriate lifetimes.',
        'HTTPS redirection, CORS, and rate limiting are early in pipeline.',
        'Security headers applied via custom middleware.'
      ]
    },

    {
            title: 'Logging & Monitoring with Serilog',
            image: '/images/dotnet-api/logging.svg',
            content: `**Serilog** is a powerful structured logging library for .NET. It converts unstructured text logs into highly queryable event data, essential for observability and distributed tracing.

### Configuration & Setup

First, install the required NuGet packages:
\`\`\`powershell
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
\`\`\`

Then, configure the host in \`Program.cs\` to use Serilog fully configured by \`appsettings.json\`:

\`\`\`csharp
// Program.cs
builder.Host.UseSerilog((context, config) =>
    config.ReadFrom.Configuration(context.Configuration));
\`\`\`

### Structured Configuration (appsettings.json)

\`\`\`json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft.AspNetCore": "Warning",
        "System": "Warning"
      }
    },
    "WriteTo": [
      { "Name": "Console" },
      { 
        "Name": "File", 
        "Args": { 
          "path": "Logs/log-.txt", 
          "rollingInterval": "Day",
          "formatter": "Serilog.Formatting.Compact.CompactJsonFormatter, Serilog.Formatting.Compact"
        } 
      }
    ],
    "Enrich": ["FromLogContext", "WithMachineName", "WithThreadId"]
  }
}
\`\`\`

### Log Enrichment & Execution

Enriching logs adds contextual data (like UserID, RequestPath, or Correlation ID) to every log event.

\`\`\`csharp
// Example Controller/Service Usage
_logger.LogInformation("Processing order {OrderId} for user {UserId}", order.Id, user.Id);
\`\`\`
*Instead of just outputting text, this creates a structured event with \`OrderId\` and \`UserId\` properties that can be easily queried in Seq, Elasticsearch, or Datadog.*

### Common Log Sinks

| Sink | Use Case |
|---|---|
| **Console** | Fast, colorful feedback during local development. |
| **File (Rolling)** | Persistent local logs grouped by day/size for auditing. |
| **Seq / Elastic** | Centralized log aggregators for advanced querying and dashboards. |
`,
            keyPoints: [
                'Serilog provides structured, queryable logs rather than raw text.',
                'Centralize configuration in appsettings.json for easy environment overriding.',
                'Use log enrichers to automatically append request/user diagnostics.',
                'Filter out noisy standard Microsoft logs by setting them to Warning.',
                'Export to powerful sinks like Seq or Elasticsearch for system observability.'
            ]
        },

    {
      title: 'Environment Variables & Secrets',
      content: `All secrets must be provided via environment variables — **never committed to source control**.

### Required Variables

| Variable | Purpose | Example |
|---|---|---|
| \`ConnectionStrings__DefaultConnection\` | PostgreSQL connection string | \`Host=...;Password=...\` |
| \`Jwt__Key\` | JWT signing key (min 32 characters) | \`my-super-secret-key-at-least-32-chars\` |
| \`Jwt__Issuer\` | Token issuer claim | \`dot-net-core-rest-api\` |
| \`Jwt__Audience\` | Token audience claim | \`dot-net-core-rest-api-clients\` |
| \`Cors__AllowedOrigins__0\` | First allowed CORS origin | \`https://myapp.com\` |

> **Note:** ASP.NET Core maps \`__\` (double underscore) in environment variables to \`:\` in configuration keys.

### Local Development — User Secrets

\`\`\`powershell
# Initialize user secrets for the project
dotnet user-secrets init

# Set secrets (stored encrypted, not in source control)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" \\
    "Host=localhost;Port=5432;Database=mydb;Username=postgres;Password=secret"

dotnet user-secrets set "Jwt:Key" \\
    "my-local-dev-jwt-key-thats-at-least-32-characters-long"
\`\`\`

### Docker Environment Variables

\`\`\`powershell
docker run -d -p 8080:8080 \\
  -e "ConnectionStrings__DefaultConnection=Host=..." \\
  -e "Jwt__Key=production-jwt-key-at-least-32-chars" \\
  -e "Jwt__Issuer=dot-net-core-rest-api" \\
  -e "Jwt__Audience=dot-net-core-rest-api-clients" \\
  dot-net-core-rest-api
\`\`\`

### IIS — web.config Environment Variables

\`\`\`xml
<aspNetCore processPath="dotnet"
            arguments=".\\dot-net-core-rest-api.dll">
  <environmentVariables>
    <environmentVariable
        name="ConnectionStrings__DefaultConnection"
        value="Host=..." />
    <environmentVariable
        name="Jwt__Key"
        value="..." />
  </environmentVariables>
</aspNetCore>
\`\`\`

### Configuration Precedence (highest wins)

1. Environment variables
2. User secrets (Development only)
3. appsettings.{Environment}.json
4. appsettings.json`,
      keyPoints: [
        'Never commit passwords or secrets to source control.',
        'Use dotnet user-secrets for local development.',
        'ASP.NET Core maps __ in env vars to : in config keys.',
        'Docker: pass secrets via -e flags or Docker Compose environment.',
        'IIS: set environment variables in web.config or IIS Manager.'
      ]
    },

    {
      title: 'Unit Testing',
      image: '/images/dotnet-api/testing.svg',
      content: `Unit tests verify individual components in isolation using **xUnit** + **Moq**. Each layer (Controller, Service, Repository) is tested independently by mocking its dependencies.

### Test Structure

| Test File | Layer | Technique | Tests |
|---|---|---|---|
| \`CategoriesControllerTests.cs\` | Controller | Mocks \`ICategoryService\` | 8 |
| \`CategoryServiceTests.cs\` | Service | Mocks \`ICategoryRepository\` + \`ILogger\` | 9 |
| \`CategoryRepositoryTests.cs\` | Repository | EF Core InMemory database | 7 |
| \`SubCategoriesControllerTests.cs\` | Controller | Mocks \`ISubCategoryService\` | 10 |
| \`SubCategoryServiceTests.cs\` | Service | Mocks \`ISubCategoryRepository\` + \`ILogger\` | 12 |
| \`SubCategoryRepositoryTests.cs\` | Repository | Testcontainers (real PostgreSQL) | 10 |
| \`DtoTests.cs\` | DTOs | Record equality, deconstruct, ToString | 12 |

### Testing Strategy per Layer

| Layer | Technique | Purpose |
|---|---|---|
| **Controller** | Mock the service interface | Assert HTTP status codes (Ok, NotFound, CreatedAtAction, NoContent) |
| **Service** | Mock the repository interface | Assert DTO mapping, partial update logic, null handling |
| **Repository (EF)** | \`UseInMemoryDatabase\` | Fast, isolated tests without real database |
| **Repository (ADO.NET)** | **Testcontainers** | Spin up real PostgreSQL Docker container for accurate testing |

### Controller Unit Test Example

\`\`\`csharp
public class CategoriesControllerTests
{
    private readonly Mock<ICategoryService> _mockService = new();
    private readonly CategoriesController _controller;

    public CategoriesControllerTests()
    {
        _controller = new CategoriesController(
            _mockService.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOk_WithCategories()
    {
        // Arrange
        var categories = new List<CategoryDto>
        {
            new(1, DateTime.UtcNow, "ELEC", "Electronics"),
            new(2, DateTime.UtcNow, "FOOD", "Food")
        };
        _mockService.Setup(s => s.GetAllAsync(
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(categories);

        // Act
        var result = await _controller.GetAll(default);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returned =
            Assert.IsType<List<CategoryDto>>(okResult.Value);
        Assert.Equal(2, returned.Count);
    }

    [Fact]
    public async Task GetById_NonExisting_ReturnsNotFound()
    {
        _mockService.Setup(s => s.GetByIdAsync(
            999, It.IsAny<CancellationToken>()))
            .ReturnsAsync((CategoryDto?)null);

        var result = await _controller.GetById(999, default);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Create_ValidRequest_ReturnsCreated()
    {
        var request = new CreateCategoryRequest("ELEC", "Electronics");
        var dto = new CategoryDto(1, DateTime.UtcNow, "ELEC", "Electronics");
        _mockService.Setup(s => s.CreateAsync(
            request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(dto);

        var result = await _controller.Create(request, default);

        var created =
            Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(201, created.StatusCode);
    }
}
\`\`\`

### Service Unit Test Example

\`\`\`csharp
public class CategoryServiceTests
{
    private readonly Mock<ICategoryRepository> _mockRepo = new();
    private readonly Mock<ILogger<CategoryService>> _mockLogger = new();
    private readonly CategoryService _service;

    public CategoryServiceTests()
    {
        _service = new CategoryService(
            _mockRepo.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task CreateAsync_MapsRequestToEntity()
    {
        var request = new CreateCategoryRequest("ELEC", "Electronics");
        _mockRepo.Setup(r => r.CreateAsync(
            It.IsAny<Category>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category c, CancellationToken _) =>
            {
                c.Id = 1;
                return c;
            });

        var result =
            await _service.CreateAsync(request, default);

        Assert.Equal("ELEC", result.Code);
        Assert.Equal("Electronics", result.Name);
        _mockRepo.Verify(r => r.CreateAsync(
            It.IsAny<Category>(),
            It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        _mockRepo.Setup(r => r.GetByIdAsync(
            999, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        var result = await _service.GetByIdAsync(999, default);

        Assert.Null(result);
    }
}
\`\`\`

### Repository Unit Test Example (EF Core InMemory)

\`\`\`csharp
public class CategoryRepositoryTests
{
    private AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(
                databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateAsync_AddsCategory()
    {
        await using var context = CreateContext();
        var repo = new CategoryRepository(context);
        var category = new Category
        {
            Code = "ELEC",
            Name = "Electronics",
            CreatedAt = DateTime.UtcNow
        };

        var result =
            await repo.CreateAsync(category, default);

        Assert.True(result.Id > 0);
        Assert.Equal("ELEC", result.Code);
        Assert.Single(
            await context.Categories.ToListAsync());
    }
}
\`\`\``,
      keyPoints: [
        'Unit tests isolate each layer by mocking its dependencies.',
        'Controller tests: mock service, assert HTTP status codes.',
        'Service tests: mock repository, verify DTO mapping and business logic.',
        'Repository tests: EF Core InMemory for fast isolated tests.',
        'ADO.NET repository: Testcontainers with real PostgreSQL.',
        'Follow Arrange–Act–Assert pattern in every test.'
      ]
    },

    {
      title: 'Integration Testing',
      content: `Integration tests use \`WebApplicationFactory\` with **Testcontainers** to start the full ASP.NET Core application with a real PostgreSQL database in Docker.

### IntegrationTestFactory

\`\`\`csharp
public class IntegrationTestFactory
    : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _container =
        new PostgreSqlBuilder("postgres:16-alpine").Build();

    public async Task InitializeAsync()
    {
        await _container.StartAsync();
        // Create tables, generate JWT token for auth
    }

    protected override void ConfigureWebHost(
        IWebHostBuilder builder)
    {
        builder.UseSetting(
            "ConnectionStrings:DefaultConnection",
            _container.GetConnectionString());
        builder.UseSetting("Jwt:Key", TestJwtKey);
        // Replace DbContext and NpgsqlDataSource registrations
    }

    public async Task DisposeAsync()
        => await _container.DisposeAsync();
}
\`\`\`

### Full-Stack Integration Test

\`\`\`csharp
public class CategoriesIntegrationTests
    : IClassFixture<IntegrationTestFactory>
{
    private readonly HttpClient _client;

    public CategoriesIntegrationTests(
        IntegrationTestFactory factory)
    {
        _client = factory.CreateClient();
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue(
                "Bearer", factory.GenerateTestToken());
    }

    [Fact]
    public async Task CreateAndGet_Category_RoundTrip()
    {
        // Create
        var request = new CreateCategoryRequest(
            "INTEG", "Integration Test");
        var createResponse = await _client.PostAsJsonAsync(
            "/api/categories", request);
        Assert.Equal(HttpStatusCode.Created,
            createResponse.StatusCode);

        var created = await createResponse
            .Content.ReadFromJsonAsync<CategoryDto>();

        // Get by ID
        var getResponse = await _client.GetAsync(
            $"/api/categories/{created!.Id}");
        Assert.Equal(HttpStatusCode.OK,
            getResponse.StatusCode);

        var fetched = await getResponse
            .Content.ReadFromJsonAsync<CategoryDto>();
        Assert.Equal("INTEG", fetched!.Code);
    }

    [Fact]
    public async Task Delete_NonExisting_Returns404()
    {
        var response = await _client.DeleteAsync(
            "/api/categories/99999");
        Assert.Equal(HttpStatusCode.NotFound,
            response.StatusCode);
    }
}
\`\`\`

### Running Tests with Filters

\`\`\`powershell
cd Tests

# Run all tests
dotnet test

# Run only unit tests (exclude integration)
dotnet test --filter \\
    "FullyQualifiedName!~Integration&FullyQualifiedName!~SubCategoryRepository"

# Run a specific test class
dotnet test --filter "CategoryServiceTests"

# Run a specific test method
dotnet test --filter "GetById_NonExistingId_ReturnsNotFound"

# Run only integration tests (requires Docker)
dotnet test --filter "Integration"

# Run with verbose output
dotnet test --verbosity detailed
\`\`\``,
      keyPoints: [
        'WebApplicationFactory starts the full ASP.NET Core app for testing.',
        'Testcontainers spins up real PostgreSQL in Docker — accurate testing.',
        'JWT token is generated in the test factory for authenticated endpoints.',
        'Use --filter to run specific test classes, methods, or categories.',
        'Integration tests verify end-to-end flow: HTTP → Controller → Service → DB.'
      ]
    },

    {
      title: 'Code Coverage Report',
      content: `Generate code coverage reports to measure test completeness and enforce quality in CI.

### Generate Coverage Report

\`\`\`powershell
cd Tests

# 1. Run tests with coverage collection
dotnet test /p:CollectCoverage=true \\
  /p:CoverletOutputFormat=cobertura \\
  /p:CoverletOutput=./coverage/ \\
  /p:Include="[dot-net-core-rest-api]*"

# 2. Install report generator (one-time)
dotnet tool install -g dotnet-reportgenerator-globaltool

# 3. Generate HTML report
reportgenerator \\
  -reports:./coverage/coverage.cobertura.xml \\
  -targetdir:./coverage/report \\
  -reporttypes:Html

# 4. Open the report
start ./coverage/report/index.html    # Windows
open ./coverage/report/index.html     # macOS
\`\`\`

### Coverage Exclusions

Configure in the test \`.csproj\` to exclude non-testable code:

\`\`\`xml
<PropertyGroup>
  <ExcludeByAttribute>
    GeneratedCodeAttribute,CompilerGeneratedAttribute
  </ExcludeByAttribute>
  <ExcludeByFile>**/Program.cs</ExcludeByFile>
</PropertyGroup>
\`\`\`

- \`Program.cs\` — entry point / configuration, not unit-testable
- Generated code — auto-generated by EF Core, Swagger, etc.

### CI Coverage Enforcement

\`\`\`yaml
# GitHub Actions — fail if coverage drops
- name: Run tests with coverage
  run: |
    dotnet test /p:CollectCoverage=true \\
      /p:CoverletOutputFormat=cobertura \\
      /p:CoverletOutput=./coverage/ \\
      /p:Threshold=80
\`\`\`

The \`/p:Threshold=80\` flag fails the build if line coverage drops below 80%.`,
      keyPoints: [
        'Use coverlet for code coverage with cobertura output format.',
        'reportgenerator creates browsable HTML coverage reports.',
        'Exclude Program.cs and generated code from coverage metrics.',
        '/p:Threshold enforces minimum coverage percentage in CI.',
        'Aim for 100% coverage on Services, Repositories, and Controllers.'
      ]
    },

    {
            title: 'Load Testing Your API',
            image: '/images/dotnet-api/load-testing.svg',
            content: `**Load testing** is critical for validating that your API can sustain real-world traffic volumes without crashing or degrading response times. [k6](https://k6.io/) by Grafana is a modern, developer-centric tool for scriptable performance tests.

### Scenarios to Test

- **Spike Testing**: Evaluating behavior during a sudden, massive surge in traffic.
- **Soak Testing**: Ensuring stability and hunting for memory leaks over a long timeframe.
- **Stress Testing**: Finding the absolute breaking point and maximum RPS capability.

### k6 Example Script (script.js)

Load tests are written in JavaScript, making them easy to maintain and extend:

\`\`\`javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

// Define the test characteristics
export const options = {
    stages: [
        { duration: '30s', target: 50 },  // Ramp up to 50 virtual users
        { duration: '1m', target: 50 },   // Sustain 50 users
        { duration: '30s', target: 0 },   // Scale down
    ],
};

// Execution logic per Virtual User
export default function () {
    const res = http.get('http://localhost:8080/api/categories');
    
    // Validate assertions
    check(res, { 
        'status is 200': (r) => r.status === 200,
        'transaction is under 200ms': (r) => r.timings.duration < 200
    });
    
    sleep(1); // Wait 1 second before firing the next request
}
\`\`\`

### Execution and CI Integration

\`\`\`powershell
# Run the script locally
k6 run script.js

# Output results to a JSON file for CI processing
k6 run --out json=results.json script.js
\`\`\`

You should integrate k6 into GitHub Actions or Azure Pipelines and define **Pass/Fail Thresholds** (e.g. failing the build if the 95th percentile latency exceeds 500ms or error rate > 1%).

### Testing Best Practices

| Practice | Explanation |
|---|---|
| **Test Realistic Flows** | Include token generation logic to test protected endpoints. |
| **Observe Backend Metrics** | Monitor CPU/Memory & Database connections during tests. |
| **Never Load-Test Prod** | Perform heavy destructive tests entirely in Staging/UAT isolated environments. |
`,
            keyPoints: [
                'Use k6 for fast, developer-friendly and scriptable load testing.',
                'Utilize stages to simulate ramps up/down and sustained traffic loads.',
                'Implement assertions to track failure rates and specific request latency bounds.',
                'Integrate directly into CI/CD to prevent regressions on deployment.',
                'Monitor database and infrastructure metrics heavily while the test executes.'
            ]
        },

    {
      title: 'API Verification — Swagger & Postman',
      content: `### OpenAPI (Swagger)

The API exposes an OpenAPI document at \`/openapi/v1.json\` in development mode.

\`\`\`powershell
# Start the API
dotnet run

# Fetch the OpenAPI spec
curl http://localhost:5101/openapi/v1.json -o openapi.json
\`\`\`

To browse the API interactively with Swagger UI:

\`\`\`powershell
dotnet add package Swashbuckle.AspNetCore
\`\`\`

\`\`\`csharp
// Program.cs
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// After app.Build():
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
\`\`\`

Browse to \`http://localhost:5101/swagger\` to test endpoints interactively.

### Postman Verification

1. **Import**: File → Import → URL → \`http://localhost:5101/openapi/v1.json\`
2. Postman auto-generates a collection with all endpoints
3. Set up environment variable \`{{baseUrl}}\` = \`http://localhost:5101\`
4. For protected endpoints, add \`Authorization: Bearer {{token}}\` in collection headers

### VS Code REST Client

Create an \`.http\` file in the project root:

\`\`\`http
### Get all categories (public)
GET http://localhost:5101/api/categories

### Create category (requires JWT)
POST http://localhost:5101/api/categories
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "code": "ELEC",
  "name": "Electronics"
}

### Get by ID
GET http://localhost:5101/api/categories/1

### Delete category (requires JWT)
DELETE http://localhost:5101/api/categories/1
Authorization: Bearer {{token}}
\`\`\`

### curl Verification

\`\`\`powershell
# Public — no auth needed
curl http://localhost:5101/api/categories
curl http://localhost:5101/api/subcategories/by-category/1

# Protected — requires JWT
curl -X POST http://localhost:5101/api/categories \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{"code": "ELEC", "name": "Electronics"}'
\`\`\``,
      keyPoints: [
        'OpenAPI spec auto-generated at /openapi/v1.json.',
        'Swagger UI provides interactive API testing in browser.',
        'Import OpenAPI spec into Postman for collection generation.',
        'VS Code REST Client (.http files) for quick endpoint testing.',
        'Use curl for command-line API verification.'
      ]
    },

    {
      title: 'API Specification for Frontend Team',
      content: `Share a machine-readable API specification with the frontend team to generate typed clients and ensure contract alignment.

### Generate OpenAPI JSON

\`\`\`powershell
# Start the API and export the spec
dotnet run &
curl http://localhost:5101/openapi/v1.json -o docs/openapi.json
\`\`\`

### Generate TypeScript Client SDK

\`\`\`powershell
# Using openapi-generator-cli (npm)
npx @openapitools/openapi-generator-cli generate \\
  -i http://localhost:5101/openapi/v1.json \\
  -g typescript-axios \\
  -o ./frontend-sdk

# Using NSwag (.NET tool)
dotnet tool install -g NSwag.ConsoleCore
nswag openapi2tsclient \\
  /input:http://localhost:5101/openapi/v1.json \\
  /output:api-client.ts
\`\`\`

### What to Share with Frontend Team

| Artifact | Description |
|---|---|
| **\`openapi.json\`** | Machine-readable API spec (JSON) |
| **\`api-client.ts\`** | Generated TypeScript SDK with typed request/response models |
| **Postman Collection** | Exported from Postman (File → Export → Collection v2.1) |

### Generated Client Usage (TypeScript)

\`\`\`typescript
// Auto-generated from OpenAPI spec
import { CategoriesApi, Configuration } from './frontend-sdk';

const api = new CategoriesApi(new Configuration({
  basePath: 'http://localhost:5101',
  accessToken: 'YOUR_JWT_TOKEN',
}));

// Fully typed — IDE autocomplete works
const categories = await api.getAll();
const created = await api.create({
  code: 'ELEC',
  name: 'Electronics',
});
\`\`\`

This ensures the frontend team has **typed API contracts** that stay in sync with the backend.`,
      keyPoints: [
        'Export OpenAPI spec as openapi.json for machine-readable contract.',
        'Use openapi-generator or NSwag to generate TypeScript client SDK.',
        'Generated client provides typed request/response models.',
        'Share openapi.json + generated SDK + Postman collection with frontend team.',
        'Auto-generated SDK ensures frontend stays in sync with API changes.'
      ]
    },

    {
            title: 'API Gateway with YARP',
            image: '/images/dotnet-api/yarp-gateway.svg',
            content: `**YARP (Yet Another Reverse Proxy)** is a highly customizable, high-performance API Gateway built entirely in .NET by Microsoft. It acts as the single point of entry, routing requests to various backend microservices.

### Key Capabilities

- **Configuration-Driven Routing**: Define routes, clusters, and destinations in \`appsettings.json\`.
- **Cross-Cutting Concerns**: Offloads JWT validation, rate limiting, and CORS from backend microservices.
- **Load Balancing**: Supports various algorithms (RoundRobin, LeastRequests, Random).
- **Active Health Checks**: Automatically stops routing traffic to degraded nodes.

### Essential YARP Setup

First, install the Nuget package: \`dotnet add package Yarp.ReverseProxy\`.

\`\`\`csharp
// Program.cs
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// Add centralized Gateway Middleware
builder.Services.AddAuthentication("Bearer").AddJwtBearer(/* logic */);
builder.Services.AddRateLimiter(/* logic */);
builder.Services.AddCors(/* logic */);

var app = builder.Build();

app.UseCors("Default");
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();
app.UseSerilogRequestLogging();

app.MapReverseProxy(); // Starts YARP routing execution
app.Run();
\`\`\`

### Configuration Structure (appsettings.json)

\`\`\`json
{
  "ReverseProxy": {
    "Routes": {
      "catalog-route": {
        "ClusterId": "catalog-cluster",
        "Match": { "Path": "/api/catalog/{**catch-all}" }
      }
    },
    "Clusters": {
      "catalog-cluster": {
        "Destinations": {
          "node1": { "Address": "http://catalog-service:8080/" },
          "node2": { "Address": "http://catalog-service:8081/" }
        }
      }
    }
  }
}
\`\`\`

### Relevant Resources

| Resource | Link |
|---|---|
| **YARP Official Documentation** | [Getting Started](https://microsoft.github.io/reverse-proxy/articles/getting-started.html) |
| **YARP GitHub Repository** | [github.com/microsoft/reverse-proxy](https://github.com/microsoft/reverse-proxy) |
`,
            keyPoints: [
                'YARP is a highly performant reverse proxy running entirely natively within .NET.',
                'Offload cross-cutting concerns (Auth, CORS, Rate Limiting) to the Gateway.',
                'Use appsettings.json to rapidly iterate over routes and downstream clusters.',
                'Supports advanced load balancing algorithms and robust active health checks.',
                'Reduces code duplication across a heavy microservices ecosystem.'
            ]
        },

    {
      title: 'Deployment — IIS',
      content: `Deploy to **Internet Information Services (IIS)** on Windows Server with the ASP.NET Core Hosting Bundle.

### Prerequisites

- Windows Server with IIS installed
- [.NET 10 Hosting Bundle](https://dotnet.microsoft.com/en-us/download/dotnet/10.0) installed
- IIS ASP.NET Core Module (ANCM) enabled

### Steps

\`\`\`powershell
# 1. Publish the application
dotnet publish -c Release -o ./publish
\`\`\`

2. **Create IIS Site:**
   - Open IIS Manager → Add Website
   - Physical Path: point to the \`publish\` folder
   - Binding: set port (e.g., 80 or 443 with SSL certificate)

3. **Configure Application Pool:**
   - Set .NET CLR Version to **No Managed Code** (ASP.NET Core runs out-of-process)
   - Set Start Mode to **AlwaysRunning** for production

4. **Set Environment Variables** in IIS Manager → Site → Configuration Editor

5. **Verify:**

\`\`\`powershell
curl https://your-server/api/categories
\`\`\`

### web.config (auto-generated by dotnet publish)

\`\`\`xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="aspNetCore"
           path="*" verb="*"
           modules="AspNetCoreModuleV2" />
    </handlers>
    <aspNetCore processPath="dotnet"
                arguments=".\\dot-net-core-rest-api.dll"
                stdoutLogEnabled="false"
                hostingModel="InProcess">
      <environmentVariables>
        <environmentVariable
            name="ASPNETCORE_ENVIRONMENT"
            value="Production" />
      </environmentVariables>
    </aspNetCore>
  </system.webServer>
</configuration>
\`\`\`

### IIS Checklist

| Step | Action |
|---|---|
| Install Hosting Bundle | .NET 10 Hosting Bundle includes ANCM |
| Application Pool | .NET CLR = No Managed Code |
| SSL Certificate | Bind HTTPS on port 443 |
| Environment Variables | Set connection string, JWT key via IIS Manager |
| Logging | Enable stdout logging for troubleshooting |`,
      keyPoints: [
        'Install .NET 10 Hosting Bundle on the Windows Server.',
        'Application Pool: set .NET CLR Version to No Managed Code.',
        'dotnet publish -c Release creates deployment-ready output.',
        'Set environment variables in IIS Manager or web.config.',
        'Use HTTPS binding with SSL certificate for production.'
      ]
    },

    {
      title: 'Deployment — Docker',
      content: `Use **multi-stage Docker builds** for minimal, secure production images.

### Dockerfile

\`\`\`dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["dot-net-core-rest-api.csproj", "."]
RUN dotnet restore "./dot-net-core-rest-api.csproj"
COPY . .
RUN dotnet build "./dot-net-core-rest-api.csproj" \\
    -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./dot-net-core-rest-api.csproj" \\
    -c $BUILD_CONFIGURATION -o /app/publish \\
    /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "dot-net-core-rest-api.dll"]
\`\`\`

### Build & Run

\`\`\`powershell
# Build the image
docker build -t dot-net-core-rest-api .

# Run with environment variables
docker run -d -p 8080:8080 \\
  -e "ConnectionStrings__DefaultConnection=Host=host.docker.internal;Port=5432;Database=mydb;Username=postgres;Password=secret" \\
  -e "Jwt__Key=production-jwt-signing-key-at-least-32-chars" \\
  -e "Jwt__Issuer=dot-net-core-rest-api" \\
  -e "Jwt__Audience=dot-net-core-rest-api-clients" \\
  --name api \\
  dot-net-core-rest-api

# Verify
curl http://localhost:8080/api/categories
\`\`\`

### Docker Compose (with PostgreSQL)

\`\`\`yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      ConnectionStrings__DefaultConnection: >-
        Host=db;Port=5432;Database=appdb;
        Username=postgres;Password=postgres
      Jwt__Key: "production-jwt-key-at-least-32-chars"
      Jwt__Issuer: "dot-net-core-rest-api"
      Jwt__Audience: "dot-net-core-rest-api-clients"
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: appdb
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
\`\`\`

\`\`\`powershell
docker compose up -d
\`\`\`

### Multi-Stage Build Benefits

| Stage | Image | Size | Purpose |
|---|---|---|---|
| build | \`sdk:10.0\` | ~800MB | Compile and restore packages |
| publish | \`sdk:10.0\` | ~800MB | Create optimized publish output |
| final | \`aspnet:10.0\` | ~200MB | Runtime-only production image |`,
      keyPoints: [
        'Multi-stage Docker builds keep production images small (~200MB).',
        'Pass secrets via environment variables, not build args.',
        'Docker Compose orchestrates API + PostgreSQL together.',
        'Use host.docker.internal to connect to host databases.',
        'USER $APP_UID runs the container as non-root for security.'
      ]
    },

    {
      title: 'Design Patterns Used',
      content: `### Patterns in This Project

| Pattern | Where | Purpose |
|---|---|---|
| **Repository Pattern** | \`ICategoryRepository\` / \`CategoryRepository\`, \`ISubCategoryRepository\` / \`SubCategoryRepository\` | Abstracts data access; allows swapping EF Core ↔ ADO.NET without changing upper layers |
| **Service Layer Pattern** | \`ICategoryService\` / \`CategoryService\`, \`ISubCategoryService\` / \`SubCategoryService\` | Contains business logic; maps between Entities and DTOs |
| **Dependency Injection** | Constructor injection in all layers via \`Program.cs\` registrations | Loose coupling; testability via mocking interfaces |
| **DTO Pattern** | \`CategoryDto\`, \`CreateCategoryRequest\`, \`UpdateCategoryRequest\` | Separates API contract from internal entities; prevents over-posting |
| **Interface Segregation** | All layers depend on interfaces (\`ICategoryService\`, \`ICategoryRepository\`) | Enables unit testing with mocks; decouples implementation details |
| **Fluent API Configuration** | \`CategoryConfiguration\` (\`IEntityTypeConfiguration<T>\`) | Maps C# PascalCase to PostgreSQL snake_case; defines constraints |
| **Factory Pattern** | \`IntegrationTestFactory\` (\`WebApplicationFactory<Program>\`) | Spins up the full app + database for integration testing |
| **Primary Constructor** | All services, repositories, and controllers | Reduces boilerplate; cleaner constructor injection (C# 12+) |

### Repository Pattern Deep Dive

\`\`\`csharp
// Interface (abstraction)
public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync(CancellationToken ct);
    Task<Category?> GetByIdAsync(int id, CancellationToken ct);
    Task<Category> CreateAsync(Category cat, CancellationToken ct);
    Task UpdateAsync(Category category, CancellationToken ct);
    Task<bool> DeleteAsync(int id, CancellationToken ct);
}

// EF Core implementation
public class CategoryRepository(AppDbContext db)
    : ICategoryRepository { /* uses LINQ + DbContext */ }

// ADO.NET implementation (same interface)
public class SubCategoryRepository(NpgsqlDataSource ds)
    : ISubCategoryRepository { /* uses raw SQL + NpgsqlCommand */ }

// Swap implementations without changing upper layers:
builder.Services.AddScoped<ICategoryRepository,
    CategoryRepository>();     // EF Core
builder.Services.AddScoped<ISubCategoryRepository,
    SubCategoryRepository>();  // ADO.NET
\`\`\`

### Service Layer Pattern

\`\`\`csharp
// Service depends on repository INTERFACE, not implementation
public class CategoryService(
    ICategoryRepository repository,
    ILogger<CategoryService> logger) : ICategoryService
{
    // Maps Entity → DTO (never expose entities to controllers)
    private static CategoryDto ToDto(Category c)
        => new(c.Id, c.CreatedAt, c.Code, c.Name);

    // Maps DTO → Entity (business logic + mapping)
    public async Task<CategoryDto> CreateAsync(
        CreateCategoryRequest request, CancellationToken ct)
    {
        var entity = new Category
        {
            Code = request.Code,
            Name = request.Name,
            CreatedAt = DateTime.UtcNow
        };
        await repository.CreateAsync(entity, ct);
        return ToDto(entity);
    }
}
\`\`\`

### SOLID Principles Applied

| Principle | Application |
|---|---|
| **Single Responsibility** | Controller handles HTTP; Service handles logic; Repository handles data |
| **Open/Closed** | New repositories implement existing interfaces without modifying consumers |
| **Liskov Substitution** | \`FakeProductRepository\` can replace \`CategoryRepository\` in tests |
| **Interface Segregation** | \`ICategoryRepository\` and \`ISubCategoryRepository\` are separate, focused |
| **Dependency Inversion** | Controllers depend on \`ICategoryService\`, not \`CategoryService\` |`,
      keyPoints: [
        'Repository Pattern abstracts data access behind interfaces.',
        'Service Layer contains business logic and DTO mapping.',
        'DI enables loose coupling — swap implementations without changing consumers.',
        'DTO Pattern separates API contract from internal entities.',
        'Factory Pattern (WebApplicationFactory) enables full-stack integration testing.',
        'SOLID principles applied across all layers.'
      ]
    },

    {
      title: 'Best Practices — Do\'s & Don\'ts',
      content: `### ✅ Do's

| # | Practice | Reason |
|---|---|---|
| 1 | **Use DTOs for all API responses** | Prevents exposing internal entities and over-posting |
| 2 | **Use \`[Required]\`, \`[StringLength]\`, \`[Range]\` on DTOs** | Input validation at API boundary |
| 3 | **Use parameterized queries in ADO.NET** | Prevents SQL injection |
| 4 | **Use \`AsNoTracking()\` for read-only queries** | Better EF Core performance |
| 5 | **Use primary constructors (C# 12)** | Cleaner DI, less boilerplate |
| 6 | **Store secrets in environment variables** | Never commit to source control |
| 7 | **Use HTTPS + HSTS in production** | Encrypt all traffic |
| 8 | **Add security headers to every response** | X-Content-Type-Options, X-Frame-Options |
| 9 | **Rate limit per IP address** | Block brute-force and abuse |
| 10 | **Log structured data, not sensitive data** | Never log tokens, passwords, or PII |
| 11 | **Use \`CancellationToken\` on all async methods** | Enables request cancellation |
| 12 | **Test every layer independently** | Controller, Service, Repository each have their own tests |

### ❌ Don'ts

| # | Anti-pattern | Correct Approach |
|---|---|---|
| 1 | **Don't expose database entities in API** | Use DTOs for all responses |
| 2 | **Don't concatenate user input into SQL** | Use \`Parameters.AddWithValue()\` |
| 3 | **Don't commit passwords to source control** | Use \`dotnet user-secrets\` or env vars |
| 4 | **Don't return unbounded collections** | Always paginate with \`page\` and \`pageSize\` |
| 5 | **Don't use \`AllowAnyOrigin()\` in production** | Whitelist specific trusted origins |
| 6 | **Don't log tokens or passwords** | Log request IDs, user IDs, status codes |
| 7 | **Don't show stack traces in production** | Use \`app.UseExceptionHandler()\` |
| 8 | **Don't use \`.Result\` or \`.Wait()\` on tasks** | Causes deadlocks — use \`async/await\` |
| 9 | **Don't skip input validation** | All DTOs need validation attributes |
| 10 | **Don't leave default endpoints** | Remove WeatherForecast and unused controllers |

### Run & Build Commands

\`\`\`powershell
# Development
dotnet run                             # Run in development
dotnet watch run                       # Run with hot reload

# Testing
dotnet test                            # Run all tests
dotnet test --filter "CategoryServiceTests"  # Specific class
dotnet test --filter "Integration"     # Integration only

# Coverage
dotnet test /p:CollectCoverage=true \\
  /p:CoverletOutputFormat=cobertura
reportgenerator -reports:coverage.xml \\
  -targetdir:report -reporttypes:Html

# Build & Publish
dotnet publish -c Release -o ./publish
docker build -t my-api .
docker compose up -d
\`\`\`

### Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| **Connection refused** | Database not running | Start PostgreSQL or Docker container |
| **401 Unauthorized** | Missing/expired JWT | Generate a new token with valid claims |
| **400 Bad Request** | Validation failed | Check DTO validation attributes |
| **Database migration error** | Table doesn't exist | Run SQL migration scripts |
| **Docker build fails** | Missing .csproj in COPY | Ensure Dockerfile path matches project structure |`,
      keyPoints: [
        'Never expose database entities — use DTOs for all API responses.',
        'Always use parameterized queries — never concatenate user input into SQL.',
        'Store all secrets in environment variables, never in source control.',
        'Rate limit, validate inputs, and add security headers to every response.',
        'Test every layer independently with proper mocking.',
        'Use async/await throughout — never .Result or .Wait().'
      ]
    }
  ]
};
