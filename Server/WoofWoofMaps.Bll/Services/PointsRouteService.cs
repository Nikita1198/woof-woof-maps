using Microsoft.EntityFrameworkCore;
using WoofWoofMaps.Bll.Exceptions;
using WoofWoofMaps.Bll.Models;
using WoofWoofMaps.Bll.Services.Interfaces;
using WoofWoofMaps.Dal.Entities;
using WoofWoofMaps.Dal.Repositories.Interfaces;

namespace WoofWoofMaps.Bll.Services;

public class PointsRouteService : IPointsRouteService
{
    private readonly IGeoPointRepository _geoPointRepository;
    private readonly IGeoRouteRepository _geoRouteRepository;

    public PointsRouteService(IGeoPointRepository geoPointRepository,
        IGeoRouteRepository geoRouteRepository)
    {
        _geoPointRepository = geoPointRepository;
        _geoRouteRepository = geoRouteRepository;
    }

    public async Task AttachPointToRouteAsync(PointModel point, long routeId)
    {
        var geoRoute = await _geoRouteRepository
            .FindByIdAsync(routeId);
        if (geoRoute == null)
        {
            throw new RouteNotFoundException();
        }

        var existingPoint = await _geoPointRepository
            .FindByCoorinateAsync(point.Latitude, point.Longitude);
        if (existingPoint == null)
        {
            var geoPoint = new GeoPoint()
            {
                Latitude = point.Latitude,
                Longitude = point.Longitude
            };
            _geoPointRepository.CreateGeoPoint(geoPoint);
            existingPoint = geoPoint;
        }

        await _geoRouteRepository
            .AttachPointToRouteAsync(existingPoint.Id,
                                     geoRoute.Id,
                                     point.Timestamp);
    }

    public long CreateRoute(string name)
    {
        var geoRoute = new GeoRoute()
        {
            Name = name
        };
        _geoRouteRepository.SaveGeoRoute(geoRoute);
        return geoRoute.Id;
    }

    public async Task<RouteWithPoints> GetRouteWithPoints(long routeId)
    {
        var geoRoute = await _geoRouteRepository
            .FindByIdAsync(routeId);
        if (geoRoute == null)
        {
            throw new RouteNotFoundException();
        }
        var geoPoints = await _geoRouteRepository
            .GetAttachedPointsToRouteAsync(routeId);

        return new RouteWithPoints(
            Route: new RouteModel(Id: routeId,
                                  Name: geoRoute.Name!),
            Points: geoPoints
                        .Select(p => new PointModel(Latitude: p.Point.Latitude,
                                                    Longitude: p.Point.Longitude,
                                                    Timestamp: p.Timestamp))
                        .ToArray()
        );
    }
}