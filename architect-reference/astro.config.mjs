// @ts-check
/**
 * astro.config.mjs — book-scaffold-astro consumer config (v4 API).
 * The Claude Architect's Reference (cert-aligned) volume. Mirrors the handbook consumer setup.
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
  base: '/architect/',
  // Cross-book <BookLink> registry (#96): same-origin path bases — one Worker serves
  // all apex subpaths. Switch to full origins at the subdomain migration (#14).
  siblingBooks: { handbook: '/handbook', 'agentic-coding': '/agentic-coding', architect: '/architect', design: '/design' },
  // Sidebar brand (scaffold v4.23, #135) — mirrors the landing page's h1 + subtitle.
  title: "The Claude Architect's Reference",
  subtitle: 'Claude Certified Architect — Foundations (D1–D5)',
  // releaseStatus (scaffold v4.26.2, #201): one notice at the top of every page built with the
  // scaffold's layout. It says what this draft is; the landing page says the same at more length.
  releaseStatus: {
    state: 'alpha',
    message:
      "Draft under correction. An unscored study companion, independent of Anthropic: it does not claim to match the exam's content or weighting, and some chapters describe Claude Code and the Claude API as they were in mid-2026.",
  },
  // Study-guide apparatus (scaffold v4.17 spine, #112/#117): the five CCA-F exam
  // domains + the static /practice-exam route. Questions live in
  // src/content/questions/**.mdx (the `questions` collection auto-registers when that
  // directory is present). A question whose `domain` isn't in this list throws at
  // build (fail-loud). <ObjectiveMap/> derives its domain→chapter matrix from the bank.
  examDomains: [
    'Agentic Architecture & Orchestration',     // D1 (27%)
    'Tool Design & MCP Integration',            // D2 (18%)
    'Claude Code Configuration & Workflows',    // D3 (20%)
    'Prompt Engineering & Structured Output',   // D4 (20%)
    'Context Management & Reliability',         // D5 (15%)
  ],
  // answers (v4.21, #114): the Sybex back-appendix — pairs with the questions'
  // <Rationale appendix for=> markers. landing: false (v4.20, #129): we own
  // src/pages/index.astro; this silences the shadow warning before Astro makes
  // the collision a hard error. glossary + flashcards (v4.19/v4.22, #115/#116):
  // the shared term layer. Terms are authored once in the repo-root glossary/terms/
  // and synced (gitignored) into src/content/glossary/ by scripts/sync-glossary.mjs
  // (predev/prebuild); the flashcards deck derives from that glossary collection.
  // practiceExam: false — scoring is off; every question stays readable, with its answer, on /answers/.
  // convergence: false — the cross-tool adoption page is withdrawn (the tools profile turns it on).
  routes: { practiceExam: false, answers: true, glossary: true, flashcards: true, landing: false, convergence: false },
  extraIntegrations: [noInlineFonts, noticeClearOfButtons],
  // routes: { tips: true } — DEFERRED (same scaffold gap as the other books: the
  // package's pages/tips.astro hardcodes a path that mis-resolves under npm-workspace
  // hoisting and hard-fails the build). See docs/scaffold-gaps.md.
});
