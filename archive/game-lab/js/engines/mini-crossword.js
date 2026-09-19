class MiniCrosswordEngine {
  constructor(mount, telemetry){
    this.mount=mount; this.telemetry=telemetry;
    this.rows=7; this.cols=5;
    this.cells=[
      ['S','#','#','#','#'],['I','F','#','K','#'],['R','O','B','A','#'],
      ['K','R','E','T','S'],['E','M','V','T','#'],['L','#','I','R','#'],['#','#','S','E','#']
    ];
    this.entries=[
      {n:1,dir:'down',r:0,c:0,word:'SIRKEL',clue:'Rund geometrisk form. (6)'},
      {n:2,dir:'down',r:1,c:1,word:'FORM',clue:'Det vi bruker når deler danner en helhet. (4)'},
      {n:3,dir:'down',r:2,c:2,word:'BEVIS',clue:'Noe som støtter en påstand. (5)'},
      {n:4,dir:'down',r:1,c:3,word:'KATT',clue:'Husdyr som også kan være en del av et bilde. (4)'},
      {n:5,dir:'across',r:3,c:0,word:'KRETS',clue:'Sammenhengende bane i et elektrisk system. (5)'},
      {n:6,dir:'down',r:3,c:3,word:'TRE',clue:'Plante med stamme og krone. (3)'}
    ];
    this.solution=new Map();
    this.entries.forEach(e=>[...e.word].forEach((ch,i)=>this.solution.set(this.key(e.r+(e.dir==='down'?i:0),e.c+(e.dir==='across'?i:0)),ch)));
  }
  key(r,c){return r+'-'+c}
  init(){this.render();this.telemetry({status:'KLAR',ord:0+'/'+this.entries.length});}
  destroy(){this.mount.replaceChildren();}
  render(){
    this.mount.innerHTML='<div class="crossword-game"><div class="mosaic-head"><div><span class="game-kicker">MINI GAME · KUNNSKAP</span><h2>Mini-kryssord</h2><p>Alle ordene krysser hverandre. Bruk kryssende bokstaver som støtte.</p></div><div class="mosaic-score"><b id="cw-score">0/6</b><span>ORD</span></div></div><div class="crossword-layout"><section class="crossword-card"><div class="shape-card-title">RUTENETT</div><div id="cw-grid" class="cw-grid"></div><div class="shape-actions"><button id="cw-check">Sjekk</button><button id="cw-clear" class="secondary">Tøm</button></div><p id="cw-msg" class="shape-message">Klikk en rute og skriv bokstaver.</p></section><section class="crossword-card"><div class="shape-card-title">LEDTRÅDER</div><h3>Vannrett</h3><ol id="cw-across" class="clues"></ol><h3>Loddrett</h3><ol id="cw-down" class="clues"></ol></section></div></div>';
    this.buildGrid(); this.buildClues();
    this.mount.querySelector('#cw-check').onclick=()=>this.check(); this.mount.querySelector('#cw-clear').onclick=()=>this.clear();
  }
  buildGrid(){
    const host=this.mount.querySelector('#cw-grid');host.replaceChildren();this.inputs=new Map();
    for(let r=0;r<this.rows;r++)for(let c=0;c<this.cols;c++){const sol=this.cells[r][c];if(sol==='#'){const b=document.createElement('div');b.className='cw-block';host.append(b);continue;}const input=document.createElement('input');input.className='cw-cell';input.maxLength=1;input.dataset.r=r;input.dataset.c=c;input.setAttribute('aria-label','Rute '+(r+1)+','+(c+1));input.addEventListener('input',()=>{input.value=input.value.replace(/[^a-zA-ZÆØÅæøå]/g,'').slice(-1).toUpperCase();this.focusNext(r,c);});this.inputs.set(this.key(r,c),input);host.append(input);}
  }
  buildClues(){
    const across=this.mount.querySelector('#cw-across'),down=this.mount.querySelector('#cw-down');
    this.entries.forEach(e=>{const li=document.createElement('li');const b=document.createElement('b');b.textContent=e.n+'. ';li.append(b,e.clue);li.onclick=()=>this.focusEntry(e);(e.dir==='across'?across:down).append(li);});
  }
  focusEntry(e){const el=this.inputs.get(this.key(e.r,e.c));el?.focus();}
  focusNext(r,c){const key=this.key(r,c);const e=this.entries.find(x=>this.key(x.r,x.c)===key);if(e){const nr=r+(e.dir==='down'?1:0),nc=c+(e.dir==='across'?1:0);this.inputs.get(this.key(nr,nc))?.focus();}}
  check(){
    let correct=0;this.entries.forEach(e=>{let ok=true;for(let i=0;i<e.word.length;i++){const k=this.key(e.r+(e.dir==='down'?i:0),e.c+(e.dir==='across'?i:0));const el=this.inputs.get(k);if(!el||el.value!==e.word[i])ok=false;}if(ok)correct++;});
    this.mount.querySelector('#cw-score').textContent=correct+'/'+this.entries.length;const msg=this.mount.querySelector('#cw-msg');msg.textContent=correct===this.entries.length?'Riktig — kryssordet er løst.':correct+' av '+this.entries.length+' ord er riktige.';msg.className='shape-message '+(correct===this.entries.length?'success':'error');this.telemetry({status:correct===this.entries.length?'FULLFØRT':'SJEKKER',riktige:correct+'/'+this.entries.length});
  }
  clear(){this.inputs.forEach(i=>i.value='');this.mount.querySelector('#cw-score').textContent='0/'+this.entries.length;this.mount.querySelector('#cw-msg').textContent='Rutenettet er tømt.';this.mount.querySelector('#cw-msg').className='shape-message';this.telemetry({status:'TØMT'});}
}
window.MiniCrosswordEngine=MiniCrosswordEngine;