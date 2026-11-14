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
 * family. A chapter-less hub has no use for the tools chrome (the ToolFilter
 * island; before scaffold 4.27.0 also a VersionSelector with placeholder
 * versions), so src/pages/index.astro passes Base `showChrome={false}`
 * (book-scaffold-astro >=4.25.2, #163) to suppress it — the chrome
 * is then search + theme-toggle only, the hub's control cluster. This replaces
 * the old workaround of borrowing the 'academic' profile for its chrome-free
 * gate (which dragged unused katex peer deps). Typography is profile-agnostic
 * (Base imports Roboto + tokens.css unconditionally): #3B6FA0 accent, Roboto,
 * the real data-theme toggle — visually identical to the tools sub-books.
 */
import { defineBookConfig, toolsStyle } from '@brandon_m_behring/book-scaffold-astro';

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
  extraIntegrations: [noInlineFonts],
});
