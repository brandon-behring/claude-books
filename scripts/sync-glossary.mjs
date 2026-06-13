#!/usr/bin/env node
/**
 * sync-glossary.mjs — copy the canonical glossary term files into a consuming book.
 *
 * The shared term layer lives once at glossary/terms/**.{md,mdx} (the single source of
 * truth, committed). Each consuming book renders the scaffold's /glossary + /flashcards
 * routes, which hard-probe import.meta.glob('/src/content/glossary/**') — so real files
 * must exist under that book's src/content/glossary/ at build time. This script does an
 * idempotent clean-and-copy of the canonical terms into <book>/src/content/glossary/.
 *
 * The per-book copy is a gitignored build artifact (the .gitignore rule ignores each
 * book's src/content/glossary). Wired into each consumer's predev + prebuild, so dev
 * AND build both sync first.
 *
 * Usage:  node scripts/sync-glossary.mjs <book-dir>
 *   e.g.  node scripts/sync-glossary.mjs architect-reference
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const SOURCE_DIR = path.join(REPO_ROOT, 'glossary', 'terms');

const book = process.argv[2];
if (!book) {
  console.error('sync-glossary: missing <book-dir> argument (e.g. architect-reference)');
  process.exit(1);
}

const destDir = path.join(REPO_ROOT, book, 'src', 'content', 'glossary');

/** Collect canonical term files (.md/.mdx), recursively. */
function termFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...termFiles(full));
    else if (/\.mdx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const files = termFiles(SOURCE_DIR);

// Clean-and-copy: wipe the generated dir first so deleted source terms don't linger.
fs.rmSync(destDir, { recursive: true, force: true });

if (files.length === 0) {
  console.log(
    `sync-glossary: no canonical terms under glossary/terms/ — ${book} glossary left empty ` +
      '(routes render the scaffold empty-state).',
  );
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
for (const src of files) {
  const rel = path.relative(SOURCE_DIR, src);
  const dst = path.join(destDir, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}
console.log(`sync-glossary: copied ${files.length} term file(s) → ${book}/src/content/glossary/`);
