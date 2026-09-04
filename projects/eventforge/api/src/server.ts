import express from "express";
import crypto from "node:crypto";

const app=express();
app.use(express.json());

type WorkEvent={id:string;type:"work.item.created";occurredAt:string;source:string;payload:{itemId:string;title:string}};
const events:WorkEvent[]=[];

app.get("/health",(_,res)=>res.json({status:"ok",service:"eventforge-api",version:"1.0"}));
app.get("/api/events",(_,res)=>res.json({count:events.length,events}));

app.post("/api/events",(req,res)=>{
  const title=typeof req.body?.title==="string"?req.body.title.trim():"";
  if(!title)return res.status(400).json({error:"title is required"});
  const event:WorkEvent={id:crypto.randomUUID(),type:"work.item.created",occurredAt:new Date().toISOString(),source:"eventforge-api",payload:{itemId:crypto.randomUUID(),title}};
  events.push(event);
  res.status(201).json(event);
});

const port=Number(process.env.PORT??4100);
app.listen(port,()=>console.log(`EventForge API listening on ${port}`));