# EventForge

A runnable public polyglot event-driven platform.

## Stack

TypeScript/Node API · PostgreSQL persistence · Kafka event transport · Python · C#/.NET · Java · Kotlin · Go consumers · Docker · Kubernetes · automated tests.

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

The API automatically uses PostgreSQL when `DATABASE_URL` is configured and falls back to a local JSON store for standalone development.

## API

- `GET /health`
- `GET /api/events`
- `POST /api/events` — `{"title":"Build EventForge"}`

## Language boundaries

| Runtime | Role |
|---|---|
| TypeScript / Node | HTTP API and event producer |
| C# / .NET | typed event consumer |
| Java | event consumer |
| Kotlin | event consumer |
| Python | event consumer / integration example |
| Go | contract-validating event consumer |

The Go consumer reads JSON events from stdin and validates them against the repository's `EventForgeEventV1` contract using only the Go standard library. It includes unit tests and is intentionally dependency-light.

## Engineering evidence

The project demonstrates multiple languages through real service boundaries and a shared versioned event contract. It complements, rather than duplicates, the security and evidence systems elsewhere in the portfolio.
