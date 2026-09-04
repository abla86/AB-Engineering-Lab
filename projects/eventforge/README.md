# EventForge

A runnable public polyglot event-driven platform.

## Stack

TypeScript/Node API · PostgreSQL persistence · Kafka event transport · Python · C#/.NET · Java · Kotlin consumers · Docker · Kubernetes · automated tests.

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

## Engineering evidence

The project intentionally demonstrates multiple languages through real service boundaries. The private Evidence Appraisal and War Room systems are not copied into this repository.
