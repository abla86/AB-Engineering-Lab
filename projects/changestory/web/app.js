const EVENTS=[
 {id:"change-001",time:"09:14:02",source:"Change system",type:"change",entity:"Customer onboarding workflow",summary:"Workflow changed from version 41 to version 42.",detail:"v41 → v42",level:"OBSERVED"},
 {id:"impact-001",time:"09:21:17",source:"Telemetry",type:"signal",entity:"CRM synchronisation",summary:"Synchronisation failures increased to 428 events.",detail:"baseline 4 → 428",level:"CORRELATED"},
 {id:"impact-002",time:"09:27:44",source:"Transaction monitor",type:"impact",entity:"CRM transactions",summary:"23 customer records failed synchronisation.",detail:"23 affected records",level:"CORRELATED"},
 {id:"incident-001",time:"09:31:10",source:"Incident system",type:"impact",entity:"CRM",summary:"Operational incident created after sustained sync degradation.",detail:"incident opened",level:"CORRELATED"},
 {id:"recovery-001",time:"10:12:02",source:"Change system",type:"recovery",entity:"Customer onboarding workflow",summary:"Workflow reverted from version 42 to version 41.",detail:"v42 → v41",level:"OBSERVED"}
];
const DEPS=[["Customer onboarding workflow","CRM synchronisation","TRIGGERS"],["CRM synchronisation","CRM transactions","AFFECTS"]];
const ACTIONS=["Compare workflow v41 and v42 configuration.","Inspect the sync error distribution around 09:21.","Verify the dependency path from workflow to CRM.","Review rollback outcome before closing the investigation."];

let state={view:"executive",source:"all"};

const byId=id=>document.getElementById(id);
function score(){return 86}
function renderMetrics(){
 const metrics=[["Events",EVENTS.length,"normalized observations"],["Affected records","23","operational impact"],["Dependencies",DEPS.length,"known relationships"],["Confidence",score()+"%","evidence-weighted"]];
 byId("metrics").innerHTML=metrics.map(([a,b,c])=>`<div class="metric"><span>${a}</span><strong>${b}</strong><small>${c}</small></div>`).join("");
}
function renderStory(){
 byId("storyTitle").textContent="Workflow v42 preceded CRM synchronisation degradation";
 byId("outcome").textContent="RECOVERED";
 byId("executiveView").innerHTML=`
   <div class="callout"><strong>Executive finding</strong><p>A workflow change was followed within minutes by a sharp increase in synchronization failures and 23 affected records. The workflow was later rolled back. The evidence supports a strong relationship, but this view does not label the change as proven causal.</p></div>
   <div class="story-grid"><div><span class="label">IMPACT</span><strong>23 records</strong></div><div><span class="label">PEAK SIGNAL</span><strong>428 failures</strong></div><div><span class="label">RECOVERY</span><strong>58 min</strong></div></div>`;
 byId("technicalView").innerHTML=`
   <div class="technical-box"><div><span class="label">ANCHOR</span><code>change-001</code></div><div><span class="label">CORRELATION WINDOW</span><code>≤ 30 min</code></div><div><span class="label">STRONGEST SIGNAL</span><code>impact-001 · score 70</code></div></div>
   <pre class="trace">configuration_changed
        │ +7m 15s
        ▼
telemetry anomaly ─────► user impact
        │
        └───────────────► incident
        │
        ▼ +58m
     rollback</pre>`;
}
function renderEvidence(){
 const groups=["OBSERVED","CORRELATED","INFERRED","VERIFIED"];
 byId("evidenceCount").textContent=EVENTS.length+" records";
 byId("evidence").innerHTML=groups.map(level=>{
   const rows=EVENTS.filter(e=>e.level===level);
   return `<div class="evidence-group ${level.toLowerCase()}"><div class="evidence-head"><span class="level-dot"></span><strong>${level}</strong><span>${rows.length}</span></div>${rows.map(e=>`<div class="evidence-row"><div><strong>${e.summary}</strong><small>${e.source} · ${e.time}</small></div><span>${e.detail}</span></div>`).join("") || '<div class="empty">No evidence at this level.</div>'}</div>`
 }).join("");
}
function renderTimeline(){
 const filtered=state.source==="all"?EVENTS:EVENTS.filter(e=>e.source===state.source);
 byId("timeline").innerHTML=filtered.map(e=>`<div class="event"><div class="event-line"><span class="event-dot ${e.type}"></span><span class="event-time">${e.time}</span></div><div class="event-body"><div class="event-title"><strong>${e.summary}</strong><span class="pill ${e.level.toLowerCase()}">${e.level}</span></div><small>${e.source} · ${e.entity}</small><p>${e.detail}</p></div></div>`).join("");
}
function renderDeps(){
 byId("dependencies").innerHTML=DEPS.map((d,i)=>`<div class="dep"><div class="node"><span class="node-num">${i+1}</span><div><strong>${d[0]}</strong><small>system entity</small></div></div><span class="arrow">→</span><div class="node"><div><strong>${d[1]}</strong><small>${d[2]}</small></div></div></div>`).join("");
 byId("actions").innerHTML=ACTIONS.map((a,i)=>`<button class="action" data-action="${i}"><span>${i+1}</span>${a}<b>›</b></button>`).join("");
}
function populateSources(){
 const sources=[...new Set(EVENTS.map(e=>e.source))];
 byId("sourceFilter").innerHTML='<option value="all">All sources</option>'+sources.map(s=>`<option>${s}</option>`).join("");
 byId("sourceFilter").value=state.source;
}
function render(){renderMetrics();renderStory();renderEvidence();populateSources();renderTimeline();renderDeps();}
document.querySelectorAll(".view").forEach(btn=>btn.addEventListener("click",()=>{state.view=btn.dataset.view;document.querySelectorAll(".view").forEach(b=>b.classList.toggle("active",b===btn));byId("executiveView").classList.toggle("hidden",state.view!=="executive");byId("technicalView").classList.toggle("hidden",state.view!=="technical")}));
byId("sourceFilter").addEventListener("change",e=>{state.source=e.target.value;renderTimeline()});
byId("resetBtn").addEventListener("click",()=>{state={view:"executive",source:"all"};document.querySelectorAll(".view").forEach(b=>b.classList.toggle("active",b.dataset.view==="executive"));byId("executiveView").classList.remove("hidden");byId("technicalView").classList.add("hidden");render()});
document.addEventListener("click",e=>{const b=e.target.closest(".action");if(b){b.classList.toggle("done");b.querySelector("b").textContent=b.classList.contains("done")?"✓":"›"}});
render();
