# 02 — MCP Spec + Governance

**Topic**: Model Context Protocol — specification (current `2025-11-25` revision per-section), upcoming `2026-07-28` release candidate, governance, and ecosystem reference.

**Primary use**: Chapters touching MCP design / tool design / MCP integration (handbook ch8, ch15; architect-reference D2 chapters; field-guide MCP deployment). The cert covers MCP in Domain 2 (Tool Design & MCP Integration, 18%).

**Source-tier discipline**: every note in this folder is `tier: T1-official` — `modelcontextprotocol.io`, `blog.modelcontextprotocol.io`, and `anthropic.com`. Third-party MCP coverage (Glama, Smithery, blog posts, etc.) is T3 and lives elsewhere.

**Snapshot date**: 2026-05-22. RC final spec publishes 2026-07-28 — re-verify all `volatility: evolving` / `fast-moving` notes after that date.

---

## Notes in this dossier

### Spec — current 2025-11-25 revision (one note per section)

| Note | What it covers | Volatility |
|---|---|---|
| [spec-overview-2025-11-25.md](./spec-overview-2025-11-25.md) | Spec entry point; client-host-server architecture, JSON-RPC, three safety principles, ToC | stable |
| [spec-architecture.md](./spec-architecture.md) | Host/client/server roles, design principles, capability negotiation | stable |
| [spec-base-protocol.md](./spec-base-protocol.md) | JSON-RPC framing, `_meta` reservation rules, JSON Schema 2020-12 default, Icons | stable |
| [spec-lifecycle.md](./spec-lifecycle.md) | `initialize` handshake, version negotiation, capability table, shutdown | evolving (RC removes handshake) |
| [spec-transports.md](./spec-transports.md) | stdio + Streamable HTTP, `Mcp-Session-Id`, `MCP-Protocol-Version`, DNS rebinding | evolving (RC removes session ID) |
| [spec-authorization.md](./spec-authorization.md) | OAuth 2.1 + RFC 9728 PRM + RFC 8707 Resource Indicators + PKCE + CIMD + DCR | evolving (RC tightens further) |
| [spec-tools.md](./spec-tools.md) | `tools/list`, `tools/call`, `isError` semantics, JSON Schema validation, annotations | stable |
| [spec-resources.md](./spec-resources.md) | URI-addressable read context, templates, subscriptions, URI schemes | stable |
| [spec-prompts.md](./spec-prompts.md) | User-controlled prompt templates, `prompts/list` / `prompts/get`, content types | stable |
| [spec-sampling.md](./spec-sampling.md) | Server-initiated LLM completion (DEPRECATED in RC, 12-month removal) | fast-moving |
| [spec-roots.md](./spec-roots.md) | Filesystem boundaries client -> server (DEPRECATED in RC) | fast-moving |
| [spec-elicitation.md](./spec-elicitation.md) | Form + URL mode user prompts, `-32042` URLElicitationRequired, third-party OAuth pattern | stable |
| [spec-tasks-experimental.md](./spec-tasks-experimental.md) | Durable-request state machine (EXPERIMENTAL; graduates to extension in RC) | fast-moving |
| [spec-changelog.md](./spec-changelog.md) | What changed 2025-06-18 -> 2025-11-25 | stable |

### Release candidate, governance, roadmap

| Note | What it covers | Volatility |
|---|---|---|
| [blog-rc-2026-07-28.md](./blog-rc-2026-07-28.md) | **Breaking changes guide** for the 2026-07-28 RC — stateless core, new headers, deprecations | fast-moving |
| [blog-2026-roadmap.md](./blog-2026-roadmap.md) | The 2026 MCP roadmap — four themes, Working Group delegation | evolving |
| [news-aaif-donation.md](./news-aaif-donation.md) | Anthropic donates MCP to Linux Foundation; Agentic AI Foundation established (Dec 9 2025) | stable |

### Ecosystem reference

