using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WoofWoofMaps.Dal.Migrations
{
    /// <inheritdoc />
    public partial class AddCompositeKeyToGeoRoutePoint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_GeoRoutePoints",
                table: "GeoRoutePoints");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GeoRoutePoints",
                table: "GeoRoutePoints",
                columns: new[] { "GeoPointId", "GeoRouteId", "Timestamp" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_GeoRoutePoints",
                table: "GeoRoutePoints");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GeoRoutePoints",
                table: "GeoRoutePoints",
                columns: new[] { "GeoPointId", "GeoRouteId" });
        }
    }
}
