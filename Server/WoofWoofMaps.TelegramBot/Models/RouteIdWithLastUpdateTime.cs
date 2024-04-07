namespace WoofWoofMaps.TelegramBot.Models;

internal sealed class RouteIdWithLastUpdateTime
{
    public long RouteId { get; set; }
    public DateTime LastUpdateTime { get; set; }
}