# AB Engineering Lab

A public, runnable engineering showcase built around a small number of complete systems and focused demonstrations.

## Flagship systems

### EventForge
Polyglot event-driven platform demonstrating TypeScript, Python, C#/.NET, Java, Kotlin, Kafka, Docker and Kubernetes through an actual event contract and runnable service boundaries.

Path: `projects/eventforge`

### ChangeStory
A TypeScript change-impact and traceability engine with correlation logic, typed models, tests and a browser demo.

Path: `projects/changestory`

### Security Lab
A contained security-learning environment with threat modelling and defensive demonstrations. It is intentionally separate from the private War Room.

Path: `security-lab`

## Technology demonstrations

The `apps/` tree contains smaller historical learning exercises covering HTML, JavaScript, React, Python/FastAPI and application development. They are retained as evidence of progression, while new portfolio work should prefer extending the flagship systems rather than creating another small repository.

The public portfolio links to runnable demonstrations where appropriate.

## Engineering principles

- Build working software, not technology lists.
- Prefer one substantial system over many thin repositories.
- Keep private research and operational security work private.
- Make claims traceable to code, tests or reproducible configuration.
- Use contracts and tests at integration boundaries.
- Separate demonstrations from production claims.

## Repository map

```text
AB-Engineering-Lab/
├── frontend/                 interactive engineering index
├── projects/
│   ├── eventforge/            polyglot event platform
│   └── changestory/           change-impact engine
├── security-lab/              contained defensive lab
├── apps/                      historical learning demonstrations
├── docs/                      architecture, verification and governance
└── .github/workflows/         CI, dependency and security automation
```

## Private boundary

The private Evidence Appraisal flagship and private War Room are not contained in this repository. Only general engineering patterns that can be safely reproduced are used here.
