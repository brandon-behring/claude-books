// Tests for the review-label build step (src/lib/review-label-integration.mjs in each book).
// Run: node --test scripts/freshness/review_label.test.mjs
// The markup below is copied from pages built with book-scaffold-astro 4.27.1.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { leftovers, rewriteHtml, rewriteSite } from '../../handbook/src/lib/review-label-integration.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BOOKS = ['handbook', 'agentic-coding', 'architect-reference', 'agentic-systems-design'];

const HEADER =
  '<span>\nLast verified 2026-05-25 <span class="freshness-badge" data-status="fresh" aria-label="Fresh (173d old; verify within 192d)" title="Fresh (173d old; verify within 192d)">Fresh</span> </span>';
const LIST =
  '<span class="freshness-badge" data-status="stale" aria-label="Stale (148d old; 58d past threshold)" title="Stale (148d old; 58d past threshold)" data-astro-cid-ry3q5fhk>Stale</span> <span class="chapter-card-verified" data-astro-cid-ry3q5fhk>verified 2026-06-19</span>';
const PROSE = '<p>The chapter header shows <code>Last verified 2026-04-17</code>. Commit verified work promptly.</p>';
const STYLE = '<style>.freshness-badge{display:inline-block}.chapter-card-verified{color:gray}</style>';

test('a chapter header loses its badge and says "Last reviewed"', () => {
  const r = rewriteHtml(HEADER);
  assert.equal(r.html, '<span>\nLast reviewed 2026-05-25 </span>');
  assert.deepEqual([r.badges, r.headers, r.lists], [1, 1, 0]);
  assert.deepEqual(leftovers(r.html), []);
});

test('a chapter-list card loses its badge and says "reviewed"', () => {
  const r = rewriteHtml(LIST);
  assert.equal(r.html, ' <span class="chapter-card-verified" data-astro-cid-ry3q5fhk>reviewed 2026-06-19</span>');
  assert.deepEqual([r.badges, r.headers, r.lists], [1, 0, 1]);
  assert.deepEqual(leftovers(r.html), []);
});

test('a header with a date but no badge is still renamed', () => {
  const r = rewriteHtml('<span> Last verified 2026-06-02 </span>');
  assert.equal(r.html, '<span> Last reviewed 2026-06-02 </span>');
  assert.deepEqual([r.badges, r.headers], [0, 1]);
});

test('prose and stylesheets are left alone', () => {
  for (const html of [PROSE, STYLE]) {
    const r = rewriteHtml(html);
    assert.equal(r.html, html);
    assert.deepEqual([r.badges, r.headers, r.lists], [0, 0, 0]);
    assert.deepEqual(leftovers(r.html), []);
  }
});

test('every status word is removed, not only "Fresh"', () => {
  for (const [status, word] of [['fresh', 'Fresh'], ['verify-soon', 'Verify soon'], ['stale', 'Stale']]) {
    const html = `<span> Last verified 2026-06-02 <span class="freshness-badge" data-status="${status}" aria-label="x" title="x">${word}</span> </span>`;
    const r = rewriteHtml(html);
    assert.ok(!r.html.includes(word), `${word} is still in ${r.html}`);
    assert.equal(r.badges, 1);
  }
});

test('markup this step does not know is reported as left over', () => {
  const after = (html) => leftovers(rewriteHtml(html).html);
  // The badge became a <div>.
  assert.deepEqual(after('<div class="freshness-badge" data-status="stale">Stale</div>'), ['a freshness badge']);
  // The header's date changed format, so the label was not renamed.
  assert.deepEqual(after('<span>\tLast verified 19 June 2026</span>'), ['a "Last verified" label']);
  // The list label was reworded.
  assert.deepEqual(after('<span class="chapter-card-verified">verified on 2026-06-19</span>'), [
    'a "verified" list label',
  ]);
  // All three at once are all named.
  assert.deepEqual(
    after(
      '<b class="x freshness-badge">Stale</b><span>Last verified in June</span><span class="chapter-card-verified">verified recently</span>',
    ),
    ['a freshness badge', 'a "Last verified" label', 'a "verified" list label'],
  );
});

test('extra attributes and spacing on a known label are still handled', () => {
  const r = rewriteHtml('<span class="meta" data-x="1">Last verified  2026-06-02</span>');
  assert.equal(r.html, '<span class="meta" data-x="1">Last reviewed  2026-06-02</span>');
  assert.deepEqual(leftovers(r.html), []);
});

async function site(pages) {
  const dir = await mkdtemp(join(tmpdir(), 'review-label-'));
  for (const [path, html] of Object.entries(pages)) {
    await mkdir(dirname(join(dir, path)), { recursive: true });
    await writeFile(join(dir, path), html);
  }
  return dir;
}

test('a whole build is rewritten and counted', async () => {
  const dir = await site({
    'chapters/ch01/index.html': `<html><body>${HEADER}${PROSE}</body></html>`,
    'chapters/ch02/index.html': `<html><body>${HEADER}</body></html>`,
    'chapters/index.html': `<html><head>${STYLE}</head><body>${LIST}${LIST}</body></html>`,
    'print/index.html': `<html><body>${HEADER}${HEADER}</body></html>`,
    'search/index.html': '<html><body>no labels here</body></html>',
  });
  try {
    const t = await rewriteSite(dir);
    assert.deepEqual(t, { badges: 6, headers: 4, lists: 2, files: 4, chapters: 2 });
    const all = (
      await Promise.all(
        ['chapters/ch01/index.html', 'chapters/ch02/index.html', 'chapters/index.html', 'print/index.html'].map((p) =>
          readFile(join(dir, p), 'utf8'),
        ),
      )
    ).join('\n');
    assert.ok(!/class="freshness-badge"/.test(all));
    assert.equal(all.match(/Last reviewed 2026-05-25/g).length, 4);
    assert.equal(all.match(/>reviewed 2026-06-19</g).length, 2);
    assert.ok(all.includes('<code>Last verified 2026-04-17</code>'), 'prose must be untouched');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('the build stops when a verdict is left on a page', async () => {
  const dir = await site({
    'chapters/ch01/index.html': `<html><body>${HEADER}<div class="freshness-badge">Stale</div></body></html>`,
    'chapters/index.html': `<html><body>${LIST}</body></html>`,
  });
  try {
    await assert.rejects(rewriteSite(dir), /1 page\(s\) still carry a freshness verdict.*chapters\/ch01\/index\.html \(a freshness badge\)/s);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('the build stops when fewer badges were removed than there are chapters', async () => {
  const dir = await site({
    'chapters/ch01/index.html': `<html><body>${HEADER}</body></html>`,
    'chapters/ch02/index.html': '<html><body>a chapter whose header has no date</body></html>',
    'chapters/ch03/index.html': '<html><body>another</body></html>',
  });
  try {
    await assert.rejects(rewriteSite(dir), /has 3 chapter page\(s\), but this step removed 1 badge\(s\) and renamed 1 date label\(s\)/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('the build stops when it finds no chapters at all', async () => {
  const dir = await site({ 'index.html': '<html><body>landing only</body></html>' });
  try {
    await assert.rejects(rewriteSite(dir), /has 0 chapter page\(s\)/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('the four books carry the same file', async () => {
  const [first, ...rest] = await Promise.all(
    BOOKS.map((b) => readFile(join(ROOT, b, 'src', 'lib', 'review-label-integration.mjs'), 'utf8')),
  );
  rest.forEach((text, i) => assert.equal(text, first, `${BOOKS[i + 1]} differs from ${BOOKS[0]}`));
});
