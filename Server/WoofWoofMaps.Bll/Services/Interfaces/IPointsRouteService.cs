using WoofWoofMaps.Bll.Models;

namespace WoofWoofMaps.Bll.Services.Interfaces;

public interface IPointsRouteService
{
    Task AttachPointToRouteAsync(PointModel point, long routeId);
    Task<RouteWithPoints> GetRouteWithPoints(long routeId);
    long CreateRoute(string name);
}