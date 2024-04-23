using WoofWoofMaps.Dal.Entities.Location;

namespace WoofWoofMaps.Dal.Entities.Profiles;

public class WalkerRoute
{
    public long WalkerProfileId { get; set; }
    public WalkerProfile WalkerProfile { get; set; }

    public long GeoRouteId { get; set; }
    public GeoRoute GeoRoute { get; set; }
}