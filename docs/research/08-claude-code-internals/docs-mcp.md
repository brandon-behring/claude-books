---
source_url: https://code.claude.com/docs/en/mcp
canonical_url: https://code.claude.com/docs/en/mcp
source_title: Connect Claude Code to tools via MCP
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-code-internals
tier: T1-official
cert_domains: [2, 3]
cert_task_areas: ["MCP server config (.mcp.json vs ~/.claude.json, env var expansion)"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# MCP — Claude Code consumer config (`.mcp.json` vs `~/.claude.json`, scopes, tool search)

The Claude Code CLI consumer side of MCP: server installation via `claude mcp add`, three storage scopes (local / project / user), environment variable expansion in `.mcp.json`, OAuth flow for remote servers, Tool Search behavior, plugin-provided servers. For protocol-level details see `02-mcp-spec/`.

## Key takeaways

- **Three transports**: `http` (recommended for remote), `sse` (deprecated, use HTTP), `stdio` (local processes). In JSON configs, `type` accepts `streamable-http` as alias for `http` (matches the MCP spec name).
- **Three installation scopes** with strict storage rules:
  - **Local** (default) — `~/.claude.json` under `projects.<path>.mcpServers`. Loads in **current project only**, **NOT** shared with team. Use for personal dev / experimental / credential-bearing servers.
  - **Project** — `.mcp.json` at project root. Loads in current project, **shared via VCS**. **Claude Code prompts for approval** before using project-scoped servers (one-time per server; reset with `claude mcp reset-project-choices`).
  - **User** — `~/.claude.json` (not project-scoped subkey). Loads in **all your projects**, private to your user account.
- **Scope precedence** when same server defined in multiple places (Claude Code connects once, using highest-precedence source):
  1. Local
  2. Project
  3. User
  4. Plugin-provided servers
  5. claude.ai connectors
  - Scopes 1-3 match duplicates by name; scopes 4-5 match by endpoint (URL or command).
- **Critical distinction**: "MCP local scope" is `~/.claude.json` (home directory, per-project subkey). "General local settings" is `.claude/settings.local.json` (project directory, machine-local). **These are different files.**
- **Environment variable expansion in `.mcp.json`**: `${VAR}` and `${VAR:-default}` syntax. Expandable in `command`, `args`, `env`, `url`, `headers`. **If required var unset and no default, Claude Code fails to parse config.**
- **`${CLAUDE_PROJECT_DIR}` in `.mcp.json`** requires the `:-` default form (e.g., `${CLAUDE_PROJECT_DIR:-.}`) because it's set in the server's environment, not Claude Code's. **Plugin-provided MCP configs** substitute `${CLAUDE_PROJECT_DIR}` directly and don't need the default. Also: `${CLAUDE_PLUGIN_ROOT}` and `${CLAUDE_PLUGIN_DATA}` for plugin paths.
- **OAuth 2.0 supported** for remote servers. Status 401/403 marks server as needing auth. Tokens stored in OS keychain (macOS) or credentials file. Run `/mcp` to complete flow in browser.
- **Reserved name `workspace`** — Claude Code skips servers with that name at load time.
- **`/mcp` panel** flags servers that advertise tools capability but expose no tools.
- **Tool Search** (default on for `Sonnet 4+` / `Opus 4+`, off on Vertex AI and proxied `ANTHROPIC_BASE_URL`): defers MCP tool definitions; only loads on-demand. `ENABLE_TOOL_SEARCH=true|auto|auto:N|false`. Per-server `alwaysLoad: true` exempts a server from deferral (and blocks startup until it connects, 5-second cap).
- **MCP output token caps**: warning at 10K tokens. Default max 25K. Override with `MAX_MCP_OUTPUT_TOKENS=50000`. Per-tool override via `_meta["anthropic/maxResultSizeChars"]` (up to 500K char hard ceiling) in server's `tools/list` response.

## Quoted (citation-ready)

> "Claude Code can connect to hundreds of external tools and data sources through the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction), an open source standard for AI-tool integrations. MCP servers give Claude Code access to your tools, databases, and APIs."
>
> — Connect Claude Code to tools via MCP, opening
>
> Anchor: `Connect Claude Code to tools via MCP + Claude Code can connect to hundreds of external tools`

> "The term 'local scope' for MCP servers differs from general local settings. MCP local-scoped servers are stored in `~/.claude.json` (your home directory), while general local settings use `.claude/settings.local.json` (in the project directory)."
>
> — Connect Claude Code to tools via MCP, Local scope (Note)
>
> Anchor: `Local scope + The term local scope for MCP servers differs from general local settings`

> "When the same server is defined in more than one place, Claude Code connects to it once, using the definition from the highest-precedence source: Local scope → Project scope → User scope → Plugin-provided servers → claude.ai connectors. The three scopes match duplicates by name. Plugins and connectors match by endpoint."
>
> — Connect Claude Code to tools via MCP, Scope hierarchy and precedence
>
> Anchor: `Scope hierarchy and precedence + When the same server is defined in more than one place`

## `claude mcp add` syntax

```bash
# HTTP (recommended for remote)
claude mcp add --transport http <name> <url> [--scope local|project|user] [--header "K: V"]
# Example:
claude mcp add --transport http notion https://mcp.notion.com/mcp

# stdio (local process)
claude mcp add --transport stdio --env KEY=value <name> -- <command> [args...]
# Example:
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable -- npx -y airtable-mcp-server

# SSE (deprecated)
claude mcp add --transport sse <name> <url>

# From JSON
claude mcp add-json <name> '<json>'
# Example:
claude mcp add-json weather-api '{"type":"http","url":"...","headers":{"Authorization":"Bearer token"}}'

# From Claude Desktop
claude mcp add-from-claude-desktop
```

**Important option ordering**: all options must come **before** the server name. The `--` then separates server name from server's command+args.

## Storage scope details

### Local scope (default)

Stored in `~/.claude.json` under projects path:

```json
{
  "projects": {
    "/path/to/your/project": {
      "mcpServers": {
        "stripe": {
          "type": "http",
          "url": "https://mcp.stripe.com"
        }
      }
    }
  }
}
```

### Project scope (`.mcp.json` at project root)

```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

Designed to be checked into version control. Approval prompt on first use.

### User scope (`~/.claude.json`)

Available across all your projects.

## Environment variable expansion in `.mcp.json`

Supported syntax:
- `${VAR}` — expands or fails if unset
- `${VAR:-default}` — expands or uses default

Expansion locations: `command`, `args`, `env`, `url`, `headers`.

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

## OAuth configuration

Mark server as needing auth: `401 Unauthorized` or `403 Forbidden`, or `WWW-Authenticate` header.

```bash
# Fixed callback port (dynamic client registration)
claude mcp add --transport http --callback-port 8080 my-server https://mcp.example.com/mcp

# Pre-configured client ID + secret prompt
claude mcp add --transport http \
  --client-id your-client-id --client-secret --callback-port 8080 \
  my-server https://mcp.example.com/mcp

# CI / non-interactive
MCP_CLIENT_SECRET=your-secret claude mcp add --transport http \
  --client-id your-client-id --client-secret --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

Override OAuth metadata discovery:

```json
{
  "mcpServers": {
    "my-server": {
      "type": "http",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "authServerMetadataUrl": "https://auth.example.com/.well-known/openid-configuration"
      }
    }
  }
}
```

Pin OAuth scopes (RFC 6749 §3.3 format, space-separated):

```json
{
  "mcpServers": {
    "slack": {
      "type": "http",
      "url": "https://mcp.slack.com/mcp",
      "oauth": {
        "scopes": "channels:read chat:write search:read"
      }
    }
  }
}
```

If authorization server advertises `offline_access` in `scopes_supported`, Claude Code appends it for refresh-token support.

## Dynamic headers for non-OAuth auth (`headersHelper`)

```json
{
  "mcpServers": {
    "internal-api": {
      "type": "http",
      "url": "https://mcp.internal.example.com",
      "headersHelper": "/opt/bin/get-mcp-auth-headers.sh"
    }
  }
}
```

- Command must write JSON object of string key-value pairs to stdout
- 10-second timeout, no caching (re-runs on every connection)
- Env vars set: `CLAUDE_CODE_MCP_SERVER_NAME`, `CLAUDE_CODE_MCP_SERVER_URL`
- At project/local scope, requires workspace trust dialog acceptance first

## Plugin-provided MCP servers

In `.mcp.json` at plugin root:

```json
{
  "mcpServers": {
    "database-tools": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {"DB_URL": "${DB_URL}"}
    }
  }
}
```

Plugin MCP env vars:
- `${CLAUDE_PLUGIN_ROOT}` — bundled plugin files (changes on plugin update)
- `${CLAUDE_PLUGIN_DATA}` — persistent state (survives plugin updates)
- `${CLAUDE_PROJECT_DIR}` — stable project root (substituted directly, no `:-` default needed for plugin contexts)

## Tool Search (the new context-saving pattern)

Default: tool search enabled (Sonnet 4+/Opus 4+; not Haiku). MCP tools deferred and discovered on demand. Disabled by default on Vertex AI and when `ANTHROPIC_BASE_URL` points to non-first-party host.

```bash
ENABLE_TOOL_SEARCH=true        # Force on
ENABLE_TOOL_SEARCH=false       # Force off (load all tools upfront)
ENABLE_TOOL_SEARCH=auto        # 10% threshold (load upfront if fits in 10% of ctx)
ENABLE_TOOL_SEARCH=auto:5      # 5% threshold
```

Disable `ToolSearch` tool specifically:

```json
{
  "permissions": {
    "deny": ["ToolSearch"]
  }
}
```

Per-server exemption (always load):

```json
{
  "mcpServers": {
    "core-tools": {
      "type": "http",
      "url": "https://mcp.example.com/mcp",
      "alwaysLoad": true
    }
  }
}
```

- v2.1.121+; blocks startup until server connects (5-second cap).
- Per-tool exemption via `"anthropic/alwaysLoad": true` in tool's `_meta`.

## Per-server tool timeout

```json
{
  "mcpServers": {
    "my-server": {
      "type": "http",
      "url": "https://example.com",
      "timeout": 600000
    }
  }
}
```

- Wall-clock per tool call in **milliseconds**. Below 1000 floored to 1 second.
- Overrides `MCP_TOOL_TIMEOUT` env for that server only.
- HTTP/SSE first-byte budget has 60-second minimum regardless.

## Reconnection behavior

| Server type | At session start | Mid-session disconnect |
|---|---|---|
| HTTP/SSE | Up to 3 retries on transient errors (5xx, conn refused, timeout). Auth and not-found errors NOT retried | Exponential backoff: 5 attempts, starting 1s, doubling. Marked failed after; retry manually from `/mcp` |
| Stdio | n/a (local process) | NOT reconnected automatically |

## MCP resources via @-mention

```text
Can you analyze @github:issue://123 and suggest a fix?
Compare @postgres:schema://users with @docs:file://database/user-model
```

Format: `@server:protocol://resource/path`. Resources automatically fetched and included as attachments.

## MCP prompts as commands

`/mcp__<server>__<prompt>` — discovered dynamically from connected servers. Server and prompt names normalized (spaces → underscores).

```text
/mcp__github__list_prs
/mcp__github__pr_review 456
/mcp__jira__create_issue "Bug in login flow" high
```

## `claude.ai` MCP servers

Auto-available when authenticated via Claude.ai subscription (NOT when `ANTHROPIC_API_KEY` / `ANTHROPIC_AUTH_TOKEN` / `apiKeyHelper` / third-party provider is active).

Disable: `ENABLE_CLAUDEAI_MCP_SERVERS=false claude`.

A Claude-Code-configured server takes precedence over a Claude.ai connector pointing at the same URL.

## Use Claude Code as an MCP server

```bash
claude mcp serve
```

In `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

(Or full path to executable if `claude` not in `PATH`.)

## Cross-references

- See [[docs-plugins]] for plugin-provided MCP server configuration in `.mcp.json` at plugin root or inline in `plugin.json`.
- See [[docs-sub-agents]] for `mcpServers` field on subagent definitions (inline or by reference — keep tool descriptions out of parent context).
- See [[docs-settings]] for `allowedMcpServers`, `deniedMcpServers`, and managed MCP configuration via `managed-mcp.json`.
- See [[docs-hooks]] for `mcp_tool` hook type (call an already-connected MCP tool) and `Elicitation`/`ElicitationResult` events.
- See [[../02-mcp-spec/]] for the MCP protocol itself (initialize handshake, RPC patterns, the upcoming 2026-07-28 breaking changes).
- See [[../03-advanced-tool-use/]] for Tool Search Tool, Programmatic Tool Calling, Tool Use Examples — the canonical scale-your-tools pattern.

## Open questions / follow-ups

- Exact behavior when both `--scope local` and `--scope user` are set on the same server: implied to silently win local by precedence, but no explicit message.
- The relationship between `ENABLE_CLAUDEAI_MCP_SERVERS=false` and `/login` selection across mixed-auth setups — third-party reporting suggests some edge cases when `apiKeyHelper` is set alongside `/login`.
- Whether `_meta["anthropic/alwaysLoad"]` at the tool level overrides server-level `alwaysLoad: false`. Implied yes (tool-level wins), but not explicit.
