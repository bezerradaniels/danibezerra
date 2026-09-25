// Injeta o CSS compilado dentro do <style id="css-inline"> de cada página.
// Roda depois do Tailwind, como parte do `npm run build`.
// Motivo: o CSS inteiro tem ~6 KB comprimido. Inline, ele elimina a requisição
// que bloqueia a renderização e não existe risco de conteúdo sem estilo.
import { readFileSync, writeFileSync } from 'node:fs';

const CSS = 'src/styles/output.css';
const ABRE = '<style id="css-inline">';
const FECHA = '</style>';

// Os url() do output.css são relativos a src/styles/; inline, passam a ser
// relativos à página. `fontes` deve bater com o <link rel="preload"> dela.
const PAGINAS = [
  { html: 'index.html', fontes: './src/fonts/' },
  { html: 'obrigado/index.html', fontes: '/src/fonts/' },
];

const base = readFileSync(CSS, 'utf8').trim();
const kb = (n) => (n / 1024).toFixed(1) + ' KB';
let falhou = false;

for (const { html: arquivo, fontes } of PAGINAS) {
  const css = base.replaceAll('url(../fonts/', `url(${fontes}`);
  const html = readFileSync(arquivo, 'utf8');

  const inicio = html.indexOf(ABRE);
  const fim = inicio === -1 ? -1 : html.indexOf(FECHA, inicio + ABRE.length);
  if (fim === -1) {
    console.error(`[inline-css] ${ABRE}...${FECHA} nao encontrado em ${arquivo}. Nada foi alterado.`);
    falhou = true;
    continue;
  }

  if (html.slice(inicio + ABRE.length, fim) === css) {
    console.log(`[inline-css] ${arquivo}: CSS inline já estava atualizado.`);
    continue;
  }

  writeFileSync(arquivo, html.slice(0, inicio + ABRE.length) + css + html.slice(fim));
  console.log(`[inline-css] ${kb(css.length)} de CSS injetado em ${arquivo}.`);
}

if (falhou) process.exit(1);
