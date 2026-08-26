from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import Task

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FastAPI Learning",
    version="1.0.0",
    description="Et enkelt læringsprosjekt med FastAPI",
)


class TaskCreate(BaseModel):
    title: str
    completed: bool = False


@app.get("/")
def root():
    return {"message": "FastAPI fungerer"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).order_by(Task.id).all()


@app.post("/tasks", status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = Task(
        title=task.title,
        completed=task.completed,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.get(Task, task_id)

    if task is None:
        raise HTTPException(status_code=404, detail="Oppgaven finnes ikke")

    db.delete(task)
    db.commit()