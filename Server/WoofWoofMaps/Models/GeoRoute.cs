using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace WoofWoofMaps.Models;

public class GeoRoute
{
    [BindNever]
    public long Id { get; set; }


    [Required(ErrorMessage = "Please enter a name")]
    public string? Name { get; set; }

    public List<GeoRoutePoint> GeoRoutePoints { get; set; } = new List<GeoRoutePoint>();
}