// @ts-check
/**
 * astro.config.mjs — book-scaffold-astro consumer config (v4 API).
 * The Claude Architect's Reference (cert-aligned) volume. Mirrors the handbook consumer setup.
 */
import { defineBookConfig, toolsStyle } from '@brandon_m_behring/book-scaffold-astro';

export default await defineBookConfig({
  styles: [toolsStyle],
  site: 'https://example.invalid',
  // routes: { tips: true } — DEFERRED (same scaffold gap as the other books: the
  // package's pages/tips.astro hardcodes a path that mis-resolves under npm-workspace
  // hoisting and hard-fails the build). See docs/scaffold-gaps.md.
});
