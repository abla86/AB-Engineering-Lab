from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import subprocess
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
CURRICULUM = ROOT / "training" / "curriculum.json"
SCENARIOS = ROOT / "training" / "scenarios.json"
STATE = ROOT / "training" / ".progress.json"
HOST = "127.0.0.1"
PORT = 8090

VERIFIERS = {
    "00-foundations": [sys.executable, "-m", "pytest", "-q", "security-lab/test_training_labs.py::test_foundations_cover_security_boundaries"],
    "01-reconnaissance": [sys.executable, "-m", "pytest", "-q", "security-lab/test_training_labs.py::test_reconnaissance_inventory_is_local_and_bounded"],
    "02-web-security": [sys.executable, "-m", "pytest", "-q", "security-lab/test_security_lab.py", "security-lab/test_training_engine.py"],
    "03-network-security": [sys.executable, "-m", "pytest", "-q", "security-lab/test_training_labs.py::test_network_lab_finds_cleartext_database_path"],
    "04-identity-access": [sys.executable, "-m", "pytest", "-q", "security-lab/test_training_labs.py::test_identity_enforces_least_privilege"],
    "05-endpoint-security": [sys.executable, "-m", "pytest", "-q", "security-lab/test_training_labs.py::test_endpoint_lab_classifies_synthetic_indicator"],
    "06-blue-team": [sys.executable, "-m", "pytest", "-q", "security-lab/test_training_labs.py::test_blue_team_detects_repeated_auth_failures_and_privilege_change"],
    "07-red-blue": [sys.executable, "-m", "pytest", "-q", "security-lab/test_security_lab.py", "security-lab/test_training_labs.py"],
    "08-devsecops": [sys.executable, "-m", "pytest", "-q", "security-lab/test_training_labs.py::test_devsecops_has_security_gates"],
    "09-cloud-kubernetes": [sys.executable, "-m", "pytest", "-q", "security-lab/test_training_labs.py::test_cloud_lab_models_required_workload_controls"],
    "10-capstone": [sys.executable, "-m", "pytest", "-q", "security-lab/test_training_labs.py::test_capstone_chain_contains_all_stages"],
}

@dataclass(frozen=True)
class Module:
    id: str
    title: str
    level: str
    objectives: tuple[str, ...]
    lab: str
    verification: tuple[str, ...]


def load_modules() -> list[Module]:
    raw = json.loads(CURRICULUM.read_text(encoding="utf-8"))
    return [Module(
        id=item["id"],
        title=item["title"],
        level=item["level"],
        objectives=tuple(item["objectives"]),
        lab=item["lab"],
        verification=tuple(item["verification"]),
    ) for item in raw["modules"]]


def load_state() -> dict[str, Any]:
    if not STATE.exists():
        return {"completed": []}
    return json.loads(STATE.read_text(encoding="utf-8"))


def save_state(state: dict[str, Any]) -> None:
    STATE.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")


class TrainingHandler(BaseHTTPRequestHandler):
    def _json(self, status: int, payload: Any) -> None:
        body = json.dumps(payload, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)

    def _verify(self) -> None:
        length = int(self.headers.get("Content-Length", "0"))
        if length > 2048:
            self._json(413, {"error": "payload too large"})
            return
        try:
            payload = json.loads(self.rfile.read(length) or b"{}")
            module_id = str(payload["module_id"])
        except (ValueError, KeyError, TypeError, json.JSONDecodeError):
            self._json(400, {"error": "module_id is required"})
            return
        command = VERIFIERS.get(module_id)
        if command is None:
            self._json(200, {"module_id": module_id, "status": "manual", "message": "No automated verifier is defined for this module."})
            return
        result = self._run_verifier(module_id)
        self._json(200, result)

    def _run_verifier(self, module_id: str) -> dict[str, Any]:
        command = VERIFIERS.get(module_id)
        if command is None:
            return {"module_id": module_id, "status": "manual", "message": "No automated verifier is defined for this module."}
        try:
            result = subprocess.run(command, cwd=ROOT.parent, capture_output=True, text=True, timeout=120)
        except subprocess.TimeoutExpired:
            return {"module_id": module_id, "status": "failed", "message": "Verification timed out.", "command": command}
        return {
            "module_id": module_id,
            "status": "passed" if result.returncode == 0 else "failed",
            "returncode": result.returncode,
            "command": command,
            "output": (result.stdout + result.stderr)[-6000:],
        }

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/":
            dashboard = (ROOT / "training-dashboard.html").read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(dashboard)
            return
        if path == "/api/health":
            self._json(200, {"status": "ok", "service": "cyber-training-engine"})
            return
        if path == "/api/modules":
            modules = [asdict(module) for module in load_modules()]
            completed = set(load_state().get("completed", []))
            for module in modules:
                module["completed"] = module["id"] in completed
            self._json(200, {"modules": modules})
            return
        if path == "/api/progress":
            self._json(200, load_state())
            return
        if path == "/api/scenarios":
            base = json.loads(SCENARIOS.read_text(encoding="utf-8"))
            advanced = json.loads((ROOT / "training" / "scenarios-advanced.json").read_text(encoding="utf-8"))
            self._json(200, {"scenarios": base["scenarios"] + advanced["scenarios"]})
            return
        self._json(404, {"error": "not found"})

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/verify":
            self._verify()
            return
        if path != "/api/progress/complete":
            self._json(404, {"error": "not found"})
            return
        length = int(self.headers.get("Content-Length", "0"))
        if length > 4096:
            self._json(413, {"error": "payload too large"})
            return
        try:
            payload = json.loads(self.rfile.read(length) or b"{}")
            module_id = str(payload["module_id"])
            evidence = str(payload["evidence"]).strip()
        except (ValueError, KeyError, TypeError, json.JSONDecodeError):
            self._json(400, {"error": "module_id and evidence are required"})
            return
        if len(evidence) < 10 or len(evidence) > 1000:
            self._json(400, {"error": "evidence must contain 10-1000 characters"})
            return
        valid_ids = {module.id for module in load_modules()}
        if module_id not in valid_ids:
            self._json(400, {"error": "unknown module"})
            return
        verification = self._run_verifier(module_id)
        if verification["status"] == "failed":
            self._json(409, {"error": "automated verification failed", "verification": verification})
            return
        state = load_state()
        records = state.setdefault("records", {})
        records[module_id] = {"evidence": evidence, "verification": verification["status"]}
        state["completed"] = sorted(records)
        save_state(state)
        self._json(200, state)


def run() -> None:
    print(f"Cyber Security Training Engine: http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), TrainingHandler).serve_forever()


if __name__ == "__main__":
    run()
