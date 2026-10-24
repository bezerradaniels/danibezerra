// Gera o blog (/conteudos/) a partir dos arquivos Markdown de content/conteudos/.
// Roda no começo do `npm run build`, antes do Tailwind, para as classes das
// páginas novas entrarem no CSS. Como escrever um post: docs/conteudos.md.
//
// Saídas:
//   conteudos/index.html          listagem com busca
//   conteudos/<slug>/index.html   uma página por post
//   conteudos/feed.xml            RSS
//   sitemap.xml e llms.txt        bloco dos posts atualizado
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Marked } from 'marked';
import { parse as parseYaml } from 'yaml';

const ORIGEM = 'content/conteudos';
const DESTINO = 'conteudos';
const SITE = 'https://danibezerra.com';
const WA = '5577992116008';
const PALAVRAS_POR_MINUTO = 200;

// Categoria do post -> serviço relacionado (link no fim do post).
const CATEGORIAS = {
  sites: { nome: 'Sites', servico: 'Criação de Sites', url: '/criacao-de-sites/' },
  blog: { nome: 'Blog e conteúdo', servico: 'Criação de Blog', url: '/criacao-de-blog/' },
  catalogo: { nome: 'Catálogo online', servico: 'Catálogo de Produtos', url: '/criacao-de-catalogo-de-produtos/' },
  trafego: { nome: 'Tráfego pago', servico: 'Tráfego Pago', url: '/trafego-pago/' },
  'google-ads': { nome: 'Google Ads', servico: 'Google Ads', url: '/google-ads/' },
  'meta-ads': { nome: 'Meta Ads', servico: 'Meta Ads', url: '/meta-ads/' },
  instagram: { nome: 'Instagram', servico: 'Anúncios no Instagram', url: '/anuncios-no-instagram/' },
  seo: { nome: 'SEO e IA', servico: 'SEO', url: '/seo/' },
  analytics: { nome: 'Dados e GA4', servico: 'Configuração do Google Analytics', url: '/configuracao-google-analytics/' },
  local: { nome: 'Bom Jesus da Lapa', servico: 'Sites em Bom Jesus da Lapa', url: '/criacao-de-sites-em-bom-jesus-da-lapa/' },
};

const AUTOR = {
  '@type': 'Person',
  name: 'Daniel Bezerra',
  jobTitle: 'Consultor em presença digital, mídia paga e dados',
  url: SITE,
  sameAs: 'https://www.instagram.com/bezerradaniels',
};

// ---------------------------------------------------------------------------
// Utilitários

const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const dataExtenso = (iso) => {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
};
const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

function erro(arquivo, msg) {
  throw new Error(`[conteudos] ${arquivo}: ${msg}`);
}

// ---------------------------------------------------------------------------
// Leitura dos posts

function lerPost(arquivo) {
  const bruto = readFileSync(join(ORIGEM, arquivo), 'utf8');
  const m = bruto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) erro(arquivo, 'cabeçalho entre --- não encontrado no topo do arquivo.');
  let meta;
  try {
    meta = parseYaml(m[1]) || {};
  } catch (e) {
    erro(arquivo, `cabeçalho com erro de formatação. ${e.message.split('\n')[0]} Dica: se um texto tiver ": " ou começar com aspas, coloque o texto inteiro entre aspas.`);
  }
  const corpo = m[2];

  // As datas podem vir como texto ou como Date, dependendo de aspas no YAML.
  for (const k of ['publicado', 'atualizado']) {
    if (meta[k] instanceof Date) meta[k] = meta[k].toISOString().slice(0, 10);
  }

  for (const k of ['titulo', 'descricao', 'publicado', 'categoria', 'resposta']) {
    if (!meta[k]) erro(arquivo, `campo obrigatório "${k}" vazio.`);
  }
  if (!DATA_ISO.test(meta.publicado)) erro(arquivo, 'publicado deve estar no formato AAAA-MM-DD.');
  if (meta.atualizado && !DATA_ISO.test(meta.atualizado)) erro(arquivo, 'atualizado deve estar no formato AAAA-MM-DD.');
  if (!CATEGORIAS[meta.categoria]) erro(arquivo, `categoria "${meta.categoria}" não existe. Use: ${Object.keys(CATEGORIAS).join(', ')}.`);
  if (meta.descricao.length > 160) console.warn(`[conteudos] aviso: descrição com ${meta.descricao.length} caracteres em ${arquivo} (ideal até 160).`);
  if (meta.faq && !Array.isArray(meta.faq)) erro(arquivo, 'faq deve ser uma lista de itens com pergunta e resposta.');
  for (const f of meta.faq || []) {
    if (!f.pergunta || !f.resposta) erro(arquivo, 'cada item do faq precisa de pergunta e resposta.');
  }

  const slug = meta.slug || arquivo.replace(/\.md$/, '');
  if (!/^[a-z0-9-]+$/.test(slug)) erro(arquivo, `slug "${slug}" deve ter só letras minúsculas, números e hífens.`);

  return {
    arquivo,
    slug,
    titulo: meta.titulo,
    tituloSeo: meta.titulo_seo || meta.titulo,
    descricao: meta.descricao,
    resposta: meta.resposta,
    publicado: meta.publicado,
    atualizado: meta.atualizado || meta.publicado,
    categoria: meta.categoria,
    faq: meta.faq || [],
    rascunho: meta.rascunho === true,
    corpo,
  };
}

