# Todo Application

## Purpose

A modular vanilla JavaScript task application demonstrating structured frontend development, browser persistence and unit testing.

## Features

- Add tasks
- Complete and reactivate tasks
- Delete tasks
- LocalStorage persistence
- ES6 modules
- Modular application structure
- Responsive interface
- Keyboard-accessible controls
- ARIA labels and live status updates
- Safe DOM rendering with `textContent`
- Lightweight UI animation
- Jest unit tests

## Architecture

```text
index.html
    │
    ├── main.js
    ├── todo.js
    ├── storage.js
    └── ui.js
             │
             ▼
        Browser UI
             │
             ▼
         LocalStorage
```

## Technologies

- HTML5
- CSS3
- JavaScript ES6 Modules
- DOM API
- Web Storage API
- Jest

## Run locally

```bash
npm install
npm test
```

For the browser application, open `index.html` through a local development server such as VS Code Live Server.

## Role in AB Engineering Lab

This module represents the transition from small JavaScript exercises to a structured application with separate modules, persistence and automated tests.

## Stage

**03 — Application development**

## Scope

This is a local browser application. It is not presented as a backend service or as part of the React/FastAPI integration until that integration is implemented and tested.

## License

MIT