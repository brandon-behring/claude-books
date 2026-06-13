# Glossary infra — shared term layer (v1 = cert vocabulary)

> **Status (2026-06-13): EXECUTING.** Plan approved (4 one-question rounds). Repo at start:
> `main` clean + pushed at `c6b3301` (cert track Sprints 1+2 done; bank = 75 q, cert-audit
> 14/14). ROADMAP Horizon-2 committed-first content item; no external blocker.

## Context

The glossary is the series' **shared, deep-linkable term layer — not a read-through book**
(`docs/BOOK-MAP.md` §"Glossary = shared infrastructure"): canonical one-paragraph
definitions + breadcrumb cross-links, serving the whole series. The cert book's `/glossary`
+ `/flashcards` routes were deliberately held OFF *"until the shared glossary layer is
authored"* (`architect-reference/astro.config.mjs:38`) — **this sprint is that trigger**,
and it closes the Sprint-1 flashcards deferral (the deck derives from the `glossary`
collection, not the question bank).

**Two recon findings** reshaped the original ROADMAP premise:
- **A.** `<Term>` links are **root-relative / in-book only** (`components/Term.astro:21`)
  → "shared across 3 Astro apps" requires per-book copies from a canonical source, not one
  page all books link at.
- **B.** The dossiers' `agent_index/` dirs hold **no structured glossary sections** (topic
  summaries only) → v1 terms come from the cert book's own vocabulary, not a dossier harvest.

## Locked decisions (user, 2026-06-13, one-question rounds)

1. **Topology — shared canonical source + sync now.** A `glossary/` source layer is the
   single source of truth; cert is its first consumer. (Over "cert-local, promotable" and
   "standalone glossary site".) *Rationale:* do the shared infra once, correctly; the
   `<Term>` in-book constraint (Finding A) makes per-book copies the only way to keep inline
   links working across the series.
2. **Sync model — gitignored generated copies.** A `sync-glossary` step in a consumer's
   prebuild copies canonical terms into its `src/content/glossary/`; the copies are
   gitignored build artifacts. (Over committed copies / symlinks.) *Rationale:* copies
   physically cannot drift from the source; clean diffs. Copy itself is forced — the
   scaffold's `/glossary` + `/flashcards` pages hard-probe
   `import.meta.glob('/src/content/glossary/**')`, so real files must exist at build (a
   loader bypasses the probe → false empty-state; symlinks fragile under workspace hoisting +
   Cloudflare).
3. **Term source — the cert book's own vocabulary.** Terms the 30 chapters use/define,
   canonical one-paragraph defs, tagged with `domain` (D1–D5) + `see` cross-links. (Over a
   top-down CCA-F taxonomy / a broad dossier+books harvest.) *Rationale:* tightest fit to the
   one live consumer, no orphan terms, honors the self-contained promise; `domain`/`see` make
   it promotable to the whole-series layer later.
4. **Scope — ship the standable layer, defer the retrofit.** Deliver source + sync + term
   bank + `/glossary` + `/flashcards` + audit gate. The inline `<Term>` retrofit into the 30
   chapters is a tracked follow-up. *Rationale:* keeps the sprint bounded and avoids churning
   settled, audited Round-2 prose; `<Term>` ids aren't render-validated, so a mass retrofit
   is best done as its own reviewed pass.

**Folded without asking (no real fork):** all term bodies are MDX (scaffold contract — body
= definition) · authoring reuses the proven Sprint-1/2 fan-out · Opus authors AND reviews
(*Fable 5 remains access-gated at runtime — do not re-attempt unless the user confirms it's
back*, Sprint-2 lesson) · new **cert-audit Check 15** as a permanent regression gate (same
move as Sprint-1 Check 9 / Sprint-2 Check 14) · wire **only cert** now (sole consumer
flipping routes on); handbook + agentic-systems-design opt in later with a one-line prebuild
addition (infra + gitignore already cover them).

## Scaffold contract (^4.23, confirmed — build *to* it)

- `glossary` collection auto-registers when `src/content/glossary/` exists (presence-gated,
  via `defineBookSchemas()`); schema = `schemas.ts:548 glossarySchema` (`.strict()`):
  `term` (req) · `aliases`/`see`/`tags` (default `[]`) · `domain` (optional) · `draft`
  (false). **MDX body = the definition.** Entry `id` = filename slug.
- `/glossary` (`pages/glossary.astro`) sorts alphabetically (locale-aware), anchors
  `#term-<id>`, shows `aliases` + a "See also" line from `see`; Pagefind indexes it.
  `/flashcards` (`pages/flashcards.astro`) derives front=term/back=def from the same
  collection. Both presence-gated (twin-gate: route flag + dir present).
- `<Term id="x">…</Term>` → `/glossary#term-x`; in-book only; ids not render-validated.

