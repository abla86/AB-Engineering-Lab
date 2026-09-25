from labs import (
    BLUE_EVENTS,
    ENDPOINT_EVENTS,
    NETWORK_EVENTS,
    authorize,
    capstone_chain,
    detect_blue_team,
    endpoint_findings,
    network_findings,
    foundation_boundaries,
    inventory_assets,
    devsecops_controls,
    cloud_controls,
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


def test_foundations_cover_security_boundaries():
    assert foundation_boundaries() == ["confidentiality", "integrity", "availability", "authentication", "authorization"]


def test_reconnaissance_inventory_is_local_and_bounded():
    assets = inventory_assets()
    assert len(assets) == 2
    assert all(item["boundary"].startswith("127.0.0.1:") for item in assets)


def test_devsecops_has_security_gates():
    assert set(devsecops_controls()) == {"source-tests", "dependency-review", "codeql", "security-training-ci"}


def test_cloud_lab_models_required_workload_controls():
    assert set(cloud_controls()) == {"rbac", "workload-identity", "network-policy", "secret-management"}


def test_capstone_chain_fails_when_detection_is_missing():
    original = BLUE_EVENTS[:]
    try:
        BLUE_EVENTS[:] = [event for event in BLUE_EVENTS if event["type"] != "privilege_change"]
        assert capstone_chain()["detection"] is False
    finally:
        BLUE_EVENTS[:] = original
