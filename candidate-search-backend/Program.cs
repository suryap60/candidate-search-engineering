using System.Text;
using CandidateSearch.Api.Configuration;
using CandidateSearch.Api.Data;
using CandidateSearch.Api.Middleware;
using CandidateSearch.Api.Services;
using CandidateSearch.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));


// JWT settings
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt")
);

// JWT authentication
var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>()
    ?? throw new InvalidOperationException(
        "JWT configuration is missing."
    );

var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,

            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),

            ValidateLifetime = true,

            ClockSkew = TimeSpan.Zero
        };
    });

// Authorization
builder.Services.AddAuthorization();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ICandidateService, CandidateService>();

// Swagger
// Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "Bearer",
        new Microsoft.OpenApi.OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = Microsoft.OpenApi.SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = Microsoft.OpenApi.ParameterLocation.Header,
            Description = "Enter JWT token. Example: Bearer {token}"
        }
    );

    options.AddSecurityRequirement(document =>
        new Microsoft.OpenApi.OpenApiSecurityRequirement
        {
            {
                new Microsoft.OpenApi.OpenApiSecuritySchemeReference(
                    "Bearer",
                    document
                ),
                new List<string>()
            }
        }
    );
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbSeeder.SeedAsync(db);
}

// Global exception handling
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors("Frontend");


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();