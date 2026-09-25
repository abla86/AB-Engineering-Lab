from security_audit import audit_python_security, audit_web_security


def test_security_baseline_has_no_banned_python_constructs():
    assert audit_python_security() == []


def test_security_baseline_enforces_web_controls():
    assert audit_web_security() == []
