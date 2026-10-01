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
const ICONE_WA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5 shrink-0" aria-hidden="true"><path d="M3.5 20.5l1.3-3.9A8.5 8.5 0 1 1 8 19.6l-4.5.9Z" stroke-linejoin="round" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-.9-.4-1.4-.9-1.8-1.8l.8-1-1-2L9 9.5Z" stroke-linejoin="round" /></svg>`;
const LUPA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand" aria-hidden="true"><path d="M17 17l4 4M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
const CHEVRON = `<span class="faq-chevron flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-periwinkle text-brand"><svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg></span>`;

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
    <link rel="alternate" type="application/rss+xml" title="Conteúdos — Dani Bezerra" href="${SITE}/conteudos/feed.xml">

    <meta property="og:type" content="${tipoOg}">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:site_name" content="Dani Bezerra">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${url}">
${extraHead}
    <link rel="icon" href="/src/img/logos/favicon-32.png" sizes="32x32" type="image/png">
    <link rel="icon" href="/src/img/logos/favicon-192.png" sizes="192x192" type="image/png">
    <link rel="apple-touch-icon" href="/src/img/logos/apple-touch-icon.png">
    <meta name="theme-color" content="#675496">

    <link rel="preconnect" href="https://www.googletagmanager.com">
    <link rel="preload" href="/src/fonts/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/src/fonts/inter-tight-latin.woff2" as="font" type="font/woff2" crossorigin>

    <!-- CSS injetado inline pelo build (npm run build). Editar src/styles/input.css, nunca este bloco. -->
    <style id="css-inline"></style>

    <!-- Google Tag Manager (mesmo carregamento adiado da página inicial) -->
${GTM}

    <script type="application/ld+json">
    ${ldJson}
    </script>
</head>

<body>
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K7C2SK6F"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

    <!--Header-->
    <header class="border-b border-periwinkle bg-surface">
        <div class="relative mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:h-20 lg:gap-6 lg:px-8">
            <a href="/" aria-label="Dani — página inicial"
                class="mr-auto shrink-0 transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:mr-0">
                <img src="/src/img/images/danibezerra-logo.svg" alt="Dani" width="240" height="100"
                    class="h-9 w-auto lg:h-11">
            </a>

            <!--menu:inicio--><!--menu:fim-->

            <a href="/#form-contato"
                data-cta="${header}"
                class="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full max-[359px]:hidden bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-6 sm:py-3 sm:text-base">
                Solicitar diagnóstico
            </a>
        </div>
    </header>

    <main>
${main}
    </main>

    <!--Footer-->
    <footer class="bg-peach">
        <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center text-sm text-ink/75 sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
            <div class="space-y-2 sm:max-w-sm">
                <p>© 2026 Dani. Todos os direitos reservados.</p>
                <!--legal:inicio--><!--legal:fim-->
            </div>
            <ul class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <li><a href="/conteudos/" class="inline-flex min-h-11 items-center transition hover:text-brand">Conteúdos</a></li>
                <li><a href="/faq/" class="inline-flex min-h-11 items-center transition hover:text-brand">FAQ</a></li>
                <li><a href="/academy/" class="inline-flex min-h-11 items-center transition hover:text-brand">Academy</a></li>
                <li><a href="https://wa.me/${WA}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center transition hover:text-brand">(77) 99211-6008</a></li>
                <li><a href="https://www.instagram.com/bezerradaniels" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center transition hover:text-brand">@bezerradaniels</a></li>
                <li><a href="mailto:contato@danibezerra.com" class="inline-flex min-h-11 items-center transition hover:text-brand">contato@danibezerra.com</a></li>
            </ul>
        </div>
    </footer>
${scriptBusca ? `
    <!-- JS da busca injetado inline pelo build (npm run build). Editar src/js/busca.js, nunca este bloco. -->
    <script id="js-busca"></script>
` : ''}</body>

</html>
`;
}

