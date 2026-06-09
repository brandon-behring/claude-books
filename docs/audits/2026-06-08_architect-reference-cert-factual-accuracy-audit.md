# Architect's Reference — Factual-Accuracy + Freshness Audit (2026-06-08)

**Scope:** targeted re-verification of the cert book's *volatile* facts against **live Anthropic docs**
(the strict-live cache was captured 2026-05-22; **Opus 4.8 shipped 2026-05-28**, after it). The prior
[2026-06-02 independent review](./2026-06-02_architect-reference-cert-book-independent-review.md) verified
the stable/architectural chapters (technical-accuracy 4.37/5) and deferred freshness on the 10
feature-surface chapters — this audit closes that.

**Method:** baseline linter (`cert-audit.mjs` → 0 FAIL / 0 WARN); a 10-agent fan-out (one per
feature-surface chapter) verifying each volatile claim against its cited live source; a book-wide
model-version sweep (surfaced 3 more: D4.1, D5.1 (fixed); D3.4 verified clean). **Provenance tier:** *web-reconfirm*
(live WebFetch), distinct from a strict-live re-cache.

**Verdict: the book is behind, not wrong.** No load-bearing architecture is incorrect. Findings are
small drifts (counts that grew; the Opus 4.7→4.8 flagship cutover; a few mis-citations and two genuine
errors). **≈16 fixes across 11 chapters**; D3.3 + D3.4 re-verified clean (date-only).

**Review pass.** This run was itself checked by an independent adversarial review over the diff. It
caught a *fresh-but-wrong* claim the linter passed — a D2.4 MCP-RC "published" vs **locked** error
introduced during the fixes — prompting that correction plus the D2.3 `mcp_toolset` soften, the D3.6
"Foundry" trim, and these count corrections. **Lesson (now in the loop):** a `last_verified` stamp
requires an adversarial-correctness gate, not just a re-fetch + green linter — *fresh ≠ correct*. See
`docs/design/2026-06-08_curriculum-live-dossier-loop.md` §2–3.

---

## Findings by chapter (verdict · fix)

