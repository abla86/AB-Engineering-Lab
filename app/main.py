from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="FastAPI Learning",
    version="1.0.0",
    description="Et enkelt læringsprosjekt med FastAPI",
)


class Task(BaseModel):
    title: str
    completed: bool = False


tasks: list[Task] = []


@app.get("/")
def root():
    return {"message": "FastAPI fungerer"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/tasks")
def get_tasks():
    return tasks


@app.post("/tasks", status_code=201)
def create_task(task: Task):
    tasks.append(task)
    return task
    