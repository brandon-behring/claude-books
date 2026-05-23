---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/basic
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/basic
source_title: Overview (Base Protocol) — Model Context Protocol Specification 2025-11-25
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: mcp-spec
tier: T1-official
cert_domains: [2]
cert_task_areas:
  - Effective tool interfaces (descriptions, boundaries, naming)
  - Structured error responses (`isError`, `errorCategory`, retryability)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# MCP Base Protocol — JSON-RPC framing, `_meta`, schema dialect

The base-protocol overview is the page chapter authors should cite when explaining the wire format itself. It anchors three things developers consistently get wrong: (1) every MCP message is JSON-RPC 2.0 — no exceptions, (2) `_meta` has reserved key prefixes that custom extensions **MUST NOT** collide with, and (3) JSON Schema in MCP defaults to **2020-12** dialect, with no `$schema` field required.

## Key takeaways
- Three JSON-RPC message types: **Requests** (must have ID, never null), **Responses** (Result or Error, same ID as request), **Notifications** (no ID, receiver must not respond).
- Request IDs **MUST NOT** have been previously used by the requestor within the same session — i.e., generate fresh IDs each call.
- All implementations **MUST** support the base protocol and lifecycle management. Other components (auth, server features, client features, utilities) **MAY** be implemented based on need.
- The `_meta` field is reserved for protocol metadata with strict key-prefix rules: reverse-DNS form, `modelcontextprotocol` / `mcp` second-label prefixes are reserved (e.g., `io.modelcontextprotocol/`, `dev.mcp/`).
- Default JSON Schema dialect for all schemas (tool input/output, elicitation, etc.) is **2020-12** when no `$schema` is set. Implementations **MUST** support 2020-12 and **MUST** handle unsupported dialects gracefully by returning an error.
- The Icons feature (new in 2025-11-25) is here, not in a feature page: icons can attach to `Implementation`, `Tool`, `Prompt`, `Resource`. Clients rendering icons **MUST** support PNG/JPEG; **SHOULD** support SVG/WebP. Strict same-origin + scheme-allowlist security rules apply.

## Quoted (citation-ready)

> "All messages between MCP clients and servers **MUST** follow the JSON-RPC 2.0 specification."
>
> — Specification 2025-11-25 / Basic / Messages
>
> Anchor: `Messages + All messages between MCP clients and servers MUST follow`

> "All implementations **MUST** support the base protocol and lifecycle management components. Other components **MAY** be implemented based on the specific needs of the application."
>
> — Specification 2025-11-25 / Basic / Overview
>
> Anchor: `Overview + All implementations MUST support the base protocol and lifecycle management`

## Mechanism: the three message shapes

### Request
```ts
{
  jsonrpc: "2.0";
  id: string | number;       // MUST NOT be null
  method: string;
  params?: { [key: string]: unknown };
}
```
- Request **MUST** include a string or integer ID.
- Unlike base JSON-RPC, the ID **MUST NOT** be `null`.
- The request ID **MUST NOT** have been previously used by the requestor within the same session.

### Result response
```ts
{
  jsonrpc: "2.0";
  id: string | number;       // same as request
  result: { [key: string]: unknown };
}
```
- Result **MUST** include the same ID as the request.
- Result **MUST** include a `result` field; `result` **MAY** follow any JSON object structure.

### Error response
```ts
{
  jsonrpc: "2.0";
  id?: string | number;       // same as request; may omit if request unparseable
  error: { code: number; message: string; data?: unknown };
}
```
- Error responses **MUST** include the same ID as the request they correspond to (except in error cases where the ID could not be read due to a malformed request).
- Error responses **MUST** include an `error` field with a `code` and `message`.
- Error codes **MUST** be integers.

### Notification
```ts
{
  jsonrpc: "2.0";
  method: string;
  params?: { [key: string]: unknown };
}
```
- Notifications **MUST NOT** include an ID.
- The receiver **MUST NOT** send a response.

## Mechanism: the `_meta` extension field

