---
topic: headless-ci
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
cert_domains: [3]
cert_task_areas: ["CI/CD integration (`-p` flag, `--output-format json`, `--json-schema`)"]
---

# Dossier 09 — Headless mode, CI/CD integration, automation

Primary-source cache for cert domain **D3 Claude Code Configuration & Workflows**, specifically the public task area "**CI/CD integration (`-p` flag, `--output-format json`, `--json-schema`)**". Owner chapter: handbook ch12 ("Headless & Automation"). Sibling dossiers: 04 (Agent SDK — programmatic automation), 08 (Claude Code internals — config + CLI surfaces).

## Summary

Claude Code's CI/CD story is a stack of layered surfaces, each progressively more managed:

1. **CLI primitive** — `claude -p "<query>"` (optionally `--bare`) is the headless entry point. Every other automation surface eventually wraps it.
2. **Self-hosted CI** — wrap `-p` in your own GitHub Actions or GitLab CI/CD job. Direct Anthropic API, Bedrock, Vertex, or Microsoft Foundry — all support OIDC / Workload Identity Federation so no static keys live in CI.
3. **Anthropic-managed services** — Code Review (multi-agent, PR-triggered) and Security Reviews (Anthropic-hosted, automated PR scans) take the wrap-it-yourself burden off teams; both bill via usage credits.
4. **Schedulers** — three options trading reliability for proximity:
   - `/loop` (in-session, your machine)
   - Desktop scheduled tasks (your machine, app must be open)
   - **Routines** (Anthropic cloud, autonomous, schedule + API + GitHub triggers)
5. **Reactive surfaces** — Channels (webhook/chat events push into a running session), Remote Control (drive a local session from phone/web), Agent View (parallel background sessions with worktree isolation, `claude --bg`).

The unifying theme — and the one to push into chapter prose — is **trust gates and progressive delegation**: a manual local run, then a scripted local run, then a CI job, then a scheduled CI job, then a fully autonomous cloud routine reacting to events. Each step adds latency-tolerance and removes a human-in-the-loop. Every layer above the CLI inherits the same `--allowedTools` / `--permission-mode` semantics, so reasoning about safety is portable across the stack.

## Notes table

| File | Source | Tier | Topic |
|---|---|---|---|
| [`docs-headless.md`](./docs-headless.md) | code.claude.com/docs/en/headless | T1 | `claude -p`, `--bare`, output formats, JSON shapes, retry events |
| [`docs-cli-reference.md`](./docs-cli-reference.md) | code.claude.com/docs/en/cli-reference | T1 | Full flag + subcommand table for headless/CI |
| [`docs-github-actions.md`](./docs-github-actions.md) | code.claude.com/docs/en/github-actions | T1 | GH Actions YAML, v1.0 GA, Bedrock + Vertex workflows |
| [`docs-gitlab-ci-cd.md`](./docs-gitlab-ci-cd.md) | code.claude.com/docs/en/gitlab-ci-cd | T1 | GitLab beta integration, `AI_FLOW_*` variables, providers |
| [`docs-code-review.md`](./docs-code-review.md) | code.claude.com/docs/en/code-review | T1 | Managed multi-agent PR review, `REVIEW.md`, severity flags |
| [`docs-scheduling.md`](./docs-scheduling.md) | code.claude.com/docs/en/{scheduled-tasks,routines,desktop-scheduled-tasks} | T1 | `/loop`, Routines, Desktop tasks; comparison table |
| [`docs-agent-view.md`](./docs-agent-view.md) | code.claude.com/docs/en/agent-view | T1 | `claude agents`, `--bg`, supervisor process, worktree isolation |
| [`docs-remote-control.md`](./docs-remote-control.md) | code.claude.com/docs/en/remote-control | T1 | Remote Agents — drive local sessions from phone/web |
| [`docs-channels.md`](./docs-channels.md) | code.claude.com/docs/en/channels | T1 | Webhook + chat-bridge front-ends to running sessions |
| [`docs-ultrareview.md`](./docs-ultrareview.md) | code.claude.com/docs/en/ultrareview | T1 | On-demand cloud multi-agent review, CI subcommand |
| [`news-security-review.md`](./news-security-review.md) | claude.com/blog/automate-security-reviews-with-claude-code | T1 | `/security-review` command + GitHub Action |
| [`news-cwc-sf-2026.md`](./news-cwc-sf-2026.md) | simonwillison.net/2026/May/6/code-w-claude-2026/ | T3 | Code w/ Claude SF event recap (Anthropic primary URL not stable) |
| [`github-claude-code-action.md`](./github-claude-code-action.md) | github.com/anthropics/claude-code-action | T2 | Repo + release cadence; WIF support added v1.0.130 |

