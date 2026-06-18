# Handbook currency brief — June 2026

**Working brief for the Parts II–IV fan-out; verify before v1.0 deploy.**

Re-verifies the currency deltas flagged by `docs/audits/2026-06-18_handbook-source-audit.md` (LaTeX source frozen 2026-03-27) against live docs + the cert book + dossiers, **as of 2026-06-18**. Every Anthropic-attributed claim carries a source per the repo's editorial standard. Items that could not be settled to a single authoritative source are tagged **UNVERIFIED — needs human check**.

Source shorthand:
- `models-overview` = https://platform.claude.com/docs/en/about-claude/models/overview (live)
- `model-config` = https://code.claude.com/docs/en/model-config (live)
- `hooks` = https://code.claude.com/docs/en/hooks (live)
- `security` = https://code.claude.com/docs/en/security (live)
- `workflows` = https://code.claude.com/docs/en/workflows (live)
- `agents` = https://code.claude.com/docs/en/agents (live)
- `sub-agents` = https://code.claude.com/docs/en/sub-agents (live)
- `goal` = https://code.claude.com/docs/en/goal (live)
- `scheduled-tasks` = https://code.claude.com/docs/en/scheduled-tasks (live)
- `remote-control` = https://code.claude.com/docs/en/remote-control (live)
- `settings` = https://code.claude.com/docs/en/settings (live)
- cert = `architect-reference/src/content/...` (already-verified in-repo facts)

---

## 1. Models — feeds: ch04, ch15(pricing), ch05(context)

- **Opus 4.8 is the most capable Opus-tier model**; ID/alias `claude-opus-4-8`. Pricing **$5 in / $25 out per MTok**. Context **1M tokens**; max output 128k. Reliable knowledge cutoff **Jan 2026** (training-data cutoff also Jan 2026). Source: `models-overview` (as of 2026-06-18).
- **Opus 4.8 default `effort` is `high`** on all surfaces including the Claude API and Claude Code (set explicitly to change). Source: `models-overview` Note (as of 2026-06-18).
- **Sonnet 4.6** (`claude-sonnet-4-6`): $3 in / $15 out; **1M tokens**; max output 64k; reliable cutoff **Aug 2025** (trained through Jan 2026). Source: `models-overview` (as of 2026-06-18).
- **Haiku 4.5** (`claude-haiku-4-5`, dated `claude-haiku-4-5-20251001`): $1 in / $5 out; **200k tokens** (NOT 1M); max output 64k; reliable cutoff **Feb 2025**. Source: `models-overview` (as of 2026-06-18).
- **Fable 5** (`claude-fable-5`): Anthropic's **most capable widely released model**, **GA 2026-06-09** on Claude API, Claude Platform on AWS, Bedrock, Vertex AI, Microsoft Foundry. **1M tokens**, max output 128k, reliable/ training cutoff **Jan 2026**, pricing **$10 in / $50 out** (2× Opus). Adaptive thinking always on; **thinking cannot be turned off**. Has safety classifiers (cyber/biology) that trigger automatic fallback to Opus. Source: `models-overview`, `model-config` (as of 2026-06-18).
  - Companion **Mythos 5** (`claude-mythos-5`) is **NOT GA** — invitation-only Project Glasswing. Don't present as generally available. Source: `models-overview` (as of 2026-06-18).
