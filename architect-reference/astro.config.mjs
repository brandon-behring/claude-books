// @ts-check
/**
 * astro.config.mjs — book-scaffold-astro consumer config (v4 API).
 * The Claude Architect's Reference (cert-aligned) volume. Mirrors the handbook consumer setup.
 */
import { defineBookConfig, toolsStyle } from '@brandon_m_behring/book-scaffold-astro';

export default await defineBookConfig({
  styles: [toolsStyle],
  site: 'https://example.invalid',
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
  routes: { practiceExam: true },
  // routes: { tips: true } — DEFERRED (same scaffold gap as the other books: the
  // package's pages/tips.astro hardcodes a path that mis-resolves under npm-workspace
  // hoisting and hard-fails the build). See docs/scaffold-gaps.md.
});
