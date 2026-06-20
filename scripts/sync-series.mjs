#!/usr/bin/env node
/**
 * sync-series.mjs — copy the canonical shared "How the series fits together"
 * page into a consuming book, so every book serves an identical /series route.
 *
 * The shared orientation page lives once at /series/series.astro (the single
 * source of truth, committed). This script copies it into <book>/src/pages/
 * series.astro. The per-book copy is a gitignored build artifact. Wired into
 * each consumer's predev + prebuild, so dev AND build both sync first.
 *
 * Mirrors scripts/sync-glossary.mjs.
 *
 * Usage:  node scripts/sync-series.mjs <book-dir>
 *   e.g.  node scripts/sync-series.mjs handbook
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const SOURCE = path.join(REPO_ROOT, 'series', 'series.astro');

const book = process.argv[2];
if (!book) {
  console.error('sync-series: missing <book-dir> argument (e.g. handbook)');
  process.exit(1);
}
if (!fs.existsSync(SOURCE)) {
  console.error(`sync-series: canonical source missing at ${SOURCE}`);
  process.exit(1);
}

const dest = path.join(REPO_ROOT, book, 'src', 'pages', 'series.astro');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(SOURCE, dest);
console.log(`sync-series: copied series page → ${book}/src/pages/series.astro`);
