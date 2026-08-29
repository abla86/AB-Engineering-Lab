import type { ChangeEvent } from "./types";

export function temporalCorrelation(anchor: ChangeEvent, candidate: ChangeEvent): {
  score: number;
  reasons: string[];
} {
  const delta = Math.abs(
    new Date(candidate.timestamp).getTime() - new Date(anchor.timestamp).getTime()
  );

  let score = 0;
  const reasons: string[] = [];

  if (delta <= 10 * 60 * 1000) {
    score += 35;
    reasons.push("temporal proximity <= 10 minutes");
  } else if (delta <= 30 * 60 * 1000) {
    score += 15;
    reasons.push("temporal proximity <= 30 minutes");
  }

  if (candidate.entityId === anchor.entityId) {
    score += 35;
    reasons.push("same entity");
  }

  if (
    anchor.type === "configuration_changed" &&
    ["telemetry", "user_impact", "incident_created"].includes(candidate.type)
  ) {
    score += 20;
    reasons.push("post-change operational signal");
  }

  return { score: Math.min(score, 100), reasons };
}
