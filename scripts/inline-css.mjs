// Injeta o CSS compilado dentro do <style id="css-inline"> de cada página e,
// nas páginas com formulário, o JS de src/js/form-contato.js dentro do
// <script id="js-form-contato">. Roda depois do Tailwind, como parte do `npm run build`.
// Motivo: o CSS inteiro tem ~6 KB comprimido. Inline, ele elimina a requisição
// que bloqueia a renderização e não existe risco de conteúdo sem estilo. O JS do
// formulário segue a mesma lógica e fica num arquivo só, compartilhado pelas páginas.
import { readFileSync, writeFileSync } from 'node:fs';

const CSS = 'src/styles/output.css';
const JS_FORM = 'src/js/form-contato.js';

// Os url() do output.css são relativos a src/styles/; inline, passam a ser
// relativos à página. `fontes` deve bater com o <link rel="preload"> dela.
const PAGINAS = [
  { html: 'index.html', fontes: './src/fonts/' },
  { html: 'obrigado/index.html', fontes: '/src/fonts/' },
  // Páginas de serviço
  { html: 'criacao-de-sites/index.html', fontes: '/src/fonts/' },
  { html: 'criacao-de-blog/index.html', fontes: '/src/fonts/' },
  { html: 'criacao-de-catalogo-de-produtos/index.html', fontes: '/src/fonts/' },
  { html: 'trafego-pago/index.html', fontes: '/src/fonts/' },
  { html: 'google-ads/index.html', fontes: '/src/fonts/' },
  { html: 'meta-ads/index.html', fontes: '/src/fonts/' },
  { html: 'anuncios-no-instagram/index.html', fontes: '/src/fonts/' },
  { html: 'seo/index.html', fontes: '/src/fonts/' },
  { html: 'configuracao-google-analytics/index.html', fontes: '/src/fonts/' },
];

const base = readFileSync(CSS, 'utf8').trim();
// Mantém a indentação do bloco <script> na página.
const js = '\n' + readFileSync(JS_FORM, 'utf8').trim().split('\n')
  .map((linha) => (linha ? '        ' + linha : linha)).join('\n') + '\n    ';
const kb = (n) => (n / 1024).toFixed(1) + ' KB';
let falhou = false;

// Troca o conteúdo entre `abre` e o `fecha` seguinte. Devolve null se o bloco
// não existir na página.
function injetar(html, abre, fecha, conteudo) {
  const inicio = html.indexOf(abre);
  const fim = inicio === -1 ? -1 : html.indexOf(fecha, inicio + abre.length);
  if (fim === -1) return null;
  return html.slice(0, inicio + abre.length) + conteudo + html.slice(fim);
}

for (const { html: arquivo, fontes } of PAGINAS) {
  const css = base.replaceAll('url(../fonts/', `url(${fontes}`);
  const original = readFileSync(arquivo, 'utf8');

  let html = injetar(original, '<style id="css-inline">', '</style>', css);
  if (html === null) {
    console.error(`[inline-css] <style id="css-inline">...</style> nao encontrado em ${arquivo}. Nada foi alterado.`);
    falhou = true;
    continue;
  }

  // O formulário é opcional: só entra nas páginas que têm o bloco.
  html = injetar(html, '<script id="js-form-contato">', '</script>', js) ?? html;

  if (html === original) {
    console.log(`[inline-css] ${arquivo}: CSS e JS inline já estavam atualizados.`);
    continue;
  }

  writeFileSync(arquivo, html);
  console.log(`[inline-css] ${kb(css.length)} de CSS injetado em ${arquivo}.`);
}

if (falhou) process.exit(1);
