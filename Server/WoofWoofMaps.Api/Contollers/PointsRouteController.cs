using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WoofWoofMaps.ApiLocation.Models;
using WoofWoofMaps.Dal.Entities;
using WoofWoofMaps.Dal.Repositories.Interfaces;
using WoofWoofMaps.Bll;
using WoofWoofMaps.Bll.Models;
using WoofWoofMaps.Bll.Services.Interfaces;
using WoofWoofMaps.ApiLocation.Requests;
using WoofWoofMaps.ApiLocation.Responses;


namespace WoofWoofMaps.ApiLocation.Contollers;

[Route("api/[controller]/[action]")]
[ApiController]
public class PointsRouteController : Controller
{
    private readonly IPointsRouteService _pointsRouteService;

    public PointsRouteController(IPointsRouteService pointsRouteService)
    {
        _pointsRouteService = pointsRouteService;
    }

    [HttpPost]
    public async Task<ActionResult> AttachPointToRoute(AttachPointToRouteRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await _pointsRouteService.AttachPointToRouteAsync(
            point: new PointModel(Latitude: request.Latitude,
                                  Longitude: request.Longitude,
                                  Timestamp: request.Timestamp),
            routeId: request.RouteId);

        return Ok();
    }

    [HttpPost]
    public ActionResult<long> PostRoute(Models.Route Route)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var id = _pointsRouteService.CreateRoute(Route.Name);

        return Ok(new { id });
    }

    [HttpGet]
    public async Task<ActionResult<GetRouteWithPointsResponse>> GetRouteWithPoints(long routeId)
    {
        var result = await _pointsRouteService.GetRouteWithPoints(routeId);

        return Ok(result);
    }
}