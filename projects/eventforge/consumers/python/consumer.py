import json, os
from dataclasses import dataclass
from kafka import KafkaConsumer
@dataclass(frozen=True)
class WorkItem: item_id: str; title: str
def validate_event(event: dict) -> WorkItem:
    if event.get("type") != "work.item.created": raise ValueError("unsupported event type")
    payload=event.get("payload") or {}
    if not isinstance(payload.get("itemId"),str) or not isinstance(payload.get("title"),str) or not payload["title"].strip(): raise ValueError("invalid payload")
    return WorkItem(payload["itemId"],payload["title"].strip())
def run():
    consumer=KafkaConsumer(os.getenv("KAFKA_TOPIC","work-events"),bootstrap_servers=os.getenv("KAFKA_BROKER","localhost:9092"),group_id=os.getenv("KAFKA_GROUP","eventforge-python"),auto_offset_reset="earliest",value_deserializer=lambda v: json.loads(v.decode()))
    for message in consumer:
        try: print("PYTHON CONSUMED",validate_event(message.value),flush=True)
        except (ValueError,TypeError) as exc: print("PYTHON REJECTED:",exc,flush=True)
if __name__=="__main__": run()
