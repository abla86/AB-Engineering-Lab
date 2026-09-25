from labs import (
    BLUE_EVENTS,
    ENDPOINT_EVENTS,
    NETWORK_EVENTS,
    authorize,
    capstone_chain,
    detect_blue_team,
    endpoint_findings,
    network_findings,
)


def test_blue_team_detects_repeated_auth_failures_and_privilege_change():
    detections = detect_blue_team(BLUE_EVENTS)
    assert {d.rule_id for d in detections} == {"AUTH-BRUTE-001", "PRIV-ESC-001"}


def test_identity_enforces_least_privilege():
    assert authorize("alice", "read_reports")
    assert not authorize("alice", "approve_reports")
    assert authorize("bob", "approve_reports")
    assert not authorize("unknown", "read_reports")


def test_network_lab_finds_cleartext_database_path():
    assert network_findings(NETWORK_EVENTS) == ["net-002: cleartext transport to database"]


def test_endpoint_lab_classifies_synthetic_indicator():
    assert endpoint_findings(ENDPOINT_EVENTS) == ["ep-001: PowerShell process observed"]


def test_capstone_chain_contains_all_stages():
    assert all(capstone_chain().values())
