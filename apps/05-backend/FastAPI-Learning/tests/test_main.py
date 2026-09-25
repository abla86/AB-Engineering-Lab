from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_and_health():
    assert client.get("/").json() == {"message": "FastAPI fungerer"}
    assert client.get("/health").json() == {"status": "ok"}


def test_create_list_and_delete_task():
    created = client.post("/tasks", json={"title": "pytest-oppgave"})
    assert created.status_code == 201
    task = created.json()
    assert task["title"] == "pytest-oppgave"
    assert task["completed"] is False

    listed = client.get("/tasks").json()
    assert any(t["id"] == task["id"] for t in listed)

    assert client.delete(f"/tasks/{task['id']}").status_code == 204
    assert all(t["id"] != task["id"] for t in client.get("/tasks").json())


def test_delete_missing_task_returns_404():
    response = client.delete("/tasks/999999")
    assert response.status_code == 404
