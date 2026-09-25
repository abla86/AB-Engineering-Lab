# Portfolio consolidation

This repository is the canonical home for small engineering exercises and reusable lab modules that do not justify a standalone product repository.

## Canonical product repositories

| Area | Canonical repository | Scope |
|---|---|---|
| Evidence & research | `complete-evidence-appraisal-tool` | appraisal, research workflow, provenance, privacy, implementation research and evidence traceability |
| Security | `CodeSentinel` | GitHub App, repository intelligence, verification, governance and security |
| Books | `book-forge` | AI-assisted book production, story bible, continuity and versioning |
| HealthTech | `HealthTechDeviceApi` | device API, DICOM, dashboard and healthcare data |
| Workforce / competence | `workforce-competence-management` | workforce competence, planning and related healthcare workforce functionality |
| Cloud & DevOps | `azure-kubernetes-showcase` | Azure, Kubernetes, Docker, IaC, CI/CD and observability |
| Engineering labs | `AB-Engineering-Lab` | small demos, learning exercises and reusable technical experiments |
| AI agents | `agenttrace` | agent tracing, provenance, policy and audit/integrity |
| Autonomous builder | `Autonomous-Multi-Agent-App-Builder` | autonomous application-builder prototype |
| Operations | `wpww-warroom` | operations, resilience, simulation and bounded security experiments |
| Portfolio | `developer-portfolio` / profile repo | presentation and navigation only |

## Consolidated legacy functionality

The following standalone repositories are legacy implementations or learning exercises. Their role is now represented by canonical repositories rather than separate portfolio products.

### Engineering Lab

- `todo-app`
- `react-task-dashboard`
- `task-manager`
- `calculator`
- `javascript-counter`
- `advanced-javascript-counter`
- `digital-clock`
- `hello-html`
- `race-condition`

These are learning/demo implementations. New work belongs in `AB-Engineering-Lab`; they should not be revived as separate active products.

### Workforce / HealthTech

- `healthcare-workforce-sql` → `workforce-competence-management`
- `shift-competence-planner` → `workforce-competence-management`
- `healthtech-dashboard` → `HealthTechDeviceApi` (already merged)

### Research

- `local-deep-research` is historical research tooling and is not an active flagship product. Evidence-specific functionality belongs in `complete-evidence-appraisal-tool`; generic engineering experiments belong in `AB-Engineering-Lab`.

## Repositories that are not candidates for portfolio migration

These are upstream, reference, fork or externally-originated material and should not be copied into an ABLA86 product merely to reduce repository count:

- `cross-device-sdk` — preserved upstream/reference material
- `HA-Desktop-Widget` — substantial Home Assistant desktop application; do not claim authorship of upstream functionality
- `SafetyKatz` — external security tooling/reference; do not repackage as original portfolio functionality
- `home-assistant-voice-pe` — Home Assistant upstream/reference material unless there is a clearly identified original modification worth preserving
- `core`, `documentation`, `device-tools`, `eufy_security` — require provenance check before any destructive action

## Training repositories

These contain GitHub Skills exercises rather than original portfolio functionality:

- `intro`
- `skills-introduction-to-git`
- `skills-getting-started-with-github-copilot`

They can be removed from the portfolio repository list without migration.

## Destructive-cleanup queue

The intended end state is:

1. Keep the canonical active repositories listed above.
2. Keep archived history only where it has provenance or learning value.
3. Remove obsolete standalone repositories after verifying that no unique authored functionality remains.
4. Never recreate `Total-control-defence-lab-` or `shift-competence-planner`; both are already deleted/consolidated.
5. Do not delete upstream/reference repositories merely because they are old.

## 2026-09-23 audit

The GitHub inventory was rechecked. The active repository set is intentionally small and canonical. The old learning repositories remain archived; repository-level deletion requires GitHub repository administration and is not performed by the connected GitHub file/commit interface.

## Consolidation rules

1. One canonical implementation per capability.
2. Shared functionality becomes a module/package inside the canonical product.
3. A project may remain separate only when it has independent deployment, security boundaries or a materially different audience.
4. Do not maintain duplicate implementations merely to preserve different names.
5. Preserve historical source before destructive cleanup.
6. Never publish credentials, private keys, personal data or other secrets.
7. A README claim is not evidence of implementation; capabilities must exist in executable code or be explicitly marked as planned.
