import { sampleEvents, summarizeEvents } from "../../../lib/events";

export type HealthResponse = {
  status: "ok";
  events: number;
};

export async function GET(): Promise<Response> {
  const body: HealthResponse = { status: "ok", events: summarizeEvents(sampleEvents).total };
  return Response.json(body);
}
