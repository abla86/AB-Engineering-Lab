from training.arena import battle, generate_events, generate_matrix, scoreboard, validate_mutations


def test_arena_simulation_never_executes_payloads_and_is_deterministic():
    first = battle("sim-injection", ["def-input"], {"intensity": 5, "burst": 5, "source_count": 1, "delay": 0})
    second = battle("sim-injection", ["def-input"], {"intensity": 5, "burst": 5, "source_count": 1, "delay": 0})
    assert first.battle_id == second.battle_id
    assert first.signature == second.signature
    assert first.events
    assert all(event.source.startswith("synthetic-") for event in first.events)


def test_arena_rejects_out_of_range_mutations():
    try:
        validate_mutations({"intensity": 99})
    except ValueError:
        return
    raise AssertionError("unsafe mutation range accepted")


def test_arena_layered_defense_changes_result():
    weak = battle("sim-supply-chain", ["def-input"])
    strong = battle("sim-supply-chain", ["def-integrity", "def-recovery"])
    assert strong.defense_score > weak.defense_score


def test_arena_matrix_is_bounded():
    result = generate_matrix(["sim-injection", "sim-xss"], ["def-input", "def-behavior"])
    assert len(result) == 4


def test_arena_events_are_synthetic_and_local():
    events = generate_events("sim-endpoint", {"intensity": 3, "burst": 2, "source_count": 2, "delay": 1})
    assert events
    assert all(event.source.startswith("synthetic-") for event in events)
    assert all(event.target.startswith("synthetic-") for event in events)


def test_scoreboard_empty_state_is_safe():
    data = scoreboard()
    assert "battles" in data
    assert "defense_rate" in data
