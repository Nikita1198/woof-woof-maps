namespace WoofWoofMaps.Models;

public interface IGeoRouteRepository
{
    IQueryable<GeoRoute> GeoRoutes { get; }
    void SaveGeoRoute(GeoRoute p);
}