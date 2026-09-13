using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDataProtection();
builder.Services.AddSingleton<DemoCryptoService>();

builder.Services
    .AddAuthentication("DemoApiKey")
    .AddScheme<DemoApiKeyOptions, DemoApiKeyHandler>("DemoApiKey", options =>
    {
        options.ApiKey = builder.Configuration["DemoSecurity:ApiKey"] ?? string.Empty;
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Engineer", policy =>
        policy.RequireAuthenticatedUser().RequireRole("engineer"));
});

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => Results.Ok(new
{
    service = "SecureDotNet",
    framework = ".NET 10",
    capabilities = new[] { "ASP.NET Core", "authentication", "authorization", "data-protection", "RSA digital signatures" }
}));

app.MapGet("/secure", (ClaimsPrincipal user) => Results.Ok(new
{
    message = "Authenticated endpoint",
    user = user.Identity?.Name,
    role = user.FindFirstValue(ClaimTypes.Role)
})).RequireAuthorization("Engineer");

app.MapPost("/crypto/protect", (CryptoRequest request, DemoCryptoService crypto) =>
    Results.Ok(new { protectedValue = crypto.Protect(request.Value) }));

app.MapPost("/crypto/unprotect", (CryptoRequest request, DemoCryptoService crypto) =>
    Results.Ok(new { value = crypto.Unprotect(request.Value) }));

app.MapPost("/crypto/sign", (CryptoRequest request, DemoCryptoService crypto) =>
    Results.Ok(new { signature = crypto.Sign(request.Value) }));

app.MapPost("/crypto/verify", (VerifyRequest request, DemoCryptoService crypto) =>
    Results.Ok(new { valid = crypto.Verify(request.Value, request.Signature) }));

app.Run();

public sealed record CryptoRequest(string Value);
public sealed record VerifyRequest(string Value, string Signature);

public sealed class DemoCryptoService
{
    private readonly IDataProtector _protector;
    private readonly RSA _signingKey = RSA.Create(3072);

    public DemoCryptoService(IDataProtectionProvider provider)
    {
        _protector = provider.CreateProtector("AB.EngineeringLab.SecureDotNet.v1");
    }

    public string Protect(string value) => _protector.Protect(value);

    public string Unprotect(string value) => _protector.Unprotect(value);

    public string Sign(string value) => Convert.ToBase64String(
        _signingKey.SignData(Encoding.UTF8.GetBytes(value), HashAlgorithmName.SHA256, RSASignaturePadding.Pss));

    public bool Verify(string value, string signature)
    {
        try
        {
            return _signingKey.VerifyData(
                Encoding.UTF8.GetBytes(value),
                Convert.FromBase64String(signature),
                HashAlgorithmName.SHA256,
                RSASignaturePadding.Pss);
        }
        catch (FormatException)
        {
            return false;
        }
    }
}

public sealed class DemoApiKeyOptions : AuthenticationSchemeOptions
{
    public string ApiKey { get; set; } = string.Empty;
}

public sealed class DemoApiKeyHandler : AuthenticationHandler<DemoApiKeyOptions>
{
    public DemoApiKeyHandler(
        IOptionsMonitor<DemoApiKeyOptions> options,
        ILoggerFactory logger,
        System.Text.Encodings.Web.UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (string.IsNullOrWhiteSpace(Options.ApiKey))
            return Task.FromResult(AuthenticateResult.Fail("Demo API key is not configured."));

        if (!Request.Headers.TryGetValue("Authorization", out var header))
            return Task.FromResult(AuthenticateResult.NoResult());

        const string prefix = "ApiKey ";
        var supplied = header.ToString();
        if (!supplied.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            return Task.FromResult(AuthenticateResult.NoResult());

        var candidate = supplied[prefix.Length..];
        var expectedBytes = Encoding.UTF8.GetBytes(Options.ApiKey);
        var candidateBytes = Encoding.UTF8.GetBytes(candidate);

        var valid = CryptographicOperations.FixedTimeEquals(expectedBytes, candidateBytes);
        if (!valid)
            return Task.FromResult(AuthenticateResult.Fail("Invalid API key."));

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, "portfolio-engineer"),
            new Claim(ClaimTypes.Role, "engineer")
        };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(principal, Scheme.Name)));
    }
}
