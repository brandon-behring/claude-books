---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
source_title: Lifecycle — Model Context Protocol Specification 2025-11-25
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: mcp-spec
tier: T1-official
cert_domains: [2]
cert_task_areas:
  - MCP server config (`.mcp.json` vs `~/.claude.json`, env var expansion)
  - Tool distribution + `tool_choice` (`auto`/`any`/forced)
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# MCP Lifecycle — initialize handshake + capability negotiation + shutdown

This page is critical to cite **only with a freshness flag**. The 2026-07-28 RC **eliminates** the `initialize` / `notifications/initialized` handshake and the `MCP-Session-Id` header. Until the RC ships, chapters teaching server/client implementation must teach the 2025-11-25 handshake; once chapters reach an MCP-RC-aware section, the new stateless model takes over. Marked `volatility: evolving` for that reason.

## Key takeaways
- Three phases: **Initialization** -> **Operation** -> **Shutdown**. Init **MUST** be the first interaction.
- Client sends `initialize` with `protocolVersion`, its `capabilities`, and `clientInfo`. Server replies with `protocolVersion`, its `capabilities`, `serverInfo`, optional `instructions`. Client then sends `notifications/initialized` and operation begins.
- Version negotiation: client **MUST** send a supported version (SHOULD be latest). If server supports it, server **MUST** echo the same version; otherwise server **MUST** respond with another version it supports. If client doesn't support the server's response, client **SHOULD** disconnect.
- Capability table (below) enumerates everything optional. `listChanged` and `subscribe` sub-flags are the two reusable sub-capabilities.
- Pre-initialized request rules: client **SHOULD NOT** send anything except pings before init response; server **SHOULD NOT** send anything except pings or logs before `initialized` notification.
- Shutdown has no protocol message — close the transport. stdio: close stdin -> wait -> SIGTERM -> SIGKILL.
- Timeouts are implementation-defined but implementations **SHOULD** establish per-request timeouts to prevent hung connections; **SHOULD** support cancellation notifications when they fire.

## Quoted (citation-ready)

> "The initialization phase **MUST** be the first interaction between client and server. During this phase, the client and server: establish protocol version compatibility, exchange and negotiate capabilities, share implementation details."
>
> — Specification 2025-11-25 / Basic / Lifecycle / Initialization
>
> Anchor: `Initialization + The initialization phase MUST be the first interaction`

> "If the client does not support the version in the server's response, it **SHOULD** disconnect."
>
> — Specification 2025-11-25 / Basic / Lifecycle / Version Negotiation
>
> Anchor: `Version Negotiation + If the client does not support the version in the server's response`

## Mechanism: the initialize handshake

**Step 1: Client -> Server `initialize` request**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "roots":       { "listChanged": true },
      "sampling":    {},
      "elicitation": { "form": {}, "url": {} },
      "tasks": {
        "requests": {
          "elicitation": { "create": {} },
          "sampling":    { "createMessage": {} }
        }
      }
    },
    "clientInfo": {
      "name": "ExampleClient",
      "title": "Example Client Display Name",
      "version": "1.0.0",
      "description": "An example MCP client application",
      "icons": [{ "src": "...", "mimeType": "image/png", "sizes": ["48x48"] }],
      "websiteUrl": "https://example.com"
    }
  }
}
```

**Step 2: Server -> Client response**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "logging": {},
      "prompts":   { "listChanged": true },
      "resources": { "subscribe": true, "listChanged": true },
      "tools":     { "listChanged": true },
      "tasks": {
        "list": {}, "cancel": {},
        "requests": { "tools": { "call": {} } }
      }
    },
    "serverInfo": { "name": "ExampleServer", "title": "...", "version": "1.0.0", "description": "...", "icons": [...], "websiteUrl": "..." },
    "instructions": "Optional instructions for the client"
  }
}
```

**Step 3: Client -> Server `notifications/initialized`**
```json
{ "jsonrpc": "2.0", "method": "notifications/initialized" }
```

