using WoofWoofMaps.Models;

namespace WoofWoofMaps.Requests;

public record AttachPointToRouteRequest(GeoPoint Point, long RouteId, DateTime TimeStamp);