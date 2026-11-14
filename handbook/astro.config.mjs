// @ts-check
/**
 * astro.config.mjs — book-scaffold-astro consumer config (v4 API).
 * Uses the v4 `styles: [...]` composition pattern (BREAKING from v3 `preset:` shorthand).
 */
import { defineBookConfig, toolsStyle } from '@brandon_m_behring/book-scaffold-astro';
import rebaseInbook from './src/lib/rebase-inbook-integration.mjs';
import reviewLabel from './src/lib/review-label-integration.mjs';

// Single source for the book's base — used by both `base:` and the in-book link rebaser (#22).
const BASE = '/handbook/';

// Fonts are never inlined as data: URIs. Vite inlines any asset under 4 KiB, and one subset of the
// scaffold's code font is that small; the scaffold's Content-Security-Policy (font-src 'self')
// then refuses it on every page. Bridge for a scaffold gap (docs/scaffold-gaps.md): drop it when
// the scaffold stops inlining its fonts or allows data: fonts.
const noInlineFonts = {
  name: 'no-inline-fonts',
  hooks: {
    'astro:config:setup': ({ updateConfig }) =>
      updateConfig({
        vite: { build: { assetsInlineLimit: (file) => (/\.(woff2?|ttf|otf)$/i.test(file) ? false : undefined) } },
      }),
  },
};

// The scaffold's corner buttons are fixed at the top right and cover part of the release notice.
// src/styles/release-notice.css keeps the notice clear of them, on every page the scaffold renders.
// Bridge for a scaffold gap (docs/scaffold-gaps.md).
const noticeClearOfButtons = {
  name: 'notice-clear-of-buttons',
  hooks: {
    'astro:config:setup': ({ injectScript }) =>
      injectScript('page-ssr', "import '/src/styles/release-notice.css';"),
  },
};

export default await defineBookConfig({
  styles: [toolsStyle],
  site: 'https://claude-books.brandon-behring.dev',
  base: BASE,
  // Cross-book <BookLink> registry (#96): same-origin path bases — one Worker serves
  // all apex subpaths. Switch to full origins at the subdomain migration (#14).
  siblingBooks: { handbook: '/handbook', 'agentic-coding': '/agentic-coding', architect: '/architect', design: '/design' },
  // Sidebar brand (scaffold v4.23, #135) — mirrors the landing page's h1; the
  // subtitle is BOOK-MAP.md's one-line lens for the Use book.
  title: 'Best Practices for Using Claude',
  subtitle: 'Claude Code in daily practice',
  // releaseStatus (scaffold v4.26.2, #201): one notice at the top of every page built with the
  // scaffold's layout. It says what this draft is; the landing page says the same at more length.
  releaseStatus: {
    state: 'alpha',
    message:
      'Draft under correction. It describes Claude Code as it was in mid-2026: check settings, commands and security advice against the Claude Code documentation before you rely on them.',
  },
  // landing: false (v4.20, #129): we own src/pages/index.astro; silences the
  // shadow warning before Astro makes the collision a hard error.
  // convergence: false — the cross-tool adoption page is withdrawn until its data is rebuilt (the
  // tools profile turns it on by default).
  routes: { landing: false, convergence: false },
  // #22: base-rebase root-relative in-book links (/chapters/, /supplements/) in the built
  // HTML so they resolve under `base` in the combined deploy — one net for markdown prose,
  // consumer components, AND the scaffold's own /chapters index. Local bridge; canonical
  // fix filed upstream (drop when the scaffold ships base-aware prose/page links).
  extraIntegrations: [rebaseInbook({ base: BASE }), noInlineFonts, noticeClearOfButtons, reviewLabel()],
  // routes: { tips: true } — DEFERRED to the deploy phase. The package's
  // pages/tips.astro hardcodes `../../../src/data/tips.json`, which mis-resolves
  // under npm-workspace hoisting (reaches repo-root src/, not handbook/src/) and
  // hard-fails the build. <Tip> components still render inline in chapters; only
  // the standalone /tips index is deferred. See docs/scaffold-gaps.md.
});
