# AB Sentinel Mesh — Red/Blue Security Signature

## Purpose

AB Sentinel Mesh is the security architecture used by this repository's cyber range. It is not a claim that any software can be immune to every attack. Its purpose is to make security a continuously testable property of the system.

The design combines:

1. Prevent — secure defaults, input validation, least privilege, segmentation and integrity controls.
2. Observe — structured synthetic telemetry and continuity checks.
3. Detect — technique/signal correlation rather than a single indicator.
4. Contain — explicit response actions attached to detections.
5. Recover — known-good restoration and verification.
6. Learn — every arena battle produces a deterministic signature, outcome, detections and lessons.
7. Regression — security tests turn lessons into executable controls.

## Threat coverage

The catalog deliberately spans the OWASP Top 10:2025 application-risk categories and the Enterprise ATT&CK lifecycle concepts. OWASP Top 10:2025 identifies broken access control, security misconfiguration, software supply-chain failures, cryptographic failures, injection, insecure design, authentication failures, integrity failures, logging/alerting failures and exceptional-condition handling as its ten categories. The range therefore includes simulations for these classes.

ATT&CK describes tactics as the adversary's goal and techniques as how the goal is achieved. The arena models the Enterprise lifecycle as synthetic scenarios rather than implementing real-world attack payloads.

## Defense model

MITRE D3FEND is used as the conceptual defensive layer: countermeasures are modeled as capabilities that can be combined and tested against offensive techniques. The implementation intentionally uses its own executable rule IDs (SIG-*) so the training system remains independent of a third-party ontology while retaining traceable security concepts.

## Safe simulation boundary

The red side is a simulation engine, not an exploitation framework:

- no generated shell commands;
- no generated malware;
- no arbitrary code execution;
- no socket scanning;
- no external target URLs;
- no credential attacks against real services;
- no persistence on the host;
- no payload delivery;
- no evasion instructions for real systems.

An attack scenario emits synthetic events. Mutations alter bounded parameters such as intensity, burst size, source count and delay. The blue side consumes those events and produces detections and response actions.

## Battle scoring

Each battle records:

- simulated attack;
- selected blue controls;
- bounded mutations;
- synthetic event timeline;
- detections;
- attack pressure;
- defensive score;
- outcome;
- lessons;
- deterministic SHA-256 battle ID;
- AB Sentinel Mesh signature.

The scoreboard separates red breakthrough, contested results and blue containment. The scores are training measurements, not claims about real-world security effectiveness.

## Continuous improvement

A failed battle is useful data. The intended workflow is:

simulate → observe → detect → contain → inspect gap → improve control → add regression → replay

That is the core signature of the lab.
