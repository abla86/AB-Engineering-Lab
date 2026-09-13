import express from "express";
import crypto from "node:crypto";
import { Kafka } from "kafkajs";
import { appendEvent, initStore, loadEvents } from "./store.js";
import type { WorkEvent } from "./types.js";
import { prometheus,recordError,recordEvent,recordRequest } from "./metrics.js";

const app=express();app.use(express.json());app.use((_,res,next)=>{recordRequest();res.on("finish",()=>{if(res.statusCode>=500)recordError()});next()});
const kafkaBroker=process.env.KAFKA_BROKER??process.env.ConnectionStrings__kafka??"localhost:9092";
const kafkaTopic=process.env.KAFKA_TOPIC??"work-events";
const kafka=new Kafka({clientId:"eventforge-api",brokers:[kafkaBroker]});
const producer=kafka.producer();let kafkaConnected=false;
async function connectKafka(){try{await producer.connect();kafkaConnected=true;}catch{setTimeout(connectKafka,5000);}}
async function publish(event:WorkEvent){if(!kafkaConnected)return false;try{await producer.send({topic:kafkaTopic,messages:[{key:event.payload.itemId,value:JSON.stringify(event)}]});return true}catch{kafkaConnected=false;return false;}}
app.get("/health",async(_,res)=>{try{const db=process.env.DATABASE_URL||process.env.ConnectionStrings__postgres?"postgresql":"file";if(process.env.DATABASE_URL||process.env.ConnectionStrings__postgres)await loadEvents();res.json({status:"ok",service:"eventforge-api",version:"1.5",kafka:kafkaConnected?"connected":"unavailable",database:db});}catch{res.status(503).json({status:"degraded",service:"eventforge-api",kafka:kafkaConnected?"connected":"unavailable",database:"unavailable"});}});
app.get("/metrics",(_,res)=>{res.type("text/plain").send(prometheus())});
app.get("/api/events",async(_,res)=>{const events=await loadEvents();res.json({count:events.length,events})});
app.post("/api/events",async(req,res)=>{const title=typeof req.body?.title==="string"?req.body.title.trim():"";if(!title)return res.status(400).json({error:"title is required"});const event:WorkEvent={id:crypto.randomUUID(),type:"work.item.created",occurredAt:new Date().toISOString(),source:"eventforge-api",payload:{itemId:crypto.randomUUID(),title}};await appendEvent(event);recordEvent();res.status(201).json({...event,delivery:{persisted:true,kafka:await publish(event)}})});
const port=Number(process.env.PORT??4100);
app.listen(port,async()=>{await initStore();console.log(`EventForge API listening on ${port}`);await connectKafka()});
process.on("SIGTERM",async()=>{if(kafkaConnected)await producer.disconnect();process.exit(0)});process.on("SIGINT",async()=>{if(kafkaConnected)await producer.disconnect();process.exit(0)});
