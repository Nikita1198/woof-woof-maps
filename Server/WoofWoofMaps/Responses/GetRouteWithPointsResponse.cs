using WoofWoofMaps.Api.Models;

namespace WoofWoofMaps.Api.Responses;

public record GetRouteWithPointsResponse(long RouteId, Point[] Points);