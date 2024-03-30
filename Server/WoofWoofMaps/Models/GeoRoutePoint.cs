using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WoofWoofMaps.Models;

public class GeoRoutePoint
{
    public long GeoPointId { get; set; }
    [JsonIgnore]
    public GeoPoint GeoPoint { get; set; }// = new GeoPoint();

    public long GeoRouteId { get; set; }
    [JsonIgnore]
    public GeoRoute GeoRoute { get; set; }// = new GeoRoute();

    [Required(ErrorMessage = "Please enter a timestamp")]
    public DateTime Timestamp { get; set; }
}