class PipelineDagEngine {
  constructor(mount, telemetry) {
    this.mount = mount;
    this.sendTelemetry = typeof telemetry === "function" ? telemetry : () => {};
    this.stages = ["Checkout", "Lint/Security", "Container Build", "K8s Rollout"];
    this.running = false;
    this.timer = null;
  }

  init() {
    this.render();
    this.sendTelemetry({ engine: "DAG Runner", status: "IDLE" });
  }

  render() {
    this.mount.innerHTML = `
      <div class="engine-shell">
        <div class="engine-top">
          <strong>CI/CD DAG ENGINE // DEMONSTRATOR</strong>
          <span id="dag-state">IDLE</span>
        </div>
        <div class="actions">
          <button id="dag-run">TRIGGER PIPELINE RUN</button>
          <button id="dag-reset">RESET</button>
        </div>
        <div id="dag-log" class="log">Klar til kjøring.</div>
      </div>`;
    this.mount.querySelector("#dag-run").onclick = () => this.run();
    this.mount.querySelector("#dag-reset").onclick = () => this.reset();
  }

  run() {
    if (this.running) return;
    this.running = true;
    let step = 0;
    const state = this.mount.querySelector("#dag-state");
    const log = this.mount.querySelector("#dag-log");
    state.textContent = "EXECUTING";
    log.textContent = "[DAG RUN START]\n";

    this.timer = setInterval(() => {
      if (step < this.stages.length) {
        const stage = this.stages[step];
        log.textContent += `→ [OK] ${stage}\n`;
        this.sendTelemetry({ stage, status: "RUNNING", progress: `${step + 1}/${this.stages.length}` });
        step += 1;
        return;
      }
      clearInterval(this.timer);
      this.timer = null;
      this.running = false;
      state.textContent = "SUCCESS";
      log.textContent += "\n[PIPELINE COMPLETE]";
      this.sendTelemetry({ status: "COMPLETE", stages: this.stages.length });
    }, 320);
  }

  reset() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.running = false;
    this.render();
    this.sendTelemetry({ status: "IDLE" });
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.mount.replaceChildren();
  }
}

if (typeof window !== "undefined") window.PipelineDagEngine = PipelineDagEngine;

export { PipelineDagEngine };