- **Claude Code default model is tier-dependent, NOT a single value** — the `default` alias resolves to: **Opus 4.8** on Max / Team Premium / Enterprise pay-as-you-go / Anthropic API; **Sonnet 4.6** on Pro / Team Standard / Enterprise subscription seats; **Opus 4.7** on Claude Platform on AWS; **Sonnet 4.5** on Bedrock/Vertex/Foundry. Source: `model-config` (as of 2026-06-18).
- **Fable 5 is NOT the default on any account type** — opt in with `/model fable` or the `best` alias (`best` = Fable 5 where available, else latest Opus). Source: `model-config` (as of 2026-06-18).
- **1M context — GA, but availability varies by model and plan (NOT a blanket default):**
  - On the **Anthropic API**, Fable 5, Opus 4.8, and Opus 4.7 **always run** the 1M window.
  - On **Max/Team/Enterprise subscriptions**, **Opus is auto-upgraded to 1M** (no config). **Sonnet 1M is NOT in the auto-upgrade** — needs usage credits on every plan, incl. Max. On Pro, both need usage credits.
  - Aliases `opus[1m]` / `sonnet[1m]` and `claude-opus-4-8[1m]` force it. `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` removes it. No token premium beyond 200K. Source: `model-config` (as of 2026-06-18). Cert glossary corroborates "1M on Opus 4.8 and Sonnet 4.6, 200k on Haiku 4.5" (`architect-reference/src/content/glossary/context-window.mdx`).