// Markdown -> HTML. Títulos ganham id (para o sumário e links diretos) e
// links externos abrem em nova aba.
function renderizar(post) {
  const titulos = [];
  const usados = new Set();
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        let id = slugify(html) || 'secao';
        for (let n = 2; usados.has(id); n++) id = `${slugify(html)}-${n}`;
        usados.add(id);
        if (depth === 2) titulos.push({ id, texto: html.replace(/<[^>]+>/g, '') });
        const nivel = Math.min(Math.max(depth, 2), 4); // o h1 é o título do post
        return `<h${nivel} id="${id}">${html}</h${nivel}>\n`;
      },
      link({ href, title, tokens }) {
        const texto = this.parser.parseInline(tokens);
        const externo = /^https?:\/\//.test(href) && !href.startsWith(SITE);
        const t = title ? ` title="${esc(title)}"` : '';
        return externo
          ? `<a href="${esc(href)}"${t} target="_blank" rel="noopener">${texto}</a>`
          : `<a href="${esc(href)}"${t}>${texto}</a>`;
      },
      image({ href, title, text }) {
        const t = title ? ` title="${esc(title)}"` : '';
        return `<img src="${esc(href)}" alt="${esc(text)}"${t} loading="lazy" decoding="async">`;
      },
    },
  });
  const html = marked.parse(post.corpo);
  const palavras = post.corpo.replace(/[#>*_`\[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return { html, titulos, palavras, minutos: Math.max(1, Math.round(palavras / PALAVRAS_POR_MINUTO)) };
}

// ---------------------------------------------------------------------------
// Peças de layout (mesmo visual das demais páginas)

const SETA = (cls) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="${cls}" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const ICONE_WA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-5 shrink-0" aria-hidden="true"><path d="M3.5 20.5l1.3-3.9A8.5 8.5 0 1 1 8 19.6l-4.5.9Z" stroke-linejoin="round" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-.9-.4-1.4-.9-1.8-1.8l.8-1-1-2L9 9.5Z" stroke-linejoin="round" /></svg>`;
const LUPA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-grafite" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" stroke-linecap="round" /></svg>`;
// Sinal de + que vira − quando o <details> abre (a barra vertical gira e some).
const MAIS_MENOS = `<span class="relative flex size-8 flex-none items-center justify-center rounded-full bg-areia text-tinta transition-colors duration-300 group-open:bg-tinta group-open:text-offwhite" aria-hidden="true"><span class="absolute h-[1.5px] w-3 rounded-full bg-current"></span><span class="absolute h-3 w-[1.5px] rounded-full bg-current transition-transform duration-300 group-open:scale-y-0 group-open:rotate-90"></span></span>`;
const BOTAO_PRIMARIO = 'rounded-full bg-azul px-7 py-4 text-center font-semibold text-white transition hover:bg-azul-escuro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul motion-safe:active:scale-[0.98]';
// Cada categoria ganha uma das quatro cores da marca no ponto do rótulo.
const CORES_PONTO = ['bg-azul', 'bg-vermelho', 'bg-amarelo', 'bg-verde'];
const corDaCategoria = (categoria) => CORES_PONTO[Object.keys(CATEGORIAS).indexOf(categoria) % CORES_PONTO.length];

const GTM = `    <script>
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        (function () {
            var pedido = false;
            function carregarGTM() {
                if (pedido) return;
                pedido = true;
                var s = document.createElement('script');
                s.async = true;
                s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-K7C2SK6F';
                document.head.appendChild(s);
            }
            var opcoes = { once: true, passive: true };
            ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (evento) {
                window.addEventListener(evento, carregarGTM, opcoes);
            });
            function agendar() {
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(carregarGTM, { timeout: 2500 });
                } else {
                    setTimeout(carregarGTM, 300);
                }
            }
            if (document.readyState === 'complete') {
                agendar();
            } else {
                window.addEventListener('load', agendar, { once: true });
            }
        })();
    </script>`;

function documento({ title, description, url, tipoOg, ld, extraHead = '', header, main, scriptBusca = false }) {
  const ldJson = JSON.stringify(ld, null, 2).replaceAll('</', '<\\/').split('\n').join('\n    ');
  return `<!doctype html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Página gerada por scripts/conteudos.mjs a partir de content/conteudos/. Não edite à mão. -->
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${url}">
    <link rel="alternate" type="application/rss+xml" title="Conteúdos — Daniel Bezerra" href="${SITE}/conteudos/feed.xml">

    <meta property="og:type" content="${tipoOg}">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:site_name" content="Daniel Bezerra">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${SITE}/src/img/og/og-padrao.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Daniel Bezerra: sites, Google Ads e visibilidade em IA">
    <meta name="twitter:card" content="summary_large_image">
${extraHead}
    <link rel="icon" href="/src/img/marca/svg/favicon/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="/src/img/marca/png/favicon/favicon-32.png" sizes="32x32" type="image/png">
    <link rel="icon" href="/src/img/marca/png/favicon/icon-192.png" sizes="192x192" type="image/png">
    <link rel="apple-touch-icon" href="/src/img/marca/png/favicon/apple-touch-icon.png">
    <meta name="theme-color" content="#2E6BE6">

    <link rel="preconnect" href="https://www.googletagmanager.com">
    <link rel="preload" href="/src/fonts/inter-tight-latin.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/src/fonts/braveold-medium.woff2" as="font" type="font/woff2" crossorigin>

    <!-- CSS injetado inline pelo build (npm run build). Editar src/styles/input.css, nunca este bloco. -->
    <style id="css-inline"></style>

    <!-- Google Tag Manager (mesmo carregamento adiado da página inicial) -->
${GTM}

    <script type="text/javascript" async src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/fdd586fb-4507-4af3-8d6e-4f6b3b68d254-loader.js"></script>

    <script type="application/ld+json">
    ${ldJson}
    </script>
</head>

<body>
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K7C2SK6F"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

    <!--Header: fixo no topo, como na home. O menu vem de src/partials/menu.html.-->
    <header class="header-fixo sticky top-0 z-40 border-b border-nevoa bg-offwhite/92 backdrop-blur-md">
        <div class="relative mx-auto flex h-[60px] max-w-[1200px] items-center gap-3 px-5 sm:px-6 lg:h-[76px] lg:gap-6">
            <a href="/" aria-label="Daniel Bezerra, página inicial"
                class="mr-auto flex h-[30px] shrink-0 rounded-sm text-tinta transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azul lg:mr-0">
                <!--logo:inicio--><!--logo:fim-->
            </a>

            <!--menu:inicio--><!--menu:fim-->

            <a href="/#form-contato"
                data-cta="${header}"
                class="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-tinta px-5 text-[15px] font-medium whitespace-nowrap text-offwhite transition hover:bg-tinta-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul motion-safe:active:scale-[0.98] max-sm:hidden">
                Solicitar orçamento
            </a>
        </div>
    </header>

    <main>
${main}
    </main>

    <!--Footer: src/partials/rodape.html, injetado pelo build.-->
    <!--rodape:inicio--><!--rodape:fim-->
${scriptBusca ? `
    <!-- JS da busca injetado inline pelo build (npm run build). Editar src/js/busca.js, nunca este bloco. -->
    <script id="js-busca"></script>
` : ''}
    <!-- Entrada suave ao rolar, injetada inline pelo build (npm run build). Editar src/js/revelar.js, nunca este bloco. -->
    <script id="js-revelar"></script>
</body>

</html>
`;
}

// Fecho das páginas: cartão Noite com as formas de apoio do manual (ponto e arco).
function ctaFinal({ titulo, texto, wa, cta }) {
  return `        <!--CTA final: cartão Noite com as formas de apoio do manual (ponto e arco).-->
        <section class="px-6 py-28 max-sm:px-5 max-sm:py-16">
            <div data-revelar class="relative mx-auto flex max-w-[1200px] flex-col items-start gap-6 overflow-hidden rounded-[40px] bg-noite px-16 py-20 text-offwhite max-lg:px-10 max-lg:py-14 max-sm:rounded-[32px] max-sm:px-7 max-sm:py-12">
                <span class="flutuar absolute -top-12 -right-12 size-44 rounded-full bg-amarelo max-sm:-top-10 max-sm:-right-10 max-sm:size-28" aria-hidden="true"></span>
                <span class="absolute right-0 bottom-0 size-24 rounded-tl-full bg-verde max-lg:hidden" aria-hidden="true"></span>
                <h2 class="relative max-w-[680px] text-titulo text-balance max-sm:pr-12">${titulo}</h2>
                <p class="relative max-w-[520px] text-[18px] text-pretty text-pedra">${texto}</p>
                <a href="${wa}" target="_blank" rel="noopener noreferrer" data-cta="${cta}"
                    class="relative mt-2 inline-flex items-center justify-center gap-2.5 max-sm:w-full ${BOTAO_PRIMARIO} focus-visible:outline-offwhite">
                    ${ICONE_WA}
                    Falar comigo no WhatsApp
                </a>
            </div>
        </section>`;
}

function cartao(post, { busca = false } = {}) {
  const cat = CATEGORIAS[post.categoria];
  return `
                    <article ${busca ? 'data-busca-item ' : ''}data-revelar class="group relative flex h-full flex-col gap-3 rounded-[28px] bg-white p-9 inset-ring inset-ring-nevoa transition duration-300 hover:shadow-[0_16px_32px_rgb(30_34_40/0.08)] motion-safe:hover:-translate-y-1 max-sm:p-7">
                        <p class="flex items-center gap-2 text-[14px] text-grafite"><span class="size-2.5 flex-none rounded-full ${corDaCategoria(post.categoria)}" aria-hidden="true"></span>${esc(cat.nome)}</p>
                        <h3 class="text-[22px] leading-[1.25] font-semibold">
                            <a href="/conteudos/${post.slug}/" class="transition-colors group-hover:text-azul after:absolute after:inset-0 after:rounded-[28px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-azul">${esc(post.titulo)}</a>
                        </h3>
                        <p class="flex-1 text-[16px] text-pretty text-tinta-suave">${esc(post.descricao)}</p>
                        <p class="mt-2 text-[13px] tracking-[0.02em] text-grafite">
                            <time datetime="${post.atualizado}">${dataExtenso(post.atualizado)}</time> · ${post.minutos} min de leitura
                        </p>
                    </article>`;
}

// ---------------------------------------------------------------------------
// Página do post

function paginaPost(post, todos) {
  const url = `${SITE}/conteudos/${post.slug}/`;
  const cat = CATEGORIAS[post.categoria];
  const atualizou = post.atualizado !== post.publicado;
  const wa = `https://wa.me/${WA}?text=${encodeURIComponent(`Olá, Daniel! Li o conteúdo "${post.titulo}" e quero conversar.`)}`;

  const sumario = post.titulos.length >= 3 ? `
                <nav aria-labelledby="titulo-sumario" class="mt-10 rounded-[20px] bg-white p-7 inset-ring inset-ring-nevoa">
                    <p id="titulo-sumario" class="text-[13px] tracking-[0.02em] text-grafite">Neste conteúdo</p>
                    <ol class="mt-3 list-decimal space-y-1.5 pl-5 text-[16px] text-tinta-suave marker:text-azul">
${post.titulos.map((t) => `                        <li><a href="#${t.id}" class="transition hover:text-azul">${esc(t.texto)}</a></li>`).join('\n')}
                    </ol>
                </nav>` : '';

  const faq = post.faq.length ? `
                <section aria-labelledby="perguntas" class="mt-16">
                    <h2 id="perguntas" class="text-[clamp(26px,3vw,34px)] leading-[1.15] font-semibold tracking-[-0.01em]">Perguntas frequentes</h2>
                    <div class="mt-6 flex flex-col gap-2.5">
${post.faq.map((f) => `                        <details name="faq" class="group overflow-hidden rounded-[20px] bg-white inset-ring inset-ring-nevoa">
                            <summary class="flex cursor-pointer list-none items-center justify-between gap-5 px-7 py-[22px] text-[18px] font-semibold max-sm:gap-4 max-sm:px-5 max-sm:py-[18px] max-sm:text-[17px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-azul [&::-webkit-details-marker]:hidden">
                                <h3>${esc(f.pergunta)}</h3>
                                ${MAIS_MENOS}
                            </summary>
                            <p class="px-7 pb-6 text-[16px] text-pretty text-tinta-suave max-sm:px-5">${esc(f.resposta)}</p>
                        </details>`).join('\n')}
                    </div>
                </section>` : '';

  const relacionados = todos
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => (b.categoria === post.categoria) - (a.categoria === post.categoria) || b.atualizado.localeCompare(a.atualizado))
    .slice(0, 3);
  const blocoRelacionados = relacionados.length ? `
        <!--Outros conteúdos-->
        <section class="border-t border-nevoa bg-white">
            <div class="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-24 max-sm:px-5 max-sm:py-16">
                <h2 data-revelar class="text-[clamp(26px,3vw,34px)] leading-[1.15] font-semibold tracking-[-0.01em]">Continue lendo</h2>
                <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-6">${relacionados.map((p) => cartao(p)).join('')}
                </div>
            </div>
        </section>` : '';

  const graph = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#post`,
      headline: post.titulo,
      description: post.descricao,
      abstract: post.resposta,
      url,
      mainEntityOfPage: url,
      datePublished: post.publicado,
      dateModified: post.atualizado,
      inLanguage: 'pt-BR',
      articleSection: cat.nome,
      wordCount: post.palavras,
      author: AUTOR,
      publisher: { '@type': 'Organization', name: 'Daniel Bezerra', legalName: 'DSB Soluções em Publicidade Online Ltda', taxID: '59.747.553/0001-55', url: SITE, logo: `${SITE}/src/img/marca/png/favicon/icon-192.png` },
      isPartOf: { '@id': `${SITE}/conteudos/#blog` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Conteúdos', item: `${SITE}/conteudos/` },
        { '@type': 'ListItem', position: 3, name: post.titulo, item: url },
      ],
    },
  ];
  if (post.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: post.faq.map((f) => ({ '@type': 'Question', name: f.pergunta, acceptedAnswer: { '@type': 'Answer', text: f.resposta } })),
    });
  }

  const main = `        <article>
            <!--Cabeçalho do post. O h1 fica fora da animação de entrada: é o maior elemento da dobra (LCP).-->
            <header class="mx-auto flex max-w-[800px] flex-col gap-6 px-6 pt-14 pb-12 max-sm:px-5 max-sm:pt-8 max-sm:pb-10">
                <nav aria-label="Você está em" class="surgir">
                    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-grafite">
                        <li><a href="/" class="transition hover:text-azul">Início</a></li>
                        <li aria-hidden="true">/</li>
                        <li><a href="/conteudos/" class="transition hover:text-azul">Conteúdos</a></li>
                        <li aria-hidden="true">/</li>
                        <li class="flex items-center gap-2"><span class="size-2 flex-none rounded-full ${corDaCategoria(post.categoria)}" aria-hidden="true"></span><span aria-current="page" class="text-tinta">${esc(cat.nome)}</span></li>
                    </ol>
                </nav>
                <h1 class="text-chamada text-balance">${esc(post.titulo)}</h1>
                <p class="surgir flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-grafite [--ordem:1]">
                    <span>Por <strong class="font-semibold text-tinta">Daniel Bezerra</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>${atualizou ? 'Atualizado em' : 'Publicado em'} <time datetime="${post.atualizado}">${dataExtenso(post.atualizado)}</time></span>
                    <span aria-hidden="true">·</span>
                    <span>${post.minutos} min de leitura</span>
                </p>
            </header>

            <div class="border-t border-nevoa bg-offwhite">
                <div class="mx-auto max-w-[800px] px-6 py-16 max-sm:px-5 max-sm:py-12">
                    <!-- Resposta curta primeiro: é o trecho que buscadores e IAs mais citam. -->
                    <aside aria-label="Resposta curta" class="surgir flex flex-col gap-3 rounded-[28px] bg-areia p-9 [--ordem:2] max-sm:p-7">
                        <p class="flex items-center gap-2 text-[14px] text-grafite"><span class="size-2.5 flex-none rounded-full bg-azul" aria-hidden="true"></span>Resposta curta</p>
                        <p class="text-[20px] leading-[1.5] text-pretty text-tinta max-sm:text-[18px]">${esc(post.resposta)}</p>
                    </aside>
${sumario}

                    <div class="conteudo mt-10">
${post.html.trim().split('\n').map((l) => (l ? '                        ' + l : l)).join('\n')}
                    </div>
${faq}

                    <!--Autor-->
                    <footer class="mt-16 flex flex-col gap-5 rounded-[28px] bg-white p-7 inset-ring inset-ring-nevoa sm:flex-row sm:items-center">
                        <picture class="flex-none">
                            <source srcset="/src/img/images/daniel-bezerra.webp" type="image/webp">
                            <img src="/src/img/images/daniel-bezerra.jpg" alt="Daniel Bezerra" width="64" height="64" loading="lazy" decoding="async" class="size-16 rounded-full object-cover">
                        </picture>
                        <div class="flex-1">
                            <p class="font-braveold text-[18px] leading-[1.25] font-semibold">Daniel Bezerra</p>
                            <p class="mt-1 text-[15px] text-tinta-suave">16 anos em web, mídia paga e dados, com certificações oficiais do Google Ads. Atende de Bom Jesus da Lapa (BA) para todo o Brasil.</p>
                        </div>
                        <a href="${cat.url}" data-cta="conteudo_servico" class="group/servico inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full px-5 text-[15px] font-semibold text-tinta inset-ring-[1.5px] inset-ring-tinta transition hover:bg-tinta hover:text-offwhite focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul">
                            ${esc(cat.servico)}
                            ${SETA('size-4 transition-transform duration-300 group-hover/servico:translate-x-0.5')}
                        </a>
                    </footer>
                </div>
            </div>
        </article>

${ctaFinal({ titulo: 'Quer aplicar isso no seu negócio?', texto: 'Me conte o seu caso. Você recebe um retorno em até 24h úteis, direto comigo.', wa, cta: 'conteudo_final_whatsapp' })}
${blocoRelacionados}`;

  return documento({
    title: `${post.tituloSeo} | Daniel Bezerra`,
    description: post.descricao,
    url,
    tipoOg: 'article',
    extraHead: `    <meta property="article:published_time" content="${post.publicado}">
    <meta property="article:modified_time" content="${post.atualizado}">
    <meta property="article:section" content="${esc(cat.nome)}">
`,
    ld: { '@context': 'https://schema.org', '@graph': graph },
    header: 'conteudo_header',
    main,
  });
}

