// @ts-check
/**
 * astro.config.mjs — claude-books series HUB landing.
 *
 * A book-scaffold-astro consumer whose ONLY page is the apex series index
 * (src/pages/index.astro). Built into the combined dist/ root by
 * scripts/assemble-hub.mjs, above the four book workspaces. base: '/' (apex);
 * the books take '/architect/', '/design/', '/agentic-coding/', '/handbook/'.
 *
 * Profile note (deliberate + documented). styles:[academicStyle] resolves the
 * 'academic' profile — chosen NOT for academic semantics (claude-books is the
 * *tools* family) but because academic is the scaffold's ONLY chrome-free
 * profile. Base.astro gates the ToolFilter + VersionSelector chrome islands on
 * `BOOK_PROFILE !== 'academic'`, and the integration vite-defines BOOK_PROFILE
 * from the resolved style preset (so an npm-script env var can't decouple it).
 * On a chapter-less hub those islands are nonsensical — VersionSelector even
 * ships STUB versions whose '/v1.0/' link 404s. academic profile => the chrome
 * is search + theme-toggle only, which is exactly the hub's control cluster.
 * Typography is profile-agnostic (Base imports Roboto + tokens.css
 * unconditionally), so the hub is visually identical to the tools sub-books:
 * #3B6FA0 accent, Roboto, the real data-theme toggle. A proper `hub`/`landing`
 * profile (or data-gated chrome islands) is tracked upstream as a dogfood gap.
 */
import { defineBookConfig, academicStyle } from '@brandon_m_behring/book-scaffold-astro';

export default await defineBookConfig({
  styles: [academicStyle],
  site: 'https://claude-books.brandon-behring.dev',
  base: '/',
  title: 'claude-books',
  subtitle: 'A Claude-centered book series — Use · Cert · Design',
  // The hub owns src/pages/index.astro (the series index) → silence the
  // scaffold's shadow landing. No chapters/references/print on a hub. Keep
  // search: Base hardcodes the search button, so '/search/' must resolve —
  // the build script runs pagefind to index the landing.
  routes: { landing: false, chapters: false, references: false, print: false, search: true },
});
