using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using WoofWoofMaps.Models;

namespace WoofWoofMaps.Contollers;

[Route("api/[controller]")]
[ApiController]
public class GeoPointsController : Controller
{
    private readonly IGeoPointRepository _geoPointRepository;
    private readonly IGeoRouteRepository _geoRouteRepository;

    public GeoPointsController(IGeoPointRepository geoPointRepository,
        IGeoRouteRepository geoRouteRepository)
    {
        _geoPointRepository = geoPointRepository;
        _geoRouteRepository = geoRouteRepository;
    }



    [HttpPost]
    public async Task<ActionResult<GeoPoint>> PostGeoPoint(GeoPoint geoPoint)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var exists = await _geoPointRepository
            .ExistsAsync(geoPoint.Latitude, geoPoint.Longitude);
        if (exists)
        {
            return Conflict(new { message = "A point with these coordinates already exists." });
        }

        _geoPointRepository.CreateGeoPoint(geoPoint);

        return CreatedAtAction("GetGeoPoint", new { id = geoPoint.Id }, geoPoint);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GeoPoint>> GetGeoPoint(long id)
    {

        var geoPoint = await _geoPointRepository.GeoPoints
            .FirstOrDefaultAsync(point => point.Id == id);

        if (geoPoint == null)
        {
            return NotFound();
        }

        return geoPoint;
    }

    [HttpGet("ByRoute/{routeId}")]
    public async Task<ActionResult<IEnumerable<GeoPoint>>> GetGeoPointsByRoute(int routeId)
    {
        var route = await _geoRouteRepository.GeoRoutes
            .FirstOrDefaultAsync(r => r.Id == routeId);

        if (route == null)
        {
            return NotFound();
        }

        return Ok(route.GeoRoutePoints.Select(grp => grp.GeoPoint));
    }
}