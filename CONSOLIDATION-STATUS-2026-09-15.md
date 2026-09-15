# Repository consolidation status — 2026-09-15

This file records code that has actually been migrated into the canonical engineering laboratory and separates verified code migration from repository administration.

## Completed migrations

### `devops-lab`

- `labs/devops/container-prober.js`
- `labs/devops/pipeline-dag.js`

The migrated implementations are standalone browser modules with guarded telemetry callbacks and explicit exports.

### `security-lab`

- `labs/security/threat-map.html`

The migrated artifact is a self-contained synthetic demonstration and does not perform real intrusion or exploitation.

## Repository status changes

The following active repositories now carry explicit legacy status after their reusable functionality was consolidated or their overlap was confirmed:

- `devops-lab`
- `security-lab`
- `shift-competence-planner`

## Canonical policy

- Active engineering work belongs in canonical repositories.
- Historical source repositories are not treated as additional active products.
- Functionality is migrated only after dependency and behavior review.
- A migration is not considered complete merely because a README points to another repository.

## Verification boundary

GitHub-side source inspection verifies the migrated source content. CI status is only reported as passing when GitHub Actions has actually produced a successful run for the relevant commit. Local execution is not claimed when the execution environment cannot reach GitHub.

## Administration boundary

Code consolidation and repository archival/deletion are separate operations. The connected GitHub interface can modify repository contents but does not expose the repository-administration operation required to archive or delete a repository. Such repositories remain available for provenance until that administrative operation is available.
