// @ts-check
/**
 * astro.config.mjs — claude-books series HUB landing.
 *
 * A book-scaffold-astro consumer whose ONLY page is the apex series index
 * (src/pages/index.astro). Built into the combined dist/ root by
 * scripts/assemble-hub.mjs, above the four book workspaces. base: '/' (apex);
 * the books take '/architect/', '/design/', '/agentic-coding/', '/handbook/'.
 *
 * Profile (deliberate). styles:[toolsStyle] — claude-books is the *tools*
 * family. A chapter-less hub has no use for the tools chrome (the ToolFilter +
 * VersionSelector islands; VersionSelector even ships STUB versions whose
 * '/v1.0/' link 404s), so src/pages/index.astro passes Base `showChrome={false}`
 * (book-scaffold-astro >=4.25.2, #163) to suppress those islands — the chrome
 * is then search + theme-toggle only, the hub's control cluster. This replaces
 * the old workaround of borrowing the 'academic' profile for its chrome-free
 * gate (which dragged unused katex peer deps). Typography is profile-agnostic
 * (Base imports Roboto + tokens.css unconditionally): #3B6FA0 accent, Roboto,
 * the real data-theme toggle — visually identical to the tools sub-books.
 */
import { defineBookConfig, toolsStyle } from '@brandon_m_behring/book-scaffold-astro';

export default await defineBookConfig({
  styles: [toolsStyle],
  site: 'https://claude-books.brandon-behring.dev',
  base: '/',
  title: 'claude-books',
  subtitle: 'A Claude-centered book series — Use · Cert · Design',
  // The hub owns src/pages/index.astro (the series index) → silence the
  // scaffold's shadow landing. No chapters/references/print on a hub. Keep
  // search: Base hardcodes the search button, so '/search/' must resolve —
  // the build script runs pagefind to index the landing.
  routes: { landing: false, chapters: false, references: false, print: false, search: true, convergence: false },
});
