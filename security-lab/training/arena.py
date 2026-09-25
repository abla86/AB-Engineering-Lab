from __future__ import annotations

"""Safe, deterministic cyber range.

This engine simulates attacker and defender behavior with synthetic events only.
It never executes generated attack payloads, touches the network, invokes a shell,
or targets external systems. Mutations alter scenario parameters, not executable
payloads.
"""

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
import hashlib
import itertools
import json
from pathlib import Path
from typing import Any
import os
import tempfile
import threading

ROOT = Path(__file__).resolve().parent
CATALOG = ROOT / "training" / "attack-defense-catalog.json"
ARENA_STATE = ROOT / "training" / ".arena.json"
ARENA_LOCK = threading.Lock()

ALLOWED_MUTATIONS = {
    "intensity": (1, 10),
    "burst": (1, 20),
    "privilege_delta": (0, 3),
    "encoding_variant": (0, 4),
    "source_count": (1, 5),
    "delay": (0, 30),
}


@dataclass(frozen=True)
class SyntheticEvent:
    event_id: str
    technique: str
    source: str
    target: str
    signal: str
    severity: str
    sequence: int


@dataclass(frozen=True)
class Detection:
    rule_id: str
    technique: str
    confidence: int
    action: str
    reason: str


@dataclass(frozen=True)
class BattleResult:
    battle_id: str
    attack: str
    defenses: tuple[str, ...]
    attack_score: int
    defense_score: int
    outcome: str
    detections: tuple[Detection, ...]
    events: tuple[SyntheticEvent, ...]
    lessons: tuple[str, ...]
    signature: str


def load_catalog() -> dict[str, Any]:
    return json.loads(CATALOG.read_text(encoding="utf-8"))


def _attack_catalog() -> dict[str, dict[str, Any]]:
    return {item["id"]: item for item in load_catalog()["attacks"]}


def _defense_catalog() -> dict[str, dict[str, Any]]:
    return {item["id"]: item for item in load_catalog()["defenses"]}


def validate_mutations(raw: dict[str, Any] | None) -> dict[str, int]:
    raw = raw or {}
    result: dict[str, int] = {}
    for key, (low, high) in ALLOWED_MUTATIONS.items():
        value = raw.get(key, 1 if key in {"intensity", "burst", "source_count"} else 0)
        if isinstance(value, bool) or not isinstance(value, int) or not low <= value <= high:
            raise ValueError(f"invalid mutation: {key}")
        result[key] = value
    return result


