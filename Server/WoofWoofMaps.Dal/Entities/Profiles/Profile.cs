using WoofWoofMaps.Dal.Entities.User;

namespace WoofWoofMaps.Dal.Entities.Profiles;

public class Profile
{
    public required long Id { get; set; }
    public required string UserId { get; set; }
    public virtual required ApplicationUser User { get; set; }
}