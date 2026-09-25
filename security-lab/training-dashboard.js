const $ = (id) => document.getElementById(id);

async function api(path, options) {
  const request = options || {};
  request.headers = Object.assign({"X-AB-Lab-Request": "1"}, request.headers || {});
  const response = await fetch(path, request);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function card(title, text) {
  const el = document.createElement("article");
  el.className = "card";
  const h = document.createElement("h3");
  h.textContent = title;
  const p = document.createElement("p");
  p.textContent = text;
  el.append(h, p);
  return el;
}

async function loadArena() {
  const catalog = await api("/api/arena/catalog");
  $("attack").replaceChildren(...catalog.attacks.map(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.id + " — " + item.technique;
    return option;
  }));
  $("defense").replaceChildren(...catalog.defenses.map(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    return option;
  }));
  Array.from($("defense").options).slice(0, 2).forEach(option => { option.selected = true; });
  await loadScoreboard();
}

async function loadScoreboard() {
  const data = await api("/api/arena/scoreboard");
  $("scoreboard").replaceChildren(
    card("Battles", String(data.battles)),
    card("Red breakthroughs", String(data.attacker_wins)),
    card("Blue containment", String(data.defender_wins)),
    card("Contested", String(data.contested)),
    card("Blue containment rate", data.defense_rate + "%")
  );
  const timeline = $("timeline");
  timeline.replaceChildren();
  data.last_battles.slice().reverse().forEach(item => {
    timeline.append(card(
      item.attack + " → " + item.outcome,
      new Date(item.timestamp).toLocaleString() + " · signature " + item.signature.slice(0, 16)
    ));
  });
}

async function runBattle() {
  const defenses = Array.from($("defense").selectedOptions).map(option => option.value);
  if (!defenses.length) throw new Error("Select at least one blue control.");
  const data = await api("/api/arena/battle", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      attack: $("attack").value,
      defenses,
      mutations: {
        intensity: Number($("intensity").value),
        burst: Number($("burst").value),
        source_count: Number($("source_count").value),
        delay: Number($("delay").value)
      }
    })
  });
  $("battleResult").textContent = JSON.stringify(data, null, 2);
  await loadScoreboard();
}

async function runMatrix() {
  const attacks = [ $("attack").value ];
  const defenses = Array.from($("defense").selectedOptions).map(option => option.value);
  const data = await api("/api/arena/matrix", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({attacks, defenses})
  });
  $("battleResult").textContent = JSON.stringify(data, null, 2);
}

async function loadTraining() {
  const data = await api("/api/modules");
  const done = data.modules.filter(m => m.completed).length;
  $("progress").textContent = done + " / " + data.modules.length + " modules completed";
  $("fill").style.width = (done / data.modules.length * 100) + "%";
  const coverage = await api("/api/verifiers");
  $("verificationCoverage").textContent =
    coverage.modules.filter(m => m.automated).length + " / " +
    coverage.modules.length + " modules have automated verification";
  $("modules").replaceChildren();
  data.modules.forEach(m => {
    const el = document.createElement("article");
    el.className = "card" + (m.completed ? " done" : "");
    const title = document.createElement("h2");
    title.textContent = m.id + " — " + m.title;
    const level = document.createElement("small");
    level.textContent = m.level;
    const objectives = document.createElement("p");
    objectives.textContent = m.objectives.join(". ") + ".";
    const lab = document.createElement("p");
    lab.textContent = "Lab: " + m.lab;
    const button = document.createElement("button");
    button.textContent = m.completed ? "Completed" : "Verify & complete";
    button.disabled = m.completed;
    button.onclick = () => complete(m.id);
    el.append(level, title, objectives, lab, button);
    $("modules").append(el);
  });
  const scenarios = await api("/api/scenarios");
  $("scenarios").replaceChildren();
  scenarios.scenarios.forEach(s => {
    $("scenarios").append(card(
      s.id + " — " + s.title,
      s.evidence + " Verification: " + s.verification
    ));
  });
}

async function verify(id) {
  const data = await api("/api/verify", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({module_id: id})
  });
  if (data.status === "passed" || data.status === "manual") return true;
  throw new Error(data.output || "Verification failed");
}

async function complete(id) {
  try {
    await verify(id);
    const evidence = window.prompt("Evidence for completing this module:", "");
    if (!evidence || evidence.trim().length < 10) return;
    await api("/api/progress/complete", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({module_id: id, evidence: evidence.trim()})
    });
    await loadTraining();
  } catch (error) {
    window.alert(error.message);
  }
}

$("battle").onclick = () => runBattle().catch(error => { $("battleResult").textContent = error.message; });
$("matrix").onclick = () => runMatrix().catch(error => { $("battleResult").textContent = error.message; });
$("reset").onclick = async () => {
  if (!window.confirm("Reset all local training progress?")) return;
  await api("/api/progress/reset", {method: "POST", headers: {"Content-Type": "application/json"}, body: "{}"});
  await loadTraining();
};

Promise.all([loadArena(), loadTraining()]).catch(error => {
  $("battleResult").textContent = error.message;
});
