---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
source_title: Authorization — Model Context Protocol Specification 2025-11-25
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

# MCP Authorization — OAuth 2.1 + RFC 9728 PRM + RFC 8707 Resource Indicators + PKCE

This is the densest section in the spec. Three things load-bear for chapter authors: (1) MCP authz is built on **OAuth 2.1 draft 13** + a specific subset of RFCs, not vanilla OAuth 2.0, (2) the **Resource Indicators (RFC 8707) `resource` parameter is MUST-level** on every authorization and token request, and (3) MCP servers **MUST NOT** pass through tokens to upstream APIs — they get their own tokens. The 2026-07-28 RC tightens this further (mandatory `iss` validation, DCR `application_type`, refresh-token binding) — see [[blog-rc-2026-07-28]]. Marked `volatility: evolving`.

## Key takeaways
- Auth is **OPTIONAL** at the protocol level but **mandatory in practice** for any remote MCP server. STDIO servers **SHOULD NOT** use this spec — they get credentials from env.
- Standards baseline:
  - **OAuth 2.1** draft 13 (not 2.0)
  - **RFC 8414** Authorization Server Metadata
  - **RFC 7591** Dynamic Client Registration (DCR)
  - **RFC 9728** OAuth 2.0 Protected Resource Metadata (**MUST** for MCP servers)
  - **OAuth Client ID Metadata Documents** draft (the preferred registration mechanism)
- Three registration mechanisms (priority order):
  1. Pre-registered credentials (existing relationship).
  2. **Client ID Metadata Documents** (URL-as-client-id; preferred for new MCP relationships).
  3. **Dynamic Client Registration** (RFC 7591) as fallback.
- Discovery: client makes unauth'd request, gets `WWW-Authenticate` header with `resource_metadata` URL **or** falls back to `.well-known/oauth-protected-resource` probe. Then resolves AS metadata via `.well-known/oauth-authorization-server` or `.well-known/openid-configuration` (with documented priority order for path-based issuers).
- **Resource Indicators (RFC 8707)**: client **MUST** include `resource=<canonical-MCP-server-URI>` in **both** authorization and token requests. Server **MUST** validate the token's intended audience.
- **PKCE is mandatory**: clients **MUST** implement PKCE; **MUST** use `S256` when capable; **MUST** refuse to proceed if AS metadata omits `code_challenge_methods_supported`.
- **Token passthrough is forbidden**: MCP servers **MUST NOT** forward the client's token to upstream APIs. If the MCP server needs upstream access, it acts as an OAuth client to that upstream with separate tokens.
- Step-up auth uses `WWW-Authenticate: Bearer error="insufficient_scope", scope="..."` to incrementally request more scopes at runtime.

## Quoted (citation-ready)

> "MCP clients **MUST** implement Resource Indicators for OAuth 2.0 as defined in RFC 8707 to explicitly specify the target resource for which the token is being requested ... MCP clients **MUST** send this parameter regardless of whether authorization servers support it."
>
> — Specification 2025-11-25 / Authorization / Resource Parameter Implementation
>
> Anchor: `Resource Parameter Implementation + MCP clients MUST implement Resource Indicators`

> "If the MCP server makes requests to upstream APIs, it may act as an OAuth client to them. The access token used at the upstream API is a separate token, issued by the upstream authorization server. The MCP server **MUST NOT** pass through the token it received from the MCP client."
>
> — Specification 2025-11-25 / Authorization / Security Considerations / Access Token Privilege Restriction
>
> Anchor: `Access Token Privilege Restriction + If the MCP server makes requests to upstream APIs`

## Mechanism: discovery flow

**Step 1.** Client sends unauthenticated MCP request -> server returns HTTP 401, ideally with `WWW-Authenticate: Bearer resource_metadata="<URL>", scope="<scopes>"`.

**Step 2.** Client fetches PRM:
- Preferred: URL from `resource_metadata=` in WWW-Authenticate.
- Fallback: probe `https://<host>/.well-known/oauth-protected-resource/<mcp-path>` then `https://<host>/.well-known/oauth-protected-resource`.

**Step 3.** PRM `authorization_servers` field gives the AS issuer URL(s). Client picks one per RFC 9728 §7.6.

**Step 4.** Client fetches AS metadata in priority order:

For path-bearing issuers like `https://auth.example.com/tenant1`:
1. `https://auth.example.com/.well-known/oauth-authorization-server/tenant1`
2. `https://auth.example.com/.well-known/openid-configuration/tenant1`
3. `https://auth.example.com/tenant1/.well-known/openid-configuration`

For root issuers like `https://auth.example.com`:
1. `https://auth.example.com/.well-known/oauth-authorization-server`
2. `https://auth.example.com/.well-known/openid-configuration`

**Step 5.** Client validates AS metadata has `code_challenge_methods_supported` (PKCE) — **MUST** refuse to proceed if missing.

## Mechanism: client registration

Priority order from the spec:
1. Use pre-registered client_id if available.
2. Use Client ID Metadata Documents if AS advertises `client_id_metadata_document_supported: true`.
3. Fall back to DCR if AS exposes `registration_endpoint`.
4. Prompt the user as last resort.

**Client ID Metadata Documents** (preferred new mechanism):
- Client hosts a JSON doc at an `https://` URL with a path component (e.g., `https://app.example.com/oauth/client-metadata.json`).
- Doc includes `client_id` (matches URL exactly), `client_name`, `redirect_uris`, and other OAuth metadata.
- AS fetches the doc when it sees a URL-formatted `client_id`, validates the URL match, caches per HTTP headers.
- Solves the "no prior relationship" case for MCP without requiring DCR.

**Dynamic Client Registration (RFC 7591)**:
- Allowed (MAY) for backwards compat.
- POST to `registration_endpoint` to get a `client_id`.

