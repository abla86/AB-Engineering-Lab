import express from "express";
import crypto from "node:crypto";
import { Kafka } from "kafkajs";

const app=express();
app.use(express.json());

type WorkEvent={id:string;type:"work.item.created";occurredAt:string;source:string;payload:{itemId:string;title:string}};
const events:WorkEvent[]=[];

const kafka=new Kafka({clientId:"eventforge-api",brokers:[process.env.KAFKA_BROKER??"localhost:9092"]});
const producer=kafka.producer();
let kafkaConnected=false;

async function connectKafka(){
  try { await producer.connect(); kafkaConnected=true; }
  catch { kafkaConnected=false; }
}
async function publish(event:WorkEvent){
  if(!kafkaConnected)return false;
  try {
    await producer.send({topic:process.env.KAFKA_TOPIC??"work-events",messages:[{key:event.payload.itemId,value:JSON.stringify(event)}]});
    return true;
  } catch { kafkaConnected=false; return false; }
}

app.get("/health",(_,res)=>res.json({status:"ok",service:"eventforge-api",version:"1.1",kafka:kafkaConnected?"connected":"unavailable"}));
app.get("/api/events",(_,res)=>res.json({count:events.length,events}));
app.post("/api/events",async(req,res)=>{
  const title=typeof req.body?.title==="string"?req.body.title.trim():"";
  if(!title)return res.status(400).json({error:"title is required"});
  const event:WorkEvent={id:crypto.randomUUID(),type:"work.item.created",occurredAt:new Date().toISOString(),source:"eventforge-api",payload:{itemId:crypto.randomUUID(),title}};
  events.push(event);
  const published=await publish(event);
  res.status(201).json({...event,delivery:{memory:true,kafka:published}});
});

const port=Number(process.env.PORT??4100);
app.listen(port,async()=>{console.log(`EventForge API listening on ${port}`);await connectKafka();});
process.on("SIGTERM",async()=>{if(kafkaConnected)await producer.disconnect();process.exit(0)});
process.on("SIGINT",async()=>{if(kafkaConnected)await producer.disconnect();process.exit(0)});