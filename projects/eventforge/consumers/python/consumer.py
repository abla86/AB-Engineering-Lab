from dataclasses import dataclass

@dataclass(frozen=True)
class WorkItem:
    item_id: str
    title: str

def validate_event(event: dict) -> WorkItem:
    if event.get("type") != "work.item.created":
        raise ValueError("unsupported event type")
    payload = event.get("payload") or {}
    if not isinstance(payload.get("itemId"), str) or not isinstance(payload.get("title"), str):
        raise ValueError("invalid payload")
    return WorkItem(payload["itemId"], payload["title"])

if __name__ == "__main__":
    print(validate_event({"type":"work.item.created","payload":{"itemId":"demo-1","title":"Demo"}}))
