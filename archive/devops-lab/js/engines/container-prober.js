class ContainerProberEngine {
  constructor(mount, telemetry) {
    this.mount = mount;
    this.sendTelemetry = telemetry;
    this.healthy = true;
    this.restarts = 0;
  }

  init() {
    this.render();
    this.probe();
  }

  render() {
    this.mount.innerHTML = `
      <div class="engine-shell">
        <div class="engine-top">
          <strong>K8S HEALTH PROBER // DEMONSTRATOR</strong>
          <span id="probe-state">RUNNING</span>
        </div>
        <div class="actions">
          <button id="probe-toggle">TOGGLE HEALTH</button>
          <button id="probe-tick">POLL /healthz</button>
          <button id="probe-reset">RESET</button>
        </div>
        <div id="probe-log" class="log"></div>
      </div>`;

    this.mount.querySelector("#probe-toggle").onclick = () => {
      this.healthy = !this.healthy;
      this.probe();
    };
    this.mount.querySelector("#probe-tick").onclick = () => this.probe();
    this.mount.querySelector("#probe-reset").onclick = () => {
      this.healthy = true;
      this.restarts = 0;
      this.probe();
    };
  }

  probe() {
    const state = this.mount.querySelector("#probe-state");
    const log = this.mount.querySelector("#probe-log");

    if (!this.healthy) {
      this.restarts++;
      state.textContent = "UNHEALTHY";
      log.textContent = [
        "Liveness probe: simulated HTTP 500",
        `Restart count: ${this.restarts}`,
        "Readiness: NOT READY",
        "Backoff: simulated"
      ].join("\n");
      this.sendTelemetry({
        liveness: "FAILED",
        readiness: "NOT READY",
        restarts: this.restarts,
        mode: "DEMONSTRATOR"
      });
      return;
    }

    state.textContent = "HEALTHY";
    log.textContent = [
      "Liveness probe: simulated HTTP 200",
      "Readiness: READY",
      `Restart count: ${this.restarts}`
    ].join("\n");

    this.sendTelemetry({
      liveness: "PASSED",
      readiness: "READY",
      restarts: this.restarts,
      mode: "DEMONSTRATOR"
    });
  }

  destroy() {
    this.mount.replaceChildren();
  }
}

window.ContainerProberEngine = ContainerProberEngine;
