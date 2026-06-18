# Source watch-map — what to monitor & how to find more

> **Purpose.** The program's **source-first** watch-map: the standing sources worth actively watching for evolving Claude/Anthropic **best practices, code samples, and direction**, each with *how to monitor it* + *how often* — plus a documented method for **finding new sources**. Companion to the topic-first [`taxonomy.graph.json`](./taxonomy.graph.json) + [`trajectories.md`](./trajectories.md) (which track *topics*, not sources). **Per-source last-checked/freshness lives in the dossiers' `bib_ledger.yml`** (`verified_at`/`stale_after_days`) — this map carries the *cadence*, not a per-row date.
>
> **This is a curated watch-map (~60 feeds), NOT an exhaustive dump.** The deduped full set lives in the research-kb: `~/Claude/research-kb/composed/wave7_source_registry.yml` holds **179** sources; the **203** non-YouTube figure is the count *after* merging the 23 dossier ledgers + 3 book manifests (`~/Claude/_srcmap_work/sources_consolidated.md`). Per-topic depth → each dossier's `bib_ledger.yml`.
>
> **Last refreshed:** 2026-06-17 (tri-engine audited — see footer). **Legend — Yields:** best-practice · code · direction · reference · release-notes. **`[feed]`** = a real RSS/Atom or GitHub-releases feed (machine-pollable → wireable in the automation phase). **`poll`** = no feed; check the page (or its `.md` twin — verified working for docs pages, e.g. `…/overview.md` → `text/markdown`).

## A · Anthropic standing feeds (T1)

| Source | Yields | Monitor | Cadence |
|---|---|---|---|
| **Engineering blog** — anthropic.com/engineering | best-practice, direction | `poll` (no official RSS; unofficial community mirrors = convenience only) | ~1–4/mo |
| **Newsroom** — anthropic.com/news | direction, reference (model launches, programs, policy) | `poll` | **weekly** (several/wk) |
| **Claude blog** — claude.com/blog | best-practice, direction (Agent SDK, subagents, code-review, large-codebases — cited across 5 dossiers) | `poll` | ~weekly |
| **Platform/API docs** — platform.claude.com/docs *(legacy docs.claude.com → redirect)* | reference, best-practice | `poll` per-page `.md` twin; use release-notes (below) as the change signal | continuous |
| **Claude Code docs** — code.claude.com/docs *(legacy docs.anthropic.com/.../claude-code → redirect)* | reference, best-practice | `poll` `.md` twin | continuous |
| **Platform release-notes** — platform.claude.com/docs/en/release-notes/overview | release-notes, reference | `poll` page / `.md` twin (dated `###` entries) | **weekly** (multiple/wk) |
| **Claude Code changelog** — code.claude.com/docs/en/changelog *(src: anthropics/claude-code CHANGELOG.md)* | release-notes | **`[feed]`** github.com/anthropics/claude-code/releases.atom | very high (multiple/day) |
| **Anthropic Academy** — anthropic.com/learn · catalog anthropic.skilljar.com | best-practice, direction | `poll` catalog | quarterly |
| **Model overview / cards** — platform.claude.com/docs/en/about-claude/models/overview · /system-cards | reference (**knowledge cutoffs, model IDs, deprecations**) | `poll` `.md` twin (verified `text/markdown`) | per launch (~monthly in 2026) |

## B · Anthropic code & samples (T1 · code) — *previously untracked; the program's biggest source gap*

GitHub exposes a commit feed (`<repo>/commits/main.atom`) and releases feed (`<repo>/releases.atom`) for **every** repo. All verified live 2026-06-17 (none archived).

| Repo | Contains | Monitor (feed) |
|---|---|---|
| **anthropics/claude-cookbooks** *(was anthropic-cookbook)* | recipes: vision, RAG, evals, PDF, tool-use | `commits/main.atom` |
| **anthropics/claude-quickstarts** *(was anthropic-quickstarts)* | deployable starter apps (support agent, computer-use, agent-SDK coder) | `commits/main.atom` |
| **anthropics/claude-agent-sdk-python** · **anthropics/claude-agent-sdk-typescript** · **anthropics/claude-agent-sdk-demos** | Agent SDK + `examples/` (demos = fuller apps) | SDKs: `releases.atom`; demos: `commits/main.atom` |
| **anthropics/claude-code-action** | the official GitHub Action wrapping Claude Code (CI usage) | `releases.atom` |
| **anthropics/skills** | public **Agent Skills** (SKILL.md examples; CC plugin marketplace) | `commits/main.atom` |
| **anthropics/claude-plugins-official** · **anthropics/knowledge-work-plugins** | official Claude Code / Cowork **plugins** | `commits/main.atom` |
| **anthropics/anthropic-sdk-python** · **anthropics/anthropic-sdk-typescript** | API SDKs (reference) | `releases.atom` |

