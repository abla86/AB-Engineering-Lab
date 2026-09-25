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
            assert training_engine.load_state()["completed"] == ["00-foundations"]
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


def test_progress_completion_requires_valid_evidence() -> None:
    server = training_engine.ThreadingHTTPServer(("127.0.0.1", 0), training_engine.TrainingHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    original = training_engine.STATE
    with TemporaryDirectory() as directory:
        try:
            training_engine.STATE = Path(directory) / "progress.json"
            thread.start()
            connection = HTTPConnection("127.0.0.1", server.server_address[1], timeout=2)
            body = json.dumps({"module_id": "00-foundations", "evidence": "too short"}).encode()
            connection.request("POST", "/api/progress/complete", body=body, headers={"Content-Type": "application/json"})
            response = connection.getresponse()
            assert response.status == 400
            body = json.dumps({"module_id": "00-foundations", "evidence": "Completed the foundation lab and documented the verification result."}).encode()
            connection.request("POST", "/api/progress/complete", body=body, headers={"Content-Type": "application/json"})
            response = connection.getresponse()
            assert response.status == 200
            state = json.loads(response.read())
            assert state["completed"] == ["00-foundations"]
            assert state["records"]["00-foundations"]["evidence"].startswith("Completed")
            connection.close()
        finally:
            training_engine.STATE = original
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)

def test_verify_endpoint_rejects_unknown_command_without_execution() -> None:
    server = training_engine.ThreadingHTTPServer(("127.0.0.1", 0), training_engine.TrainingHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        connection = HTTPConnection("127.0.0.1", server.server_address[1], timeout=2)
        body = json.dumps({"module_id": "01-reconnaissance"}).encode()
        connection.request("POST", "/api/verify", body=body, headers={"Content-Type": "application/json"})
        response = connection.getresponse()
        payload = json.loads(response.read())
        assert response.status == 200
        assert payload["status"] == "manual"
        connection.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)

def test_verify_endpoint_runs_allowlisted_web_security_tests() -> None:
    server = training_engine.ThreadingHTTPServer(("127.0.0.1", 0), training_engine.TrainingHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        connection = HTTPConnection("127.0.0.1", server.server_address[1], timeout=130)
        body = json.dumps({"module_id": "02-web-security"}).encode()
        connection.request("POST", "/api/verify", body=body, headers={"Content-Type": "application/json"})
        response = connection.getresponse()
        payload = json.loads(response.read())
        assert response.status == 200
        assert payload["status"] == "passed"
        connection.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)

def test_scenarios_api_exposes_contained_web_security_cases() -> None:
    server = training_engine.ThreadingHTTPServer(("127.0.0.1", 0), training_engine.TrainingHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        connection = HTTPConnection("127.0.0.1", server.server_address[1], timeout=2)
        connection.request("GET", "/api/scenarios")
        response = connection.getresponse()
        payload = json.loads(response.read())
        assert response.status == 200
        assert len(payload["scenarios"]) == 11
        assert sum(item["module_id"] == "02-web-security" for item in payload["scenarios"]) == 3
        connection.close()
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)


def test_completion_cannot_bypass_failed_automated_verification() -> None:
    server = training_engine.ThreadingHTTPServer(("127.0.0.1", 0), training_engine.TrainingHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    original = training_engine.VERIFIERS
    try:
        training_engine.VERIFIERS = {"00-foundations": [training_engine.sys.executable, "-c", "raise SystemExit(1)"]}
        thread.start()
        connection = HTTPConnection("127.0.0.1", server.server_address[1], timeout=5)
        body = json.dumps({"module_id": "00-foundations", "evidence": "This evidence is deliberately paired with a failed verifier."}).encode()
        connection.request("POST", "/api/progress/complete", body=body, headers={"Content-Type": "application/json"})
        response = connection.getresponse()
        payload = json.loads(response.read())
        assert response.status == 409
        assert payload["error"] == "automated verification failed"
        connection.close()
    finally:
        training_engine.VERIFIERS = original
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)
