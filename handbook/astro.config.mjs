// @ts-check
/**
 * astro.config.mjs — book-scaffold-astro consumer config (v4 API).
 * Uses the v4 `styles: [...]` composition pattern (BREAKING from v3 `preset:` shorthand).
 */
import { defineBookConfig, toolsStyle } from '@brandon_m_behring/book-scaffold-astro';

export default await defineBookConfig({
  styles: [toolsStyle],
  site: 'https://example.invalid',
  // routes: { tips: true } — DEFERRED to the deploy phase. The package's
  // pages/tips.astro hardcodes `../../../src/data/tips.json`, which mis-resolves
  // under npm-workspace hoisting (reaches repo-root src/, not handbook/src/) and
  // hard-fails the build. <Tip> components still render inline in chapters; only
  // the standalone /tips index is deferred. See docs/scaffold-gaps.md.
});
