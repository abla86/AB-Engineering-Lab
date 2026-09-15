class WorkerPoolEngine {
  constructor(mountPoint, telemetryCallback = () => {}) {
    if (!(mountPoint instanceof Element)) throw new TypeError("mountPoint must be a DOM Element");
    this.mount = mountPoint;
    this.sendTelemetry = typeof telemetryCallback === "function" ? telemetryCallback : () => {};
    this.poolSize = Math.min(4, Math.max(1, navigator.hardwareConcurrency || 2));
    this.workers = [];
    this.workerUrl = null;
    this.runStartedAt = 0;
    this.completed = 0;
  }
  init() { this.render(); this.sendTelemetry({ runtime: "Web Worker API", poolSize: this.poolSize, status: "READY" }); }
  render() {
    this.mount.innerHTML = `<div class="engine-shell"><div class="engine-top"><strong>NATIVE MULTI-THREADED WEB WORKER POOL</strong><span id="worker-state">IDLE</span></div><div class="actions"><button id="worker-dispatch" type="button">DISPATCH ${this.poolSize} WORKERS</button><button id="worker-reset" type="button">TERMINATE POOL</button></div><pre id="worker-log" class="log">Worker pool ready.</pre></div>`;
    this.mount.querySelector("#worker-dispatch").onclick = () => this.dispatch();
    this.mount.querySelector("#worker-reset").onclick = () => this.terminate();
  }
  dispatch() {
    this.terminate(false);
    const state = this.mount.querySelector("#worker-state"); const log = this.mount.querySelector("#worker-log");
    state.textContent = "SPAWNING"; log.textContent = `[Spawning ${this.poolSize} native Web Workers]\n`;
    const workerCode = `self.onmessage=({data})=>{const {id,iterations}=data;let checksum=0;for(let i=1;i<=iterations;i+=1) checksum+=Math.sqrt(i);self.postMessage({id,checksum,status:"DONE"});};`;
    this.workerUrl = URL.createObjectURL(new Blob([workerCode], { type: "text/javascript" }));
    this.workers = []; this.completed = 0; this.runStartedAt = performance.now(); state.textContent = "RUNNING";
    for (let i = 0; i < this.poolSize; i += 1) {
      const worker = new Worker(this.workerUrl); this.workers.push(worker);
      worker.onmessage = ({ data }) => { this.completed += 1; log.textContent += `→ Worker ${String(data.id + 1).padStart(2,"0")}: COMPLETE\n`; this.finishIfComplete(false); };
      worker.onerror = event => { this.completed += 1; log.textContent += `→ Worker ${String(i + 1).padStart(2,"0")}: ERROR ${event.message || "unknown"}\n`; worker.terminate(); this.finishIfComplete(true); };
      worker.postMessage({ id: i, iterations: 2_000_000 });
    }
  }
  finishIfComplete(failed) {
    if (this.completed !== this.poolSize) return;
    const elapsed = performance.now() - this.runStartedAt; const status = failed ? "FAILED" : "COMPLETE";
    const state = this.mount.querySelector("#worker-state"); const log = this.mount.querySelector("#worker-log");
    state.textContent = status; log.textContent += `\n[WORKER POOL ${status}] ${elapsed.toFixed(2)} ms`;
    this.sendTelemetry({ workers: this.poolSize, completed: this.completed, latency: `${elapsed.toFixed(2)} ms`, execution: "NATIVE WEB WORKERS", status });
    for (const worker of this.workers) worker.terminate(); this.workers = [];
    if (this.workerUrl) { URL.revokeObjectURL(this.workerUrl); this.workerUrl = null; }
  }
  terminate(report = true) {
    for (const worker of this.workers) worker.terminate(); this.workers = []; this.completed = 0;
    if (this.workerUrl) { URL.revokeObjectURL(this.workerUrl); this.workerUrl = null; }
    if (report) { const state = this.mount.querySelector("#worker-state"); const log = this.mount.querySelector("#worker-log"); if (state) state.textContent = "IDLE"; if (log) log.textContent = "All workers terminated."; this.sendTelemetry({ workers: 0, status: "TERMINATED" }); }
  }
  destroy() { this.terminate(false); this.mount.replaceChildren(); }
}
if (typeof window !== "undefined") window.WorkerPoolEngine = WorkerPoolEngine;
if (typeof module !== "undefined") module.exports = WorkerPoolEngine;