function cartao(post, { busca = false } = {}) {
  const cat = CATEGORIAS[post.categoria];
  return `
                    <article ${busca ? 'data-busca-item ' : ''}class="group relative flex h-full flex-col rounded-3xl border border-periwinkle bg-white p-6 transition hover:-translate-y-0.5 hover:border-lavender hover:shadow-lg hover:shadow-brand/10">
                        <p class="text-xs font-semibold uppercase tracking-wider text-brand">${esc(cat.nome)}</p>
                        <h3 class="mt-2 text-lg font-bold leading-snug text-ink">
                            <a href="/conteudos/${post.slug}/" class="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none">${esc(post.titulo)}</a>
                        </h3>
                        <p class="mt-2 flex-1 text-base leading-relaxed text-ink/75">${esc(post.descricao)}</p>
                        <p class="mt-4 text-sm text-ink/60">
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
  const wa = `https://wa.me/${WA}?text=${encodeURIComponent(`Olá, Dani! Li o conteúdo "${post.titulo}" e quero conversar.`)}`;

  const sumario = post.titulos.length >= 3 ? `
                <nav aria-labelledby="titulo-sumario" class="mt-10 rounded-2xl border border-periwinkle bg-soft p-6">
                    <p id="titulo-sumario" class="text-sm font-semibold uppercase tracking-wider text-brand">Neste conteúdo</p>
                    <ol class="mt-3 list-decimal space-y-1.5 pl-5 text-base text-ink/80 marker:text-brand">
${post.titulos.map((t) => `                        <li><a href="#${t.id}" class="transition hover:text-brand">${esc(t.texto)}</a></li>`).join('\n')}
                    </ol>
                </nav>` : '';

  const faq = post.faq.length ? `
                <section aria-labelledby="perguntas" class="mt-14">
                    <h2 id="perguntas" class="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Perguntas frequentes</h2>
                    <div class="mt-6 space-y-4">
${post.faq.map((f) => `                        <details class="group rounded-2xl border border-periwinkle bg-white p-6">
                            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-ink">
                                <h3>${esc(f.pergunta)}</h3>
                                ${CHEVRON}
                            </summary>
                            <p class="mt-4 text-base leading-relaxed text-ink/75">${esc(f.resposta)}</p>
                        </details>`).join('\n')}
                    </div>
                </section>` : '';

  const relacionados = todos
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => (b.categoria === post.categoria) - (a.categoria === post.categoria) || b.atualizado.localeCompare(a.atualizado))
    .slice(0, 3);
  const blocoRelacionados = relacionados.length ? `
        <!--Outros conteúdos-->
        <section class="bg-soft py-16 sm:py-20">
            <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <h2 class="text-center text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">Continue lendo</h2>
                <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">${relacionados.map((p) => cartao(p)).join('')}
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
      publisher: { '@type': 'Organization', name: 'Dani Bezerra', legalName: 'DSB Soluções em Publicidade Online Ltda', taxID: '59.747.553/0001-55', url: SITE, logo: `${SITE}/src/img/logos/favicon-192.png` },
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
            <!--Cabeçalho do post-->
            <header class="bg-hero-bg">
                <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                    <nav aria-label="Você está em">
                        <ol class="flex flex-wrap items-center gap-2 text-sm text-ink/75">
                            <li><a href="/" class="transition hover:text-brand">Início</a></li>
                            <li aria-hidden="true">/</li>
                            <li><a href="/conteudos/" class="transition hover:text-brand">Conteúdos</a></li>
                            <li aria-hidden="true">/</li>
                            <li><span aria-current="page" class="font-semibold text-brand">${esc(cat.nome)}</span></li>
                        </ol>
                    </nav>
                    <h1 class="mt-6 text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">${esc(post.titulo)}</h1>
                    <p class="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/70">
                        <span>Por <strong class="font-semibold text-ink">Daniel Bezerra</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>${atualizou ? 'Atualizado em' : 'Publicado em'} <time datetime="${post.atualizado}">${dataExtenso(post.atualizado)}</time></span>
                        <span aria-hidden="true">·</span>
                        <span>${post.minutos} min de leitura</span>
                    </p>
                </div>
            </header>

            <div class="bg-surface py-12 sm:py-16">
                <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <!-- Resposta curta primeiro: é o trecho que buscadores e IAs mais citam. -->
                    <aside aria-label="Resposta curta" class="rounded-2xl border-l-4 border-brand bg-white p-6 shadow-sm">
                        <p class="text-sm font-semibold uppercase tracking-wider text-brand">Resposta curta</p>
                        <p class="mt-2 text-lg leading-relaxed text-ink">${esc(post.resposta)}</p>
                    </aside>
${sumario}

                    <div class="conteudo mt-10">
${post.html.trim().split('\n').map((l) => (l ? '                        ' + l : l)).join('\n')}
                    </div>
${faq}

                    <!--Autor-->
                    <footer class="mt-14 flex flex-col gap-4 rounded-3xl border border-periwinkle bg-white p-6 sm:flex-row sm:items-center">
                        <picture>
                            <source srcset="/src/img/images/daniel-bezerra.webp" type="image/webp">
                            <img src="/src/img/images/daniel-bezerra.jpg" alt="Daniel Bezerra" width="64" height="64" loading="lazy" decoding="async" class="h-16 w-16 rounded-full object-cover">
                        </picture>
                        <div class="flex-1">
                            <p class="font-display text-base font-bold text-ink">Daniel Bezerra</p>
                            <p class="mt-1 text-sm leading-relaxed text-ink/75">16 anos em web, mídia paga e dados, com certificações oficiais do Google Ads. Atende de Bom Jesus da Lapa (BA) para todo o Brasil.</p>
                        </div>
                        <a href="${cat.url}" data-cta="conteudo_servico" class="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-lavender px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-periwinkle">
                            ${esc(cat.servico)}
                            ${SETA('h-4 w-4')}
                        </a>
                    </footer>
                </div>
            </div>
        </article>

        <!--CTA final-->
        <section class="bg-brand py-16 sm:py-20">
            <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                <h2 class="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">Quer aplicar isso no seu negócio?</h2>
                <p class="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">Me conte o seu caso. Você recebe um retorno em até 24h úteis, direto comigo.</p>
                <a href="${wa}" target="_blank" rel="noopener noreferrer" data-cta="conteudo_final_whatsapp"
                    class="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-brand transition hover:bg-periwinkle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    ${ICONE_WA}
                    Falar comigo no WhatsApp
                </a>
            </div>
        </section>
${blocoRelacionados}`;

  return documento({
    title: `${post.tituloSeo} | Dani Bezerra`,
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
  const wa = `https://wa.me/${WA}?text=${encodeURIComponent('Olá, Dani! Vim pelos conteúdos do site e tenho uma dúvida.')}`;
  const ultima = posts.reduce((m, p) => (p.atualizado > m ? p.atualizado : m), '0000-00-00');

  const lista = posts.length
    ? `<div data-busca-grupo class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">${posts.map((p) => cartao(p, { busca: true })).join('')}
                </div>`
    : '<p class="text-center text-lg text-ink/75">Os primeiros conteúdos estão a caminho.</p>';

  const main = `        <!--Topo com busca-->
        <section class="bg-hero-bg">
            <div class="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
                <nav aria-label="Você está em">
                    <ol class="flex items-center justify-center gap-2 text-sm text-ink/75">
                        <li><a href="/" class="transition hover:text-brand">Início</a></li>
                        <li aria-hidden="true">/</li>
                        <li><span aria-current="page" class="font-semibold text-brand">Conteúdos</span></li>
                    </ol>
                </nav>
                <span class="mt-6 inline-block rounded-full bg-periwinkle px-3 py-1 text-sm font-semibold uppercase tracking-wider text-brand">Blog</span>
                <h1 class="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
                    Conteúdos sobre sites, Google e IA
                </h1>
                <p class="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink/75 sm:text-lg">
                    Guias práticos sobre SEO, visibilidade em IA, anúncios e dados, escritos para quem decide sobre o próprio negócio.
                </p>

                <!-- A busca só aparece com JS; sem ele, todos os conteúdos já estão listados. -->
                <form id="busca-form" role="search" class="mx-auto mt-8 max-w-xl" hidden>
                    <label for="busca" class="sr-only">Buscar nos conteúdos</label>
                    <div class="relative">
                        ${LUPA}
                        <input id="busca" type="search" autocomplete="off" enterkeyhint="search"
                            placeholder="Busque por SEO, Google Ads, GA4…"
                            class="block w-full rounded-full border border-periwinkle bg-white py-3.5 pl-12 pr-12 text-base text-ink shadow-sm placeholder:text-ink/40 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                        <kbd class="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-periwinkle px-2 py-0.5 text-xs text-ink/50 sm:block" aria-hidden="true">/</kbd>
                    </div>
                    <p id="busca-contador" class="mt-3 min-h-5 text-sm font-medium text-brand" role="status" aria-live="polite"></p>
                </form>
            </div>
        </section>

        <!--Lista-->
        <section class="bg-surface py-12 sm:py-16">
            <div class="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
                <h2 class="sr-only">Todos os conteúdos</h2>
                ${lista}

                <div id="busca-vazio" class="rounded-3xl border border-periwinkle bg-white p-8 text-center" hidden>
                    <p class="font-display text-lg font-bold text-ink">Nenhum conteúdo encontrado.</p>
                    <p class="mt-2 text-base text-ink/75">Tente outra palavra, veja a <a href="/academy/" class="font-semibold text-brand underline decoration-lavender underline-offset-2">Academy</a> ou pergunte direto para mim.</p>
                    <a href="${wa}" target="_blank" rel="noopener noreferrer" data-cta="conteudos_busca_whatsapp"
                        class="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
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
        name: 'Conteúdos — Dani Bezerra',
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
    title: 'Conteúdos sobre Sites, SEO, IA e Anúncios | Dani Bezerra',
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
    <title>Conteúdos — Dani Bezerra</title>
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
