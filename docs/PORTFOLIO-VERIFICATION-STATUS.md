# Portfolio Verification Status

Updated: 2026-08-26

This file records what is directly verifiable from GitHub Actions and repository state. `Not verified` means no suitable latest full-stack/build workflow was available from GitHub; it does not mean the repository is broken.

| Repository | Current verification signal | Status |
|---|---|---|
| `developer-portfolio` | GitHub Pages deployment for the latest portfolio navigation commit completed successfully | VERIFIED |
| `evidence-appraisal-tool` | Latest CodeQL run for the latest repair commit completed successfully | VERIFIED SECURITY CHECK; full build status not established by that run |
| `HealthTechDeviceApi` | Latest Docker Build for latest worklog commit completed successfully | VERIFIED |
| `healthcare-data-analyzer` | Latest CI for latest quality-pipeline commit completed successfully | VERIFIED |
| `healthcare-workforce-sql` | No GitHub Actions workflow runs found | NOT VERIFIED BY CI |
| `healthtech-dashboard` | Only Dependabot graph-update workflow run is present; no full application CI run identified | NOT VERIFIED BY FULL CI |
| `shift-competence-planner` | Latest CI for latest documentation/navigation commit completed successfully | VERIFIED |
| `workforce-competence-management` | Latest CodeQL for latest documentation/policy commit completed successfully; broader full-stack workflow is not established from this latest run | VERIFIED SECURITY CHECK; full build status not established by that run |
| `azure-kubernetes-showcase` | Main-branch Dependabot workflow completed successfully; a separate Dependabot PR CI failure was observed and is not the main branch | MAIN BRANCH SIGNAL OK; PR FAILURE NOT MAIN |
| `HA-Desktop-Widget` | No GitHub Actions workflow runs found | NOT VERIFIED BY CI |
| `AB-Engineering-Lab` | Latest Pages workflow had a configuration failure; Pages enablement was corrected and a new workflow run is queued | IN VERIFICATION |
| `kana-dojo` | Established active open-source project with its own CI/documentation model; no portfolio standardisation changes made | LEFT INTACT |

## Rule

No repository is described as production-ready merely because a workflow exists or passes. Verification statements are limited to the checks actually observed.
