using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WoofWoofMaps.Bll.Extensions;
using WoofWoofMaps.Dal;

namespace WoofWoofMaps.TelegramBot;

internal static class Configurator
{
    public static string GetBotToken()
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

        var botToken = configuration["BotConfiguration:BotToken"];
        if (string.IsNullOrEmpty(botToken))
        {
            throw new Exception("Bot token is not configured. Please check your appsettings.json file.");
        }

        return botToken;
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureServices((_, services) =>
            {
                services.AddDalInfrastructure();
                services.AddDalRepositories();
                services.AddBll();
                services.AddScoped<MessageHandler>();
            });
}
