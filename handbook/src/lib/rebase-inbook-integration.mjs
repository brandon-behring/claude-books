import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * rebase-inbook — Astro integration that base-prefixes every root-relative *in-book*
 * href in the built HTML, so they resolve under the book's `base` in the combined-worker
 * deploy (claude-books #22).
 *
 * One comprehensive net (astro:build:done): catches hand-written markdown prose links,
 * consumer components (the landing, ChapterSupplements, the /supplements index), AND the
 * scaffold's own /chapters index page (`pages/chapters.astro` hardcodes bare `/chapters/`
 * — the case a markdown rehype plugin can't reach). Zero author/component discipline:
 * authors keep writing natural root-relative links.
 *
 * Scope: only the in-book route prefixes below. Cross-book `<BookLink>` absolutes
 * (`/agentic-coding/`, `/architect/`, `/design/`), external URLs, and bare `#anchors`
 * don't match. Idempotent — an already-based `/handbook/…` href doesn't start with the
 * bare prefix, so it's left alone.
 *
 * BRIDGE: the canonical fix is upstream (the scaffold should base-prefix its own links
 * and/or ship this for consumers) — drop this integration when the scaffold lands it.
 */
export default function rebaseInbook({ base = '/' } = {}) {
  const root = '/' + base.replace(/^\/+|\/+$/g, ''); // '/handbook/' -> '/handbook'
  // Matches href="/chapters/… or href='/supplements/… (either quote). Does NOT match an
  // already-based href="/handbook/chapters/… (the char after the quote is the book base,
  // not /chapters/), nor cross-book /agentic-coding/… etc.
  const re = /(href=["'])(\/(?:chapters|supplements)\/)/g;
  return {
    name: 'rebase-inbook',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (root === '/') return; // root deploy needs no rebasing
        const distDir = fileURLToPath(dir);
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
            const out = html.replace(re, (_m, attr, path) => {
              n++;
              return attr + root + path;
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
