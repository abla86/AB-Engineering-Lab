import fs from 'node:fs';
const source=fs.readFileSync('js/engines/mini-crossword.js','utf8');
if(!source.includes("dir:'across'") || !source.includes("dir:'down'")) throw new Error('Crossword must contain across and down entries');
if(!source.includes('KRETS') || !source.includes('SIRKEL') || !source.includes('BEVIS')) throw new Error('Expected original Norwegian knowledge entries missing');
const swarm=fs.readFileSync('js/engines/shape-mosaic.js','utf8');
if(!swarm.includes("kind:'cat'") || !swarm.includes("kind:'tree'")) throw new Error('Shape Swarm must contain cat and tree targets');
console.log('Shape Swarm + Mini Crossword checks OK');