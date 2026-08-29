# ChangeStory

**Evidence-first operational change intelligence.**

ChangeStory reconstructs a change from normalized events and shows:

- what changed
- what happened afterwards
- which observations are directly evidenced
- which relationships are only correlated
- what should be investigated next
- the same finding for executive and technical audiences

## Why this exists

Operational systems often show *events* but leave people to reconstruct the story manually.

ChangeStory combines event history, dependencies, operational impact and evidence classification into one replayable view.

## Important rule

Temporal correlation is **not** treated as proof of causation.

The engine deliberately distinguishes:

- OBSERVED
- CORRELATED
- INFERRED
- VERIFIED

The MVP does not automatically produce VERIFIED causal claims.

## Demonstrated engineering capabilities

| Capability | Demonstration |
|---|---|
| Data engineering | normalized event model + ingestion boundary |
| Data analysis | temporal correlation + operational impact |
| Business analysis | executive outcome and next-action view |
| Consulting | technical/executive explanation of one evidence chain |
| Cloud readiness | container/API boundary and deployment-neutral design |
| Reporting | KPI model, timeline, state transition and outcome |
| Testing | deterministic engine tests |
| CI/CD | GitHub Actions test/build workflow |

No native Azure, AWS, Snowflake, Databricks or Power BI integration is claimed until an actual connector/deployment is implemented and tested.

## Architecture

```
sources -> normalized events -> evidence/correlation -> change story
                                      |
                         +------------+------------+
                         |                         |
                  technical view             executive view
```

## Current scope

The first implementation is intentionally read-only and deterministic. Storage, connectors, identity/RBAC and production telemetry can be added without changing the core story model.
