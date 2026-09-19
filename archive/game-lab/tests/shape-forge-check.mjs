import fs from 'node:fs';
const required = [
  'index.html','css/lab-theme.css','js/lab-runtime.js',
  'js/engines/shape-forge.js','assets/shape-forge.svg'
];
for (const file of required) if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
const engine=fs.readFileSync('js/engines/shape-forge.js','utf8');
if (!engine.includes('init()') || !engine.includes('destroy()') || !engine.includes('ShapeForgeEngine')) throw new Error('Shape Forge engine contract incomplete');
const html=fs.readFileSync('index.html','utf8');
if (!html.includes('js/engines/shape-forge.js') || !html.includes("registerEngine('shapes'")) throw new Error('Shape Forge is not registered');
console.log('Shape Forge structure OK');