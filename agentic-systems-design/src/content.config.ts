/**
 * src/content.config.ts — Content collections for Agentic Systems Design.
 *
 * defineBookSchemas returns the scaffold's default collections (chapters,
 * tools-collateral, etc.). This book is authored from research dossiers, so
 * there is no custom `poc` collection yet — add one
 * later if PoC supplements are wanted (see the handbook for the pattern).
 */
import { defineBookSchemas } from '@brandon_m_behring/book-scaffold-astro/schemas';

const scaffold = defineBookSchemas();

export const collections = {
  ...scaffold.collections,
};
