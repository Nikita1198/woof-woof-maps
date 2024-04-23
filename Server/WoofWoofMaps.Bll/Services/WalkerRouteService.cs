using WoofWoofMaps.Dal.Entities.Location;
using WoofWoofMaps.Dal.Entities.Profiles;
using WoofWoofMaps.Dal.Repositories.Interfaces;

namespace WoofWoofMaps.Bll.Services;

public class WalkerRouteService
{
    private readonly IWalkerRouteRepository _walkerRouteRepository;

    public WalkerRouteService(IWalkerRouteRepository walkerRouteRepository)
    {
        _walkerRouteRepository = walkerRouteRepository;
    }

    public async Task<List<GeoRoute>> GetRoutesByWalkerIdAsync(long walkerProfileId)
    {
        return await _walkerRouteRepository.GetRoutesByWalkerProfileIdAsync(walkerProfileId);
    }


    public async Task<List<WalkerProfile>> GetWalkerProfilesByRouteIdAsync(long routeId)
    {
        return await _walkerRouteRepository.GetWalkerProfilesByRouteIdAsync(routeId);
    }

    public async Task AddWalkerRouteAsync(long walkerProfileId, long geoRouteId)
    {
        await _walkerRouteRepository.AddWalkerRouteAsync(walkerProfileId, geoRouteId);
    }
    public async Task DeleteWalkerRouteAsync(long walkerProfileId, long geoRouteId)
    {
        await _walkerRouteRepository.DeleteWalkerRouteAsync(walkerProfileId, geoRouteId);
    }

    public async Task UpdateWalkerRouteAsync(long oldWalkerProfileId, long oldGeoRouteId, long newWalkerProfileId, long newGeoRouteId)
    {
        await _walkerRouteRepository.UpdateWalkerRouteAsync(oldWalkerProfileId, oldGeoRouteId, newWalkerProfileId, newGeoRouteId);
    }
}