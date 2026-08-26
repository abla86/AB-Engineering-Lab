# Architecture

## AB Engineering Lab

AB Engineering Lab is organised as one repository containing several development stages and technical modules.

The repository provides a unified presentation layer, while the individual projects retain their own implementation boundaries.

This distinction is important: the repository is unified, but the modules are not automatically one production runtime.

## Current architecture

```text
AB Engineering Lab
│
├── apps/
│   ├── 01-html/
│   ├── 02-javascript/
│   ├── 03-applications/
│   ├── 04-react/
│   └── 05-backend/
│
├── frontend/
├── docs/
├── tests/
└── .github/workflows/
```

### Frontend laboratory

The unified frontend is built with React and Vite and provides the common project presentation and exploration layer.

It is responsible for:

- project navigation
- project descriptions
- technology overview
- architecture presentation
- development progression
- selected live browser previews
- source-code navigation

### Backend laboratory

The FastAPI project demonstrates a separate backend service using Python, FastAPI, Pydantic, SQLAlchemy, database persistence and tests.

It is currently a backend module within the repository. It should not be described as directly connected to the React frontend until such an integration has been implemented and tested.

## Current system boundary

```text
                  AB ENGINEERING LAB
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
 Unified Frontend                    Existing Modules
 React + Vite                        ├── HTML
        │                            ├── JavaScript
        │                            ├── Applications
        ▼                            ├── React
 Project exploration                └── FastAPI
```

## Target architecture

The intended next architectural step is an explicit frontend-to-backend integration:

```text
React / Vite
     │
     │ HTTP / JSON
     ▼
API client
     │
     ▼
FastAPI
     │
     ├── Request validation
     ├── Application logic
     └── Data access
             │
             ▼
          Database
```

This is the **target architecture**, not a claim that all existing modules are already connected.

## Engineering principles

1. Keep modules understandable.
2. Separate presentation from backend services.
3. Use explicit API boundaries.
4. Test behaviour where practical.
5. Keep documentation aligned with implementation.
6. Refactor incrementally.
7. Do not claim capabilities that have not been implemented.
8. Prefer reproducible builds and automated checks.

## Delivery pipeline

```text
Source code
    ↓
Git
    ↓
GitHub
    ↓
Build
    ↓
Tests / validation
    ↓
Deployment
```

## Next architecture work

- connect the React frontend to FastAPI
- introduce a shared API client
- define and test API contracts
- expand backend tests
- connect persistent data to the frontend
- evaluate Docker-based development
- strengthen CI validation
- improve error handling and observability
