from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
CURRICULUM = ROOT / "training" / "curriculum.json"
STATE = ROOT / "training" / ".progress.json"
HOST = "127.0.0.1"
PORT = 8090


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
        self._json(404, {"error": "not found"})

    def do_POST(self) -> None:
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
            return
        valid_ids = {module.id for module in load_modules()}
        if module_id not in valid_ids:
            self._json(400, {"error": "unknown module"})
            return
        state = load_state()
        records = state.setdefault("records", {})
        records[module_id] = {"evidence": evidence}
        state["completed"] = sorted(records)
        save_state(state)
        self._json(200, state)


def run() -> None:
    print(f"Cyber Security Training Engine: http://{HOST}:{PORT}")
    ThreadingHTTPServer((HOST, PORT), TrainingHandler).serve_forever()


if __name__ == "__main__":
    run()
