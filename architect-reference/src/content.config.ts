/**
 * src/content.config.ts — Content collections for The Claude Architect's Reference (cert-aligned).
 *
 * defineBookSchemas returns the scaffold's default collections (chapters, etc.).
 * This slot is a skeleton — the D1–D5 outline lives in OUTLINE.md; chapters are
 * authored in a later round.
 */
import { defineBookSchemas } from '@brandon_m_behring/book-scaffold-astro/schemas';

const scaffold = defineBookSchemas();

export const collections = {
  ...scaffold.collections,
};
