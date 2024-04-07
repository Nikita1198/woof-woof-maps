using WoofWoofMaps.Dal.Entities;

namespace WoofWoofMaps.Dal.Repositories.Interfaces;

public interface IGeoPointRepository
{
    IQueryable<GeoPoint> GeoPoints { get; }
    void SaveGeoPoint(GeoPoint p);
    void CreateGeoPoint(GeoPoint p);
    void DeleteGeoPoint(GeoPoint p);
    void AddPointToRoute(long pointId, long routeId, DateTime timestamp);
    Task<bool> ExistsAsync(double latitude, double longitude);

    Task<GeoPoint?> FindByCoorinateAsync(double latitude, double longitude);
}