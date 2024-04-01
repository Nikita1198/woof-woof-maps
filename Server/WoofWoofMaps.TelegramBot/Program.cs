using Microsoft.Extensions.Configuration;
using Telegram.Bot;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;

var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

var botToken = configuration["BotConfiguration:BotToken"];
if (string.IsNullOrEmpty(botToken))
{
    Console.WriteLine("Bot token is not configured. Please check your appsettings.json file.");
    return;
}

var botClient = new TelegramBotClient(botToken);

using var cts = new CancellationTokenSource();

var me = await botClient.GetMeAsync();
Console.WriteLine($"Bot {me.Username} is ready to receive messages.");

botClient.StartReceiving(
    HandleUpdateAsync,
    HandleErrorAsync,
    new ReceiverOptions { AllowedUpdates = [UpdateType.Message, UpdateType.EditedMessage], },
    cancellationToken: cts.Token);

Console.WriteLine("Press Enter to exit");
Console.ReadLine();

cts.Cancel();

static async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
{
    if (update.Type == UpdateType.Message && update.Message!.Type == MessageType.Location)
    {
        var chatId = update.Message.Chat.Id;
        var location = update.Message.Location;
        var isLive = update.Message.Location!.LivePeriod != null;

        if (isLive)
        {
            // Просто отобразите информацию о полученном местоположении
            Console.WriteLine($"Received live location: {location.Latitude}, {location.Longitude} from chat {chatId}.");
            string messageText = $"Трансляция геопозиции в реальном времени: {location.Latitude}, {location.Longitude}";
            await botClient.SendTextMessageAsync(chatId, messageText, cancellationToken: cancellationToken);
        }
        else
        {
            // Этот блок будет выполнен, если местоположение не транслируется в реальном времени
            Console.WriteLine($"Received single location: {location.Latitude}, {location.Longitude} from chat {chatId}.");
            string messageText = $"Получена геопозиция: {location.Latitude}, {location.Longitude}";
            await botClient.SendTextMessageAsync(chatId, messageText, cancellationToken: cancellationToken);
        }
    }

    if (update.Type == UpdateType.EditedMessage && update.EditedMessage!.Type == MessageType.Location)
    {
        var chatId = update.EditedMessage.Chat.Id;
        var location = update.EditedMessage.Location;
        var isLive = update.EditedMessage.Location!.LivePeriod != null;

        // Просто отобразите информацию о полученном местоположении
        Console.WriteLine($"Received live location: {location.Latitude}, {location.Longitude} from chat {chatId}.");
        string messageText = $"Трансляция геопозиции в реальном времени: {location.Latitude}, {location.Longitude}";
        await botClient.SendTextMessageAsync(chatId, messageText, cancellationToken: cancellationToken);
    }
}

static Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
{
    var ErrorMessage = exception switch
    {
        ApiRequestException apiRequestException => $"Telegram API Error:\n[{apiRequestException.ErrorCode}]\n{apiRequestException.Message}",
        _ => exception.ToString()
    };

    Console.WriteLine(ErrorMessage);
    return Task.CompletedTask;
}