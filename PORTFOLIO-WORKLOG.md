# Portfolio Worklog

## 2026-08-26 — GitHub Pages workflow repair

- Verified the frontend build completed successfully on the previous Pages run.
- Diagnosed the actual failure to `actions/configure-pages@v5`: the repository Pages site was not enabled/configured for GitHub Actions.
- Updated `.github/workflows/pages.yml` to request Pages enablement automatically with `enablement: true`.
- No application code or unrelated project functionality was changed.

## 2026-08-26 — Documentation navigation

- Added a clear Start Here section with links to the visual portfolio, small-project demo hub, source repositories and engineering documentation.
- Clarified the repository's role as an engineering progression rather than a claim that unrelated modules are integrated.
- No application functionality was changed.

## 2026-08-26 — Application security laboratory

- Added a dedicated `security-lab/` module for controlled local application-security training.
- Added intentionally vulnerable and hardened examples for SQL injection, XSS and broken access control/IDOR.
- Added security-header and input-validation concepts to the lab documentation and implementation.
- Added regression tests that demonstrate the vulnerable behaviour and verify the hardened behaviour.
- Added a dedicated GitHub Actions workflow for the security-lab test suite.
- Added a security-use policy that restricts the lab to systems the user controls and prevents accidental production use of vulnerable examples.
- Updated the main README so the security work is visible as an explicit Application Security / DevSecOps layer.