## Cert task areas covered

**D3 — Claude Code Configuration & Workflows (handbook ch12 primary)**

- ✅ **CI/CD integration (`-p` flag, `--output-format json`, `--json-schema`)** — `docs-headless.md`, `docs-cli-reference.md`, `docs-github-actions.md`, `docs-gitlab-ci-cd.md`
- ✅ Related: plan mode vs direct execution, custom slash commands, CLAUDE.md hierarchy — also touched via `docs-code-review.md` (`REVIEW.md` pattern)

Adjacent: D1 (agentic architecture) — the Routines API trigger + GitHub trigger surfaces overlap with multi-agent orchestration; cross-referenced in the dossier rather than duplicated.

## CLI flag cheat sheet — headless / CI essentials

Pulled from [`docs-cli-reference.md`](./docs-cli-reference.md); one line per flag.

### Print mode core

- `-p`, `--print` — Non-interactive; exit after responding. Canonical CI entry point.
- `--bare` — Skip auto-discovery of hooks/skills/plugins/MCP/CLAUDE.md. Recommended for scripts.
- `--output-format <text|json|stream-json>` — Set output shape; `json` adds `result`, `session_id`, `total_cost_usd`, per-model costs.
- `--input-format <text|stream-json>` — Input shape for print mode.
- `--json-schema '<schema>'` — Validate output to schema; adds `structured_output` field.
- `--max-turns N` — Limit agentic turns; exits non-zero if reached. Print mode only.
- `--max-budget-usd <N>` — Spend cap before stopping. Print mode only.
- `--no-session-persistence` — Don't save session to disk. Print mode only.
- `--include-partial-messages` — Emit streaming partial events. Requires `--output-format stream-json`.
- `--include-hook-events` — Emit hook lifecycle events. Requires `--output-format stream-json`.
- `--exclude-dynamic-system-prompt-sections` — Move per-machine context to first user message (better prompt-cache reuse across CI runners).

### Permissions / tools

- `--allowedTools "Bash(git *),Read,Edit"` — Auto-approve list (uses permission rule syntax with prefix matching).
- `--disallowedTools "<patterns>"` — Deny list.
- `--tools "Bash,Edit,Read"` (or `""` to disable all, `"default"` for all) — Restrict available built-in tools.
- `--permission-mode <default|acceptEdits|plan|auto|dontAsk|bypassPermissions>` — Initial permission mode. **`dontAsk` is the canonical locked-down CI mode.**
- `--dangerously-skip-permissions` — Alias for `--permission-mode bypassPermissions`. One-time interactive acceptance required.
- `--permission-prompt-tool <mcp_tool>` — Route prompts to an MCP tool in non-interactive mode.

### Session continuity in CI

- `--continue`, `-c` — Load most recent conversation in cwd.
- `--resume`, `-r <id|name>` — Resume specific session.
- `--fork-session` — When resuming, create new session ID (branch off a checkpoint).
- `--session-id <UUID>` — Use specific UUID.
- `--from-pr <num|url>` — Resume sessions linked to a PR (GitHub, GitHub Enterprise, GitLab MR, Bitbucket PR).

### Configuration loading

- `--settings <file-or-json>` — Override settings.
- `--mcp-config <file-or-json>` — Load MCP servers.
- `--strict-mcp-config` — Use only `--mcp-config` servers, ignore all others.
- `--plugin-dir <path>` / `--plugin-url <url>` — Per-session plugin load.
- `--agents '<json>'` — Define subagents inline via JSON.
- `--add-dir <paths>` — Grant file access to additional dirs (not config discovery).
- `--setting-sources <user,project,local>` — Limit which setting layers are loaded.

### System prompt

