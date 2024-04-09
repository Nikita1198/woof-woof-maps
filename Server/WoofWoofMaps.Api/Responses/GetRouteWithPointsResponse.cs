using WoofWoofMaps.ApiLocation.Models;

namespace WoofWoofMaps.ApiLocation.Responses;

public record GetRouteWithPointsResponse(long RouteId, Point[] Points);