| Note | What it covers | Volatility |
|---|---|---|
| [ecosystem-mcp-overview.md](./ecosystem-mcp-overview.md) | Top-level modelcontextprotocol.io homepage (elevator pitch, named clients) | stable |
| [ecosystem-mcp-registry.md](./ecosystem-mcp-registry.md) | Official registry at registry.modelcontextprotocol.io | evolving |

**Total: 19 notes** (17 spec + governance, 2 ecosystem).

---

## Cert task areas covered

From `docs/cert-coverage.md` Domain 2 (Tool Design & MCP Integration, 18%):

| Task area | Primary note(s) | Cross-refs |
|---|---|---|
| Effective tool interfaces (descriptions, boundaries, naming) | [spec-tools.md](./spec-tools.md), [spec-elicitation.md](./spec-elicitation.md), [spec-sampling.md](./spec-sampling.md), [spec-tasks-experimental.md](./spec-tasks-experimental.md) | [blog-rc-2026-07-28.md](./blog-rc-2026-07-28.md) |
| Structured error responses (`isError`, `errorCategory`, retryability) | [spec-tools.md](./spec-tools.md), [spec-base-protocol.md](./spec-base-protocol.md), [spec-elicitation.md](./spec-elicitation.md), [spec-tasks-experimental.md](./spec-tasks-experimental.md) | [blog-rc-2026-07-28.md](./blog-rc-2026-07-28.md) (`-32002 -> -32602` change) |
| Tool distribution + `tool_choice` (`auto`/`any`/forced) | [spec-tools.md](./spec-tools.md), [spec-sampling.md](./spec-sampling.md), [spec-lifecycle.md](./spec-lifecycle.md) | — |
| MCP server config (`.mcp.json` vs `~/.claude.json`, env var expansion) | [spec-transports.md](./spec-transports.md), [spec-lifecycle.md](./spec-lifecycle.md), [spec-overview-2025-11-25.md](./spec-overview-2025-11-25.md) | [ecosystem-mcp-overview.md](./ecosystem-mcp-overview.md) |
| Built-in tools (Read, Write, Edit, Bash, Grep, Glob) | (Out of scope here — Claude-built-in tools, not MCP) | See `docs/research/08-claude-code-internals/` |

Coverage is **strong** for the spec-mechanism task areas. The "built-in tools" task area falls into the Claude Code internals dossier, not here.

---

## Migration guidance summary (for chapter authors)

The 2026-07-28 RC is the single most important migration event for any chapter touching MCP. Authors should bake the following into any MCP chapter outline:

### 1. The handshake disappears
- **2025-11-25**: client sends `initialize` -> server responds with capabilities -> client sends `notifications/initialized`. `Mcp-Session-Id` header tracks stateful sessions.
- **2026-07-28 RC**: stateless core. No `initialize`. No `Mcp-Session-Id`. Capability lookup via `server/discover`. Protocol metadata travels in `_meta` and required headers (`MCP-Protocol-Version`, `Mcp-Method`, `Mcp-Name`) on every request.

### 2. Three features deprecated (12-month removal, earliest ~May 2027)
- **Roots** -> tool params, resource URIs, or server config.
- **Sampling** -> integrate LLM provider APIs directly from server.
- **Logging** -> stderr (stdio) or OpenTelemetry (HTTP).

Annotation-only deprecation — methods, types, caps still functional. Chapters published before July 2027 may continue to teach them; chapters published after should treat as legacy.

### 3. Tasks moves out of core to a formal extension
- The 2025-11-25 **experimental** Tasks API is **not forward-compatible**.
- 2026-07-28: lives in `ext-tasks`, task creation is **server-driven** (not client-driven), `tasks/list` is **removed**.
- Migration is required for anyone who shipped against 2025-11-25 Tasks.

### 4. Error code rationalization
- Resource-not-found: `-32002` -> `-32602` (Invalid Params).
- Validation errors should be `isError: true` content, not JSON-RPC errors (this is already true in 2025-11-25 per SEP-1303).

