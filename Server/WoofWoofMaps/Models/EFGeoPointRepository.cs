namespace WoofWoofMaps.Models;

public class EFGeoPointRepository : IGeoPointRepository
{
    private GeoTrackingContext _context;

    public EFGeoPointRepository(GeoTrackingContext context)
    {
        _context = context;
    }

    public IQueryable<GeoPoint> GeoPoints => _context.GeoPoints;

    public void CreateGeoPoint(GeoPoint p)
    {
        _context.Add(p);
        _context.SaveChanges();
    }

    public void DeleteGeoPoint(GeoPoint p)
    {
        _context.Remove(p);
        _context.SaveChanges();
    }

    public void AddPointToRoute(long pointId, long routeId, DateTime timestamp)
    {
        var geoRoutePoint = new GeoRoutePoint
        {
            GeoPointId = pointId,
            GeoRouteId = routeId,
            Timestamp = timestamp
        };

        _context.GeoRoutePoints.Add(geoRoutePoint);
        _context.SaveChanges();
    }

    public void SaveGeoPoint(GeoPoint p)
    {
        _context.SaveChanges();
    }
}