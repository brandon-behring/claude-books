/**
 * assemble-hub.mjs — combined-dist assembler for claude-books.brandon-behring.dev.
 *
 * Each workspace builds to <ws>/dist (the four books with base '/<subroute>/',
 * the hub with base '/'). This copies each BOOK build into the apex
 * dist/<subroute>/, then copies the HUB build onto the apex dist/ root
 * (index.html, /search/, /pagefind/, favicon.svg, _astro/…). ONE Cloudflare
 * Worker ([assets] dir=./dist in wrangler.jsonc) serves the whole apex — no
 * per-book Workers, no service-binding proxy. Run by the root `build` script
 * after the workspace builds.
 *
 * The hub landing is now a REAL book-scaffold-astro page (hub/src/pages/
 * index.astro), folded onto the shared spine (#27) — it is no longer a
 * hand-written HTML string here. Display data (titles/lenses/blurbs) lives in
 * the hub page; this script only needs each book's build dir + apex slug.
 *
 * Handbook is content-incomplete (draft): served but noindex via robots.txt.
 */
import { cpSync, rmSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BOOKS = [
  { dir: 'architect-reference', slug: 'architect' },
  { dir: 'agentic-systems-design', slug: 'design' },
  { dir: 'agentic-coding', slug: 'agentic-coding' },
  { dir: 'handbook', slug: 'handbook', draft: true },
];

const ROOT = process.cwd();
const OUT = join(ROOT, 'dist');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const b of BOOKS) {
  const src = join(ROOT, b.dir, 'dist');
  if (!existsSync(src)) throw new Error(`Missing build output: ${b.dir}/dist — run the book build first (npm run build --workspaces).`);
  cpSync(src, join(OUT, b.slug), { recursive: true });
  console.log(`  assembled ${b.dir}/dist → dist/${b.slug}/${b.draft ? '  (draft, noindex)' : ''}`);
}

// Hub landing — a real scaffold page (hub/ workspace). Copy its build onto the
// apex root: index.html + /search/ + /pagefind/ + favicon.svg + _astro/… merge
// alongside the book subdirs above (no path collisions — books live under their
// own slugs). This replaces the old hand-written index.html + favicon copy. #27.
const hubDist = join(ROOT, 'hub', 'dist');
if (!existsSync(hubDist)) throw new Error('Missing build output: hub/dist — run the hub build first (npm run build --workspaces).');
cpSync(hubDist, OUT, { recursive: true });
console.log('  assembled hub/dist → dist/ (apex landing, on the shared scaffold spine)');

// robots.txt last (after the hub copy) so it always wins: handbook is draft.
writeFileSync(join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /handbook/\n');
console.log('  wrote dist/robots.txt (handbook noindex)');
