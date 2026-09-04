using System.Text.Json; using Confluent.Kafka;
public sealed record EventPayload(string ItemId,string Title);
public sealed record WorkEvent(string Id,string Type,DateTimeOffset OccurredAt,string Source,EventPayload Payload);
var config=new ConsumerConfig{BootstrapServers=Environment.GetEnvironmentVariable("KAFKA_BROKER")??"localhost:9092",GroupId=Environment.GetEnvironmentVariable("KAFKA_GROUP")??"eventforge-dotnet",AutoOffsetReset=AutoOffsetReset.Earliest};
using var consumer=new ConsumerBuilder<Ignore,string>(config).Build(); consumer.Subscribe(Environment.GetEnvironmentVariable("KAFKA_TOPIC")??"work-events");
while(true){var r=consumer.Consume();var e=JsonSerializer.Deserialize<WorkEvent>(r.Message.Value);if(e?.Type=="work.item.created"&&!string.IsNullOrWhiteSpace(e.Payload.Title))Console.WriteLine($"DOTNET CONSUMED {e.Payload.ItemId}: {e.Payload.Title}");else Console.WriteLine("DOTNET REJECTED event");}
