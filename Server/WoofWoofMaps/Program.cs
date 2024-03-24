using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using WoofWoofMaps.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<GeoTrackingContext>(options =>
{
    options.UseNpgsql(builder.Configuration["ConnectionStrings:WoofWoofMaps"]);
});

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IGeoPointRepository, EFGeoPointRepository>();
builder.Services.AddScoped<IGeoRouteRepository, EFGeoRouteRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
