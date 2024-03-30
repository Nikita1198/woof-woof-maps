using WoofWoofMaps.Models;

namespace WoofWoofMaps.Responses;

public record GetRouteWithPointsResponse(long RouteId, GeoPoint[] Points);