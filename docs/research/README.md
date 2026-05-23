# Research cache

Per-source primary-research notes for the `claude-books` three-volume series. Built during the 2026-05-22 research sprint per the approved plan ("Active execution plan: Research Sprint" in `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md`).

**120 notes · 10 topics**. D4 multi-pass-review T1 coverage gap closed 2026-05-23 with 2 additional T1 notes in `06-multi-agent-patterns/` (`docs-code-review.md`, `docs-best-practices-writer-reviewer.md`).

## Topics

| # | Topic | Dir | Notes | Status | Headline |
|---|---|---|---|---|---|
| 1 | Anthropic Academy courses | [01-academy-courses/](./01-academy-courses/) | 10 | ✅ | Per-course metadata for the 10 major Academy courses (T2 — Academy is Anthropic-managed, not primary spec) |
| 2 | MCP spec | [02-mcp-spec/](./02-mcp-spec/) | 19 | ✅ | Current `2025-11-25` spec per-section + `2026-07-28` RC breaking changes + governance (Agentic AI Foundation donation) |
| 3 | Advanced tool use | [03-advanced-tool-use/](./03-advanced-tool-use/) | 11 | ✅ | Tool Search Tool + Programmatic Tool Calling + Tool Use Examples + interface design principles |
| 4 | Claude Agent SDK | [04-agent-sdk/](./04-agent-sdk/) | 19 | ✅ | Python + TS API reference + hooks + sessions + subagents + permissions + skills (corrects landscape: TS=19 hooks, Python=10) |
| 5 | Claude API | [05-claude-api/](./05-claude-api/) | 10 | ✅ | Models · pricing · adaptive/extended thinking · batch · files · citations · streaming · computer use |
| 6 | Multi-agent patterns | [06-multi-agent-patterns/](./06-multi-agent-patterns/) | 8 | ✅ | Orchestrator-worker canon + when-not-to + Claude Managed Agents + Code Review fleet + Writer/Reviewer pattern |
| 7 | Structured output | [07-structured-output/](./07-structured-output/) | 9 | ✅ | Dedicated structured outputs API + `strict: true` tool use + validation/retry + schema design patterns |
| 8 | Claude Code internals | [08-claude-code-internals/](./08-claude-code-internals/) | 11 | ✅ | 29-hook CLI reference (corrects landscape: 29, not "~31") + plugins + skills + settings + permission modes |
| 9 | Headless / CI / automation | [09-headless-ci/](./09-headless-ci/) | 13 | ✅ | `claude -p` + GitHub Actions + GitLab CI + Scheduling (`/loop` / Routines / Desktop) + Code Review + Security Reviews + Channels |
| 10 | Reliability + governance + compliance | [10-reliability-governance/](./10-reliability-governance/) | 10 | ✅ | April 23 postmortem + 27-CVE GitHub-advisories timeline + 3 incident writeups + FedRAMP/IL5 + EU AI Act |

## Quick stats

| Metric | Value |
|---|---|
| Total notes | **118** |
| Total lines | **17,465** |
| T1-official (Anthropic/spec-authoritative) | **97** (82%) |
| T2-release-notes (Academy / GitHub releases) | **15** (13%) |
| T3-practitioner (third-party) | **6** (5%) |
| Volatility: stable | 36 (31%) |
| Volatility: evolving | 71 (60%) |
| Volatility: fast-moving | **11** (9%) — see below |

## Notes flagged `volatility: fast-moving` (re-verify if older than 30 days before chapter cites them)

- `02-mcp-spec/blog-rc-2026-07-28.md` — RC may shift before July 28 final pub
- `02-mcp-spec/spec-sampling.md`, `spec-tasks-experimental.md`, `spec-roots.md` — deprecation candidates in the RC's 12-month removal window
- `04-agent-sdk/github-claude-agent-sdk-python.md`, `github-claude-agent-sdk-typescript.md` — versioning ships frequently (Python `v0.2.86`; TS `v0.3.149` at snapshot)
- `05-claude-api/docs-adaptive-thinking.md` — effort-level mechanics evolving (Opus 4.7 added `xhigh`)
- `05-claude-api/docs-computer-use.md` — still beta; tool spec versioning shifts
- `09-headless-ci/docs-code-review.md`, `github-claude-code-action.md` — GA in May 2026 but feature set actively evolving
- `10-reliability-governance/advisories-claude-code-github.md` — security advisory feed; new CVEs every release

## Cert-domain coverage (Architect's Reference's primary thoroughness check)

Counts of notes that tag each cert domain (notes may tag multiple — totals exceed 118):

| Domain | Topic homes | Approximate note count |
|---|---|---|
| **D1** Agentic Architecture & Orchestration (27%) | 04 (SDK), 06 (multi-agent), 02 (MCP via Task tool), 08 (Claude Code subagents) | ~26 |
| **D2** Tool Design & MCP Integration (18%) | 02 (MCP spec), 03 (advanced tool use), 05 (API tool_use), 04 (SDK built-in tools), 07 (structured output) | ~45 — **best-covered domain** |
| **D3** Claude Code Configuration & Workflows (20%) | 08 (CC internals), 09 (headless/CI), 01 (CC-related courses) | ~42 |
| **D4** Prompt Engineering & Structured Output (20%) | 07 (structured output — primary), 05 (API thinking/batch), 01 (AI Fluency course), 03 (Tool Use Examples) | ~16 — **thinnest coverage; consider supplementing** |
| **D5** Context Management & Reliability (15%) | 10 (reliability/governance — primary), 04 (SDK sessions/fork), 06 (multi-agent error propagation), 08 (CC memory/compaction) | cross-cutting ~25 |

