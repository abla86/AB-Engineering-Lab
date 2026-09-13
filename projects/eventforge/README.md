# EventForge

A runnable public polyglot event-driven platform.

## Stack

TypeScript/Node API · PostgreSQL persistence · Kafka event transport · Python · C#/.NET · Java · Kotlin · Go consumers · Docker · Kubernetes · .NET Aspire · automated tests.

The Go consumer is a real Kafka consumer using `segmentio/kafka-go`, with its own container image and CI verification. The .NET consumer provides the C#/.NET event-processing path, while the Wolverine consumer demonstrates a message-handler abstraction over Kafka.

## Run

### Node API only

```bash
cd projects/eventforge/api
npm install
npm run dev
```

### Docker Compose

```bash
docker compose -f projects/eventforge/infra/docker-compose.yml up --build
```

To include the Go consumer:

```bash
docker compose -f projects/eventforge/infra/docker-compose.yml --profile consumers up --build
```

### .NET Aspire

The root `apphost.cs` is a .NET 10 / Aspire 13.5 AppHost for the distributed topology. It models PostgreSQL, Kafka, the Node API and the Go consumer as one development-time application model.

From `projects/eventforge`:

```bash
aspire run
```

Aspire is used here for development-time orchestration and observability; Docker Compose remains the portable baseline for the local stack.

The API accepts both its existing `DATABASE_URL` / `KAFKA_BROKER` configuration and Aspire's `ConnectionStrings__postgres` / `ConnectionStrings__kafka` references.

## API

- `GET /health`
- `GET /api/events`
- `POST /api/events` — `{"title":"Build EventForge"}`
- `GET /metrics`

## Engineering evidence

The project intentionally demonstrates multiple languages through real service boundaries: Node.js/TypeScript API, PostgreSQL persistence, Kafka messaging, and independently implemented Python, C#/.NET, Java, Kotlin and Go consumers. The shared JSON Schema contract is the boundary between producers and consumers.

The .NET side also includes a Wolverine-based Kafka consumer, demonstrating explicit message-handler routing, raw JSON interoperability and Kafka transport abstraction without replacing the lower-level Confluent-based consumer.

The distributed topology is also modeled with .NET Aspire, which is appropriate here because the system already contains services, a database and a message broker. The AppHost keeps the development topology explicit without claiming that Aspire itself is the production runtime.

The private Evidence Appraisal and War Room systems are not copied into this repository.