- `--system-prompt "..."` — Replace default entirely.
- `--system-prompt-file <path>` — Replace from file.
- `--append-system-prompt "..."` — Append (keeps tool guidance + safety).
- `--append-system-prompt-file <path>` — Append from file.

### Background + parallel

- `--bg "<prompt>"` — Start background session, return immediately. Prints session ID + mgmt commands.
- `--worktree <name|#PR|PR-URL>`, `-w` — Run in isolated git worktree at `.claude/worktrees/<name>`.
- `--agent <name>` — Use specific subagent as main agent.

### Provider / model

- `--model <alias|full-name>` — `opus`/`sonnet` alias or full ID.
- `--effort <low|medium|high|xhigh|max>` — Effort level (model-dependent).
- `--fallback-model <model>` — Auto-fall-back when default overloaded (print + background only).
- `--betas <header>` — Beta headers (API-key users).

### Auth helpers

- `claude setup-token` — Generate long-lived OAuth token for CI (Claude subscription required).
- `claude auth status [--text]` — Auth status as JSON; exits 0 if logged in, 1 if not.

## Which scheduler — comparison block

| Criterion | Cloud Routines | Desktop tasks | `/loop` (in-session) | GitHub Actions `schedule` cron |
|---|---|---|---|---|
| Runs on | Anthropic cloud | Your machine | Your machine | GitHub runner |
| Needs machine awake | No | Yes (app open) | Yes (session open) | No (GitHub-hosted) |
| Needs session open | No | No | **Yes** | No |
| Persistent across restarts | Yes | Yes | Restored on `--resume` if unexpired | Yes |
| Access to local files | No (fresh clone) | Yes | Yes | No (clone of repo) |
| MCP servers | Connectors per task | Config + connectors | Inherits from session | `claude_args: --mcp-config` |
| Permission prompts | No (autonomous) | Configurable per task | Inherits from session | None (CI mode) |
| Min interval | **1 hour** | 1 minute | 1 minute | 5 minutes (GitHub limit) |
| Triggers besides schedule | API webhook, GitHub events | Manual run | — | All GitHub events |
| Auto-expiry | No | No | 7 days | No |
| Best for | Truly unattended automation, mobile-friendly | Local-resource tasks, configurable safety | Polling/babysitting during active work | Pipeline-coupled jobs already in CI |

**Heuristic** (from docs): cloud Routines for "work that should run reliably without your machine"; Desktop "when you need access to local files and tools"; `/loop` "for quick polling during a session"; GitHub Actions when the workflow naturally lives in CI alongside other jobs.

## Trust-gate ladder (chapter framing)

The recurring chapter theme is the **staged progression of trust**. Every step preserves the previous step's safety contract while removing one piece of human oversight:

1. **Manual local** — `claude` in interactive mode. Every tool prompts.
2. **Scripted local** — `claude -p --allowedTools "Read,Edit"` in a shell script. Pre-approved tool list.
3. **Self-hosted CI** — `claude-code-action@v1` or GitLab job. Same `--allowedTools` discipline, plus repo-level GitHub App permissions, plus branch protection, plus PR review.
4. **Managed CI** — Code Review / Security Reviews. Anthropic runs the agents on their infra; you tune via `CLAUDE.md` + `REVIEW.md`; findings are advisory (neutral checks).
5. **Scheduled CI / cron** — GitHub Actions `schedule` or Routines schedule trigger. Same as 3/4 but periodic; cost discipline matters more (`--max-budget-usd`, `--max-turns`).
6. **Event-driven autonomous** — Routines API trigger or GitHub event trigger; Channels webhook receiver. Reactive; no human in the loop on the **trigger** side; safety still gated by tool allowlists, branch-push restrictions (`claude/`-prefixed by default), and managed-settings.
7. **Drive-by-mobile (Remote Agents)** — flip the model: human-in-the-loop, but the human is on a phone instead of the terminal. Less "automation," more "ambient computing."

## Provider matrix — who supports what

