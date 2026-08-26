# Portfolio Worklog

## 2026-08-26 — GitHub Pages workflow repair

- Verified the frontend build completed successfully on the previous Pages run.
- Diagnosed the actual failure to GitHub Pages API permissions: the workflow token cannot enable Pages for this repository.
- Changed the Pages workflow so the build remains verifiable without falsely claiming that Pages deployment is enabled.
- Pages deployment now activates only when repository variable `GITHUB_PAGES_ENABLED=true` is explicitly configured.
- No application functionality was changed.

## 2026-08-26 — Documentation navigation

- Added a clear Start Here section with links to the visual portfolio, small-project demo hub, source repositories and engineering documentation.
- Clarified the repository's role as an engineering progression rather than a claim that unrelated modules are integrated.
- No application functionality was changed.

## 2026-08-26 — Application security laboratory

- Added a dedicated `security-lab/` module for controlled local application-security training.
- Added intentionally vulnerable and hardened examples for SQL injection, XSS and broken access control/IDOR.
- Added security-header and input-validation demonstrations.
- Added regression tests that demonstrate vulnerable behaviour and verify hardened behaviour.
- Added controlled attack demonstrations and a threat model.
- Added a security-use policy that restricts the lab to systems the user controls and prevents accidental production use of vulnerable examples.
- Added security-lab verification to the main Engineering Lab CI workflow.
- Added a dedicated Security Lab workflow for focused regression testing.
- Updated the main README and portfolio verification status so the security work is visible and accurately labelled.