### Genuine errors (WRONG)
| Ch | Loc | Issue | Fix |
|---|---|---|---|
| **D3.6** CI/CD | `:136`, `:192` | "GitHub Actions supports **four providers** incl. **Microsoft Foundry**" — live github-actions page names **only three** (Anthropic, Bedrock, Vertex); "Foundry" / "four" absent. | Drop Foundry → "three providers; the two non-Anthropic via OIDC/WIF, no static keys." |
| **D3.2** Skills | `:99` | `name` field "lowercase letters, numbers, hyphens; **max 64 chars**" — not in live doc; live `name` = "display name, defaults to directory name" and the **directory** name (not `name`) sets the `/command`. | Replace the parenthetical with the live definition; drop the char-class/64-cap. |
| **D2.4** MCP | `:123`, `:126` | 2026-07-28 RC fact **mis-cited** to `mcp-spec-lifecycle` (the 2025-11-25 page, which doesn't contain it). RC is real + still "locked"/unpublished (so "release candidate" wording is correct). | Add source `mcp-rc-2026-07-28` (the RC blog) + cite it on the RC sentence; keep `mcp-spec-lifecycle` on the 2025-11-25 handshake half. |
| **D1.5** Hooks | `:64` | TS SDK hook-event count "**nineteen**" — live "Available hooks" table now lists **20** (Python still 10). | "nineteen" → "twenty" (or soften to "roughly twenty"). |

### Count / model drift (STALE)
| Ch | Loc | Issue | Fix |
|---|---|---|---|
| **D2.5** Built-in tools | `:56`, `:157` | "roughly **thirteen** tools, six categories" — live roster grew to **~14** (15 w/ `Monitor`); 6 categories still correct. | "thirteen" → "fourteen" (or "well over a dozen"). |
| **D2.4** MCP | `:54`, `:121`, `:167` | "**three** config `type` transports" — live doc documents a 4th, `ws`/WebSocket (`.mcp.json`/`add-json` only). "Three" is right only for `--transport` flag values. | Reframe: "three `--transport` flag values (`http`/`stdio`/`sse`); a fourth `type`, `ws`, is JSON-config-only." |
| **D4.3** Structured output | `:73`, `:121` | Code examples pin `model="claude-opus-4-7"`; live docs' examples use `claude-opus-4-8`. | → `claude-opus-4-8`. |
| **D4.5** Batch | `:81`, `:162` | `output-300k-2026-03-24` eligible-model list omits **Opus 4.8** (now listed first). | Add Opus 4.8 to the list. |
| **D5.6** Provenance | `:85`, `:141` | Reliable-cutoff trio names **Opus 4.7** as current; 4.7 is now **legacy**, **Opus 4.8** is flagship (reliable cutoff also **Jan 2026** — date carries). | "Opus 4.7" → "Opus 4.8". |
| **D5.1** Long context | `:51`, `:128` | "current windows 1M on **Opus 4.7** / Sonnet 4.6, 200k Haiku 4.5; Opus 4.7's tokenizer ~35% denser" — 4.7 now legacy. (1M + ~35% both still hold for 4.8: live tooltips Opus 4.8 ≈2.5M chars vs Sonnet ≈3.4M = ~36%.) | "Opus 4.7" → "Opus 4.8" (window + tokenizer); keep 1M/200k/~35%. |
| **D4.1** Explicit criteria | `:45`, `:60`, `:139` | Verbatim quote "Opus 4.7 interprets more literally **than 4.6**…" — live best-practices page now states it of **Opus 4.8** (absolute, not a 4.7-vs-4.6 comparison): *"Claude Opus 4.8 interprets prompts literally and explicitly, particularly at lower effort levels. It does not silently generalize… and it does not infer requests you didn't make."* | Update model + re-quote to the live 4.8 wording. Durable point unchanged. |

### Citation precision (STALE — fact right, source/wording off)
| Ch | Loc | Issue | Fix |
|---|---|---|---|
| **D3.6** | `:78` | `--json-schema` quote doesn't match cli-reference wording; `structured_output` field is on the headless page. | Re-quote to live cli-reference text; attribute `structured_output` to `claude-code-headless`. |
| **D3.6** | `:96` | "prefix matching" attributed to cli-reference; live wording is on `claude-code-headless`. | Drop the cli-reference cite there (keep headless). |
| **D3.6** | `:73` | "**The first**, `system/init`…" — now conditional (`plugin_install` events can precede it). | "Typically the first…". |
| **D4.3** | `:100` | Migration quote drifted: "during"→ live "**for** a transition period"; drops live "and beta headers are no longer required"; adds un-sourced "but you should migrate". | Reconcile to live verbatim (or de-quote to paraphrase). |
| **D2.3** | `:86` | `strict: true` "all tools except `mcp_toolset`" exception not in the 5 cited sources. | Add `anthropic-strict-tool-use` to `sources:` + verify, or soften to "a per-tool property". |

### Verified CLEAN (no fix)
- **D3.3** Rules/path-scoping — every claim (`.claude/rules/`, `paths`, same-priority-as-CLAUDE.md, load order, glob table, symlinks) verbatim-current.
- **D3.4** Plan mode — `opus`/`opusplan`/`opus[1m]` + "1M upgrade is `opus`-only, not `opusplan` (plan phase 200K)" match the live model-config doc verbatim.
- **D2.3** tool_choice — four modes, extended-thinking constraint, prefill behavior, cache invalidation all current (one low-pri citation, above).

---

## Cross-cutting: the Opus 4.7 → 4.8 cutover
Per the *refresh-current + date-stamp* policy. **Opus 4.8** (shipped 2026-05-28): 1M context (200k on
Foundry), 128k max output, **Jan-2026** training + reliable cutoff, adaptive thinking, $5/$25 MTok.
Opus 4.7 moved to **legacy**. Touch points: D4.3 (code IDs), D5.6 + D5.1 + D4.1 (flagship refs), D4.5
(beta-model list). **Still-true comparatives kept.** Chapters with **no hardcoded model ID** (D2.3,
D4.5 code, D3.6) need no change on this axis — good defensive authoring. New model **"Mythos Preview"**
(Project Glasswing, invite-only research-preview) appears in some lists; **not added** (preview/volatile,
not exam-relevant).

## Exam-era note
The CCA-F exam launched 2026-03-12 (pre-4.8); these refreshes are factual currency only — windows,
cutoffs, API shapes are **stable across 4.7→4.8**, so no divergence from likely exam-tested facts.

## Prior-audit open items (also folded into the fix pass)
- D4.2 / D5.6 misattributed `official` tags (synthesis tagged as verbatim) — citation-honesty.
- 3 uncached D1.1 sources (`building-effective-agents`, `building-agents-with-the-sdk`,
  `how-claude-code-works`) — capture into the manifest.

## Provenance actions (applied with the fixes)
- Bump `last_verified: 2026-06-08` on the 12 re-verified chapters.
- Manifest: add `mcp-rc-2026-07-28`; bump `captured_at`/add `last_reconfirmed: 2026-06-08` on the
  re-confirmed sources (web-reconfirm tier).
- Re-run `cert-audit.mjs` (incl. the new freshness Check 12) → expect 0 FAIL.
