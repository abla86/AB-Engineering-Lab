class ShapeMosaicEngine {
  constructor(mount, telemetry) {
    this.mount=mount; this.telemetry=telemetry; this.level=0; this.score=0;
    this.patterns=[{name:'KATT',kind:'cat',fact:'En figur kan gjenkjennes av hvordan mange enkle elementer danner en helhet.'},{name:'TRE',kind:'tree',fact:'Komplekse bilder kan bygges av få geometriske grunnformer og repeterte punkter.'}];
  }
  init(){this.render();this.telemetry({status:'KLAR',nivå:(this.level+1)+'/2',poeng:this.score});}
  destroy(){this.mount.replaceChildren();}
  render(){const p=this.patterns[this.level];
    this.mount.innerHTML='<div class="mosaic-game"><div class="mosaic-head"><div><span class="game-kicker">MINI GAME · GENERATIV GEOMETRI</span><h2>Shape Swarm</h2><p>Flytt svermen og se små former samle seg til et bilde.</p></div><div class="mosaic-score"><b>'+this.score+'</b><span>POENG</span></div></div><div class="mosaic-grid"><section class="mosaic-card"><div class="shape-card-title">SVERM → '+p.name+'</div><canvas id="swarm-canvas" width="760" height="430" aria-label="Animasjon av geometriske former som danner '+p.name+'"></canvas><p class="shape-fact">'+p.fact+'</p></section><section class="mosaic-card"><div class="shape-card-title">MØNSTERKUNNSKAP</div><div class="mosaic-controls"><button id="morph">Morfér sverm</button><button id="replay" class="secondary">Start på nytt</button></div><div class="mosaic-info"><b>Hva skjer?</b><p>Hver partikkel er en enkel geometrisk figur. Når posisjonene følger en silhuett, oppfatter vi en samlet form.</p><button id="next" class="next">Neste bilde</button></div></section></div></div>';
    this.canvas=this.mount.querySelector('#swarm-canvas');this.ctx=this.canvas.getContext('2d');this.animate(false);
    this.mount.querySelector('#morph').onclick=()=>this.animate(true);this.mount.querySelector('#replay').onclick=()=>this.animate(false);this.mount.querySelector('#next').onclick=()=>this.next();
  }
  points(kind){const pts=[],add=(x,y,s)=>pts.push({x:x,y:y,s:s});
    if(kind==='cat'){for(let x=230;x<=530;x+=15)for(let y=115;y<=320;y+=15){const body=((x-380)**2/(150**2)+(y-250)**2/(95**2)<=1),head=((x-380)**2/(105**2)+(y-135)**2/(75**2)<=1);if(body||head)add(x,y,(x+y)%3);}}
    else {for(let x=345;x<=415;x+=14)for(let y=250;y<=350;y+=14)add(x,y,2);for(let x=270;x<=490;x+=14)for(let y=90;y<=285;y+=14)if(((x-380)/115)**2+((y-180)/105)**2<1||((x-315)/70)**2+((y-210)/65)**2<1||((x-445)/70)**2+((y-210)/65)**2<1)add(x,y,(x+y)%3);}
    return pts;
  }
  animate(morph){const target=this.points(this.patterns[this.level].kind),n=180,start=Array.from({length:n},(_,i)=>({x:40+(i*83)%680,y:30+(i*47)%370,s:i%3}));this.particles=start.map((p,i)=>({...p,target:target[i%target.length]}));let frame=0;const duration=120,tick=()=>{frame++;this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);this.particles.forEach(p=>{const q=morph?p.target:p,k=morph?Math.min(1,frame/duration):0.02;p.x+=(q.x-p.x)*k;p.y+=(q.y-p.y)*k;const z=3+(p.s%3);this.ctx.beginPath();if(p.s===0)this.ctx.arc(p.x,p.y,z,0,Math.PI*2);else if(p.s===1)this.ctx.rect(p.x-z,p.y-z,z*2,z*2);else{this.ctx.moveTo(p.x,p.y-z*1.5);this.ctx.lineTo(p.x-z*1.3,p.y+z);this.ctx.lineTo(p.x+z*1.3,p.y+z);this.ctx.closePath();}this.ctx.fillStyle=['#ff6673','#4d9cff','#ffc84a'][p.s];this.ctx.fill();});if(morph&&frame===duration){this.score+=100;this.telemetry({status:'BILDE DANNET',bilde:this.patterns[this.level].name,poeng:this.score});}else if(morph)this.telemetry({status:'MORFÉRER',bilde:this.patterns[this.level].name,partikler:n});if(morph&&frame<duration)setTimeout(tick,16);else if(!morph)setTimeout(tick,80);};tick();}
  next(){this.level=this.level<this.patterns.length-1?this.level+1:0;this.render();this.telemetry({status:'NESTE BILDE',nivå:(this.level+1)+'/2'});}
}
window.ShapeMosaicEngine=ShapeMosaicEngine;