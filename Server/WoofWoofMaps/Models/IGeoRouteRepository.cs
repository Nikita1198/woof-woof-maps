namespace WoofWoofMaps.Models;

public interface IGeoRouteRepository
{
    IQueryable<GeoRoute> GeoRoutes { get; }
    void SaveGeoRoute(GeoRoute p);

    Task<GeoRoute?> FindByIdAsync(long Id);

    Task AttachPointToRoute(long pointId, long routeId, DateTime timeStamp);

    Task<List<(GeoPoint Point, DateTime Timestamp)>> GetAttachedPointsToRoute(long routeId);
}