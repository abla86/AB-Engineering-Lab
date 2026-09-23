# Repository Consolidation Map

**Purpose:** Group the current `abla86` repositories by capability before detailed review and consolidation. This document is an inventory and decision map; it does not by itself delete or merge repositories.

## Canonical portfolio rule

- One canonical implementation per capability.
- Historical/learning implementations belong in `AB-Engineering-Lab` when they are not independently valuable.
- Domain systems remain separate only when they provide a distinct product or architectural capability.
- A repository is not considered canonical merely because its name sounds complete; implementation quality and coverage must be reviewed.

## Group A — Evidence / research / methodology

**Very strong overlap candidates**

- `complete-evidence-appraisal-tool` — primary candidate for canonical evidence-appraisal system
- `complete-evidence-appraisal-tool-` — likely duplicate/parallel version; compare before disposition
- `evidence-appraisal-tool` — earlier evidence-appraisal implementation; compare and harvest useful functionality
- `EvidenceOps-AI` — evidence/research operations candidate; review whether capabilities belong in the canonical system
- `Evidence-OS` — evidence/research operating-system candidate
- `ResearchForge-OS` — research workflow/OS candidate
- `CritiqEvidence` — critical appraisal/evidence candidate
- `evidence-practice-proof` — evidence/practice/traceability candidate
- `academic-research-engine` — academic research/search candidate
- `local-deep-research` — research-engine candidate
- `research-privacy-inspector` — research/privacy capability; potentially a module rather than a standalone product
- `Artikkelanalysator-Pr` — article analysis candidate
- `Sjelden-Kunnskap` — knowledge/research candidate
- `Curiosity-Gap` — research/knowledge candidate
- `-SPSS-Survival-Manual` — statistical learning/reference material; likely educational rather than product-scale

**Review goal:** determine whether these should become one evidence/research platform with clearly separated modules, or two genuinely distinct products (e.g. evidence appraisal vs general research engine).

## Group B — Book / publishing / creative AI

**Strong overlap candidates**

- `BookForge-AI` — current canonical candidate for AI book-production platform
- `book-forge` — earlier/parallel book-forging implementation; compare and harvest
- `Bookplattform` — publishing/platform candidate; compare against BookForge
- `Curator-AI-Studio` — AI content/curation candidate
- `-Loreforge-Fantasy-Character-Foundry` — creative character-generation candidate; likely module/capability unless independently distinct

**Review goal:** make `BookForge-AI` the canonical product only if it demonstrably covers the useful functionality in the other book/creative repositories.

## Group C — Healthcare / workforce / care systems

**Strong overlap candidates**

- `healthtech-dashboard` — canonical candidate for healthcare dashboard/application surface
- `HealthTechDeviceApi` — device/API backend; likely service/module of the healthcare platform
- `healthcare-data-analyzer` — healthcare analytics capability
- `healthcare-workforce-sql` — workforce data/SQL capability
- `shift-competence-planner` — staffing/competence planning capability
- `workforce-competence-management` — workforce/competence management; strong overlap with planner
- `SeniorCare-Guardian` — senior-care capability
- `TryggHjem-System` — home-care/safety capability

**Review goal:** decide whether the healthcare portfolio should be one platform with bounded modules or two products (e.g. workforce operations vs patient/home-care technology).

## Group D — Implementation / change / traceability

- `implementation-trace` — implementation traceability
- `change-impact-mapper` — change-impact mapping
- `AB-Engineering-Lab/projects/changestory` — existing consolidation target for change-impact/traceability

**Likely direction:** `ChangeStory` remains the canonical implementation/change-impact demonstration; standalone experiments should be harvested into it or retained only as history.

## Group E — GitHub / agentic engineering / security / operations

- `CodeSentinel` — canonical candidate for GitHub App / agentic engineering / CI/security/release analysis
- `git-secrets-sentinel` — secret/security sentinel capability
- `ai-incident-command-center` — AI incident/operations capability
- `agenttrace` — agent tracing/observability capability
- `processguard` — process/guard capability
- `DriftVakt` — operations/drift monitoring candidate
- `wpww-warroom` — war-room/operations candidate
- `My-own-war-room` — parallel war-room candidate
- `cyber-vault` — security/cyber capability
- `security-lab` — contained defensive learning lab
- `SafetyKatz` — security tooling; historical/technical review required
- `race-condition` — engineering/security experiment; likely lab material

**Review goal:** separate portfolio-safe defensive engineering from operational/private material and consolidate overlapping agent/incident/security tooling under the appropriate canonical system or lab.

## Group F — Cloud / platform / DevOps

