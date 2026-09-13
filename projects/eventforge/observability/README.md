# Observability

EventForge exposes:

- `GET /health` — dependency health for container probes
- `GET /metrics` — Prometheus-compatible counters

Current counters:

- `eventforge_requests_total`
- `eventforge_errors_total`
- `eventforge_events_created_total`

The metrics endpoint is intentionally dependency-light and deterministic for local demonstrations. A production deployment can replace or extend this with OpenTelemetry collectors and managed monitoring without changing the application contract.
