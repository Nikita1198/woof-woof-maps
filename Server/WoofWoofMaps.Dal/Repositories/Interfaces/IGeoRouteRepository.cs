using WoofWoofMaps.Dal.Entities;

namespace WoofWoofMaps.Dal.Repositories.Interfaces;

public interface IGeoRouteRepository
{
    IQueryable<GeoRoute> GeoRoutes { get; }
    void SaveGeoRoute(GeoRoute p);

    Task<GeoRoute?> FindByIdAsync(long Id);

    Task AttachPointToRouteAsync(long pointId, long routeId, DateTime timeStamp);

    Task<List<(GeoPoint Point, DateTime Timestamp)>> GetAttachedPointsToRouteAsync(long routeId);
}