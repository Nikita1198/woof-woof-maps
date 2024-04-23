using WoofWoofMaps.Dal.Entities.Location;
using WoofWoofMaps.Dal.Entities.Profiles;

namespace WoofWoofMaps.Dal.Repositories.Interfaces;

public interface IWalkerRouteRepository
{
    Task AddWalkerRouteAsync(long walkerProfileId, long geoRouteId);
    Task DeleteWalkerRouteAsync(long walkerProfileId, long geoRouteId);
    Task<List<GeoRoute>> GetRoutesByWalkerProfileIdAsync(long walkerProfileId);
    Task<List<WalkerProfile>> GetWalkerProfilesByRouteIdAsync(long routeId);
    Task UpdateWalkerRouteAsync(long oldWalkerProfileId, long oldGeoRouteId, long newWalkerProfileId, long newGeoRouteId);
}