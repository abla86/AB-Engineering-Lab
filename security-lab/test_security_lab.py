from app import (
    fixed_idor,
    fixed_input_validation,
    fixed_sql_query,
    fixed_xss_render,
    vulnerable_idor,
    vulnerable_sql_query,
    vulnerable_xss_render,
)


def test_sqli_vulnerable_example_is_detectable():
    payload = "' OR '1'='1"
    query = vulnerable_sql_query(payload)
    assert payload in query


def test_sqli_fixed_example_parameterises_input():
    payload = "' OR '1'='1"
    statement, parameters = fixed_sql_query(payload)
    assert payload not in statement
    assert parameters == (payload,)


def test_xss_vulnerable_example_preserves_markup():
    payload = '<script>alert(1)</script>'
    assert vulnerable_xss_render(payload) == f"<div>{payload}</div>"


def test_xss_fixed_example_escapes_markup():
    payload = '<script>alert(1)</script>'
    rendered = fixed_xss_render(payload)
    assert "&lt;script&gt;" in rendered
    assert payload not in rendered


def test_idor_vulnerable_example_exposes_other_users_record():
    assert vulnerable_idor("2", "alice")["owner"] == "bob"


def test_idor_fixed_example_denies_other_users_record():
    assert fixed_idor("2", "alice") is None
    assert fixed_idor("1", "alice")["owner"] == "alice"


def test_input_validation_accepts_expected_value():
    assert fixed_input_validation("Research record 1") == "Research record 1"


def test_input_validation_rejects_script_markup():
    import pytest

    with pytest.raises(ValueError):
        fixed_input_validation("<script>alert(1)</script>")