Reserved metadata namespace usable on any request/response/notification params. Used by the spec itself for things like `io.modelcontextprotocol/related-task`, and available to custom extensions.

**Key name format:** `prefix/name` or just `name`.

- **Prefix** (if present): reverse-DNS dotted labels followed by `/`. Labels start with a letter and end with letter or digit; interior chars may include hyphens.
- **Reserved prefixes:** any prefix whose **second label** is `modelcontextprotocol` or `mcp`. Examples reserved: `io.modelcontextprotocol/`, `dev.mcp/`, `org.modelcontextprotocol.api/`, `com.mcp.tools/`. Example **not** reserved: `com.example.mcp/` (second label is `example`).
- **Name:** unless empty, **MUST** begin and end with alphanumeric `[a-z0-9A-Z]`; **MAY** contain hyphens, underscores, dots, and alphanumerics in between.

Practical implication: any third-party MCP extension that wants to ride `_meta` must register a reverse-DNS prefix it owns — `acme.example/feature-flag` is fine; `mcp.acme/feature-flag` is forbidden.

## Mechanism: JSON Schema dialect rules

- Default dialect when `$schema` is absent: **JSON Schema 2020-12**.
- Schemas **MAY** include `$schema` to specify a different dialect.
- Implementations **MUST** support at least 2020-12 and **SHOULD** document additional dialects.
- Recommendation: implementors are RECOMMENDED to use JSON Schema 2020-12.
- Clients and servers **MUST** validate schemas according to their declared or default dialect and **MUST** handle unsupported dialects gracefully by returning an appropriate error indicating the dialect is not supported.
- Schemas **MUST** be valid according to their declared or default dialect.

## Mechanism: Icons

Icons (new in 2025-11-25 via SEP-973) attach to `Implementation` / `Tool` / `Prompt` / `Resource`. Object shape:

- `src` (required): URI — `https://`, `http://`, or `data:`.
- `mimeType`: optional MIME type when source doesn't carry one.
- `sizes`: optional array, e.g. `["48x48"]`, `["any"]` for scalable SVG.
- `theme`: optional `"light"` or `"dark"`.

Client rendering rules (MUST):
- **MUST** support `image/png` and `image/jpeg`.
- **SHOULD** support `image/svg+xml` and `image/webp`.
- **MUST** reject icon URIs using unsafe schemes (`javascript:`, `file:`, `ftp:`, `ws:`, local-app URI schemes).
- **MUST NOT** send credentials when fetching (no cookies, no `Authorization` header).
- **SHOULD** verify icon URIs come from same origin as the server.
- **MAY** set image-size limits; **MAY** disallow specific types; **SHOULD** validate magic bytes vs claimed MIME.

## How implementers interact with this section
- **Tool implementers**: use 2020-12 JSON Schema; you don't need a `$schema` field. If your runtime defaults to draft-07, set `$schema` explicitly to 2020-12 to avoid surprises.
- **Custom-extension authors**: register a real reverse-DNS prefix for your `_meta` keys; never collide with `*.modelcontextprotocol.*` / `*.mcp.*` second-labels.
- **Host UI authors**: implement the icon rendering rules. Icons are an exfiltration surface (same-origin issues, JS-in-SVG); follow the security MUSTs.

## Cross-references
- See [[spec-lifecycle]] for `initialize` request/response shape that uses these JSON-RPC primitives.
- See [[spec-tools]] for how `inputSchema` / `outputSchema` use the 2020-12 default.
- See [[spec-tasks-experimental]] for the `io.modelcontextprotocol/related-task` `_meta` key.
- See [[blog-rc-2026-07-28]] for how the 2026-07-28 RC keeps `_meta` but moves protocol metadata (method/name/version) to HTTP headers.

## Open questions / follow-ups
- The page describes Auth as "OPTIONAL" but the per-section [[spec-authorization]] page is dense. Chapter authors should not present auth as merely optional — for any remote/multi-tenant deployment it's effectively required.
