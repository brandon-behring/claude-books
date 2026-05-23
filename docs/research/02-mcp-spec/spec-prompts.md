---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/server/prompts
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/server/prompts
source_title: Prompts — Model Context Protocol Specification 2025-11-25
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

# MCP Prompts — `prompts/list`, `prompts/get`, user-controlled templates

Prompts are MCP's **user-controlled** primitive — they appear as slash-commands or pickers, not as something the model auto-selects (tools) or the host auto-includes (resources). Chapter authors covering "how MCP differs from a plain function-calling spec" should anchor on this three-way distinction (model-controlled / app-driven / user-controlled).

## Key takeaways
- Servers supporting prompts **MUST** declare the `prompts` capability. Only sub-flag is `listChanged`.
- Two methods: `prompts/list` (paginated) and `prompts/get` (parameterized retrieval). Plus the `notifications/prompts/list_changed` notification.
- A `Prompt` has `name` (required), `title`, `description`, `arguments[]`, `icons`. Arguments are simple `{name, description, required}` objects.
- `prompts/get` returns a `messages[]` array of `PromptMessage` objects with `role` (user/assistant) and `content`. Content types: `text`, `image`, `audio`, and `resource` (embedded).
- Image/audio/resource embedding **MUST** be base64-encoded with valid MIME type. Embedded resources **MUST** include valid URI, MIME, and either text or blob.
- Argument auto-completion is via the completion API (the `completions` server capability).
- Standard error codes: `-32602` for invalid prompt name / missing required args; `-32603` for internal.

## Quoted (citation-ready)

> "Prompts are designed to be user-controlled, meaning they are exposed from servers to clients with the intention of the user being able to explicitly select them for use. Typically, prompts would be triggered through user-initiated commands in the user interface, which allows users to naturally discover and invoke available prompts."
>
> — Specification 2025-11-25 / Server / Prompts / User Interaction Model
>
> Anchor: `User Interaction Model + Prompts are designed to be user-controlled`

> "Implementations **MUST** carefully validate all prompt inputs and outputs to prevent injection attacks or unauthorized access to resources."
>
> — Specification 2025-11-25 / Server / Prompts / Security
>
> Anchor: `Security + Implementations MUST carefully validate all prompt inputs and outputs`

## Mechanism: capability declaration

```json
{
  "capabilities": {
    "prompts": {
      "listChanged": true
    }
  }
}
```

## Mechanism: `prompts/list`

Request: `{ "method": "prompts/list", "params": { "cursor": "..." } }`

Response:
```json
{
  "result": {
    "prompts": [
      {
        "name": "code_review",
        "title": "Request Code Review",
        "description": "Asks the LLM to analyze code quality and suggest improvements",
        "arguments": [
          { "name": "code", "description": "The code to review", "required": true }
        ],
        "icons": [...]
      }
    ],
    "nextCursor": "next-page-cursor"
  }
}
```

Pagination is cursor-based.

## Mechanism: `prompts/get`

Request:
```json
{
  "method": "prompts/get",
  "params": {
    "name": "code_review",
    "arguments": { "code": "def hello():\n    print('world')" }
  }
}
```

Response:
```json
{
  "result": {
    "description": "Code review prompt",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Please review this Python code:\ndef hello():\n    print('world')"
        }
      }
    ]
  }
}
```

The returned `messages[]` is intended for the host to feed into the LLM as conversation context.

## Mechanism: `PromptMessage` content types

**Text**
```json
{ "type": "text", "text": "The text content of the message" }
```

**Image** (MUST be base64-encoded with valid MIME):
```json
{ "type": "image", "data": "<base64>", "mimeType": "image/png" }
```

**Audio** (MUST be base64-encoded with valid MIME):
```json
{ "type": "audio", "data": "<base64>", "mimeType": "audio/wav" }
```

**Embedded resource**:
```json
{
  "type": "resource",
  "resource": {
    "uri": "resource://example",
    "mimeType": "text/plain",
    "text": "Resource content"
  }
}
```

Embedded resources **MUST** include a valid URI, MIME, and either `text` or base64-encoded `blob`.

All four content types support optional `annotations` (audience, priority, lastModified).

## Mechanism: list changed notification

When prompt list changes, servers with `listChanged: true` **SHOULD** send:
```json
{ "jsonrpc": "2.0", "method": "notifications/prompts/list_changed" }
```

## Mechanism: argument autocompletion

If the server declares the `completions` capability, prompt arguments can be auto-completed through the completion API. (Separate `/utilities/completion` page in the spec.)

## Mechanism: error handling

- Invalid prompt name: `-32602` (Invalid params).
- Missing required arguments: `-32602` (Invalid params).
- Internal errors: `-32603` (Internal error).

## Mechanism: implementation considerations (verbatim)

- Servers **SHOULD** validate prompt arguments before processing.
- Clients **SHOULD** handle pagination for large prompt lists.
- Both parties **SHOULD** respect capability negotiation.
- Implementations **MUST** carefully validate all prompt inputs and outputs to prevent injection attacks or unauthorized access to resources.

## How implementers interact with this section
- **Server author**: prompts are slash-commands, so make them discoverable. Pick clear `name` + `description`. Mark `required: true` only when the prompt is unusable without the arg.
- **Client / host author**: surface prompts as user-driven UI. A common pattern is a `/<prompt-name>` slash command (the spec literally shows this in its example screenshot).
- **Both**: argument validation is critical — prompts execute via `prompts/get` which then runs in the LLM context. Prompt injection from a malicious server is the obvious risk.

## Cross-references
- See [[spec-resources]] for the embedded-resource shape used in prompt content.
- See [[spec-tools]] for the other content-array shape (which is similar but lives on tool results, not prompt messages).
- See [[spec-base-protocol]] for the annotations block used on all message content.

## Open questions / follow-ups
- The spec describes prompts as user-controlled but doesn't normatively forbid an agent from calling `prompts/get` autonomously. In Claude Code, slash-commands feel user-controlled but there's nothing stopping a subagent from invoking. Chapter authors should describe the intent without overstating the protocol enforcement.
