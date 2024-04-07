using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WoofWoofMaps.Dal.Migrations
{
    /// <inheritdoc />
    public partial class CoordinatesFromDecimalToDouble : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "Longitude",
                table: "GeoPoints",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(9,6)");

            migrationBuilder.AlterColumn<double>(
                name: "Latitude",
                table: "GeoPoints",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(9,6)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Longitude",
                table: "GeoPoints",
                type: "numeric(9,6)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<decimal>(
                name: "Latitude",
                table: "GeoPoints",
                type: "numeric(9,6)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");
        }
    }
}
