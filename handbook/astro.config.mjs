// @ts-check
/**
 * astro.config.mjs — book-scaffold-astro consumer config.
 * defineBookConfig threads BOOK_PROFILE and wires the Integration.
 */
import { defineBookConfig } from '@brandon_m_behring/book-scaffold-astro';

export default await defineBookConfig({
  site: 'https://example.invalid',
});
