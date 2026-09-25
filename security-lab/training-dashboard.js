async function load(){
 const data=await fetch('/api/modules').then(r=>r.json());
 const root=document.getElementById('modules');
 const scenarios=document.getElementById('scenarios');
 const done=data.modules.filter(m=>m.completed).length;
 document.getElementById('progress').textContent=done+' / '+data.modules.length+' modules completed';
 document.getElementById('fill').style.width=(done/data.modules.length*100)+'%';
 const coverage=await fetch('/api/verifiers').then(r=>r.json());
 document.getElementById('verificationCoverage').textContent=coverage.modules.filter(m=>m.automated).length+' / '+coverage.modules.length+' modules have automated verification';
 root.replaceChildren();
 const scenarioData=await fetch('/api/scenarios').then(r=>r.json());
 scenarios.replaceChildren();
 scenarioData.scenarios.forEach(function(s){
  const card=document.createElement('article'); card.className='card';
  const title=document.createElement('h3'); title.textContent=s.id+' — '+s.title;
  const module=document.createElement('small'); module.textContent=s.module_id;
  const evidence=document.createElement('p'); evidence.textContent=s.evidence||s.objective||'';
  const verification=document.createElement('p'); verification.textContent='Verification: '+s.verification;
  card.append(module,title,evidence,verification); scenarios.append(card);
 });
 data.modules.forEach(function(m){
  const card=document.createElement('article'); card.className='card'+(m.completed?' done':'');
  const title=document.createElement('h2'); title.textContent=m.id+' — '+m.title;
  const level=document.createElement('small'); level.textContent=m.level;
  const objectives=document.createElement('p'); objectives.textContent=m.objectives.join('. ')+'.';
  const lab=document.createElement('p'); lab.textContent='Lab: '+m.lab;
  const button=document.createElement('button'); button.textContent=m.completed?'Completed':'Verify & complete';
  button.disabled=m.completed; button.onclick=function(){complete(m.id)};
  card.append(level,title,objectives,lab,button); root.append(card);
 });
}
document.getElementById("reset").onclick=async function(){
 if(!window.confirm("Reset all local training progress?"))return;
 await fetch("/api/progress/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}); load();
};
async function verify(id){
 const response=await fetch('/api/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({module_id:id})});
 const data=await response.json();
 if(data.status==='passed'){alert('Verification passed.');return true;}
 if(data.status==='manual'){alert('No automated verifier is defined. Provide manual evidence.');return true;}
 alert('Verification failed.\n\n'+(data.output||'No test output'));
 return false;
}
async function complete(id){
 const verified=await verify(id);
 if(!verified)return;
 const evidence=window.prompt('Evidence for completing this module (test result, log, finding or verification):','');
 if(!evidence||evidence.trim().length<10)return;
 const response=await fetch('/api/progress/complete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({module_id:id,evidence:evidence.trim()})});
 if(!response.ok){alert((await response.json()).error||'Could not record evidence');return;}
 load();
}
load();
