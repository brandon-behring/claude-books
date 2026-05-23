---
source_url: https://code.claude.com/docs/en/cli-reference
canonical_url: https://code.claude.com/docs/en/cli-reference
source_title: CLI reference
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: headless-ci
tier: T1-official
cert_domains: [3]
cert_task_areas: ["CI/CD integration (`-p` flag, `--output-format json`, `--json-schema`)"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# CLI reference — flag cheat sheet for headless / CI usage

## Key takeaways

- The CLI reference page enumerates 25+ commands and 50+ flags; the table below pulls the ones that matter for headless / CI / scripting.
- Anthropic explicitly warns: "`claude --help` does not list every flag, so a flag's absence from `--help` does not mean it is unavailable." Trust the docs page, not `--help`.
- Several commands listed here ship JSON variants for scripted use (`claude auth status`, `claude agents --json`, `claude auto-mode defaults`, `claude ultrareview --json`).
- Authentication helpers: `claude setup-token` (long-lived OAuth for CI), `claude auth status` (exits 0 if logged in, 1 if not, JSON or `--text`).

## Quoted (citation-ready)

> "Customize Claude Code's behavior with these command-line flags. `claude --help` does not list every flag, so a flag's absence from `--help` does not mean it is unavailable."
>
> — CLI reference, "CLI flags"
>
> Anchor: `CLI flags + Customize Claude Code's behavior with these`

> "If you mistype a subcommand, Claude Code suggests the closest match and exits without starting a session. For example, `claude udpate` prints `Did you mean claude update?`."
>
> — CLI reference, "CLI commands"
>
> Anchor: `CLI commands + If you mistype a subcommand`

## Commands relevant to headless / CI

| Command | Purpose | CI relevance |
|---|---|---|
| `claude -p "query"` | Query via SDK, then exit | Canonical CI entry point |
| `claude -c -p "query"` | Continue most recent conversation via SDK | Multi-step CI pipelines |
| `claude -r "<session>" "query"` | Resume by ID or name | Pipeline session reuse |
| `claude auth status` | Auth status as JSON (or `--text`); exit 0/1 | CI prerequisite check |
| `claude setup-token` | Generate long-lived OAuth token (Claude subscription required) | Headless CI auth |
| `claude agents --json` | Print live background sessions as JSON array | Scripted dispatcher monitoring |
| `claude auto-mode defaults` | Print built-in auto-mode classifier rules as JSON | Audit permission ruleset |
| `claude daemon status` | Background supervisor state, version, socket dir, worker count; exits 1 if down | Diagnostic for background sessions |
| `claude ultrareview [target] --json` | Run ultrareview non-interactively; prints findings; exits 0 success / 1 failure | CI security gate |
| `claude attach <id>` | Attach to a background session | Manual intervention from a CI runner |
| `claude logs <id>` | Print recent output from a background session | Capture artifacts |
| `claude stop <id>` (or `claude kill`) | Stop a background session | Cleanup |
| `claude respawn <id>` (or `--all`) | Restart background session with conversation intact (e.g., pick up updated binary) | Rolling restart |
| `claude rm <id>` | Remove background session from list (transcript stays for `--resume`) | Cleanup |
| `claude project purge [path]` | Delete project state (transcripts, task lists, debug logs, file-edit history); supports `--dry-run`, `-y`, `-i`, `--all` | Tear-down |
| `claude remote-control` | Start Remote Control server (server mode; no local interactive session) | Long-running drop-in for remote-driven jobs |
| `claude install [version]` | Install/reinstall native binary (`2.1.118`, `stable`, `latest`) | Pin Claude Code version in CI image |
| `claude update` | Update to latest version | Refresh CI worker |

## Flags critical to headless / scripted use

### Core print-mode flags

- `--print`, `-p` — print response without interactive mode
- `--output-format <text|json|stream-json>` — set output shape (print mode)
- `--input-format <text|stream-json>` — set input shape (print mode)
- `--json-schema '<schema>'` — print-mode-only; validates output against JSON Schema and adds `structured_output` field
- `--max-turns N` — limit agentic turns; exits with error when reached (no limit by default; print mode only)
- `--max-budget-usd <N>` — max dollar spend before stopping (print mode only)
- `--no-session-persistence` — don't save to disk (print mode only). Or set `CLAUDE_CODE_SKIP_PROMPT_HISTORY`
- `--include-partial-messages` — emit partial stream events; requires `--print` and `--output-format stream-json`
- `--include-hook-events` — include all hook lifecycle events; requires `--output-format stream-json`
- `--replay-user-messages` — re-emit user messages on stdout (requires `--input-format stream-json --output-format stream-json`)
- `--exclude-dynamic-system-prompt-sections` — move per-machine sections (cwd, env info, memory paths, git flag) to first user message for better prompt-cache reuse across machines (only with default system prompt)

### Bare/scripted mode

- `--bare` — skip auto-discovery of hooks/skills/plugins/MCP/auto memory/CLAUDE.md (sets `CLAUDE_CODE_SIMPLE`); recommended for scripts
- `--init` — run Setup hooks with `init` matcher (print mode only)
- `--init-only` — run Setup + SessionStart hooks then exit
- `--maintenance` — run Setup hooks with `maintenance` matcher (print mode only)

### Session management

- `--continue`, `-c` — load most recent conversation in cwd
- `--resume`, `-r <id|name>` — resume specific session (also shows picker; BG sessions marked `bg` as of v2.1.144)
- `--fork-session` — when resuming, create new session ID instead of reusing original
- `--session-id <UUID>` — use specific UUID for the conversation
- `--from-pr <num|url>` — resume sessions linked to a PR (GitHub, GitHub Enterprise, GitLab MR, Bitbucket PR)
- `--name`, `-n` — display name; resumable via `claude --resume <name>`

### Permissions / tools

- `--allowedTools "Bash(git *),Read"` — auto-approve (uses [permission rule syntax](https://code.claude.com/docs/en/settings#permission-rule-syntax))
- `--disallowedTools "<patterns>"` — deny rules (bare name removes from context; scoped rule denies matching calls only)
- `--tools "Bash,Edit,Read"` — restrict available built-in tools (`""` disables all; `"default"` enables all)
- `--permission-mode <default|acceptEdits|plan|auto|dontAsk|bypassPermissions>` — set initial permission mode
- `--dangerously-skip-permissions` — alias for `--permission-mode bypassPermissions`
- `--allow-dangerously-skip-permissions` — add `bypassPermissions` to Shift+Tab cycle without starting in it
- `--permission-prompt-tool <mcp_tool>` — handle permission prompts via MCP in non-interactive mode

### System prompt control (work in interactive + non-interactive)

| Flag | Behavior |
|---|---|
| `--system-prompt` | Replace entire default prompt |
| `--system-prompt-file` | Replace with file contents |
| `--append-system-prompt` | Append to default prompt |
| `--append-system-prompt-file` | Append file contents to default prompt |

`--system-prompt` and `--system-prompt-file` are mutually exclusive; append flags can combine with either. Anthropic's guidance: append when Claude Code's default identity still fits (preserves tool guidance + safety); replace when "the surface, identity, or permission model differs from Claude Code's, like a non-coding agent in a pipeline that no human watches."

### Background / parallel execution

- `--bg "<prompt>"` — start as background session, return immediately (prints session ID + mgmt commands)
- `--agent <name>` — specify subagent (overrides setting)
- `--agents '<json>'` — define custom subagents dynamically via inline JSON
- `--worktree`, `-w <name|#PR|PR-URL>` — start in isolated git worktree at `<repo>/.claude/worktrees/<name>`
- `--tmux` (or `--tmux=classic`) — create tmux session for the worktree; requires `--worktree`
- `--from-pr <num|url>` — fetch PR from `origin` and resume sessions linked to it

### Provider / model

- `--model <alias|full-name>` — `sonnet`/`opus` alias or full ID; overrides `model` setting and `ANTHROPIC_MODEL`
- `--effort <low|medium|high|xhigh|max>` — model-dependent effort levels (Opus 4.7 supports all; non-persistent)
- `--fallback-model <model>` — auto-fall-back when default is overloaded (takes effect in `-p` and background sessions only; ignored interactively)
- `--betas <beta-header>` — beta headers in API requests (API-key users only)

### MCP + plugins

- `--mcp-config <file-or-json>` — load MCP servers from files/strings (space-separated)
- `--strict-mcp-config` — use ONLY MCP servers from `--mcp-config`, ignoring all others
- `--plugin-dir <path>` — load plugin from dir or `.zip` archive (session only; repeat flag)
- `--plugin-url <url>` — fetch plugin `.zip` from URL (session only; repeat or space-separated)
- `--channels <plugin:name@marketplace ...>` — MCP server channels to listen for (research preview; requires claude.ai auth)
- `--dangerously-load-development-channels <server:name|plugin:...>` — bypass channel allowlist for dev

### Settings + directories

- `--settings <file-or-json>` — override settings (precedence: this > files)
- `--setting-sources <user,project,local>` — comma-separated source allowlist
- `--add-dir <paths>` — additional working dirs (grants file access; not config discovery)

### Remote + web

- `--remote-control`, `--rc` — interactive session with Remote Control enabled
- `--remote "<task>"` — create new web session on claude.ai
- `--teleport` — resume a web session in local terminal
- `--ide` — auto-connect to IDE if exactly one is available
- `--chrome` / `--no-chrome` — Chrome browser integration

### Misc

- `--debug "<categories>"` — debug mode with optional category filtering (e.g. `"api,mcp"`)
- `--debug-file <path>` — write logs to specific file (implicit debug)
- `--disable-slash-commands` — disable all skills + commands
- `--verbose` — full turn-by-turn output (overrides `viewMode` setting)
- `--teammate-mode <auto|in-process|tmux>` — agent-team display mode

## Removed flags (for migration history)

- `--enable-auto-mode` — **removed in v2.1.111** (auto mode is now in the Shift+Tab cycle; use `--permission-mode auto` to start in it)

## Cross-references

- [[docs-headless]] — `-p` deep dive
- [[docs-github-actions]] — `claude_args` in workflows takes any of these flags
- [[docs-scheduling]] — `/loop`, `/schedule`, and the cron CLI tools
- [[docs-agent-view]] — `claude agents`, `--bg`, `--worktree`
- [[docs-remote-control]] — `claude remote-control`, `--rc`

## Open questions / follow-ups

- Behavior of `--exclude-dynamic-system-prompt-sections` with custom system prompts (docs say "ignored when `--system-prompt` or `--system-prompt-file` is set") — does it warn or silently no-op?
- Whether `claude install <version>` honors pinned-channel constraints when called inside a container without the auto-updater.
