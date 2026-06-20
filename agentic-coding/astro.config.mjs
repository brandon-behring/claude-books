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

export default await defineBookConfig({
  styles: [toolsStyle],
  site: 'https://claude-books.brandon-behring.dev',
  base: '/agentic-coding/',
  // Cross-book <BookLink> registry (#96): same-origin path bases — one Worker serves
  // all apex subpaths. Switch to full origins at the subdomain migration (#14).
  siblingBooks: { handbook: '/handbook', 'agentic-coding': '/agentic-coding', architect: '/architect', design: '/design' },
  title: 'Agentic Coding',
  subtitle: 'Principles & Practices — Claude Code · Gemini CLI · Codex CLI',
  // The book owns src/pages/index.astro (landing) — silence the scaffold shadow.
  routes: { landing: false },
});
