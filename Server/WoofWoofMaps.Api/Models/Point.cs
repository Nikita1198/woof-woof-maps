using System.ComponentModel.DataAnnotations;

namespace WoofWoofMaps.Api.Models;

public record Point
{
    [Required]
    [Range(0.00001, double.MaxValue, ErrorMessage = "Please enter a positive latitude")]
    public double Latitude { get; set; }
    [Required]
    [Range(0.00001, double.MaxValue, ErrorMessage = "Please enter a positive longitude")]
    public double Longitude { get; set; }
    public DateTime Timestamp { get; set; }
};