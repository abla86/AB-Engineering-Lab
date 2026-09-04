data class EventPayload(val itemId:String,val title:String)
data class WorkEvent(val id:String,val type:String,val occurredAt:String,val source:String,val payload:EventPayload)
fun main(){
  val e=WorkEvent("demo","work.item.created","2026-01-01T00:00:00Z","demo",EventPayload("1","Example"))
  require(e.type=="work.item.created" && e.payload.title.isNotBlank())
  println("KOTLIN VALID " + e.payload.itemId)
}