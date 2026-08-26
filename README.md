# AB Engineering Lab

**One project. Multiple engineering layers.**

AB Engineering Lab is a single repository that brings together smaller development projects and presents them as a clear engineering progression.

The repository is both a portfolio and an active development laboratory. The projects are grouped together, but they are not presented as one production runtime unless an integration has actually been implemented and tested.

## Development progression

```text
01  Web fundamentals
        ↓
02  JavaScript & browser logic
        ↓
03  Application development
        ↓
04  React & component architecture
        ↓
05  Python / FastAPI backend
        ↓
06  Full-stack integration
```

## Included projects

| Stage | Project | Main technologies |
|---|---|---|
| 01 | Hello HTML | HTML / CSS |
| 02 | Calculator | JavaScript / DOM |
| 02 | Digital Clock | JavaScript / Browser APIs |
| 02 | JavaScript Counter | JavaScript / DOM |
| 02 | Advanced JavaScript Counter | JavaScript |
| 03 | Todo App | JavaScript / Jest / Storage |
| 03 | Task Manager | JavaScript / CSS |
| 04 | React Task Dashboard | React / Vite |
| 05 | FastAPI Learning | Python / FastAPI / SQLAlchemy |

## Engineering areas

- HTML / CSS
- JavaScript
- DOM and browser APIs
- Application state
- React and component architecture
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- REST-style APIs
- Database persistence
- Automated testing
- Git / GitHub
- CI/CD
- GitHub Pages
- Refactoring
- Documentation
- System architecture

## Current architecture

The repository currently contains several technical modules plus a unified Engineering Lab frontend.

```text
AB Engineering Lab
│
├── Frontend laboratory
│   └── React / Vite
│
├── Browser applications
│   ├── HTML
│   ├── JavaScript
│   └── Application modules
│
└── Backend laboratory
    └── Python / FastAPI / SQLAlchemy
```

## Target architecture

The intended next integration step is:

```text
React UI
   ↓ HTTP / JSON
API client
   ↓
FastAPI
   ├── validation
   ├── application logic
   └── data access
          ↓
       Database
```

This is the **target architecture**. It does not mean that every existing project is already connected to the FastAPI backend.

## Engineering workflow

```text
Code
 ↓
Git
 ↓
GitHub
 ↓
Build
 ↓
Tests / validation
 ↓
CI/CD
 ↓
Deployment
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Learning Path](docs/LEARNING-PATH.md)
- [Project Map](docs/PROJECTS.md)

## Status

**Active development.**

The current priority is to turn the consolidated modules into a coherent, tested full-stack engineering environment without overstating what has already been integrated.
