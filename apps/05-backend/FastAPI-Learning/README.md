# FastAPI Learning

Small backend learning project demonstrating the fundamentals of building and testing a Python REST API with FastAPI.

## Purpose

This repository documents progression into backend development with Python, API routing, validation, health checks and automated testing.

## Endpoints

- `GET /` — API information
- `GET /health` — health check
- `GET /hello/{name}` — parameterised response
- `/docs` — OpenAPI / Swagger UI

## Technology

- Python
- FastAPI
- Uvicorn
- pytest
- Git / GitHub
- Docker-related development workflow

## Project structure

```text
app/
tests/
requirements.txt
.gitignore
README.md
```

## Run locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open the API documentation at `http://127.0.0.1:8000/docs`.

## Verification

Run the test suite with:

```powershell
pytest
```

## Scope

This is a learning project rather than a production healthcare system. It contains no real patient data and makes no production-readiness claims.

## Author

Anne Beth Andersen
