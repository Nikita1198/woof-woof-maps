using System.ComponentModel.DataAnnotations;

namespace WoofWoofMaps.Models;

public class GeoRoutePoint
{
    public long GeoPointId { get; set; }
    public GeoPoint GeoPoint { get; set; } = new GeoPoint();

    public long GeoRouteId { get; set; }
    public GeoRoute GeoRoute { get; set; } = new GeoRoute();

    [Required(ErrorMessage = "Please enter a timestamp")]
    public DateTime Timestamp { get; set; }
}