using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WoofWoofMaps.Dal.Entities.Location;

public class GeoPoint
{
    public long Id { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Please enter a positive latitude")]
    [Column(TypeName = "double precision")]
    public double Latitude { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Please enter a positive longitude")]
    [Column(TypeName = "double precision")]
    public double Longitude { get; set; }
    [JsonIgnore]
    public List<GeoRoutePoint> GeoRoutePoints { get; set; } = new List<GeoRoutePoint>();
}