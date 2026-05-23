---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/server/resources
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/server/resources
source_title: Resources — Model Context Protocol Specification 2025-11-25
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: mcp-spec
tier: T1-official
cert_domains: [2]
cert_task_areas:
  - MCP server config (`.mcp.json` vs `~/.claude.json`, env var expansion)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# MCP Resources — URI-addressable read context (application-driven)

Resources are the "give the model some context, don't give the model a tool" primitive. They're URI-addressable, support subscriptions, and follow an **application-driven** interaction model — meaning unlike Tools (model-controlled) and Prompts (user-controlled), the **host application decides** when and how to surface resources. Chapter authors confusing the three primitives should anchor on this distinction.

## Key takeaways
- Servers supporting resources **MUST** declare the `resources` capability. Two optional sub-flags: `subscribe` (per-resource change subscriptions) and `listChanged` (list-level change notifications).
- Resources are **application-driven**: host UI decides how to expose them (picker, search, automatic inclusion).
- Four methods: `resources/list`, `resources/read`, `resources/templates/list`, `resources/subscribe` (and the implicit `notifications/resources/updated`, `notifications/resources/list_changed`).
- A `Resource` has `uri` (required), `name` (required), optional `title`, `description`, `mimeType`, `size`, `icons`, and the standard `annotations` block (`audience`, `priority`, `lastModified`).
- Resource contents come as either `text` or `blob` (base64), with `uri` and `mimeType` always present.
- **Resource Templates** use RFC 6570 URI templates (e.g., `file:///{path}`) for parameterized resources, with arguments auto-completable via the completion API.
- Standard URI schemes: `https://` (only when client can fetch directly), `file://` (for filesystem-like resources, may not map to real disk), `git://`, plus implementation-defined custom schemes (RFC 3986 compliant).
- Resource-not-found uses **JSON-RPC code `-32002`** (proprietary). The 2026-07-28 RC migrates this to standard `-32602` Invalid Params.

## Quoted (citation-ready)

> "Resources in MCP are designed to be application-driven, with host applications determining how to incorporate context based on their needs."
>
> — Specification 2025-11-25 / Server / Resources / User Interaction Model
>
> Anchor: `User Interaction Model + Resources in MCP are designed to be application-driven`

> "Servers should use [the `https://` scheme] only when the client is able to fetch and load the resource directly from the web on its own—that is, it doesn't need to read the resource via the MCP server. For other use cases, servers should prefer to use another URI scheme, or define a custom one, even if the server will itself be downloading resource contents over the internet."
>
> — Specification 2025-11-25 / Server / Resources / Common URI Schemes / https://
>
> Anchor: `Common URI Schemes + https:// + Used to represent a resource available on the web`

## Mechanism: capability declaration

```json
{
  "capabilities": {
    "resources": {
      "subscribe": true,        // per-resource subscriptions supported
      "listChanged": true       // list-change notifications supported
    }
  }
}
```

Both sub-caps are optional and independent — servers can support neither, either, or both.

## Mechanism: `resources/list`

Request:
```json
{ "jsonrpc": "2.0", "id": 1, "method": "resources/list", "params": { "cursor": "..." } }
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resources": [
      {
        "uri": "file:///project/src/main.rs",
        "name": "main.rs",
        "title": "Rust Software Application Main File",
        "description": "Primary application entry point",
        "mimeType": "text/x-rust",
        "icons": [...]
      }
    ],
    "nextCursor": "next-page-cursor"
  }
}
```

Cursor-based pagination same as tools.

## Mechanism: `resources/read`

```json
{ "jsonrpc": "2.0", "id": 2, "method": "resources/read", "params": { "uri": "file:///project/src/main.rs" } }
```

Response carries a `contents` array. Each entry is either text:
```json
{ "uri": "file:///example.txt", "mimeType": "text/plain", "text": "Resource content" }
```
or binary (blob):
```json
{ "uri": "file:///example.png", "mimeType": "image/png", "blob": "base64-encoded-data" }
```

