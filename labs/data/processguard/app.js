const $ = (id) => document.getElementById(id);

function number(id) {
  return Number($(id).value);
}

function checkProcess() {
  const target = number('t');
  const previous = number('p');
  const current = number('c');
  const sample = number('n');

  const gap = target - current;
  const change = current - previous;
  let status = 'STABLE';
  let level = 'ok';

  if (current < target && change < 0) {
    status = 'DRIFT DETECTED';
    level = 'alert';
  } else if (current < target) {
    status = 'GAP REQUIRES REVIEW';
    level = 'watch';
  }

  const out = $("out");
  out.innerHTML = '';

  const heading = document.createElement('h2');
  heading.textContent = status;
  out.appendChild(heading);

  const panel = document.createElement('div');
  panel.className = level;
  panel.innerHTML = `<b>Current ${current.toFixed(1)}%</b><br>Target ${target.toFixed(1)}%<br>Gap ${gap.toFixed(1)} points<br>Change ${change.toFixed(1)} points<br>Sample n=${sample}`;
  out.appendChild(panel);

  const note = document.createElement('p');
  note.textContent = 'Review measurement quality, context and possible causes before action.';
  out.appendChild(note);
}

$('go').addEventListener('click', checkProcess);
checkProcess();