## Infra design (exact)

- **Canonical source** (committed): `glossary/terms/*.mdx` + `glossary/README.md` (contract).
  Plain repo-root dir — *not* an npm workspace yet (promote only on a real build/deploy
  trigger).
- **Sync script** `scripts/sync-glossary.mjs` (Node, no deps; REPO_ROOT from
  `import.meta.url` like `cert-audit.mjs`): `node scripts/sync-glossary.mjs <book>` does an
  idempotent **clean-and-copy** of `glossary/terms/**.{md,mdx}` → `<book>/src/content/
  glossary/` (clean first so deleted source terms don't linger).
- **Cert wiring** (`architect-reference/package.json`): add
  `"sync:glossary": "node ../scripts/sync-glossary.mjs architect-reference"`; chain it into
  **both** `predev` and `prebuild` (npm runs `pre<script>`; dev must sync too).
- **Routes** (`architect-reference/astro.config.mjs`): `routes:` → add `glossary: true,
  flashcards: true`.
- **.gitignore**: add `*/src/content/glossary/` (matches the 3 book copies; not the canonical
  `glossary/terms/`).

## Term bank — authoring pipeline (proven Sprint-1/2 fan-out)

1. **Pattern** — hand-author ~4–5 canonical term files (lock frontmatter + one-paragraph MDX
   def + `see` links). Sync + build → verify `/glossary`, `/flashcards`, a `<Term>` smoke test.
2. **Harvest** (fan-out, 1 agent/chapter, grounding-isolated) — each chapter's core terms +
   one-line gloss + domain.
3. **Dedup/merge** (**barrier**) — canonical unique set (terms recur); primary `domain`
   (most-central chapter) + `see` candidates.
4. **Author** (fan-out, Opus) — defs grounded only in the chapters using each term. Count
   emergent (~50–70 unique; floor: every chapter's core concept covered). No false-precision quota.
5. **Mechanical verify** — schema validity, unique ids, every `see:` resolves, sync + build green.
6. **Review** (fan-out, Opus, adversarial) — def accuracy vs usage, `see` integrity, dedup
   correctness. Apply fixes; merge/strike.

## Audit gate — `cert-audit.mjs` Check 15 (glossary integrity)

Reads the **canonical** `glossary/terms/` (committed, always present).
- **FAIL**: source empty while cert `routes.glossary: true`; invalid frontmatter (missing
  `term` / unknown strict key); any `see:` id with no matching entry; `domain` present but
  ∉ `examDomains`.
- **Dormant-but-ready**: every `<Term id>` in chapters resolves to a bank entry (trivially
  passes now; guards the retrofit follow-up).
- Negative-test it bites; run 15/15 green.

## Execution steps + commits (git pattern; **push only on user's word**)

1. Plan doc (this file). `docs(plans):`
2. Infra: `glossary/terms/` + README, `scripts/sync-glossary.mjs`, `.gitignore`, cert
   predev/prebuild + routes; verify empty-state. `feat(glossary): canonical source + sync + cert routes`
3. Pattern terms (pipeline 1). `feat(glossary): pattern term set`
4. Bank (pipeline 2–6). `feat(glossary): cert-vocabulary term bank (~N terms)`
5. Check 15. `feat(architect-reference): cert-audit Check 15 — glossary integrity`
6. End-to-end verify + records + follow-up issue. Closeout `docs:`.

## Verification (end-to-end)

- `cd architect-reference && npm run build` green (prebuild: sync → validate → astro build → pagefind).
- `npm run dev`: `/glossary` alphabetical + Pagefind search hits a term; `/flashcards` flips +
  buckets persist; no-JS fallback reads as a list.
- `npm run validate` clean; `cert-audit.mjs` Check 15 green + negative-tested; 15/15.
- Regression: `/practice-exam`, `/assessment`, `/answers`, `<ObjectiveMap>` unaffected (75-q intact).
- `git status`: each book's `src/content/glossary/` ignored (generated); only `glossary/terms/`,
  the script, config, audit, docs committed.

## Deferred (tracked)

- Inline `<Term>` retrofit across 30 chapters → new `tracked` issue (Check 15's dormant clause guards it).
- Wiring handbook/design consumers (on deploy/port; infra + script ready).
- Promoting `glossary/` to a full npm workspace (only on an independent build/deploy trigger).

## Done =

`glossary/terms/` canonical bank (~50–70 cert-vocabulary terms, domain-tagged, `see`-linked)
→ synced (gitignored) into the cert book → `/glossary` + `/flashcards` live and verified →
validate + build green → cert-audit Check 15 green (15/15) → records reconciled, `<Term>`
retrofit filed.

---

## Decisions made (post-hoc log)

*(Filled during execution — deviations, surprises, fixes, final counts.)*

- _TBD_
