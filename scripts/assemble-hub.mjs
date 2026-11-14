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
 *
 * Security headers: each workspace build writes the scaffold's default rules (one `/*` block with a
 * Content-Security-Policy and four other headers) to its own _headers. Only the file at the site
 * root takes effect. The hub's copy lands there and covers every book, so the books' copies are
 * removed, after a check that each says exactly what the hub's says.
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

// Security headers: keep the hub's _headers at the root and drop each book's copy. A copy below the
// root has no effect and would be served as an ordinary file. A book whose rules differ from the
// hub's stops the build, so that no rule is dropped unseen.
const HEADERS = join(OUT, '_headers');
const siteRules = existsSync(HEADERS) ? readFileSync(HEADERS, 'utf8') : null;
for (const b of BOOKS) {
  const own = join(OUT, b.slug, '_headers');
  if (!existsSync(own)) continue;
  if (siteRules === null) {
    throw new Error(`${b.dir}/dist has a _headers file but hub/dist has none. Only the root file takes effect, so the hub build must emit the rules too.`);
  }
  if (readFileSync(own, 'utf8') !== siteRules) {
    throw new Error(`${b.dir}/dist/_headers differs from hub/dist/_headers. Only the root file takes effect: merge the book's rules into it by hand (as '/${b.slug}/*' rules) before deploying.`);
  }
  rmSync(own);
}
if (siteRules !== null) console.log('  kept hub/dist/_headers at the root; removed the identical copy in each book');

// Search: noindex on every book, written last (after the hub copy). Rules are appended to the
// _headers the hub build produced, so none is lost. `/<slug>/*` matches the book's index too.
const existing = siteRules !== null ? siteRules.trimEnd() + '\n\n' : '';
const noindex = BOOKS.map((b) => `/${b.slug}/*\n  X-Robots-Tag: noindex\n`).join('\n');
writeFileSync(HEADERS, `${existing}# Books are drafts under correction: keep them out of search results.\n${noindex}`);
console.log(`  wrote dist/_headers (noindex: ${BOOKS.map((b) => `/${b.slug}/`).join(' ')})`);

// robots.txt allows every path: a Disallow would stop crawlers from reading the noindex header.
writeFileSync(join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n');
console.log('  wrote dist/robots.txt (allow all)');
