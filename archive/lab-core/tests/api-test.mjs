import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import { fileURLToPath } from "node:url";

const port = 33000 + (process.pid % 1000);
const child = spawn(process.execPath, ["server.js"], { cwd: fileURLToPath(new URL("..", import.meta.url)), env: { ...process.env, PORT: String(port) }, stdio: "ignore" });
await new Promise((resolve, reject) => { child.once("spawn", resolve); child.once("error", reject); });

function rawGet(pathname) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port, path: pathname, method: "GET" }, res => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", chunk => { body += chunk; });
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on("error", reject);
    req.end();
  });
}

try {
  for (let attempt = 0; attempt < 20; attempt++) {
    try { if ((await rawGet("/api/health")).status === 200) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 50));
    if (attempt === 19) throw new Error("Server did not become ready");
  }
  for (const [path, check] of [
    ["/api/health", body => assert.equal(body.status, "healthy")],
    ["/api/info", body => assert.equal(body.labs, 6)],
    ["/api/labs", body => assert.equal(body.labs.length, 6)]
  ]) {
    const response = await rawGet(path);
    assert.equal(response.status, 200);
    assert.equal(response.headers["content-type"], "application/json; charset=utf-8");
    assert.equal(response.headers["x-content-type-options"], "nosniff");
    check(JSON.parse(response.body));
  }
  const page = await rawGet("/");
  assert.equal(page.status, 200);
  assert.match(page.body, /LAB CORE/);
  assert.equal(page.headers["x-content-type-options"], "nosniff");
  assert.match(page.headers["content-security-policy"], /script-src 'self'/);

  for (const asset of ["/css/lab-core.css", "/js/lab-core.js"]) {
    const response = await rawGet(asset);
    assert.equal(response.status, 200);
  }

  const traversal = await rawGet("/%2e%2e/server.js");
  assert.equal(traversal.status, 404);
  const missing = await rawGet("/does-not-exist");
  assert.equal(missing.status, 404);
  const method = await new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port, path: "/api/health", method: "POST" }, res => resolve(res));
    req.on("error", reject);
    req.end();
  });
  assert.equal(method.statusCode, 405);
  assert.equal(method.headers.allow, "GET");
  assert.equal(method.headers["x-content-type-options"], "nosniff");
  assert.equal(method.headers["cache-control"], "no-store");
  console.log("LAB CORE API tests passed.");
} finally {
  if (child.exitCode === null && !child.killed) {
    await new Promise(resolve => { child.once("exit", resolve); child.kill("SIGTERM"); });
  }
}