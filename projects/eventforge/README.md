# EventForge

A runnable public engineering system demonstrating event-driven and polyglot architecture.

## Run the API

```bash
cd projects/eventforge/api
npm install
npm run dev
```

Open `../frontend/index.html` in a browser. The API exposes:

- `GET /health`
- `GET /api/events`
- `POST /api/events`

Example payload:

```json
{"title":"Build EventForge"}
```

## Run the infrastructure

```bash
docker compose -f projects/eventforge/infra/docker-compose.yml up --build
```

The current API demo keeps events in memory so it is immediately runnable. Kafka, contract and Kubernetes layers are provided as infrastructure boundaries. Persistence and managed-cloud deployment are subsequent production-oriented layers, not claims of an existing production service.

## Why it exists

EventForge provides a public engineering project that is materially different from the private Evidence Appraisal system and War Room while demonstrating real TypeScript, Python, .NET, Java, Kotlin, Kafka, Docker, Kubernetes, testing and cloud architecture patterns.
