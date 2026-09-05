import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

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

const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));

const runManaged = (name, args) => {
  const child = spawn(process.execPath, args, { stdio: 'inherit' });
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

if (!existsSync(viteBin)) {
  console.error('vite binary not found. Run `npm install` first.');
  process.exit(1);
}

// API: auto-restart on server.mjs change (Node built-in watch)
runManaged('api', ['--watch', 'server.mjs', 'server.mjs']);

// Web: Vite dev server (has its own HMR, no restart needed for src/ edits)
runManaged('web', [viteBin]);