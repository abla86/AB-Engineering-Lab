# Role skill showcase matrix

This matrix maps the public portfolio to the technical requirements visible in the Software Engineer and Full Stack Developer postings reviewed in September 2026.

The rule is evidence-first: a skill is marked **implemented** only where the repository contains executable code or an explicit automated verification path. A README keyword alone is not treated as evidence.

| Requirement / skill | Primary evidence | Status |
|---|---|---|
| C# | `HealthTechDeviceApi`, `AB-Engineering-Lab/projects/eventforge/consumers/dotnet` | Implemented |
| Current .NET / ASP.NET Core | `HealthTechDeviceApi` | Implemented |
| REST APIs / web services | `HealthTechDeviceApi`, `healthtech-dashboard`, EventForge | Implemented |
| Backend development | HealthTech Device Platform, EventForge | Implemented |
| Database / SQL | HealthTech Device Platform (EF Core/SQLite), EventForge (PostgreSQL) | Implemented |
| Full-stack development | HealthTech Device Platform, EventForge, CodeSentinel | Implemented |
| React / TypeScript / JavaScript | CodeSentinel, developer portfolio, EventForge | Implemented |
| Python | Azure/Kubernetes showcase, HealthTech/Data projects, EventForge | Implemented |
| Java | EventForge Java consumer | Implemented |
| Go | EventForge Go consumer | Implemented in this change |
| Docker | HealthTech Device Platform, Azure/Kubernetes showcase, EventForge | Implemented |
| Kubernetes | Azure/Kubernetes showcase, EventForge infrastructure | Implemented |
| Azure / IaC / CI/CD | Azure/Kubernetes showcase | Implemented |
| Observability | Azure/Kubernetes showcase, EventForge | Implemented |
| Authentication / authorization | CodeSentinel and security-oriented API boundaries | Implemented, scope-specific |
| Encryption / cryptography | SecureDotNet lab | Implemented in this change |
| Digital signatures | SecureDotNet lab | Implemented in this change |
| Requirements analysis / traceability | Complete Evidence Appraisal Tool, ChangeStory | Implemented |
| Quality assurance / testing | HealthTech Device Platform, CodeSentinel, Evidence platform | Implemented |
| Technical consulting / problem solving | Requirements, architecture and verification documentation across flagship repos | Demonstrated |
| Blazor | No flagship implementation yet | Gap |
| .NET Aspire | No flagship implementation yet | Gap |
| Wolverine | No flagship implementation yet | Gap |
| Angular | No flagship implementation yet | Gap |
| Oracle / EBICS / SWIFT | No implementation evidence | Gap |
| German | Portfolio evidence cannot establish language proficiency | Not a code skill |

## Portfolio strategy

The strongest presentation is not one giant repository claiming every keyword. It is a small set of coherent systems with clear boundaries:

1. **HealthTechDeviceApi** — C#/.NET, ASP.NET Core, REST, persistence, validation, testing, Docker and security controls.
2. **EventForge in AB-Engineering-Lab** — polyglot integration: TypeScript/Node, C#/.NET, Python, Java, Kotlin, Go, PostgreSQL, Kafka, Docker and Kubernetes.
3. **Azure Kubernetes Showcase** — cloud, Azure, Kubernetes, IaC, CI/CD, DevSecOps and observability.
4. **CodeSentinel** — GitHub integration, verification, auditability, React/TypeScript and AI-assisted software engineering.
5. **Complete Evidence Appraisal Tool** — requirements, domain modelling, research traceability, validation and a substantial full-stack application.
6. **SecureDotNet** — focused ASP.NET Core authentication, authorization, encryption and digital-signature implementation.

This gives a reviewer a direct path from job requirement → repository → executable evidence without creating duplicate repositories for every technology keyword.

## Deliberate gaps

Blazor, .NET Aspire, Wolverine and Angular are kept as explicit gaps rather than being claimed merely because the portfolio contains related .NET or frontend work. They should be added only when there is a real implementation worth reviewing.
