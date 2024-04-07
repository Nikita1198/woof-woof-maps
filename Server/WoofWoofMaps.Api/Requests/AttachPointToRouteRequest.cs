using WoofWoofMaps.Api.Models;

namespace WoofWoofMaps.Api.Requests;

public record AttachPointToRouteRequest(long RouteId,
                                        double Latitude,
                                        double Longitude,
                                        DateTime Timestamp);