import express from "express";
import crypto from "node:crypto";
import { Kafka } from "kafkajs";
import { appendEvent, initStore, loadEvents } from "./store.js";
import type { WorkEvent } from "./types.js";
import { prometheus, recordError, recordEvent, recordRequest } from "./metrics.js";

const app = express();
const host = process.env.HOST ?? "0.0.0.0";
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb", strict: true }));
app.use((_, res, next) => {
  recordRequest();
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  res.on("finish", () => { if (res.statusCode >= 500) recordError(); });
  next();
});
const kafkaBroker = process.env.KAFKA_BROKER ?? "localhost:9092";
const kafkaTopic = process.env.KAFKA_TOPIC ?? "work-events";
const kafka = new Kafka({ clientId: "eventforge-api", brokers: [kafkaBroker] });
const producer = kafka.producer();
let kafkaConnected = false;
async function connectKafka(): Promise<void> { try { await producer.connect(); kafkaConnected = true; } catch { setTimeout(connectKafka, 5000); } }
async function publish(event: WorkEvent): Promise<boolean> { if (!kafkaConnected) return false; try { await producer.send({ topic: kafkaTopic, messages: [{ key: event.payload.itemId, value: JSON.stringify(event) }] }); return true; } catch { kafkaConnected = false; return false; } }
app.get("/health", async (_, res) => { try { const db = process.env.DATABASE_URL || process.env.ConnectionStrings__postgres ? "postgresql" : "file"; if (process.env.DATABASE_URL || process.env.ConnectionStrings__postgres) await loadEvents(); res.json({ status: "ok", service: "eventforge-api", version: "1.5", kafka: kafkaConnected ? "connected" : "unavailable", database: db }); } catch { res.status(503).json({ status: "degraded", service: "eventforge-api", kafka: kafkaConnected ? "connected" : "unavailable", database: "unavailable" }); } });
app.get("/metrics", (_, res) => { res.type("text/plain").send(prometheus()); });
app.get("/api/events", async (_, res) => { const events = await loadEvents(); res.json({ count: events.length, events }); });
app.post("/api/events", async (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  if (!title || title.length > 500) return res.status(400).json({ error: "title must be between 1 and 500 characters" });
  const event: WorkEvent = { id: crypto.randomUUID(), type: "work.item.created", occurredAt: new Date().toISOString(), source: "eventforge-api", payload: { itemId: crypto.randomUUID(), title } };
  await appendEvent(event);
  recordEvent();
  res.status(201).json({ ...event, delivery: { persisted: true, kafka: await publish(event) } });
});
const port = Number(process.env.PORT ?? 4100);
app.listen(port, host, async () => { await initStore(); console.log(`EventForge API listening on ${host}:${port}`); await connectKafka(); });
process.on("SIGTERM", async () => { if (kafkaConnected) await producer.disconnect(); process.exit(0); });
process.on("SIGINT", async () => { if (kafkaConnected) await producer.disconnect(); process.exit(0); });
