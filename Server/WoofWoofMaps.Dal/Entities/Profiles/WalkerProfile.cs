namespace WoofWoofMaps.Dal.Entities.Profiles;

public class WalkerProfile : Profile
{
    public float Rating { get; set; }
    public int WalksCompleted { get; set; }

    public List<WalkerRoute> WalkerRoutes { get; set; } = new List<WalkerRoute>();
}