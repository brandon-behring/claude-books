---
source_url: https://github.com/anthropics/claude-agent-sdk-typescript
canonical_url: https://github.com/anthropics/claude-agent-sdk-typescript
source_title: anthropics/claude-agent-sdk-typescript (GitHub repo)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T2-release-notes
cert_domains: [1, 2]
cert_task_areas: ["Agentic loops", "Subagent invocation", "Agent SDK hooks", "MCP server config", "Session state"]
volatility: fast-moving
verified: true
supersedes: []
superseded_by: []
---

# `anthropics/claude-agent-sdk-typescript` — repo metadata + release cadence

The TypeScript Agent SDK package. Newer than the Python sibling (created Sept 2025 vs Python's June 2025) but faster-moving on version numbers because it bundles the Claude Code binary.

## Key takeaways

- **Repo**: [`anthropics/claude-agent-sdk-typescript`](https://github.com/anthropics/claude-agent-sdk-typescript)
- **Stars (2026-05-22)**: 1,454
- **License**: not declared in repo metadata (the overview page says use is governed by Anthropic Commercial Terms; per-component LICENSE files override)
- **Created**: 2025-09-27
- **Last push**: 2026-05-22 23:00 UTC
- **Default branch**: `main`
- **Current release**: **v0.3.149** (2026-05-22)
- **Release cadence**: ~daily during May 2026 — fast-moving.
- **npm**: `@anthropic-ai/claude-agent-sdk` (requires Node.js 18+).
- **Bundles a native Claude Code binary** for the host platform as an optional dependency — no separate CLI install required. Override path with `Options.pathToClaudeCodeExecutable`.

## Version-jump anomaly

The TS SDK jumped from `0.2.x` directly to `0.3.142` — there is no `0.3.0` through `0.3.141`. This is documented on [[docs-typescript-v2-preview-removed]]: "The package version jumped from 0.2.x directly to 0.3.142, so the removal version above and the install pin below describe the same boundary." 

- **To install the last V2-compatible release** (still has `unstable_v2_*` exports): `npm install @anthropic-ai/claude-agent-sdk@0.2`
- **v0.3.142+** drops the V2 session API.

## Recent release cadence (5 most recent)

| Tag | Published |
|---|---|
| `v0.3.149` | 2026-05-22 |
| `v0.3.148` | 2026-05-22 |
| `v0.3.147` | 2026-05-21 |
| `v0.3.146` | 2026-05-21 |
| `v0.3.145` | 2026-05-19 |

## Key facts the TS package surfaces vs Python

- **Bundled binary** (Python doesn't bundle the CLI; it relies on an installed Claude Code or auto-downloads on first run).
- **V2 session API existed then was removed** (Python never had it; `ClaudeSDKClient` is the conceptual equivalent).
- **More hook events** (19 vs Python's 10 — see [[docs-hooks-reference]]).
- **`auto` permission mode** (TS-only model-classifier mode; Python lacks it).
- **`Query` interface exposes ~17 runtime control methods** (`interrupt`, `setPermissionMode`, `setModel`, etc.) directly on the returned `query()` object. In Python these methods live on `ClaudeSDKClient` instead.
- **`startup()` pre-warming function** (Python lacks an explicit equivalent).
- **Default `effort: "high"`** (Python leaves `effort` unset).

## Cross-references

- See [[docs-typescript-reference]] for the API reference.
- See [[github-claude-agent-sdk-python]] for the sibling repo.
- See [[docs-typescript-v2-preview-removed]] for the V2 removal note tied to v0.3.142.

## Open questions / follow-ups

- The repo `licenseInfo` field returned `null` — the README + LICENSE files inside the repo likely contain a license declaration, but it's not surfaced in the `gh repo view` JSON. Worth a direct README check before any chapter quotes specific terms.
- TS release notes (changelog at `https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md`) are likely the source of truth for which specific version removed V2 — confirmed as 0.3.142 via the docs page, but the CHANGELOG entry would be definitive.
