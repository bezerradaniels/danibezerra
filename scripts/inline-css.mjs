// Injeta o CSS compilado dentro do <style id="css-inline"> de cada página, o menu
// principal (src/partials/menu.html + src/js/menu.js) entre <!--menu:inicio--> e
// <!--menu:fim-->, os dados legais (src/partials/legal.html) entre <!--legal:inicio-->
// e <!--legal:fim-->, e os JS compartilhados (src/js/) nos blocos <script id="js-...">.
// Roda depois do Tailwind, como parte do `npm run build`.
// Motivo: o CSS inteiro tem ~6 KB comprimido. Inline, ele elimina a requisição
// que bloqueia a renderização e não existe risco de conteúdo sem estilo. O JS do
// formulário e o da busca seguem a mesma lógica: um arquivo só, compartilhado pelas páginas.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

const CSS = 'src/styles/output.css';
// Bloco <script id> na página -> arquivo de origem.
const SCRIPTS = {
  'js-form-contato': 'src/js/form-contato.js',
  'js-busca': 'src/js/busca.js',
};

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
  // Páginas locais
  { html: 'criacao-de-sites-em-bom-jesus-da-lapa/index.html', fontes: '/src/fonts/' },
  // Conteúdo
  { html: 'faq/index.html', fontes: '/src/fonts/' },
  { html: 'academy/index.html', fontes: '/src/fonts/' },
];

// Blog: a listagem e cada post gerado por scripts/conteudos.mjs entram sozinhos.
if (existsSync('conteudos/index.html')) {
  PAGINAS.push({ html: 'conteudos/index.html', fontes: '/src/fonts/' });
  for (const d of readdirSync('conteudos', { withFileTypes: true })) {
    if (d.isDirectory() && existsSync(`conteudos/${d.name}/index.html`)) {
      PAGINAS.push({ html: `conteudos/${d.name}/index.html`, fontes: '/src/fonts/' });
    }
  }
}

const base = readFileSync(CSS, 'utf8').trim();
// Mantém a indentação do bloco <script> na página.
const js = Object.fromEntries(Object.entries(SCRIPTS).map(([id, arquivo]) => [
  id,
  '\n' + readFileSync(arquivo, 'utf8').trim().split('\n')
    .map((linha) => (linha ? '        ' + linha : linha)).join('\n') + '\n    ',
]));
// Menu principal: marcação de src/partials/menu.html + comportamento de src/js/menu.js,
// entre <!--menu:inicio--> e <!--menu:fim--> no header de cada página.
const recuar = (texto, espacos) => texto.trim().split('\n')
  .map((linha) => (linha ? ' '.repeat(espacos) + linha : linha)).join('\n');
const menu = '\n' + recuar(readFileSync('src/partials/menu.html', 'utf8'), 12) + '\n'
  + '            <script>\n' + recuar(readFileSync('src/js/menu.js', 'utf8'), 16) + '\n            </script>\n            ';
// Razão social, CNPJ e sede, no rodapé de todas as páginas.
const legal = '\n' + recuar(readFileSync('src/partials/legal.html', 'utf8'), 16) + '\n                ';
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

  html = injetar(html, '<!--menu:inicio-->', '<!--menu:fim-->', menu) ?? html;
  html = injetar(html, '<!--legal:inicio-->', '<!--legal:fim-->', legal) ?? html;

  // Cada script é opcional: só entra nas páginas que têm o bloco.
  for (const [id, conteudo] of Object.entries(js)) {
    html = injetar(html, `<script id="${id}">`, '</script>', conteudo) ?? html;
  }

  if (html === original) {
    console.log(`[inline-css] ${arquivo}: CSS e JS inline já estavam atualizados.`);
    continue;
  }

  writeFileSync(arquivo, html);
  console.log(`[inline-css] ${kb(css.length)} de CSS injetado em ${arquivo}.`);
}

if (falhou) process.exit(1);
