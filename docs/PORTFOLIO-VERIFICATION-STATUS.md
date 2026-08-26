# Portfolio Verification Status

Updated: 2026-08-26

This file records what is directly verifiable from GitHub Actions and repository state. `Not verified` means no suitable latest full-stack/build workflow was available from GitHub; it does not mean the repository is broken.

| Repository | Current verification signal | Status |
|---|---|---|
| `developer-portfolio` | GitHub Pages deployment for the latest portfolio navigation commit completed successfully | VERIFIED |
| `evidence-appraisal-tool` | Latest CodeQL run for the latest repair commit completed successfully | VERIFIED SECURITY CHECK; full build status not established by that run |
| `HealthTechDeviceApi` | Latest Docker Build for latest worklog commit completed successfully | VERIFIED |
| `healthcare-data-analyzer` | Latest CI for latest quality-pipeline commit completed successfully | VERIFIED |
| `healthcare-workforce-sql` | Latest SQL Validation run parses `setup.sql` and all `sql/*.sql` files with SQLFluff T-SQL parser | VERIFIED PARSER CHECK; SQL Server execution remains environment-level |
| `healthtech-dashboard` | Latest CI compiles the backend and runs focused FastAPI API smoke/integration tests successfully | VERIFIED BACKEND BASELINE |
| `shift-competence-planner` | Latest CI for latest documentation/navigation commit completed successfully | VERIFIED |
| `workforce-competence-management` | Latest CodeQL for latest documentation/policy commit completed successfully; broader full-stack workflow is not established from this latest run | VERIFIED SECURITY CHECK; full build status not established by that run |
| `azure-kubernetes-showcase` | Main-branch verification signal is OK; separate Dependabot PR failure was not on `main` | MAIN BRANCH SIGNAL OK; PR FAILURE NOT MAIN |
| `HA-Desktop-Widget` | Repository contains a comprehensive CI workflow, but no workflow runs are currently available from GitHub for this fork/repository | CI CONFIGURED; RUN NOT OBSERVED |
| `AB-Engineering-Lab` | Latest Engineering Lab CI completed successfully after the Pages workflow configuration repair | VERIFIED |
| `kana-dojo` | Established active open-source project with its own CI/documentation model; no portfolio standardisation changes made | LEFT INTACT |

## Baseline rule

The baseline is considered complete when every active repository has either an observed automated verification signal or an explicit documented reason why such verification is unavailable. Missing verification is not silently treated as a passing build.

## Scope rule

No repository is described as production-ready merely because a workflow exists or passes. Verification statements are limited to the checks actually observed.
