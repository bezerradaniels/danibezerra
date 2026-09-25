// Modo desenvolvimento: roda o Tailwind em watch e re-injeta o CSS inline
// nas páginas a cada recompilação, para o dev ver as páginas estilizadas.
import { spawn } from 'node:child_process';
import { watch, existsSync } from 'node:fs';

const CSS = 'src/styles/output.css';

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

function observar() {
  if (!existsSync(CSS)) {
    setTimeout(observar, 300);
    return;
  }
  injetar();
  watch(CSS, injetar);
  console.log('[dev] observando ' + CSS + ' para injetar o CSS inline.');
}

observar();

function encerrar() {
  tailwind.kill();
  process.exit(0);
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);
tailwind.on('exit', (code) => process.exit(code ?? 0));
