---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/client/roots
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/client/roots
source_title: Roots — Model Context Protocol Specification 2025-11-25
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: mcp-spec
tier: T1-official
cert_domains: [2]
cert_task_areas:
  - MCP server config (`.mcp.json` vs `~/.claude.json`, env var expansion)
volatility: fast-moving
verified: true
supersedes: []
superseded_by: []
---

# MCP Roots — filesystem boundaries from client to server (DEPRECATED in 2026-07-28 RC)

Roots let the **client** tell the **server** "here are the filesystem boundaries you may operate in" — typically a workspace or project root. **Deprecated in the 2026-07-28 RC** with a 12-month removal window. RC replacement guidance: use tool parameters, resource URIs, or server configuration. Marked `volatility: fast-moving`.

## Key takeaways
- Clients supporting roots **MUST** declare the `roots` capability. Sub-flag `listChanged` means client will notify on root changes.
- Only one method: `roots/list` (server -> client). A `notifications/roots/list_changed` notification is sent client -> server when the list changes (and the client **MUST** send it if `listChanged: true`).
- A `Root` has `uri` (required — **MUST** be `file://` in the current spec) and optional `name`.
- Multiple roots are allowed (e.g., separate frontend / backend repo dirs).
- Security model is shared: clients **MUST** validate URIs (path traversal), only expose roots with appropriate perms, monitor accessibility. Servers **SHOULD** respect root boundaries and handle root unavailability gracefully.

## Quoted (citation-ready)

> "Roots define the boundaries of where servers can operate within the filesystem, allowing them to understand which directories and files they have access to."
>
> — Specification 2025-11-25 / Client / Roots, intro
>
> Anchor: `Roots + Roots define the boundaries of where servers can operate within the filesystem`

> "This **MUST** be a `file://` URI in the current specification."
>
> — Specification 2025-11-25 / Client / Roots / Data Types / Root / uri
>
> Anchor: `Root + A root definition includes uri Unique identifier`

## Mechanism: capability declaration

```json
{ "capabilities": { "roots": { "listChanged": true } } }
```

## Mechanism: `roots/list`

Server -> client request:
```json
{ "jsonrpc": "2.0", "id": 1, "method": "roots/list" }
```

Client response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "roots": [
      {
        "uri": "file:///home/user/projects/myproject",
        "name": "My Project"
      }
    ]
  }
}
```

Multiple roots (e.g., monorepo with separate frontend / backend):
```json
[
  { "uri": "file:///home/user/repos/frontend", "name": "Frontend Repository" },
  { "uri": "file:///home/user/repos/backend",  "name": "Backend Repository" }
]
```

## Mechanism: `notifications/roots/list_changed`

If the client declared `listChanged: true`, it **MUST** send this notification when roots change:
```json
{ "jsonrpc": "2.0", "method": "notifications/roots/list_changed" }
```

Server then typically issues a fresh `roots/list`.

## Mechanism: error handling

- Client doesn't support roots: `-32601` (Method not found).
- Internal errors: `-32603`.

Example:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Roots not supported",
    "data": { "reason": "Client does not have roots capability" }
  }
}
```

## Mechanism: security considerations (verbatim)

**Clients MUST**:
- Only expose roots with appropriate permissions.
- Validate all root URIs to prevent path traversal.
- Implement proper access controls.
- Monitor root accessibility.

**Servers SHOULD**:
- Handle cases where roots become unavailable.
- Respect root boundaries during operations.
- Validate all paths against provided roots.

## Mechanism: implementation guidelines

**Clients SHOULD**:
- Prompt users for consent before exposing roots to servers.
- Provide clear UIs for root management.
- Validate root accessibility before exposing.
- Monitor for root changes.

**Servers SHOULD**:
- Check for roots capability before usage.
- Handle root list changes gracefully.
- Respect root boundaries in operations.
- Cache root information appropriately.

## How implementers interact with this section
- **Client author**: if you're building a project-aware client (an IDE assistant, Claude Code, etc.) and you want servers to know what files are in scope, advertise `roots`. **But** plan to migrate post-2026-07-28 RC — Roots is deprecated.
- **Server author**: if you currently use Roots to scope filesystem ops, the RC migration path is: take filesystem paths as **tool parameters** or model them as **resource URIs** instead. Don't rely on a client-supplied workspace.
- **Both**: today Roots is `file://` only. Don't assume future versions will broaden the scheme — it might just disappear.

## Cross-references
- See [[spec-resources]] for the resource URI pattern that the RC suggests as the replacement.
- See [[spec-tools]] for taking paths as tool parameters (also an RC-recommended replacement).
- See [[blog-rc-2026-07-28]] — Roots is one of three features (with Sampling and Logging) deprecated with the 12-month window.

## Open questions / follow-ups
- The RC says Roots is annotation-only deprecated — methods, types, capabilities still functional through at least May 2027. So clients can keep advertising and servers can keep calling `roots/list`, but should be migrating off.
