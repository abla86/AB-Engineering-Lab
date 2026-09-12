# AB Engineering Lab

A public, runnable engineering showcase for small experiments, reusable demonstrations and technology labs that do not justify a separate flagship repository.

## Canonical portfolio boundary

The portfolio now follows a strict rule: **one canonical implementation per capability**. Product-scale work belongs in the canonical systems; this repository is for smaller, independent demonstrations.

| Capability | Canonical home |
|---|---|
| Evidence appraisal, research workflow, traceability, methodology integrity | `complete-evidence-appraisal-tool` |
| GitHub App, agentic software engineering, CI/security/release analysis | `CodeSentinel` |
| Healthcare dashboard, device/API, analytics and workforce tooling | `healthtech-dashboard` |
| Azure, Kubernetes, Docker and CI/CD | `azure-kubernetes-showcase` |
| Small learning exercises and reusable labs | `AB-Engineering-Lab` |
| Portfolio presentation | `developer-portfolio` |

## Flagship systems in this lab

### EventForge
Polyglot event-driven platform demonstrating TypeScript, Python, C#/.NET, Java, Kotlin, Kafka, Docker and Kubernetes through actual service boundaries and event contracts.

Path: `projects/eventforge`

### ChangeStory
A TypeScript change-impact and traceability engine with correlation logic, typed models, tests and a browser demo.

Path: `projects/changestory`

### Security Lab
A contained defensive security-learning environment. It is intentionally separate from private operational/security material.

Path: `security-lab`

## Technology demonstrations

The `apps/` tree contains historical learning exercises covering HTML, JavaScript, React, Python/FastAPI and application development. They remain as compact evidence of progression, but duplicate standalone repositories are not treated as separate portfolio products.

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
├── frontend/                 interactive engineering index
├── projects/
│   ├── eventforge/            polyglot event platform
│   └── changestory/           change-impact engine
├── security-lab/              contained defensive lab
├── apps/                      compact learning demonstrations
├── docs/                      architecture, verification and governance
└── .github/workflows/         CI, dependency and security automation
```

## Source repositories

The lab is the consolidation destination for small/learning repositories such as counters, calculator, digital clock, HTML starter work, task-manager and similar exercises. Their standalone repositories should not be treated as additional flagship projects.

Large domain systems remain separate when separation gives a real architectural or portfolio benefit.
