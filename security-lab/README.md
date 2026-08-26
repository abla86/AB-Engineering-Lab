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
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- CWE: https://cwe.mitre.org/
- NIST SSDF: https://csrc.nist.gov/Projects/ssdf

## Portfolio status

This is a security-training laboratory, not a production security product. The vulnerable code is intentionally vulnerable and must not be reused in production.
