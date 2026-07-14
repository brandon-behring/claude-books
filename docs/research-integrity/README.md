# Research integrity consumer layer

This repository is the consumer side of the research release contract. It
inventories every fixed `<Citation src="…">` and chapter-frontmatter `sources`
entry, joins them to dossier source candidates where possible, and pins the
result by SHA-256.

## Current state

Release `rr-20260714.1` is **blocked**.

- 1,064 inline citation occurrences and 405 frontmatter source declarations
  resolve against the four book manifests.
- 2,712 pending binding candidates preserve 2,394 dossier-source matches, 295
  citations without a dossier match, and 23 topic-level taxonomy targets.
- `consumer-bindings.jsonl` is empty because no claim-to-passage mapping has yet
  completed semantic adjudication.
- The pinned dossier snapshot is structurally validated but uses the provisional
  migration contract, not the toolkit's canonical v1 records.

A passing integrity check means paths, citations, generated artifacts, and
hashes agree. It does **not** mean claims are correct, current, semantically
entailed, reviewed, released, or safe to ingest into synthesis-KB.

## Files and ownership

| File | Meaning |
|---|---|
| `research-lock.json` | Toolkit ResearchLock-v1-shaped structural hash snapshot for `rr-20260714.1`. |
| `research-integrity/config.json` | Reproducible release inputs: repository/toolkit commits, dossier report digests, release identity, and scan scope. It is itself lock-pinned. |
| `research-integrity/citation-inventory.jsonl` | Deterministic inventory of fixed reader-facing citations and frontmatter declarations. |
| `research-integrity/consumer-binding-candidates.jsonl` | Discovery candidates only; `claim_id` must remain null. |
| `research-integrity/consumer-bindings.jsonl` | Canonical toolkit ConsumerBinding v1 records after human adjudication; currently empty. |
| `research-integrity/dossier-release.json` | Explicitly blocked upstream dossier pin and provenance. It is not a ResearchReleaseManifest. |
| `research-integrity/release-status.json` | Machine-readable blocking conditions and counts. |
| `research-integrity/schemas/` | Exact toolkit-v1 schemas used for lock and canonical-binding validation. |
| `research-integrity/upstream/` | Frozen migration candidates used to reproduce the join without sibling repositories. |

Generated artifacts are owned by `scripts/generate-research-integrity.py`.
Do not hand-edit the inventory, candidates, blocked dossier pin, status, or lock.
Canonical bindings are reviewer-owned and are never overwritten by generation.

## Commands

Install PyYAML, then run:

```bash
npm run research:generate
npm run research:validate
npm run research:test
```

CI runs validation and mutation tests whenever book Markdown/MDX, source
manifests, schemas, scripts, or integrity artifacts change. Content edits make
the committed inventory and content hashes stale until regeneration.

`python3 scripts/validate-research-integrity.py --require-release-ready` is the
authorization gate. It intentionally fails for `rr-20260714.1`.

## Promotion to an authorized release

Do not mark this release ready until all of the following are true:

1. The dossier corpus validates against toolkit schema version `1.0.0`.
2. Every material passage is bound to an adjudicated stable claim ID.
3. Every active binding validates against the bundled ConsumerBinding v1 schema
   and its content hash matches the current consumer file.
4. Freshness, rights, unresolved findings, and independent-review gates pass.
5. A standard ResearchReleaseManifest v1 contains real reviewer acceptance.
6. `dossier_release_sha256` is repinned to that standard release manifest.

Until then, downstream release and synthesis-KB preflight must reject this lock
even when the structural integrity validator passes.
