// @ts-check
/**
 * astro.config.mjs — book-scaffold-astro consumer config (v4 API).
 * Agentic Systems Design volume. Mirrors the handbook consumer setup.
 */
import { defineBookConfig, toolsStyle } from '@brandon_m_behring/book-scaffold-astro';
import reviewLabel from './src/lib/review-label-integration.mjs';

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
  // Split for the v4.23 sidebar brand (#135) — mirrors the landing page's
  // h1 + subtitle (the combined string overflowed the brand's first line).
  title: 'Agentic Systems Design',
  subtitle: 'Volume 1 · Environment & Context Engineering',
  // releaseStatus (scaffold v4.26.2, #201): one notice at the top of every page built with the
  // scaffold's layout. It says what this draft is; the landing page says the same at more length.
  releaseStatus: {
    state: 'alpha',
    message:
      'Draft under correction. Some chapters and figures are under review, and statements about specific products and models describe them as they were in mid-2026.',
  },
  styles: [toolsStyle],
  site: 'https://claude-books.brandon-behring.dev',
  base: '/design/',
  // Cross-book <BookLink> registry (#96): same-origin path bases — one Worker serves
  // all apex subpaths. Switch to full origins at the subdomain migration (#14).
  siblingBooks: { handbook: '/handbook', 'agentic-coding': '/agentic-coding', architect: '/architect', design: '/design' },
  // landing: false (v4.20, #129): we own src/pages/index.astro; silences the
  // shadow warning before Astro makes the collision a hard error.
  // convergence: false — the cross-tool adoption page is withdrawn until its data is rebuilt (the
  // tools profile turns it on by default).
  routes: { landing: false, convergence: false },
  extraIntegrations: [noInlineFonts, noticeClearOfButtons, reviewLabel()],
  // routes: { tips: true } — DEFERRED (same scaffold gap as the handbook: the
  // package's pages/tips.astro hardcodes a path that mis-resolves under
  // npm-workspace hoisting and hard-fails the build). <Tip> still renders inline
  // in chapters; only the standalone /tips index is deferred. See docs/scaffold-gaps.md.
});
