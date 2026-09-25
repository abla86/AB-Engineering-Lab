from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class Detection:
    rule_id: str
    severity: str
    event_id: str
    reason: str


BLUE_EVENTS = [
    {"id": "evt-001", "type": "auth_failure", "user": "alice", "source": "10.0.0.20", "count": 7},
    {"id": "evt-002", "type": "privilege_change", "user": "alice", "source": "10.0.0.20", "role": "admin"},
    {"id": "evt-003", "type": "data_access", "user": "alice", "source": "10.0.0.20", "record_count": 12},
    {"id": "evt-004", "type": "normal_login", "user": "bob", "source": "10.0.0.30"},
]

IDENTITIES = {
    "alice": {"roles": {"analyst"}, "permissions": {"read_reports"}},
    "bob": {"roles": {"manager"}, "permissions": {"read_reports", "approve_reports"}},
}

NETWORK_EVENTS = [
    {"id": "net-001", "src": "workstation", "dst": "api", "protocol": "https", "encrypted": True},
    {"id": "net-002", "src": "workstation", "dst": "database", "protocol": "tcp", "encrypted": False},
    {"id": "net-003", "src": "api", "dst": "database", "protocol": "tcp", "encrypted": True},
]

ENDPOINT_EVENTS = [
    {"id": "ep-001", "host": "lab-pc-01", "type": "process_start", "process": "powershell", "parent": "explorer"},
    {"id": "ep-002", "host": "lab-pc-01", "type": "file_write", "path": "C:/Lab/quarantine/sample.txt"},
    {"id": "ep-003", "host": "lab-pc-01", "type": "network_connection", "destination": "127.0.0.1:8081"},
]


def detect_blue_team(events: list[dict[str, Any]]) -> list[Detection]:
    detections = []
    failures = [e for e in events if e.get("type") == "auth_failure" and e.get("count", 0) >= 5]
    for event in failures:
        detections.append(Detection("AUTH-BRUTE-001", "medium", event["id"], "Repeated authentication failures"))
    privilege = [e for e in events if e.get("type") == "privilege_change" and e.get("role") == "admin"]
    for event in privilege:
        detections.append(Detection("PRIV-ESC-001", "high", event["id"], "Synthetic admin privilege change"))
    return detections


def authorize(user: str, permission: str) -> bool:
    identity = IDENTITIES.get(user)
    return bool(identity and permission in identity["permissions"])


def network_findings(events: list[dict[str, Any]]) -> list[str]:
    return [
        f"{event['id']}: cleartext transport to database"
        for event in events
        if event.get("dst") == "database" and not event.get("encrypted", False)
    ]


def endpoint_findings(events: list[dict[str, Any]]) -> list[str]:
    return [
        f"{event['id']}: PowerShell process observed"
        for event in events
        if event.get("type") == "process_start" and event.get("process") == "powershell"
    ]


def capstone_chain() -> dict[str, bool]:
    detections = detect_blue_team(BLUE_EVENTS)
    cleartext = network_findings(NETWORK_EVENTS)
    endpoint = endpoint_findings(ENDPOINT_EVENTS)
    return {
        "vulnerability": bool(cleartext),
        "detection": any(d.rule_id == "PRIV-ESC-001" for d in detections),
        "containment": bool(endpoint) and any(d.rule_id == "AUTH-BRUTE-001" for d in detections),
        "remediation": authorize("alice", "read_reports") and not authorize("alice", "approve_reports"),
        "verification": not authorize("alice", "approve_reports") and len(cleartext) == 1,
    }


ASSET_INVENTORY = [
    {"asset": "training-engine", "boundary": "127.0.0.1:8090", "control": "local-only binding"},
    {"asset": "security-lab", "boundary": "127.0.0.1:8081", "control": "synthetic vulnerable target"},
]

DEVSECOPS_CONTROLS = {
    "source-tests": True,
    "dependency-review": True,
    "codeql": True,
    "security-training-ci": True,
}

CLOUD_CONTROLS = {
    "rbac": True,
    "workload-identity": True,
    "network-policy": True,
    "secret-management": True,
}


def foundation_boundaries() -> list[str]:
    return ["confidentiality", "integrity", "availability", "authentication", "authorization"]


def inventory_assets() -> list[dict[str, str]]:
    return ASSET_INVENTORY.copy()


def devsecops_controls() -> list[str]:
    return [name for name, enabled in DEVSECOPS_CONTROLS.items() if enabled]


def cloud_controls() -> list[str]:
    return [name for name, enabled in CLOUD_CONTROLS.items() if enabled]
