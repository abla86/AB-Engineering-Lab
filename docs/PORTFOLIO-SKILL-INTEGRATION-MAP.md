# Portfolio Skill Integration Map

Assessment based on the current public portfolio and the Software Engineer / Full-Stack job skill lists reviewed on 2026-09-13.

## Principle

Use existing flagship systems first. Add a capability only where it has a defensible architectural purpose. Do not create a new repository merely to put a technology name on GitHub.

## Skill-by-skill assessment

| Skill / keyword | Current evidence | Best canonical home | Action |
|---|---|---|---|
| ASP.NET | Strong | HealthTechDeviceApi / Azure Kubernetes Showcase | Keep and deepen |
| .NET Core | Strong modern equivalent | HealthTechDeviceApi / EventForge | Keep; use current .NET rather than legacy branding |
| C# | Strong | HealthTechDeviceApi / EventForge | Keep and deepen |
| .NET Framework | Not currently evidenced | None | Do not add solely for a keyword; legacy technology is not a good new-development target |
| Angular | Not evidenced as an implementation | HealthTechDeviceApi | Add a small real Angular API client/admin surface only if it remains independently useful |
| SQL | Strong | HealthTechDeviceApi / EventForge / healthcare-workforce-sql | Keep and deepen with real queries and persistence |
| Full-Stack Development | Strong | HealthTechDeviceApi / Azure Kubernetes Showcase / CodeSentinel | Keep; show complete frontend-to-API path |
| Application Programming Interfaces (API) | Strong | HealthTechDeviceApi / CodeSentinel / EventForge | Keep and deepen |
| Data Science | Present | healthcare-data-analyzer / local-deep-research | Strengthen with reproducible analysis and explicit evaluation |
| Root Cause | Partial / operational | Azure Kubernetes Showcase / k8s-pod-doctor / ChangeStory | Add structured incident/RCA evidence |
| Context | Strong conceptually | ChangeStory / EventForge | Make context/correlation explicit in docs and models |
| Continuous Improvement | Partial | Azure Kubernetes Showcase / ChangeStory | Add measurable improvement loop and post-incident workflow |
| Stack | Strong | Multiple flagships | Keep architecture diagrams and stack matrices accurate |
| Neural Networks | Indirect AI evidence; no focused neural-network implementation identified | healthcare-data-analyzer or a bounded AI lab | Add only as a clearly synthetic/evaluative ML component |
| Structured Finance | Weak / separate domain | crypto-strategy-lab | Keep isolated; do not force it into healthcare/cloud systems |
| Vector | Present conceptually through research indexing/embedding | local-deep-research / research systems | Document vector retrieval accurately; add custom implementation only if needed |
| Software Engineering | Strong | All flagships | Strengthen architecture, tests, CI, ADRs and requirements |
| Web applications | Strong | HealthTechDeviceApi / Azure / CodeSentinel | Keep |
| Web services | Strong | HealthTechDeviceApi / EventForge | Keep |
| UI development | Strong React/JS | Azure / CodeSentinel / HealthTechDeviceApi | Keep; Angular/Blazor can be supporting clients |
| Backend development | Strong | HealthTechDeviceApi / Azure / EventForge | Keep |
| Database development | Strong | HealthTechDeviceApi / EventForge | Keep |
| Blazor | Not evidenced | HealthTechDeviceApi | Natural candidate for a small .NET admin/monitoring client; avoid duplicating the main UI unnecessarily |
| .NET Aspire | Newly added to EventForge | EventForge | Use as distributed-app development/orchestration layer |
| Wolverine | Newly added to EventForge | EventForge | Use for a real Kafka message-handler path |
| Java | Strong in EventForge | EventForge | Keep |
| Go | Newly added to EventForge | EventForge | Keep as a real Kafka consumer |
| IT security | Strong | CodeSentinel / Azure / HealthTechDeviceApi | Keep and deepen |
| Authentication | Strong in CodeSentinel; API security also present | CodeSentinel / HealthTechDeviceApi | Make implementation evidence explicit |
| Digital signatures | Not yet a clearly demonstrated cryptographic implementation | HealthTechDeviceApi or CodeSentinel | Add only as real signature/verification functionality |
| Encryption | Strong elsewhere; explicit portfolio evidence exists in security-oriented systems | CodeSentinel / Azure / local-deep-research | Keep; distinguish encryption from hashing/MACs |
| Requirements analysis | Partial | Azure / HealthTechDeviceApi | Add lightweight requirements + acceptance criteria tied to implemented features |
| Application integration | Strong | EventForge / HealthTechDeviceApi | Keep; EventForge is the strongest demonstration |
| Quality assurance | Strong | All flagships | Keep automated tests and negative-path testing visible |
| Technical consulting | Not a code feature | Portfolio documentation | Demonstrate through decision records, trade-off analysis and architecture notes |
| Analytical / conceptual thinking | Strongly supportable | Architecture docs across flagships | Make design decisions and trade-offs explicit |
| Problem-solving | Strongly supportable | Azure operations / CodeSentinel / EventForge | Show failure modes, diagnosis and recovery |
| Communication | Portfolio/documentation evidence | developer-portfolio + flagship READMEs | Improve concise architecture and operational explanations |
| German | Not a technical repository capability | CV/profile | Must be represented truthfully outside code |
| English | Strong repository language evidence | All public repos | Already visible |

## Current integration order

### 1. EventForge — first

Already demonstrates Node.js, TypeScript, PostgreSQL, Kafka, Python, C#/.NET, Java and Kotlin. It now also has Go, Wolverine and a .NET Aspire AppHost. This is the most efficient place to demonstrate polyglot integration rather than creating isolated language demos.

### 2. HealthTechDeviceApi — second

Use the existing API/dashboard architecture for security, authentication, cryptographic signing, SQL/persistence, requirements and QA. Angular or Blazor should be supporting clients, not competing flagship products.

### 3. Azure Kubernetes Showcase — third

Use the existing cloud-native architecture to make requirements analysis, root-cause analysis, operational context and continuous-improvement practices executable/documented. Do not duplicate EventForge's messaging stack unless it provides a real cloud-native use case.

### 4. CodeSentinel — fourth

Use the existing GitHub App/security platform for authentication, authorization, auditability, secure integrations, verification and application security. Avoid copying generic security features into every repository.

### 5. Data / research systems — fifth

Use healthcare-data-analyzer for reproducible data-science evidence and local-deep-research/research systems for retrieval/vector/AI evidence. Keep ML claims bounded to what is actually implemented and evaluated.

### 6. Smaller specialist repositories

Only after the large systems are complete: crypto-strategy-lab for structured-finance analytics, and small labs for focused demonstrations that cannot be integrated without distorting the main architecture.

## Explicit non-goals

- No new repository solely for Angular, Blazor, Go, Java or .NET Framework.
- No artificial insertion of Structured Finance into healthcare/cloud projects.
- No claim of digital signatures until signing and verification code is actually implemented and tested.
- No claim of neural-network expertise from generic AI/LLM usage alone.
- No claim of German-language capability from repository metadata.

## Verification rule

A technology is considered portfolio evidence only when the repository contains an executable implementation, automated verification, or a clearly labelled bounded prototype. Documentation alone may explain an architecture, but it does not prove that the technology is implemented.
