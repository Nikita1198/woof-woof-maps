using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WoofWoofMaps.Api.Models;
using WoofWoofMaps.Api.Requests;
using WoofWoofMaps.Api.Responses;
using WoofWoofMaps.Dal.Entities;
using WoofWoofMaps.Dal.Repositories.Interfaces;

namespace WoofWoofMaps.Api.Contollers;

[Route("api/[controller]/[action]")]
[ApiController]
public class PointsRouteController : Controller
{
    private readonly IGeoPointRepository _geoPointRepository;
    private readonly IGeoRouteRepository _geoRouteRepository;

    public PointsRouteController(IGeoPointRepository geoPointRepository,
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
                .Select(p => new Point()
                {
                    Latitude = p.Point.Latitude,
                    Longitude = p.Point.Longitude,
                    Timestamp = p.Timestamp
                })
                .ToArray());

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult> AttachPointToRoute(AttachPointToRouteRequest request)
    {
        var geoRoute = await _geoRouteRepository
            .FindByIdAsync(request.RouteId);
        if (geoRoute == null)
        {
            return NotFound($"The route with identifier {request.RouteId} was not found.");
        }

        var point = request.Point;
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingPoint = await _geoPointRepository
            .FindByCoorinateAsync(point.Latitude, point.Longitude);
        if (existingPoint == null)
        {
            var geoPoint = new GeoPoint()
            {
                Latitude = point.Latitude,
                Longitude = point.Longitude,
            };
            _geoPointRepository.CreateGeoPoint(geoPoint);
            existingPoint = geoPoint;
        }

        await _geoRouteRepository.AttachPointToRoute(existingPoint.Id, geoRoute.Id, request.Point.Timestamp);
        return Ok();
    }

    [HttpPost]
    public ActionResult<GeoRoute> PostGeoRoute(Models.Route Route)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var geoRoute = new GeoRoute() { Name = Route.Name };
        _geoRouteRepository.SaveGeoRoute(geoRoute);
        return Ok(geoRoute);
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