## Mechanism: scope selection

Client **SHOULD** request only what's needed:
1. Use the `scope` parameter from the initial 401's `WWW-Authenticate` header if present.
2. Otherwise use `scopes_supported` from PRM; omit `scope` param if PRM has no `scopes_supported`.

Step-up at runtime: if a request returns 403 with `error="insufficient_scope"` and `scope="<required>"`, client should request an upgraded token.

## Mechanism: authorization flow steps

1. Client makes request without token; gets 401 with WWW-Authenticate.
2. Client fetches PRM, then AS metadata.
3. Client registers (pre-registered, CIMD, or DCR).
4. Client generates PKCE parameters, builds auth URL with `resource=<MCP-canonical-URI>` and chosen scope.
5. User completes auth via browser; AS redirects back with code.
6. Client exchanges code for token at AS, sending `code_verifier` and `resource` again.
7. Client retries the MCP request with `Authorization: Bearer <access-token>`.

## Mechanism: token usage

- Tokens **MUST** be sent via `Authorization: Bearer <token>` header.
- Tokens **MUST NOT** be in URI query string.
- Authorization header **MUST** be included on every request, even within the same logical session.

## Mechanism: canonical server URI

The `resource` parameter value **MUST** be the MCP server's canonical URI per RFC 8707 §2.

Valid:
- `https://mcp.example.com/mcp`
- `https://mcp.example.com`
- `https://mcp.example.com:8443`
- `https://mcp.example.com/server/mcp` (when path identifies a specific server)

Invalid:
- `mcp.example.com` (missing scheme)
- `https://mcp.example.com#fragment` (has fragment)

Implementations **SHOULD** consistently use the no-trailing-slash form for interop.

## Mechanism: server-side token validation

Servers (acting as OAuth 2.1 resource servers) **MUST**:
- Validate tokens per OAuth 2.1 §5.2.
- Validate that the token was issued specifically for them as audience (RFC 8707 §2).
- Reject invalid/expired tokens with HTTP 401.
- Accept ONLY tokens intended for themselves; **MUST** reject tokens that don't list them in the audience claim.
- **MUST NOT** accept or transit any other tokens.

## Mechanism: error codes

| Status | Meaning | Use |
|---|---|---|
| 401 Unauthorized | Auth required or token invalid | Send `WWW-Authenticate: Bearer ...` |
| 403 Forbidden | Insufficient scope or perms | Send `WWW-Authenticate: Bearer error="insufficient_scope", scope="..."` |
| 400 Bad Request | Malformed auth request | — |

Example 403 (step-up):
```http
HTTP/1.1 403 Forbidden
WWW-Authenticate: Bearer error="insufficient_scope",
                         scope="files:read files:write user:profile",
                         resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource",
                         error_description="Additional file write permission required"
```

## Mechanism: security considerations (high-stakes MUSTs)

**Token audience binding (RFC 8707)**
- Clients **MUST** send `resource` in auth + token requests.
- Servers **MUST** validate tokens were issued for them.

**Token theft**
- Implement secure token storage per OAuth 2.1 §7.1.
- AS **SHOULD** issue short-lived access tokens.
- For public clients, AS **MUST** rotate refresh tokens.

**Communication security**
- All AS endpoints **MUST** be HTTPS.
- All redirect URIs **MUST** be `localhost` or HTTPS.

**Authorization Code Protection (PKCE)**
- Clients **MUST** implement PKCE per OAuth 2.1 §7.5.2.
- Clients **MUST** use `S256` when technically capable.
- Clients **MUST** verify PKCE support via `code_challenge_methods_supported` in AS metadata before proceeding; refuse otherwise.

**Open Redirection**
- Clients **MUST** have redirect URIs registered with AS.
- AS **MUST** validate exact redirect URIs.
- Clients **SHOULD** use + verify `state` parameter.

**Client ID Metadata Document Security**
- AS **SHOULD** mitigate SSRF when fetching CIMD URLs.
- AS **SHOULD** display additional warnings for `localhost`-only redirect URIs.
- AS **MAY** implement domain-based trust policies.

**Confused Deputy**
- MCP proxy servers with static client IDs **MUST** obtain user consent for each dynamically registered client before forwarding to third-party AS.

**Access Token Privilege Restriction**
- MCP server **MUST** validate the audience claim.
- MCP server **MUST NOT** pass through tokens to upstream APIs.
- Client **MUST** use `resource` parameter (RFC 8707).

## How implementers interact with this section
- **Remote MCP server author**: implement RFC 9728 PRM. Host `.well-known/oauth-protected-resource`. Validate token audience strictly. Don't pass tokens through. Use HTTPS.
- **Client / host author**: implement PKCE (S256). Send `resource` on every auth + token request. Handle `WWW-Authenticate` parsing + scope step-up. Pick CIMD over DCR when possible.
- **Authorization server operator**: implement OAuth 2.1; advertise `code_challenge_methods_supported`; advertise `client_id_metadata_document_supported` if you implement CIMD; implement SSRF protection for CIMD fetches.

## Cross-references
- See [[spec-transports]] for where the `Authorization` header rides.
- See [[spec-elicitation]] for the **URL-mode elicitation** pattern — distinct from MCP authz, used when MCP server needs the user to authorize a third-party service.
- See [[blog-rc-2026-07-28]] for 2026-07-28 RC authz tightening: mandatory `iss` per RFC 9207, DCR `application_type` declaration, credential binding to issuer, refresh-token + scope-accumulation formalization, `.well-known` suffix clarifications.

## Open questions / follow-ups
- The page acknowledges MCP authz extensions live in `github.com/modelcontextprotocol/ext-auth`. Worth a separate research pass once that repo has a few extensions ratified.
