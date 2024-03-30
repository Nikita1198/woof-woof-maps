namespace WoofWoofMaps.Models;

public interface IGeoRouteRepository
{
    IQueryable<GeoRoute> GeoRoutes { get; }
    void SaveGeoRoute(GeoRoute p);

    Task<GeoRoute?> FindByIdAsync(long Id);

    Task AttachPointToRoute(long pointId, long routeId, DateTime timeStamp);

    IEnumerable<GeoPoint> GetAttachedPointsToRoute(long routeId);
}