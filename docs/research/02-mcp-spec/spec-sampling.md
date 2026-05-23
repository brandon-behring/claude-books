---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/client/sampling
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/client/sampling
source_title: Sampling — Model Context Protocol Specification 2025-11-25
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: mcp-spec
tier: T1-official
cert_domains: [2]
cert_task_areas:
  - Effective tool interfaces (descriptions, boundaries, naming)
volatility: fast-moving
verified: true
supersedes: []
superseded_by: []
---

# MCP Sampling — server-initiated LLM completion via the client (DEPRECATED in 2026-07-28 RC)

Sampling lets a **server** ask the **client** to run an LLM completion (paying the client's API bill, using the client's models). It enables nested-agentic patterns: a server requesting a summary, classifying a result, or running a tool loop **inside** the client's model. **This whole feature is deprecated in the 2026-07-28 RC** with a 12-month removal window — the replacement guidance is "integrate LLM provider APIs directly." Marked `volatility: fast-moving` for that reason.

## Key takeaways
- Server-initiated LLM call routed via client. Client holds API keys; client runs the model; client returns the completion. Lets servers do "agentic" things without their own API account.
- Client supporting sampling **MUST** declare the `sampling` capability. Sub-flags: `sampling.tools` (enables tool-use in nested sampling) and `sampling.context` (soft-deprecated context inclusion).
- The protocol message is `sampling/createMessage` from server -> client. Response is an `assistant` role completion with `content`, `model` actually used, and `stopReason`.
- **Human in the loop is normative**: clients **SHOULD** present the request for review before sampling and the response before delivery.
- **Tool use in sampling** is new in 2025-11-25. Client declares `sampling.tools` capability; server can send `tools[]` + `toolChoice` (`auto` / `required` / `none`) in the request. Multi-turn tool loop pattern documented.
- **Model selection abstraction**: `modelPreferences` combines `hints[]` (substring-matched, treated as advisory), `costPriority`, `speedPriority`, `intelligencePriority` (all 0.0–1.0). The client maps these to its actual available models.
- Soft-deprecated: `includeContext` values `"thisServer"` and `"allServers"`. Servers **SHOULD** avoid; clients **SHOULD NOT** support without `sampling.context` capability.
- Tool use + result balance is normative: every assistant message with `ToolUseContent` **MUST** be followed by a user message with **only** `ToolResultContent`, matched 1:1 by `toolUseId`.

## Quoted (citation-ready)

> "For trust & safety and security, there **SHOULD** always be a human in the loop with the ability to deny sampling requests. Applications **SHOULD**: Provide UI that makes it easy and intuitive to review sampling requests; Allow users to view and edit prompts before sending; Present generated responses for review before delivery."
>
> — Specification 2025-11-25 / Client / Sampling / User Interaction Model (Warning block)
>
> Anchor: `User Interaction Model + For trust & safety and security, there SHOULD always be a human in the loop`

> "Sampling in MCP allows servers to implement agentic behaviors, by enabling LLM calls to occur nested inside other MCP server features."
>
> — Specification 2025-11-25 / Client / Sampling / User Interaction Model (intro)
>
> Anchor: `User Interaction Model + Sampling in MCP allows servers to implement agentic behaviors`

## Mechanism: capability declaration

Basic:
```json
{ "capabilities": { "sampling": {} } }
```

With tool use:
```json
{ "capabilities": { "sampling": { "tools": {} } } }
```

With (soft-deprecated) context inclusion:
```json
{ "capabilities": { "sampling": { "context": {} } } }
```

Servers **MUST NOT** send tool-enabled sampling requests to clients that haven't declared `sampling.tools`.

## Mechanism: `sampling/createMessage`

Request (server -> client):
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sampling/createMessage",
  "params": {
    "messages": [
      { "role": "user", "content": { "type": "text", "text": "What is the capital of France?" } }
    ],
    "modelPreferences": {
      "hints": [{ "name": "claude-3-sonnet" }],
      "intelligencePriority": 0.8,
      "speedPriority": 0.5
    },
    "systemPrompt": "You are a helpful assistant.",
    "maxTokens": 100
  }
}
```

Response (client -> server):
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "role": "assistant",
    "content": { "type": "text", "text": "The capital of France is Paris." },
    "model": "claude-3-sonnet-20240307",
    "stopReason": "endTurn"
  }
}
```

Request params:
- `messages[]` — conversation history (`role`, `content`). Content types: text / image / audio / tool_use / tool_result.
- `modelPreferences` — preference object (below).
- `systemPrompt` — optional system message.
- `maxTokens` — required.
- `temperature`, `stopSequences`, `metadata` — optional.
- `tools[]`, `toolChoice` — optional, gated by `sampling.tools` capability.

