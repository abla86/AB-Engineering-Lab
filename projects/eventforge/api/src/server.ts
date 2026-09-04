import express from "express";
import crypto from "node:crypto";
import { Kafka } from "kafkajs";
import { appendEvent, initStore, loadEvents } from "./store.js";
import type { WorkEvent } from "./types.js";

const app=express();app.use(express.json());
const kafka=new Kafka({clientId:"eventforge-api",brokers:[process.env.KAFKA_BROKER??"localhost:9092"]});
const producer=kafka.producer();let kafkaConnected=false;
async function connectKafka(){try{await producer.connect();kafkaConnected=true;}catch{setTimeout(connectKafka,5000);}}
async function publish(event:WorkEvent){if(!kafkaConnected)return false;try{await producer.send({topic:process.env.KAFKA_TOPIC??"work-events",messages:[{key:event.payload.itemId,value:JSON.stringify(event)}]});return true;}catch{kafkaConnected=false;return false;}}
app.get("/health",async(_,res)=>{let db="file";try{if(process.env.DATABASE_URL){await loadEvents();db="postgresql";}await res.json({status:"ok",service:"eventforge-api",version:"1.3",kafka:kafkaConnected?"connected":"unavailable",database:db});}catch{res.status(503).json({status:"degraded",service:"eventforge-api",kafka:kafkaConnected?"connected":"unavailable",database:"unavailable"});}});
app.get("/api/events",async(_,res)=>{const events=await loadEvents();res.json({count:events.length,events});});
app.post("/api/events",async(req,res)=>{const title=typeof req.body?.title==="string"?req.body.title.trim():"";if(!title)return res.status(400).json({error:"title is required"});const event:WorkEvent={id:crypto.randomUUID(),type:"work.item.created",occurredAt:new Date().toISOString(),source:"eventforge-api",payload:{itemId:crypto.randomUUID(),title}};await appendEvent(event);res.status(201).json({...event,delivery:{persisted:true,kafka:await publish(event)}});});
const port=Number(process.env.PORT??4100);
app.listen(port,async()=>{await initStore();console.log(`EventForge API listening on ${port}`);await connectKafka();});
process.on("SIGTERM",async()=>{if(kafkaConnected)await producer.disconnect();process.exit(0)});process.on("SIGINT",async()=>{if(kafkaConnected)await producer.disconnect();process.exit(0)});
