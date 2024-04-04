using Microsoft.Extensions.DependencyInjection;
using WoofWoofMaps.Bll.Services;
using WoofWoofMaps.Bll.Services.Interfaces;

namespace WoofWoofMaps.Bll.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBll(this IServiceCollection services)
    {
        services.AddTransient<IPointsRouteService, PointsRouteService>();

        return services;
    }
}