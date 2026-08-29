import { temporalCorrelation } from "./correlation";
import type { ChangeEvent, Dependency, ChangeStory, Evidence } from "./types";

const impactTypes = new Set(["telemetry", "user_impact", "incident_created"]);

export function buildChangeStory(
  events: ChangeEvent[],
  dependencies: Dependency[]
): ChangeStory {
  if (!events.length) throw new Error("At least one event is required.");

  const ordered = [...events].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const anchor = ordered.find(e => e.type === "configuration_changed") ?? ordered[0];

  const evidence: Evidence[] = ordered.map(event => {
    if (event.id === anchor.id) {
      return {
        eventId: event.id,
        level: "OBSERVED",
        statement: event.summary,
        reason: "Direct source event."
      };
    }

    const correlation = temporalCorrelation(anchor, event);

    return {
      eventId: event.id,
      level: correlation.score >= 60 && impactTypes.has(event.type)
        ? "CORRELATED"
        : "OBSERVED",
      statement: event.summary,
      reason: correlation.reasons.join("; ") || "Direct source event."
    };
  });

  const strongestImpact = ordered
    .filter(e => impactTypes.has(e.type))
    .map(e => temporalCorrelation(anchor, e).score)
    .reduce((max, score) => Math.max(max, score), 0);

  const recovered = ordered.some(e => e.type === "rollback" || e.type === "recovery");
  const hasImpact = ordered.some(e => impactTypes.has(e.type));

  const outcome = recovered && hasImpact
    ? "RECOVERED"
    : hasImpact && strongestImpact >= 60
      ? "UNEXPECTED_OUTCOME"
      : hasImpact
        ? "POSSIBLE_IMPACT"
        : "NO_OBSERVED_IMPACT";

  return {
    id: `story-${anchor.id}`,
    title: anchor.summary,
    events: ordered,
    dependencies,
    evidence,
    confidence: Math.min(
      98,
      Math.round(45 + strongestImpact * 0.35 + (dependencies.length ? 12 : 0))
    ),
    outcome,
    nextActions: [
      "Compare the changed state before and after the event.",
      "Inspect the strongest correlated operational signal.",
      "Verify the dependency path.",
      "Review recovery activity if present."
    ]
  };
}
