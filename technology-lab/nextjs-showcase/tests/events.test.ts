import { describe, expect, it } from "vitest";
import { GET, type HealthResponse } from "../app/api/health/route";
import { sampleEvents, summarizeEvents } from "../lib/events";

describe("summarizeEvents", () => {
  it("counts events by type and totals bytes", () => {
    const summary = summarizeEvents(sampleEvents);
    expect(summary.total).toBe(4);
    expect(summary.totalBytes).toBe(896);
    expect(summary.byType).toEqual({ created: 1, updated: 2, deleted: 1 });
  });

  it("rejects negative byte counts", () => {
    expect(() => summarizeEvents([{ id: "bad", type: "created", bytes: -1 }])).toThrow(RangeError);
  });
});

describe("GET /api/health", () => {
  it("returns a typed ok response", async () => {
    const response = await GET();
    const body = (await response.json()) as HealthResponse;
    expect(response.status).toBe(200);
    expect(body).toEqual({ status: "ok", events: 4 });
  });
});
