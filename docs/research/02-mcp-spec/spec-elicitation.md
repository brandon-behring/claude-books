---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation
source_title: Elicitation — Model Context Protocol Specification 2025-11-25
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

# MCP Elicitation — server-initiated user prompts (form + URL modes)

Elicitation lets a **server** ask the **client** to get information from the user mid-conversation. It's how a server can ask for an API key (URL mode) or a structured config object (form mode) without baking it into the initial setup. Form mode is in-band JSON-Schema-validated input; URL mode is out-of-band browser-based interaction. Critical for **third-party OAuth** patterns where the MCP server needs the user to authorize an upstream service (and the user's MCP token must not pass through to that upstream).

## Key takeaways
- Clients supporting elicitation **MUST** declare the `elicitation` capability. Sub-flags: `form: {}` and/or `url: {}`. Must declare at least one. Empty `{}` = form-only (backwards compat).
- Two modes: **form** (in-band structured collection with schema) and **url** (out-of-band navigation; data never passes through MCP client).
- Servers **MUST NOT** request sensitive info (passwords, API keys, tokens, payment credentials) via **form mode** — must use **URL mode** for those.
- Single method: `elicitation/create` (server -> client). Plus the `notifications/elicitation/complete` notification (server -> client) for URL mode completion.
- Form mode schemas are restricted: **flat objects with primitive properties only**. Supported types: string (with `email`/`uri`/`date`/`date-time` format), number, integer, boolean, enum (single + multi select, with or without titles). All types support `default` values.
- URL mode requires `mode: "url"`, `url`, `elicitationId`, `message`. The URL is shown to the user; user gives explicit consent before navigation.
- Three response actions: `"accept"` (with content for form mode), `"decline"`, `"cancel"`. Servers handle each differently.
- New error code in 2025-11-25: `-32042` URLElicitationRequiredError — a server can return this from any request to indicate "do a URL elicitation first, then retry."
- Phishing mitigation is normative: server **MUST** verify the user opening the URL is the same user who initiated elicitation (typically via session cookie tied to MCP auth subject).

## Quoted (citation-ready)

> "Servers **MUST NOT** use form mode elicitation to request sensitive information such as passwords, API keys, access tokens, or payment credentials. Servers **MUST** use URL mode for interactions involving such sensitive information."
>
> — Specification 2025-11-25 / Client / Elicitation / User Interaction Model (Warning block)
>
> Anchor: `User Interaction Model + Servers MUST NOT use form mode elicitation to request sensitive information`

> "URL mode elicitation is not for authorizing the MCP client's access to the MCP server (that's handled by MCP authorization). Instead, it's used when the MCP server needs to obtain sensitive information or third-party authorization on behalf of the user."
>
> — Specification 2025-11-25 / Client / Elicitation / URL Mode Elicitation Requests (Note block)
>
> Anchor: `URL Mode Elicitation Requests + URL mode elicitation is not for authorizing the MCP client's access`

## Mechanism: capability declaration

```json
{ "capabilities": { "elicitation": { "form": {}, "url": {} } } }
```

For backwards compat, empty capability = form-only:
```json
{ "capabilities": { "elicitation": {} } }   // equivalent to { "form": {} }
```

Clients **MUST** support at least one mode. Servers **MUST NOT** send unsupported-mode requests.

## Mechanism: `elicitation/create` (form mode)

Server -> client:
```json
{
  "method": "elicitation/create",
  "params": {
    "mode": "form",
    "message": "Please provide your contact information",
    "requestedSchema": {
      "type": "object",
      "properties": {
        "name":  { "type": "string", "description": "Your full name" },
        "email": { "type": "string", "format": "email" },
        "age":   { "type": "number", "minimum": 18 }
      },
      "required": ["name", "email"]
    }
  }
}
```

Client response (after user input):
```json
{
  "result": {
    "action": "accept",
    "content": { "name": "Monalisa Octocat", "email": "octocat@github.com", "age": 30 }
  }
}
```

Schema restrictions:
- **Flat objects with primitive properties only.**
- Strings: `minLength`, `maxLength`, `pattern`, `format` (only `email` / `uri` / `date` / `date-time`), `default`.
- Numbers / integers: `minimum`, `maximum`, `default`.
- Booleans: `default`.
- Enums: single-select via `enum`, single-select-with-titles via `oneOf[{const, title}]`, multi-select via `type: array, items: {enum: ...}`, multi-select-with-titles via `items: {anyOf: [{const, title}]}`. `minItems` / `maxItems` for multi-select.
- No nested objects, no arrays-of-objects (beyond enums), no complex JSON Schema features.

## Mechanism: `elicitation/create` (URL mode)

Server -> client:
```json
{
  "method": "elicitation/create",
  "params": {
    "mode": "url",
    "elicitationId": "550e8400-e29b-41d4-a716-446655440000",
    "url": "https://mcp.example.com/ui/set_api_key",
    "message": "Please provide your API key to continue."
  }
}
```

Client response (after user consents to opening URL):
```json
{ "result": { "action": "accept" } }
```

`action: "accept"` here means "user consented to navigating," not "interaction is complete." The MCP server is responsible for tracking out-of-band completion.

Optional completion notification (server -> client):
```json
{
  "method": "notifications/elicitation/complete",
  "params": { "elicitationId": "550e8400-e29b-41d4-a716-446655440000" }
}
```

