---
source_url: https://www.trendmicro.com/en_us/research/26/d/weaponizing-trust-claude-code-lures-and-github-release-payloads.html
canonical_url: https://www.trendmicro.com/en_us/research/26/d/weaponizing-trust-claude-code-lures-and-github-release-payloads.html
source_title: Weaponizing Trust — Claude Code lures and GitHub release payloads
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: reliability-governance
tier: T3-practitioner
cert_domains: [3, 5]
cert_task_areas:
  - Information provenance (claim-source mappings, temporal data)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Claude Code npm sourcemap leak — v2.1.88 (Mar 31, 2026)

Third-party reporting (Trend Micro + Zscaler ThreatLabz cross-citation). Not a CVE, not a sandbox bypass — a **supply-chain disclosure incident** plus the **threat-actor opportunism** that followed. The most-cited 2026 incident in security press because the lure-and-payload cycle was unusually fast.

Note: WebFetch returned 403 on the Trend Micro URL at fetch time. Findings below are reconstructed from Zscaler ThreatLabz's reporting (which fetched successfully) and the landscape doc §6.2.

## Key takeaways

- **What shipped**: `@anthropic-ai/claude-code@2.1.88` on npm included a **59.8 MB JavaScript source-map file** (`.map`). The map exposed approximately **513,000 lines of unobfuscated TypeScript across 1,906 files**, revealing client-side agent harness internals.
- **Disclosure trigger** (Mar 31, 2026): security researcher **Chaofan Shou** publicly disclosed the leak on X. Within hours the source map was downloaded, mirrored, and forked tens of thousands of times.
- **Threat-actor lure-and-payload cycle** (within days of disclosure):
  - Trojanized GitHub repositories impersonating "leaked Claude Code source" appeared. One repository ranked near the top of Google search results for the phrase "leaked Claude Code," making discovery trivial for curious developers.
  - A malicious 7z archive titled "Claude Code - Leaked Source Code" contained `ClaudeCode_x64.exe` (a Rust-based dropper) that deployed:
    - **Vidar v18.7** — credential / information stealer.
    - **GhostSocks** — network traffic proxy / SOCKS-based pivot.
  - Threat actors rotated malicious ZIPs at short intervals across multiple GitHub accounts.
- **Anthropic remediation**:
  - DMCA notices issued to some mirrors. Per Zscaler ThreatLabz: "the code is now available across hundreds of public repositories" — DMCA take-down was not a containment strategy that worked.
  - The npm package was updated to remove the sourcemap; subsequent versions did not ship the .map.
- **Why the book cites this incident**:
  - **Supply-chain hygiene** — even a one-version error in build configuration (forgetting to exclude `.map` from npm publish) created a permanent public artifact. Architect-reference Ch on agent deployment should flag the build-configuration discipline.
  - **Social-engineering amplification** — the lure cycle exploited curiosity and SEO. Field-guide security chapter material: how to recognize tainted "leaked Claude Code" archives and why running them inside a non-sandboxed environment was the worst-case path.
  - **Trust boundary**: the source map *itself* doesn't expose secrets; it exposes architecture, control flow, and (potentially) hardcoded prompts / tool definitions. The relevant threat is competitive intelligence + faster prompt-injection research, not direct credential theft.

## Quoted (citation-ready)

> "The leaked file contained approximately 513,000 lines of unobfuscated TypeScript across 1,906 files"
>
> — Zscaler ThreatLabz, *Anthropic Claude Code leak* (research)
>
> Anchor: `Anthropic Claude Code leak + The leaked file contained approximately 513000 lines`

> "the code is now available across hundreds of public repositories"
>
> — Zscaler ThreatLabz, *Anthropic Claude Code leak* (research, on DMCA-take-down futility)
>
> Anchor: `Anthropic Claude Code leak + the code is now available across hundreds`

> "Threat actors are actively leveraging the recent Claude Code leak as a social engineering lure"
>
> — Zscaler ThreatLabz, *Anthropic Claude Code leak* (research, on lure activity)
>
> Anchor: `Anthropic Claude Code leak + Threat actors are actively leveraging the recent Claude Code`

## Cross-references

- See [[advisories-claude-code-github]] — the sourcemap leak does not have a GHSA entry; it is a supply-chain hygiene incident, not a code-flaw CVE.
- See [[incident-sandbox-bypass]] + [[incident-deeplink-rce-may12]] — the other two events in the 2026-Q2 60-day cluster.
- See `/Users/brandonbehring/claude-books/docs/landscape-2026-05.md` §6.2 — the landscape synthesis.

## Open questions / follow-ups

- **Direct fetch of the Trend Micro URL** — returned 403 on this attempt. Acquire a quotable sentence and exact disclosure-timeline phrasing from Trend Micro on a clean re-fetch.
- **Anthropic post-mortem on build pipeline** — did the org publish a "what changed in our release process" follow-up? The April 23 postmortem covers the quality bugs but not the build-pipeline incident. Worth tracking.
- **Any prompt-injection technique improvements after the source map?** Hard to attribute publicly; track via prompt-injection paper publication rate.
