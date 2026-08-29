import { describe, expect, it } from "vitest";
import { buildChangeStory } from "./story";
import { demoDependencies, demoEvents } from "./demo";

describe("ChangeStory", () => {
  it("reconstructs an impacted change and recovery", () => {
    const story = buildChangeStory(demoEvents, demoDependencies);

    expect(story.outcome).toBe("RECOVERED");
    expect(story.events).toHaveLength(4);
    expect(story.dependencies).toHaveLength(2);
  });

  it("does not manufacture verified causal evidence", () => {
    const story = buildChangeStory(demoEvents, demoDependencies);

    expect(story.evidence.some(e => e.level === "VERIFIED")).toBe(false);
  });

  it("produces an evidence-weighted confidence value", () => {
    const story = buildChangeStory(demoEvents, demoDependencies);

    expect(story.confidence).toBeGreaterThan(60);
    expect(story.confidence).toBeLessThanOrEqual(98);
  });
});