## Mechanism: `URLElicitationRequiredError` (`-32042`)

A server can return this from any request (e.g., a `tools/call`) to say "complete this URL elicitation first, then retry":

```json
{
  "error": {
    "code": -32042,
    "message": "This request requires more information.",
    "data": {
      "elicitations": [
        {
          "mode": "url",
          "elicitationId": "550e8400-e29b-41d4-a716-446655440000",
          "url": "https://mcp.example.com/connect?elicitationId=550e8400-e29b-41d4-a716-446655440000",
          "message": "Authorization is required to access your Example Co files."
        }
      ]
    }
  }
}
```

Server **MUST NOT** return `-32042` except when URL mode elicitation is required. All elicitations in the error **MUST** be URL mode and have `elicitationId`.

## Mechanism: three-action response model

```json
{ "result": { "action": "accept" | "decline" | "cancel", "content": { ... } } }
```

- **Accept** — user explicitly approved and submitted. For form mode includes `content`; for URL mode `content` is omitted.
- **Decline** — user explicitly declined. `content` typically omitted.
- **Cancel** — user dismissed without explicit choice (closed dialog, Escape, etc.). `content` typically omitted.

Server should handle each differently: accept -> process; decline -> handle (offer alternatives); cancel -> prompt again later.

## Mechanism: third-party OAuth via URL elicitation (canonical pattern)

The spec walks through this pattern in detail because it's how MCP servers safely integrate with upstream OAuth services without violating token-passthrough rules:

1. Server gets `tools/call` requiring upstream creds.
2. Server stores state binding the elicitation to the user's identity.
3. Server returns `URLElicitationRequiredError` with URL pointing to **server-hosted connect page** (not the third-party AS directly).
4. User consents in MCP client; client opens URL.
5. Server's connect page **verifies the user opening the page is the same user who initiated the elicitation** (typically via session cookie + MCP auth subject match).
6. Server redirects user to third-party AS for OAuth dance.
7. Third-party AS redirects back to server's redirect_uri.
8. Server exchanges code for token; binds token to user identity (server-side storage).
9. Server sends optional `notifications/elicitation/complete`.
10. Client retries the original `tools/call`.

**Critical security boundary**: the third-party token NEVER passes through the MCP client. The MCP client's own bearer token (for MCP auth) remains unchanged.

## Mechanism: safe URL handling

Server requirements (verbatim subset):
- **MUST NOT** include sensitive info about the end-user (creds, PII) in the URL.
- **MUST NOT** provide a URL pre-authenticated to access a protected resource (could be used for impersonation).
- **SHOULD NOT** include clickable URLs in form mode fields.
- **SHOULD** use HTTPS for non-development environments.

Client requirements (verbatim subset):
- **MUST NOT** automatically pre-fetch the URL or any of its metadata.
- **MUST NOT** open the URL without explicit user consent.
- **MUST** show the full URL to the user before consent.
- **MUST** open the URL in a secure manner that doesn't let the client/LLM inspect content or user inputs (iOS example: `SFSafariViewController` good, `WkWebView` bad).
- **SHOULD** highlight the domain to mitigate subdomain spoofing.
- **SHOULD** warn for ambiguous URIs (Punycode).
- **SHOULD NOT** render URLs as clickable in form mode fields.

## Mechanism: phishing mitigation (server-side, normative)

Without this, an attacker (Alice) could trick a victim (Bob) into completing Alice's OAuth flow, resulting in Bob's tokens being bound to Alice's MCP session.

The server **MUST** ensure that the user who started the elicitation request is the same user who completes the authorization flow. Typical mechanism: server-hosted "connect" URL checks a session cookie for the user, compares the `sub` claim from the MCP authorization server against the elicitation's bound user identity, and only then proceeds to the third-party AS.

## Mechanism: statefulness

Most elicitation uses require server-side state per user:
- State **MUST NOT** be associated with session IDs alone.
- State storage **MUST** be protected against unauthorized access.
- For remote MCP servers, user identification **MUST** be derived from MCP authorization credentials (e.g., `sub` claim) when possible.

## How implementers interact with this section
- **Server author**: use form mode for non-sensitive structured input (preferences, IDs, options). Use URL mode for anything sensitive: credentials, payment info, OAuth dances. Never trust client-provided identity claims; rely on MCP auth.
- **Client / host author**: implement both modes for max compatibility. For URL mode, follow every MUST/SHOULD around safe URL display (show full URL, no pre-fetch, secure browser sandbox).
- **Host UI authors**: the three-action model maps cleanly to dialog UX — "Submit" / "Decline" / dismiss (Escape).

## Cross-references
- See [[spec-authorization]] for MCP authorization (which is **different** from URL-mode elicitation OAuth — covered explicitly).
- See [[spec-base-protocol]] for the JSON Schema 2020-12 dialect used in `requestedSchema`.
- See [[spec-tasks-experimental]] for task-augmented elicitation (`tasks.requests.elicitation.create`).

## Open questions / follow-ups
- The page notes URL mode is new in 2025-11-25 and "may change in future protocol revisions" — chapter authors should flag this as evolving in any deep treatment. (The 2026-07-28 RC does NOT deprecate elicitation, but removes the SSE pattern for it.)
