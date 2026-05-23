---
source_url: https://registry.modelcontextprotocol.io/
canonical_url: https://registry.modelcontextprotocol.io
source_title: Official MCP Registry
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

# Official MCP Registry — registry.modelcontextprotocol.io

The official MCP server registry, launched September 2025. The current state of the page is **thin** when fetched — it relies on dynamic loading, so much of what's visible to a browser doesn't surface to WebFetch. Mark `volatility: evolving` because both the UI and the server count change rapidly. Use this note for the "there is an official registry" claim; defer to the registry directly for actual server enumeration.

## Key takeaways
- Centralized discovery platform for MCP servers, run by MCP contributors.
- Multiple endpoint targets supported:
  - **Production**: `registry.modelcontextprotocol.io`
  - **Staging**: `staging.registry.modelcontextprotocol.io`
  - **Local**: `localhost:8080`
  - Custom endpoints supported.
- "Recently Updated" view with version-filtering capability.
- API reference linked from the site but not fetched in this pass.
- Open-source: **"built in the open by MCP contributors"** on GitHub.
- Current server count: **not visible** via static fetch (dynamic JS). The landscape doc (`docs/landscape-2026-05.md` §2.3) reports the official registry launched September 2025, with current count unverified at the source.

## Quoted (citation-ready)

> "Built in the open by MCP contributors"
>
> — registry.modelcontextprotocol.io, footer/about line
>
> Anchor: `registry + Built in the open by MCP contributors`

## Detail: what the registry is (per the site + landscape doc)

- A **dynamic catalog of MCP servers** — both first-party and community.
- Servers are **published** via the API (auth + publish endpoints).
- Supports versioning — multiple versions per server visible; filter for "latest only."
- **Multiple backends supported** — the registry implementation is itself reusable for staging / local / private deployments.

## Detail: what the page does NOT clearly document (at fetch time)

- No public curation policy or admission criteria visible at fetch.
- No server count visible.
- No clear publication procedure spelled out (the API ref is linked but not on the landing page).
- No governance / moderation policy.

## Cross-checking with the landscape doc

Per `docs/landscape-2026-05.md` §2.3:
- Official MCP Registry launched **September 2025**.
- Third-party registries are larger by raw count:
  - **Glama**: ~21K–24K servers.
  - **Smithery**: ~7K+ servers.
- Cross-registry totals may double-count; absolute numbers are noisy.

## How chapter authors should use this note
- For the "there is an official registry" claim, cite this page + the landscape doc cross-reference.
- For absolute server counts, **don't cite this page** — fetch the live registry API or cite a third-party aggregator with a date.
- For publishing instructions / API reference, follow up by fetching the linked API ref page directly.

## Cross-references
- See [[ecosystem-mcp-overview]] for how the homepage points to the registry.
- See [[news-aaif-donation]] — registry remains community-run under AAIF / Linux Foundation umbrella.

## Open questions / follow-ups
- The registry's API reference URL wasn't captured in this fetch — follow up to capture publish endpoints, auth model, deletion policy.
- The current server count needs to be verified via the API rather than the UI page (static fetch failed to capture).
- Whether the registry plans to enforce conformance suite (SEP-2484) gating for listed servers post-2026-07-28 RC is an open question — worth tracking through 2026.
