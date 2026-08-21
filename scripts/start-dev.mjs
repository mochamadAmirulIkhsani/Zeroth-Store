import { spawn } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const nodemonCli = fileURLToPath(new URL('../node_modules/nodemon/bin/nodemon.js', import.meta.url));
const children = [];
let isShuttingDown = false;

const stopAll = (exitCode = 0) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }

  setTimeout(() => {
    for (const child of children) {
      if (!child.killed) child.kill('SIGKILL');
    }
  }, 3000).unref();

  process.exit(exitCode);
};

const runManaged = (name, args) => {
  const child = spawn(process.execPath, [nodemonCli, ...args], { stdio: 'inherit' });
  children.push(child);

  child.on('exit', (code, signal) => {
    if (isShuttingDown) return;
    if (code !== 0) {
      console.error(`${name} exited with code ${code ?? 'null'} signal ${signal ?? 'none'}`);
      stopAll(code ?? 1);
    }
  });

  child.on('error', (error) => {
    if (isShuttingDown) return;
    console.error(`${name} failed to start:`, error);
    stopAll(1);
  });
};

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

runManaged('api', [
  '--watch',
  'server.mjs',
  '--ext',
  'js,mjs,json',
  '--signal',
  'SIGTERM',
  '--exec',
  'node server.mjs',
]);

runManaged('web', [
  '--watch',
  'src',
  '--watch',
  'index.html',
  '--watch',
  'vite.config.ts',
  '--watch',
  'postcss.config.mjs',
  '--ext',
  'js,mjs,cjs,ts,tsx,jsx,css,html,json',
  '--signal',
  'SIGTERM',
  '--exec',
  'vite',
]);
