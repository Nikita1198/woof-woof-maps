using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WoofWoofMaps.Dal.Entities;

public class GeoRoutePoint
{
    public long GeoPointId { get; set; }
    [JsonIgnore]
    public GeoPoint GeoPoint { get; set; }

    public long GeoRouteId { get; set; }
    [JsonIgnore]
    public GeoRoute GeoRoute { get; set; }

    [Required(ErrorMessage = "Please enter a timestamp")]
    public DateTime Timestamp { get; set; }
}