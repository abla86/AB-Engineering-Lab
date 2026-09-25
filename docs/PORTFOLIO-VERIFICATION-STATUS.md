# Portfolio Verification Status

Updated: 2026-09-23

This file records what is directly verifiable from GitHub Actions and repository state. `Not verified` means no suitable latest full-stack/build workflow was available from GitHub; it does not mean the repository is broken.

| Repository | Current verification signal | Status |
|---|---|---|
| `developer-portfolio` | GitHub Pages deployment for the latest portfolio navigation commit completed successfully | VERIFIED |
| `complete-evidence-appraisal-tool` | Active repository; verification claims are limited to the current repository evidence | ACTIVE / EVIDENCE BOUNDED |
| `HealthTechDeviceApi` | Latest Docker Build for latest worklog commit completed successfully | VERIFIED |
| `workforce-competence-management` | Latest CodeQL for latest documentation/policy commit completed successfully; broader full-stack workflow is not established from this latest run | VERIFIED SECURITY CHECK; FULL BUILD NOT ESTABLISHED BY THAT RUN |
| `azure-kubernetes-showcase` | Main-branch verification signal is OK; separate Dependabot PR failure was not on `main` | MAIN BRANCH SIGNAL OK; PR FAILURE NOT MAIN |
| `AB-Engineering-Lab` | Engineering Lab CI verifies frontend build plus security-lab regression tests. Pages deployment is gated until the repository variable `GITHUB_PAGES_ENABLED=true` is configured with suitable GitHub Pages permissions. | VERIFIED CI; PAGES DEPLOYMENT CONFIGURATION REQUIRED |
| `HA-Desktop-Widget` | Repository contains a comprehensive CI workflow, but no workflow runs are currently available from GitHub for this fork/repository | CI CONFIGURED; RUN NOT OBSERVED |

## Consolidated legacy material

The following standalone repositories have been deleted after consolidation:

- `todo-app`
- `react-task-dashboard`
- `task-manager`
- `calculator`
- `javascript-counter`
- `advanced-javascript-counter`
- `digital-clock`
- `hello-html`
- `race-condition`
- `healthcare-workforce-sql`
- `intro`
- `skills-introduction-to-git`
- `skills-getting-started-with-github-copilot`
- `local-deep-research`

Their retained material, where useful, is represented in the active canonical repositories or in historical folders inside `AB-Engineering-Lab`.

## Security laboratory

`AB-Engineering-Lab/security-lab/` is a controlled, local-only application-security training module. It contains intentionally vulnerable and hardened examples plus regression tests for SQL injection, XSS, broken access control/IDOR, security headers and input validation. Its tests are also included in the main Engineering Lab CI workflow.

## Baseline rule

The baseline is considered complete when every active repository has either an observed automated verification signal or an explicit documented reason why such verification is unavailable. Missing verification is not silently treated as a passing build.

## Scope rule

No repository is described as production-ready merely because a workflow exists or passes. Verification statements are limited to the checks actually observed.
