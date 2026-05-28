// @ts-check
/**
 * astro.config.mjs — book-scaffold-astro consumer config (v4 API).
 * Architect's Reference volume. Mirrors the handbook consumer setup.
 */
import { defineBookConfig, toolsStyle } from '@brandon_m_behring/book-scaffold-astro';

export default await defineBookConfig({
  styles: [toolsStyle],
  site: 'https://example.invalid',
  // routes: { tips: true } — DEFERRED (same scaffold gap as the handbook: the
  // package's pages/tips.astro hardcodes a path that mis-resolves under
  // npm-workspace hoisting and hard-fails the build). <Tip> still renders inline
  // in chapters; only the standalone /tips index is deferred. See docs/scaffold-gaps.md.
});
