import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * rebase-inbook — Astro integration that base-prefixes every root-relative *in-book*
 * href in the built HTML, so they resolve under the book's `base` in the combined-worker
 * deploy (claude-books #22).
 *
 * One comprehensive net (astro:build:done): catches hand-written markdown prose links,
 * consumer components (landing, ChapterSupplements, the /supplements index), AND the
 * scaffold's own pages (e.g. its /chapters index, which hardcodes bare /chapters/).
 * Zero author/component discipline: authors keep writing natural root-relative links.
 *
 * Decision rule (robust — not a hardcoded prefix list): a root-relative `href` is
 * rebased iff its target **exists in this book's dist** (e.g. `/search/` → `dist/search/`,
 * `/chapters/ch06-…/` → `dist/chapters/ch06-…/`). That:
 *   - catches *every* in-book route (chapters, supplements, search, references, print,
 *     convergence, tips, glossary, …) — present and future — with no list to maintain;
 *   - leaves cross-book `<BookLink>` absolutes (`/agentic-coding/`, `/architect/`,
 *     `/design/`) alone (they don't exist in *this* book's dist);
 *   - leaves the apex root (`/`), externals (`http(s):` — not root-relative), and
 *     already-based `/handbook/…` hrefs alone;
 *   - preserves any `?query`/`#anchor` tail.
 *
 * NOT covered (separate concern): Pagefind search result URLs + the `/pagefind/` bundle
 * path — Pagefind runs *after* astro build, derives URLs from file paths, and is
 * scaffold-wide across the combined deploy. Tracked separately.
 *
 * BRIDGE: the canonical fix is upstream (the scaffold should base-prefix its own links
 * and/or ship this for consumers) — drop this integration when the scaffold lands it.
 */
export default function rebaseInbook({ base = '/' } = {}) {
  const root = '/' + base.replace(/^\/+|\/+$/g, ''); // '/handbook/' -> '/handbook'
  // Capture: (href=") (rootRelativePath) (optional ?query/#anchor) (closing quote)
  const re = /(href=["'])(\/[^"'?#\s]*)([?#][^"']*)?(["'])/g;

  return {
    name: 'rebase-inbook',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (root === '/') return; // root deploy needs no rebasing
        const distDir = fileURLToPath(dir);
        const cache = new Map(); // bare path -> exists-in-dist?
        const inBook = (bare) => {
          if (bare === '') return false; // apex root "/"
          if (cache.has(bare)) return cache.get(bare);
          const t = join(distDir, bare);
          const ok = existsSync(t) || existsSync(`${t}.html`) || existsSync(join(t, 'index.html'));
          cache.set(bare, ok);
          return ok;
        };

        let files = 0;
        let rewrites = 0;
        const walk = async (d) => {
          for (const ent of await readdir(d, { withFileTypes: true })) {
            const p = join(d, ent.name);
            if (ent.isDirectory()) {
              await walk(p);
              continue;
            }
            if (!ent.name.endsWith('.html')) continue;
            const html = await readFile(p, 'utf8');
            let n = 0;
            const out = html.replace(re, (m, attr, path, tail = '', quote) => {
              if (path === root || path.startsWith(`${root}/`)) return m; // already based
              const bare = path.replace(/^\/+/, '').replace(/\/+$/, '');
              if (!inBook(bare)) return m; // cross-book / apex / non-route → leave alone
              n++;
              return `${attr}${root}${path}${tail}${quote}`;
            });
            if (n > 0) {
              await writeFile(p, out);
              files++;
              rewrites += n;
            }
          }
        };
        await walk(distDir);
        logger.info(`rebase-inbook (#22): prefixed ${rewrites} in-book href(s) across ${files} file(s) with ${root}`);
      },
    },
  };
}
