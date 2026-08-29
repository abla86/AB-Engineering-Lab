import type { ChangeEvent, Dependency } from "./types";

export const demoEvents: ChangeEvent[] = [
  {
    id: "change-001",
    timestamp: "2026-08-30T09:14:02Z",
    source: "change-system",
    actor: "operator",
    type: "configuration_changed",
    entityId: "workflow-27",
    entityName: "Customer onboarding workflow",
    summary: "Workflow changed from version 41 to version 42.",
    before: "v41",
    after: "v42"
  },
  {
    id: "impact-001",
    timestamp: "2026-08-30T09:21:17Z",
    source: "telemetry",
    type: "telemetry",
    entityId: "flow-14",
    entityName: "CRM synchronisation",
    summary: "Synchronisation failures increased to 428 events.",
    metric: { name: "sync_failures", value: 428, baseline: 4, unit: "events" }
  },
  {
    id: "impact-002",
    timestamp: "2026-08-30T09:27:44Z",
    source: "transaction-monitor",
    type: "user_impact",
    entityId: "crm",
    entityName: "CRM transactions",
    summary: "23 customer records failed synchronisation."
  },
  {
    id: "recovery-001",
    timestamp: "2026-08-30T10:12:02Z",
    source: "change-system",
    actor: "operator",
    type: "rollback",
    entityId: "workflow-27",
    entityName: "Customer onboarding workflow",
    summary: "Workflow reverted from version 42 to version 41."
  }
];

export const demoDependencies: Dependency[] = [
  { from: "workflow-27", to: "flow-14", relation: "TRIGGERS" },
  { from: "flow-14", to: "crm", relation: "DEPENDS_ON" }
];
