using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WoofWoofMaps.Dal.Repositories;
using WoofWoofMaps.Dal.Repositories.Interfaces;
using WoofWoofMaps.Dal.Settings;

namespace WoofWoofMaps.Dal;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDalInfrastructure(
        this IServiceCollection services)
    {
        services.AddDbContext<GeoTrackingContext>(options =>
        {
            options.UseNpgsql(GetPosgresConnectionString());
        });

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