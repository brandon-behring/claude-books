---
source_url: https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/
canonical_url: https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap
source_title: The 2026 MCP Roadmap
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

# The 2026 MCP Roadmap (March 9, 2026)

Published by MCP core maintainers in early March 2026, this post is the canonical source for "what the protocol is prioritizing this year." Four themes, with explicit acknowledgment that release-milestone planning is hard for open-standards work. Marked `volatility: evolving` because the priorities themselves may shift mid-year.

## Key takeaways
- Four themes for 2026:
  1. **Transport Evolution and Scalability** — stateless session handling, horizontal scaling for HTTP transport.
  2. **Agent Communication** — cross-agent / cross-MCP-instance communication patterns.
  3. **Governance Maturation** — Working Groups as primary protocol-development vehicle; new delegation model.
  4. **Enterprise Readiness** — production deployment patterns.
- **Working Group model is the primary vehicle for protocol development in 2026** (not release milestones). Aligned SEPs get expedited review and higher maintainer capacity.
- **Delegation model**: trusted Working Groups will be able to accept SEPs in their domain without waiting for full core review. Core Maintainers retain strategic oversight.
- Concrete things mentioned (not exhaustive):
  - Stateless session handling + horizontal scaling for HTTP transport (delivered by the 2026-07-28 RC, see [[blog-rc-2026-07-28]]).
  - `.well-known` metadata format for server discoverability.
  - Task lifecycle improvements (retry semantics, expiry policies — landed in the RC graduation of Tasks to extension).
  - Contributor ladder + governance delegation framework.
- The post explicitly admits open-standards roadmapping is hard ("A release-oriented roadmap implies a level of predictability that open-standards work rarely has").

## Quoted (citation-ready)

> "A release-oriented roadmap implies a level of predictability that open-standards work rarely has."
>
> — Blog, The 2026 MCP Roadmap, March 9, 2026
>
> Anchor: `roadmap + A release-oriented roadmap implies a level of predictability`

## Detail: the four themes

### 1. Transport Evolution and Scalability
- Stateless session handling for the HTTP transport (delivered May 2026 in the RC).
- Horizontal scaling — making MCP behind round-robin load balancers feasible.

### 2. Agent Communication
- Cross-agent / cross-MCP-instance patterns. Less detail in the post; this is where future SEPs around server-to-server and multi-tenant scenarios likely land.

### 3. Governance Maturation
- Working Groups as primary protocol-development vehicle (formalized via SEP-1302 in 2025-11-25, see [[spec-changelog]]).
- New delegation model — WGs accept SEPs in-domain without full core review.
- Contributor ladder.

### 4. Enterprise Readiness
- Production deployment patterns. Mentions `.well-known` metadata for server discoverability.

## Detail: SEP process changes

- WG-aligned SEPs get **expedited review** + **higher maintainer capacity**.
- Core Maintainers retain **strategic oversight**.
- Tier 1 SDK commitment formalized via SEP-1730 (see [[spec-changelog]]).

## What the post does NOT mention

- **Linux Foundation / Agentic AI Foundation governance handoff** — that announcement is at [[news-aaif-donation]] (Dec 9, 2025). The roadmap post is from a maintainer/protocol perspective, not Anthropic-corporate.
- **Specific RC schedule** — the May 21 RC lock + July 28 final were announced separately.
- **Registry launch timeline** — no roadmap commitment.

## How chapter authors should use this note
- For the broad "where MCP is going in 2026" narrative, cite this post.
- For specific deliverables (stateless transport, etc.), prefer citing [[blog-rc-2026-07-28]] which has the concrete mechanism details.
- For governance/foundation context, prefer [[news-aaif-donation]].

## Cross-references
- See [[blog-rc-2026-07-28]] for the concrete delivery of theme #1 (stateless transport).
- See [[news-aaif-donation]] for the governance backdrop.
- See [[spec-changelog]] for the SEPs that formalized governance (932, 994, 1302, 1730).

## Open questions / follow-ups
- The roadmap is light on agent-communication specifics. Watch the SEP track at `github.com/modelcontextprotocol/specification/issues` for new server-to-server SEPs.
