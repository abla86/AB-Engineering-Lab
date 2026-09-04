# Observability

EventForge exposes a health endpoint suitable for container probes:

GET /health

The response reports API status and Kafka connectivity. Kubernetes readiness/liveness probes use this endpoint.

Next observability layer: OpenTelemetry traces/metrics and a Prometheus-compatible metrics endpoint. These should be added only with runnable configuration and tests.
