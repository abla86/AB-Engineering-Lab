# Security Lab Threat Model

## Assets

- Demo user records
- API responses
- Browser-rendered content
- Application integrity

## Trust boundaries

1. HTTP request -> application input
2. Application input -> query/rendering logic
3. Request identity -> object authorization
4. Code changes -> CI verification

## Threats demonstrated

| Threat | Failure mode | Control |
|---|---|---|
| SQL injection | input becomes executable query syntax | parameterised query |
| XSS | input becomes executable browser markup | output encoding / text rendering |
| IDOR | authenticated user reaches another user's object | ownership authorization |
| Browser abuse | missing basic response protections | security headers |
| Invalid input | unexpected values cross application boundary | explicit validation |

## Security objective

Prevent attacker-controlled input from crossing a trust boundary without an appropriate validation, encoding, parameterisation or authorization control.

## Verification principle

A control is considered useful only when a regression test demonstrates the previously vulnerable behaviour is blocked and the test is executed automatically by CI.
