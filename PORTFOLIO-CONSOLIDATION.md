# Portfolio consolidation

This repository is the canonical home for small engineering exercises and reusable lab modules that do not justify a standalone product repository.

## Canonical product repositories (updated 2026-09-19)

| Area | Canonical repository | Scope |
|---|---|---|
| Evidence & research | `complete-evidence-appraisal-tool` | appraisal, research workflow, provenance, privacy, implementation research, evidence traceability |
| Security | `CodeSentinel` | GitHub App, repository intelligence, verification, governance, security |
| Books | `book-forge` | AI-assisted book production, story bible, continuity, versioning |
| HealthTech | `HealthTechDeviceApi` | device API, DICOM, dashboard, healthcare data (workforce/competence: `workforce-competence-management`, integration under review) |
| Cloud & DevOps | `azure-kubernetes-showcase` | Azure, Kubernetes, Docker, IaC, CI/CD, observability |
| Engineering labs | `AB-Engineering-Lab` | small demos, learning exercises and reusable technical experiments |
| AI agents | `agenttrace` | agent tracing, provenance, policy, audit/integrity |
| Operations / war room | `wpww-warroom` | operations, resilience, simulation, controlled security experiments |
| Portfolio | `developer-portfolio` / profile repo | presentation and navigation only |

Merged legacy repositories are kept under `archive/<name>/` in their canonical repository (history preserved). `archive/` is excluded from CI source scans.

## Consolidated evidence/research projects

The following projects belong to the Evidence platform rather than separate products:

- `evidence-appraisal-tool`
- `complete-evidence-appraisal-tool-`
- `Evidence-OS`
- `EvidenceOps-AI`
- `ResearchForge-OS`
- `CritiqEvidence`
- `academic-research-engine`
- `research-privacy-inspector`
- `Artikkelanalysator-Pr`
- `implementation-trace`
- `evidence-practice-proof`
- `change-impact-mapper`

The canonical Evidence repository already contains the broadest implementation. New functionality should be added there as modules, not copied into another repository.

## Consolidated HealthTech projects

- `HealthTechDeviceApi`
- `healthcare-data-analyzer`
- `healthcare-workforce-sql`
- `shift-competence-planner`
- `workforce-competence-management`

Keep the domain split inside the HealthTech platform where integration is useful. A standalone API is justified only when it is independently deployable or reusable.

## Consolidated Cloud/DevOps projects

- `devops-lab`
- `cloud-waste-auditor`
- `k8s-pod-doctor`
- `git-secrets-sentinel`
- `security-lab`
- `systems-lab`
- `data-lab`
- `lab-core`

Operational/security examples should become modules in the Cloud/DevOps showcase or engineering lab. CodeSentinel remains the canonical GitHub-aware software-engineering/security automation project.

## Small learning projects

The following are exercises rather than portfolio products and should not be maintained as separate active flagship projects:

- `hello-html`
- `javascript-counter`
- `advanced-javascript-counter`
- `digital-clock`
- `calculator`
- `todo-app`
- `task-manager`
- `react-task-dashboard`
- `FastAPI-Learning`
- `skills-introduction-to-git`
- `skills-getting-started-with-github-copilot`

Their useful implementation patterns belong in the Engineering Lab. Existing repositories are retained as historical source until GitHub administration is available for safe archival/removal.

## Separate projects that remain separate

Some repositories are conceptually independent and should not be forced into unrelated products:

- `game-lab` — games/prototypes
- `crypto-strategy-lab` — finance/quant research experiment
- `local-deep-research` — general local research tooling
- `BookForge-AI`, `book-forge`, `Bookplattform` — book-generation/platform work; consolidate into one book platform when the implementations are reconciled
- `AI-Trivia-Host` — standalone interactive application
- `Curator-AI-Studio` — creative/curation application
- `Morpho.ai` — standalone AI concept
- `Robotics-Spatial-Understanding.` — robotics research/prototype
- `-Loreforge-Fantasy-Character-Foundry` — creative application

These should only be merged when they share executable functionality, not merely because they use AI.

## 2026-09-23 repository audit

The current GitHub inventory was rechecked against repository content and the existing consolidation records.

### Confirmed deleted legacy repository

- `Total-control-defence-lab-` has been deleted. Its active security engineering was consolidated into `CodeSentinel`, `agenttrace` and bounded `AB-Engineering-Lab/security-lab` material.
- It must not be presented as an active repository or linked as a current project.

### Confirmed non-duplicate

- `Autonomous-Multi-Agent-App-Builder` is retained as a separate application. It is an autonomous software-engineering application builder, whereas `agenttrace` is a reusable tracing/policy/audit layer and `CodeSentinel` is GitHub/repository verification. The overlap is conceptual, not a duplicate implementation.

## Consolidation rules

1. One canonical implementation per capability.
2. Shared functionality becomes a module/package inside the canonical product.
3. A project may be split into two repositories only when the parts have independent deployment, security boundaries, or materially different audiences.
4. Do not maintain duplicate implementations merely to preserve different names.
5. Preserve historical source before destructive cleanup.
6. Never publish credentials, private keys, personal data or other secrets when making a private project public.
7. A README claiming a capability is not sufficient; the capability must exist in executable code or be explicitly marked as planned.
