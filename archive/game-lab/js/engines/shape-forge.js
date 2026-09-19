class ShapeForgeEngine {
  constructor(container, telemetry) {
    this.container = container;
    this.telemetry = telemetry;
    this.level = 0;
    this.score = 0;
    this.selected = [];
    this.levels = [
      { name: 'Hus', target: ['triangle','square','square','rectangle'], fact: 'Et kvadrat har fire like lange sider og fire rette vinkler.' },
      { name: 'Rakett', target: ['triangle','rectangle','circle','circle'], fact: 'En trekant har tre sider og tre hjørner.' },
      { name: 'Robot', target: ['square','rectangle','circle','rectangle'], fact: 'Et rektangel har fire rette vinkler; motstående sider er like lange.' },
      { name: 'Sol', target: ['circle','triangle','triangle','triangle','triangle'], fact: 'En sirkel har ingen rette sider og ingen hjørner.' },
      { name: 'Fyr', target: ['rectangle','rectangle','triangle','square'], fact: 'En trekant kan deles i to rettvinklede trekanter med en høyde.' }
    ];
    this.shapes = ['triangle','square','rectangle','circle'];
    this.labels = {triangle:'Trekant',square:'Kvadrat',rectangle:'Rektangel',circle:'Sirkel'};
  }

  init() { this.render(); this.emit('KLAR'); }

  destroy() { this.container.replaceChildren(); }

  emit(status) {
    this.telemetry({ status, level: `${this.level + 1}/${this.levels.length}`, score: this.score, pieces: this.selected.length });
  }

  render() {
    const level = this.levels[this.level];
    this.container.innerHTML = `
      <div class="shape-game">
        <div class="shape-head">
          <div><span class="game-kicker">MINI GAME · GEOMETRI</span><h2>Shape Forge</h2><p>Bygg målfiguren med riktige geometriske former.</p></div>
          <div class="shape-score"><strong>${this.score}</strong><span>POENG</span></div>
        </div>
        <div class="shape-layout">
          <section class="shape-card target-card">
            <div class="shape-card-title">MÅL · ${level.name.toUpperCase()}</div>
            <div id="shape-target" class="shape-target"></div>
            <p class="shape-fact" id="shape-fact">${level.fact}</p>
          </section>
          <section class="shape-card build-card">
            <div class="shape-card-title">BYGG FIGUREN</div>
            <div id="shape-board" class="shape-board"></div>
            <div class="shape-actions"><button id="shape-check">Sjekk</button><button id="shape-reset" class="secondary">Nullstill</button></div>
          </section>
        </div>
        <div class="shape-palette">
          <div class="shape-card-title">FORMER</div>
          <div id="shape-pieces" class="piece-grid"></div>
        </div>
        <div id="shape-message" class="shape-message" aria-live="polite">Velg former fra paletten.</div>
      </div>`;
    this.renderTarget(level.target);
    this.renderPalette();
    this.renderBoard();
    this.container.querySelector('#shape-check').onclick = () => this.check();
    this.container.querySelector('#shape-reset').onclick = () => { this.selected=[]; this.renderBoard(); this.emit('NULLSTILT'); };
  }

  shapeSvg(shape, small=false) {
    const cls = `shape-svg ${small ? 'small' : ''}`;
    const body = {
      triangle:'<polygon points="50,8 92,88 8,88" />',
      square:'<rect x="14" y="14" width="72" height="72" rx="3" />',
      rectangle:'<rect x="8" y="27" width="84" height="46" rx="3" />',
      circle:'<circle cx="50" cy="50" r="37" />'
    }[shape];
    return `<svg class="${cls}" viewBox="0 0 100 100" aria-label="${this.labels[shape]}">${body}</svg>`;
  }

  renderTarget(target) {
    const host=this.container.querySelector('#shape-target');
    host.innerHTML=target.map((s,i)=>`<div class="target-piece piece-${s}">${this.shapeSvg(s,true)}</div>`).join('');
  }

  renderPalette() {
    const host=this.container.querySelector('#shape-pieces');
    host.innerHTML=this.shapes.map(s=>`<button class="shape-piece" data-shape="${s}">${this.shapeSvg(s,true)}<span>${this.labels[s]}</span></button>`).join('');
    host.querySelectorAll('button').forEach(b=>b.onclick=()=>{this.selected.push(b.dataset.shape);this.renderBoard();this.emit('BYGGER');});
  }

  renderBoard() {
    const host=this.container.querySelector('#shape-board');
    host.innerHTML=this.selected.length
      ? this.selected.map((s,i)=>`<button class="board-piece piece-${s}" data-index="${i}" title="Fjern ${this.labels[s]}">${this.shapeSvg(s,true)}</button>`).join('')
      : '<div class="board-empty">Klikk på former under for å begynne.</div>';
    host.querySelectorAll('[data-index]').forEach(b=>b.onclick=()=>{this.selected.splice(Number(b.dataset.index),1);this.renderBoard();this.emit('FJERNET');});
  }

  check() {
    const target=this.levels[this.level].target;
    const a=[...this.selected].sort().join(',');
    const b=[...target].sort().join(',');
    const msg=this.container.querySelector('#shape-message');
    if(a===b){
      this.score += 100;
      msg.textContent='Riktig. +100 poeng. Neste nivå låses opp.';
      msg.className='shape-message success';
      this.emit('RIKTIG');
      if(this.level < this.levels.length-1){
        setTimeout(()=>{this.level++;this.selected=[];this.render();this.emit('NESTE NIVÅ');},700);
      } else {
        msg.textContent='Alle nivåer fullført. Geometri mestret.';
        this.emit('FULLFØRT');
      }
    } else {
      msg.textContent=`Ikke helt. Du har ${this.selected.length} former; målet trenger ${target.length}.`;
      msg.className='shape-message error';
      this.emit('FORSØK');
    }
  }
}
window.ShapeForgeEngine = ShapeForgeEngine;