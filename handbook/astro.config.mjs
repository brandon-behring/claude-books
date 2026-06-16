// @ts-check
/**
 * astro.config.mjs — book-scaffold-astro consumer config (v4 API).
 * Uses the v4 `styles: [...]` composition pattern (BREAKING from v3 `preset:` shorthand).
 */
import { defineBookConfig, toolsStyle } from '@brandon_m_behring/book-scaffold-astro';

export default await defineBookConfig({
  styles: [toolsStyle],
  site: 'https://claude-books.brandon-behring.dev',
  base: '/handbook/',
  // Sidebar brand (scaffold v4.23, #135) — mirrors the landing page's h1; the
  // subtitle is BOOK-MAP.md's one-line lens for the Use book.
  title: 'Best Practices for Using Claude',
  subtitle: 'Claude Code in daily practice',
  // landing: false (v4.20, #129): we own src/pages/index.astro; silences the
  // shadow warning before Astro makes the collision a hard error.
  routes: { landing: false },
  // routes: { tips: true } — DEFERRED to the deploy phase. The package's
  // pages/tips.astro hardcodes `../../../src/data/tips.json`, which mis-resolves
  // under npm-workspace hoisting (reaches repo-root src/, not handbook/src/) and
  // hard-fails the build. <Tip> components still render inline in chapters; only
  // the standalone /tips index is deferred. See docs/scaffold-gaps.md.
});