*Code-w/-Claude workshop repos: no dedicated public repo confirmed — content folds into cookbooks/quickstarts. Watch the `github.com/orgs/anthropics/repositories` listing for new repos (see Discovery).*

## C · Channels (T1 + T2 · direction) — the freshest direction signal (staff + partners on what's working)

Per the youtube_talks dossier the corpus is **mixed: T1=87 (Anthropic staff) / T2=47 (partner / customer / Problem-Solvers interviews)** — tier at item level on import, not at the channel.

| Channel | Monitor (uploads Atom **`[feed]`**) |
|---|---|
| **@anthropic-ai** (primary: launches, talks, demos) | youtube.com/feeds/videos.xml?channel_id=**UCrDwWp7EBBv4NwvScIpBDOA** |
| **@claude** (product / "problem solvers" interviews) | youtube.com/feeds/videos.xml?channel_id=**UCV03SRZXJEz-hchIAogeJOg** |

*UC IDs verified 2026-06-17 via feed content (resolve to "Anthropic" / "Claude"). Deep capture = the `~/Claude/research_agent_youtube_talks/` dossier (134 talks); re-harvest is its freshness pass.*

## D · Partner / cloud / frameworks (T2)

| Source | Monitor |
|---|---|
| **Claude on Bedrock** — platform.claude.com/docs/.../claude-in-amazon-bedrock · aws.amazon.com/bedrock/anthropic | `poll` (+ AWS What's-New feed) |
| **Claude on Vertex AI** — platform.claude.com/docs/.../claude-on-vertex-ai · cloud.google.com/.../partner-models/claude | `poll` (+ GCP release-notes) |
| **Claude in Microsoft Foundry** — platform.claude.com/docs/.../claude-in-microsoft-foundry · code.claude.com/docs/en/microsoft-foundry | `poll` |
| **LangChain / LangGraph** — docs.langchain.com (orchestration; topology names + context-engineering are load-bearing; APIs **in flux at LC 1.0**; recurs across **5 dossiers**) | `poll` docs + **`[feed]`** github.com/langchain-ai/langchain/releases.atom |

## E · MCP / protocol ecosystem

| Source | Yields | Monitor |
|---|---|---|
| MCP **registry** — registry.modelcontextprotocol.io | reference (live server listings) | REST API `/v0.1/servers` |
| registry **repo** — github.com/modelcontextprotocol/registry | reference | **`[feed]`** `releases.atom` |
| reference **servers** — github.com/modelcontextprotocol/servers | code | **`[feed]`** `commits/main.atom` |
| MCP **spec/docs** — modelcontextprotocol.io | reference | `poll` (spec revisions) |
| MCP **blog** — blog.modelcontextprotocol.io | direction (spec RCs; flags the 2026-07-28 RC) | **`[feed]`** `/index.xml` |
| **AAIF** (MCP governance, Linux Foundation) — aaif.io | direction | `poll` project page |

## F · Research / papers (T3)

| Source | Yields | Monitor |
|---|---|---|
| **arXiv cs.CL** (also cs.AI / cs.SE) — the evidence base for context-rot, long-context, memory, security, evals (35 papers across 7 dossiers) | reference | **`[feed]`** rss.arxiv.org/rss/cs.CL |
| **Anthropic research** — anthropic.com/research | direction, reference | `poll` |

## G · Practitioner / independent (T3)

| Source | Monitor |
|---|---|
| **Simon Willison** — Anthropic tag (highest signal; links primaries) | **`[feed]`** simonwillison.net/tags/anthropic.atom |
| **HumanLayer** (humanlayer.dev), **Manus** (manus.im), **Mitchell Hashimoto** (mitchellh.com), **Latent.Space** (latent.space), **Martin Fowler** (martinfowler.com), **OWASP GenAI** (genai.owasp.org) | `poll` — recurring across the dossiers; per-topic depth in their `bib_ledger.yml` |
| ClaudeLog · Releasebot/anthropic | `poll` — cross-checks, not primaries |

## H · Ops & product surfaces (T1/T2)

| Source | Yields | Monitor |
|---|---|---|
| **Status / incidents** — status.anthropic.com | reference (outages, postmortems) | **`[feed]`** status.anthropic.com/history.atom |
| **Trust center** — trust.anthropic.com | reference (security/compliance posture) | `poll` |
| **Pricing** — anthropic.com/pricing | reference (cost) | `poll` |
| **Consumer-app release-notes** — support.claude.com/.../release-notes | release-notes (Claude.ai/desktop/mobile) | `poll` |
| **Connectors** — claude.com/connectors | reference (ecosystem breadth; baseline 398) | `poll` |
| **Cert / courses** — the certification + course pages (current URLs live in [`cert-tracking.md`](../cert-tracking.md); the standalone paths move) | reference | **already watched weekly by `cert-tracking.md`** |
| **Community** — Anthropic Developer Discord (discord.gg/anthropic) | direction (early signal) | manual |

## I · Depth (exhaustive, per-topic — don't re-dump here)
- `~/Claude/research-kb/composed/wave7_source_registry.yml` — **179** deduped sources (cite-counts, shared-source flags); `~/Claude/_srcmap_work/sources_consolidated.md` — the 203-source merged consolidation.
- `~/Claude/research_agent_*/bib_ledger.yml` — authoritative per-source `tier`/`stale_after_days`/`verified_at` (the real last-checked clock).
- `docs/research/` — 11 per-topic source caches.

## High-value canon (heavily cited → keep warm)
**anthropic.com/engineering** (15 dossiers — `building-effective-agents` 7×, `effective-context-engineering` & `multi-agent-research-system` 5× each), **code.claude.com** (13 dossiers; `best-practices` + `settings` 5× each), **platform.claude.com**, **claude.com/blog**, the **MCP spec** (9 pages) + **MCP blog RC** (hot through 2026-07-28), **agents.md** (3×), arXiv *Lost in the Middle* (3×), and the **134-talk YouTube corpus**. (21 sources are shared by ≥2 dossiers.)

## Discovery method — how to find NEW sources
- **New Anthropic surfaces:** the Claude Code `releases.atom`, Newsroom + Platform release-notes, the two channel uploads feeds, the **`github.com/orgs/anthropics/repositories` listing** (new repos = new sample/tool surfaces), docs `.md`-twin diffs, model-overview, new **Code w/ Claude** conference playlists.
- **Research / ecosystem:** arXiv `cs.CL`/`cs.AI`/`cs.SE` RSS; the MCP blog RSS + registry; AAIF working-group activity; cloud-partner release feeds (AWS What's-New, GCP/Azure release-notes).
- **Practitioner:** Simon Willison's Atom; targeted HN / X / Reddit + the Anthropic Discord; the dossiers' `gather_trace.yml` escalations; the `/topic-discovery` skill (→ `topic-backlog.yml`).
- **Vet → tier → add:** classify T1 (Anthropic official) / T2 (partner / release-notes) / T3 (practitioner/papers); add the source here **and** into the relevant dossier's `bib_ledger.yml` (gives it strict-live freshness tracking). *(Competitor-lab signals — OpenAI/Google — are out of scope for this Anthropic-direction map; track separately if/when needed.)*

## Cadence policy (reuses the `stale_after`/`freshness_tier` conventions + the [`cert-tracking.md`](../cert-tracking.md) weekly-diff pattern)
- **Weekly / feed-driven (cheap):** Claude Code changelog, the channel uploads, MCP blog + registry/servers feeds, arXiv RSS, Simon Willison, status incidents — all `[feed]`. **Plus the high-churn polls: Newsroom + Platform release-notes** (multiple/wk — *not* monthly).
- **Monthly poll:** Engineering blog, Claude blog, model overview, the code repos (or on-release).
- **Quarterly:** Academy *catalog*, partner-cloud hubs, trust/pricing, practitioner sweep. *(Cert/course pages are already weekly via `cert-tracking.md` — distinct from the low-churn Academy catalog.)*
- **Per model launch:** model overview/cards (knowledge cutoffs — the cert book's D5.6 table depends on this).
- **Automation = deferred next phase:** a `/schedule` cloud agent wiring the `[feed]`-marked sources + reviving the dormant cert-tracking agent + the ROADMAP freshness heartbeat. This file is the spec it would consume.

---
*Built 2026-06-17 (consolidating `wave7_source_registry.yml` + 23 dossier `bib_ledger.yml`s + 3 book manifests + `cert-tracking.md` + `landscape-2026-05.md`, plus a live discovery pass; drafts in `~/Claude/_srcmap_work/`). **Tri-engine audited 2026-06-17** (Codex + Gemini + Claude → `~/Claude/_srcmap_work/_audit/srcmap_audit_report.md`): fixed a wave7 count error, added arXiv/papers + LangChain + ops/product surfaces + `claude.com/blog`, resolved a cadence contradiction, re-tiered the channels. Source-first watch-map; topic momentum stays in `trajectories.md`; per-source freshness in the dossiers' `bib_ledger.yml`.*
