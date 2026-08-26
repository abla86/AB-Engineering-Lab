# Architecture

## AB Engineering Lab

AB Engineering Lab is one repository containing multiple technical modules that demonstrate a progression from web fundamentals to frontend, backend and full-stack engineering.

The repository distinguishes between what exists today and the intended integration architecture.

## Current repository architecture

```text
AB-Engineering-Lab/
│
├── apps/
│   ├── 01-html/
│   ├── 02-javascript/
│   ├── 03-applications/
│   ├── 04-react/
│   └── 05-backend/
│
├── frontend/
│   ├── public/labs/
│   └── src/
│
├── docs/
├── tests/
└── .github/workflows/
```

### Frontend laboratory

The unified presentation layer uses React and Vite. It provides project exploration, technology documentation, architecture views and live previews for compatible browser-based modules.

### Browser applications

The repository contains HTML and JavaScript applications demonstrating DOM manipulation, events, state, browser APIs and application behaviour.

### Backend laboratory

The FastAPI module demonstrates Python, FastAPI, Pydantic, SQLAlchemy, database persistence, CRUD endpoints and backend testing.

The backend is currently a separate module. It is not presented as already connected to the React laboratory unless that integration has been implemented and tested.

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

## Target integration architecture

The intended next system boundary is:

```text
React UI
   │
   │ HTTP / JSON
   ▼
API client
   │
   ▼
FastAPI
   ├── request validation
   ├── application logic
   └── data access
            │
            ▼
         Database
```

This is the target architecture, not the current runtime architecture of every module in the repository.

## Engineering principles

- Keep technical boundaries explicit.
- Keep documentation aligned with implementation.
- Separate frontend presentation from backend services.
- Prefer testable modules and reproducible builds.
- Integrate incrementally.
- Do not claim capabilities that have not been implemented.

## Delivery flow

```text
Source
  ↓
Git
  ↓
GitHub
  ↓
Build
  ↓
Validation / Tests
  ↓
CI/CD
  ↓
Deployment
```

## Next architectural milestone

The next major milestone is a tested React-to-FastAPI integration with an explicit API client and defined request/response contract.