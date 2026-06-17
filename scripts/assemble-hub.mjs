/**
 * assemble-hub.mjs — combined-dist assembler for claude-books.brandon-behring.dev.
 *
 * Each book builds to <book>/dist with base '/<subroute>/' (Astro keeps assets at
 * dist root and base-prefixes links). This copies each book's dist into the apex
 * dist/<subroute>/ and writes the hub landing at dist/index.html, so ONE Cloudflare
 * Worker ([assets] dir=./dist in wrangler.toml) serves the whole apex — no per-book
 * Workers, no service-binding proxy. Run by the root `build` script after the
 * workspace builds.
 *
 * Handbook is content-incomplete (draft): served but noindex via robots.txt.
 */
import { cpSync, rmSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BOOKS = [
  { dir: 'architect-reference', slug: 'architect', title: "The Claude Architect's Reference", lens: 'Cert', blurb: 'Self-contained CCA-F (D1–D5) study guide' },
  { dir: 'agentic-systems-design', slug: 'design', title: 'Agentic Systems Design', lens: 'Design', blurb: 'Engineering agentic systems (multi-volume)' },
  { dir: 'agentic-coding', slug: 'agentic-coding', title: 'Agentic Coding', lens: 'Use', blurb: 'Cross-tool — Claude Code · Gemini CLI · Codex CLI' },
  { dir: 'handbook', slug: 'handbook', title: 'Handbook', lens: 'Use', blurb: 'Claude Code in daily practice', draft: true },
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

const card = (b) => `      <li>
        <a href="/${b.slug}/"><span class="lens">${b.lens}</span> ${b.title}</a>
        <p>${b.blurb}</p>
      </li>`;
const live = BOOKS.filter((b) => !b.draft).map(card).join('\n');

writeFileSync(join(OUT, 'index.html'), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>claude-books — a Claude Code / agentic-coding book series</title>
  <meta name="description" content="A multi-book series on building with Claude Code and agentic systems, on book-scaffold-astro." />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <style>
    :root { color-scheme: light dark; --fg: #1a1a1a; --muted: #666; --bg: #fafafa; --accent: #5a4fcf; }
    @media (prefers-color-scheme: dark) { :root { --fg: #e8e8e8; --muted: #9a9a9a; --bg: #14141a; } }
    * { box-sizing: border-box; }
    body { margin: 0; font: 16px/1.6 ui-sans-serif, system-ui, sans-serif; color: var(--fg); background: var(--bg); }
    main { max-width: 44rem; margin: 0 auto; padding: 4rem 1.5rem; }
    h1 { font-size: 1.9rem; margin: 0 0 .25rem; }
    .tagline { color: var(--muted); margin: 0 0 2.5rem; }
    ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 1rem; }
    li { border: 1px solid color-mix(in srgb, var(--fg) 14%, transparent); border-radius: 10px; padding: 1.1rem 1.25rem; }
    li a { font-size: 1.15rem; font-weight: 600; text-decoration: none; color: var(--fg); }
    li a:hover { color: var(--accent); }
    .lens { display: inline-block; font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); border: 1px solid currentColor; border-radius: 4px; padding: .05rem .4rem; margin-right: .5rem; vertical-align: middle; }
    li p { color: var(--muted); margin: .4rem 0 0; font-size: .95rem; }
    footer { margin-top: 3rem; color: var(--muted); font-size: .85rem; }
    footer a { color: inherit; }
  </style>
</head>
<body>
  <main>
    <h1>claude-books</h1>
    <p class="tagline">A series on building with Claude Code &amp; agentic systems — on <a href="https://github.com/brandon-behring/book-scaffold-astro">book-scaffold-astro</a>.</p>
    <ul>
${live}
    </ul>
    <footer><a href="https://brandon-behring.dev">brandon-behring.dev</a></footer>
  </main>
</body>
</html>
`);

writeFileSync(join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /handbook/\n');

// Apex favicon: the hand-written hub landing links /favicon.svg — copy the series mark
// (the Claude logo) from an assembled book so the root tab icon resolves (no /favicon.ico 404).
cpSync(join(OUT, 'agentic-coding', 'favicon.svg'), join(OUT, 'favicon.svg'));
console.log('  wrote dist/index.html (hub landing) + dist/robots.txt (handbook noindex) + dist/favicon.svg');