| Provider | GitHub Actions | GitLab CI/CD | Remote Control | Channels | Routines | Code Review |
|---|---|---|---|---|---|---|
| Anthropic direct API | ✅ (`anthropic_api_key` or WIF) | ✅ (`ANTHROPIC_API_KEY` masked var) | claude.ai OAuth only | ✅ (API key or claude.ai) | claude.ai only | claude.ai only |
| Amazon Bedrock | ✅ (`use_bedrock`, OIDC) | ✅ (OIDC + STS) | ❌ | ❌ | ❌ | ❌ |
| Google Vertex AI | ✅ (`use_vertex`, WIF) | ✅ (WIF) | ❌ | ❌ | ❌ | ❌ |
| Microsoft Foundry | ✅ (`use_foundry`) | beta | ❌ | ❌ | ❌ | ❌ |

Pattern: managed/cloud features (Routines, Code Review, Remote Control, Channels) require claude.ai authentication; self-hosted CI (GitHub Actions, GitLab) supports the full provider matrix including enterprise-friendly Bedrock/Vertex/Foundry.

## Anti-patterns called out in source docs

- **Hardcoding API keys** in workflow files (every CI doc warns; always use repo secrets).
- **Forgetting `--bare`** in scripted contexts — picks up local `~/.claude` hooks and produces non-reproducible CI runs.
- **Pinning `@beta`** on `claude-code-action` — v1.0 introduced breaking changes from beta.
- **Relying on Code Review check run to gate merges** — it's intentionally a *neutral* check; parse the machine-readable severity payload from check-run output with `gh` + `jq` if you want to fail merges on Important findings.
- **Long `REVIEW.md`** — dilutes high-priority rules; keep it focused on what changes review behavior.
- **`@claude review` instead of `@claude review once`** — the former subscribes the PR to push-triggered reviews, multiplying cost.
- **Closing the terminal on `/loop`** — tasks die. Use Routines for unattended scheduling.
- **Granting `bypassPermissions` in shared CI** — modes `bypassPermissions` and `auto` require one-time interactive acceptance per machine; CI runners need their own acceptance flow or won't work.

## Open questions / gaps for chapter authors

1. **CI auto-fix** — announced at Code w/ Claude SF (May 6, 2026) but as of fetch date only documented in a release-notes entry (`/docs/en/whats-new/2026-w15`). Track for full docs page.
2. **`/security-review` docs page** — `code.claude.com/docs/en/security-review` returns 404; only the blog post + third-party coverage available. Track.
3. **Code w/ Claude SF official recap URL** — not stable; the `news-cwc-sf-2026.md` note relies on Simon Willison's live blog. Upgrade to T1 when canonical URL is locatable.
4. **`bugs.json` schema** for `claude ultrareview --json` — not documented inline; a real-run teardown would help.
5. **Microsoft Foundry GitHub Actions YAML** — not in Anthropic docs; only Microsoft Learn has the canonical pattern.
6. **`gitlab-mcp-server` tool surface** — `mcp__gitlab` is referenced as an `--allowedTools` entry but the actual tool list / capabilities aren't documented at code.claude.com. Likely lives in the GitLab issue tracker.
7. **Routine API trigger** uses the beta header `experimental-cc-routine-2026-04-01` — track for stabilization.
8. **Pricing change June 15, 2026** — Agent SDK / `claude -p` usage will draw from a separate "Agent SDK credit" allotment on subscription plans. Verify exact mechanics when ship is closer.
9. **Background sessions in CI containers** — the supervisor process model assumes persistent user environment; behavior in ephemeral CI containers (no orphan processes) isn't documented.

## Cross-references to sibling dossiers

- [[../04-agent-sdk/README]] — the Python/TypeScript SDK is the programmatic counterpart to `claude -p`. SDK home for programmatic automation; this dossier is the CLI/CI consumer side.
- [[../08-claude-code-internals/README]] (when populated) — config hierarchy, settings precedence, hook lifecycle. The CLI flags here override settings; this dossier doesn't duplicate the settings deep-dive.
- [[../landscape-2026-05]] §1.3, §7.2 — chapter-level positioning for these surfaces.

## Last verified

- 2026-05-22 — all docs pages and the `claude-code-action` repo metadata verified live this date.
- Volatility note: GitHub Actions YAML inputs (especially provider env-var patterns) and the Code Review / Routines pricing surfaces are evolving. Re-verify before book ship.
