export type WorkEvent = {
  readonly id: string;
  readonly type: "created" | "updated" | "deleted";
  readonly bytes: number;
};

export type EventSummary = {
  readonly total: number;
  readonly totalBytes: number;
  readonly byType: Readonly<Record<WorkEvent["type"], number>>;
};

export const sampleEvents: readonly WorkEvent[] = [
  { id: "e-1", type: "created", bytes: 512 },
  { id: "e-2", type: "updated", bytes: 128 },
  { id: "e-3", type: "updated", bytes: 256 },
  { id: "e-4", type: "deleted", bytes: 0 },
];

export function summarizeEvents(events: readonly WorkEvent[]): EventSummary {
  const byType = { created: 0, updated: 0, deleted: 0 };
  let totalBytes = 0;
  for (const event of events) {
    if (!Number.isFinite(event.bytes) || event.bytes < 0) {
      throw new RangeError(`Invalid byte count for event ${event.id}`);
    }
    byType[event.type] += 1;
    totalBytes += event.bytes;
  }
  return { total: events.length, totalBytes, byType };
}
