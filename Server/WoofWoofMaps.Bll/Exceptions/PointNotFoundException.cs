namespace WoofWoofMaps.Bll.Exceptions;

public class PointNotFoundException : Exception
{
    public PointNotFoundException() : base("Point not found")
    {

    }
}