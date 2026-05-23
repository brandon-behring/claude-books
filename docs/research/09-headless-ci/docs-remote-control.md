---
source_url: https://code.claude.com/docs/en/remote-control
canonical_url: https://code.claude.com/docs/en/remote-control
source_title: Continue local sessions from any device with Remote Control
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

# Remote Control — drive a local session from your phone (the "Remote Agents" announcement)

## Key takeaways

- Research preview; Claude Code v2.1.51+; Pro/Max/Team/Enterprise. **API keys not supported**.
- Three invocation modes: `claude remote-control` (server mode, no local interactive session), `claude --remote-control "<name>"` (interactive + remote), `/remote-control` inside an existing session.
- Outbound HTTPS only — never opens inbound ports. Routes through Anthropic API over TLS. Multiple short-lived credentials, each scoped + independently expiring.
- Server mode supports concurrent sessions: `--spawn worktree`, `--capacity 32` (default).
- Mobile push notifications: Claude pushes on long-running task completion or when a decision is needed; v2.1.110+ required; enable via `/config` → "Push when Claude decides".
- Some commands are **local-only** (interactive pickers like `/mcp`, `/plugin`, `/resume`); text-output commands work from mobile/web (`/compact`, `/clear`, `/context`, `/usage`, etc.).
- Team/Enterprise: off by default; admin toggle at `claude.ai/admin-settings/claude-code`.

## Quoted (citation-ready)

> "Remote Control connects claude.ai/code or the Claude app for iOS and Android to a Claude Code session running on your machine. Start a task at your desk, then pick it up from your phone on the couch or a browser on another computer."
>
> — Continue local sessions from any device with Remote Control, opening
>
> Anchor: `Remote Control connects claude.ai/code or the Claude app + to a Claude Code session`

> "When you start a Remote Control session on your machine, Claude keeps running locally the entire time, so nothing moves to the cloud."
>
> — Continue local sessions from any device with Remote Control, opening
>
> Anchor: `Claude keeps running locally + nothing moves to the cloud`

> "Your local Claude Code session makes outbound HTTPS requests only and never opens inbound ports on your machine. When you start Remote Control, it registers with the Anthropic API and polls for work."
>
> — Continue local sessions from any device with Remote Control, "Connection and security"
>
> Anchor: `Connection and security + Your local Claude Code session makes outbound HTTPS`

## Server-mode flags (the `claude remote-control` subcommand)

| Flag | Description |
|---|---|
| `--name "My Project"` | Session title visible in claude.ai/code session list |
| `--remote-control-session-name-prefix <prefix>` | Prefix for auto-gen names; defaults to hostname |
| `--spawn <mode>` | `same-dir` (default; conflict risk), `worktree` (each session in own `.claude/worktrees/...`), `session` (single-session mode, rejects extras) |
| `--capacity <N>` | Max concurrent sessions, default 32; incompatible with `--spawn=session` |
| `--verbose` | Detailed connection/session logs |
| `--sandbox` / `--no-sandbox` | Sandboxing for fs+network isolation. Off by default |

Press spacebar to toggle QR code display.

## Sub-modes comparison

| Mode | Command | Local session present? | QR code? | Name arg? |
|---|---|---|---|---|
| Server mode | `claude remote-control` | No (server only) | Yes | `--name "X"` |
| Interactive + remote | `claude --remote-control "X"` | Yes (full interactive) | Yes | Yes |
| From existing session | `/remote-control X` | Yes | Yes | Yes |
| VS Code extension | `/remote-control` (v2.1.79+) | Yes | No | No |

## Session-title resolution order

1. Name passed to `--name`, `--remote-control`, or `/remote-control`
2. Title set with `/rename`
3. Last meaningful message in existing history
4. Auto-generated like `myhost-graceful-unicorn`

## "Enable for all sessions" mode

`/config` → **Enable Remote Control for all sessions** → `true`. Each interactive process registers one remote session. For multiple concurrent sessions from a single process, use server mode.

## Disable / limitations

- **One remote session per interactive process** outside server mode
- Local process must keep running — close terminal/VS Code → session ends
- Extended network outage > ~10 minutes → session times out, process exits
- Ultraplan disconnects Remote Control (both occupy claude.ai/code UI)
- Some commands local-only: `/mcp`, `/plugin`, `/resume`

## Compare-to table from docs (the broader "work-while-away" map)

| Feature | Trigger | Claude runs on | Setup | Best for |
|---|---|---|---|---|
| Dispatch | Message a task from mobile app | Your machine (Desktop) | Pair mobile app with Desktop | Delegating work while you're away, minimal setup |
| Remote Control | Drive a running session from claude.ai/code or mobile app | Your machine (CLI or VS Code) | Run `claude remote-control` | Steering in-progress work from another device |
| Channels | Push events from chat app like Telegram/Discord, or your own server | Your machine (CLI) | Install channel plugin or build your own | Reacting to external events like CI failures or chat messages |
| Slack | Mention `@Claude` in a team channel | Anthropic cloud | Install Slack app w/ Claude Code on the web | PRs and reviews from team chat |
| Scheduled tasks | Set a schedule | CLI / Desktop / cloud | Pick frequency | Recurring automation like daily reviews |

## Cross-references

- See [[docs-channels]] for the event-push counterpart
- See [[docs-agent-view]] for the local-multi-session counterpart
- See [[docs-cli-reference]] for `--remote-control` / `--rc` flag detail
- See [[news-cwc-sf-2026]] — this is the "Remote Agents" launch from Code w/ Claude SF

## Open questions / follow-ups

- The "Remote Agents" branding at Code w/ Claude SF maps to this feature in docs (Remote Control). Confirm terminology consistency before publication.
- Whether Remote Control server mode counts as a "headless" deployment for managed-settings purposes (the Teams/Enterprise admin toggle controls it).
