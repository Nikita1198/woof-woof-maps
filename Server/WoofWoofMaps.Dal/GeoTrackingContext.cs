using Microsoft.EntityFrameworkCore;
using WoofWoofMaps.Dal.Entities;

namespace WoofWoofMaps.Dal;

public class GeoTrackingContext : DbContext
{
    public GeoTrackingContext(DbContextOptions<GeoTrackingContext> options) : base(options)
    {

    }

    public DbSet<GeoRoute> GeoRoutes => Set<GeoRoute>();
    public DbSet<GeoPoint> GeoPoints => Set<GeoPoint>();
    public DbSet<GeoRoutePoint> GeoRoutePoints => Set<GeoRoutePoint>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<GeoRoutePoint>(entity =>
        {
            entity.HasKey(grp => new { grp.GeoPointId, grp.GeoRouteId, grp.Timestamp });
            entity.HasOne(grp => grp.GeoPoint)
                  .WithMany(gp => gp.GeoRoutePoints)
                  .HasForeignKey(grp => grp.GeoPointId);
            entity.HasOne(grp => grp.GeoRoute)
                  .WithMany(gr => gr.GeoRoutePoints)
                  .HasForeignKey(grp => grp.GeoRouteId);
        });
    }
}