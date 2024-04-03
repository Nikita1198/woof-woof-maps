using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WoofWoofMaps.Dal.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GeoPoints",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Latitude = table.Column<decimal>(type: "numeric(9,6)", nullable: false),
                    Longitude = table.Column<decimal>(type: "numeric(9,6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GeoPoints", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GeoRoutes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GeoRoutes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GeoRoutePoints",
                columns: table => new
                {
                    GeoPointId = table.Column<long>(type: "bigint", nullable: false),
                    GeoRouteId = table.Column<long>(type: "bigint", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GeoRoutePoints", x => new { x.GeoPointId, x.GeoRouteId });
                    table.ForeignKey(
                        name: "FK_GeoRoutePoints_GeoPoints_GeoPointId",
                        column: x => x.GeoPointId,
                        principalTable: "GeoPoints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GeoRoutePoints_GeoRoutes_GeoRouteId",
                        column: x => x.GeoRouteId,
                        principalTable: "GeoRoutes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GeoRoutePoints_GeoRouteId",
                table: "GeoRoutePoints",
                column: "GeoRouteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GeoRoutePoints");

            migrationBuilder.DropTable(
                name: "GeoPoints");

            migrationBuilder.DropTable(
                name: "GeoRoutes");
        }
    }
}
