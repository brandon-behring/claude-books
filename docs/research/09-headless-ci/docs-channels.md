---
source_url: https://code.claude.com/docs/en/channels
canonical_url: https://code.claude.com/docs/en/channels
source_title: Push events into a running session with channels
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

# Claude Code Channels — webhook + chat-bridge front-ends

## Key takeaways

- Research preview; Claude Code v2.1.80+; requires claude.ai or Console API key auth. **NOT available on Bedrock/Vertex/Foundry**.
- A "channel" is an MCP server that pushes events into a running session. Two-way: Claude reads inbound events and can reply through the same channel.
- Official channels: Telegram, Discord, iMessage, plus `fakechat` localhost demo. Each requires Bun. Plugins source: `claude-plugins-official` marketplace.
- Activation requires both `--channels plugin:<name>@<marketplace>` AND the plugin being on the (Anthropic or org-configured) allowlist. Mere presence in `.mcp.json` is not enough.
- Sender allowlist gates messages: Telegram/Discord pair via code; iMessage allows self-chat by default + manual `allow <handle>`.
- Team/Enterprise: blocked by default; admin must set `channelsEnabled: true` (and optionally restrict via `allowedChannelPlugins`).
- The CI auto-fix use case lives here: webhook from CI → channel → running Claude session reacts immediately to the failure.

## Quoted (citation-ready)

> "A channel is an MCP server that pushes events into your running Claude Code session, so Claude can react to things that happen while you're not at the terminal. Channels can be two-way: Claude reads the event and replies back through the same channel, like a chat bridge."
>
> — Push events into a running session with channels, opening
>
> Anchor: `A channel is an MCP server + that pushes events into your running`

> "Webhook receiver: a webhook from CI, your error tracker, a deploy pipeline, or other external service arrives where Claude already has your files open and remembers what you were debugging."
>
> — Push events into a running session with channels, "How channels compare"
>
> Anchor: `How channels compare + Webhook receiver`

> "Being in `.mcp.json` isn't enough to push messages: a server also has to be named in `--channels`."
>
> — Push events into a running session with channels, "Security"
>
> Anchor: `Security + Being in .mcp.json isn't enough`

## Quickstart pattern (fakechat → real channel)

```bash
# Install demo plugin in a session
/plugin install fakechat@claude-plugins-official

# Exit, then re-launch with channel active
claude --channels plugin:fakechat@claude-plugins-official

# Send a message via http://localhost:8787
# It arrives in the session as a <channel source="fakechat"> event
```

For real channels (Telegram example):

```bash
/plugin install telegram@claude-plugins-official
/reload-plugins
/telegram:configure <token-from-BotFather>
# Exit and restart:
claude --channels plugin:telegram@claude-plugins-official
# Send any message to your bot; it replies with a pairing code
/telegram:access pair <code>
/telegram:access policy allowlist
```

## Headless / non-interactive interaction

> "When you run channels in non-interactive mode with `-p`, tools that need terminal input, such as multiple-choice questions and plan mode approval, are disabled so the session never stalls waiting for input."
>
> — Push events into a running session with channels, "Quickstart" note
>
> Anchor: `When you run channels in non-interactive mode + with -p tools that need`

This is the key surface for **CI auto-fix style automation**: a long-running `claude -p` session subscribed to a channel can receive webhooks from CI on failure and react without human intervention.

## Permission relay

Channels declaring the permission-relay capability can forward permission prompts to the channel's allowed senders for approve/deny remotely. (For unattended use, `--dangerously-skip-permissions` bypasses prompts entirely.)

## Admin / managed-settings controls

| Setting | Purpose | Unconfigured default |
|---|---|---|
| `channelsEnabled` | Master switch | Team/Enterprise: blocked. Console with managed settings: blocked. Console w/o: allowed |
| `allowedChannelPlugins` | Replaces Anthropic-maintained allowlist when set; entries are `{marketplace, plugin}` pairs | Anthropic default list applies |

`--dangerously-load-development-channels` bypasses the allowlist for local testing only.

## Comparison: channel vs other event-driven surfaces

| Feature | Where Claude runs | Trigger surface | When to reach for it |
|---|---|---|---|
| Claude Code on the web | Anthropic cloud | Fresh task per session | Self-contained async work, no local setup |
| Slack (`@Claude`) | Anthropic cloud | Channel/thread mention | Team chat → PR/review |
| Standard MCP server | Local | Claude queries during task | On-demand reads/queries |
| Remote Control | Local | You drive from web/mobile | Steering an in-progress local session |
| **Channels** | Local | Pushed events (Telegram/Discord/iMessage/webhook) | Reacting to external events while away |

## Cross-references

- See [[docs-remote-control]] for the manual-drive counterpart
- See [[docs-scheduling]] for the polled-on-interval alternative
- See [[news-cwc-sf-2026]] for "Claude Code Channels" launch context (Mar 20, 2026)
- VentureBeat's "OpenClaw-killer" positioning piece (not captured as its own note — flagged as a follow-up if the channels surface warrants deeper coverage)

## Open questions / follow-ups

- A canonical CI-failure → channel workflow example isn't in the docs; the chapter will need to construct one from the webhook-receiver primitive.
- Whether channels work with `claude --bg` (the docs don't explicitly forbid it but background sessions are spawned by the supervisor — verify before recommending the pattern).
