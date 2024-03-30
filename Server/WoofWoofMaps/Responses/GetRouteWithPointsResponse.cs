using WoofWoofMaps.DTOs;
using WoofWoofMaps.Models;

namespace WoofWoofMaps.Responses;

public record GetRouteWithPointsResponse(long RouteId, PointDto[] Points);