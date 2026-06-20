# handbook

Built with [`@brandon_m_behring/book-scaffold-astro`](https://github.com/brandon-behring/book-scaffold-astro) (tools profile, v4.25.0).

## Getting started

```bash
npm install
npm run dev    # http://localhost:4321
```

## Authoring

Chapters live under `src/content/chapters/*.mdx`. `ch01-principles.mdx` is the canonical Part I template — the frontmatter shape, the slim chapter spine, and the full component set. See [`docs/port-recipe.md`](./docs/port-recipe.md) (port spec) + [`docs/lean-trim-recipe.md`](./docs/lean-trim-recipe.md) (de-dupe spec).

Available components are documented in the toolkit's [PACKAGE_DESIGN.md §10](https://github.com/brandon-behring/book-scaffold-astro/blob/v3.0/PACKAGE_DESIGN.md#10-mdx-import-patterns).

## Build + deploy

```bash
npm run validate    # pre-flight content checks
npm run build       # → dist/
npx wrangler deploy # Cloudflare Workers + Static Assets
```

See `wrangler.toml` for deploy config.
