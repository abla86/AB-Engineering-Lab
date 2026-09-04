import { promises as fs } from "node:fs";
import path from "node:path";
import type { WorkEvent } from "./types.js";

const file=process.env.EVENT_STORE_FILE??path.join(process.cwd(),"data","events.json");

export async function loadEvents():Promise<WorkEvent[]>{
  try{return JSON.parse(await fs.readFile(file,"utf8")) as WorkEvent[];}
  catch(error:unknown){if((error as NodeJS.ErrnoException).code==="ENOENT")return [];throw error;}
}
export async function appendEvent(event:WorkEvent):Promise<void>{
  await fs.mkdir(path.dirname(file),{recursive:true});
  const events=await loadEvents(); events.push(event);
  await fs.writeFile(file,JSON.stringify(events,null,2)+"
","utf8");
}
