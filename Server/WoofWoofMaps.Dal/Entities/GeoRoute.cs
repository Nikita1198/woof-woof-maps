using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WoofWoofMaps.Dal.Entities;

public class GeoRoute
{
    public long Id { get; set; }


    [Required(ErrorMessage = "Please enter a name")]
    public string? Name { get; set; }
    [JsonIgnore]
    public List<GeoRoutePoint> GeoRoutePoints { get; set; } = new List<GeoRoutePoint>();
}