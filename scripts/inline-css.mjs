// Injeta o CSS compilado dentro do <style id="css-inline"> do index.html.
// Roda depois do Tailwind, como parte do `npm run build`.
// Motivo: o CSS inteiro tem ~6 KB comprimido. Inline, ele elimina a requisição
// que bloqueia a renderização e não existe risco de conteúdo sem estilo.
import { readFileSync, writeFileSync } from 'node:fs';

const HTML = 'index.html';
const CSS = 'src/styles/output.css';
const ABRE = '<style id="css-inline">';
const FECHA = '</style>';

// Os url() do output.css são relativos a src/styles/; inline, passam a ser
// relativos ao index.html. Mesmo caminho do <link rel="preload"> para reaproveitá-lo.
const css = readFileSync(CSS, 'utf8').trim().replaceAll('url(../fonts/', 'url(./src/fonts/');
const html = readFileSync(HTML, 'utf8');

const inicio = html.indexOf(ABRE);
if (inicio === -1) {
  console.error(`[inline-css] ${ABRE} nao encontrado em ${HTML}. Nada foi alterado.`);
  process.exit(1);
}

const fim = html.indexOf(FECHA, inicio + ABRE.length);
if (fim === -1) {
  console.error(`[inline-css] ${FECHA} de fechamento nao encontrado. Nada foi alterado.`);
  process.exit(1);
}

const atual = html.slice(inicio + ABRE.length, fim);
if (atual === css) {
  console.log('[inline-css] CSS inline já estava atualizado.');
  process.exit(0);
}

const saida = html.slice(0, inicio + ABRE.length) + css + html.slice(fim);
writeFileSync(HTML, saida);

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
console.log(`[inline-css] ${kb(css.length)} de CSS injetado em ${HTML}.`);
