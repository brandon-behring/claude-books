// @ts-check
/**
 * astro.config.mjs — book-scaffold-astro consumer config (v4 API).
 * Uses the v4 `styles: [...]` composition pattern (BREAKING from v3 `preset:` shorthand).
 */
import { defineBookConfig, toolsStyle } from '@brandon_m_behring/book-scaffold-astro';
import rebaseInbook from './src/lib/rebase-inbook-integration.mjs';

// Single source for the book's base — used by both `base:` and the in-book link rebaser (#22).
const BASE = '/handbook/';

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
  // landing: false (v4.20, #129): we own src/pages/index.astro; silences the
  // shadow warning before Astro makes the collision a hard error.
  routes: { landing: false },
  // #22: base-rebase root-relative in-book links (/chapters/, /supplements/) in the built
  // HTML so they resolve under `base` in the combined deploy — one net for markdown prose,
  // consumer components, AND the scaffold's own /chapters index. Local bridge; canonical
  // fix filed upstream (drop when the scaffold ships base-aware prose/page links).
  extraIntegrations: [rebaseInbook({ base: BASE })],
  // routes: { tips: true } — DEFERRED to the deploy phase. The package's
  // pages/tips.astro hardcodes `../../../src/data/tips.json`, which mis-resolves
  // under npm-workspace hoisting (reaches repo-root src/, not handbook/src/) and
  // hard-fails the build. <Tip> components still render inline in chapters; only
  // the standalone /tips index is deferred. See docs/scaffold-gaps.md.
});
