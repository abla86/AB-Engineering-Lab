from __future__ import annotations

import ast
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent


def python_files() -> list[Path]:
    return sorted(ROOT.rglob("*.py"))


def audit_python_security() -> list[str]:
    findings: list[str] = []
    banned_calls = {"eval", "exec"}
    for path in python_files():
        source = path.read_text(encoding="utf-8")
        tree = ast.parse(source, filename=str(path))
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id in banned_calls:
                    findings.append(f"{path}: banned dynamic execution {node.func.id}()")
                if isinstance(node.func, ast.Attribute):
                    qualified = f"{getattr(node.func.value, 'id', '')}.{node.func.attr}"
                    if qualified in {"os.system", "os.popen", "pickle.loads", "pickle.load"}:
                        findings.append(f"{path}: unsafe call {qualified}()")
                    for keyword in node.keywords:
                        if keyword.arg == "shell" and isinstance(keyword.value, ast.Constant) and keyword.value.value is True:
                            findings.append(f"{path}: subprocess shell=True")
        if "0.0.0.0" in source:
            findings.append(f"{path}: wildcard network binding is forbidden in the local training lab")
    return findings


def audit_web_security() -> list[str]:
    findings: list[str] = []
    app = (ROOT / "app.py").read_text(encoding="utf-8")
    engine = (ROOT / "training_engine.py").read_text(encoding="utf-8")
    dashboard = (ROOT / "training-dashboard.html").read_text(encoding="utf-8")
    if 'Content-Security-Policy' not in app or "default-src 'none'" not in app:
        findings.append("app.py: strict CSP missing")
    if 'Content-Security-Policy' not in engine or "frame-ancestors 'none'" not in engine:
        findings.append("training_engine.py: strict CSP missing")
    if "unsafe-inline" in dashboard:
        findings.append("training-dashboard.html: unsafe-inline is forbidden")
    if re.search(r"<script(?![^>]+src=)", dashboard, re.I):
        findings.append("training-dashboard.html: inline script is forbidden")
    if "127.0.0.1" not in app or "127.0.0.1" not in engine:
        findings.append("local-only binding is missing")
    return findings


def run_audit() -> None:
    findings = audit_python_security() + audit_web_security()
    if findings:
        raise SystemExit("\n".join(findings))
    print(f"Security audit passed: {len(python_files())} Python files inspected.")


if __name__ == "__main__":
    run_audit()
