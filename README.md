# AB Engineering Lab

**One project. Multiple engineering layers.**

AB Engineering Lab combines selected software-development projects into one coherent engineering laboratory.

## Start here

| Need | Go to |
|---|---|
| Visual showcase | [Developer portfolio](https://abla86.github.io/developer-portfolio/) |
| Small projects together | [Small Projects Demo Hub](https://abla86.github.io/developer-portfolio/small-projects-hub.html) |
| Source code | [GitHub repositories](https://github.com/abla86?tab=repositories) |
| Engineering documentation | [docs/](docs/) |
| Portfolio verification | [docs/PORTFOLIO-VERIFICATION-STATUS.md](docs/PORTFOLIO-VERIFICATION-STATUS.md) |
| Application security work | [security-lab/](security-lab/) |

## Featured engineering project: ChangeStory

[projects/changestory/](projects/changestory/) is an evidence-first operational change intelligence prototype.

It demonstrates a deliberately different capability from the research/evidence appraisal work: reconstructing **what changed, what followed, what is actually evidenced, and what should be investigated next**.

The same event chain can be explained to two audiences:

- **Executive:** outcome, operational impact, confidence and next actions.
- **Technical:** normalized events, temporal correlation, dependencies and evidence provenance.

The implementation includes a deterministic TypeScript correlation/story engine, tests, a real demo dataset and a connector boundary for future GitHub/Jira/Azure/CSV/webhook adapters.

**Accuracy rule:** ChangeStory does not claim native Azure, AWS, Snowflake, Databricks or Power BI integration until those integrations are actually implemented and tested.

## Engineering progression

HTML / CSS
    ↓
JavaScript
    ↓
Applications
    ↓
React
    ↓
Python / FastAPI
    ↓
APIs
    ↓
Testing
    ↓
Git / GitHub
    ↓
CI/CD
    ↓
Deployment
    ↓
Application Security / DevSecOps

## Purpose

The smaller projects demonstrate development progression and are presented together while their individual implementations remain identifiable.

## Current engineering setup

- React + Vite frontend
- GitHub Actions build validation
- GitHub Pages deployment workflow
- Browser-based project previews where compatible
- Separate backend and application modules retained in the repository
- A controlled, local-only application security laboratory with vulnerable and hardened examples

The backend modules are not described as connected to the React frontend unless that integration has actually been implemented and tested.

## Application security lab

[security-lab/](security-lab/) demonstrates an end-to-end security workflow:

`Vulnerable -> Attack/Proof -> Detect -> Fix -> Regression test`

Current training modules cover SQL injection, cross-site scripting, broken access control/IDOR, security headers and input validation. The lab is deliberately local-only and is not production code.

## Verification

Use [Portfolio Verification Status](docs/PORTFOLIO-VERIFICATION-STATUS.md) for the current repository-by-repository evidence level. It distinguishes successful checks from repositories that do not currently expose a suitable full CI workflow.

Security-lab verification is handled by the dedicated `Security Lab` GitHub Actions workflow.

## Accuracy

Documentation describes implemented functionality rather than unsupported claims about production readiness, validation or completed functionality.

A configured deployment workflow is not the same as claiming that a deployed system is production-ready.

## Education

The repository owner is a Master's student in Knowledge-Based Practice.

This does not indicate completion of a master's degree.

## Change-control audit

See [docs/REPOSITORY-CHANGE-AUDIT-2026-08-28.md](docs/REPOSITORY-CHANGE-AUDIT-2026-08-28.md) for the repository change-control and traceability record.
