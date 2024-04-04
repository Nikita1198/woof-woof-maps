namespace WoofWoofMaps.Bll.Exceptions;

public class RouteNotFoundException : Exception
{
    public RouteNotFoundException() : base("Route not found")
    {

    }
}