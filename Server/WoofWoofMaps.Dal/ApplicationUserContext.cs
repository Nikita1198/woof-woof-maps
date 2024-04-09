using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WoofWoofMaps.Dal.Entities.Profiles;
using WoofWoofMaps.Dal.Entities.User;

namespace WoofWoofMaps.Dal;

public class ApplicationUserContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationUserContext(DbContextOptions<ApplicationUserContext> options) : base(options)
    {

    }

    public DbSet<WalkerProfile> WalkerProfiles { get; set; }
    public DbSet<PetOwnerProfile> PetOwnerProfiles { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Уникальные индексы, связи и другие настройки модели

        // Настройка связей между ApplicationUser и профилями
        builder.Entity<ApplicationUser>()
            .HasOne(a => a.WalkerProfile)
            .WithOne(w => w.User)
            .HasForeignKey<WalkerProfile>(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ApplicationUser>()
            .HasOne(a => a.OwnerProfile)
            .WithOne(o => o.User)
            .HasForeignKey<PetOwnerProfile>(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Если вам нужно настроить каскадное удаление или другие аспекты связей, делайте это здесь
    }
}