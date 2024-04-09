using Microsoft.EntityFrameworkCore;
using WoofWoofMaps.Dal;
using WoofWoofMaps.Dal.Entities;
using WoofWoofMaps.Dal.Entities.Location;
using WoofWoofMaps.Dal.Repositories.Interfaces;

namespace WoofWoofMaps.Dal.Repositories;

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

    public async Task<bool> ExistsAsync(double latitude, double longitude)
    {
        return await _context.GeoPoints
            .AnyAsync(p => p.Latitude == latitude
                && p.Longitude == longitude);
    }

    public async Task<GeoPoint?> FindByCoorinateAsync(double latitude, double longitude)
    {
        return await _context.GeoPoints
            .FirstOrDefaultAsync(p => p.Latitude == latitude
                && p.Longitude == longitude);
    }
}