from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(
    title="FastAPI Learning",
    version="1.0.0",
    description="Et enkelt læringsprosjekt med FastAPI",
)


class TaskCreate(BaseModel):
    title: str
    completed: bool = False


class Task(TaskCreate):
    id: int


tasks: list[Task] = []
next_id = 1


@app.get("/")
def root():
    return {"message": "FastAPI fungerer"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/tasks")
def get_tasks():
    return tasks


@app.post("/tasks", response_model=Task, status_code=201)
def create_task(task: TaskCreate):
    global next_id

    new_task = Task(id=next_id, **task.model_dump())
    tasks.append(new_task)
    next_id += 1
    return new_task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    for index, task in enumerate(tasks):
        if task.id == task_id:
            tasks.pop(index)
            return

    raise HTTPException(status_code=404, detail="Oppgaven finnes ikke")