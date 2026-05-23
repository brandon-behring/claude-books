---
source_url: https://code.claude.com/docs/en/agent-view
canonical_url: https://code.claude.com/docs/en/agent-view
source_title: Manage multiple agents with agent view
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

# Agent view + background sessions (`claude agents`, `--bg`)

## Key takeaways

- **Research preview**, Claude Code v2.1.139+. Hosts multiple background Claude Code sessions under a per-user supervisor process.
- Three dispatch entry points: agent view input, `/bg` inside a session, or `claude --bg "<prompt>"` from shell.
- Background sessions auto-isolate to git worktrees at `.claude/worktrees/` before editing files (unless inside a worktree already or `worktree.bgIsolation: "none"`).
- `claude --bg` plus `--name`, `--agent`, and the same configuration flags as regular `claude` (settings, MCP, plugins) — combine with `--allow-dangerously-skip-permissions` to keep `bypassPermissions` reachable.
- Scripting surface: `claude agents --json` prints live sessions, `claude attach <id>`, `claude logs <id>`, `claude stop <id>`, `claude respawn <id>` (or `--all`), `claude rm <id>`, `claude daemon status`.
- Supervisor process restarts sessions on binary updates; sessions persist across sleep, fail on shutdown.

## Quoted (citation-ready)

> "Agent view, opened with `claude agents`, is one screen for all your background sessions: what's running, what needs your input, and what's done. Dispatch new sessions, watch their state at a glance instead of scrolling through transcripts, and step in only when one needs you. Each background session is a full Claude Code conversation that keeps running without a terminal attached, so you can open it, reply, and leave whenever you want."
>
> — Manage multiple agents with agent view, opening
>
> Anchor: `Agent view + opened with claude agents`

> "Background sessions don't need any terminal open to keep working. A separate supervisor process runs them, so you can close agent view, close your shell, or start a new interactive session and your dispatched work keeps going."
>
> — Manage multiple agents with agent view, "Read session state"
>
> Anchor: `Background sessions don't need any terminal + open to keep working`

> "Every background session, whether started from agent view, `/bg`, or `claude --bg`, starts in your working directory. Before editing files, Claude moves the session into an isolated git worktree under `.claude/worktrees/`, so parallel sessions can read the same checkout but each writes to its own."
>
> — Manage multiple agents with agent view, "How file edits are isolated"
>
> Anchor: `How file edits are isolated + Every background session whether started`

## Session state model

| State | Icon | Meaning |
|---|---|---|
| Working | Animated | Tools/response in progress |
| Needs input | Yellow | Question or permission decision needed |
| Idle | Dimmed | Nothing to do; ready for next prompt |
| Completed | Green | Task finished successfully |
| Failed | Red | Task ended with error |
| Stopped | Grey | Stopped via `Ctrl+X` or `claude stop` |

Icon **shape**:
- `✻` / animated `✽` — process alive, replies immediately
- `∙` — process exited; peek/reply/attach restarts from saved state
- `✢` — `/loop` session sleeping between iterations (row shows run count + countdown)

The `●` at right edge is the PR-status indicator (separate from state).

## Shell-driven dispatch

```bash
# Background a session with a name
claude --bg --name "flaky-test-fix" "investigate the flaky SettingsChangeDetector test"
# Returns: short ID + mgmt commands

# Use a specific subagent
claude --agent code-reviewer --bg "address review comments on PR 1234"

# Open agent view scoped to a directory
claude agents --cwd ~/projects/my-app

# Set defaults for ALL dispatched sessions from this agent view
claude agents --permission-mode plan --model opus --effort high
```

## JSON scripting surface (`claude agents --json`)

Each entry has: `pid`, `cwd`, `kind`, `startedAt`, plus `sessionId`, `name`, `status` when set. Combine with `--cwd <path>` to filter.

## Session lifecycle commands

| Command | Purpose |
|---|---|
| `claude agents [--json] [--cwd <path>]` | Open view, or print JSON, or scope |
| `claude attach <id>` | Attach to session in current terminal |
| `claude logs <id>` | Print recent output |
| `claude stop <id>` (or `kill`) | Stop session |
| `claude respawn <id>` | Restart session with conversation intact |
| `claude respawn --all` | Restart every running session (e.g. binary update) |
| `claude rm <id>` | Remove from list (transcript stays for `--resume`) |
| `claude daemon status` | Supervisor state, version, socket dir, worker count |

## Worktree isolation (key for parallel sessions)

- Background sessions edit in `.claude/worktrees/<auto-name>/` by default.
- Override via `~/.claude/settings.json`:

```json
{
  "worktree": {
    "bgIsolation": "none"
  }
}
```

(Requires v2.1.143+.)

- Skipped when: already inside a linked git worktree; cwd isn't a git repo and no `WorktreeCreate` hook configured; write is outside cwd.

## Supervisor process model

- Per-user, separate from terminal/agent view; starts automatically on first dispatch
- Authenticates with same credentials as interactive sessions; no extra network calls beyond model API
- Sessions stopped after ~1 hour idle (unattached); pinned (`Ctrl+T`) sessions exempt
- Sleep preserves sessions (supervisor reconnects on wake); shutdown stops them (appear as failed)
- Watches Claude Code binary on disk; restarts into new version after auto-updater replaces it (local file watch, not network check)
- State stored under `~/.claude/`:

| Path | Contents |
|---|---|
| `~/.claude/daemon.log` | Supervisor log |
| `~/.claude/daemon/roster.json` | List of running background sessions |
| `~/.claude/jobs/<id>/state.json` | Per-session state |

Set `CLAUDE_CONFIG_DIR` for an isolated supervisor instance.

## Disable knobs

- `disableAgentView: true` in settings — turn off entirely
- `CLAUDE_CODE_DISABLE_AGENT_VIEW=1` env var
- Admin-enforceable via managed settings

## Cross-references

- See [[docs-scheduling]] for `/loop`-induced background pseudo-sessions
- See [[docs-cli-reference]] for the full `--bg`, `--worktree`, `--agent` flag descriptions
- See [[docs-remote-control]] for the manual counterpart (drive a session from another device)

## Open questions / follow-ups

- Whether `claude agents --json` honors `--add-dir` / `--plugin-dir` / `--mcp-config` in its output payloads (the docs say these flags pass through to dispatched sessions but don't address whether they're surfaced in the JSON status).
- Behavior of the supervisor when the host has a strict no-orphan-process policy (e.g. CI containers); the docs assume a persistent user environment.
