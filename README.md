# SYSTEMS LAB

AB Engineering-noden for runtime, ytelse og samtidighet.

## Engines

1. **Native WebAssembly Benchmark** — kompilerer og instansierer et faktisk WebAssembly-modul i nettleseren og sammenligner målt utførelse mot JavaScript.
2. **Native Web Worker Pool** — oppretter faktiske Web Workers og fordeler CPU-arbeid utenfor hovedtråden.

## Teknisk integritet

Dette er en browser-basert systems-lab med reell bruk av WebAssembly API og Web Worker API. Benchmarken rapporterer målte nettlesertider og validerer at beregningsresultatene samsvarer. Worker-poolen rapporterer faktisk opprettede arbeidere, fullførte jobber og målt kjøretid.

## Local

```powershell
npm test
npm run build
```

GitHub Actions kjører samme validering med Node.js 22.

All benchmark-data genereres lokalt i nettleseren. Prosjektet bruker ingen eksterne API-er eller backend-tjenester.
