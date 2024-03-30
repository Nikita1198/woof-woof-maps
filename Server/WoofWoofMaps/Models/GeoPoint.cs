using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json.Serialization;

namespace WoofWoofMaps.Models;

public class GeoPoint
{
    [BindNever]
    public long Id { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Please enter a positive latitude")]
    [Column(TypeName = "decimal(9,6)")]
    public decimal Latitude { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Please enter a positive longitude")]
    [Column(TypeName = "decimal(9,6)")]
    public decimal Longitude { get; set; }
    [JsonIgnore]
    public List<GeoRoutePoint> GeoRoutePoints { get; set; } = new List<GeoRoutePoint>();
}