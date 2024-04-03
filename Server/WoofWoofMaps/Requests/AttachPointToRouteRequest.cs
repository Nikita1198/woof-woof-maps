using WoofWoofMaps.Api.Models;

namespace WoofWoofMaps.Api.Requests;

public record AttachPointToRouteRequest(Point Point, long RouteId);