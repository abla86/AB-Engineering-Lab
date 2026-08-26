from __future__ import annotations

from html import escape
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse

DEMO_RECORDS = {
    "1": {"owner": "alice", "value": "Research record A"},
    "2": {"owner": "bob", "value": "Research record B"},
}


def vulnerable_sql_query(name: str) -> str:
    """Intentionally vulnerable query construction for the lab."""
    return f"SELECT * FROM users WHERE name = '{name}'"


def fixed_sql_query(name: str) -> tuple[str, tuple[str]]:
    """Parameterised query representation used by the hardened example."""
    return "SELECT * FROM users WHERE name = ?", (name,)


def vulnerable_xss_render(value: str) -> str:
    """Intentionally unsafe HTML rendering example."""
    return f"<div>{value}</div>"


def fixed_xss_render(value: str) -> str:
    """Safe text rendering representation."""
    return f"<div>{escape(value)}</div>"


def vulnerable_idor(record_id: str, current_user: str) -> dict[str, str] | None:
    """Intentionally missing ownership check."""
    del current_user
    return DEMO_RECORDS.get(record_id)


def fixed_idor(record_id: str, current_user: str) -> dict[str, str] | None:
    """Hardened access control: a user may only read owned records."""
    record = DEMO_RECORDS.get(record_id)
    if record is None or record["owner"] != current_user:
        return None
    return record


class LabHandler(BaseHTTPRequestHandler):
    def _send(self, status: int, body: str, content_type: str = "text/plain; charset=utf-8") -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "no-referrer")
        self.end_headers()
        self.wfile.write(body.encode("utf-8"))

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        query = parse_qs(parsed.query)

        if parsed.path == "/":
            self._send(200, "Application Security Lab\nSee /help for local training endpoints.\n")
            return

        if parsed.path == "/help":
            self._send(
                200,
                "Local-only lab. Endpoints: /sqli/vulnerable, /sqli/fixed, /xss/vulnerable, "
                "/xss/fixed, /idor/vulnerable/<id>, /idor/fixed/<id>.\n",
            )
            return

        if parsed.path == "/sqli/vulnerable":
            name = query.get("name", [""])[0]
            self._send(200, vulnerable_sql_query(name))
            return

        if parsed.path == "/sqli/fixed":
            name = query.get("name", [""])[0]
            statement, parameters = fixed_sql_query(name)
            self._send(200, f"statement={statement}\nparameters={parameters!r}\n")
            return

        if parsed.path == "/xss/vulnerable":
            value = query.get("value", [""])[0]
            self._send(200, vulnerable_xss_render(value), "text/html; charset=utf-8")
            return

        if parsed.path == "/xss/fixed":
            value = query.get("value", [""])[0]
            self._send(200, fixed_xss_render(value), "text/html; charset=utf-8")
            return

        if parsed.path.startswith("/idor/"):
            parts = parsed.path.strip("/").split("/")
            if len(parts) == 3 and parts[0] == "idor":
                mode, record_id = parts[1], parts[2]
                current_user = query.get("user", [""])[0]
                if mode == "vulnerable":
                    record = vulnerable_idor(record_id, current_user)
                elif mode == "fixed":
                    record = fixed_idor(record_id, current_user)
                else:
                    self._send(404, "Unknown lab mode")
                    return
                if record is None:
                    self._send(403, "Access denied")
                else:
                    self._send(200, str(record))
                return

        self._send(404, "Not found")


def run() -> None:
    server = HTTPServer(("127.0.0.1", 8081), LabHandler)
    print("Security lab listening on http://127.0.0.1:8081")
    server.serve_forever()


if __name__ == "__main__":
    run()
