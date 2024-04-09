using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WoofWoofMaps.Dal.Entities.User;
using WoofWoofMaps.Dal.Repositories;
using WoofWoofMaps.Dal.Repositories.Interfaces;

namespace WoofWoofMaps.Dal;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDalLocationInfrastructure(
        this IServiceCollection services)
    {
        return services.AddDbContext<GeoTrackingContext>(options =>
        {
            options.UseNpgsql(GetPosgresConnectionString());
        });
    }

    public static IServiceCollection AddDalUserInfrastructure(
    this IServiceCollection services)
    {
         services.AddDbContext<ApplicationUserContext>(options =>
        {
            options.UseNpgsql(GetPosgresConnectionString());
        });

        services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.SignIn.RequireConfirmedEmail = false;
            options.SignIn.RequireConfirmedPhoneNumber = false;
        })
        .AddEntityFrameworkStores<ApplicationUserContext>();
        return services;
    }

    public static string GetPosgresConnectionString()
    {
        var builder = new ConfigurationBuilder()
                            .SetBasePath(Directory.GetCurrentDirectory())
                            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

        IConfigurationRoot configuration = builder.Build();

        return configuration["ConnectionStrings:WoofWoofMaps"]
            ?? throw new Exception("Missing сonnection string in configuration for project WoofWoofMaps");

    }
    public static IServiceCollection AddDalRepositories(
        this IServiceCollection services)
    {
        services.AddScoped<IGeoPointRepository, EFGeoPointRepository>();
        services.AddScoped<IGeoRouteRepository, EFGeoRouteRepository>();

        return services;
    }
}