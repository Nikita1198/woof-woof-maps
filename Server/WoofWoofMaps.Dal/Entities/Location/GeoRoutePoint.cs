using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WoofWoofMaps.Dal.Entities.Location;

[PrimaryKey(nameof(GeoPointId), nameof(GeoRouteId), nameof(Timestamp))]
public class GeoRoutePoint
{
    [Key]
    public long GeoPointId { get; set; }
    [JsonIgnore]
    public GeoPoint GeoPoint { get; set; }
    [Key]
    public long GeoRouteId { get; set; }
    [JsonIgnore]
    public GeoRoute GeoRoute { get; set; }
    [Key]
    [Required(ErrorMessage = "Please enter a timestamp")]
    public DateTime Timestamp { get; set; }
}