# Research-sprint methodology — lessons & issues to upstream

A retrospective on the 2026-05-22 comprehensive research sprint that produced this `docs/research/` cache (118 notes, 17,465 lines across 10 topics). Each finding is structured for re-use: a description of what happened, the impact, and a concrete change to the next sprint's prompt or process.

This document is meant to be **copy-paste-able into upstream issues / skill definitions** for whatever maintains the research workflow.

## 1. Per-agent operating instructions should live in a shared file, not duplicated in every prompt

**Observation**: each of the 10 wave agents got ~700 words of identical preamble (per-file template, tier definitions, anti-patterns, enforcement, filename convention). The duplication consumed ~7,000 words of agent-prompt input that could have been one shared reference.

**Impact**: small drift between waves — minor differences in how agents interpreted the template (especially `cert_task_areas` phrasing and section-header annotation), and token waste.

**Issue to upstream**:
- **Title**: Research sprints should reference a shared `.operating-instructions.md` rather than inline the template in every agent prompt.
- **Fix**: Maintain one canonical operating-instructions file in the cache. Agent prompts include `Read /Users/X/docs/research/.operating-instructions.md as your operating manual` and only specify the topic + source list.
- **Verification**: prompt-length drops from ~700 words preamble + ~150 topic to ~80 words pointer + ~150 topic.

## 2. Canonical task-area phrasings need fuzzy matching at lint time

**Observation**: 22 of 118 notes had `cert_task_areas` values that the linter initially flagged as "not in canonical list" — but the values were semantically correct, just lexically shorter (e.g., "Session state" instead of "Session state (--resume, fork_session, scratchpads)") or differed in punctuation (backtick-wrapped flags vs bare).

**Impact**: false-positive lint failures masked the actual structural deviations (1 note that genuinely went off-template).

**Issue to upstream**:
- **Title**: `cert_task_areas` validator must use fuzzy matching (substring + normalization) against canonical phrasings.
- **Fix**: normalize both sides (strip backticks, quotes, `--` punctuation; lowercase; collapse whitespace); accept substring matches ≥10 chars in either direction. See `.lint.py` `_matches_canonical()`.
- **Verification**: linter reports drop from ~70 false flags to single-digit actual flags after fuzzy match.

## 3. Multi-line YAML values containing `:` MUST be quoted

**Observation**: 1 of 118 notes (`10-reliability-governance/incident-sandbox-bypass.md`) failed YAML parsing because `source_title: Even Claude agrees: hole in its sandbox...` contained an unquoted colon.

**Impact**: linter reported "no frontmatter" for an otherwise well-structured note. Without YAML-aware tooling, this would silently make a note invisible to any frontmatter-driven grep.

**Issue to upstream**:
- **Title**: Operating instructions must say: quote any `source_title` value that contains `:` or YAML reserved characters.
- **Fix**: add to operating instructions: *"`source_title` and any string value containing `:`, `#`, `[`, `{`, `}`, or newlines must be double-quoted. When in doubt, quote."*
- **Verification**: zero YAML-parse failures across the cache.

## 4. `cert_domains` must be a list of integers, not strings with `D` prefix

**Observation**: 20 of 118 notes (entire `05-claude-api/` topic) wrote `cert_domains: [D1, D4, D5]` instead of `cert_domains: [1, 4, 5]`. Both forms are intuitive (the `D` prefix matches how cert domains are referenced in prose), but inconsistency breaks frontmatter grep and any numeric processing.

**Impact**: the entire Claude API topic dossier was filterable only via string matching, not the documented integer convention. Required a mechanical sed fix.

**Issue to upstream**:
- **Title**: Operating instructions must show a concrete example for `cert_domains`: `[1, 4, 5]` NOT `[D1, D4, D5]`.
- **Fix**: add example to the template block — show the integer list form unambiguously. Add a linter rule (already in `.lint.py`) that flags string-with-D-prefix.
- **Verification**: linter passes for all notes; grep `cert_domains: \[.*D[1-5]` returns zero.

## 5. Per-agent tool-call budget must be reset per topic, not per session

**Observation**: the Wave 1 Academy agent crashed after 47 tool calls with `API Error: socket connection was closed unexpectedly`. The crash happened after 9 of 10 priority notes were written; the 10th (AI Fluency) + the topic README were missing. Recovery required inline writes by the parent agent.

**Impact**: ~80% of work succeeded; recovery added ~30 minutes of cleanup. Could have been worse if the crash had hit at note #2 instead of #10.

