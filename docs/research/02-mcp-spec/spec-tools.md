---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
source_title: Tools — Model Context Protocol Specification 2025-11-25
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: mcp-spec
tier: T1-official
cert_domains: [2]
cert_task_areas:
  - Effective tool interfaces (descriptions, boundaries, naming)
  - Structured error responses (`isError`, `errorCategory`, retryability)
  - Tool distribution + `tool_choice` (`auto`/`any`/forced)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# MCP Tools — `tools/list`, `tools/call`, `isError`, JSON Schema 2020-12

The single most-cited MCP section. Three load-bearing things for chapter authors: (1) **tools are model-controlled** (the LLM picks when to call, the host enforces consent), (2) **`isError: true` is for execution errors that the model should self-correct on**, while **JSON-RPC error responses are for protocol errors the model can't fix**, and (3) **tool annotations are untrusted unless the server is trusted** — the spec is explicit. This page survives the 2026-07-28 RC mostly intact; the only structural change is that `inputSchema`/`outputSchema` gain full JSON Schema 2020-12 composition (oneOf/anyOf/allOf/conditionals).

## Key takeaways
- Servers supporting tools **MUST** declare the `tools` capability. With `listChanged: true` they can notify clients when their tool list changes.
- `tools/list` returns paginated list of `Tool` objects: `name`, `title`, `description`, `inputSchema` (required, must be a valid JSON Schema object, defaults to 2020-12), `outputSchema` (optional), `annotations`, `icons`, and `execution.taskSupport`.
- `tools/call` returns a `CallToolResult` with `content[]`, optional `structuredContent`, and **`isError` flag** (default false).
- **The `isError: true` distinction is normative**: input validation failures, API failures, business logic errors return as `isError: true` for model self-correction. Protocol-level issues (unknown tool, malformed request) return as JSON-RPC errors.
- Tool names **SHOULD** be 1-128 chars, case-sensitive, ASCII letters / digits / underscore / hyphen / dot only, **SHOULD NOT** contain spaces or special chars, **SHOULD** be unique within a server.
- Clients **MUST** consider tool annotations untrusted unless the server is trusted. (Annotations include behavioral hints like `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`, `audience`.)
- "For trust & safety and security, there **SHOULD** always be a human in the loop with the ability to deny tool invocations." (verbatim).
- `execution.taskSupport` (`"forbidden"` default, `"optional"`, `"required"`) gates per-tool task-augmented execution. See [[spec-tasks-experimental]].
- When a server provides `outputSchema`, it **MUST** also provide structured results conforming to that schema, and **SHOULD** mirror the JSON in a TextContent block for backwards compat.

## Quoted (citation-ready)

> "Tools in MCP are designed to be model-controlled, meaning that the language model can discover and invoke tools automatically based on its contextual understanding and the user's prompts. However, implementations are free to expose tools through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model. For trust & safety and security, there **SHOULD** always be a human in the loop with the ability to deny tool invocations."
>
> — Specification 2025-11-25 / Server / Tools / User Interaction Model
>
> Anchor: `User Interaction Model + Tools in MCP are designed to be model-controlled`

> "Clients **MUST** consider tool annotations to be untrusted unless they come from trusted servers."
>
> — Specification 2025-11-25 / Server / Tools / Security
>
> Anchor: `Security + Clients MUST consider tool annotations to be untrusted`

## Mechanism: tool definitions

```json
{
  "name": "get_weather",
  "title": "Weather Information Provider",
  "description": "Get current weather information for a location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City name or zip code" }
    },
    "required": ["location"]
  },
  "outputSchema": { "type": "object", "properties": { "...": "..." } },
  "annotations": { "audience": ["assistant"], "priority": 0.9 },
  "icons": [{ "src": "https://example.com/icon.png", "mimeType": "image/png", "sizes": ["48x48"] }],
  "execution": { "taskSupport": "optional" }
}
```

- `name` (required): tool ID. **SHOULD** be 1-128 chars, ASCII alphanumeric plus `_` `-` `.`, case-sensitive, unique within server.
- `title` (optional): human-readable display name.
- `description` (optional but recommended): what the tool does.
- `inputSchema` (required): valid JSON Schema (defaults to 2020-12). **MUST** be an object schema (not null).
- `outputSchema` (optional): structure of the output. Defaults to 2020-12.
- `annotations` (optional): behavioral hints. **Untrusted by clients** unless server is trusted.
- `icons` (optional): see [[spec-base-protocol]] §Icons.
- `execution.taskSupport` (optional): `"forbidden"` (default), `"optional"`, `"required"`. Gates task-augmented invocation.

## Mechanism: `tools/list`

Request:
```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": { "cursor": "..." } }
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [ /* Tool objects */ ],
    "nextCursor": "next-page-cursor"
  }
}
```

Pagination is cursor-based (opaque to client). When the list changes, servers with `listChanged: true` **SHOULD** send `notifications/tools/list_changed`.

