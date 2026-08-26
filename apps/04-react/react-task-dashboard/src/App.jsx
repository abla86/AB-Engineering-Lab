import { useEffect, useMemo, useState } from "react"; import TaskForm from "./components/TaskForm.jsx"; import TaskColumn from "./components/TaskColumn.jsx";
const KEY="react-task-dashboard"; const columns=[["todo","To Do"],["progress","In Progress"],["done","Done"]];
const starter=[{id:"1",title:"Plan dashboard",status:"todo"},{id:"2",title:"Build React components",status:"progress"},{id:"3",title:"Create project README",status:"done"}];
function load(){try{const x=localStorage.getItem(KEY);return x?JSON.parse(x):starter}catch{return starter}}
export default function App(){const[tasks,setTasks]=useState(load);const[filter,setFilter]=useState("all");
useEffect(()=>localStorage.setItem(KEY,JSON.stringify(tasks)),[tasks]);
const visible=useMemo(()=>filter==="all"?tasks:tasks.filter(t=>t.status===filter),[tasks,filter]);
const add=title=>setTasks(t=>[...t,{id:crypto.randomUUID(),title,status:"todo"}]);
const move=(id,status)=>setTasks(t=>t.map(x=>x.id===id?{...x,status}:x)); const del=id=>setTasks(t=>t.filter(x=>x.id!==id));
return <main className="app"><header><p>React + Vite</p><h1>Task Dashboard</h1><p>Organize tasks across a simple three-stage workflow.</p></header>
<TaskForm onAdd={add}/><nav className="filters" aria-label="Task filters">{[["all","All"],...columns].map(([v,l])=><button key={v} className={filter===v?"active":""} onClick={()=>setFilter(v)} aria-pressed={filter===v}>{l}</button>)}</nav>
<section className="board">{columns.map(([id,title])=><TaskColumn key={id} column={{id,title}} tasks={visible.filter(t=>t.status===id)} onMove={move} onDelete={del}/>)}</section></main>}