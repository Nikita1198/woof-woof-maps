using WoofWoofMaps.ApiLocation.Models;

namespace WoofWoofMaps.ApiLocation.Requests;

public record AttachPointToRouteRequest(long RouteId,
                                        double Latitude,
                                        double Longitude,
                                        DateTime Timestamp);