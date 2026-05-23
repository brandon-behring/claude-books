---
source_url: https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation
canonical_url: https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation
source_title: Donating the Model Context Protocol and establishing the Agentic AI Foundation
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

# Anthropic donates MCP to the Linux Foundation (Dec 9, 2025)

Anthropic's announcement that MCP has been donated to the Linux Foundation as a founding project of the new **Agentic AI Foundation** (AAIF). Co-founded with **Block** and **OpenAI**; supporters include Google, Microsoft, AWS, Cloudflare, Bloomberg. The governance model is described as unchanged — project maintainers continue. This is the key citation for any "MCP is vendor-neutral / cross-provider" claim chapter authors make.

## Key takeaways
- **December 9, 2025**: Anthropic announces donation of MCP to the Linux Foundation.
- **Receiving structure**: the **Agentic AI Foundation** (AAIF), a directed fund under the Linux Foundation.
- **AAIF co-founders**: Anthropic, Block, OpenAI.
- **Supporting orgs**: Google, Microsoft, AWS, Cloudflare, Bloomberg.
- **Foundational projects under AAIF**: MCP (Anthropic), **goose** (Block), **AGENTS.md** (OpenAI).
- **Governance**: "The Model Context Protocol's governance model will remain unchanged: the project's maintainers will continue to prioritize community input and transparent decision-making."
- **Stated commitment**: "committed to ensuring MCP remains open-source, community-driven and vendor-neutral."
- **Adoption claim cited**: "more than 10,000 active public MCP servers."

## Quoted (citation-ready)

> "Open-source software is essential for building a secure and innovative ecosystem for agentic AI."
>
> — Anthropic, Donating the Model Context Protocol and establishing the Agentic AI Foundation, December 9, 2025
>
> Anchor: `donation + Open-source software is essential for building a secure and innovative ecosystem`

> "The Model Context Protocol's governance model will remain unchanged: the project's maintainers will continue to prioritize community input and transparent decision-making."
>
> — Anthropic, Donating the Model Context Protocol and establishing the Agentic AI Foundation, December 9, 2025
>
> Anchor: `governance + The Model Context Protocol's governance model will remain unchanged`

## Detail: what the donation actually transfers

- **Trademark / brand**: transferred to Linux Foundation under AAIF directed fund.
- **Governance**: stays with project maintainers (per Anthropic statement). Linux Foundation's role is custodial / legal, not technical.
- **Anthropic's continued role**: contributor through AAIF; not the only voice. Anthropic continues investing engineering time but no longer holds unilateral control.

## Detail: AAIF foundational projects

- **MCP** (Anthropic) — the protocol for connecting models to external systems.
- **goose** (Block) — Block's open-source AI agent framework.
- **AGENTS.md** (OpenAI) — OpenAI's open standard for agent instructions/configuration.

Each project keeps its own maintainer team; the AAIF is the legal + neutral-governance umbrella.

## Detail: industry context

- The announcement comes ~12 months after MCP's initial public release (late 2024).
- "More than 10,000 active public MCP servers" — Anthropic's cited adoption metric at donation time.
- The cross-provider co-founder set (Anthropic + Block + OpenAI) was structurally important — gave MCP credible "vendor-neutral" framing for the AI coding assistant ecosystem (Claude / ChatGPT / Cursor / others adopting MCP).

## Detail: what changes vs what doesn't

**What changed**
- Trademark / domain ownership.
- Legal entity holding the spec.
- New funding mechanism (AAIF directed fund).

**What didn't change**
- The maintainer team and the SEP process.
- The day-to-day spec evolution mechanism.
- The technical roadmap (see [[blog-2026-roadmap]]).

## How chapter authors should use this note
- Cite this for any "MCP is vendor-neutral" or "MCP is governed by an industry foundation" claim.
- Don't use this for SEP-process or release-cadence claims — cite [[spec-changelog]] or [[blog-2026-roadmap]] for those.
- For audit / governance chapters: this is the "structural independence" anchor. The donation makes MCP not-just-an-Anthropic-protocol in a meaningful legal sense.

## Cross-references
- See [[blog-2026-roadmap]] for the post-donation technical direction.
- See [[blog-rc-2026-07-28]] for the first major spec revision under post-donation governance.
- See [[spec-changelog]] for the SEPs that formalized governance structure (932, 994, 1302, 1730) in late 2025 — preparing the ground for the donation.
- See [[ecosystem-mcp-overview]] for the broader ecosystem context.

## Open questions / follow-ups
- The post doesn't specify the open-source license MCP is held under. (MIT / Apache 2.0 historical Anthropic default — verify against the actual spec repo `LICENSE` file).
- AAIF's funding model and budget aren't disclosed in the post — worth tracking once Linux Foundation publishes annual reports.