### 5. JSON Schema 2020-12 composition unlocked
- `inputSchema` keeps `type: "object"` root constraint but gains `oneOf` / `anyOf` / `allOf` / conditionals / `$ref`.
- `outputSchema` is unrestricted; `structuredContent` accepts any JSON value.
- **Security**: implementations **MUST NOT** auto-dereference external `$ref` URIs.

### 6. OAuth tightening
- Clients **MUST** validate `iss` per RFC 9207.
- DCR clients **MUST** declare `application_type` (prevents desktop/CLI defaults to `"web"`).
- Credentials bind to issuer (re-register on AS migration).
- Refresh-token + scope-accumulation now formally documented.

### 7. Extensions framework + MCP Apps
- **Extensions framework** (SEP-2133): reverse-DNS IDs, `extensions` map on capabilities, lives in `ext-*` repos, versions independently.
- **MCP Apps** (SEP-1865): server-rendered HTML in sandboxed iframes; templates declared upfront so hosts can prefetch + security-review.
- **Tasks** and **MCP Apps** ship as the two official extensions in 2026-07-28.

### 8. Observability
- W3C Trace Context propagation in `_meta` (`traceparent`, `tracestate`, `baggage`) — SEP-414.
- Caching semantics: `ttlMs` + `cacheScope` on list/read results.

### Practical chapter-author rule
- For chapters publishing before **July 28, 2026**: teach 2025-11-25 as-is, add "evolving" callouts on the affected sections.
- For chapters publishing after **July 28, 2026**: teach the 2026-07-28 model as primary; keep 2025-11-25 as a "this was the previous version" note where it explains current SDK behavior.
- For OAuth chapters: write to the RC; it's a strict superset of 2025-11-25.

---

## Open questions / follow-ups

1. **`ToolAnnotations` field detail** — the spec page didn't expand `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`. For deep chapters on tool design, follow up by reading `schema.ts` directly at `github.com/modelcontextprotocol/specification/blob/main/schema/2025-11-25/schema.ts`.
2. **MCP Apps detail** — the RC blog has the overview but the full SEP-1865 mechanism (template format, security model, host-iframe protocol) needs a deep pass once the final 2026-07-28 spec page lands.
3. **Registry server count** — the official registry's current count is unverified at the source page (dynamic JS). Fetch via the API for chapter content.
4. **Conformance suite** — SEP-2484 introduces a new gating mechanism for Standards Track SEPs reaching Final. Worth tracking which SEPs pass through it post-July 28, 2026.
5. **License of the donated MCP repo** — the AAIF donation post doesn't specify the license. Verify against `LICENSE` in the spec repo.
6. **MCP authorization extensions** — `github.com/modelcontextprotocol/ext-auth` is referenced by the spec but the extensions catalog wasn't enumerated here. Worth a separate pass once it has more ratified extensions.
7. **Roadmap freshness** — the March 9, 2026 roadmap predates the RC. Compare its commitments against the actual RC delivery and re-cite.
8. **Completion / pagination / cancellation / progress utilities** — these are small but spec-defined. Not covered in this dossier; covered indirectly in [spec-base-protocol.md](./spec-base-protocol.md). For dedicated chapters on these, fetch the four `/basic/utilities/*` and two `/server/utilities/*` pages directly.

---

## Cross-references to other dossiers

- For **how Claude Code consumes MCP servers** (`.mcp.json` config patterns, the `mcp_servers` option in Agent SDK, etc.) — see `docs/research/08-claude-code-internals/` (TBD).
- For **the Tool Search Tool / Programmatic Tool Calling / Tool Use Examples patterns** that Anthropic recommends layering on top of MCP at scale — see `docs/research/03-advanced-tool-use/`.
- For **multi-agent patterns** where MCP servers are scoped per subagent — see `docs/research/06-multi-agent-patterns/`.
- For **landscape-2026-05.md** §2: high-level synthesis of MCP state at this snapshot; the per-section notes here are the deep dives.
