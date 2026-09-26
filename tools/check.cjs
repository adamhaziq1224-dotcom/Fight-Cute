const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let count = 0;
for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (url.startsWith('#') || url.includes(':')) continue;
  const file = path.join(root, url);
  if (!fs.existsSync(file)) throw new Error('Missing asset: ' + url);
  if (url.endsWith('.js')) new vm.Script(fs.readFileSync(file, 'utf8'), {filename:url});
  count++;
}
console.log(`Checked ${count} file references and JavaScript syntax.`);
