namespace WoofWoofMaps.Dal.Settings;

public record DalOptions
{
    public string ConnectionString { get; init; } = string.Empty;
}