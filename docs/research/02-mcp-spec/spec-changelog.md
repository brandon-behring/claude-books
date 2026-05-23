---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/changelog
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/changelog
source_title: Key Changes (Changelog) — Model Context Protocol Specification 2025-11-25
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

# MCP 2025-11-25 Changelog — what changed since 2025-06-18

The 2025-11-25 revision lands the **icons** metadata, **URL mode elicitation**, **tasks (experimental)**, **tool use in sampling**, **OAuth Client ID Metadata Documents**, and the **JSON Schema 2020-12 default**. Plus the SEP-1303 clarification that input validation errors should be **`isError: true`**, not protocol errors. This page is the right cite for "MCP added X in November 2025" claims.

## Key takeaways
- Nine major changes from 2025-06-18:
  1. **OpenID Connect Discovery 1.0** support for AS discovery (PR #797).
  2. **Icons** as additional metadata for tools, resources, resource templates, prompts (SEP-973).
  3. **Incremental scope consent** via `WWW-Authenticate` (SEP-835).
  4. Guidance on **tool names** (1-128 chars, ASCII alphanumeric+`_-.`, etc., SEP-986).
  5. **`ElicitResult`** + `EnumSchema` rework to support titled / untitled / single / multi-select enums (SEP-1330).
  6. **URL mode elicitation** (SEP-1036).
  7. **Tool calling in sampling** via `tools` and `toolChoice` (SEP-1577).
  8. **OAuth Client ID Metadata Documents** as a recommended client registration mechanism (SEP-991).
  9. **Experimental Tasks** for durable requests with polling and deferred result retrieval (SEP-1686).
- Ten minor changes — most notable:
  - stderr usable for **all logging types**, not just errors.
  - `Implementation` interface gains optional `description` field.
  - Streamable HTTP **MUST** return HTTP 403 for invalid Origin headers.
  - **Input validation errors** should be Tool Execution Errors (`isError: true`), not Protocol Errors (SEP-1303).
  - **SSE stream polling** support (servers may disconnect at will, SEP-1699).
  - **OAuth PRM discovery** aligned with RFC 9728 — `WWW-Authenticate` is optional with `.well-known` fallback.
  - All primitive types in elicitation schemas support `default` values (SEP-1034).
  - **JSON Schema 2020-12 is the default dialect** for MCP schemas (SEP-1613).
- Schema change: **decouple request payloads from RPC method definitions** into standalone parameter schemas (SEP-1319).
- Governance changes:
  - **Formalize MCP governance structure** (SEP-932).
  - Shared **communication practices and guidelines** for the community (SEP-994).
  - **Working Groups and Interest Groups** formalized (SEP-1302).
  - **SDK tiering system** with clear feature-support and maintenance commitments (SEP-1730).

## Quoted (citation-ready)

> "Clarify that input validation errors should be returned as Tool Execution Errors rather than Protocol Errors to enable model self-correction (SEP-1303)."
>
> — Specification 2025-11-25 / Changelog / Minor changes #5
>
> Anchor: `Minor changes + Clarify that input validation errors should be returned as Tool Execution Errors`

> "Add experimental support for tasks to enable tracking durable requests with polling and deferred result retrieval (SEP-1686)."
>
> — Specification 2025-11-25 / Changelog / Major changes #9
>
> Anchor: `Major changes + Add experimental support for tasks`

## Detail: changes that matter most for chapter authors

### Icons (SEP-973)
- Attach to `Implementation`, `Tool`, `Prompt`, `Resource`.
- Client rendering MUST support PNG/JPEG; SHOULD support SVG/WebP.
- Strict same-origin + no-cred fetch rules. See [[spec-base-protocol]] §Icons.

### URL Mode Elicitation (SEP-1036)
- Servers can direct users to external URLs for sensitive interactions (creds, OAuth, payments).
- Form mode **MUST NOT** be used for sensitive data.
- New error code `-32042` `URLElicitationRequiredError`. See [[spec-elicitation]].

### Tool calling in Sampling (SEP-1577)
- Server can include `tools[]` + `toolChoice` in `sampling/createMessage`.
- Multi-turn loop with strict tool_use / tool_result balance. See [[spec-sampling]].

### Client ID Metadata Documents (SEP-991)
- New preferred OAuth client registration mechanism.
- Client hosts a JSON metadata doc at an HTTPS URL; URL is used as `client_id`.
- AS advertises support via `client_id_metadata_document_supported: true`. See [[spec-authorization]].

### Tasks (SEP-1686)
- Experimental. Durable request state machine. Either side can request task augmentation. See [[spec-tasks-experimental]].

### Tool naming guidance (SEP-986)
- 1-128 chars, ASCII letters + digits + `_` `-` `.`, case-sensitive, **SHOULD** be unique within a server. See [[spec-tools]].

### Validation errors are `isError: true`, not `-32602` (SEP-1303)
- Significant shift for tool authors. Returning a `-32602` for a validation failure prevents the model from self-correcting; return `isError: true` with text content instead. See [[spec-tools]].

### JSON Schema 2020-12 default (SEP-1613)
- All MCP schemas default to 2020-12 when no `$schema` is specified. See [[spec-base-protocol]].

### stderr for all log types
- Servers using stdio transport **MAY** write any log level to stderr — not just errors. Clients **SHOULD NOT** assume stderr means error. See [[spec-transports]].

### Origin validation -> 403
- Streamable HTTP servers **MUST** return HTTP 403 Forbidden for invalid `Origin` headers (was ambiguous previously). See [[spec-transports]].

### SSE polling pattern (SEP-1699 + #1847)
- Servers may close SSE streams at will to avoid long-lived connections.
- Clients poll-reconnect using `Last-Event-ID` header.
- Event IDs **SHOULD** encode stream identity. See [[spec-transports]].

### PRM discovery alignment with RFC 9728 (SEP-985)
- `WWW-Authenticate` resource_metadata is preferred but optional.
- Fallback: probe `.well-known/oauth-protected-resource` URIs. See [[spec-authorization]].

## Detail: governance changes

These are critical for understanding how the 2026-07-28 RC and beyond are produced:

- **SEP-932**: Formalized MCP governance structure (maintainers, core team, decision process).
- **SEP-994**: Shared communication practices for the community.
- **SEP-1302**: Working Groups + Interest Groups model — WGs become the primary vehicle for protocol development.
- **SEP-1730**: SDK tiering system. Tier 1 SDKs commit to feature support + maintenance per a defined scorecard.

These set the stage for the **Linux Foundation / Agentic AI Foundation** donation announced December 2025 — see [[news-aaif-donation]].

## How chapter authors should use this note
- Cite this changelog when explaining "what's new in MCP 2025-11-25" — it's the canonical source.
- For mechanism-level changes (e.g., "validation errors are now `isError: true`"), cite the relevant per-section note and use this changelog as supporting reference.
- Don't use this page as the canonical source for the 2026-07-28 RC changes — that's [[blog-rc-2026-07-28]].

## Cross-references
- See [[spec-overview-2025-11-25]] for the spec entry point.
- See [[spec-tools]] for the validation-error semantics.
- See [[spec-elicitation]] for URL mode.
- See [[spec-sampling]] for tool use in sampling.
- See [[spec-authorization]] for OIDC discovery + CIMD.
- See [[blog-rc-2026-07-28]] for what changes next in July 2026.
- See [[news-aaif-donation]] for governance handoff to Linux Foundation.

## Open questions / follow-ups
- The full GitHub diff between 2025-06-18 and 2025-11-25 is at `github.com/modelcontextprotocol/specification/compare/2025-06-18...2025-11-25` — useful for any chapter that needs to enumerate every commit-level change.