## Mechanism: resource templates

For parameterized resources (e.g., file paths):

```json
{ "jsonrpc": "2.0", "id": 3, "method": "resources/templates/list" }
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "resourceTemplates": [
      {
        "uriTemplate": "file:///{path}",
        "name": "Project Files",
        "title": "📁 Project Files",
        "description": "Access files in the project directory",
        "mimeType": "application/octet-stream",
        "icons": [...]
      }
    ]
  }
}
```

Templates use **RFC 6570 URI templates**. Arguments can be auto-completed via the completion API.

## Mechanism: subscriptions

Servers that declare `subscribe: true` can be subscribed to:

```json
{ "jsonrpc": "2.0", "id": 4, "method": "resources/subscribe", "params": { "uri": "file:///project/src/main.rs" } }
```

Then server emits `notifications/resources/updated`:
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/resources/updated",
  "params": { "uri": "file:///project/src/main.rs" }
}
```

Client typically responds by re-reading. (The spec doesn't bundle new content in the notification — it's a notify-and-fetch pattern.)

When the resource list itself changes, servers with `listChanged: true` send:
```json
{ "jsonrpc": "2.0", "method": "notifications/resources/list_changed" }
```

## Mechanism: annotations on resources

The standard annotations block (also used by Tools content and Prompts content):

```json
{
  "annotations": {
    "audience": ["user", "assistant"],      // who should see it
    "priority": 0.8,                         // 0.0–1.0, 1 = most important
    "lastModified": "2025-01-12T15:00:58Z"   // ISO 8601
  }
}
```

Clients can use these to filter by audience, prioritize for context inclusion, sort by recency.

## Mechanism: common URI schemes (normative)

- `https://` — "**SHOULD** use only when client can fetch the resource directly itself."
- `file://` — filesystem-like resources; may not map to a real filesystem. **MAY** use XDG MIME types like `inode/directory` for non-regular files.
- `git://` — git version control.
- Custom — **MUST** be RFC 3986 compliant.

The `https://` guidance is subtle but important: if the server is going to download and proxy the resource itself, **don't** use `https://` — pick a different scheme (or custom). Use `https://` only for "client, fetch this URL directly."

## Mechanism: error handling

- Resource not found: `-32002` (proprietary code, **changes to `-32602` in 2026-07-28 RC** per SEP-2164).
- Internal errors: `-32603`.

Example:
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "error": {
    "code": -32002,
    "message": "Resource not found",
    "data": { "uri": "file:///nonexistent.txt" }
  }
}
```

## Mechanism: security considerations (verbatim)

1. Servers **MUST** validate all resource URIs.
2. Access controls **SHOULD** be implemented for sensitive resources.
3. Binary data **MUST** be properly encoded.
4. Resource permissions **SHOULD** be checked before operations.

## How implementers interact with this section
- **Server author**: choose `https://` only for "client, fetch this yourself." Otherwise pick a non-http scheme (or custom). Use templates for parameterized access (e.g., a file-system server).
- **Server author**: if your resources change, declare `listChanged` and/or `subscribe`. Most servers can skip both.
- **Client author**: pre-fetch via the application-driven UI pattern. The user picks; you read. Validate the URI before passing to the server's read.
- **Host author**: surface resource pickers, search, or automatic context inclusion based on `priority` + `audience`.

## Cross-references
- See [[spec-tools]] for how a tool result can embed a Resource via `type: "resource"` or link via `type: "resource_link"`.
- See [[spec-prompts]] for resource embedding inside prompt messages.
- See [[blog-rc-2026-07-28]] for the `-32002 -> -32602` error code change.

## Open questions / follow-ups
- The page doesn't enumerate resource-completion behavior beyond a pointer to `/utilities/completion`. For chapters covering autocomplete UX, follow up there.
