# SecureDotNet

A deliberately small ASP.NET Core security reference implementation for portfolio review.

## Demonstrates

- C# and current .NET 10
- ASP.NET Core Minimal APIs
- authentication through a custom ASP.NET Core authentication scheme
- role-based authorization policy
- constant-time API-key comparison
- ASP.NET Core Data Protection for protected application data
- RSA-3072 digital signatures with SHA-256 and PSS
- deterministic verification behaviour for malformed signatures
- configuration-driven credentials with no committed secret

The API key is intentionally not stored in the repository. Set `DemoSecurity__ApiKey` through an environment variable or secret store before calling `/secure`.

## Run

```powershell
dotnet run --project projects/secure-dotnet/SecureDotNet.csproj
```

The public endpoint is `/`. The protected endpoint is `/secure` and requires:

```text
Authorization: ApiKey <configured-key>
```

Crypto endpoints:

- `POST /crypto/protect`
- `POST /crypto/unprotect`
- `POST /crypto/sign`
- `POST /crypto/verify`

Example payload:

```json
{"value":"portfolio-demo"}
```

## Security boundary

This is a teaching/reference implementation, not a production identity system. A real application should normally use an established identity provider or ASP.NET Core Identity/OIDC rather than inventing an authentication protocol. The purpose here is to make the framework extension points and cryptographic primitives directly inspectable.

The RSA key is generated in memory for the demonstration. It is not a production key-management design.

## Why this exists in the portfolio

The job requirements reviewed for this portfolio explicitly mention C#, current .NET, web applications, backend systems, authentication, digital signatures and encryption. This module provides executable evidence for those concepts without creating another standalone repository.
