# Controlled Attack Demonstrations

These demonstrations are intended only for the local lab on `127.0.0.1:8081`.

## SQL injection

The vulnerable endpoint places input directly into a SQL statement representation:

```text
GET /sqli/vulnerable?name=' OR '1'='1
```

The hardened endpoint keeps attacker-controlled input outside the statement text:

```text
GET /sqli/fixed?name=' OR '1'='1
```

The regression test verifies that the payload cannot become part of the SQL statement in the hardened representation.

## XSS

The vulnerable endpoint returns supplied markup unchanged:

```text
GET /xss/vulnerable?value=<script>alert(1)</script>
```

The hardened endpoint HTML-escapes the same input before rendering it as content.

## IDOR / broken access control

The vulnerable example does not check record ownership:

```text
GET /idor/vulnerable/2?user=alice
```

The hardened example enforces ownership and denies the same cross-user request:

```text
GET /idor/fixed/2?user=alice
```

A legitimate owner request continues to work:

```text
GET /idor/fixed/1?user=alice
```

## What this demonstrates

The important security skill is not only reproducing the weakness. The lab records the complete engineering loop: reproduce -> identify root cause -> implement control -> add regression test -> keep the control in CI.
