using Microsoft.EntityFrameworkCore;

namespace CandidateSearch.Api.Data;

public static class DatabaseExtensions
{
    public static IServiceCollection AddDatabase(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var useInMemory = configuration.GetValue<bool>(
            "Database:UseInMemory"
        );

        if (useInMemory)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("CandidateSearchDb"));
        }
        else
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString(
                        "DefaultConnection"
                    )
                ));
        }

        return services;
    }
}