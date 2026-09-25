# Security Baseline

This repository treats the security-training system itself as production-quality engineering, while the vulnerable application examples remain intentionally vulnerable and isolated for training.

## Baseline

The implementation is aligned to the current OWASP Top 10:2025 categories and OWASP ASVS 5.0.0 verification model, with secure-development practices informed by NIST SSDF.

## Mandatory controls

- Local-only network binding for intentionally vulnerable and training services.
- No wildcard network binding.
- No shell execution from learner-controlled input.
- Automated verification commands are statically allowlisted.
- No `shell=True`, `os.system`, `os.popen`, `eval`, `exec`, or unsafe pickle deserialization in the training Python surface.
- Strict request-target limits and JSON content-type enforcement for training POST APIs.
- Request-body size limits.
- Security response headers including CSP, frame protection, referrer policy, permissions policy, no-store caching and MIME sniffing protection.
- No inline dashboard JavaScript; dashboard policy uses a strict same-origin CSP.
- Synthetic data only.
- Local progress state is ignored by Git.
- Evidence is bounded and completion is rejected when automated verification fails.
- Verification uses subprocesses without a shell and only predefined commands.
- Repository CI includes secret-pattern guards, source-integrity checks, dependency review and CodeQL.
- Dependabot updates GitHub Actions and supported package ecosystems.
- Security regression tests are required for the vulnerable/hardened examples and training engine.

## Security boundary

The lab is designed for an isolated developer workstation. It is not a production authentication system, multi-user service, or internet-facing platform. The vulnerable endpoints exist specifically to demonstrate insecure behavior and must never be deployed outside the controlled lab boundary.

## Verification

The executable baseline is enforced by:

- `security-lab/security_audit.py`
- `security-lab/test_security_audit.py`
- `security-lab/test_security_lab.py`
- `security-lab/test_training_engine.py`
- `security-lab/test_training_labs.py`
- GitHub CodeQL
- GitHub dependency review
- GitHub Dependabot
- repository source-integrity and secret guards

## References

- OWASP Top 10:2025
- OWASP ASVS 5.0.0
- NIST SP 800-218 SSDF 1.1
- NIST SP 800-218 Rev. 1 draft (SSDF 1.2)

Security standards evolve. The repository must treat these references as versioned baselines rather than permanent guarantees.
