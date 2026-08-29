export type EvidenceLevel = "OBSERVED" | "CORRELATED" | "INFERRED" | "VERIFIED";

export type EventType =
  | "configuration_changed"
  | "automation_changed"
  | "telemetry"
  | "user_impact"
  | "incident_created"
  | "rollback"
  | "recovery";

export interface ChangeEvent {
  id: string;
  timestamp: string;
  source: string;
  actor?: string;
  type: EventType;
  entityId: string;
  entityName: string;
  summary: string;
  before?: string;
  after?: string;
  metric?: { name: string; value: number; baseline?: number; unit?: string };
}

export interface Dependency {
  from: string;
  to: string;
  relation: "DEPENDS_ON" | "TRIGGERS" | "REPORTS_TO";
}

export interface Evidence {
  eventId: string;
  level: EvidenceLevel;
  statement: string;
  reason: string;
}

export interface ChangeStory {
  id: string;
  title: string;
  events: ChangeEvent[];
  dependencies: Dependency[];
  evidence: Evidence[];
  confidence: number;
  outcome: "NO_OBSERVED_IMPACT" | "POSSIBLE_IMPACT" | "UNEXPECTED_OUTCOME" | "RECOVERED";
  nextActions: string[];
}
