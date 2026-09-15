const $ = (id) => document.getElementById(id);
let traces = [];

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function render() {
  $('empty').style.display = traces.length ? 'none' : 'block';
  $('list').innerHTML = traces.map((trace, index) => `
    <article class="trace status-${escapeHtml(trace.status)}">
      <strong>#${index + 1} · ${escapeHtml(trace.requirement)}</strong>
      <div class="meta"><span class="pill">${escapeHtml(trace.status)}</span></div>
      <div><b>Observation:</b> ${escapeHtml(trace.observation || '—')}</div>
      <div><b>Evidence:</b> ${escapeHtml(trace.evidence || '—')}</div>
      <div><b>Hypothesis:</b> ${escapeHtml(trace.hypothesis || '—')}</div>
      <div><b>Action:</b> ${escapeHtml(trace.action || '—')}</div>
    </article>`).join('');
}

function readTrace() {
  return {
    requirement: $('requirement').value.trim(),
    observation: $('observation').value.trim(),
    evidence: $('evidence').value.trim(),
    status: $('status').value,
    hypothesis: $('hypothesis').value.trim(),
    action: $('action').value.trim()
  };
}

$('add').onclick = () => {
  const trace = readTrace();
  if (!trace.requirement) return;
  traces.push(trace);
  render();
};

$('demo').onclick = () => {
  traces = [
    { requirement: 'Expected practice is followed', observation: 'Observed in audit sample', evidence: 'Audit record A-001', status: 'Verified', hypothesis: '', action: 'Repeat measurement next cycle' },
    { requirement: 'Training completed before independent practice', observation: '2 records lack training evidence', evidence: 'Training register', status: 'Gap', hypothesis: 'Onboarding workflow may not enforce the prerequisite', action: 'Review onboarding workflow and re-measure' }
  ];
  render();
};

render();