**Issue to upstream**:
- **Title**: For comprehensive research sprints, cap agent tool calls at ~25 and split large topics into multiple smaller agents.
- **Fix**: instead of one "Academy courses" agent with 10 sub-tasks (each requires WebFetch + Write = 2 calls minimum = 20 calls just for the happy path), dispatch two agents: "Academy: Claude Code track" and "Academy: API/MCP track". Each handles 4-5 courses within a safer 15-call budget.
- **Verification**: no agent crashes; if one does, only half the topic needs recovery.

## 6. Section headers should be tolerated with annotations

**Observation**: 2 of 118 notes added clarifying parentheticals to section headers — `## Key takeaways (multi-agent-relevant only)` and `## Key takeaways (from Simon's notes + The New Stack + InfoQ + DevOps.com)`. These are valuable annotations but broke a regex looking for `## Key takeaways\n`.

**Impact**: false negatives in the linter; the notes themselves were correct.

**Issue to upstream**:
- **Title**: Section-header regex must accept any text following the canonical heading.
- **Fix**: `## Key [Tt]akeaways?\b[^\n]*\n` instead of `## Key takeaways\n`. See `.lint.py` — already applied.
- **Verification**: parenthetical annotations no longer trigger false negatives.

## 7. Synthesis notes (without a primary source URL) deserve their own template

**Observation**: 1 note (`07-structured-output/blog-semantic-vs-schema-errors.md`) is a synthesis essay drawn from multiple cookbook + agent-SDK sources, not a per-source citation. It uses section headers like "## The error taxonomy" / "## What structured outputs eliminates" — sensible for synthesis, but the per-source template's "Key takeaways" + "Quoted (citation-ready)" sections didn't naturally fit.

**Impact**: this note doesn't follow the per-source template; the linter flagged it. The content is good but the structure deviated.

**Issue to upstream**:
- **Title**: Add a "synthesis note" template alongside the per-source template.
- **Fix**: define `tier: T1-synthesis` (or similar) for notes that consolidate multiple sources without one primary URL. Synthesis template still requires `cert_task_areas`, `cert_domains`, `volatility`, and at least 3 cited URLs in the body, but skips the per-source `source_url` requirement and uses topic-relevant section headers.
- **Verification**: synthesis notes lint clean under their own template; per-source notes lint clean under theirs.

## 8. Mid-wave review checkpoint is worth the time

