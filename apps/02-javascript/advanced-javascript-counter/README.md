# Advanced JavaScript Counter

## Purpose

A dependency-free vanilla JavaScript application that extends the basic counter concept into a richer frontend module.

## Implemented features

- Three independent counters
- Increase, decrease and reset
- Persistent state with LocalStorage
- Keyboard interaction
- Dynamic styling based on values
- Animated value changes
- Derived dashboard statistics
- Reset-all functionality
- JSON export
- JSON import with validation and error handling
- Responsive layout
- Light/dark colour preference support
- Accessibility features including semantic controls, ARIA status updates and keyboard interaction

## Architecture

```text
Configuration
     ↓
Counter instances
     ↓
Application state
     ├── LocalStorage
     ├── DOM updates
     └── Derived statistics
```

A reusable `Counter` class is used to avoid duplicating the same counter logic for each instance.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript ES6+
- DOM API
- Web Storage API
- File API
- Blob API
- JSON
- ARIA

The application has no external runtime dependencies and does not require a build tool or backend.

## Run locally

Open `index.html` in a modern browser. No package installation is required.

## Role in AB Engineering Lab

This module represents **Stage 02 — JavaScript and browser logic**.

It demonstrates how a small programming exercise can evolve into a more structured frontend application with persistent state, reusable logic, derived data and accessibility considerations.

## Deployment

The original standalone project was deployed through GitHub Pages. Within AB Engineering Lab, the source is retained as a module and selected browser-based files are exposed through the unified frontend.

## Verification scope

The README describes implemented behaviour visible in the module. It does not claim formal accessibility certification, production readiness or backend integration.