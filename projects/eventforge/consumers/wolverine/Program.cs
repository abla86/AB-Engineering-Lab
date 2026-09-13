using Wolverine;
using Wolverine.Kafka;

var builder = Host.CreateApplicationBuilder(args);

var broker = Environment.GetEnvironmentVariable("KAFKA_BROKER") ?? "localhost:9092";
var topic = Environment.GetEnvironmentVariable("KAFKA_TOPIC") ?? "work-events";
var group = Environment.GetEnvironmentVariable("KAFKA_GROUP") ?? "eventforge-wolverine";

builder.UseWolverine(opts =>
{
    opts.UseKafka(broker)
        .AutoProvision()
        .ConfigureConsumers(config =>
        {
            config.GroupId = group;
        });

    opts.ListenToKafkaTopic(topic)
        .ProcessInline()
        .ReceiveRawJson<WorkEvent>();
});

var host = builder.Build();
await host.RunAsync();

public sealed record EventPayload(string ItemId, string Title);

public sealed record WorkEvent(
    string Id,
    string Type,
    DateTimeOffset OccurredAt,
    string Source,
    EventPayload Payload);

public static class WorkEventHandler
{
    public static void Handle(WorkEvent message)
    {
        if (message.Type == "work.item.created" && !string.IsNullOrWhiteSpace(message.Payload.Title))
        {
            Console.WriteLine($"WOLVERINE CONSUMED {message.Payload.ItemId}: {message.Payload.Title}");
        }
        else
        {
            Console.WriteLine("WOLVERINE REJECTED event");
        }
    }
}