**Observation**: the plan called for "between waves: brief review of intermediate output for gaps." The parent skipped this and dispatched Waves 2 and 3 without reviewing Wave 1 output. Both the D-prefix bug (which would have been caught after Wave 2's API agent) and the synthesis-note structure deviation (Wave 3) propagated to multiple notes before being caught at lint time.

**Impact**: more cleanup at the end vs catching drift after Wave 1.

**Issue to upstream**:
- **Title**: Between waves, run the linter on what's been written.
- **Fix**: enforce a mid-wave step: `python3 docs/research/.lint.py` after Wave N completes, before dispatching Wave N+1. If drift is detected, update operating instructions or correct templates before next dispatch.
- **Verification**: drift caught at Wave 1 affects only Wave 1 output, not the whole cache.

## 9. Dangling `[[link]]` references should be a hard error, not a footgun

**Observation**: 4 of 637 link references pointed to nonexistent slugs (3 of 4 were typos — `[[docs-security-review]]` instead of `[[news-security-review]]`; 1 was a directory link `[[03-advanced-tool-use]]` instead of a note slug; 1 was a forward reference to a never-written note). All caught via a 30-line crossref script.

**Impact**: low — books would catch these when actually following the links — but unprofessional.

**Issue to upstream**:
- **Title**: Add link-resolution to the linter and run it before the cache is declared "done."
- **Fix**: `.crossref.py` (already in place) walks all `[[slug]]` references and verifies each slug exists in the cache. Exit non-zero on any dangling reference. Make this a pre-commit hook or sprint-completion gate.
- **Verification**: `python3 .crossref.py` exits 0; no dangling references.

## 10. Volatility classification needs more guidance

**Observation**: 60% of notes were tagged `volatility: evolving`; only 31% `stable` and 9% `fast-moving`. Spot-checking suggests some notes tagged `evolving` are actually stable (spec sections, base-protocol mechanics that haven't changed in years). Agents defaulted to the middle category when uncertain.

**Impact**: the staleness banner (chapters render warnings on fast-moving content older than 30 days) is less precise — `evolving` is over-tagged, `stable` under-tagged.

**Issue to upstream**:
- **Title**: Define volatility with concrete examples in operating instructions.
- **Fix**: add to operating instructions —
  - `stable`: the source covers mechanisms / principles unlikely to change without a major version bump (e.g., MCP spec section, agent loop architecture, Claude API endpoint structure)
  - `evolving`: the source covers features that ship incremental updates regularly (e.g., docs pages that change with releases, SDK release notes)
  - `fast-moving`: the source is a beta feature, a release candidate, or has a known imminent change (e.g., MCP RC, computer-use beta, recent CVE advisories)
- **Verification**: spot-check a sample of `evolving` notes; expect 40-50% to reclassify to `stable` after the new definition.

## 11. T1 thinness on one cert domain (D4 multi-pass review) is a real coverage gap

**Observation**: every cert task area has ≥1 T1 backing note except **"Multi-instance / multi-pass review (independent reviewers, attention dilution)"** (D4). The only backing is 1 T3 note.

**Impact**: if the Architect's Reference covers this task area, it has no Anthropic-authored citation to cite.

**Issue to upstream**:
- **Title**: A follow-up T1 search pass is needed for D4 "multi-pass review" — likely covered in Anthropic engineering blog posts on code review or model-self-review.
- **Fix**: dispatch a small focused agent (~10 tool calls) to search Anthropic blog + docs for "multi-pass review," "independent reviewer," "attention dilution" — any direct primary source.
- **Verification**: at least 1 T1 note covers this task area.

## 12. Per-source citations in agents-as-research can drift from "is this Anthropic-authored?"

**Observation**: a couple of notes initially tier-classified the Anthropic Academy Skilljar pages as T1 because they're hosted on Anthropic infrastructure. The strict definition reserves T1 for Anthropic-authored docs / spec material; Academy pages are T2-release-notes.

**Impact**: minor drift; corrected before the final cache.

**Issue to upstream**:
- **Title**: Tier definitions need a worked example in operating instructions.
- **Fix**: add a table to operating instructions —
  - anthropic.com/docs/* → **T1-official**
  - anthropic.com/engineering/* → **T1-official**
  - anthropic.com/news/* → **T1-official**
  - claude.com/blog/* → **T1-official**
  - platform.claude.com/docs/* → **T1-official**
  - code.claude.com/docs/* → **T1-official**
  - docs.claude.com/* → **T1-official**
  - modelcontextprotocol.io/* + blog.modelcontextprotocol.io/* → **T1-official** (spec-authoritative)
  - **anthropic.skilljar.com/* → T2-release-notes** (Academy; Anthropic-managed but not spec/docs)
  - github.com/anthropics/* releases + README → **T2-release-notes**
  - everything else (Substack, dev.to, Medium, third-party blogs) → **T3-practitioner**
- **Verification**: random sample 20 notes; tier matches the table.

## Summary by severity

| # | Lesson | Severity | Status |
|---|---|---|---|
| 1 | Shared operating-instructions file | Medium | Open for next sprint |
| 2 | Fuzzy `cert_task_areas` matching | Low | Fixed in linter |
| 3 | Quote YAML values with `:` | High | Fixed in 1 note + operating instructions update needed |
| 4 | `cert_domains` integer-only | High | Fixed 20 notes + linter rule |
| 5 | Per-agent tool-call budget | High | Open for next sprint |
| 6 | Tolerant section-header regex | Low | Fixed in linter |
| 7 | Synthesis-note template | Medium | Open for next sprint |
| 8 | Mid-wave review checkpoint | Medium | Open for next sprint |
| 9 | Dangling `[[link]]` errors | Low | Fixed 4 links + crossref tool |
| 10 | Volatility definitions | Medium | Open for next sprint |
| 11 | D4 multi-pass review coverage gap | Medium | Follow-up agent recommended |
| 12 | Tier definitions worked example | Low | Operating instructions update needed |

## Implementation artifacts (in this directory)

- **`.lint.py`** — frontmatter linter; PyYAML-based; checks required fields, tier/volatility enums, cert_domains integer form, section headers, quote+anchor presence. Exits non-zero on any violation.
- **`.crossref.py`** — link-resolution + cert-task-area coverage check. Exits non-zero on any dangling `[[link]]` or zero-T1-backed cert task area.
- Both are CI-ready: run them in a GitHub Action to gate cache changes.

## Suggested upstream targets

If "research_toolkit" is:

- **A skill definition** in `~/.claude/skills/` — add a `RESEARCH-SPRINT.md` that bakes in these 12 lessons. Use the structure of `dossier-build` / `research-plan` skills as a template.
- **A separate repo** — file each lesson above as a GitHub issue using the title + fix as the body.
- **A documentation file** (this one) — that's already what's at hand; treat this file as the canonical "lessons learned" doc and reference it from any future sprint's plan.

If you can point at the actual target, I'll file these properly. Otherwise this doc is the persistent record.
