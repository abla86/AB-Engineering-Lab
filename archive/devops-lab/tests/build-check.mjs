import fs from "node:fs";

const required = [
  "index.html",
  "js/lab-runtime.js",
  "js/engines/pipeline-dag.js",
  "js/engines/container-prober.js",
  "package.json"
];

for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}

const html = fs.readFileSync("index.html", "utf8");
const runtime = fs.readFileSync("js/lab-runtime.js", "utf8");
const dag = fs.readFileSync("js/engines/pipeline-dag.js", "utf8");
const prober = fs.readFileSync("js/engines/container-prober.js", "utf8");

for (const file of [
  "js/lab-runtime.js",
  "js/engines/pipeline-dag.js",
  "js/engines/container-prober.js"
]) {
  if (!html.includes(file)) throw new Error(`Missing script reference: ${file}`);
}

if (!runtime.includes("registerEngine") || !runtime.includes("mountEngine") || !runtime.includes("destroy")) {
  throw new Error("Runtime engine lifecycle is incomplete");
}

for (const marker of ["Checkout","Lint/Security","Container Build","K8s Rollout"]) {
  if (!dag.includes(marker)) throw new Error(`Pipeline stage missing: ${marker}`);
}

if (!prober.includes("healthy") || !prober.includes("restarts") || !prober.includes("simulated HTTP 200")) {
  throw new Error("Container prober health state is incomplete");
}

console.log("DevOps Lab build integrity passed.");
