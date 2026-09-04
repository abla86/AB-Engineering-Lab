# EventForge — polyglot event-driven engineering showcase

EventForge is the public engineering flagship for demonstrating a complete event-driven platform without exposing the private Evidence Appraisal or War Room systems.

Browser/API → versioned event contract → Kafka → polyglot consumers → persistence/analytics → observability.

- TypeScript: API and event contract
- Python: validation/analytics adapter
- C#/.NET: contract validation adapter
- Java: event projection adapter
- Kotlin: notification adapter
- Kafka: event transport
- Docker Compose: local platform
- Kubernetes: deployment model
- Azure/AWS: architecture mappings
- tests: deterministic contract/service verification

The adapters are intentionally small and runnable. They demonstrate real responsibilities rather than listing technologies.

## Local API

`cd projects/eventforge/api`
`npm install`
`npm run dev`

Health: `GET http://localhost:4100/health`

Create an event:
`POST /api/events` with JSON `{"title":"Example"}`

## Full platform

`docker compose -f projects/eventforge/infra/docker-compose.yml up --build`

## Architecture

The public project is deliberately different from the private Evidence Appraisal and War Room systems. It is an engineering platform for event-driven, cloud-native and polyglot development.