Response: standard chat-completion shape with `role: "assistant"`, content (text or tool_use array), `model` (the model the client actually used), `stopReason` (`endTurn` / `toolUse` / `maxTokens` / `stopSequence`).

## Mechanism: `modelPreferences`

```json
{
  "hints": [
    { "name": "claude-3-sonnet" },
    { "name": "claude" }
  ],
  "costPriority": 0.3,
  "speedPriority": 0.8,
  "intelligencePriority": 0.5
}
```

- `hints[]` — substring-matched against available models. **Clients MAY** map hints to equivalent models from other providers (e.g., a "sonnet" hint could map to `gemini-1.5-pro`).
- `costPriority` — 0.0–1.0; higher prefers cheaper models.
- `speedPriority` — 0.0–1.0; higher prefers faster models.
- `intelligencePriority` — 0.0–1.0; higher prefers more capable models.

Hints are advisory; clients make the final selection.

## Mechanism: tool use in sampling (multi-turn tool loop)

When `sampling.tools` is enabled, the server can include `tools[]` + `toolChoice`:

```json
"tools": [
  {
    "name": "get_weather",
    "description": "Get current weather for a city",
    "inputSchema": { "type": "object", "properties": { "city": { "type": "string" } }, "required": ["city"] }
  }
],
"toolChoice": { "mode": "auto" }
```

`toolChoice.mode`:
- `"auto"` — model decides whether to use tools (default).
- `"required"` — model **MUST** use at least one tool before completing.
- `"none"` — model **MUST NOT** use tools.

When the LLM returns `stopReason: "toolUse"` with `content` as an array of `ToolUseContent` items, the server executes those tools and continues with a follow-up `sampling/createMessage` that appends `ToolResultContent`.

### Tool-use / tool-result balance (normative)

Every assistant message containing `ToolUseContent` blocks **MUST** be followed by a user message that consists **entirely** of `ToolResultContent` blocks, with each tool use matched 1:1 by `toolUseId`, before any other message.

User messages with tool results **MUST** contain only tool results (no other content types). This ensures compatibility with provider APIs that use dedicated tool-result roles (OpenAI's `tool`, Gemini's `function`).

## Mechanism: cross-API compatibility

- Two roles: `user` and `assistant`.
- Tool calls flow in `assistant` messages with `ToolUseContent`.
- Tool results flow in `user` messages with `ToolResultContent`.
- Parallel tool use is allowed (array of `ToolUseContent`). All major providers support it (Claude, OpenAI, Gemini).

## Mechanism: error handling

- User rejected: `-1`.
- Tool result missing in request: `-32602`.
- Tool results mixed with other content: `-32602`.

Example:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": { "code": -1, "message": "User rejected sampling request" }
}
```

## Mechanism: security considerations

Verbatim from the page:
1. Clients **SHOULD** implement user approval controls.
2. Both parties **SHOULD** validate message content.
3. Clients **SHOULD** respect model preference hints.
4. Clients **SHOULD** implement rate limiting.
5. Both parties **MUST** handle sensitive data appropriately.

When tools are used in sampling:
6. Servers **MUST** ensure each `ToolUseContent` is responded to with matching `ToolResultContent` and that the user message contains only tool results.
7. Both parties **SHOULD** implement iteration limits for tool loops.

## How implementers interact with this section
- **Server author considering sampling for 2025-11-25**: this is the "have the host run a nested LLM call for me" pattern. **Plan to migrate off this** — the 2026-07-28 RC deprecates Sampling with a 12-month removal window. Replacement: integrate an LLM provider API directly from your server.
- **Client author**: support `sampling` if you want to host servers that lean on it. Treat sampling requests as a UX event — prompt the user, allow edits, show responses before sending.
- **Both**: respect the tool-use / tool-result balance rule when implementing tool-enabled sampling.

## Cross-references
- See [[spec-tools]] for the related tool primitives (server-side tools, not sampling tools).
- See [[blog-rc-2026-07-28]] — Sampling is one of the three features (with Roots and Logging) deprecated by the 2026-07-28 RC.
- See [[spec-elicitation]] for the analogous server-to-client request mechanism (which is **not** deprecated).

## Open questions / follow-ups
- The 2026-07-28 RC removal window opens July 28, 2026 and runs at least 12 months. Chapters published before July 2027 should still teach sampling (it's annotation-only deprecated; methods, types, capabilities remain functional). Chapters published after July 2027 should treat sampling as removed and use "integrate provider APIs directly" as the canonical pattern.
