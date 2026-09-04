import java.util.Objects;
record EventPayload(String itemId,String title){}
record WorkEvent(String id,String type,String occurredAt,String source,EventPayload payload){}
public class EventForgeConsumer{
  public static void main(String[] args){
    var e=new WorkEvent("demo","work.item.created","2026-01-01T00:00:00Z","demo",new EventPayload("1","Example"));
    if(!Objects.equals(e.type(),"work.item.created")||e.payload().title().isBlank()) throw new IllegalStateException("Invalid event");
    System.out.println("JAVA VALID "+e.payload().itemId());
  }
}