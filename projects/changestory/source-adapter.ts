import type { ChangeEvent } from "./engine/types";

export interface SourceAdapter {
  readonly name: string;
  normalize(input: unknown): Promise<ChangeEvent[]>;
}

/*
  Connector boundary for real integrations.

  Intended adapters:
  - GitHub
  - Jira
  - Azure
  - CSV
  - Webhooks

  The core evidence/story engine must not depend on a vendor SDK.
*/
