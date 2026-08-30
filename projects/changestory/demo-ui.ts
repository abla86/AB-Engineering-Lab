import { buildChangeStory } from "./engine/story";
import { demoDependencies, demoEvents } from "./engine/demo";

const story=buildChangeStory(demoEvents,demoDependencies);
const target=document.querySelector("#story");
if(target){
 const esc=(s:string)=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
 target.innerHTML=`
 <article>
  <div class="summary">
   <div class="card"><span class="label">OUTCOME</span><span class="value">${esc(story.outcome.replaceAll("_"," "))}</span></div>
   <div class="card"><span class="label">CONFIDENCE</span><span class="value">${story.confidence}%</span></div>
   <div class="card"><span class="label">DEPENDENCIES</span><span class="value">${story.dependencies.length}</span></div>
  </div>
  <h2>${esc(story.title)}</h2>
  <p>Evidence-weighted reconstruction. Temporal correlation is not presented as causal proof.</p>
  <h3>Timeline</h3>
  <div class="timeline">${story.events.map(e=>`<div class="event"><span class="time">${esc(e.timestamp)}</span><div><strong>${esc(e.summary)}</strong><div class="reason">${esc(e.source)} · ${esc(e.entityName)}</div></div></div>`).join("")}</div>
  <h3>Evidence classification</h3>
  <div class="evidence-list">${story.evidence.map(e=>`<div class="evidence"><strong class="level">${esc(e.level)}</strong><div>${esc(e.statement)}</div><small class="reason">${esc(e.reason)}</small></div>`).join("")}</div>
  <div class="next"><span class="label">NEXT ACTIONS</span>${story.nextActions.map((a,i)=>`<button data-action="${i}"><span>○</span> ${esc(a)}</button>`).join("")}</div>
 </article>`;
 target.querySelectorAll<HTMLButtonElement>("[data-action]").forEach(b=>b.onclick=()=>{b.classList.toggle("done");b.firstElementChild!.textContent=b.classList.contains("done")?"✓":"○"});
}