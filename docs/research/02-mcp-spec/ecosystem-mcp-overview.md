---
source_url: https://modelcontextprotocol.io/
canonical_url: https://modelcontextprotocol.io
source_title: What is the Model Context Protocol (MCP)?
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

# MCP top-level overview — modelcontextprotocol.io homepage

The canonical "what is MCP for the general developer audience" page. Cite this for any intro paragraph in a chapter. Less mechanism-dense than the spec but gives the elevator pitch and named adopters.

## Key takeaways
- Tagline: **"MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems."**
- The metaphor: **"Think of MCP like a USB-C port for AI applications."** Standardized way to connect models to data sources, tools, workflows.
- Three categories of integration MCP enables (per the page):
  - **Data sources**: local files, databases.
  - **Tools**: search engines, calculators.
  - **Workflows**: specialized prompts.
- Named adopters (clients):
  - **Claude** (Anthropic) — `claude.com/docs/connectors/building`
  - **ChatGPT** (OpenAI) — `developers.openai.com/api/docs/mcp/`
  - **Visual Studio Code** — `code.visualstudio.com/docs/copilot/chat/mcp-servers`
  - **Cursor** — `cursor.com/docs/context/mcp`
  - **MCPJam** — `docs.mcpjam.com/getting-started`
  - "Many others" — referenced via `/clients` page on the docs site.
- Three building paths offered: **Build servers**, **Build clients**, **Build MCP Apps** (the new server-rendered HTML primitive, see [[blog-rc-2026-07-28]]).
- Audience-segmented value props:
  - **Developers**: reduced dev time / complexity for AI app integration.
  - **AI apps / agents**: access to an ecosystem of data sources, tools, apps.
  - **End users**: more capable AI apps that can access user data and take actions.

## Quoted (citation-ready)

> "MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems."
>
> — modelcontextprotocol.io homepage, opening line
>
> Anchor: `homepage + MCP Model Context Protocol is an open-source standard`

> "Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems."
>
> — modelcontextprotocol.io homepage, USB-C analogy paragraph
>
> Anchor: `homepage + Think of MCP like a USB-C port for AI applications`

## Detail: what the homepage names but doesn't define

The homepage references but doesn't deep-dive into:
- **Registry**: pointer to the official registry (`registry.modelcontextprotocol.io`). See [[ecosystem-mcp-registry]].
- **Clients list**: `/clients` page (not fetched here; primarily for the "what clients support MCP" inventory).
- **Specification**: links to `/specification/2025-11-25` for the protocol details. See [[spec-overview-2025-11-25]].

## How chapter authors should use this note
- For the opening paragraph of any MCP chapter, this is the source for the elevator pitch.
- For specific protocol mechanism claims, cite the per-section spec notes, not this page.
- For "who uses MCP" namedrops, this page is a sufficient T1 cite — though the spec landscape doc (`docs/landscape-2026-05.md`) has more detailed adoption stats that may need to be cross-referenced.

## Cross-references
- See [[spec-overview-2025-11-25]] for the actual spec entry point.
- See [[ecosystem-mcp-registry]] for the registry the page references.
- See [[news-aaif-donation]] for the governance backdrop ("open-source" framing).

## Open questions / follow-ups
- The page lists named MCP clients but doesn't enumerate official MCP servers. For server enumeration, refer to [[ecosystem-mcp-registry]] and the third-party registries (Glama, Smithery — noted in `docs/landscape-2026-05.md` §2.3).
