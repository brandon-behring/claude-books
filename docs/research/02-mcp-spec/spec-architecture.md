---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/architecture
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/architecture
source_title: Architecture — Model Context Protocol Specification 2025-11-25
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

# MCP Architecture — host / clients / servers + capability negotiation

The architecture page is the canonical source for two structural claims chapter authors make repeatedly: (1) hosts run **multiple clients in parallel** with **1:1 server isolation**, and (2) features are **negotiated** during initialization, not declared statically in a manifest. The diagram and "Design Principles" section below survive verbatim into the 2026-07-28 RC even though the handshake mechanism changes.

## Key takeaways
- **Host** is the LLM application (Claude Desktop, Claude Code, VS Code Copilot). It creates **clients** as inner components — one per server connection — and enforces every security boundary the protocol relies on.
- Each **client** has exactly one stateful session with one **server**. Servers cannot see other servers' state or the full host conversation. This isolation is part of the protocol's design contract, not an optional best-practice.
- **Servers** can run as local subprocesses (stdio) or remote HTTP services. Either way they expose Resources / Prompts / Tools and may request Sampling / Roots / Elicitation from the client.
- Capability negotiation happens once during `initialize`: both sides declare which optional features they support, and **both parties MUST respect declared capabilities throughout the session**. Adding capabilities mid-session is not in the base spec — it requires extensions.
- The four design principles are loadbearing for chapter narrative: easy to build, composable, isolated (no full-conversation read), progressively-extensible.

## Quoted (citation-ready)

> "The Model Context Protocol (MCP) follows a client-host-server architecture where each host can run multiple client instances. This architecture enables users to integrate AI capabilities across applications while maintaining clear security boundaries and isolating concerns."
>
> — Specification 2025-11-25 / Architecture, opening paragraph
>
> Anchor: `Architecture + The Model Context Protocol MCP follows a client-host-server architecture`

> "Servers should not be able to read the whole conversation, nor 'see into' other servers. Servers receive only necessary contextual information ... Cross-server interactions are controlled by the host."
>
> — Specification 2025-11-25 / Architecture / Design Principles (principle 3)
>
> Anchor: `Design Principles + Servers should not be able to read the whole conversation`

## Mechanism: what the host / client / server do

**Host**
- Creates and manages multiple clients.
- Controls client connection permissions and lifecycle.
- Enforces security policies and consent requirements.
- Handles user authorization decisions.
- Coordinates AI/LLM integration and sampling (the host is what actually runs the model when a server asks for sampling).
- Aggregates context across clients (the host sees everything; servers see slices).

**Client**
- Establishes one stateful session per server.
- Handles protocol negotiation and capability exchange.
- Routes protocol messages bidirectionally.
- Manages subscriptions and notifications.
- Maintains security boundaries between servers.
- A host application creates and manages multiple clients, "with each client having a 1:1 relationship with a particular server."

**Server**
- Exposes resources, tools, and prompts via MCP primitives.
- Operates independently with focused responsibilities.
- Can request sampling through the client (the LLM call goes through the host).
- "Must respect security constraints."
- Can be local processes or remote services.

## Mechanism: capability negotiation

The page describes capability negotiation as the gate for every optional feature:

- Servers declare capabilities like resource subscriptions, tool support, prompt templates, logging, completions, tasks.
- Clients declare capabilities like sampling support, roots, elicitation, tasks.
- "Both parties **must respect declared capabilities throughout the session**."
- "Additional capabilities can be negotiated through extensions to the protocol."

The four bulleted examples from the page (verbatim):

```
- Implemented server features must be advertised in the server's capabilities
- Emitting resource subscription notifications requires the server to declare subscription support
- Tool invocation requires the server to declare tool capabilities
- Sampling requires the client to declare support in its capabilities
```

The full capability table lives in [[spec-lifecycle]] — this page only references it.

## Design principles (loadbearing for chapter narrative)

1. **Servers should be extremely easy to build.** Hosts handle orchestration; servers focus on focused capabilities; simple interfaces minimize implementation overhead.
2. **Servers should be highly composable.** Each server in isolation; multiple servers combine seamlessly; shared protocol enables interop.
3. **Servers should not be able to read the whole conversation, nor "see into" other servers.** Cross-server isolation enforced by the host process.
4. **Features can be added to servers and clients progressively.** Core protocol minimal; additional caps negotiated; backwards compat maintained.

Principle 3 is the one chapter authors should cite for any "why doesn't server X get to see what server Y returned?" question.

## How implementers interact with this section

- **Tool implementers**: build a server that declares the `tools` capability. The architecture page tells you *that* you need to declare it; the [[spec-tools]] page tells you *how*.
- **Client implementers**: choose which optional client features to support (sampling, roots, elicitation), declare them, and be prepared to enforce all consent/security policies the spec puts on the host side.
- **Host application authors**: the security model assumes you mediate all server interactions. Don't blindly pass server requests through to the user — the host is the consent enforcement layer.

## Cross-references
- See [[spec-lifecycle]] for the actual capability table and initialize JSON.
- See [[spec-transports]] for how the client physically connects to the server.
- See [[spec-base-protocol]] for the JSON-RPC framing under the architecture.

## Open questions / follow-ups
- The architecture page describes the connection as "stateful." The 2026-07-28 RC eliminates the `initialize` handshake and `MCP-Session-Id` header in favor of a stateless protocol core. The architecture page text has not yet been updated for the RC; chapter authors should consult [[blog-rc-2026-07-28]] for the new model.
