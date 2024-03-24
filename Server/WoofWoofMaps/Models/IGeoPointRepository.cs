namespace WoofWoofMaps.Models;

public interface IGeoPointRepository
{
    IQueryable<GeoPoint> GeoPoints { get; }
    void SaveGeoPoint(GeoPoint p);
    void CreateGeoPoint(GeoPoint p);
    void DeleteGeoPoint(GeoPoint p);
    void AddPointToRoute(long pointId, long routeId, DateTime timestamp);
}