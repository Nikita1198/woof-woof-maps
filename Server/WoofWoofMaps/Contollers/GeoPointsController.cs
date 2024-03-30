using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WoofWoofMaps.DTOs;
using WoofWoofMaps.Models;
using WoofWoofMaps.Requests;
using WoofWoofMaps.Responses;

namespace WoofWoofMaps.Contollers;

[Route("api/[controller]/[action]")]
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

    [HttpGet]
    public async Task<ActionResult<GetRouteWithPointsResponse>> GetRouteWithPoints(long routeId)
    {
        var geoRoute = await _geoRouteRepository
            .FindByIdAsync(routeId);
        if (geoRoute == null)
        {
            return NotFound($"The route with identifier {routeId} was not found.");
        }

        var geoPoints = await _geoRouteRepository
                .GetAttachedPointsToRoute(routeId);

        var result = new GetRouteWithPointsResponse(
            RouteId: routeId,
            Points: geoPoints
                .Select(p => new PointDto(
                    Latitude: p.Point.Latitude,
                    Longitude: p.Point.Longitude,
                    Timestamp: p.Timestamp))
                .ToArray());

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<GeoRoute>> AttachPointToRoute(AttachPointToRouteRequest request)
    {
        var geoRoute = await _geoRouteRepository
            .FindByIdAsync(request.RouteId);
        if (geoRoute == null)
        {
            return NotFound($"The route with identifier {request.RouteId} was not found.");
        }

        var geoPoint = request.Point;
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingPoint = await _geoPointRepository
            .FindByCoorinateAsync(geoPoint.Latitude, geoPoint.Longitude);
        if (existingPoint == null)
        {
            _geoPointRepository.CreateGeoPoint(geoPoint);
            existingPoint = geoPoint;
        }

        await _geoRouteRepository.AttachPointToRoute(existingPoint.Id, geoRoute.Id, request.TimeStamp);
        return Ok();
    }

    [HttpPost]
    public ActionResult<GeoRoute> PostGeoRoute(GeoRoute geoRoute)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _geoRouteRepository.SaveGeoRoute(geoRoute);
        return Ok(geoRoute);
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