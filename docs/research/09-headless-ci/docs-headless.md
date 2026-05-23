---
source_url: https://code.claude.com/docs/en/headless
canonical_url: https://code.claude.com/docs/en/headless
source_title: Run Claude Code programmatically
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

# Headless mode (`claude -p`) — the canonical CI/CD entry point

## Key takeaways

- `claude -p "<query>"` is the canonical non-interactive invocation; the CLI exits after responding. All standard CLI options work with `-p`.
- **`--bare`** disables auto-discovery of hooks/skills/plugins/MCP/CLAUDE.md so scripted calls start faster and behave the same on every machine. Anthropic flags it as the recommended mode for scripted/SDK calls and "will become the default for `-p` in a future release."
- **Output formats**: `text` (default), `json` (single payload with `result`, `session_id`, `total_cost_usd`, per-model cost), `stream-json` (newline-delimited events). `--json-schema` adds a `structured_output` field validated against your schema.
- **Session continuity** in CI: `--continue` resumes the most recent conversation in the cwd; `--resume <id>` resumes a specific one; `--fork-session` branches a new ID from a checkpoint.
- **Pricing surface**: Starting 2026-06-15, `claude -p` usage on subscription plans draws from a separate monthly **Agent SDK credit** allotment.
- **stdin cap**: piped stdin is capped at 10 MB (as of v2.1.128). Exceeding it returns a clear error and non-zero exit; large inputs must be passed as file paths in the prompt.

## Quoted (citation-ready)

> "To run Claude Code in non-interactive mode, pass `-p` with your prompt and any CLI options:
>
> ```bash
> claude -p "Find and fix the bug in auth.py" --allowedTools "Read,Edit,Bash"
> ```"
>
> — Run Claude Code programmatically, "Basic usage"
>
> Anchor: `Basic usage + To run Claude Code in non-interactive`

> "Add `--bare` to reduce startup time by skipping auto-discovery of hooks, skills, plugins, MCP servers, auto memory, and CLAUDE.md. Without it, `claude -p` loads the same context an interactive session would, including anything configured in the working directory or `~/.claude`. Bare mode is useful for CI and scripts where you need the same result on every machine."
>
> — Run Claude Code programmatically, "Start faster with bare mode"
>
> Anchor: `Start faster with bare mode + Add --bare to reduce startup time`

> "With `--output-format json`, the response payload includes `total_cost_usd` and a per-model cost breakdown, so scripted callers can track spend per invocation without consulting the usage dashboard."
>
> — Run Claude Code programmatically, "Pipe data through Claude"
>
> Anchor: `Pipe data through Claude + With --output-format json`

> "To get output conforming to a specific schema, use `--output-format json` with `--json-schema` and a JSON Schema definition. The response includes metadata about the request (session ID, usage, etc.) with the structured output in the `structured_output` field."
>
> — Run Claude Code programmatically, "Get structured output"
>
> Anchor: `Get structured output + To get output conforming to a specific schema`

> "Starting June 15, 2026, Agent SDK and `claude -p` usage on subscription plans will draw from a new monthly Agent SDK credit, separate from your interactive usage limits."
>
> — Run Claude Code programmatically, top-of-page Note
>
> Anchor: `Starting June 15 2026 + Agent SDK and claude -p`

## JSON output shapes (from docs)

**Default JSON shape** (`--output-format json`): `result`, `session_id`, `total_cost_usd`, per-model usage breakdown.

**Schema-validated** (`--output-format json --json-schema '{...}'`): same metadata plus `structured_output` containing the schema-conforming payload.

