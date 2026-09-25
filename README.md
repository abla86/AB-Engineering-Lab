# AB Engineering Lab

A public, runnable engineering showcase for small experiments, reusable demonstrations and technology labs that do not justify a separate flagship repository.

## Canonical portfolio boundary

The portfolio follows a strict rule: **one canonical implementation per capability**. Product-scale work belongs in the canonical systems; this repository is for smaller, independent demonstrations.

| Capability | Canonical home |
|---|---|
| Evidence appraisal, research workflow, traceability, methodology integrity | `complete-evidence-appraisal-tool` |
| GitHub App, agentic software engineering, CI/security/release analysis | `CodeSentinel` |
| Healthcare dashboard, device/API, analytics and workforce tooling | `HealthTechDeviceApi` |
| Azure, Kubernetes, Docker and CI/CD | `azure-kubernetes-showcase` |
| Small learning exercises and reusable labs | `AB-Engineering-Lab` |
| Portfolio presentation | `developer-portfolio` |

## Cyber Security Training Program

The repository now contains the canonical structured security-engineering training path.

- [Cyber Security Training Program](docs/CYBER-SECURITY-TRAINING-PROGRAM.md)
- [Master Build Prompt](docs/CYBER-SECURITY-BUILD-PROMPT.md)
- [Contained Security Lab](security-lab)

The curriculum runs from security foundations through web, network, identity, endpoint, Blue Team, Red/Blue exercises, DevSecOps, cloud/Kubernetes and an end-to-end capstone.

The training model is:

`LEARN -> UNDERSTAND -> LAB -> INVESTIGATE -> DETECT -> DEFEND -> REMEDIATE -> VERIFY`

All practical exercises are designed for systems the learner owns or is explicitly authorised to test. Vulnerable examples use local, synthetic and isolated environments.

## Existing security capabilities

### Security Lab

A contained defensive security-learning environment with intentionally vulnerable and hardened examples.

Path: `security-lab`

### Git Secrets Sentinel

A reusable Python pre-commit-style heuristic scanner for staged files.

Path: `labs/security/git-secrets-sentinel.py`

### Existing canonical security projects

The training program connects to existing projects instead of duplicating them:

- `CodeSentinel` — GitHub App, agentic engineering and CI/security analysis
- `WPWW-WarRoom---Elite-Defense-Honeypot` — honeypot, war-room and defensive security concepts
- `agenttrace` — bounded AI-agent security scenarios
- `HealthTechDeviceApi` — API and healthcare security engineering
- `azure-kubernetes-showcase` — cloud, Kubernetes, containers and CI/CD
- `developer-portfolio` — public presentation and evidence

## Flagship systems in this lab

### EventForge

Polyglot event-driven platform demonstrating TypeScript, Python, C#/.NET, Java, Kotlin, Kafka, Docker and Kubernetes through actual service boundaries and event contracts.

Path: `projects/eventforge`

### ChangeStory

A TypeScript change-impact and traceability engine with correlation logic, typed models, tests and browser demonstrations.

Path: `projects/changestory`

#### Change Impact Mapper

A consolidated browser demonstration that scores impact across People, Workflow, Competence, Technology, Resources, Governance and Dependencies, then surfaces the highest-impact areas for mitigation planning.

Path: `projects/changestory/implementation/change-impact-mapper.html`

## Data and process demonstrations

### ProcessGuard

A browser-based process-drift monitor comparing target, previous and current observations.

Path: `labs/data/processguard`

### Implementation Trace

A browser-based trace register connecting requirements, observations, evidence, status, hypotheses and actions while keeping evidence separate from interpretation.

Path: `labs/implementation/implementation-trace`

## Technology demonstrations

The `apps/` and `labs/` trees contain compact demonstrations covering HTML, JavaScript, React, Python/FastAPI, security, systems, DevOps and data-oriented engineering. They are evidence of practical progression and reusable implementation patterns, not separate portfolio products.

Where two exercises demonstrate the same concept, the more complete implementation is the canonical demonstration and the simpler version is historical.

## Consolidation rules

- Do not create another repository for an existing capability.
- Move reusable functionality into the appropriate canonical system.
- Preserve useful historical code until its replacement is verified.
- Remove generated output, caches, dependency folders and other repository bloat.
- Keep credentials, private data and operational secrets out of public repositories.
- Claims in the portfolio must be backed by executable code, tests, CI or clearly labelled prototype boundaries.

## Repository map

```text
AB-Engineering-Lab/
├── frontend/                         interactive engineering index
├── projects/
│   ├── eventforge/                   polyglot event platform
│   └── changestory/                  change-impact engine
│       └── implementation/
│           └── change-impact-mapper.html
├── labs/
│   ├── security/git-secrets-sentinel.py
│   ├── data/processguard/
│   └── implementation/implementation-trace/
├── security-lab/                     contained defensive lab
├── docs/
│   ├── CYBER-SECURITY-TRAINING-PROGRAM.md
│   └── CYBER-SECURITY-BUILD-PROMPT.md
├── apps/
└── .github/workflows/
```

## Source repositories

The lab is the consolidation destination for small/learning repositories such as counters, calculator, digital clock, HTML starter work, task-manager and similar exercises. Their standalone repositories should not be treated as additional flagship projects.

Large domain systems remain separate when separation gives a real architectural or portfolio benefit.
