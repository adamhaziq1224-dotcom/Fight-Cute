const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, file) => '<style>\n' + fs.readFileSync(path.join(root, file), 'utf8') + '\n</style>');
html = html.replace(/<script defer src="([^"]+)">\s*<\/script>/g, (_, file) => '<script>\n' + fs.readFileSync(path.join(root, file), 'utf8') + '\n</script>');
html = html.replace(/src="(assets\/[^"]+)"/g, (_, file) => {
  const ext = path.extname(file).slice(1);
  const mime = ext === 'wav' ? 'audio/wav' : 'image/' + (ext === 'jpg' ? 'jpeg' : ext);
  return 'src="data:' + mime + ';base64,' + fs.readFileSync(path.join(root, file)).toString('base64') + '"';
});
fs.mkdirSync(path.join(root, 'dist'), {recursive:true});
fs.writeFileSync(path.join(root, 'dist', 'index.html'), html);
console.log('Exported dist/index.html — standalone offline game.');
