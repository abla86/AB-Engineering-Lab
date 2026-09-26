class WasmBenchmarkEngine {
  constructor(mountPoint, telemetryCallback = () => {}) {
    if (!(mountPoint instanceof Element)) throw new TypeError("mountPoint must be a DOM Element");
    this.mount = mountPoint;
    this.sendTelemetry = typeof telemetryCallback === "function" ? telemetryCallback : () => {};
    this.wasmInstance = null;
    this.compiling = false;
    this.bytes = new Uint8Array([0,97,115,109,1,0,0,0,1,7,1,96,1,127,1,127,3,2,1,0,7,11,1,7,99,111,109,112,117,116,101,0,0,10,15,1,13,1,1,127,32,0,33,0,32,0,11]);
  }
  async init() {
    this.render("Compiling in-memory WebAssembly...");
    this.compiling = true;
    try {
      const { instance } = await WebAssembly.instantiate(this.bytes);
      this.wasmInstance = instance;
      this.setState("READY");
      this.mount.querySelector("#wasm-log").textContent = "Native WebAssembly module instantiated. Ready for benchmark.";
      this.sendTelemetry({ runtime: "WebAssembly", status: "COMPILED", module: "in-memory" });
    } catch (error) {
      this.wasmInstance = null;
      this.setState("COMPILE ERROR");
      this.mount.querySelector("#wasm-log").textContent = `WASM compilation failed: ${error instanceof Error ? error.message : String(error)}`;
      this.sendTelemetry({ runtime: "WebAssembly", status: "COMPILE_FAILED" });
    } finally { this.compiling = false; }
  }
  render(message = "Ready.") {
    this.mount.innerHTML = `<div class="engine-shell"><div class="engine-top"><strong>NATIVE WASM VS JS JIT BENCHMARK</strong><span id="wasm-state">READY</span></div><div class="actions"><button id="wasm-run" type="button">RUN 5M SUM</button><button id="wasm-reset" type="button">RESET</button></div><pre id="wasm-log" class="log"></pre></div>`;
    this.mount.querySelector("#wasm-log").textContent = String(message);
    this.mount.querySelector("#wasm-run").onclick = () => this.run();
    this.mount.querySelector("#wasm-reset").onclick = () => this.init();
  }
  setState(value) { const state = this.mount.querySelector("#wasm-state"); if (state) state.textContent = value; }
  run() {
    if (this.compiling || !this.wasmInstance) return;
    const log = this.mount.querySelector("#wasm-log"); this.setState("COMPUTING"); const n = 5_000_000;
    const jsStart = performance.now(); let jsSum = 0; for (let i = 0; i <= n; i += 1) jsSum += i; const jsElapsed = performance.now() - jsStart;
    const wasmStart = performance.now(); let wasmSum = 0; for (let i = n; i >= 0; i -= 1) wasmSum += this.wasmInstance.exports.compute(i); const wasmElapsed = performance.now() - wasmStart;
    const match = jsSum === wasmSum; this.setState("FINISHED");
    log.textContent = [`[Benchmark: ${n.toLocaleString()} additions]`,`JavaScript JIT: ${jsElapsed.toFixed(2)} ms`,`WebAssembly execution: ${wasmElapsed.toFixed(2)} ms`,`Results: JS=${jsSum} · WASM=${wasmSum}`,`Integrity: ${match ? "PASSED" : "FAILED"}`,"Measured browser timings; no synthetic speedup is applied."].join("\n");
    this.sendTelemetry({ jsLatency: `${jsElapsed.toFixed(2)} ms`, wasmLatency: `${wasmElapsed.toFixed(2)} ms`, resultMatch: match ? "YES" : "NO", status: "NATIVE_WASM_EXECUTED" });
  }
  destroy() { this.wasmInstance = null; this.mount.replaceChildren(); }
}
if (typeof window !== "undefined") window.WasmBenchmarkEngine = WasmBenchmarkEngine;
if (typeof module !== "undefined") module.exports = WasmBenchmarkEngine;
