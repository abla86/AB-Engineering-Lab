# Cyber Security Training Program

## Purpose

This is the canonical training path for defensive security engineering in AB-Engineering-Lab.

The program combines the existing local security lab with the security capabilities already demonstrated in CodeSentinel, WPWW WarRoom, agenttrace, HealthTechDeviceApi and azure-kubernetes-showcase.

The training environment is for systems the learner owns or is explicitly authorised to test. Vulnerable exercises are synthetic, local and isolated.

## Learning model

Every module follows:

`LEARN -> UNDERSTAND -> LAB -> INVESTIGATE -> DETECT -> DEFEND -> REMEDIATE -> VERIFY`

A completed exercise must produce evidence: test output, logs, detection results, remediation diff, regression test and a short lessons-learned record.

## Curriculum

### 00 — Foundations
- CIA triad
- authentication vs authorization
- HTTP, DNS and TLS
- TCP/IP and basic networking
- Linux and Windows security concepts
- threat modelling

### 01 — Reconnaissance
- asset and service inventory
- attack-surface concepts
- HTTP inspection
- DNS investigation
- identifying trust boundaries
- threat-model construction

### 02 — Web Application Security
- SQL injection concepts in the local vulnerable lab
- XSS concepts
- broken access control / IDOR
- authentication and session security
- API input validation
- security headers
- secure coding and regression tests

### 03 — Network Security
- TCP/IP
- DNS security
- TLS
- traffic analysis
- segmentation
- defensive network controls

### 04 — Identity and Access
- password security
- MFA
- sessions
- JWT
- OAuth/OIDC concepts
- RBAC
- least privilege

### 05 — Endpoint Security
- malware concepts
- persistence concepts
- indicators of compromise
- sandboxing
- endpoint telemetry
- detection engineering

### 06 — Blue Team
- logging
- event correlation
- investigation
- detection rules
- SIEM concepts
- incident response
- evidence preservation

### 07 — Red/Blue Exercises
- controlled local attack simulation
- detection
- investigation
- containment
- remediation
- post-incident verification

Red-side exercises remain constrained to intentionally vulnerable local targets and synthetic data.

### 08 — DevSecOps
- SAST
- CodeQL
- dependency review
- secret detection
- container scanning
- IaC validation
- SBOM
- artifact integrity
- CI security gates
- supply-chain controls

### 09 — Cloud and Kubernetes
- Azure identity
- workload identity
- Kubernetes RBAC
- secrets
- network policies
- container security
- workload boundaries
- secure CI/CD deployment

### 10 — Capstone

A complete defensive engineering exercise:

`APPLICATION -> VULNERABILITY -> CONTROLLED TEST -> LOGGING -> DETECTION -> INCIDENT -> CONTAINMENT -> REMEDIATION -> SECURITY TEST -> CI VERIFICATION -> FINAL REPORT`

## Existing GitHub integration

| Capability | Repository |
|---|---|
| Canonical local training lab | AB-Engineering-Lab/security-lab |
| GitHub/agentic engineering security | CodeSentinel |
| Honeypot / war-room / Blue Team concepts | WPWW-WarRoom---Elite-Defense-Honeypot |
| AI-agent security scenarios | agenttrace |
| Healthcare API security | HealthTechDeviceApi |
| Azure/Kubernetes/containers/CI-CD | azure-kubernetes-showcase |
| Public portfolio presentation | developer-portfolio |

Existing implementations should be reused rather than duplicated.

## Lab contract

Each module should contain, where applicable:

- README.md
- OBJECTIVES.md
- THREAT-MODEL.md
- LAB.md
- DEFENSE.md
- VERIFICATION.md
- tests/
- fixtures/
- solution/

A module is not complete merely because code exists. It is complete when the learning objective, controlled exercise, defensive control and verification evidence are present.

## Progression

### Foundation
Understand the concept.

### Guided lab
Follow a controlled exercise against synthetic/local targets.

### Investigation
Interpret logs, requests, telemetry and test evidence.

### Defense
Implement or select a defensive control.

### Verification
Run tests and demonstrate that the control works.

### Challenge
Repeat the exercise with reduced guidance.

## Safety boundary

Never use this training program to scan, exploit or access systems without explicit authorization.

Do not use real credentials, personal data, production secrets or third-party targets in the lab.

The lab must default to local/isolated operation. Generated attack scenarios are test data and must not become autonomous real-world attack tooling.

## Definition of done

A training feature is complete only when:

1. the code is runnable;
2. the exercise is documented;
3. the vulnerable and/or insecure state is intentional and isolated;
4. the defensive state is implemented;
5. tests verify the security property;
6. logs/evidence demonstrate the result;
7. CI validates the relevant checks;
8. no secrets or private data are committed;
9. documentation does not overclaim production readiness;
10. the change does not duplicate an existing canonical capability.
