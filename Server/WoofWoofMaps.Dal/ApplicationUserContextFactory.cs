using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace WoofWoofMaps.Dal;

internal class ApplicationUserContextFactory : IDesignTimeDbContextFactory<ApplicationUserContext>
{
    public ApplicationUserContext CreateDbContext(string[] args)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var builder = new DbContextOptionsBuilder<ApplicationUserContext>();
        var connectionString = configuration.GetConnectionString("WoofWoofMaps");

        builder.UseNpgsql(connectionString);

        return new ApplicationUserContext(builder.Options);
    }
}