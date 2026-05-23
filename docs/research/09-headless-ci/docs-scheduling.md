---
source_url: https://code.claude.com/docs/en/scheduled-tasks
canonical_url: https://code.claude.com/docs/en/scheduled-tasks
source_title: Run prompts on a schedule (`/loop` + CronCreate/CronList/CronDelete)
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

# Scheduling — `/loop`, Routines (cloud), Desktop tasks

Composite note covering three sibling Anthropic docs pages: in-session `/loop`, cloud Routines, and Desktop scheduled tasks. Picking the right scheduler is the chapter's core decision.

## Key takeaways

- **Three schedulers, three trade-offs**:
  - `/loop` (session-scoped, on your machine, requires session open)
  - Routines (Anthropic cloud, runs autonomously, supports schedule/API/GitHub triggers, **1-hour min interval**)
  - Desktop scheduled tasks (your machine, app must be open, 1-min min, configurable permission modes)
- `/loop <interval> <prompt>` runs a prompt on a fixed cron-derived schedule. `/loop <prompt>` (no interval) lets Claude **self-pace** (1m–1h delay between iterations).
- `/loop` (no args) runs a built-in maintenance prompt — checks branch PR status, addresses comments, runs cleanup. Override with `.claude/loop.md` (project) or `~/.claude/loop.md` (user). Truncated at 25 KB.
- All scheduled tasks expire automatically after **7 days**; one-shot tasks scheduled at `:00`/`:30` fire up to 90s early (jitter); recurring tasks fire up to 30 minutes after scheduled time.
- Underlying tools: `CronCreate` (5-field cron expr + prompt + recurring flag), `CronList`, `CronDelete`. Cap: 50 scheduled tasks per session.
- Routines API trigger: POST to `/v1/claude_code/routines/<id>/fire` with bearer token + `anthropic-beta: experimental-cc-routine-2026-04-01` header. Body accepts `{"text": "<context>"}` (freeform, not parsed).

## Quoted (citation-ready)

> "Scheduled tasks let Claude re-run a prompt automatically on an interval. Use them to poll a deployment, babysit a PR, check back on a long-running build, or remind yourself to do something later in the session."
>
> — Run prompts on a schedule, opening
>
> Anchor: `Scheduled tasks let Claude re-run a prompt + automatically on an interval`

> "A routine is a saved Claude Code configuration: a prompt, one or more repositories, and a set of connectors, packaged once and run automatically. Routines execute on Anthropic-managed cloud infrastructure, so they keep working when your laptop is closed."
>
> — Automate work with routines, opening
>
> Anchor: `Automate work with routines + A routine is a saved Claude Code configuration`

> "Scheduled tasks run on your machine. Desktop checks the schedule every minute while the app is open and starts a fresh session when a task is due, independent of any manual sessions you have open."
>
> — Schedule recurring tasks in Claude Code Desktop, "How scheduled tasks run"
>
> Anchor: `How scheduled tasks run + Scheduled tasks run on your machine`

> "Tasks only fire while Claude Code is running and idle. Closing the terminal or letting the session exit stops them firing."
>
> — Run prompts on a schedule, "Limitations"
>
> Anchor: `Limitations + Tasks only fire while Claude Code is running`

## Which scheduler comparison (the chapter centerpiece)

| Property | Cloud Routines (`/schedule`) | Desktop tasks | `/loop` (session) |
|---|---|---|---|
| Runs on | Anthropic cloud | Your machine | Your machine |
| Requires machine on | **No** | Yes | Yes |
| Requires open session | No | No (app open) | **Yes** |
| Persistent across restarts | Yes | Yes | Restored on `--resume` if unexpired |
| Access to local files | No (fresh clone) | Yes | Yes |
| MCP servers | Connectors per task | Config + connectors | Inherits from session |
| Permission prompts | No (autonomous) | Configurable per task | Inherits from session |
| Minimum interval | **1 hour** | 1 minute | 1 minute |
| 7-day auto-expiry | No | No | Yes (recurring + one-shots) |
| Triggers besides schedule | API (HTTP), GitHub events | Manual run | Esc to cancel |

**Heuristic** (from docs): cloud for "work that should run reliably without your machine"; Desktop "when you need access to local files and tools"; `/loop` "for quick polling during a session."

## `/loop` usage forms

| Input | Example | Behavior |
|---|---|---|
| Interval + prompt | `/loop 5m check the deploy` | Fixed cron schedule |
| Prompt only | `/loop check the deploy` | Claude self-paces 1m–1h |
| Interval only (or bare) | `/loop` or `/loop 15m` | Runs built-in maintenance prompt (or `loop.md`) |

