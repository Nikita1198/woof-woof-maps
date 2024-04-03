using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using WoofWoofMaps.Dal.Entities;
using WoofWoofMaps.Dal.Repositories.Interfaces;

namespace WoofWoofMaps.Dal.Repositories;

public class EFGeoRouteRepository : IGeoRouteRepository
{
    private GeoTrackingContext _context;

    public EFGeoRouteRepository(GeoTrackingContext context)
    {
        _context = context;
    }

    public IQueryable<GeoRoute> GeoRoutes => _context.GeoRoutes
        .Include(r => r.GeoRoutePoints)
        .ThenInclude(p => p.GeoPoint);

    public void SaveGeoRoute(GeoRoute r)
    {
        _context.AttachRange(r.GeoRoutePoints.Select(p => p.GeoPoint));
        if (r.Id == 0)
        {
            _context.GeoRoutes.Add(r);
        }
        _context.SaveChanges();
    }

    public Task<GeoRoute?> FindByIdAsync(long Id)
    {
        return GeoRoutes
            .FirstOrDefaultAsync(route => route.Id == Id);
    }

    public async Task AttachPointToRoute(long pointId, long routeId, DateTime timeStamp)
    {
        var geoRoutePoint = new GeoRoutePoint
        {
            GeoPointId = pointId,
            GeoRouteId = routeId,
            Timestamp = timeStamp
        };

        _context.GeoRoutePoints.Add(geoRoutePoint);
        await _context.SaveChangesAsync();
    }

    public async Task<List<(GeoPoint Point, DateTime Timestamp)>> GetAttachedPointsToRoute(long routeId)
    {
        var queryResult = await _context.GeoRoutePoints
            .Where(r => r.GeoRouteId == routeId)
            .Select(r => new { r.GeoPoint, r.Timestamp })
            .ToListAsync();

        var result = queryResult.Select(r => (r.GeoPoint, r.Timestamp)).ToList();

        return result;
    }
}