**Stream events** (`--output-format stream-json --verbose --include-partial-messages`): newline-delimited; event types include:
- `system/init` — first event; reports model, tools, MCP servers, loaded plugins, and `plugin_errors` (use to fail CI if a plugin didn't load)
- `system/plugin_install` — when `CLAUDE_CODE_SYNC_PLUGIN_INSTALL` is set
- `system/api_retry` — emitted before each retryable error retry, with `attempt`, `max_retries`, `retry_delay_ms`, `error_status`, `error` category (`authentication_failed`, `oauth_org_not_allowed`, `billing_error`, `rate_limit`, `invalid_request`, `model_not_found`, `server_error`, `max_output_tokens`, `unknown`)
- `stream_event` (with `event.delta.type == "text_delta"`) — streaming text tokens

## Permission gates for headless runs

Per docs:
- `--allowedTools "Bash,Read,Edit"` — auto-approve specific tools (uses [permission rule syntax](https://code.claude.com/docs/en/settings#permission-rule-syntax)); supports prefix matching e.g. `Bash(git diff *)`
- `--permission-mode acceptEdits` — auto-approve file writes plus `mkdir`/`touch`/`mv`/`cp`; shell + network still need explicit rules
- `--permission-mode dontAsk` — denies anything not in `permissions.allow` or the read-only command set ("useful for locked-down CI runs")
- `--permission-mode bypassPermissions` (alias `--dangerously-skip-permissions`) — skip prompts; one-time interactive acceptance required first
- `--permission-prompt-tool <mcp_tool>` — route prompts to an MCP tool in non-interactive mode

## CI auth tokens

- `claude setup-token` — generate a long-lived OAuth token for CI and scripts. Prints to terminal without saving. Requires a Claude subscription.
- `claude auth status` (with `--text` for human-readable, exits 0 if logged in, 1 if not) — useful as a CI gate before the agent step.

## Common headless patterns documented

1. **Pipe + redirect** — `cat build-error.txt | claude -p 'concisely explain the root cause' > output.txt`
2. **package.json lint script** — `git diff main | claude -p "typo linter prompt..."`
3. **Capture session ID for follow-ups** — `session_id=$(claude -p "Start a review" --output-format json | jq -r '.session_id'); claude -p "Continue that review" --resume "$session_id"`
4. **Append a security-engineer persona via stdin** — `gh pr diff "$1" | claude -p --append-system-prompt "You are a security engineer. Review for vulnerabilities." --output-format json`

## Headless-specific gotchas

- `--include-partial-messages` requires `--print` and `--output-format stream-json`.
- `--include-hook-events` requires `--output-format stream-json`.
- `--max-budget-usd`, `--max-turns`, `--no-session-persistence`, `--init`, `--maintenance`, `--init-only`, `--exclude-dynamic-system-prompt-sections` are **print-mode only**.
- `--fallback-model` only takes effect in `-p` and background sessions; ignored interactively.
- User-invoked skills/built-in commands (e.g. `/commit`) are NOT available in `-p` mode — describe the task instead.

## Bare-mode-only context surface

When `--bare` is set, only flags you explicitly pass take effect. Use these to load context:

| To load | Use |
|---|---|
| System prompt additions | `--append-system-prompt`, `--append-system-prompt-file` |
| Settings | `--settings <file-or-json>` |
| MCP servers | `--mcp-config <file-or-json>` |
| Custom agents | `--agents <json>` |
| A plugin | `--plugin-dir <path>`, `--plugin-url <url>` |

Bare mode also skips OAuth/keychain reads — Anthropic auth must come from `ANTHROPIC_API_KEY` or `apiKeyHelper` in the `--settings` JSON.

## Cross-references

- See [[docs-cli-reference]] for the full flag table including `--bare`, `--bg`, `--worktree`, `--fork-session`, `--from-pr`.
- See [[../04-agent-sdk/docs-quickstart]] for the Python/TypeScript SDK equivalents (`query()` / `send()` / `stream()`).
- See [[docs-github-actions]] for the canonical YAML that wraps `claude -p` in CI.
- See [[docs-code-review]] for how Anthropic's managed Code Review consumes the same surface.

## Open questions / follow-ups

- Exact byte structure of a `json` output payload (the docs describe the field set in prose; we don't have an end-to-end JSON example for `--json-schema`).
- Whether `total_cost_usd` is reported when running on Bedrock/Vertex/Foundry (those providers bill independently).
- Whether `--max-budget-usd` honors prompt-cache discounts and the 1-hour cache write multiplier.
