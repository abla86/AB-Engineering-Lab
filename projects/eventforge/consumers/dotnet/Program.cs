using System.Text.Json;
public sealed record EventPayload(string ItemId,string Title);
public sealed record WorkEvent(string Id,string Type,DateTimeOffset OccurredAt,string Source,EventPayload Payload);
var json=args.Length>0?args[0]:"""{"id":"demo","type":"work.item.created","occurredAt":"2026-01-01T00:00:00Z","source":"demo","payload":{"itemId":"1","title":"Example"}}""";
var evt=JsonSerializer.Deserialize<WorkEvent>(json) ?? throw new InvalidOperationException("Invalid event");
if(evt.Type!="work.item.created" || string.IsNullOrWhiteSpace(evt.Payload.Title)) throw new InvalidOperationException("Contract validation failed");
Console.WriteLine("VALID " + evt.Payload.ItemId + ": " + evt.Payload.Title);