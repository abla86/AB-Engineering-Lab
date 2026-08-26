# FastAPI Learning

## Purpose

A Python backend module demonstrating REST-style API development with FastAPI, Pydantic, SQLAlchemy, database persistence and automated testing.

## Current capabilities

The current application exposes backend functionality including:

- `GET /` — API root
- `GET /health` — health check
- `GET /tasks` — list tasks
- `POST /tasks` — create a task
- `DELETE /tasks/{task_id}` — delete a task
- OpenAPI documentation through FastAPI

The exact endpoints should be treated as implementation details of this module and verified against the current source and tests when the API evolves.

## Technology

- Python
- FastAPI
- Pydantic
- Uvicorn
- SQLAlchemy
- SQLite
- pytest
- Git / GitHub
- Docker-related development workflow where applicable

## Architecture

```text
HTTP request
     ↓
 FastAPI route
     ↓
Pydantic validation
     ↓
 SQLAlchemy
     ↓
 Database
```

## Project structure

```text
FastAPI-Learning/
│
├── app/
│   ├── database.py
│   ├── main.py
│   └── models.py
│
├── tests/
├── requirements.txt
├── .gitignore
└── README.md
```

## Run locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open the API documentation at:

`http://127.0.0.1:8000/docs`

## Verification

Run the test suite with:

```powershell
pytest
```

## Role in AB Engineering Lab

This module represents **Stage 05 — Backend**.

It is currently a backend laboratory inside the unified repository. It is not described as directly connected to the React Engineering Lab frontend until a tested API integration is implemented.

## Next engineering stage

The intended next step is a tested frontend-to-FastAPI integration with an explicit API client and defined request/response contract.

## Scope

This is a learning and portfolio module. It is not presented as a production healthcare system and should not be used with real patient data.