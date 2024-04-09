using Microsoft.AspNetCore.Identity;
using WoofWoofMaps.Dal.Entities.Profiles;

namespace WoofWoofMaps.Dal.Entities.User;

public class ApplicationUser : IdentityUser
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? City { get; set; }
    public virtual WalkerProfile? WalkerProfile { get; set; }
    public virtual PetOwnerProfile? OwnerProfile { get; set; }
}