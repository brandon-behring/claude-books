---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
source_title: Transports — Model Context Protocol Specification 2025-11-25
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: mcp-spec
tier: T1-official
cert_domains: [2]
cert_task_areas:
  - MCP server config (`.mcp.json` vs `~/.claude.json`, env var expansion)
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# MCP Transports — stdio + Streamable HTTP (with sessions and resumability)

Transports are where the 2026-07-28 RC has the biggest user-visible delta — the session model, the SSE stream pattern, and `MCP-Session-Id` all change. Chapter authors writing about "how to deploy an MCP server in production" should cite this page for 2025-11-25 facts and flag that the RC introduces required headers (`MCP-Protocol-Version`, `Mcp-Method`, `Mcp-Name`) and removes session IDs. Marked `volatility: evolving`.

## Key takeaways
- Two standard transports: **stdio** (local subprocess, newline-delimited JSON over stdin/stdout) and **Streamable HTTP** (single endpoint, POST + optional SSE). Custom transports are allowed.
- Clients **SHOULD** support stdio whenever possible — the simpler local-process transport remains the default for desktop AI applications.
- Streamable HTTP requires a **single endpoint** (POST + GET). POST sends client messages; GET opens an SSE stream for server-initiated traffic. Server-Sent Events let the server respond either with a single JSON object or with an SSE stream containing the eventual response plus interleaved requests/notifications.
- **DNS-rebinding protections are MUST-level**: servers **MUST** validate `Origin`; **SHOULD** bind only to 127.0.0.1 for local servers; **SHOULD** implement authentication.
- The `MCP-Session-Id` header is **optional but stateful**: servers can issue one in the `InitializeResult` response; if they do, clients **MUST** include it on every subsequent request.
- The `MCP-Protocol-Version` header is **required on all subsequent HTTP requests**. If absent and no other version-detection mechanism exists, server **SHOULD** assume `2025-03-26`. Invalid version -> server **MUST** return 400.
- Resumability uses SSE event IDs + `Last-Event-ID` header. IDs are **per-stream** cursors, **MUST NOT** be replayed onto a different stream.

## Quoted (citation-ready)

> "When implementing Streamable HTTP transport: Servers **MUST** validate the `Origin` header on all incoming connections to prevent DNS rebinding attacks ... When running locally, servers **SHOULD** bind only to localhost (127.0.0.1) rather than all network interfaces (0.0.0.0) ... Servers **SHOULD** implement proper authentication for all connections."
>
> — Specification 2025-11-25 / Transports / Streamable HTTP / Security Warning
>
> Anchor: `Security Warning + When implementing Streamable HTTP transport`

> "JSON-RPC messages **MUST** be UTF-8 encoded."
>
> — Specification 2025-11-25 / Transports, opening paragraph
>
> Anchor: `Transports + MCP uses JSON-RPC to encode messages`

## Mechanism: stdio transport

```
Client -> launches server as subprocess
Server -> reads JSON-RPC from stdin, writes JSON-RPC to stdout
         may write logs to stderr (any level — informational/debug/error)
```

Normative rules:
- Messages **MUST** be UTF-8 encoded JSON-RPC, newline-delimited, with **no embedded newlines** in any message.
- Server **MAY** write to stderr for logging (changed in 2025-11-25 — was previously errors-only).
- Client **MAY** capture/forward/ignore stderr; **SHOULD NOT** assume stderr means error.
- Server **MUST NOT** write anything to stdout that is not a valid MCP message.
- Client **MUST NOT** write anything to server stdin that is not a valid MCP message.

## Mechanism: Streamable HTTP transport

Replaces the deprecated HTTP+SSE transport from 2024-11-05.

**Endpoint**: server **MUST** provide a single HTTP endpoint path (the "MCP endpoint") supporting both POST and GET. Example: `https://example.com/mcp`.

### Client -> Server (POST)
- Every JSON-RPC message from client = a new HTTP POST to the MCP endpoint.
- Client **MUST** include `Accept: application/json, text/event-stream`.
- Body **MUST** be a single JSON-RPC request, notification, or response.

For notifications/responses (one-way):
- Accepted: HTTP 202 with no body.
- Rejected: HTTP 4xx; body **MAY** include JSON-RPC error response with no `id`.

For requests:
- Server **MUST** return either `Content-Type: text/event-stream` (open an SSE stream) or `Content-Type: application/json` (single response). Client **MUST** support both.
- If SSE stream:
  - Server **SHOULD** immediately send an SSE event with an event ID and empty `data` to prime reconnect.
  - Server **MAY** close the connection (but not terminate the stream) at any time to avoid long-lived conns; client **SHOULD** poll-reconnect.
  - Server **SHOULD** send a `retry` field before closing — client **MUST** honor it.
  - The stream **SHOULD** eventually carry the JSON-RPC response for the request.
  - Server **MAY** send unrelated/related requests + notifications before the response.
  - Server **MAY** terminate the stream if the session expires.
  - After the response is sent, server **SHOULD** terminate the stream.
  - Disconnections **SHOULD NOT** be interpreted as cancellations — clients **SHOULD** send explicit `CancelledNotification` to cancel.