After step 3 the session is in Operation phase. Both parties **MUST** respect the negotiated protocol version and only use successfully-negotiated capabilities.

## Mechanism: capability table

Verbatim from the page:

| Party | Capability | What it enables |
|---|---|---|
| Client | `roots` | Filesystem roots ([[spec-roots]]) |
| Client | `sampling` | Server-initiated LLM completions ([[spec-sampling]]) |
| Client | `elicitation` | Server-initiated user input ([[spec-elicitation]]) |
| Client | `tasks` | Task-augmented client requests ([[spec-tasks-experimental]]) |
| Client | `experimental` | Non-standard experimental features |
| Server | `prompts` | Prompt templates ([[spec-prompts]]) |
| Server | `resources` | Readable resources ([[spec-resources]]) |
| Server | `tools` | Callable tools ([[spec-tools]]) |
| Server | `logging` | Structured log messages |
| Server | `completions` | Argument autocompletion |
| Server | `tasks` | Task-augmented server requests |
| Server | `experimental` | Non-standard experimental features |

Sub-capabilities:
- `listChanged`: support for list-change notifications (prompts, resources, tools).
- `subscribe`: support for per-item change subscriptions (resources only).

## Mechanism: version negotiation

- Client **MUST** send a `protocolVersion`. **SHOULD** be the latest version client supports.
- If server supports it: server **MUST** respond with the same version.
- Otherwise: server **MUST** respond with another version it supports (SHOULD be the latest server-supported version).
- If client doesn't support the server's version: client **SHOULD** disconnect.

Example version mismatch error:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Unsupported protocol version",
    "data": {
      "supported": ["2024-11-05"],
      "requested": "1.0.0"
    }
  }
}
```

Over HTTP, the negotiated version **MUST** be echoed on every subsequent request via `MCP-Protocol-Version: <protocol-version>` header. (See [[spec-transports]] for backcompat fallback rule.)

## Mechanism: shutdown

No `shutdown` RPC is defined. The transport handles termination.

- **stdio**: client SHOULD close server stdin first; wait for exit; SIGTERM after reasonable timeout; SIGKILL as last resort. Server **MAY** initiate shutdown by closing its stdout and exiting.
- **HTTP**: close the associated HTTP connections.

## Mechanism: timeouts and error handling

- Implementations **SHOULD** establish per-request timeouts; SDKs **SHOULD** allow per-request override.
- Implementations **MAY** reset the timeout clock on receipt of progress notifications, but **SHOULD** always enforce a maximum timeout to bound impact of misbehaving peers.
- When a timeout fires, the sender **SHOULD** issue a cancellation notification for the request and stop waiting.
- Implementations **SHOULD** handle: protocol version mismatch, capability negotiation failure, request timeouts.

## How implementers interact with this section
- **Server author**: register every capability you intend to use, including sub-flags like `listChanged`. The capabilities object is your only chance to advertise — there's no late-binding mechanism in the base spec.
- **Client author**: declare which client features you support (sampling/roots/elicitation). Servers will only use what you advertise.
- **Both**: respect the rule that pre-initialized non-ping traffic is forbidden. Sending tool calls before `initialized` is a spec violation that most SDKs reject.

## Cross-references
- See [[spec-architecture]] for the host/client/server roles that flow through these messages.
- See [[spec-base-protocol]] for the JSON-RPC framing underneath.
- See [[spec-transports]] for HTTP-specific lifecycle (session ID, protocol-version header).
- See [[blog-rc-2026-07-28]] — **the 2026-07-28 RC removes initialize/initialized entirely** and moves to a stateless model. Citing this page after July 28, 2026 requires a "for protocol version 2025-11-25" qualifier.

## Open questions / follow-ups
- The 2026-07-28 RC introduces `server/discover` to replace the handshake for capability lookup. Once that page lands as the new spec, the in-spec capability table will move; this note may need to be split into 2025-11-25 and 2026-07-28 variants.
