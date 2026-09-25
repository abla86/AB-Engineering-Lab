from __future__ import annotations

import json
import threading
from http.client import HTTPConnection
from pathlib import Path
from tempfile import TemporaryDirectory

import training_engine


def test_curriculum_has_all_modules() -> None:
    modules = training_engine.load_modules()
    assert len(modules) == 11
    assert modules[0].id == "00-foundations"
    assert modules[-1].id == "10-capstone"


def test_curriculum_is_valid_json() -> None:
    data = json.loads(training_engine.CURRICULUM.read_text(encoding="utf-8"))
    assert len(data["modules"]) == 11
    assert all(item["objectives"] for item in data["modules"])


def test_progress_round_trip() -> None:
    with TemporaryDirectory() as directory:
        original = training_engine.STATE
        try:
            training_engine.STATE = Path(directory) / "progress.json"
            assert training_engine.load_state() == {"completed": []}
            training_engine.save_state({"completed": ["00-foundations"]})
            assert training_engine.load_state()["completed"] == {"completed": ["00-foundations"]}
        finally:
            training_engine.STATE = original


def test_api_health_and_modules() -> None:
    server = training_engine.ThreadingHTTPServer(("127.0.0.1", 0), training_engine.TrainingHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        connection = HTTPConnection("127.0.0.1", server.server_address[1], timeout=2)
        connection.request("GET", "/api/health")
        response = connection.getresponse()
        assert response.status == 200
        assert json.loads(response.read())["status"] == "ok"
        connection.request("GET", "/api/modules")
        response = connection.getresponse()
        assert response.status == 200
        assert len(json.loads(response.read())["modules"]) == 11
        connection.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)
