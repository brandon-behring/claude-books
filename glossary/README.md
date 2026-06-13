# `glossary/` — the shared term layer (canonical source)

This directory is the **single source of truth** for the claude-books series glossary — a
deep-linkable layer of canonical term definitions, **not** a read-through book (see
[`../docs/BOOK-MAP.md`](../docs/BOOK-MAP.md) §"Glossary = shared infrastructure").

## How it works

- **Author terms here, once:** `glossary/terms/<slug>.mdx` — one file = one term.
  - Frontmatter (scaffold `glossarySchema`, `.strict()` — a typo'd key fails the build):
    - `term:` *(required)* — the display term.
    - `aliases:` — synonyms / alternate spellings (searchable). Default `[]`.
    - `domain:` — optional grouping; for the cert book, a CCA-F domain string (one of the
      five `examDomains` in `architect-reference/astro.config.mjs`).
    - `see:` — related term **ids** (filename slugs) for the "See also" cross-links. Default `[]`.
    - `tags:` — freeform. Default `[]`.
    - `draft:` — omit / `false` to publish.
  - **MDX body = the definition** (one tight paragraph; may use components / `<Cite>`).
  - The filename slug is the entry **id** and the `/glossary#term-<id>` anchor that inline
    `<Term id="<slug>">…</Term>` links to.

- **Consuming books do not author terms.** A sync step copies the canonical files into each
  book's `src/content/glossary/` (a **gitignored** build artifact) so the scaffold's
  `/glossary` + `/flashcards` routes — which hard-probe `src/content/glossary/` — find real
  files. Run by [`../scripts/sync-glossary.mjs`](../scripts/sync-glossary.mjs) `<book>`,
  wired into each consumer's `predev` + `prebuild`.

## Why copy (not symlink / loader)

The scaffold's `/glossary` + `/flashcards` pages presence-probe
`import.meta.glob('/src/content/glossary/**')`. A custom Astro loader would populate the
collection but fail that probe (false empty-state); symlinks are fragile under npm-workspace
hoisting + Cloudflare builds. So real copied files are the robust choice, and gitignoring
them keeps this directory the only editable source.

## Consumers

- `architect-reference` (cert) — first consumer; routes on.
- `handbook`, `agentic-systems-design` — opt in later (add `sync:glossary` to their
  pre-chains + `routes: { glossary: true, flashcards: true }`).