- `azure-kubernetes-showcase` — canonical Azure/Kubernetes/Docker/CI/CD showcase
- `cloud-waste-auditor` — cloud cost/waste capability; review whether independent enough
- `devops-lab` — DevOps learning material
- `systems-lab` — systems engineering learning material
- `lab-core` — generic lab/core candidate
- `AB-Engineering-Lab` — consolidation destination for small demonstrations

**Likely direction:** keep `azure-kubernetes-showcase` as the flagship cloud/platform project; fold small generic demonstrations into `AB-Engineering-Lab`.

## Group G — Device / Home Assistant / cross-device

- `eufy_security` — historical device/security integration
- `home-assistant-voice-pe` — Home Assistant voice experiment
- `HA-Desktop-Widget` — Home Assistant desktop/widget system
- `cross-device-sdk` — cross-device capability
- `device-tools` — device tooling
- `Robotics-Spatial-Understanding.` — robotics/spatial capability; likely separate if technically substantive

**Review goal:** distinguish Home Assistant-specific work from general device/robotics engineering. Do not merge unrelated robotics capability merely because it is device-oriented.

## Group H — Frontend / JavaScript / application-learning exercises

- `hello-html`
- `javascript-counter`
- `advanced-javascript-counter`
- `digital-clock`
- `calculator`
- `todo-app`
- `task-manager`
- `react-task-dashboard`
- `FastAPI-Learning`
- `Min-tekstbehandling`
- `skills-introduction-to-git`
- `skills-getting-started-with-github-copilot`

**Likely direction:** these are historical/learning evidence, not separate flagship products. `AB-Engineering-Lab` is the consolidation destination where useful examples should be retained.

## Group I — Portfolio / presentation / documentation

- `developer-portfolio` — canonical portfolio presentation candidate
- `ABandersen.com` — older portfolio/site candidate; compare before disposition
- `ab-portfolio` — older portfolio candidate; compare before disposition
- `documentation` — historical documentation repository
- `abla86` — GitHub profile repository

**Review goal:** keep one canonical public portfolio and use the profile repository only for GitHub profile presentation where appropriate.

## Group J — Finance / games / other distinct domains

- `Finance-research-agent` — finance/research agent; review independently from general research tooling
- `crypto-strategy-lab` — crypto/finance experiment; keep separate if substantive
- `game-lab` — games/interactive experimentation; likely lab material
- `AI-Trivia-Host` — AI/game/interactive application; review against `game-lab`
- `Morpho.ai` — distinct AI concept; requires code-level review before grouping further
- `-NAME-DISCOVERY-VERIFICATION-ENGINE` — name discovery/verification; potentially reusable research/agent capability but not assigned to a canonical system yet

## Group K — Generic lab / architecture buckets

- `AB-Engineering-Lab`
- `lab-core`
- `data-lab`
- `systems-lab`
- `devops-lab`
- `security-lab`

These should not automatically become separate products. Their contents should be reviewed and placed into the most appropriate canonical showcase.

## Explicit duplicate/parallel candidates for first review

1. `complete-evidence-appraisal-tool` ↔ `complete-evidence-appraisal-tool-` ↔ `evidence-appraisal-tool`
2. `BookForge-AI` ↔ `book-forge` ↔ `Bookplattform`
3. `shift-competence-planner` ↔ `workforce-competence-management`
4. `implementation-trace` ↔ `change-impact-mapper` ↔ `ChangeStory`
5. `developer-portfolio` ↔ `ABandersen.com` ↔ `ab-portfolio`
6. `task-manager` ↔ `react-task-dashboard` ↔ `todo-app`
7. `javascript-counter` ↔ `advanced-javascript-counter`
8. `wpww-warroom` ↔ `My-own-war-room`
9. `game-lab` ↔ `AI-Trivia-Host`
10. `AB-Engineering-Lab` ↔ `lab-core` ↔ the smaller `*-lab` repositories

## Status vocabulary

- **CANONICAL CANDIDATE** — likely final home, but code review still required.
- **MERGE CANDIDATE** — overlapping implementation whose useful functionality should be compared/harvested.
- **MODULE CANDIDATE** — capability that may belong inside another product.
- **HISTORICAL** — useful learning/progression evidence; not a separate flagship.
- **SEPARATE** — keep independently only after confirming a distinct capability.
- **PRIVATE REVIEW** — do not expose or merge into public portfolio until content/security review is complete.

## Next review order

1. Evidence/research cluster
2. Book/publishing cluster
3. Healthcare/workforce cluster
4. GitHub/agent/security cluster
5. Implementation/change cluster
6. Portfolio cluster
7. Learning/lab repositories
8. Remaining distinct-domain repositories

**Important:** Names and repository metadata establish candidate groupings only. Final merge/disposition decisions require inspection of README, file tree, dependencies, tests, and actual functionality in each candidate repository.
