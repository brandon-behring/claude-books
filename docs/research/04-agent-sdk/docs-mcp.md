---
source_url: https://code.claude.com/docs/en/agent-sdk/mcp
canonical_url: https://code.claude.com/docs/en/agent-sdk/mcp
source_title: Connect to external tools with MCP
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [2]
cert_task_areas: ["MCP server config", "Effective tool interfaces", "Tool distribution + tool_choice"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# MCP in the Agent SDK — transports, naming, allow-listing, tool search

How the SDK consumes MCP servers: `mcp_servers` programmatic config vs `.mcp.json` filesystem config, four transport types, the `mcp__server__action` naming convention, and how to allow tools cleanly.

## Key takeaways

- **MCP servers can be configured two ways**:
  - **Programmatically** in `mcpServers` (TS) / `mcp_servers` (Python).
  - **From `.mcp.json`** at the project root, loaded automatically when `settingSources` includes `"project"`.
- **Four transport types**:
  - **`stdio`** — local processes (default; no explicit `type` needed). `command` + optional `args` + `env`. Use when docs say "run this command".
  - **`sse`** — Server-Sent Events HTTP. `type: "sse"`, `url`, `headers`.
  - **`http`** — Streamable HTTP. `type: "http"`, `url`, `headers`. `.mcp.json` accepts `"streamable-http"` as an alias.
  - **`sdk`** — in-process MCP server built with `tool()` + `create_sdk_mcp_server()` (Python) or `tool()` + `createSdkMcpServer()` (TS). `type: "sdk"`, `name`, `instance`.
- **Tool naming convention**: `mcp__<server-name>__<tool-name>`. For a server keyed `"github"` with tool `list_issues`, the full name is `mcp__github__list_issues`.
- **Permission via `allowedTools`** — use `mcp__servername__*` wildcards to grant a whole server, or list individual tools. **Prefer `allowedTools` over `permissionMode: "bypassPermissions"`** for MCP access — bypassPermissions is broader than necessary.
- **`strictMcpConfig: true`** uses ONLY the servers in `mcpServers`; ignores `.mcp.json`, user settings, and plugins.
- **`onElicitation`** callback on `Options` — fires when an MCP server invokes the elicitation protocol (asks the user a question through the SDK). MCP-spec mechanics live in `02-mcp-spec/spec-elicitation.md`.
- **Detect connection failures via the `system:init` message** — each server's `status` is one of `connected | failed | needs-auth | pending | disabled`. Check before letting the agent run.

## Quoted (citation-ready)

> "MCP servers can run as local processes, connect over HTTP, or execute directly within your SDK application."
>
> — Connect to external tools with MCP, opening paragraph
>
> Anchor: `Connect to external tools with MCP + MCP servers can run as local processes`

> "**Prefer `allowedTools` over permission modes for MCP access.** `permissionMode: \"acceptEdits\"` does not auto-approve MCP tools (only file edits and filesystem Bash commands). `permissionMode: \"bypassPermissions\"` does auto-approve MCP tools but also disables all other safety prompts, which is broader than necessary. A wildcard in `allowedTools` grants exactly the MCP server you want and nothing more."
>
> — Connect to external tools with MCP, Auto-approve with allowedTools (Note)
>
> Anchor: `Auto-approve with allowedTools + Prefer allowedTools over permission modes`

> "MCP tools follow the naming pattern `mcp__<server-name>__<tool-name>`. For example, a GitHub server named `\"github\"` with a `list_issues` tool becomes `mcp__github__list_issues`."
>
> — Connect to external tools with MCP, Tool naming convention
>
> Anchor: `Tool naming convention + MCP tools follow the naming pattern`

## Configuration shapes (Python TypedDicts)

```python
# stdio (default; type optional)
{"command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"], "env": {...}}

# SSE
{"type": "sse", "url": "https://api.example.com/mcp/sse", "headers": {"Authorization": "..."}}

# HTTP (streamable)
{"type": "http", "url": "https://api.example.com/mcp", "headers": {"Authorization": "..."}}

# In-process SDK server
{"type": "sdk", "name": "my-tools", "instance": <Server instance>}
```

`.mcp.json` example (loaded when `settingSources` includes `"project"`):

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```

`${VAR}` syntax expands env vars at runtime in `.mcp.json`.

## Tool Search interaction (key context-budget protection)

"When you have many MCP tools configured, tool definitions can consume a significant portion of your context window. Tool search solves this by withholding tool definitions from context and loading only the ones Claude needs for each turn."

Tool search is **enabled by default** in the Agent SDK. From [[docs-agent-loop]]: "MCP schemas deferred by default, falling back to upfront loading on Vertex AI or a non-first-party `ANTHROPIC_BASE_URL`."

The mechanics (regex vs BM25, the `defer_loading` mechanism, prompt-cache preservation) are documented in [[03-advanced-tool-use/docs-tool-search-tool]].

## Authentication patterns

- **Env vars on stdio servers**: pass via the `env` field of the server config (Python `dict`; TS `Record<string, string>`).
- **HTTP headers on remote servers**: `headers: { Authorization: "Bearer ${TOKEN}" }`.
- **OAuth2**: "The SDK doesn't handle OAuth flows automatically, but you can pass access tokens via headers after completing the OAuth flow in your application." MCP-spec authorization details in `02-mcp-spec/spec-authorization.md`.

## Discovering connected tools

Check the `system:init` message for the `mcp_servers` field (TS) or `message.data["mcp_servers"]` (Python). It lists each configured server with current `status` and the available `tools`. The Python field nesting is the gotcha — TS exposes it at the top level.

```python
# Check connection status (Python)
async for message in query(...):
    if isinstance(message, SystemMessage) and message.subtype == "init":
        failed = [s for s in message.data.get("mcp_servers", [])
                  if s.get("status") != "connected"]
        if failed:
            print(f"Failed to connect: {failed}")
```

## Default timeout / failure modes

- **Default connection timeout**: 60 seconds for MCP server initialization. Lighter-weight servers or pre-warming required for slower starts.
- **Common failure causes** (from the page's troubleshooting):
  - Missing env vars / tokens
  - Server package not installed (e.g., `npx` can't find `@modelcontextprotocol/server-*`)
  - Invalid connection string (databases)
  - Network unreachability (remote HTTP/SSE)

## Cross-references

- See [[docs-permissions]] for why `bypassPermissions` and `acceptEdits` do not auto-approve MCP tools — and why `allowedTools` is the right knob.
- See [[02-mcp-spec/spec-tools.md]] for the underlying MCP tools protocol (input schemas, content blocks, errors).
- See [[02-mcp-spec/spec-elicitation.md]] for the protocol behind `onElicitation`.
- See [[02-mcp-spec/blog-rc-2026-07-28.md]] for the upcoming MCP RC breaking changes (stateless handshake, Sampling/Roots/Logging deprecation) — important for chapter content that documents `.mcp.json` patterns.
- See [[03-advanced-tool-use/docs-tool-search-tool]] for the Tool Search defer-loading mechanism that keeps large MCP catalogs cheap.
- See [[docs-builtin-tools]] for the `Agent`/`Skill`/`AskUserQuestion` etc. tools that sit alongside MCP tools in `allowedTools` lists.

## Open questions / follow-ups

- The page links a "[Custom tools guide](/en/agent-sdk/custom-tools)" for in-process SDK MCP server details — defer to that page for `@tool` decorator semantics; this dossier covers it briefly in [[docs-python-reference]] and [[docs-typescript-reference]].
- The `mcp_toolset` pattern (apply Tool Search to whole MCP server) isn't on this page — see [[03-advanced-tool-use/docs-tool-search-tool]] cross-reference for the canonical mechanic.
- "Pre-warming the server" tip is mentioned but not detailed — chapter authors writing about MCP-server hosting should follow up.
