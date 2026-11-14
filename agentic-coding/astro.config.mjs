// @ts-check
/**
 * astro.config.mjs — Agentic Coding (tools profile), v4 consumer of
 * @brandon_m_behring/book-scaffold-astro.
 *
 * Folded in from book-template-astro (v3) 2026-06-16: profile:'tools' →
 * styles:[toolsStyle]; `base` set for the claude-books apex subroute
 * (claude-books.brandon-behring.dev/agentic-coding/, base-aware links per
 * scaffold v4.24 #140/#141).
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
  styles: [toolsStyle],
  site: 'https://claude-books.brandon-behring.dev',
  base: '/agentic-coding/',
  // Cross-book <BookLink> registry (#96): same-origin path bases — one Worker serves
  // all apex subpaths. Switch to full origins at the subdomain migration (#14).
  siblingBooks: { handbook: '/handbook', 'agentic-coding': '/agentic-coding', architect: '/architect', design: '/design' },
  title: 'Agentic Coding',
  subtitle: 'Principles & Practices — Claude Code · Gemini CLI · Codex CLI',
  // releaseStatus (scaffold v4.26.2, #201): one notice at the top of every page built with the
  // scaffold's layout. It says what this draft is; the landing page says the same at more length.
  releaseStatus: {
    state: 'alpha',
    message:
      'Draft under correction. A book about durable principles: its comparisons of Claude Code, Gemini CLI and Codex CLI describe the tools as they were in mid-2026, not as they are now.',
  },
  // The book owns src/pages/index.astro (landing) — silence the scaffold shadow.
  // convergence: false — the cross-tool adoption page is withdrawn until its data is rebuilt (the
  // tools profile turns it on by default). The data stays in changelog/, unrendered.
  routes: { landing: false, convergence: false },
  extraIntegrations: [noInlineFonts, noticeClearOfButtons, reviewLabel()],
});