**Gap-check finding** (updated 2026-05-23): D4 has the lightest backing despite being 20% of the cert. The `07-structured-output/` topic does much of the heavy lifting (9 notes); the multi-pass review subarea was closed with 2 T1 notes in `06-multi-agent-patterns/`. Few-shot prompting and iterative-refinement could still absorb more dedicated coverage — especially given the Architect's Reference is the cert-prep candidate book.

## Corrections to `landscape-2026-05.md` surfaced by the sprint

Notes contributed verifications that the broader landscape sweep missed. Apply these to any chapter draft pulling from the landscape doc:

| Landscape claim | Corrected per sources in cache | Note that backs it |
|---|---|---|
| "Hook count ~31" | **CLI: 29 events; SDK Python: 10; SDK TypeScript: 19** | `08-claude-code-internals/docs-hooks.md`, `04-agent-sdk/docs-hooks-reference.md` |
| "TypeScript V2 send/stream preview" | **V2 was removed in v0.3.142 (not just a preview)** | `04-agent-sdk/docs-typescript-v2-preview-removed.md` |
| "Files API GA" | **Files API is still beta** (`files-api-2025-04-14` header) | `05-claude-api/docs-files-api.md` |
| "Batch API does not support multi-turn tool calling" | **Practical constraint is single-shot batched requests; docs say "all features except streaming"** — overstated phrasing | `05-claude-api/docs-batch-api.md` |
| "40% of multi-agent pilots fail within 6 months" (Augment Code) | **41–86.7% via MAST taxonomy (NeurIPS 2025)** — use MAST attribution | `10-reliability-governance/blog-augment-multi-agent-failure.md` |
| "EU AI Act penalty up to €40M or 7%" | **€35M / 7% (top tier), per Article 99** — €15M/3%, €7.5M/1% for lower tiers | `10-reliability-governance/news-eu-ai-act-article-99.md` |
| "Custom commands and skills are separate" | **Custom commands merged into skills — `.claude/commands/` legacy format works but `.claude/skills/<name>/SKILL.md` is the recommended path** | `08-claude-code-internals/docs-skills.md`, `docs-commands.md` |
| Elicitation/ElicitationResult described as "first-class hooks" | **CLI: first-class events; SDK: `Notification` subtypes + `onElicitation` Options field** | `04-agent-sdk/docs-hooks-reference.md`, `08-claude-code-internals/docs-hooks.md` |

The landscape doc itself (`docs/landscape-2026-05.md`) is not auto-updated — chapter drafts should consult notes in this cache for current values and treat the landscape doc as a frozen May 22 2026 broader-context snapshot.

## Frontmatter cleanup needed (low priority)

A few notes wrote `cert_domains` with `D` prefix (e.g., `[D4, D5]`) instead of the numeric convention (`[4, 5]`). Both grep cleanly, but normalization to numeric form would tighten the cache. Affected notes: small subset in `07-structured-output/` and one or two elsewhere. Defer to a future sweep.

## How to use this cache

- **For chapter drafts**: grep notes by `cert_domains`, `cert_task_areas`, `volatility`, or `tier` in frontmatter
- **For citations**: each note has ≥1 direct quote with an `Anchor:` line for fast spot-checks against the source
- **Cross-references**: notes use `[[slug]]` syntax — match the linked note's filename without the `.md` suffix
- **Refresh policy**: notes with `volatility: fast-moving` should be re-verified before being cited if `last_verified_at` is older than 30 days
- **Tier hygiene**: T1-official (Anthropic-authored or spec-authoritative); T2-release-notes (Academy course pages, GitHub releases for Anthropic repos); T3-practitioner (third-party). Convergence across third-party mirrors does NOT promote a citation to T1.

## Maintenance

- **Weekly cert tracking**: the existing `docs/cert-tracking.md` scheduled remote agent (cron `0 13 * * 1`) catches cert/Academy/Partner Network changes. Notes here are not auto-refreshed.
- **Per-source refresh**: to re-verify a single note, re-fetch its `canonical_url`, compare against the existing `Key takeaways` + `Quoted` blocks, update `last_verified_at`. If material change, set `supersedes` chain rather than overwrite.
- **Coverage gaps**: tracked per topic README's "Open questions for this topic" section. The D4 thin coverage flagged above is the highest-priority follow-up.

## Provenance

- **Plan**: `~/.claude/plans/this-repo-is-supposed-buzzing-eclipse.md` ("Active execution plan: Research Sprint")
- **Companion docs**: [`landscape-2026-05.md`](../landscape-2026-05.md) · [`cert-coverage.md`](../cert-coverage.md) · [`cert-tracking.md`](../cert-tracking.md) · [`scaffold-gaps.md`](../scaffold-gaps.md)
- **Sprint dispatched**: 2026-05-22 in 3 waves (Wave 1: Academy + MCP + Advanced tool use; Wave 2: SDK + API + Multi-agent; Wave 3: Structured output + Claude Code internals + Headless/CI + Reliability/governance). Wave 1 Academy agent crashed on a socket error after 9 of 10 priority notes; the 10th (AI Fluency) was written inline and the topic README was authored separately.
