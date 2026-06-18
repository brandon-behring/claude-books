/**
 * src/content.config.ts — Content collections.
 *
 * defineBookSchemas returns the scaffold's default collections (chapters,
 * tools-collateral, etc.). Below we add a custom `supplements` collection for
 * the handbook's secondary-disclosure layer — tutorials, how-tos, TL;DRs,
 * cheat-sheets, and part-summaries that accompany the canonical chapters.
 * (Formerly `poc/`; the format experiment concluded — see ./PEDAGOGY.md #7.)
 */
import { defineBookSchemas } from '@brandon_m_behring/book-scaffold-astro/schemas';
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const scaffold = defineBookSchemas();

const supplements = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/supplements' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['tutorial', 'how-to', 'tldr', 'part-summary', 'cheat-sheet']),
    chapter_source: z.number().int().optional(),
    part_source: z.number().int().optional(),
    description: z.string().optional(),
    last_updated: z.string(),
    visual_intent: z.string().optional(),
    // draft supplements (e.g. ch05–08, pending the Part II port) build but are
    // segregated out of listings + nav and noindexed — see the slug route.
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  ...scaffold.collections,
  supplements,
};
