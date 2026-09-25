# Next.js showcase

A bounded demonstration of the Next.js **App Router**:

- `app/page.tsx` – a React Server Component (renders on the server, no client JS)
- `app/api/health/route.ts` – a typed route handler (`HealthResponse`)
- `lib/events.ts` – pure, tested domain logic
- `tests/events.test.ts` – Vitest tests for the logic and the route handler

```bash
npm install
npm run lint   # tsc --noEmit
npm test
npm run build
npm run dev    # http://localhost:3000
```
