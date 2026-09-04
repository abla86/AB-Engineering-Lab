import java.time.Duration
import org.apache.kafka.clients.consumer.KafkaConsumer
import java.util.Properties
fun main(){val p=Properties().apply{put("bootstrap.servers",System.getenv().getOrDefault("KAFKA_BROKER","localhost:9092"));put("group.id",System.getenv().getOrDefault("KAFKA_GROUP","eventforge-kotlin"));put("key.deserializer","org.apache.kafka.common.serialization.StringDeserializer");put("value.deserializer","org.apache.kafka.common.serialization.StringDeserializer");put("auto.offset.reset","earliest")};KafkaConsumer<String,String>(p).use{c->c.subscribe(listOf(System.getenv().getOrDefault("KAFKA_TOPIC","work-events")));while(true)c.poll(Duration.ofSeconds(1)).forEach{println("KOTLIN CONSUMED key="+it.key()+" bytes="+it.value().length)}}}
