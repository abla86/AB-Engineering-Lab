import fs from 'node:fs';

const engines = [
  'cyber-chess','connect4','sql-dungeon','network-defender','packet-rush',
  'api-outbreak','devops-pipeline','memory-matrix','regex-vault','evidence-quest','shape-forge','shape-mosaic','mini-crossword'
];

const required = ['index.html','css/lab-theme.css','js/lab-runtime.js'];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
}
for (const engine of engines) {
  const file = `js/engines/${engine}.js`;
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
  const source = fs.readFileSync(file,'utf8');
  if (!source.includes('init(')) throw new Error(`${file}: missing init()`);
}

const html = fs.readFileSync('index.html','utf8');
for (const engine of engines) {
  if (!html.includes(`js/engines/${engine}.js`)) throw new Error(`index.html does not load ${engine}`);
}

const runtime = fs.readFileSync('js/lab-runtime.js','utf8');
if (!runtime.includes('registerEngine') || !runtime.includes('mountEngine')) throw new Error('LabRuntime contract incomplete');

console.log('Game Lab structure OK: runtime + 13 engines + registrations');
