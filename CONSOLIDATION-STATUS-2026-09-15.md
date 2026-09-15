# Repository consolidation status — 2026-09-15

This file records code that has actually been migrated into the canonical engineering laboratory.

## Completed migrations

### `devops-lab`

- `labs/devops/container-prober.js`
- `labs/devops/pipeline-dag.js`

The migrated implementations are standalone browser modules with guarded telemetry callbacks and explicit exports.

### `security-lab`

- `labs/security/threat-map.html`

The migrated artifact is a self-contained synthetic demonstration and does not perform real intrusion or exploitation.

## Canonical policy

- Active engineering work belongs in canonical repositories.
- Historical source repositories are not treated as additional active products.
- Functionality is migrated only after dependency and behavior review.
- A migration is not considered complete merely because a README points to another repository.
