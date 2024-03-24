using Microsoft.EntityFrameworkCore;
namespace WoofWoofMaps.Models;

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
}