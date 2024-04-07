using System.Collections.Concurrent;
using Telegram.Bot;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using WoofWoofMaps.Bll.Models;
using WoofWoofMaps.Bll.Services.Interfaces;
using WoofWoofMaps.TelegramBot.Models;

namespace WoofWoofMaps.TelegramBot;

internal sealed class MessageHandler
{
    private readonly IPointsRouteService _pointsRouteService;
    private readonly ConcurrentDictionary<long, RouteIdWithLastUpdateTime> chatRoutes = new();

    public const int SecondsToUpdateLocation = 1;

    public MessageHandler(IPointsRouteService pointsRouteService)
    {
        _pointsRouteService = pointsRouteService;
    }

    public async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
    {
        if (update.Message?.Type == MessageType.Location)
        {
            await HandleLocationMessageAsync(botClient, update.Message, cancellationToken);
        }
        else if (update.EditedMessage?.Type == MessageType.Location)
        {
            await HandleEditLiveLocationMessageAsync(botClient, update.EditedMessage, cancellationToken);
        }
        else if (update.Message?.Type == MessageType.Text)
        {
            // Обработка текстового сообщения
            await HandleTextMessageAsync(botClient, update.Message, cancellationToken);
        }
    }

    private async Task HandleLocationMessageAsync(ITelegramBotClient botClient, Message message, CancellationToken cancellationToken)
    {
        if (message.Location == null)
            return;
        var location = message.Location!;
        var chatId = message.Chat.Id;
        var isLiveLocation = IsLiveLocation(message);

        if (isLiveLocation)
        {
            var routeId = _pointsRouteService.CreateRoute($"{message.Chat.Username}:{chatId}");
            await _pointsRouteService.AttachPointToRouteAsync(new PointModel(decimal.Parse(location.Latitude.ToString()),
                decimal.Parse(location.Longitude.ToString()), message.Date), routeId);
            chatRoutes[chatId] = new() 
            { 
                RouteId = routeId, 
                LastUpdateTime = message.Date
            };
        }

        var messageText = GetMessageText(location, isLiveLocation);
        Console.WriteLine($"{messageText} from chat {chatId}.");

        await botClient.SendTextMessageAsync(chatId, messageText, cancellationToken: cancellationToken);
    }

    private async Task HandleEditLiveLocationMessageAsync(ITelegramBotClient botClient, Message message, CancellationToken cancellationToken)
    {
        if (message.Location == null)
            return;

        var location = message.Location;
        var editDate = message.EditDate ?? DateTime.Now;

        if (chatRoutes.TryGetValue(message.Chat.Id, out RouteIdWithLastUpdateTime? routeIdWithLastUpdate)
            && IsEnoughTimeToUpdate(editDate, routeIdWithLastUpdate.LastUpdateTime))
        {
            await _pointsRouteService.AttachPointToRouteAsync(new PointModel(decimal.Parse(location.Latitude.ToString()),
                decimal.Parse(location.Longitude.ToString()), editDate), routeIdWithLastUpdate.RouteId);

            chatRoutes[message.Chat.Id].LastUpdateTime = editDate;

            Console.WriteLine($"Received live location: {location.Latitude}, {location.Longitude} from chat {message.Chat.Id}.");
            var messageText = GetMessageText(location, isLiveLocation: true);

            await botClient.SendTextMessageAsync(message.Chat.Id, messageText, cancellationToken: cancellationToken);
        }
        return;
    }

    private static bool IsEnoughTimeToUpdate(DateTime messageEditTime, DateTime lastUpdate)
    {
        return messageEditTime - lastUpdate > TimeSpan.FromSeconds(SecondsToUpdateLocation);
    }

    private async Task HandleTextMessageAsync(ITelegramBotClient botClient, Message message, CancellationToken cancellationToken)
    {
        if (message.Text?.StartsWith("/getmypoints") == true)
        {
            await HandleGetMyPointsCommandAsync(botClient, message, cancellationToken);
        }
    }

    private async Task HandleGetMyPointsCommandAsync(ITelegramBotClient botClient, Message message, CancellationToken cancellationToken)
    {
        var chatId = message.Chat.Id;
        if (chatRoutes.TryGetValue(chatId, out RouteIdWithLastUpdateTime? routeIdWithLastUpdate))
        {
            var routeWithPoints = await _pointsRouteService.GetRouteWithPoints(routeIdWithLastUpdate.RouteId);
            var pointsText = routeWithPoints.Points.Select(p => $"{p.Longitude}, {p.Latitude}, Time: {p.Timestamp}");
            var responseText = string.Join('\n', pointsText);

            await botClient.SendTextMessageAsync(chatId, responseText, cancellationToken: cancellationToken);
        }
    }

    private static bool IsLiveLocation(Message message)
    {
        return message.Location?.LivePeriod != null;
    }

    private static string GetMessageText(Location location, bool isLiveLocation)
    {
        var baseMessage = isLiveLocation ? "Трансляция геопозиции в реальном времени" : "Получена геопозиция";
        return $"{baseMessage}: {location.Latitude}, {location.Longitude}";
    }

    public Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
    {
        var ErrorMessage = exception switch
        {
            ApiRequestException apiRequestException => $"Telegram API Error:\n[{apiRequestException.ErrorCode}]\n{apiRequestException.Message}",
            _ => exception.ToString()
        };

        Console.WriteLine(ErrorMessage);
        return Task.CompletedTask;
    }
}
