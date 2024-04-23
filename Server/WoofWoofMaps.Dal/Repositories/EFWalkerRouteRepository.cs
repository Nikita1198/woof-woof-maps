using Microsoft.EntityFrameworkCore;
using WoofWoofMaps.Dal.Entities.Location;
using WoofWoofMaps.Dal.Entities.Profiles;
using WoofWoofMaps.Dal.Repositories.Interfaces;

namespace WoofWoofMaps.Dal.Repositories;

public class EFWalkerRouteRepository : IWalkerRouteRepository
{
    private readonly GeoTrackingContext _context;

    public EFWalkerRouteRepository(GeoTrackingContext context)
    {
        _context = context;
    }

    public async Task<List<GeoRoute>> GetRoutesByWalkerProfileIdAsync(long walkerProfileId)
    {
        return await _context.WalkerRoutes
            .Where(wr => wr.WalkerProfileId == walkerProfileId)
            .Select(wr => wr.GeoRoute)
            .ToListAsync();
    }

    public async Task<List<WalkerProfile>> GetWalkerProfilesByRouteIdAsync(long routeId)
    {
        return await _context.WalkerRoutes
            .Where(wr => wr.GeoRouteId == routeId)
            .Select(wr => wr.WalkerProfile)
            .ToListAsync();
    }

    public async Task AddWalkerRouteAsync(long walkerProfileId, long geoRouteId)
    {
        var walkerRoute = new WalkerRoute
        {
            WalkerProfileId = walkerProfileId,
            GeoRouteId = geoRouteId
        };
        _context.WalkerRoutes.Add(walkerRoute);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateWalkerRouteAsync(long oldWalkerProfileId, long oldGeoRouteId, long newWalkerProfileId, long newGeoRouteId)
    {
        var walkerRoute = await _context.WalkerRoutes
            .FirstOrDefaultAsync(wr => wr.WalkerProfileId == oldWalkerProfileId && wr.GeoRouteId == oldGeoRouteId);

        if (walkerRoute != null)
        {
            walkerRoute.WalkerProfileId = newWalkerProfileId;
            walkerRoute.GeoRouteId = newGeoRouteId;
            _context.WalkerRoutes.Update(walkerRoute);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteWalkerRouteAsync(long walkerProfileId, long geoRouteId)
    {
        var walkerRoute = await _context.WalkerRoutes
            .FirstOrDefaultAsync(wr => wr.WalkerProfileId == walkerProfileId
                                        && wr.GeoRouteId == geoRouteId);

        if (walkerRoute != null)
        {
            _context.WalkerRoutes.Remove(walkerRoute);
            await _context.SaveChangesAsync();
        }
    }
}