// ---------------------------------------------------------------------------
// Listagem

function paginaListagem(posts) {
  const url = `${SITE}/conteudos/`;
  const wa = `https://wa.me/${WA}?text=${encodeURIComponent('Olá, Daniel! Vim pelos conteúdos do site e tenho uma dúvida.')}`;
  const ultima = posts.reduce((m, p) => (p.atualizado > m ? p.atualizado : m), '0000-00-00');

  const lista = posts.length
    ? `<div data-busca-grupo class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-6">${posts.map((p) => cartao(p, { busca: true })).join('')}
                </div>`
    : '<p class="text-[18px] text-tinta-suave">Os primeiros conteúdos estão a caminho.</p>';

  const main = `        <!--Topo com busca. O h1 fica fora da animação de entrada: é o maior elemento da dobra (LCP).-->
        <section class="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 pt-14 pb-20 max-sm:px-5 max-sm:pt-8 max-sm:pb-14">
            <nav aria-label="Você está em" class="surgir">
                <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-grafite">
                    <li><a href="/" class="transition hover:text-azul">Início</a></li>
                    <li aria-hidden="true">/</li>
                    <li class="flex items-center gap-2"><span class="ponto-cores size-2 flex-none rounded-full bg-azul" aria-hidden="true"></span><span aria-current="page" class="text-tinta">Conteúdos</span></li>
                </ol>
            </nav>

            <h1 class="max-w-[900px] text-chamada text-balance">Conteúdos sobre sites, Google e IA</h1>

            <p class="surgir max-w-[640px] text-[19px] text-pretty text-tinta-suave [--ordem:1]">
                Guias práticos sobre SEO, visibilidade em IA, anúncios e dados, escritos para quem decide sobre o próprio negócio.
            </p>

            <!-- A busca só aparece com JS; sem ele, todos os conteúdos já estão listados. -->
            <form id="busca-form" role="search" class="surgir w-full max-w-[640px] [--ordem:2]" hidden>
                <label for="busca" class="sr-only">Buscar nos conteúdos</label>
                <div class="relative">
                    ${LUPA}
                    <input id="busca" type="search" autocomplete="off" enterkeyhint="search"
                        placeholder="Busque por SEO, Google Ads, GA4…"
                        class="w-full rounded-full border-[1.5px] border-nevoa bg-white py-4 pr-6 pl-[52px] sm:pr-14 text-[16px] text-tinta placeholder:text-cinza transition focus:border-azul focus:outline-none">
                    <kbd class="pointer-events-none absolute top-1/2 right-5 hidden -translate-y-1/2 rounded-md border border-nevoa px-2 py-0.5 text-[12px] text-grafite sm:block" aria-hidden="true">/</kbd>
                </div>
                <p id="busca-contador" class="mt-3 min-h-5 text-[14px] text-azul" role="status" aria-live="polite"></p>
            </form>
        </section>

        <!--Lista-->
        <section class="border-t border-nevoa bg-areia">
            <div class="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-24 max-sm:px-5 max-sm:py-14">
                <!-- font-sans: título só para leitores de tela; sem isso o navegador baixaria a Braveold Regular por um texto que ninguém vê. -->
                <h2 class="sr-only font-sans">Todos os conteúdos</h2>
                ${lista}

                <div id="busca-vazio" class="flex flex-col items-start gap-3 rounded-[28px] bg-white p-9 inset-ring inset-ring-nevoa max-sm:p-7" hidden>
                    <p class="font-braveold text-[22px] leading-[1.25] font-semibold">Nenhum conteúdo encontrado.</p>
                    <p class="text-tinta-suave">Tente outra palavra, veja a <a href="/academy/" class="font-medium text-azul underline decoration-nevoa decoration-2 underline-offset-[3px] transition hover:text-azul-escuro hover:decoration-current">Academy</a> ou pergunte direto para mim.</p>
                    <a href="${wa}" target="_blank" rel="noopener noreferrer" data-cta="conteudos_busca_whatsapp"
                        class="mt-3 inline-flex items-center justify-center gap-2.5 max-sm:w-full ${BOTAO_PRIMARIO}">
                        ${ICONE_WA}
                        Perguntar no WhatsApp
                    </a>
                </div>
            </div>
        </section>`;

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${url}#blog`,
        name: 'Conteúdos — Daniel Bezerra',
        url,
        inLanguage: 'pt-BR',
        author: AUTOR,
        ...(posts.length ? { dateModified: ultima } : {}),
        blogPost: posts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.titulo,
          url: `${SITE}/conteudos/${p.slug}/`,
          datePublished: p.publicado,
          dateModified: p.atualizado,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Conteúdos', item: url },
        ],
      },
    ],
  };

  return documento({
    title: 'Conteúdos sobre Sites, SEO, IA e Anúncios | Daniel Bezerra',
    description: 'Guias práticos sobre criação de sites, SEO, visibilidade em IA, Google Ads, Meta Ads e GA4, escritos para quem decide sobre o próprio negócio.',
    url,
    tipoOg: 'website',
    ld,
    header: 'conteudos_header',
    main,
    scriptBusca: true,
  });
}

