/**
 * mdx-components.ts — Consumer-shipped MDX components for the handbook.
 *
 * Wired via book-scaffold-astro's defineMdxComponents helper. Auto-detected by the
 * scaffold integration and threaded through scaffold-injected routes (e.g. /print).
 *
 * Note: PracticeTag (\official{} / \practitioner{} / \convergence{}) is NOT here —
 * it's covered by the scaffold's own <Tag kind="..." /> component. WhyBox is also
 * absent — try the scaffold's <InsightBox> first, only ship a custom WhyBox if the
 * gut-check at port-time says InsightBox doesn't fit (see plan Step 4).
 */
import { defineMdxComponents } from '@brandon_m_behring/book-scaffold-astro';
import DecisionBox from './components/DecisionBox.astro';
import BeforeAfter from './components/BeforeAfter.astro';
import MaturityLevel from './components/MaturityLevel.astro';

export default defineMdxComponents({
  DecisionBox,
  BeforeAfter,
  MaturityLevel,
});