### Server -> Client (GET)
- Client **MAY** issue HTTP GET to the MCP endpoint to open an SSE stream for server-initiated traffic.
- Client **MUST** include `Accept: text/event-stream`.
- Server **MUST** either return `text/event-stream` or HTTP 405.
- On the GET stream:
  - Server **MAY** send requests + notifications.
  - These **SHOULD** be unrelated to concurrent client requests.
  - Server **MUST NOT** send a JSON-RPC response on this stream unless resuming a stream.

### Multiple connections
- Client **MAY** maintain multiple SSE streams simultaneously.
- Server **MUST NOT** broadcast a single message across multiple streams — pick one.

### Resumability and redelivery
- Servers **MAY** attach `id` to SSE events; if present, **MUST** be globally unique across the session (or globally for the client if no session).
- Event IDs **SHOULD** encode enough info to identify the originating stream.
- To resume after disconnect: client **SHOULD** GET the MCP endpoint with `Last-Event-ID` header. Server **MAY** replay messages after that ID **on the same stream** (and **MUST NOT** replay on a different stream).

## Mechanism: session management

- Server **MAY** assign a session ID via `MCP-Session-Id` header on the `InitializeResult` response.
- Session ID **SHOULD** be globally unique + cryptographically secure (UUID, JWT, hash).
- Session ID **MUST** contain only visible ASCII (0x21-0x7E).
- If server returns a session ID, client **MUST** include it on all subsequent requests.
- Servers that require a session ID **SHOULD** respond with HTTP 400 to non-init requests missing the header.
- Server **MAY** terminate the session at any time; afterwards **MUST** return HTTP 404 for requests with that session ID.
- On HTTP 404 with a stale session ID, client **MUST** start a new session (new `InitializeRequest`, no session ID).
- Clients **SHOULD** send HTTP DELETE with the session ID header to explicitly terminate when no longer needed; server **MAY** reject with 405.

## Mechanism: protocol-version header

- Client **MUST** include `MCP-Protocol-Version: <negotiated-version>` on all post-init HTTP requests.
- Header value **SHOULD** be the one negotiated during initialization.
- If server doesn't receive the header and has no other way to identify version: server **SHOULD** assume `2025-03-26`.
- If server gets an invalid/unsupported version: **MUST** return 400.

## Mechanism: backwards compatibility with 2024-11-05 HTTP+SSE

For chapters covering migration:

**Servers** wanting to support old clients:
- Keep both the SSE + POST endpoints of the old transport alongside the new MCP endpoint.

**Clients** wanting to support old servers:
1. Accept a server URL from the user.
2. Try POSTing `InitializeRequest` with the new `Accept` header.
3. On success: it's a Streamable HTTP server.
4. On 400/404/405:
   - Issue a GET to the server URL.
   - Expect an SSE stream with an initial `endpoint` event.
   - Treat as old HTTP+SSE server and use that transport thereafter.

## Mechanism: custom transports

- Clients/servers **MAY** implement custom transports (any bidirectional channel).
- Custom transports **MUST** preserve JSON-RPC framing and lifecycle requirements.
- Custom transports **SHOULD** document their connection-establishment and message-exchange patterns for interop.

## How implementers interact with this section
- **stdio server author**: keep stdout MCP-only; use stderr for logs. Newline-delimit JSON; no embedded newlines.
- **HTTP server author**: single endpoint. Validate Origin. Bind to localhost for local-only. Decide if you need stateful sessions and if so, set `MCP-Session-Id`.
- **Client author**: support both transport modes. For HTTP, send `MCP-Protocol-Version` on every post-init request; handle 404 by reinitializing.
- **Deployers**: load balancers should currently be sticky-session-aware (2025-11-25). The 2026-07-28 RC removes session stickiness — for cloud deploys, plan to migrate to the stateless model post-RC.

## Cross-references
- See [[spec-lifecycle]] for what the `initialize` request looks like that this transport carries.
- See [[spec-authorization]] for the OAuth flow that layers on top of Streamable HTTP.
- See [[blog-rc-2026-07-28]] for the major changes: stateless protocol core, removal of `MCP-Session-Id`, new required headers `MCP-Protocol-Version` / `Mcp-Method` / `Mcp-Name`, removal of SSE for elicitation.

## Open questions / follow-ups
- The page says the SSE-stream pattern is current; the 2026-07-28 RC keeps SSE in scope but removes the SSE pattern for elicitation specifically. Chapter authors should not present SSE as deprecated wholesale; it's the *use of SSE for elicitation* that's being removed.