- **`opusplan` hybrid**: uses `opus` in plan mode, auto-switches to `sonnet` for execution at the plan→execute boundary. The plan-phase **1M upgrade applies only on auto-upgrade tiers**; otherwise plan phase runs at **standard 200K** — use `opusplan[1m]` to force it. Source: `model-config`; cert `architect-reference/src/content/glossary/opusplan.mdx` (as of 2026-06-18).
- **Fallback model chains**: `--fallback-model sonnet,haiku` or `fallbackModel` array in settings; capped at 3 models; switch lasts the current turn only. Source: `model-config` (as of 2026-06-18).
- **Adaptive thinking** is the default since Opus 4.6 and is always-on for Opus 4.7+ and Fable 5 (fixed-budget mode + `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING` don't apply to them). Effort levels: Fable 5 / Opus 4.8 / Opus 4.7 support `low,medium,high,xhigh,max`; Opus 4.6 / Sonnet 4.6 support `low,medium,high,max`. Source: `model-config` (as of 2026-06-18).
- Legacy/available: Opus 4.7, Opus 4.6, Sonnet 4.5, Opus 4.5; Opus 4.1 **deprecated, retires 2026-08-05**. Source: `models-overview` (as of 2026-06-18).

---

## 2. Hooks — feeds: ch08, Appendix C

- **Claude Code (settings.json) hook events: 29 events** as of 2026-06-18 (the audit's "30, up from ~22" is approximately right — the live docs enumerate **29**). NOTE: this is the **Claude Code settings.json** surface, distinct from the **Agent SDK** hook surface (cert `d1-05` counts the SDK's 10 Python / 20 TS callbacks — do not conflate). Source: `hooks` (as of 2026-06-18).
- The 29 events:
  1. `SessionStart` — session begins or resumes
  2. `Setup` — `--init-only`/`--init`/`--maintenance` in `-p` mode
  3. `UserPromptSubmit` — user submits a prompt, before processing
  4. `UserPromptExpansion` — a typed command expands into a prompt
  5. `PreToolUse` — before a tool call executes
  6. `PermissionRequest` — a permission dialog appears
  7. `PermissionDenied` — a tool call denied by the auto-mode classifier
  8. `PostToolUse` — after a tool call succeeds
  9. `PostToolUseFailure` — after a tool call fails
  10. `PostToolBatch` — after a batch of parallel tool calls resolves
  11. `Notification` — Claude Code sends a notification
  12. `MessageDisplay` — while assistant message text is displayed
  13. `SubagentStart` — a subagent is spawned
  14. `SubagentStop` — a subagent finishes
  15. `TaskCreated` — a task is created via `TaskCreate`
  16. `TaskCompleted` — a task is marked completed
  17. `Stop` — Claude finishes responding
  18. `StopFailure` — turn ends due to an API error
  19. `TeammateIdle` — an agent-team teammate is about to go idle
  20. `InstructionsLoaded` — a CLAUDE.md or `.claude/rules/*.md` file is loaded
  21. `ConfigChange` — a config file changes during a session
  22. `CwdChanged` — the working directory changes
  23. `FileChanged` — a watched file changes on disk
  24. `WorktreeCreate` — a worktree is being created
  25. `WorktreeRemove` — a worktree is being removed
  26. `PreCompact` — before context compaction
  27. `PostCompact` — after compaction completes
  28. `Elicitation` — an MCP server requests user input during a tool call
  29. `ElicitationResult` — after a user responds to an MCP elicitation
  - Source: `hooks` (as of 2026-06-18).

---

## 3. FedRAMP / compliance — feeds: ch15(enterprise)

- **CORRECTION CONFIRMED: FedRAMP High is Bedrock/GovCloud-only, NOT Claude Code direct.** Claude models reach FedRAMP High + DoD IL-4/5 **through Amazon Bedrock in AWS GovCloud (US)**, and via Google Vertex AI with Assured Workloads (FedRAMP-High). Anthropic is **actively pursuing** direct FedRAMP authorization for Claude but does not have it as of 2026-06-18. AI models are treated as software components inheriting the hosting platform's authorization, not as a directly-authorized service. Source: AWS Public Sector Blog (https://aws.amazon.com/blogs/publicsector/accelerating-government-innovation-amazon-bedrock-models-get-fedramp-high-and-dod-il-4-5-approval-in-aws-govcloud-us/); Claude Public Sector FAQs (https://support.claude.com/en/articles/13756069-public-sector-faqs) (as of 2026-06-18). The March-era statement that Claude Code itself carries FedRAMP High is **wrong** — phrase it as "via Bedrock GovCloud."
- **SOC 2 Type 2 and ISO 27001**: held; reports/certificates available at the Anthropic Trust Center (https://trust.anthropic.com). Source: `security` (as of 2026-06-18).
- **HIPAA / ISO 42001 / data-residency specifics**: **UNVERIFIED — needs human check.** The `security` page points to the Trust Center for the full certification list but does not enumerate HIPAA, ISO 42001, or a data-residency table inline; pull these from trust.anthropic.com at authoring time rather than asserting them here.
- **RBAC / enterprise governance** is delivered through **managed/policy settings** (`availableModels`, `enforceAvailableModels`, `requiredMinimumVersion`, `disableWorkflows`, `allowManagedHooksOnly`, `disableRemoteControl`) + admin toggles at claude.ai/admin-settings/claude-code, not a separate "RBAC" product surface. Source: `settings`, `model-config`, `remote-control` (as of 2026-06-18). See §6.

---

## 4. Orchestration — feeds: ch10/ch11 (new orchestration chapter)

Four distinct parallelism surfaces; the differentiator is *who holds the plan*. Source: `agents` (as of 2026-06-18).

- **Subagents** — delegated workers inside one session; do a side task in their own context and return a summary. Managed via the `/agents` panel (Running + Library tabs). Source: `agents`, `sub-agents` (as of 2026-06-18).
- **Agent View** — `claude agents` (a **CLI command**, NOT `/agents`). One screen to dispatch + monitor **background sessions**; each moves into its own worktree automatically. **Status: research preview.** (Distinct from `/agents`, which is the subagent panel.) Source: `agents` (as of 2026-06-18).
- **Agent Teams** — multiple coordinated sessions with a **shared task list + inter-agent messaging**, run by a lead. **Status: experimental, disabled by default.** Teammates aren't worktree-isolated, so partition files. Source: `agents` (as of 2026-06-18).
- **Dynamic workflows** — `/workflows`. A **JavaScript script** Claude writes that orchestrates subagents at scale (codebase audits, 500-file migrations, cross-checked research). Built-in `/deep-research`. Limits: **up to 16 concurrent agents**, **1,000 agents/run**. Trigger with `ultracode` keyword or `/effort ultracode`; save runs to `.claude/workflows/`. Requires **v2.1.154+**, all paid plans. Disable: `disableWorkflows` / `CLAUDE_CODE_DISABLE_WORKFLOWS=1`. Source: `workflows` (as of 2026-06-18).
- **`/goal`** — sets a completion condition; Claude keeps working across turns until a **small fast model (defaults to Haiku)** confirms the condition holds; clears automatically. One goal/session; `/goal clear` to stop; condition up to 4,000 chars; it's a wrapper around a session-scoped prompt-based Stop hook. Requires **v2.1.139+**. Works in headless (`-p`) and Remote Control. Source: `goal` (as of 2026-06-18).
- **Nested subagents** — a subagent **can spawn its own subagents as of v2.1.172**. **Depth limit = 5 (fixed, not configurable)**: a subagent at depth five does not receive the Agent tool and cannot spawn further. Only the top-level subagent's summary returns to the main conversation. A **fork** cannot spawn another fork but can spawn other subagent types (which count toward the depth limit). Source: `sub-agents` (as of 2026-06-18).

---

## 5. Headless / automation — feeds: ch12(automation)

- **`/loop`** — bundled skill; re-runs a prompt on an interval. `/loop 5m <prompt>` (fixed), `/loop <prompt>` (Claude-chosen interval), bare `/loop` (built-in maintenance prompt or `loop.md`). 7-day expiry; `Esc` stops. Requires **v2.1.72+**. On Bedrock/Vertex/Foundry, a no-interval prompt runs on a fixed 10-min schedule and bare `/loop` prints usage. Source: `scheduled-tasks` (as of 2026-06-18).
- **`/schedule` + cloud Routines** — durable cron scheduling on **Anthropic-managed cloud** (no machine/session needed, fresh clone, no local files); customize via `/schedule` in the CLI; **minimum interval 1 hour**. Contrast: Desktop scheduled tasks (local, 1-min min) and session-scoped `/loop`. Underlying tools: `CronCreate` / `CronList` / `CronDelete`. Source: `scheduled-tasks` + https://code.claude.com/docs/en/routines (as of 2026-06-18).
- **`/code-review` vs `/simplify`** — current state: **`/code-review` hunts correctness bugs** (effort-tunable, `--comment`/`--fix`); **`/simplify` is cleanup-only** (reuse/simplification/efficiency/altitude, applies fixes, does not hunt bugs). The "`/simplify` was absorbed into / renamed `/code-review`" history is real but **version-churny** — the per-version absorb/return detail is **UNVERIFIED — needs human check** (web-search-sourced, not first-party docs); state only the current functional split unless you pull `https://code.claude.com/docs/en/commands` at authoring time. (as of 2026-06-18).
- **Remote Control** — `claude remote-control` (server mode) / `claude --remote-control` / `/remote-control`; drive a **local** session from claude.ai/code or the mobile app. Research preview; off-by-default on Team/Enterprise (admin toggle). Requires **v2.1.51+**. **CORRECTION:** Remote Control requires **claude.ai OAuth and does NOT support API keys** — it runs locally and authenticates through claude.ai. The audit's "Remote Control now on Bedrock/Vertex" appears **incorrect**: Remote Control is not a Bedrock/Vertex feature (those are inference providers; Remote Control is a claude.ai-account connectivity feature). Treat "Remote Control on Bedrock/Vertex" as **UNVERIFIED — needs human check / likely a mis-attribution** (what *is* Bedrock/Vertex-aware: `/loop` cadence, workflows availability, Fable-fallback). Source: `remote-control` (as of 2026-06-18).

---

## 6. Config — feeds: ch09, ch14, ch15

- **Settings precedence (highest→lowest):** Managed/policy > command-line args > local > project > user. Permission rules **merge** across scopes rather than override. Source: `settings` (as of 2026-06-18).
- **Managed/policy-only keys:**
  - `enforceAvailableModels` — when `true` with a non-empty `availableModels`, the Default model is also constrained to the allowlist. Requires **v2.1.175+**. Source: `model-config`, `settings` (as of 2026-06-18).
  - `requiredMinimumVersion` — minimum Claude Code version to start; older versions exit at startup. Source: `settings` (as of 2026-06-18).
  - `availableModels` — restrict selectable models (main session, subagents, advisor, aliases, fallback chains). When set in managed/policy settings, it **replaces** the merged lower-precedence result (the only way to enforce a strict allowlist, v2.1.175+). Source: `model-config`, `settings` (as of 2026-06-18).
  - `disableWorkflows` — disable dynamic workflows org-wide. Source: `workflows`, `settings` (as of 2026-06-18).
  - `allowManagedHooksOnly` — load only managed/SDK/force-enabled-plugin hooks. Source: `settings` (as of 2026-06-18).
  - `disableRemoteControl` — managed-settings device-level disable for Remote Control. Source: `remote-control` (as of 2026-06-18).
- **`~/.claude/rules/` precedence:** `.claude/rules/*.md` is a **parallel system to CLAUDE.md**, not a subsystem — unconditional rules load at launch at the **same priority as `.claude/CLAUDE.md`**. Scopes have a load order: **user-level (`~/.claude/rules/`) loads BEFORE project rules → project rules win** (read last = higher priority), mirroring the CLAUDE.md broad→specific assembly. Optional `paths:` glob frontmatter makes a rule load only when Claude reads matching files. Source: cert `architect-reference/src/content/chapters/d3-03-rules-path-scoping.mdx:52,54,70` (citing `claude-code-memory`) (as of 2026-06-18). Note: the live `settings` page did not surface the `rules/` precedence inline; the cert chapter is the verified in-repo source (cite `claude-code-memory` upstream).

---

## 7. Enterprise — feeds: ch15

- **Pricing (per MTok, input/output):** Opus 4.8 **$5/$25**; Sonnet 4.6 **$3/$15**; Haiku 4.5 **$1/$5**; **Fable 5 $10/$50** (2× Opus). Source: `models-overview` (as of 2026-06-18). Replaces any 4.6-era pricing table.
- **Tier → default model** (governs what an enterprise seat gets by default): Enterprise subscription seats default to **Sonnet 4.6**; Enterprise pay-as-you-go defaults to **Opus 4.8**. Source: `model-config` (as of 2026-06-18).
- **Governance surface (verified):** managed/policy settings (§6) + admin toggles at claude.ai/admin-settings/claude-code for Remote Control and Dynamic Workflows; OpenTelemetry monitoring; managed-settings hook enforcement; per-version model pinning via `ANTHROPIC_DEFAULT_*_MODEL` and `modelOverrides`. Source: `settings`, `model-config`, `security` (as of 2026-06-18).
- **Partner / integration counts** (e.g. "N connectors", Copilot preview dates, integration tallies): **UNVERIFIED — needs human check.** These are marketing-page figures that move monthly; the March "Copilot Feb 2026 preview" and partner numbers are stale. Pull live from anthropic.com / claude.com at authoring time — do not port the source's numbers.
- **Data residency specifics** (regional endpoint guarantees): Bedrock offers global vs regional endpoints; Vertex offers global/multi-region/regional, "guaranteed data routing through specific geographic regions." Beyond that endpoint-routing fact, a per-region residency commitment table is **UNVERIFIED — needs human check** (Trust Center / enterprise docs at authoring time). Source for the endpoint fact: `models-overview` Notes (as of 2026-06-18).
- **RBAC**: no distinct "RBAC" product surface verified; access control = managed-settings allowlists + admin toggles (above). If ch15 asserts a named RBAC feature, **UNVERIFIED — needs human check.**

---

## Summary of UNVERIFIED items (carry these as open flags to v1.0)

1. **HIPAA / ISO 42001 / inline compliance list** (§3) — Trust Center points only; not enumerated in `security` docs.
2. **`/code-review` ↔ `/simplify` per-version absorb/return history** (§5) — web-search-sourced; current functional split is solid, the version churn is not first-party-verified.
3. **"Remote Control on Bedrock/Vertex"** (§5) — appears to be a mis-attribution; Remote Control needs claude.ai OAuth and does not support API keys. Confirm intent before porting.
4. **Partner / integration / connector counts; Copilot preview dating** (§7) — marketing figures; pull live at authoring time.
5. **Data-residency per-region commitment table** (§7) — only the endpoint-routing fact is verified.
6. **Named enterprise RBAC feature** (§7) — not verified as a distinct surface; governance is managed-settings + admin toggles.