// ---------------------------------------------------------------------------
// RSS, sitemap e llms.txt

function feed(posts) {
  const itens = posts.map((p) => `    <item>
      <title>${esc(p.titulo)}</title>
      <link>${SITE}/conteudos/${p.slug}/</link>
      <guid isPermaLink="true">${SITE}/conteudos/${p.slug}/</guid>
      <description>${esc(p.descricao)}</description>
      <category>${esc(CATEGORIAS[p.categoria].nome)}</category>
      <pubDate>${new Date(`${p.publicado}T12:00:00-03:00`).toUTCString()}</pubDate>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Conteúdos — Daniel Bezerra</title>
    <link>${SITE}/conteudos/</link>
    <atom:link href="${SITE}/conteudos/feed.xml" rel="self" type="application/rss+xml" />
    <description>Guias práticos sobre sites, SEO, visibilidade em IA, anúncios e dados.</description>
    <language>pt-BR</language>
${itens}
  </channel>
</rss>
`;
}

// Troca o trecho entre os marcadores; sem marcadores, acrescenta no fim.
function trocarBloco(texto, inicio, fim, conteudo, antesDe) {
  const i = texto.indexOf(inicio);
  const f = i === -1 ? -1 : texto.indexOf(fim, i);
  const bloco = `${inicio}\n${conteudo}${fim}`;
  if (f !== -1) return texto.slice(0, i) + bloco + texto.slice(f + fim.length);
  if (antesDe && texto.includes(antesDe)) return texto.replace(antesDe, `${bloco}\n${antesDe}`);
  return texto.trimEnd() + '\n\n' + bloco + '\n';
}

function atualizarSitemap(posts) {
  const arquivo = 'sitemap.xml';
  const urls = [`  <url><loc>${SITE}/conteudos/</loc></url>`]
    .concat(posts.map((p) => `  <url><loc>${SITE}/conteudos/${p.slug}/</loc><lastmod>${p.atualizado}</lastmod></url>`))
    .join('\n') + '\n  ';
  const novo = trocarBloco(readFileSync(arquivo, 'utf8'), '<!-- conteudos:inicio -->', '<!-- conteudos:fim -->', urls, '</urlset>');
  writeFileSync(arquivo, novo);
}

function atualizarLlms(posts) {
  const arquivo = 'llms.txt';
  if (!existsSync(arquivo)) return;
  const linhas = [`- [Todos os conteúdos](${SITE}/conteudos/): guias sobre sites, SEO, IA, anúncios e dados.`]
    .concat(posts.map((p) => `- [${p.titulo}](${SITE}/conteudos/${p.slug}/): ${p.resposta}`))
    .join('\n') + '\n';
  const titulo = '## Blog';
  // Normaliza para LF: no Windows o git entrega o arquivo em CRLF, e o regex abaixo não acharia
  // o bloco existente (o bloco era duplicado a cada checkout novo).
  const texto = readFileSync(arquivo, 'utf8').replace(/\r\n/g, '\n');
  // O bloco do blog fica antes de "## Opcional", que por convenção vem por último.
  const semBlog = texto.replace(/## Blog\n[\s\S]*?(?=\n## |$)/g, '').replace(/\n{3,}/g, '\n\n');
  const bloco = `${titulo}\n\n${linhas}`;
  const novo = semBlog.includes('## Opcional')
    ? semBlog.replace('## Opcional', `${bloco}\n## Opcional`)
    : semBlog.trimEnd() + '\n\n' + bloco;
  writeFileSync(arquivo, novo);
}

// ---------------------------------------------------------------------------

const arquivos = existsSync(ORIGEM)
  ? readdirSync(ORIGEM).filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  : [];

const posts = arquivos.map(lerPost)
  .filter((p) => !p.rascunho)
  .map((p) => Object.assign(p, renderizar(p)))
  .sort((a, b) => b.publicado.localeCompare(a.publicado) || a.titulo.localeCompare(b.titulo));

const slugs = new Set();
for (const p of posts) {
  if (slugs.has(p.slug)) erro(p.arquivo, `slug "${p.slug}" repetido.`);
  slugs.add(p.slug);
}

// Remove páginas de posts que saíram (apagados ou virados rascunho).
mkdirSync(DESTINO, { recursive: true });
for (const d of readdirSync(DESTINO, { withFileTypes: true })) {
  if (d.isDirectory() && !slugs.has(d.name) && existsSync(join(DESTINO, d.name, 'index.html'))) {
    rmSync(join(DESTINO, d.name), { recursive: true });
    console.log(`[conteudos] removido: ${DESTINO}/${d.name}/`);
  }
}

for (const p of posts) {
  mkdirSync(join(DESTINO, p.slug), { recursive: true });
  writeFileSync(join(DESTINO, p.slug, 'index.html'), paginaPost(p, posts));
}
writeFileSync(join(DESTINO, 'index.html'), paginaListagem(posts));
writeFileSync(join(DESTINO, 'feed.xml'), feed(posts));
atualizarSitemap(posts);
atualizarLlms(posts);

const rascunhos = arquivos.length - posts.length;
console.log(`[conteudos] ${posts.length} post(s) publicados${rascunhos ? `, ${rascunhos} rascunho(s) ignorado(s)` : ''}.`);
