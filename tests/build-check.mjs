import fs from "node:fs";

const required = [
  "index.html",
  "css/lab-theme.css",
  "js/lab-runtime.js",
  "js/engines/wasm-benchmark.js",
  "js/engines/worker-pool.js",
  "package.json"
];

for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
}

const html = fs.readFileSync("index.html", "utf8");
const runtime = fs.readFileSync("js/lab-runtime.js", "utf8");
const wasm = fs.readFileSync("js/engines/wasm-benchmark.js", "utf8");
const workers = fs.readFileSync("js/engines/worker-pool.js", "utf8");

for (const file of [
  "js/lab-runtime.js",
  "js/engines/wasm-benchmark.js",
  "js/engines/worker-pool.js"
]) {
  if (!html.includes(file)) throw new Error(`Missing reference in index.html: ${file}`);
}

if (!html.includes('href="css/lab-theme.css"')) {
  throw new Error("Missing stylesheet reference in index.html");
}

if (!html.includes('registerEngine("wasm"') || !html.includes('registerEngine("workers"')) {
  throw new Error("Both engine registrations are required");
}

if (!wasm.includes("WebAssembly.instantiate")) {
  throw new Error("WASM engine is not using the WebAssembly API");
}

if (!workers.includes("new Worker(")) {
  throw new Error("Worker engine is not using the Worker API");
}

if (!runtime.includes("registerEngine") || !runtime.includes("mountEngine")) {
  throw new Error("Runtime registration/mount lifecycle is incomplete");
}

console.log("Systems Lab build integrity passed.");
