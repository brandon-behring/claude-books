# Claude Code / Agentic Coding Landscape — May 2026

**Snapshot date**: 2026-05-22. **Author**: research compiled by Claude Opus 4.7 (1M ctx) from primary sources + verifiable third-party reporting.

A comprehensive picture of the Anthropic stack, the MCP ecosystem, the competitive landscape, and production-pattern reality as of this date — meant to inform every chapter outline across the handbook, architect-reference, and field-guide. Unverified claims are flagged inline with `(unverified)`. Cite this snapshot as the basis for chapter content; refresh quarterly or when major events trigger material change.

---

## Executive summary

**For the handbook** (how to *use* Claude): the model lineup, command set, hook system, and IDE integrations have all expanded materially in the last 90 days. Opus 4.7 (1M context, Jan 2026 cutoff) uses **adaptive thinking**, not the old extended-thinking block API. The hook count is now ~31 lifecycle events (was 25 in v2.9). Claude Code's IDE integrations are native in VS Code and JetBrains; mobile (Web sessions + Remote Agents) shipped. Chapters touching prompting, context, hooks, IDE, automation, and enterprise all need refresh.

**For the architect-reference** (how to *design* Claude-powered systems): canonical reference architectures now exist as Anthropic primary sources — [multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system), [when (not) to use multi-agent](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them), [advanced tool use (Tool Search Tool + Programmatic Tool Calling + Tool Use Examples)](https://www.anthropic.com/engineering/advanced-tool-use), [April 23 postmortem](https://www.anthropic.com/engineering/april-23-postmortem). MCP is the cross-provider standard (donated to the Agentic AI Foundation; adopted by OpenAI + Google). The MCP **2026-07-28 RC has breaking changes**; the book needs to track the migration window (closes July 28).

**For the field-guide** (what teams actually *did*): real-world deployment data is now abundant. Deloitte (470K employees), KPMG (276K), PwC (30K cert target), Mercado Libre (23K engineers targeting 90% autonomous coding by Q3). 40% of multi-agent pilots fail within 6 months. The Anthropic April 23 postmortem documents three production bugs that ran for weeks. Source-map leak (Mar 31), deeplink RCE (May 12), and a 130-version sandbox bypass were all disclosed. The empirical book has rich material to update.

---

## 1. Anthropic stack: current state

### 1.1 Models (verified via [models overview](https://platform.claude.com/docs/en/about-claude/models/overview))

| Model | API ID | Context | Max output | Knowledge cutoff | Adaptive thinking | Extended thinking | Pricing (per MTok in/out) |
|---|---|---|---|---|---|---|---|
| **Opus 4.7** | `claude-opus-4-7` | 1M | 128k | Jan 2026 | ✅ | ❌ | $5 / $25 |
| **Sonnet 4.6** | `claude-sonnet-4-6` | 1M | 64k | Aug 2025 | ✅ | ✅ | $3 / $15 |
| **Haiku 4.5** | `claude-haiku-4-5` | 200k | 64k | Feb 2025 | ❌ | ✅ | $1 / $5 |
| **Claude Mythos Preview** | invitation-only | — | — | — | — | — | research preview (Project Glasswing — defensive cybersecurity) |

**Critical distinction**: Opus 4.7 supports *adaptive* thinking (model decides thinking budget) but **not** the legacy extended-thinking block API. Sonnet 4.6 supports both. Haiku 4.5 supports only extended thinking.

**Opus 4.7 effort levels**: `low` / `medium` / `high` / `xhigh` / `max` (`xhigh` is new). Other models: `low` / `medium` / `high` / `max`.

**Legacy models still available** (per [models overview](https://platform.claude.com/docs/en/about-claude/models/overview)): Opus 4.6, Sonnet 4.5, Opus 4.5, Opus 4.1. **Deprecated and retiring 2026-06-15**: `claude-sonnet-4-20250514`, `claude-opus-4-20250514`.

**Tokenizer note**: Opus 4.7 uses a new tokenizer (~555K words / 1M tokens), different from prior models' density (~750K words / 1M for Sonnet 4.6). This matters when comparing context budgets across model generations.

### 1.2 Pricing

- **Base** (above).
- **Prompt caching**: writes at 1.25× (5-min cache) or 2× (1-hour cache); reads at 0.1× base.
- **Batch API**: 50% discount across all tiers; 24-hour SLA; **does not support multi-turn tool calling**.
- **Fast mode (beta)**: 6× standard rates (Opus 4.7: $30 in / $150 out); not available on Batch or Claude Platform on AWS.
- **Data residency US-only**: 1.1× multiplier (`inference_geo: "us"`).
- **Web search**: $10 per 1,000 searches; web fetch: free (token cost only).

### 1.3 Claude Code product (CLI + Desktop + IDE + Mobile)

**Commands confirmed current** (per Code w/ Claude SF 2026 + [docs](https://code.claude.com/docs/en/model-config)):
`/model`, `/effort`, `/compact`, `/memory`, `/clear`, `/rewind`, `/init`, `/status`, `/btw`, `/slash` (custom), plus skill-shortcut commands.

**Plan mode**: Shift+Tab in Claude Desktop; experimental in CLI.

**Hook lifecycle events**: ~31 total (up from 25 in v2.9 sources). Notable additions since the LaTeX-era doc: `PostToolBatch`, `PermissionRequest`, `PermissionDenied`, `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `Elicitation`, `ElicitationResult`, `WorktreeCreate`, `WorktreeRemove`, `TeammateIdle`. PostToolUse/PostToolUseFailure now include `duration_ms`.

**Settings hierarchy** (unchanged): Managed > CLI > Local > Project > User. New managed-only setting: `availableModels` allowlist (Apr 23).

**Surfaces shipped or expanded recently** (Code w/ Claude SF 2026, May 6):
- **Desktop app** — full-screen GUI, rich output preview, native window
- **Claude Code Channels** — Telegram/Discord/iMessage front-ends to a local Claude Code session via MCP (positioned vs OpenClaw); shipped Mar 20 ([VentureBeat](https://venturebeat.com/orchestration/anthropic-just-shipped-an-openclaw-killer-called-claude-code-channels))
- **Code Review tool** — used org-wide at Anthropic
- **CI auto-fix** — automated PR corrections
- **Security Reviews** — automated vulnerability detection
- **Remote Agents** — laptop control via phone
- **Rate limits doubled** for Pro/Max/Enterprise; SpaceX/Colossus compute partnership
- **17× API volume YoY** (reported at Code w/ Claude SF)

**Claude Managed Agents** (GA at Code w/ Claude SF):
- **Multiagent Orchestration** — managed coordinator/subagent fleets
- **Outcomes** — declarative success criteria with iterative improvement
- **Dreaming** (research preview) — cross-session memory; agents review prior sessions and self-improve via memory artifacts
- Launch customers: Notion, Rakuten, Asana, Sentry, Atlassian
- ServiceNow rolling Claude Code across 29K+ employees

### 1.4 Claude Agent SDK

**Note**: formerly "Claude Code SDK"; renamed to reflect broader agentic scope.

**Languages**: `claude-agent-sdk` (Python) and `@anthropic-ai/claude-agent-sdk` (TypeScript, with optional bundled Claude Code binary).

**Key surfaces**:
- `query()` / `send()` + `stream()` (TypeScript V2 preview)
- `ClaudeAgentOptions`: `allowed_tools`, `hooks`, `agents` (subagent definitions), `mcp_servers`, `permission_mode`, `resume`
- **Built-in tools available to SDK consumers**: Read, Write, Edit, Bash, Monitor, Glob, Grep, WebSearch, WebFetch, AskUserQuestion, Agent (for spawning subagents)
- `setting_sources` (Python) / `settingSources` (TS) — controls whether skills/CLAUDE.md/hooks are discovered
- Hooks available to SDK: `PreToolUse`, `PostToolUse`, `SessionStart`, `SessionEnd`, `Stop`, `UserPromptSubmit`, `SubagentStart`, `SubagentStop`, `Elicitation`, `ElicitationResult`

**Pricing change inbound**: starting 2026-06-15, Agent SDK usage on subscription plans draws from a separate monthly "Agent SDK credit" allotment.

### 1.5 Claude API features

- **Tool use**: `tool_choice: "auto" | "any"` or forced (`{"type": "tool", "name": "..."}`); JSON schemas.
- **Extended thinking** (Sonnet 4.6, Haiku 4.5): explicit `thinking` block with budget; **deprecated approach for Opus 4.7+** which uses adaptive only.
- **Adaptive thinking** (Opus 4.7, Sonnet 4.6): model allocates thinking budget per turn based on task complexity + effort level. Documented at [Adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking).
- **Message Batches API**: 24-hour SLA, 50% discount, no multi-turn tool calling, `output-300k-2026-03-24` beta header enables up to 300k output tokens for Opus 4.7/4.6 and Sonnet 4.6.
- **Files API**, **Citations**, **Streaming**: all GA.
- **Computer use**: still beta, ~466-499 token overhead + 735 input tokens per model.

### 1.6 Recent product launches (last 90 days)

- **Claude Opus 4.7 GA** (Apr 16, 2026) — 1M context, adaptive thinking, hi-res vision (2576px)
- **Claude Design** (Apr 17) — visual outputs / prototypes (Anthropic Labs)
- **Agents for Financial Services** (May 5)
- **Claude for Small Business** (May 13) — connectors for QuickBooks, PayPal, HubSpot, Canva, Docusign, Google Workspace, Microsoft 365
- **Claude Cowork** — enterprise expansion beyond coding ([VentureBeat](https://venturebeat.com/orchestration/anthropic-says-claude-code-transformed-programming-now-claude-cowork-is): bid for "agent control plane")

---

## 2. Model Context Protocol (MCP)

### 2.1 Spec state

- **Ratified current**: `2025-11-25` ([modelcontextprotocol.io/specification/2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25))
- **Release candidate**: `2026-07-28` — RC locked May 21; final publication July 28. **Major breaking changes** below.
- **Governance**: MCP donated to the **Agentic AI Foundation** under Linux Foundation umbrella (Dec 2025, co-founded with Block and OpenAI). Working Groups + SEPs (specification enhancement proposals).
- **Adoption**: OpenAI added MCP via Apps SDK + Connectors (Q2 2025); Google added MCP to Gemini API + Vertex AI Agent Builder (Q1 2026). 67% of surveyed CTOs name MCP their default protocol (unverified — third-party survey).

### 2.2 MCP 2026-07-28 RC: breaking changes summary

**Architectural shift**: stateless protocol core. The `initialize`/`initialized` handshake is **eliminated**. `Mcp-Session-Id` removed. Protocol metadata travels in `_meta` on every request. New required headers: `MCP-Protocol-Version: 2026-07-28`, `Mcp-Method`, `Mcp-Name`.

**Tasks**: graduated from core experimental to formal extension; pre-existing `2025-11-25` Tasks implementations require migration. `tasks/list` removed; new pattern uses task handles returned from `tools/call`.

**Deprecated features** (12-month removal window): **Roots** (use tool params/resource URIs instead), **Sampling** (integrate LLM provider APIs directly), **Logging** (use stderr or OpenTelemetry).

**Authorization tightening**: clients validate `iss` parameter per RFC 9207; DCR requires `application_type` declaration; credentials bind to issuer; refresh-token and scope-accumulation formally documented.

**Error code change**: resource-not-found shifts from proprietary `-32002` to JSON-RPC standard `-32602` (Invalid Params).

**JSON Schema 2020-12**: tool input schemas now support `oneOf`/`anyOf`/`allOf`/conditionals/refs. External `$ref` URIs must not auto-dereference (security).

**New features**: **Extensions framework** (reverse-DNS IDs, negotiated via `extensions` map); **MCP Apps** (server-rendered HTML in sandboxed iframe; declared upfront for prefetch/security review); cache semantics (`ttlMs`, `cacheScope`); W3C Trace Context propagation.

**Migration window**: 10 weeks (May 21 – July 28). Tier 1 SDKs must ship support by final release.

### 2.3 Connector ecosystem

- **Anthropic Connectors Directory** (`claude.ai/connectors`): **398 verified connectors** across 30 categories (May 15, 2026)
- **Unified directory**: Mar 31, 2026 — Anthropic merged Skills + Connectors + Plugins under `claude.ai/directory`
- **First-party cloud connectors**: Gmail, Calendar, Drive at `gmail.mcp.claude.com/mcp`, `gcal.mcp.claude.com/mcp`, etc. — note: still **read+create only**; no rename/move/delete per [issue #51040](https://github.com/anthropics/claude-code/issues/51040)
- **Interactive connectors** (server-rendered UI via MCP Apps): Amplitude, Asana, Box, Canva, Clay, Datadog, Figma, Hex, Slack
- **Remote endpoints**: 16 (Jan 2026) → 25+ (Apr 2026)
- **Third-party registries**: Glama (~21K-24K servers), Smithery (~7K+), Official MCP Registry at `registry.modelcontextprotocol.io` (launched Sept 2025; current count unverified)

### 2.4 Tool Search Tool — the new context-saving pattern

Per [Anthropic engineering blog](https://www.anthropic.com/engineering/advanced-tool-use):

**Problem it solves**: a 5-MCP-server setup (GitHub 35 tools, Slack 11, Sentry, Grafana, Splunk) loads ~55K tokens of tool defs before any work starts. Adding Jira → 100K+ overhead. Tool definitions degrade accuracy at scale: Opus 4.5 dropped from 88.1% accuracy with Tool Search to 79.5% without it.

**Mechanism**: ~500 tokens to load the search tool itself; 3-5 relevant tools (~3K tokens) discovered on-demand. **Preserves ~95% of context window** vs traditional approach.

**Use when**: tool definitions >10K tokens, tool selection accuracy issues, 10+ tools available, MCP-powered multi-server setups.
**Don't bother when**: <10 tools, all tools used frequently, compact definitions.

**Related advanced patterns from same post**:
- **Programmatic Tool Calling**: Claude orchestrates tools through code rather than sequential API calls. 37% token reduction on complex tasks.
- **Tool Use Examples**: sample tool calls showing parameter conventions. Improves complex-parameter accuracy from 72% → 90%.

These three together are the canonical "scale your tools without breaking your agent" toolkit.

---

## 3. Anthropic Academy, Certifications, Partner Network

### 3.1 Claude Certified Architect — Foundations (CCA-F)

- **Launched**: 2026-03-12 (Claude Partner Network announcement, $100M investment)
- **Format**: 60 multiple-choice scenario-based, 120 minutes, online-proctored or in-person, partner-gated
- **Fee**: $99 USD per attempt; first 5,000 partner-employee attempts free
- **Passing score**: 720 / 1000 (scaled)
- **5 domains and weights** (unchanged from v0.1 PDF — public; see `docs/cert-coverage.md`):
  - D1 Agentic Architecture & Orchestration — 27%
  - D2 Tool Design & MCP Integration — 18%
  - D3 Claude Code Configuration & Workflows — 20%
  - D4 Prompt Engineering & Structured Output — 20%
  - D5 Context Management & Reliability — 15%
- **Pass rate / candidate volume**: not officially disclosed

### 3.2 Future tiers (announced "later in 2026")

- Sellers / Architects (advanced tier) / Developers — no concrete dates published
- "Researcher" or "Specialty" tracks: not announced
- "Claude Certified Engineer": does not exist; closest is Developer track

### 3.3 Anthropic Partner Network

- **$100M investment**: deploying to (a) direct partner training/sales enablement, (b) joint market development, (c) 5× expansion of Anthropic's partner-facing team (Applied AI Engineers, technical architects, localized GTM)
- **Named partners (Big 4 + tech)**: Accenture (30K to train), Deloitte (470K employees — Anthropic's largest enterprise AI deployment to date), Cognizant (~350K associates), Infosys, PwC (30K cert target — May 14), KPMG (276K workforce — May 19), EPAM (10K certified architect target; 1,400 already certified)
- **Partner tiers** (third-party-reported, unverified at official source): Registered → Select → Premier (invitation-only)
- **Geographic expansion**: Sydney office opened (4th APAC, Mar 10); prior Seoul, Tokyo, Bengaluru. APAC run-rate revenue grew >10× YoY.
- Partner portal: https://partnerportal.anthropic.com/

### 3.4 Anthropic Academy

- **18 courses**, ~15-20 hrs total
- **Core practitioner courses**: Claude 101, Claude Code 101, Claude Code in Action, Intro to subagents, Intro to agent skills, Intro to Claude Cowork
- **Core builder courses**: Building with the Claude API (8.1 hr, 10 quizzes), Intro to MCP, MCP: Advanced Topics
- **AI Fluency series**: Framework & Foundations, AI Capabilities and Limitations, for Educators / Students / Nonprofits / Small Businesses, Teaching AI Fluency
- **Cloud-specific**: Claude with Amazon Bedrock, Claude with Google Vertex AI
- **Recent additions (last 90 days)**: Claude Code 101, Intro to Claude Cowork, Intro to subagents, AI Capabilities and Limitations, AI Fluency for Small Businesses (newest, ~May 2026)
- **Languages**: English only on the public catalog
- All certs: free, LinkedIn-shareable per course

### 3.5 Anthropic business state (context for enterprise chapters)

- **Run-rate revenue**: ~$30B (May 2026), up from ~$9B at end of 2025
- **>1,000 customers spending >$1M annualized** (doubled from 500 in February)
- **Series G**: Feb 12 2026, raised at $380B post-money valuation
- **Notable recent partnerships**: SpaceX (compute, May 6); Google + Broadcom expanded compute (Apr 6); Blackstone/Goldman/H&F joint venture $1.5B (May 4); Gates Foundation $200M (May 14); Stainless acquisition (SDK tooling, May 18); Project Glasswing (defensive AI security, Apr 7)
- **FedRAMP High authorized**; available on AWS GovCloud, Vertex Assured Workloads, IL5+ via Bedrock

---

## 4. Competitive landscape

### 4.1 Direct competitors

- **Cursor** — Agent mode, Composer multi-file editor, Bugbot Autofix for PR review, Cursor Automations (scheduled cloud agents w/ MCP), JetBrains support shipped 2026. Supports Claude Sonnet 4.5, GPT-5, Gemini, and Cursor's own Composer model. Users can run Claude Code inside Cursor (hybrid).
- **GitHub Copilot + Claude** — Claude + OpenAI Codex shipped to **public preview Feb 4, 2026** for Enterprise/Pro+; expanded to Business and Pro Feb 26. Still public preview as of May 22 (1 premium request per agent session). Underlying **Agent Control Plane is GA**. Agents run on github.com, mobile, and VS Code.
- **Continue.dev** — MIT-licensed; Agent Mode plans/executes multi-step tasks; supports Claude Opus 4.6, GPT-4o, Gemini, plus local Ollama/vLLM. Targets regulated/offline teams.
- **Cline** (formerly Claude Dev) — VS Code-only with Plan/Act modes; **$32M Series A from Emergence Capital**; 5M+ installs.
- **Aider** — terminal-first, Git-native, diff-based edits; strong open-source community, monthly releases.
- **OpenAI Codex / GPT-5 agentic** — Codex used by ~4M weekly developers. Latest model: **GPT-5.3-Codex**. **GPT-5.5 and 5.5 Pro shipped to API Apr 24** with major agentic-coding gains.
- **Gemini Code Assist** — **Gemini 3.1 Pro + 3.0 Flash** in Preview for agent mode, chat, generation; "Finish Changes" and "Outlines" features; 1M context.
- **OpenHands** — $18.8M Series A All Hands AI (recent funding).

### 4.2 Benchmark positioning (May 21, 2026)

- **SWE-Bench Verified** leaderboard: Claude Mythos Preview 93.9% > Opus 4.7 (Adaptive) 87.6% > GPT-5.3 Codex ~85% > Gemini 3.1 Pro ~75-80%. Contamination flagged for all frontier models (per swebench.com).
- **BFCL v4 (function calling)**: Opus 4.5 at 53.7 trails GPT-5.4 at 70.9 (rank 5). Tool-use mechanics are a Claude weakness on this specific benchmark.

### 4.3 Where Claude wins

- **Long context** GA at 1M (Opus 4.7 + Sonnet 4.6) with flat per-token pricing
- **Agentic workflows** — Claude Code-specific architecture (reference customers: Asana, Cursor, GitHub, Replit, Vercel)
- **Enterprise / compliance** — ~70% win rate in head-to-head enterprise deals vs OpenAI (per Panto stats, third-party); 29% enterprise AI assistant share (up from 18% in 2024)
- **Claude Code run-rate revenue** >$2.5B (Reuters via Panto, third-party)
- **MCP** is Anthropic-authored; the protocol's cross-provider adoption strengthens Claude's positioning

### 4.4 Where Claude loses or is at parity

- **Consumer chat** — ChatGPT 900M weekly actives (Feb 2026); 60.4% chatbot share vs Claude ~6%
- **Multimodal generation** — no first-party image/video at OpenAI/Google parity (unverified for May 2026)
- **High-volume cost** — open weights (Llama 4, DeepSeek V4, Qwen 3.6) lead on SWE-Bench among open models and undercut API pricing
- **Self-hostable** — Anthropic offers no on-prem weights; Llama 4 / DeepSeek / Qwen own that segment (~9% of enterprise production runs)

### 4.5 Industry trends

- **MCP is the de-facto standard** across major providers; Anthropic, OpenAI, Google all support
- **Multi-agent reality**: 40% of multi-agent pilots fail within 6 months (per Augment Code retrospective). At 85% per-step accuracy a 10-step workflow only succeeds ~20% of the time. Top failure modes: silent error propagation, prompt-injection hijacks, feedback loops exhausting API budgets.
- **EU AI Act** — full applicability **August 2, 2026**. Most autonomous coding agents in enterprise contexts land in high-risk (Annex III) bucket. Penalties up to €40M or 7% global turnover. **Multi-layer compliance**: GPAI provider + orchestrator + deployer all on the hook.
- **Market size**: $9.8–11.0B annualized enterprise AI coding-agent market (Gartner, Apr 2026); 84% of developers use/plan AI tools; 51% daily use; 75% by 2028 (forecast).

---

## 5. Anthropic-canonical reference architectures

### 5.1 Multi-agent research system (orchestrator-worker / hub-and-spoke)

Source: [Anthropic engineering blog](https://www.anthropic.com/engineering/multi-agent-research-system).

**Architecture**:
- Lead agent analyzes the query, develops a strategy, spawns subagents to explore aspects in parallel
- Subagents operate with **isolated context windows** (do not see parent state)
- Lead saves its plan to **Memory** to survive 200K-token context truncation
- Subagents return findings independently; system uses **artifacts** that persist outside coordinator's conversation

**Performance**: Multi-agent Opus 4 + Sonnet 4 subagents outperformed single-agent Opus 4 by **90.2%** on internal research evals.

**Decomposition heuristics embedded in the lead prompt**:
- **Simple fact-finding** → 1 agent, 3-10 tool calls
- **Direct comparisons** → 2-4 subagents, 10-15 calls each
- **Complex research** → 10+ subagents with "clearly divided responsibilities"

**Token cost**:
- Agents use ~4× more tokens than chat
- Multi-agent systems use ~15× more tokens than chat
- **Token usage explains 80% of performance variance** in web-browsing evals
- Requires task value high enough to justify increased spend

**Documented failure modes**:
- Spawning excessive subagents (50+) for simple queries
- Duplicate work when task descriptions lack clarity
- Sequential search where parallel was possible
- SEO-content-farm bias over authoritative sources
- Continuing research despite sufficient results

### 5.2 When to use multi-agent — the official decision framework

Source: [Building multi-agent systems: when (not) to use them](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them).

**Three scenarios where multi-agent wins**:
1. **Context protection** — when context pollution from one subtask degrades subsequent ones (example: 2000+ token order-history retrieval before diagnosing a technical issue)
2. **Parallelization** — independent facets that can run concurrently (3-10× token cost, but throughput gain)
3. **Specialization** — when 15-20+ tools become unwieldy; when system prompts need conflicting behavioral modes; when domain expertise would overwhelm a generalist

**Critical anti-pattern**: role-based decomposition (planner / implementer / tester / reviewer) creates coordination overhead and context loss at every handoff. **Prefer context-based decomposition** — group tightly-coupled work together even if it crosses problem types.

**Decision discipline**: "Start with the simplest approach that works, and add complexity only when evidence supports it." Before reaching for multi-agent, try improved prompting, **Tool Search Tool** (≤85% token reduction), or context compaction.

**Trade-off table**:
| Factor | Multi-agent impact |
|---|---|
| Token cost | 3-10× single-agent |
| Latency | Often longer total despite parallelism |
| Reliability | Additional failure points + coordination complexity |
| Maintainability | Multiple prompts; new sources of unexpected behavior |

### 5.3 Claude Managed Agents (GA at Code w/ Claude SF 2026)

Three managed capabilities:
- **Multiagent Orchestration** — managed coordinator/subagent fleets (lifts the heavy lift of section 5.1 above into a service)
- **Outcomes** — declarative success criteria with iterative improvement loops
- **Dreaming** (research preview) — cross-session memory; agents review prior sessions, generate insights, persist artifacts for self-improvement

Launch customers: Notion, Rakuten, Asana, Sentry, Atlassian. ServiceNow rolling Claude Code across 29K+ employees.

---

## 6. Failure modes + security incidents

### 6.1 The April 23 postmortem — three overlapping bugs

Anthropic published a [full postmortem](https://www.anthropic.com/engineering/april-23-postmortem). Material for every chapter touching reliability or production deployment.

**Bug 1: Reasoning effort default change** (Mar 4 – Apr 7, 2026)
- Anthropic changed default reasoning effort `high` → `medium` to fix UI freezing from excessive thinking time
- Users reported Claude felt "less intelligent" despite tests showing "slightly lower intelligence with significantly less latency"
- **Fix**: reverted; restored `xhigh` for Opus 4.7 and `high` for others

**Bug 2: Caching bug breaking thinking blocks** (Mar 26 – Apr 10, 2026)
- Implementation bug in `clear_thinking_20251015` API header caused old thinking sections to clear **every turn** rather than once
- Result: Claude progressively forgetful; cache misses drained usage limits faster
- **Took >1 week to discover and confirm**; fixed in v2.1.101

**Bug 3: Verbosity-reduction prompt** (Apr 16 – Apr 20, 2026)
- System instruction "keep text between tool calls to ≤25 words" reduced verbosity but compounded with other prompt mods
- Broader evaluations revealed **3% drop in coding evals** for both Opus 4.6 and 4.7
- **Fix**: reverted Apr 20

**Process changes Anthropic adopted**:
- Expanded internal Code Review testing using Opus 4.7 across additional repos
- Mandatory broad per-model evaluations for all system-prompt changes
- Continued ablation testing for individual prompt-line impacts
- New tooling for easier prompt change review/auditing
- Soak periods, broader eval suites, gradual rollouts for intelligence-affecting changes
- Internal staff required to dogfood public builds

### 6.2 Security incidents (last ~60 days)

- **Source-map leak** (Mar 31): npm `@anthropic-ai/claude-code@2.1.88` shipped 59.8 MB sourcemap; ~513K lines unobfuscated TS across 1,906 files. Threat actors used "leaked Claude Code" lures + GitHub-release payloads ([Trend Micro](https://www.trendmicro.com/en_us/research/26/d/weaponizing-trust-claude-code-lures-and-github-release-payloads.html), [Zscaler ThreatLabz](https://www.zscaler.com/blogs/security-research/anthropic-claude-code-leak))
- **claude-cli:// deeplink RCE** (May 12): arbitrary settings (including shell commands) injectable via deeplink. Disclosed by Joernchen of 0day.click; fixed in v2.1.118.
- **Network sandbox bypass** (Oct 2025 – Apr 2026): SOCKS5 hostname null-byte injection ran from v2.0.24 through v2.1.89 — **~5.5 months across 130 versions**. Silently patched in v2.1.90; no security mention in release notes. Second bypass disclosed by researcher Aonan Guan ([The Register](https://www.theregister.com/security/2026/05/20/even-claude-agrees-hole-in-its-sandbox-was-real-and-dangerous/5243662)).

### 6.3 Common silent-failure patterns

- Fabricated API versions, commit SHAs, package names
- Plan-mode hallucinations after mid-task context compaction (community reports — figures unverified)
- Tool selection misrouting (similar tool descriptions)
- Context degradation in extended sessions
- Cost overruns from feedback loops in agentic systems
- Compliance issues — multi-tenant data leakage in subagent context (no public 2026 incidents disclosed; risk noted)

GitHub: `anthropics/claude-code#46727` (Opus 4.6 Max 20× systematic-hallucination report); `#20051` (plan-mode hallucination prevention feature request).

---

## 7. Production patterns & community state

### 7.1 Notable OSS Claude Code projects

**Anthropic reference implementations** (star counts verified via gh API on 2026-05-22):
- [`anthropics/claude-code`](https://github.com/anthropics/claude-code) — the agentic CLI (**125,777 stars**, 779 subscribers; last push 2026-05-22)
- [`anthropics/claude-code-action`](https://github.com/anthropics/claude-code-action) — GitHub Action; supports Anthropic direct, Bedrock, Vertex, Foundry, Workload Identity Federation
- [`anthropics/claude-plugins-official`](https://github.com/anthropics/claude-plugins-official) — official plugin marketplace; **24,649 stars** ("Official, Anthropic-managed directory of high quality Claude Code Plugins")
- [`anthropics/skills`](https://github.com/anthropics/skills) — official, production-ready skill examples

**Top community repos** (star counts verified):
- `forrestchang/andrej-karpathy-skills` (and `multica-ai/andrej-karpathy-skills` fork) — 70-line CLAUDE.md distilled from Karpathy's Jan 26 2026 LLM-coding-pitfalls posts (~110K+ stars per third-party reports — unverified)
- [`wshobson/agents`](https://github.com/wshobson/agents) — **35,803 stars** — "Multi-harness agentic plugin marketplace for Claude Code, Codex CLI, Cursor, OpenCode, and Gemini CLI"
- [`hesreallyhim/awesome-claude-code`](https://github.com/hesreallyhim/awesome-claude-code) — **44,544 stars**; curated index
- [`VoltAgent/awesome-claude-code-subagents`](https://github.com/VoltAgent/awesome-claude-code-subagents) — 100+ subagents
- [`0xfurai/claude-code-subagents`](https://github.com/0xfurai/claude-code-subagents) — 100+ specialists, context-auto-invoked
- `Piebald-AI/claude-code-lsps` — LSP plugin reference marketplace (11+ languages: Python/Pyright, TypeScript, Go/gopls, Rust/rust-analyzer, Java, C/C++, C#, PHP, Kotlin, Ruby, HTML/CSS)
- `Claude-Flow` — 11.4K stars; enterprise orchestration framework
- `majiayu000/claude-skill-registry` — largest aggregated skill index
- `ComposioHQ/awesome-claude-skills` — curated skills list

**Pattern clarification** (per [morphllm](https://www.morphllm.com/claude-code-skills-mcp-plugins) and [ado.im](https://www.ado.im/posts/claude-customization-stack-mcp-skills-plugins/)):
- **MCP** = external tool surface ("what Claude can do") — heavier on tokens
- **Skills** = procedural knowledge / playbooks ("how to do X") — ~100 tokens per skill at scan-time, full body lazy-loaded
- **Plugins** = installable bundles (commands + subagents + MCP configs + hooks + skills)

### 7.2 Observed production patterns

**Architecture**:
- **Orchestrator/subagent (hub-and-spoke)** — canonical reference (§5.1)
- **Planner / Generator / Evaluator** — structured-artifact handoffs for long-running work
- **Writer/Reviewer** — read-only reviewer subagent (no Edit/Write tools); orchestrator applies fixes
- **Scope-limited tool agents** — narrow `allowedTools` allowlists for least-privilege
- **Headless `-p` mode in CI/CD** — non-interactive stdout for pipeline steps; [Claude Code GitLab CI/CD docs](https://code.claude.com/docs/en/gitlab-ci-cd)
- **Customer example — Bun's Robobun bot** (Cherny + Sumner at Code w/ Claude SF): generates regression test, requires fail on prev version + pass on fix branch before opening PR

**Required guardrails (anti-pattern responses)**:
- Durable state in Postgres/Redis (treat SDK session as ephemeral)
- Per-task / per-user / per-tenant cost caps in harness
- Tool-permission scoping per session
- Branch protection + staged rollout + audit trail before prod CI/CD

### 7.3 Community channels

- **Discord**: official Claude server (~98K members, unverified); Claude Code-specific channels active. Anthropic shipped **Claude Code Channels** Mar 20 — Telegram/Discord/iMessage front-ends to a local Claude Code session via MCP
- **Blogs / newsletters**:
  - **Simon Willison** — [Agentic Engineering Patterns](https://simonwillison.net/2026/Feb/23/agentic-engineering-patterns/) series (since Feb 23 2026, 1-2 chapters/week); live blog of [Code w/ Claude SF](https://simonwillison.net/2026/May/6/code-w-claude-2026/)
  - **Latent Space** podcast — episodes with Boris Cherny + Cat Wu (Claude Code), Felix Rieseberg (Cowork / Desktop)
  - InfoQ, VentureBeat, MIT Tech Review, Fortune — postmortem + Code w/ Claude coverage
- **Conferences (2026)**: Code w/ Claude SF (May 6), London (May 19), Tokyo (Jun 10 — upcoming); AI Engineer Europe (Apr 8-10 London); AI Coding Summit (gitnation)
- **Anthropic engineering blog (recent)**:
  - [`/engineering/april-23-postmortem`](https://www.anthropic.com/engineering/april-23-postmortem) — three-bug Claude Code quality postmortem
  - [`/engineering/advanced-tool-use`](https://www.anthropic.com/engineering/advanced-tool-use) — Tool Search Tool, Programmatic Tool Calling, Tool Use Examples
  - [`/engineering/multi-agent-research-system`](https://www.anthropic.com/engineering/multi-agent-research-system) — canonical orchestrator-worker pattern
  - [`/blog/building-multi-agent-systems-when-and-how-to-use-them`](https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them) — official decision framework

---

## 8. Implications for the books

### 8.1 Handbook — chapters needing material updates

| Chapter | Update needed | Source |
|---|---|---|
| 1 Principles | Confirm agent loop; possibly add adaptive thinking primer | §1.1, §1.5 |
| 4 Working Productively | Model lineup table; adaptive vs extended thinking distinction; new effort levels (`xhigh`); Opus 4.7 tokenizer note | §1.1, §1.5 |
| 5 Context as Currency | Adaptive thinking interleaves with compaction differently; `Dreaming` cross-session memory (research preview); new commands `/btw` confirmed; tokenizer differences across models | §1.1, §1.3, §5.3 |
| 8 Extending Claude | Hook count up to ~31; new lifecycle events; Tool Search Tool + Programmatic Tool Calling + Tool Use Examples; unified `claude.ai/directory`; **MCP RC 2026-07-28 breaking changes warning** | §1.3, §2.4, §2.2 |
| 10 Agents & Parallel Work | Claude Managed Agents (Outcomes, Dreaming); Remote Agents (phone control); Robobun pattern; multi-agent decision framework | §1.3, §5.1, §5.2, §5.3, §7.2 |
| 12 Headless & Automation | Claude Code Channels (Mar 20); CI auto-fix; Code Review tool; Security Reviews; rate limits doubled; GitHub Actions auth (Workload Identity Federation) | §1.3, §7.1 |
| 14 Team Patterns | Managed-only `availableModels` allowlist; CCA-F partner-gated; LSP plugin support for 11+ languages | §1.3, §3.1, §7.1 |
| 15 Enterprise | Full pricing refresh; revenue/customer numbers; partner network ($100M, 5× team); FedRAMP/IL5 unchanged; **EU AI Act Aug 2 2026 deadline** | §1.2, §3.5, §4.5 |
| App C Hook Reference | Full 31-event list update | §1.3 |

### 8.2 Architect's Reference — structural decisions informed

- **The cert taxonomy aligns** to the public domain weights; v0.1 internal-only PDF still accurate on structure
- **Canonical sources for each domain**:
  - D1 Agentic: §5.1 (multi-agent research system), §5.2 (decision framework), §5.3 (Claude Managed Agents)
  - D2 Tool Design + MCP: §2.4 (Tool Search), §2.2 (MCP RC breaking changes — chapter must note migration window)
  - D3 already deep in handbook
  - D4 Prompt Engineering: §5.2 (decision frameworks), §6.1 (postmortem reveals "prompts compound unexpectedly")
  - D5 Context + Reliability: §5.1 (artifacts pattern), §6.1 (caching bug case study)
- **Reference implementations to build** (Phase 2 Step 2 of plan): the multi-agent research pattern is canonical-source-documented and benchmarkable (90.2% gain) — strong candidate for one of the 2-3 to build
- **CSR agent** has fewer canonical Anthropic sources; still warranted given cert scenario coverage
- **Structured data extraction** — §1.5 Files API + Citations + Batch API patterns

### 8.3 Field-Guide — refresh material

- **Customer rollouts to potentially cite**: Deloitte 470K, KPMG 276K, Mercado Libre 23K engineers (90% autonomous coding by Q3 2026 target), ServiceNow 29K
- **The April 23 postmortem** is a gold-standard case study for "production reliability" chapters
- **Three security incidents** in 60 days are case studies for the security chapter (if v2.0 audit refreshes)
- **40% multi-agent pilot failure rate** is a headline-grabbing finding
- **EU AI Act timeline** is a regulatory case for the governance chapter
- **Original 67-repo audit** is now historical — the field has expanded substantially; consider whether re-audit is in scope or whether v1.0 documents "what was true mid-2025" with refresh deferred to v2.0

---

## 9. Recommended periodic checks (extend cert-tracking watch list)

Current watch list in [`cert-tracking.md`](./cert-tracking.md) covers the cert ecosystem. Extend with these for the broader landscape:

- **MCP spec governance** — [blog.modelcontextprotocol.io](https://blog.modelcontextprotocol.io) (SEP track, release-candidate timing). **Especially through July 28, 2026 for the RC final pub.**
- **Anthropic engineering blog** — [anthropic.com/engineering](https://www.anthropic.com/engineering) (architecture posts, postmortems)
- **Anthropic news index** — [anthropic.com/news](https://www.anthropic.com/news) (already in cert-tracking)
- **Claude Code docs** — [code.claude.com/docs](https://code.claude.com/docs) (hook events, settings hierarchy, command set)
- **Claude API docs** — [platform.claude.com/docs](https://platform.claude.com/docs) (model lineup, pricing)
- **Anthropic Connectors Directory** — [claude.com/connectors](https://claude.com/connectors) (current connector count = 398 baseline)
- **GitHub `anthropics/claude-code` releases** — for security advisories the changelog may not surface

Suggest extending the weekly tracking agent to also check these and report new entries on `anthropic.com/engineering` and material changes to the docs trees.

---

## 10. Open verification items (transparency)

Things in this snapshot I could not fully verify from primary sources and which the books should treat with caution:

- ~~**Claude Code GitHub star count**~~ — **verified 125,777 stars** via gh API on 2026-05-22
- ~~**`anthropics/claude-plugins-official` count**~~ — **verified 24,649 stars**; plugin total still unverified (no public count endpoint)
- **`awesome-claude-skills` 8.7K stars, "Everything Claude Code" 100K+ stars** — third-party blog claims, likely inflated; the Karpathy skills repos do trend at high star counts but exact figures could not be re-verified
- **Discord member counts**
- **"~25K MCP servers" aggregate count** — cross-registry, may double-count
- **40% multi-agent pilot failure rate** — Augment Code retrospective; not Anthropic-confirmed
- **29% enterprise AI-assistant market share, 70% enterprise win rate vs OpenAI** — Panto stats / IntuitionLabs; not Anthropic-confirmed
- **Claude Code run-rate revenue >$2.5B** — Reuters via Panto, third-party
- **Claude Mythos Preview** SWE-Bench 93.9% — public leaderboard exists but contamination caveats apply
- **The "Bun Robobun bot" example** — only sourced from conference recap
- **MCP registry exact counts** — page fetches inconsistent; Glama, Smithery, official registry numbers should be re-checked before citing in chapters

For book content aimed at v1.0 release, prefer Anthropic-primary sources where citable; treat third-party figures as illustrative and flag with "as reported by ..." attribution.

---

## Version history

- **2026-05-22** — Initial snapshot (this document). Compiled from 5 parallel research agents + 7 verification WebFetches against primary sources.
