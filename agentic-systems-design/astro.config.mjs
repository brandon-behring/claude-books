// @ts-check
/**
 * astro.config.mjs — book-scaffold-astro consumer config (v4 API).
 * Agentic Systems Design volume. Mirrors the handbook consumer setup.
 */
import { defineBookConfig, toolsStyle } from '@brandon_m_behring/book-scaffold-astro';

export default await defineBookConfig({
  // Split for the v4.23 sidebar brand (#135) — mirrors the landing page's
  // h1 + subtitle (the combined string overflowed the brand's first line).
  title: 'Agentic Systems Design',
  subtitle: 'Volume 1 · Environment & Context Engineering',
  styles: [toolsStyle],
  site: 'https://claude-books.brandon-behring.dev',
  base: '/design/',
  // landing: false (v4.20, #129): we own src/pages/index.astro; silences the
  // shadow warning before Astro makes the collision a hard error.
  routes: { landing: false },
  // routes: { tips: true } — DEFERRED (same scaffold gap as the handbook: the
  // package's pages/tips.astro hardcodes a path that mis-resolves under
  // npm-workspace hoisting and hard-fails the build). <Tip> still renders inline
  // in chapters; only the standalone /tips index is deferred. See docs/scaffold-gaps.md.
});
