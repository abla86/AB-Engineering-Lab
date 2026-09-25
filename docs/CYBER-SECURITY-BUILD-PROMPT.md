# Cyber Security Training Lab — Master Build Prompt

Use this as the master implementation brief for extending AB-Engineering-Lab.

## Role

Act as a senior security engineer, software architect, DevSecOps engineer and technical educator.

Build the Cyber Security Training Lab incrementally inside the existing `abla86/AB-Engineering-Lab` repository.

Do not create a second repository for capabilities that already exist here or in the user's canonical security projects.

## Objective

Turn the existing `security-lab` into a structured, evidence-driven security engineering curriculum while integrating existing work from:

- CodeSentinel
- WPWW-WarRoom---Elite-Defense-Honeypot
- agenttrace
- HealthTechDeviceApi
- azure-kubernetes-showcase
- developer-portfolio

Reuse existing implementations where appropriate. Prefer links, adapters, shared documentation and clearly defined module boundaries over copying code.

## Curriculum

Implement modules:

`00-foundations`
`01-reconnaissance`
`02-web-security`
`03-network-security`
`04-identity-access`
`05-endpoint-security`
`06-blue-team`
`07-red-blue`
`08-devsecops`
`09-cloud-kubernetes`
`10-capstone`

Each module should progress from theory to controlled practice to defensive verification.

## Required module structure

For each implemented module create:

- README.md
- OBJECTIVES.md
- THREAT-MODEL.md
- LAB.md
- DEFENSE.md
- VERIFICATION.md
- tests/
- fixtures/ when needed
- solution/ when useful

Use synthetic data and local targets.

## Training engine

Where implementation complexity justifies it, introduce a small training metadata model containing:

- module id
- lesson id
- difficulty
- prerequisites
- objectives
- scenario
- expected evidence
- security controls
- verification tests
- completion criteria

Keep the model simple and testable. Do not build a large framework before the first useful modules work.

## Exercise lifecycle

Every exercise should support:

`LEARN -> UNDERSTAND -> LAB -> INVESTIGATE -> DETECT -> DEFEND -> REMEDIATE -> VERIFY`

The learner should be able to see what is expected and what evidence proves completion.

## Security scenarios

Security exercises may include intentionally vulnerable local applications and controlled demonstrations.

They must:

- bind locally or run inside an isolated container network;
- use synthetic credentials and data;
- have explicit scope;
- include defensive controls;
- include regression tests;
- avoid real external targets;
- avoid real credentials;
- avoid destructive behaviour;
- avoid autonomous deployment or propagation.

Generated scenarios must remain inert test data unless explicitly implemented as a local lab component with a defined safety boundary.

## Blue Team workflow

Teach:

`OBSERVE -> INVESTIGATE -> IDENTIFY -> CONTAIN -> REMEDIATE -> VERIFY`

Use realistic but synthetic logs and telemetry.

## DevSecOps integration

Where the existing repositories support it, demonstrate:

- CodeQL
- dependency review
- secret scanning
- SAST
- container scanning
- IaC validation
- SBOM generation
- artifact integrity
- CI security gates
- dependency/update hygiene

Do not add duplicate scanners simply to increase badge count. Each control must have a documented purpose.

## Cloud/Kubernetes

Use local or disposable environments for practical exercises.

Cover:

- container boundaries
- Kubernetes RBAC
- secrets
- network policies
- workload identity concepts
- secure CI/CD
- Azure security concepts

Do not require access to a production Azure subscription.

## Capstone

Build one end-to-end local scenario:

`APPLICATION -> VULNERABILITY -> CONTROLLED TEST -> LOGGING -> DETECTION -> INCIDENT -> CONTAINMENT -> REMEDIATION -> SECURITY TEST -> CI VERIFICATION -> FINAL REPORT`

The final report should identify:

- original security weakness
- evidence
- affected control
- defensive change
- regression test
- residual risk
- verification result

## Quality rules

Before declaring any task complete:

1. inspect the current implementation;
2. identify the smallest useful change;
3. implement it;
4. run relevant tests;
5. inspect failures;
6. fix root causes rather than masking failures;
7. rerun regression tests;
8. inspect the resulting diff;
9. update documentation;
10. report exactly what was verified.

Never invent test results.

Never claim a workflow is green without checking its current result.

Never leave merge-conflict markers, placeholder code, fake credentials or generated build output in the repository.

## Autonomous execution

Work in small, reviewable commits.

Do not stop merely because a task contains several sequential implementation steps. Continue through inspection, implementation, testing and verification when the required repository access is available.

If a test fails, diagnose it and fix the root cause before moving on.

If a requested feature is unsafe for anything other than the isolated training environment, implement the safe local simulation and document the boundary instead of extending it to real-world targets.

## Completion standard

The project is complete only when the implemented curriculum has:

- a clear navigation/index;
- working local labs;
- explicit learning objectives;
- defensive counterparts;
- automated verification;
- evidence/reporting;
- CI/security checks;
- architecture documentation;
- threat models;
- clear safety boundaries;
- links to existing canonical projects;
- no duplicated flagship implementations.

Do not optimize for the number of files. Optimize for a coherent training experience that can be demonstrated, tested and maintained.
