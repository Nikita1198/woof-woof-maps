using WoofWoofMaps.Api.Models;

namespace WoofWoofMaps.Api.Requests;

public record AttachPointToRouteRequest(long RouteId,
                                        decimal Latitude,
                                        decimal Longitude,
                                        DateTime Timestamp);