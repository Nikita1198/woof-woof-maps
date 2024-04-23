using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace WoofWoofMaps.Dal;

internal class GeoTrackingContextFactory : IDesignTimeDbContextFactory<GeoTrackingContext>
{
    public GeoTrackingContext CreateDbContext(string[] args)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var builder = new DbContextOptionsBuilder<GeoTrackingContext>();
        var connectionString = configuration.GetConnectionString("WoofWoofMaps");

        builder.UseNpgsql(connectionString);

        return new GeoTrackingContext(builder.Options);
    }
}