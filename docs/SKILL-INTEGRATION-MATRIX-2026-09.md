# Skill integration matrix — September 2026

This document maps the technologies and competencies found in the target Software Engineer / Full-stack role descriptions to the repository where they have the strongest natural engineering context.

## Canonical placement

| Skill / technology | Canonical evidence | Integration decision |
|---|---|---|
| Node.js / TypeScript | `projects/eventforge` | Real API boundary; not a separate demo |
| C# / .NET / ASP.NET Core | `HealthTechDeviceApi` | Healthcare API and backend |
| .NET Aspire | `projects/eventforge` | Distributed development orchestration |
| Wolverine | `projects/eventforge` | Kafka message-handler path |
| Java | `projects/eventforge` | Independent event consumer |
| Go | `projects/eventforge` | Independent Kafka consumer |
| SQL / PostgreSQL | EventForge + healthcare workforce SQL | Database and analytics evidence |
| Python / FastAPI | Engineering Lab + healthcare data analyzer | API/data tooling |
| React / TypeScript | Developer portfolio + application repos | Interactive UI and full-stack clients |
| Angular | Engineering capability target | Add only as a real client when it serves an existing API |
| Blazor | HealthTech capability target | Add only as a real .NET client; do not create a cosmetic badge |
| IT security | CodeSentinel + Azure/Kubernetes + Security Lab | Cross-cutting engineering concern |
| Authentication / authorization | CodeSentinel + security lab | Real application boundary and bounded demo |
| Digital signatures | HealthTech security boundary | Implement only when attached to an integrity use case |
| Encryption | HealthTech security boundary | Implement only for a defined confidentiality requirement |
| Data Science | `healthcare-data-analyzer` | Separate analytical pipeline |
| Vector / retrieval | `local-deep-research` | Research retrieval context |
| Neural networks | AI projects | Do not claim until reproducible model/evaluation evidence exists |
| Full-stack development | Azure showcase + HealthTech + portfolio | UI → API → data → delivery |
| Web services / backend / database | HealthTech + EventForge | Actual service boundaries |
| Requirements analysis | Azure showcase documentation | Requirements and acceptance criteria |
| Quality assurance | CI, tests and quality gates | Executable verification |
| Root cause | Azure showcase operations docs | Operational failure analysis |
| Continuous improvement | Azure showcase operations docs | Closed-loop engineering practice |
| Context / analytical thinking | ADRs, architecture and requirements | Decision traceability |
| Technical consulting | Architecture/requirements documentation | Demonstrated through trade-offs and technical guidance |
| Structured finance | `crypto-strategy-lab` | Keep as a separate domain; do not contaminate unrelated systems |
| .NET Framework | Context only | Modern .NET is the new-build target |
| German / English | Profile/CV | Language competency is not represented as source code |

## Rules

1. A technology keyword is not evidence by itself.
2. Prefer integration into an existing system with a meaningful boundary.
3. A small technology lab is acceptable when integration would create an artificial architecture.
4. Do not duplicate the same capability across repositories merely to increase the technology list.
5. Mark future targets explicitly until executable evidence exists.
6. Keep private systems private.

## Current priority

1. Finish EventForge as the polyglot event-driven flagship.
2. Finish HealthTech security/integration boundaries where the domain justifies them.
3. Strengthen Azure Kubernetes Showcase as the platform/operations flagship.
4. Make the public portfolio interactive across its pages and use it to navigate to inspectable evidence.
5. Only then add isolated technology demonstrations for remaining gaps.
