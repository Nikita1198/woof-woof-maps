using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using WoofWoofMaps.Dal.Entities.Profiles;

namespace WoofWoofMaps.Dal.Entities.Location;

public class GeoRoute
{
    public long Id { get; set; }

    [Required(ErrorMessage = "Please enter a name")]
    public string? Name { get; set; }
    [JsonIgnore]
    public List<GeoRoutePoint> GeoRoutePoints { get; set; } = new List<GeoRoutePoint>();
    [JsonIgnore]
    public List<WalkerRoute> WalkerRoutes { get; set; } = new List<WalkerRoute>();
}