import { sampleEvents, summarizeEvents } from "../lib/events";

// React Server Component: runs on the server, ships no client JavaScript.
export default async function Page() {
  const summary = summarizeEvents(sampleEvents);

  return (
    <main>
      <h1>Next.js showcase</h1>
      <p>Server-rendered summary of {summary.total} events ({summary.totalBytes} bytes).</p>
      <ul>
        {Object.entries(summary.byType).map(([type, count]) => (
          <li key={type}>
            {type}: {count}
          </li>
        ))}
      </ul>
      <p>
        Health endpoint: <a href="/api/health">/api/health</a>
      </p>
    </main>
  );
}