def generate_events(attack_id: str, mutations: dict[str, Any] | None = None) -> list[SyntheticEvent]:
    attacks = _attack_catalog()
    attack = attacks.get(attack_id)
    if attack is None:
        raise ValueError("unknown attack scenario")
    m = validate_mutations(mutations)
    intensity = m["intensity"]
    burst = m["burst"]
    source_count = m["source_count"]
    delay = m["delay"]
    events: list[SyntheticEvent] = []
    for index, signal in enumerate(attack["signals"], start=1):
        multiplier = max(1, min(10, intensity + (burst // 5) - 1))
        for source_index in range(source_count if signal == "distributed" else 1):
            event_number = len(events) + 1
            events.append(SyntheticEvent(
                event_id=f"sim-{event_number:04d}",
                technique=attack["technique"],
                source=f"synthetic-source-{source_index + 1}",
                target=attack["target"],
                signal=signal,
                severity=attack["severity"],
                sequence=index * 100 + source_index + delay * 10 + multiplier,
            ))
    return sorted(events, key=lambda event: (event.sequence, event.event_id))


def detect(events: list[SyntheticEvent], defense_ids: list[str]) -> list[Detection]:
    defenses = _defense_catalog()
    detections: list[Detection] = []
    for defense_id in defense_ids:
        defense = defenses.get(defense_id)
        if defense is None:
            raise ValueError("unknown defense control")
        for event in events:
            if event.signal in defense["signals"] or event.technique in defense["techniques"]:
                confidence = min(99, defense["base_confidence"] + (10 if event.severity == "high" else 0))
                detections.append(Detection(
                    rule_id=defense["rule_id"],
                    technique=event.technique,
                    confidence=confidence,
                    action=defense["action"],
                    reason=f"{defense['name']} matched {event.signal}",
                ))
    unique: dict[tuple[str, str], Detection] = {}
    for detection in detections:
        unique[(detection.rule_id, detection.technique)] = detection
    return list(unique.values())


def battle(
    attack_id: str,
    defense_ids: list[str],
    mutations: dict[str, Any] | None = None,
) -> BattleResult:
    attacks = _attack_catalog()
    defenses = _defense_catalog()
    if attack_id not in attacks:
        raise ValueError("unknown attack scenario")
    if not defense_ids or len(defense_ids) > 8:
        raise ValueError("choose 1-8 defense controls")
    if len(set(defense_ids)) != len(defense_ids) or any(item not in defenses for item in defense_ids):
        raise ValueError("unknown or duplicate defense control")

    events = generate_events(attack_id, mutations)
    detections = detect(events, defense_ids)
    attack = attacks[attack_id]
    coverage = len({d.technique for d in detections}) / max(1, len({e.technique for e in events}))
    response_strength = sum(defenses[item]["response_strength"] for item in defense_ids)
    attack_score = min(100, attack["base_pressure"] + len(events) * 2)
    defense_score = min(100, int(coverage * 60) + response_strength)
    if defense_score >= 80:
        outcome = "defender-contained"
    elif defense_score >= 50:
        outcome = "contested"
    else:
        outcome = "attacker-breakthrough"

    lessons = []
    if not detections:
        lessons.append("No selected control produced a detection; improve telemetry or detection coverage.")
    if coverage < 1:
        lessons.append("Detection coverage is incomplete; map the missing signal to a defensive control.")
    if response_strength < 30:
        lessons.append("Containment depth is low; add layered response controls.")
    if defense_score >= 80:
        lessons.append("Layered controls contained the simulated technique; verify that the same control is tested in regression.")
    if not lessons:
        lessons.append("The control set resisted the simulated path; vary mutations and retest.")

    canonical = json.dumps({
        "attack": attack_id,
        "defenses": sorted(defense_ids),
        "mutations": validate_mutations(mutations),
        "events": [asdict(event) for event in events],
        "detections": [asdict(detection) for detection in detections],
        "outcome": outcome,
    }, sort_keys=True, separators=(",", ":"))
    battle_id = hashlib.sha256(canonical.encode()).hexdigest()[:16]
    signature = hashlib.sha256(("AB-SENTINEL-MESH:" + canonical).encode()).hexdigest()

    return BattleResult(
        battle_id=battle_id,
        attack=attack_id,
        defenses=tuple(defense_ids),
        attack_score=attack_score,
        defense_score=defense_score,
        outcome=outcome,
        detections=tuple(detections),
        events=tuple(events),
        lessons=tuple(lessons),
        signature=signature,
    )


def save_battle(result: BattleResult) -> None:
    state = load_state()
    battles = state.setdefault("battles", [])
    battles.append({
        "timestamp": datetime.now(timezone.utc).isoformat(),
        **asdict(result),
        "defenses": list(result.defenses),
        "detections": [asdict(item) for item in result.detections],
        "events": [asdict(item) for item in result.events],
        "lessons": list(result.lessons),
    })
    state["battles"] = battles[-500:]
    data = json.dumps(state, indent=2) + "\n"
    ARENA_STATE.parent.mkdir(parents=True, exist_ok=True)
    with ARENA_LOCK:
        fd, temporary = tempfile.mkstemp(prefix=".arena-", dir=ARENA_STATE.parent)
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as handle:
                handle.write(data)
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(temporary, ARENA_STATE)
        finally:
            if os.path.exists(temporary):
                os.unlink(temporary)


def load_state() -> dict[str, Any]:
    if not ARENA_STATE.exists():
        return {"battles": []}
    return json.loads(ARENA_STATE.read_text(encoding="utf-8"))


def scoreboard() -> dict[str, Any]:
    battles = load_state().get("battles", [])
    attack_wins = sum(item["outcome"] == "attacker-breakthrough" for item in battles)
    defense_wins = sum(item["outcome"] == "defender-contained" for item in battles)
    contested = len(battles) - attack_wins - defense_wins
    return {
        "battles": len(battles),
        "attacker_wins": attack_wins,
        "defender_wins": defense_wins,
        "contested": contested,
        "defense_rate": round(defense_wins / len(battles) * 100, 1) if battles else 0.0,
        "last_battles": battles[-20:],
    }


def generate_matrix(attack_ids: list[str], defense_ids: list[str], limit: int = 100) -> list[dict[str, Any]]:
    if not attack_ids or not defense_ids:
        raise ValueError("attack and defense selections are required")
    attacks = _attack_catalog()
    defenses = _defense_catalog()
    if any(item not in attacks for item in attack_ids) or any(item not in defenses for item in defense_ids):
        raise ValueError("unknown matrix member")
    matrix = []
    for attack_id, defense_id in itertools.product(attack_ids, defense_ids):
        if len(matrix) >= limit:
            break
        result = battle(attack_id, [defense_id], {"intensity": 5, "burst": 5, "source_count": 1})
        matrix.append({
            "attack": attack_id,
            "defense": defense_id,
            "outcome": result.outcome,
            "attack_score": result.attack_score,
            "defense_score": result.defense_score,
        })
    return matrix
