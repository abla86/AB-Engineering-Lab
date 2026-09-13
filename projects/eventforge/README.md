# EventForge

A runnable public polyglot event-driven platform.

## Stack

TypeScript/Node API · PostgreSQL persistence · Kafka event transport · Python · C#/.NET · Java · Kotlin · Go consumers · Docker · Kubernetes · automated tests.

The Go consumer is a real Kafka consumer using `segmentio/kafka-go`, with its own container image and CI verification. The .NET consumer provides the C#/.NET event-processing path.

## Run

```bash
cd projects/eventforge/api
npm install
npm run dev
```

For the full local infrastructure:

```bash
docker compose -f projects/eventforge/infra/docker-compose.yml up --build
```

To include the Go consumer:

```bash
docker compose -f projects/eventforge/infra/docker-compose.yml --profile consumers up --build
```

The API automatically uses PostgreSQL when `DATABASE_URL` is configured and falls back to a local JSON store for standalone development.

## API

- `GET /health`
- `GET /api/events`
- `POST /api/events` — `{"title":"Build EventForge"}`

## Engineering evidence

The project intentionally demonstrates multiple languages through real service boundaries: Node.js/TypeScript API, PostgreSQL persistence, Kafka messaging, and independently implemented Python, C#/.NET, Java, Kotlin and Go consumers. The shared JSON Schema contract is the boundary between producers and consumers.

The project is also the natural home for distributed-application orchestration experiments because the architecture already contains the services, database and message broker that .NET Aspire is designed to model and observe.

The private Evidence Appraisal and War Room systems are not copied into this repository.
