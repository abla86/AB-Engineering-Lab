import { buildChangeStory } from "./engine/story";
import { demoDependencies, demoEvents } from "./engine/demo";

const story = buildChangeStory(demoEvents, demoDependencies);
const target = document.querySelector("#story");

if (target) {
  target.innerHTML = `
    <article>
      <h2>${story.title}</h2>
      <p><strong>Outcome:</strong> ${story.outcome.replaceAll("_", " ")}</p>
      <p><strong>Confidence:</strong> ${story.confidence}% — evidence-weighted, not causal proof.</p>
      <h3>Timeline</h3>
      <ol>${story.events.map(event => `
        <li>
          <strong>${event.summary}</strong><br />
          <small>${event.timestamp} · ${event.source}</small>
        </li>`).join("")}</ol>
      <h3>Evidence</h3>
      <ul>${story.evidence.map(e => `
        <li><strong>${e.level}</strong>: ${e.statement}<br /><small>${e.reason}</small></li>`).join("")}</ul>
    </article>
  `;
}
