// Modo desenvolvimento: roda o Tailwind em watch e re-injeta o CSS inline
// (e os JS compartilhados) nas páginas a cada recompilação, para o dev ver as páginas estilizadas.
// Também regera o blog quando um post de content/conteudos/ é criado ou alterado.
import { spawn } from 'node:child_process';
import { watch, existsSync } from 'node:fs';

const CSS = 'src/styles/output.css';
const JS = ['src/js/form-contato.js', 'src/js/busca.js', 'src/js/menu.js', 'src/partials/menu.html', 'src/partials/legal.html'];
const POSTS = 'content/conteudos';

const tailwind = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['tailwindcss', '-i', './src/styles/input.css', '-o', './src/styles/output.css', '--watch'],
  { stdio: 'inherit' }
);

let pendente = null;

function injetar() {
  clearTimeout(pendente);
  // Pequeno debounce: o Tailwind escreve o arquivo em mais de um passo.
  pendente = setTimeout(() => {
    const node = spawn(process.execPath, ['scripts/inline-css.mjs'], { stdio: 'inherit' });
    node.on('error', (e) => console.error('[dev] falha ao injetar CSS:', e.message));
  }, 120);
}

let pendenteBlog = null;

// Regera o blog e injeta o CSS/JS nas páginas novas (o Tailwind só recompila
// quando aparecem classes novas, então a injeção não pode depender dele).
function gerarBlog() {
  clearTimeout(pendenteBlog);
  pendenteBlog = setTimeout(() => {
    const node = spawn(process.execPath, ['scripts/conteudos.mjs'], { stdio: 'inherit' });
    node.on('exit', (code) => { if (code === 0) injetar(); });
    node.on('error', (e) => console.error('[dev] falha ao gerar o blog:', e.message));
  }, 150);
}

function observar() {
  if (!existsSync(CSS)) {
    setTimeout(observar, 300);
    return;
  }
  injetar();
  watch(CSS, injetar);
  JS.forEach((arquivo) => watch(arquivo, injetar));
  if (existsSync(POSTS)) watch(POSTS, gerarBlog);
  console.log('[dev] observando ' + CSS + ' e ' + JS.join(', ') + ' para injetar o CSS e o JS inline.');
}

gerarBlog();
observar();

function encerrar() {
  tailwind.kill();
  process.exit(0);
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);
tailwind.on('exit', (code) => process.exit(code ?? 0));
