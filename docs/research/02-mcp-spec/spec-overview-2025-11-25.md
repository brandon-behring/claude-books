---
source_url: https://modelcontextprotocol.io/specification/2025-11-25
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25
source_title: Specification — Model Context Protocol
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: mcp-spec
tier: T1-official
cert_domains: [2]
cert_task_areas:
  - MCP server config (`.mcp.json` vs `~/.claude.json`, env var expansion)
  - Effective tool interfaces (descriptions, boundaries, naming)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# MCP 2025-11-25 — Specification Overview

The currently ratified MCP spec revision (2025-11-25). Entry point for every other note in this dossier — describes the client-host-server model, JSON-RPC base, the three security principles, and the four section areas (Base / Server / Client / Utilities). Cite this when chapters need the canonical "what is MCP" line; cite the per-section notes for mechanism-level claims.

## Key takeaways
- MCP is **JSON-RPC 2.0** over either stdio or Streamable HTTP, with stateful sessions and capability negotiation. The schema source-of-truth is the TypeScript `schema.ts`; JSON Schema is derived.
- The architecture is **host -> clients -> servers**: a host runs N clients, each client has a 1:1 stateful session with one server. Servers cannot see other servers or the full conversation — host enforces isolation.
- Three server-offered features (**Resources**, **Prompts**, **Tools**) and three client-offered features (**Sampling**, **Roots**, **Elicitation**) are the protocol primitives. All are optional and negotiated via capabilities.
- The spec normatively requires BCP 14 keywords (MUST / SHOULD / MAY); all conformance language must be ALL-CAPS. Implementations **MUST** support the base protocol and lifecycle; everything else is opt-in.
- Three top-level safety principles are spec-level: **User Consent and Control**, **Data Privacy**, **Tool Safety**. The spec acknowledges it cannot enforce these at the protocol layer and shifts responsibility to implementors via SHOULD-level guidance.

## Quoted (citation-ready)

> "Model Context Protocol (MCP) is an open protocol that enables seamless integration between LLM applications and external data sources and tools. Whether you're building an AI-powered IDE, enhancing a chat interface, or creating custom AI workflows, MCP provides a standardized way to connect LLMs with the context they need."
>
> — Specification — Model Context Protocol, Overview (top of page)
>
> Anchor: `Specification + Model Context Protocol MCP is an open protocol that enables`

> "MCP itself cannot enforce these security principles at the protocol level, implementors **SHOULD**: Build robust consent and authorization flows ..."
>
> — Specification, Security and Trust & Safety / Implementation Guidelines
>
> Anchor: `Implementation Guidelines + While MCP itself cannot enforce these security principles`

## Spec structure (table of contents)

The spec is organized into four area folders under `/specification/2025-11-25/`. Every chapter that cites a mechanism should cite the specific sub-page, not this overview.

| Area | Path | Notes |
|---|---|---|
| Architecture | `/specification/2025-11-25/architecture` | Host/client/server roles, design principles, capability negotiation. See [[spec-architecture]] |
| Base / overview | `/specification/2025-11-25/basic` | JSON-RPC message types, `_meta` field, `icons`. See [[spec-base-protocol]] |
| Base / lifecycle | `/specification/2025-11-25/basic/lifecycle` | initialize handshake + version negotiation + capability table. See [[spec-lifecycle]] |
| Base / transports | `/specification/2025-11-25/basic/transports` | stdio + Streamable HTTP, MCP-Session-Id, DNS-rebinding protections. See [[spec-transports]] |
| Base / authorization | `/specification/2025-11-25/basic/authorization` | OAuth 2.1 framework, RFC 9728 PRM discovery, PKCE, RFC 8707 resource indicators. See [[spec-authorization]] |
| Server / tools | `/specification/2025-11-25/server/tools` | tools/list, tools/call, isError, JSON Schema validation. See [[spec-tools]] |
| Server / resources | `/specification/2025-11-25/server/resources` | URI-addressable read context. See [[spec-resources]] |
| Server / prompts | `/specification/2025-11-25/server/prompts` | User-controlled prompt templates. See [[spec-prompts]] |
| Client / sampling | `/specification/2025-11-25/client/sampling` | Server-initiated LLM completion via client. See [[spec-sampling]] |
| Client / roots | `/specification/2025-11-25/client/roots` | Filesystem boundaries exposed to server. See [[spec-roots]] |
| Client / elicitation | `/specification/2025-11-25/client/elicitation` | Server-initiated user input (form / URL modes). See [[spec-elicitation]] |
| Basic / utilities / tasks | `/specification/2025-11-25/basic/utilities/tasks` | **Experimental** durable-request state machine. See [[spec-tasks-experimental]] |
| Spec changelog | `/specification/2025-11-25/changelog` | Diff vs 2025-06-18. See [[spec-changelog]] |

## Normative language baseline

```
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14 [RFC2119] [RFC8174]
when, and only when, they appear in all capitals, as shown here.
```

Practical implication for book authors: when you quote a "must" or "should" from MCP docs, check that the source has it ALL CAPS — lowercase is non-normative description.

## How a chapter author should use this note
- For "what is MCP" intro paragraphs in handbook ch8 / architect-ref D2 chapters: cite the overview quote above.
- For mechanism-level claims (e.g., "tools use JSON Schema 2020-12") cite the specific per-section note, not this one.
- For the safety/consent framing (especially when discussing why Claude Code prompts before running MCP tools), the three principles above are the canonical source.

## Cross-references
- See [[spec-architecture]] for the host/client/server model in depth.
- See [[spec-base-protocol]] for the `_meta` reservation rules (matters for any custom-key MCP extension).
- See [[blog-rc-2026-07-28]] for what changes in the upcoming 2026-07-28 RC.

## Open questions / follow-ups
- The overview lists "Configuration" as a utility but there is no dedicated page; appears to refer to capabilities + the `Implementation` metadata fields. Worth confirming with the spec maintainers if a Configuration page is planned for the 2026-07-28 cut.
