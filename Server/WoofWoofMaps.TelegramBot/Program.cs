using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types.Enums;
using WoofWoofMaps.Bll.Extensions;
using WoofWoofMaps.TelegramBot;

var botClient = new TelegramBotClient(Configurator.GetBotToken());
using IHost host = Configurator.CreateHostBuilder(args).Build();

using var cts = new CancellationTokenSource();

var me = await botClient.GetMeAsync();
var messageHandler = host.Services.GetRequiredService<MessageHandler>();
Console.WriteLine($"Bot {me.Username} is ready to receive messages.");

botClient.StartReceiving(
    messageHandler.HandleUpdateAsync,
    messageHandler.HandleErrorAsync,
    new ReceiverOptions { AllowedUpdates = [UpdateType.Message, UpdateType.EditedMessage], },
    cancellationToken: cts.Token);

Console.WriteLine("Press Enter to exit");
Console.ReadLine();

cts.Cancel();