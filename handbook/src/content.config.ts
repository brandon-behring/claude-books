/**
 * src/content.config.ts — Content collections.
 *
 * defineBookSchemas returns the scaffold's default collections (chapters,
 * tools-collateral, etc.). Below we add a custom `poc` collection for the
 * handbook's pedagogical proof-of-concepts — see ./PEDAGOGY.md.
 */
import { defineBookSchemas } from '@brandon_m_behring/book-scaffold-astro/schemas';
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const scaffold = defineBookSchemas();

const poc = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/poc' }),
  schema: z.object({
    title: z.string(),
    poc_kind: z.enum(['tutorial', 'how-to', 'tldr', 'part-summary', 'cheat-sheet']),
    chapter_source: z.number().int().optional(),
    part_source: z.number().int().optional(),
    description: z.string().optional(),
    last_updated: z.string(),
    visual_intent: z.string().optional(),
  }),
});

export const collections = {
  ...scaffold.collections,
  poc,
};
