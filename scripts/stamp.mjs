// Carimba o link do CSS com um hash do conteúdo, para a CDN não servir versão antiga.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const css = readFileSync('src/styles/output.css');
const hash = createHash('sha1').update(css).digest('hex').slice(0, 8);

const page = 'index.html';
const html = readFileSync(page, 'utf8');
const stamped = html.replace(
    /(href="\.\/src\/styles\/output\.css)(\?v=[a-f0-9]+)?"/,
    `$1?v=${hash}"`
);

if (stamped !== html) {
    writeFileSync(page, stamped);
    console.log(`CSS carimbado: ?v=${hash}`);
} else {
    console.log(`CSS já estava em ?v=${hash}`);
}