## Mechanism: `tools/call`

Request:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": { "name": "get_weather", "arguments": { "location": "New York" } }
}
```

Response (success):
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      { "type": "text", "text": "Current weather in New York:\nTemperature: 72°F\nConditions: Partly cloudy" }
    ],
    "structuredContent": { "temperature": 22.5, "conditions": "Partly cloudy", "humidity": 65 },
    "isError": false
  }
}
```

Content array members can be:
- `{ "type": "text", "text": "..." }`
- `{ "type": "image", "data": "<b64>", "mimeType": "image/png", "annotations": {...} }`
- `{ "type": "audio", "data": "<b64>", "mimeType": "audio/wav" }`
- `{ "type": "resource_link", "uri": "...", "name": "...", "description": "...", "mimeType": "..." }`
- `{ "type": "resource", "resource": { "uri": "...", "mimeType": "...", "text" | "blob": "..." } }`

A tool **MAY** return links to or embed resources for additional context.

## Mechanism: the `isError` distinction

The spec separates **protocol errors** from **tool execution errors** by purpose:

**Protocol error (JSON-RPC error response)** — model can't usefully recover:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": { "code": -32602, "message": "Unknown tool: invalid_tool_name" }
}
```
Use for: unknown tools, malformed requests, server errors, request structure problems.

**Tool execution error (`isError: true` in result)** — model can self-correct:
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "content": [
      { "type": "text", "text": "Invalid departure date: must be in the future. Current date is 08/08/2025." }
    ],
    "isError": true
  }
}
```
Use for: API failures, **input validation errors** (per SEP-1303 in 2025-11-25), business logic errors.

This is one of the most common chapter-author mistakes — validation errors should be `isError: true`, not JSON-RPC `-32602`.

## Mechanism: `outputSchema` + `structuredContent`

If a tool declares `outputSchema`:
- Servers **MUST** provide structured results conforming to that schema (in `structuredContent`).
- Clients **SHOULD** validate `structuredContent` against the schema.
- For backwards compat, the tool **SHOULD** also return the serialized JSON in a TextContent block (so older non-validating clients still work).

## Mechanism: normative MUSTs / SHOULDs / MAYs (curated)

**MUST**
- Servers supporting tools **MUST** declare `tools` capability.
- `inputSchema` **MUST** be a valid JSON Schema object (not null).
- Clients **MUST** consider tool annotations untrusted unless the server is trusted.
- If `outputSchema` is provided, servers **MUST** provide structured results conforming to it.
- Servers **MUST** validate all tool inputs; implement access controls; rate limit; sanitize outputs.

**SHOULD**
- "There **SHOULD** always be a human in the loop with the ability to deny tool invocations."
- Applications **SHOULD** show clearly which tools are exposed to the AI; insert visual indicators when tools are invoked; present confirmation prompts.
- Tool names **SHOULD** be 1-128 chars, case-sensitive, alphanumeric / underscore / hyphen / dot, no spaces, unique within server.
- When tool list changes, servers with `listChanged` **SHOULD** send `notifications/tools/list_changed`.
- Servers using embedded resources **SHOULD** implement the `resources` capability.
- For backwards compat, tools returning structured content **SHOULD** also return serialized JSON in a TextContent block.
- Clients **SHOULD** validate structured results against the schema; prompt for sensitive ops; show tool inputs to the user before calling; validate tool results; implement timeouts; log usage.
- Clients **SHOULD** provide tool execution errors to LLMs for self-correction.

**MAY**
- Tools **MAY** return links to Resources for additional context.
- Resources **MAY** be embedded inline.
- Clients **MAY** provide protocol errors to LLMs (less likely to recover successfully).

## How implementers interact with this section
- **Server author**: write clear `description` text (tool selection accuracy depends on it). Use the spec'd name char-set. Pick `outputSchema` when you can — clients can validate and you get structured downstream consumption.
- **Server author**: return validation failures as `isError: true` with a textual explanation, not as JSON-RPC errors. Model self-correction depends on this.
- **Client author**: enforce per-tool consent UX. Treat annotations as advisory unless you've vetted the server. Validate `structuredContent` when `outputSchema` is present.
- **Host author**: surface clearly *which* tool is being called and *what* arguments were passed before invocation. The spec is explicit that the model is the one selecting, but the human is the one approving.

## Cross-references
- See [[spec-base-protocol]] for the JSON Schema 2020-12 dialect default.
- See [[spec-resources]] for resource embedding in tool results.
- See [[spec-tasks-experimental]] for `execution.taskSupport`.
- See [[blog-rc-2026-07-28]] for the 2026-07-28 RC change to JSON Schema composition (oneOf/anyOf/allOf/conditionals/$ref now allowed in input schemas; security forbids auto-dereferencing external `$ref` URIs).

## Open questions / follow-ups
- The fetched page didn't expand the `ToolAnnotations` shape in detail (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`). For deep chapters on tool design, follow up by reading `schema.ts` directly.
