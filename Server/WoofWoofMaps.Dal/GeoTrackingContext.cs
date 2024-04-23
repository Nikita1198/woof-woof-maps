using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WoofWoofMaps.Dal.Entities.Location;
using WoofWoofMaps.Dal.Entities.Profiles;
using WoofWoofMaps.Dal.Entities.User;

namespace WoofWoofMaps.Dal;

public class GeoTrackingContext : IdentityDbContext<ApplicationUser>
{
    public GeoTrackingContext(DbContextOptions<GeoTrackingContext> options) 
        : base(options)
    {

    }

    public DbSet<GeoRoute> GeoRoutes => Set<GeoRoute>();
    public DbSet<GeoPoint> GeoPoints => Set<GeoPoint>();
    public DbSet<GeoRoutePoint> GeoRoutePoints => Set<GeoRoutePoint>();

    public DbSet<PetOwnerProfile> PetOwnerProfiles => Set<PetOwnerProfile>();
    public DbSet<WalkerProfile> WalkerProfiles => Set<WalkerProfile>();
    public DbSet<WalkerRoute> WalkerRoutes => Set<WalkerRoute>();

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

        modelBuilder.Entity<ApplicationUser>(entity => 
        {
            entity.HasOne(a => a.WalkerProfile)
                  .WithOne(w => w.User)
                  .HasForeignKey<WalkerProfile>(w => w.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(a => a.OwnerProfile)
                  .WithOne(o => o.User)
                  .HasForeignKey<PetOwnerProfile>(o => o.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<WalkerRoute>(entity =>
        {
            entity.HasKey(wr => new { wr.WalkerProfileId, wr.GeoRouteId });
            entity.HasOne(wr => wr.WalkerProfile)
                  .WithMany(wp => wp.WalkerRoutes)
                  .HasForeignKey(wr => wr.WalkerProfileId);
            entity.HasOne(wr => wr.GeoRoute)
                  .WithMany(gr => gr.WalkerRoutes)
                  .HasForeignKey(wr => wr.GeoRouteId);
        });
    }
}