# Application Security Lab

A local-only security training lab demonstrating offensive and defensive application security.

## Scope

This lab is intentionally self-contained. The vulnerable examples exist only for controlled learning and are backed by in-memory demo data.

It demonstrates the security engineering cycle:

`Vulnerable -> Attack/Proof -> Detect -> Fix -> Regression test`

## Modules

| Module | Vulnerable example | Hardened example | Verification |
|---|---|---|---|
| SQL injection | string-built query simulation | parameterised query | pytest |
| XSS | unsafe HTML rendering example | text-safe rendering | pytest |
| IDOR / broken access control | missing ownership check | explicit owner check | pytest |
| Security headers | missing browser protections | explicit response headers | pytest |
| Input validation | unrestricted demo input | constrained input validation | pytest |

## Run locally

```powershell
cd security-lab
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pytest -q
python app.py
```

The lab binds to `127.0.0.1` by default. It is not intended to be exposed to the public internet.

## Evidence

Each test documents what the attacker can demonstrate against the vulnerable implementation and what the hardened implementation must prevent.

## Security references

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP ASVS: https://owasp.org/www-project-asvs/
- CWE: https://cwe.mitre.org/
- NIST SSDF: https://csrc.nist.gov/Projects/ssdf

## Portfolio status

This is a security-training laboratory, not a production security product. The vulnerable code is intentionally vulnerable and must not be reused in production.

## Full training engine

Run the complete curriculum locally:

```powershell
.\start-training.ps1
```

The training engine serves a browser dashboard on `127.0.0.1:8090` and keeps progress locally. Completion requires automated verification plus learner evidence.

The curriculum contains 11 modules spanning foundations, reconnaissance, web security, network security, identity, endpoint telemetry, blue-team detection, red/blue exercises, DevSecOps, cloud/Kubernetes controls, and a capstone.

All exercise data is synthetic. Automated verifiers are allowlisted in the training engine; user-supplied text is never treated as a command.

## Architecture

- `app.py` — intentionally vulnerable local application
- `training_engine.py` — curriculum, verification and progress API
- `training-dashboard.html` — browser UI
- `training/labs.py` — executable synthetic exercises
- `training/scenarios.json` — web-security scenarios
- `training/scenarios-advanced.json` — network, identity, endpoint, blue-team, DevSecOps, cloud and capstone scenarios
- `test_security_lab.py` — application-security regression tests
- `test_training_labs.py` — curriculum lab tests
- `test_training_engine.py` — engine/API tests


## AB Sentinel Mesh red/blue arena

The training engine now includes a complete local red/blue simulation range.

- Dashboard: http://127.0.0.1:8090
- Synthetic attack catalog: training/attack-defense-catalog.json
- Simulation engine: training/arena.py
- Security signature: AB-SENTINEL-MESH.md
- Research baseline: SECURITY-RESEARCH-BASELINE.md
- Arena state is local-only and ignored by Git.

The red side emits synthetic events only. It cannot execute generated payloads or contact external targets. The blue side combines detection, containment, integrity, identity, network and recovery controls. Battles are recorded with deterministic signatures and lessons so the same scenario can be replayed after a defensive change.
