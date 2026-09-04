import { promises as fs } from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import type { WorkEvent } from "./types.js";

const databaseUrl=process.env.DATABASE_URL;
const file=process.env.EVENT_STORE_FILE??path.join(process.cwd(),"data","events.json");
const pool=databaseUrl?new Pool({connectionString:databaseUrl}):null;

export async function initStore():Promise<void>{
  if(!pool)return;
  await pool.query("CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY,type TEXT NOT NULL,occurred_at TIMESTAMPTZ NOT NULL,source TEXT NOT NULL,item_id TEXT NOT NULL,title TEXT NOT NULL)");
}
export async function loadEvents():Promise<WorkEvent[]>{
  if(pool){const {rows}=await pool.query("SELECT id,type,occurred_at,source,item_id,title FROM events ORDER BY occurred_at");return rows.map(r=>({id:r.id,type:r.type,occurredAt:new Date(r.occurred_at).toISOString(),source:r.source,payload:{itemId:r.item_id,title:r.title}}));}
  try{return JSON.parse(await fs.readFile(file,"utf8")) as WorkEvent[];}catch(error:unknown){if((error as NodeJS.ErrnoException).code==="ENOENT")return [];throw error;}
}
export async function appendEvent(event:WorkEvent):Promise<void>{
  if(pool){await pool.query("INSERT INTO events(id,type,occurred_at,source,item_id,title) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING",[event.id,event.type,event.occurredAt,event.source,event.payload.itemId,event.payload.title]);return;}
  await fs.mkdir(path.dirname(file),{recursive:true}); const events=await loadEvents(); events.push(event); await fs.writeFile(file,JSON.stringify(events,null,2)+"
","utf8");
}
