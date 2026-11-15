import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * review-label — Astro integration that edits this book's built HTML at astro:build:done, which is
 * before Pagefind indexes the pages.
 *
 * 1. It removes every freshness badge. The scaffold works out "Fresh", "Verify soon" or "Stale"
 *    when the site is built, and a static page then shows that word until the next build, however
 *    old the chapter has become. No verdict is shown; the date stays.
 * 2. It renames the date label: "Last verified" becomes "Last reviewed" in chapter headers and on
 *    the print page, and "verified" becomes "reviewed" in the chapter list. The date says when a
 *    chapter was last reviewed. It does not say that the chapter is still correct.
 *
 * The frontmatter key stays `last_verified`: the scaffold's schema requires it.
 *
 * The build fails when a badge or a "verified" label is left, or when fewer badges or labels were
 * changed than the book has chapters. Either means that the scaffold's markup changed and this
 * step must be updated.
 *
 * BRIDGE for a scaffold gap (docs/scaffold-gaps.md): drop it when the scaffold can hide the verdict
 * and name the label. The same file sits in each book's src/lib/; scripts/freshness/
 * review_label.test.mjs tests it and checks that the copies are identical.
 */

// <span class="freshness-badge" data-status="…" aria-label="…" title="…">Fresh</span>, together with
// the whitespace before it.
const BADGE = /\s*<span\b[^>]*\bclass="[^"]*\bfreshness-badge\b[^"]*"[^>]*>[^<]*<\/span>/g;
// Chapter header and print page: <span …> Last verified 2026-05-25 …
const HEADER_LABEL = /(<span\b[^>]*>\s*)Last verified(\s+\d{4}-\d{2}-\d{2})/g;
// Chapter list: <span class="chapter-card-verified" …>verified 2026-05-25</span>
const LIST_LABEL =
  /(<span\b[^>]*\bclass="[^"]*\bchapter-card-verified\b[^"]*"[^>]*>\s*)verified(\s+\d{4}-\d{2}-\d{2})/g;

// What must not survive. These are wider than the patterns above on purpose: a badge in another
// element, or a label followed by a date in another format, still counts as left over.
const LEFT_BADGE = /<[a-z][^>]*\bclass="[^"]*\bfreshness-badge\b/i;
const LEFT_HEADER_LABEL = /<span\b[^>]*>\s*Last verified\b/;
const LEFT_LIST_LABEL = /\bchapter-card-verified\b[^>]*>\s*verified\b/;

/** Pure. Returns the edited HTML and how many badges and labels were changed. */
export function rewriteHtml(html) {
  let badges = 0;
  let headers = 0;
  let lists = 0;
  const out = html
    .replace(BADGE, () => {
      badges++;
      return '';
    })
    .replace(HEADER_LABEL, (_match, open, date) => {
      headers++;
      return `${open}Last reviewed${date}`;
    })
    .replace(LIST_LABEL, (_match, open, date) => {
      lists++;
      return `${open}reviewed${date}`;
    });
  return { html: out, badges, headers, lists };
}

/** Pure. Names what a page still carries after rewriteHtml; an empty list means the page is clean. */
export function leftovers(html) {
  const found = [];
  if (LEFT_BADGE.test(html)) found.push('a freshness badge');
  if (LEFT_HEADER_LABEL.test(html)) found.push('a "Last verified" label');
  if (LEFT_LIST_LABEL.test(html)) found.push('a "verified" list label');
  return found;
}

/** Chapter pages in the build: the directories under chapters/ that hold an index.html. */
async function chapterCount(distDir) {
  const dir = join(distDir, 'chapters');
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    if (ent.isDirectory() && existsSync(join(dir, ent.name, 'index.html'))) n++;
  }
  return n;
}

/** Edits every .html file under distDir. Throws when the result is not what this step promises. */
export async function rewriteSite(distDir) {
  const total = { badges: 0, headers: 0, lists: 0, files: 0 };
  const left = [];
  const walk = async (d) => {
    for (const ent of await readdir(d, { withFileTypes: true })) {
      const p = join(d, ent.name);
      if (ent.isDirectory()) {
        await walk(p);
        continue;
      }
      if (!ent.name.endsWith('.html')) continue;
      const html = await readFile(p, 'utf8');
      const r = rewriteHtml(html);
      if (r.html !== html) {
        await writeFile(p, r.html);
        total.files++;
      }
      total.badges += r.badges;
      total.headers += r.headers;
      total.lists += r.lists;
      const still = leftovers(r.html);
      if (still.length > 0) left.push(`${relative(distDir, p)} (${still.join(', ')})`);
    }
  };
  await walk(distDir);

  const fix = "The scaffold's markup changed: update src/lib/review-label-integration.mjs.";
  if (left.length > 0) {
    throw new Error(
      `review-label: ${left.length} page(s) still carry a freshness verdict or a "verified" label, e.g. ${left.slice(0, 3).join('; ')}. ${fix}`,
    );
  }
  const chapters = await chapterCount(distDir);
  const labels = total.headers + total.lists;
  if (chapters === 0 || total.badges < chapters || labels < chapters) {
    throw new Error(
      `review-label: the build has ${chapters} chapter page(s), but this step removed ${total.badges} badge(s) and renamed ${labels} date label(s); it expects at least one of each per chapter. ${fix}`,
    );
  }
  return { ...total, chapters };
}

export default function reviewLabel() {
  return {
    name: 'review-label',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const t = await rewriteSite(fileURLToPath(dir));
        logger.info(
          `review-label: removed ${t.badges} freshness badge(s); renamed ${t.headers} header and ${t.lists} list date label(s) in ${t.files} file(s) (${t.chapters} chapters)`,
        );
      },
    },
  };
}