Supported units: `s` (rounds up to 1m), `m`, `h`, `d`. Intervals not mapping cleanly to cron steps (`7m`, `90m`) are rounded to nearest interval that does.

Self-paced loops may use the **Monitor tool** directly (background script streams output) — avoids polling, more token-efficient.

On **Bedrock / Vertex / Foundry**: prompts without interval run on fixed 10-minute schedule; bare `/loop` prints usage instead of running maintenance prompt; `loop.md` isn't read.

## Cron expression reference (5-field, vixie-cron semantics)

| Example | Meaning |
|---|---|
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour on the hour |
| `7 * * * *` | Every hour at 7 past |
| `0 9 * * *` | Daily 9am local |
| `0 9 * * 1-5` | Weekdays 9am local |
| `30 14 15 3 *` | March 15 at 2:30pm local |

Day-of-week `0` or `7` = Sunday → `6` = Saturday. Extended syntax (`L`, `W`, `?`, `MON`, `JAN`) NOT supported. Both day-of-month + day-of-week constrained → either-match (vixie-cron semantics).

## Routines triggers

| Trigger | How to add | CLI support |
|---|---|---|
| Schedule (recurring) | Web form preset + `/schedule update` for custom cron | `/schedule "daily PR review at 9am"` |
| Schedule (one-off) | `/schedule tomorrow at 9am, ...` | Yes |
| API (HTTP POST) | Web only; per-routine endpoint + bearer token | Not yet |
| GitHub events | Web only; needs Claude GitHub App | Not yet |

GitHub trigger event categories: `pull_request` (opened/closed/assigned/labeled/synchronize/etc.) and `release` (created/published/edited/deleted). Filters: Author, Title, Body, Base branch, Head branch, Labels, Is draft, Is merged; operators: equals/contains/starts with/is one of/is not one of/matches regex.

## API fire request shape (beta — `experimental-cc-routine-2026-04-01`)

```bash
curl -X POST https://api.anthropic.com/v1/claude_code/routines/trig_01ABCDEFGHJKLMNOPQRSTUVW/fire \
  -H "Authorization: Bearer sk-ant-oat01-xxxxx" \
  -H "anthropic-beta: experimental-cc-routine-2026-04-01" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"text": "Sentry alert SEN-4521 fired in prod. Stack trace attached."}'
```

Response:

```json
{
  "type": "routine_fire",
  "claude_code_session_id": "session_01HJKLMNOPQRSTUVWXYZ",
  "claude_code_session_url": "https://claude.ai/code/session_01HJKLMNOPQRSTUVWXYZ"
}
```

## Routine session permissions surface

> "Routines run autonomously as full Claude Code cloud sessions: there is no permission-mode picker and no approval prompts during a run. The session can run shell commands, use skills committed to the cloned repository, and call any connectors you include."
>
> — Automate work with routines, "Create a routine"
>
> Anchor: `Routines run autonomously + as full Claude Code cloud sessions`

Defaults:
- Branches: Claude can ONLY push to `claude/`-prefixed branches unless **Allow unrestricted branch pushes** enabled per repo
- Network: "Default" environment with **Trusted** allowlist (package registries, cloud APIs, container registries); arbitrary domains return `403` with `x-deny-reason: host_not_allowed`. Connector traffic routes through Anthropic servers.
- Connector traffic doesn't need to be allowlisted

## Disable knobs

- `CLAUDE_CODE_DISABLE_CRON=1` — disables `/loop` and cron tools entirely (session)
- Admin "Routines" toggle at `claude.ai/admin-settings/claude-code` — Team/Enterprise org-wide

## Cross-references

- See [[docs-agent-view]] for `claude --bg` background-session scheduling-adjacent flows
- See [[docs-headless]] for `claude -p` (the underlying invocation pattern Routines wraps)
- See [[docs-github-actions]] for the `schedule` cron trigger in workflows (a 4th scheduler)
- See [[news-cwc-sf-2026]] for Boris Cherny's "wake up to PRs that are ready to merge" framing

## Open questions / follow-ups

- Whether the `Monitor` tool used by self-paced `/loop` is documented for SDK consumers (the docs reference `/en/tools-reference#monitor-tool` but the deep semantics aren't covered here).
- The relationship between Routines GitHub triggers and the `claude-code-action` is unclear — these appear to be distinct surfaces (Routines fire **cloud** sessions; the Action runs Claude inside the GH runner). Confirm before chapter goes to print.
