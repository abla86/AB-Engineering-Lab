let requests=0,errors=0,eventsCreated=0;
export function recordRequest(){requests++}
export function recordError(){errors++}
export function recordEvent(){eventsCreated++}
export function prometheus():string{
 return [
 "# HELP eventforge_requests_total Total API requests.",
 "# TYPE eventforge_requests_total counter",
 `eventforge_requests_total ${requests}`,
 "# HELP eventforge_errors_total Total API errors.",
 "# TYPE eventforge_errors_total counter",
 `eventforge_errors_total ${errors}`,
 "# HELP eventforge_events_created_total Total events created.",
 "# TYPE eventforge_events_created_total counter",
 `eventforge_events_created_total ${eventsCreated}`,
 ].join("\n")+"\n";
}