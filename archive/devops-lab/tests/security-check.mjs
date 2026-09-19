import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");

if (!html.includes("Content-Security-Policy")) {
  throw new Error("Content-Security-Policy is missing");
}

if (html.includes("X-Content-Type-Options")) {
  throw new Error("X-Content-Type-Options must be delivered as an HTTP response header, not a meta tag");
}

if (!html.includes('name="referrer"')) {
  throw new Error("Referrer policy metadata is missing");
}

if (html.includes("http://") || html.includes("https://")) {
  throw new Error("External network references are not allowed in the standalone lab");
}

console.log("DevOps Lab security checks passed.");
