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
 * Every book is served with `X-Robots-Tag: noindex` while its corrections are under way: the script
 * writes those rules into dist/_headers, which the Worker's static-asset server applies and does not
 * serve. robots.txt allows everything, because a crawler must fetch a page to read its noindex
 * header. The hub landing stays indexable.
 */
import { cpSync, rmSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOOKS = [
  { dir: 'architect-reference', slug: 'architect' },
  { dir: 'agentic-systems-design', slug: 'design' },
  { dir: 'agentic-coding', slug: 'agentic-coding' },
  { dir: 'handbook', slug: 'handbook' },
];

const ROOT = process.cwd();
const OUT = join(ROOT, 'dist');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const b of BOOKS) {
  const src = join(ROOT, b.dir, 'dist');
  if (!existsSync(src)) throw new Error(`Missing build output: ${b.dir}/dist — run the book build first (npm run build --workspaces).`);
  cpSync(src, join(OUT, b.slug), { recursive: true });
  console.log(`  assembled ${b.dir}/dist → dist/${b.slug}/`);
}

// Hub landing — a real scaffold page (hub/ workspace). Copy its build onto the
// apex root: index.html + /search/ + /pagefind/ + favicon.svg + _astro/… merge
// alongside the book subdirs above (no path collisions — books live under their
// own slugs). This replaces the old hand-written index.html + favicon copy. #27.
const hubDist = join(ROOT, 'hub', 'dist');
if (!existsSync(hubDist)) throw new Error('Missing build output: hub/dist — run the hub build first (npm run build --workspaces).');
cpSync(hubDist, OUT, { recursive: true });
console.log('  assembled hub/dist → dist/ (apex landing, on the shared scaffold spine)');

// Search: noindex on every book, written last (after the hub copy). Rules are appended to any
// _headers a build already produced, so none is lost. `/<slug>/*` matches the book's index too.
const HEADERS = join(OUT, '_headers');
const existing = existsSync(HEADERS) ? readFileSync(HEADERS, 'utf8').trimEnd() + '\n\n' : '';
const noindex = BOOKS.map((b) => `/${b.slug}/*\n  X-Robots-Tag: noindex\n`).join('\n');
writeFileSync(HEADERS, `${existing}# Books are drafts under correction: keep them out of search results.\n${noindex}`);
console.log(`  wrote dist/_headers (noindex: ${BOOKS.map((b) => `/${b.slug}/`).join(' ')})`);

// robots.txt allows every path: a Disallow would stop crawlers from reading the noindex header.
writeFileSync(join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n');
console.log('  wrote dist/robots.txt (allow all)');
