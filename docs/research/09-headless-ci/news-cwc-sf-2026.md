---
source_url: https://simonwillison.net/2026/May/6/code-w-claude-2026/
canonical_url: https://simonwillison.net/2026/May/6/code-w-claude-2026/
source_title: Live blog — Code w/ Claude 2026 (Simon Willison)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: headless-ci
tier: T3-practitioner
cert_domains: [3]
cert_task_areas: ["CI/CD integration (`-p` flag, `--output-format json`, `--json-schema`)"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Code w/ Claude SF 2026 — Headless / CI / Automation announcements

**Why this is T3 (practitioner) when the original is T1**: Anthropic's primary post for the SF event isn't reachable at a stable canonical URL we could verify (the `claude.com/blog/code-w-claude-sf-2026` slug returned 404 at fetch time). Simon Willison's live blog is the highest-fidelity practitioner capture available and is widely cited as primary by the community. Treat as **citation-ready for chapter context**, but when canonical Anthropic post URLs land (or when the `/docs/en/whats-new/2026-w15` release notes are quotable), prefer those.

## Key takeaways (from Simon's notes + The New Stack + InfoQ + DevOps.com)

- **Remote Agents** — laptop control from phone. Maps to `claude remote-control` and `--remote-control` per the docs (see [[docs-remote-control]]).
- **Code Review tool** — multi-agent PR review, **"used by every team at Anthropic"** (per Cat Wu). Maps to the managed [[docs-code-review]] service.
- **CI auto-fix** — automated PR corrections. Limited docs as of May 22; lives in the `/docs/en/whats-new/2026-w15` release notes; no dedicated page yet.
- **Security Reviews** — automated vulnerability detection. Maps to [[news-security-review]] (the `/security-review` command + GitHub Action).
- **Claude Code Channels** — Telegram/Discord/iMessage front-ends via MCP (Mar 20 ship). Maps to [[docs-channels]]. Positioned vs OpenClaw per VentureBeat.
- **Rate limits doubled** for Pro/Max/Enterprise (Ami Vora: "Doubling Claude Code five hour limit for Pro, Max, Enterprise customers.").
- **SpaceX/Colossus partnership** for compute: "We're partnering with SpaceX to use all of the capacity of their Colossus data center."
- **Routines + async coding philosophy** (Boris Cherny): "With Routines, developers can setup async automations and wake up to PRs that are ready to merge."
- Claude **Managed Agents** GA: Multiagent Orchestration, Outcomes (declarative success criteria), Dreaming (cross-session memory research preview).
- Launch customers for managed: Notion, Rakuten, Asana, Sentry, Atlassian. ServiceNow rolling Claude Code across 29K+ employees.

## Quoted (citation-ready)

> "Doubling Claude Code five hour limit for Pro, Max, Enterprise customers."
>
> — Ami Vora, Code w/ Claude SF 2026 keynote (via Simon Willison live blog)
>
> Anchor: `Doubling Claude Code five hour limit + for Pro Max Enterprise customers`

> "We're partnering with SpaceX to use all of the capacity of their Colossus data center."
>
> — Code w/ Claude SF 2026 keynote (via Simon Willison live blog)
>
> Anchor: `partnering with SpaceX + all of the capacity of their Colossus`

> "With Routines, developers can setup async automations and wake up to PRs that are ready to merge."
>
> — Boris Cherny, Code w/ Claude SF 2026 (via Simon Willison live blog)
>
> Anchor: `With Routines + developers can setup async automations`

> "Used by every team at Anthropic."
>
> — Cat Wu on Code Review at Code w/ Claude SF 2026 (via Simon Willison live blog)
>
> Anchor: `Used by every team at Anthropic + Code Review`

## What stays unverified

- Direct quotes from the canonical Anthropic event recap blog (URL not stable at fetch time)
- Exact CI auto-fix mechanics: limited to release-notes entry (`/docs/en/whats-new/2026-w15`)
- Whether "Security Reviews" announcement extends beyond the existing `/security-review` blog post (the `code.claude.com/docs/en/security-review` URL 404s; capability is documented only via blog + third-party coverage)

## Cross-references

- See [[docs-code-review]] — the managed surface
- See [[docs-remote-control]] — the "Remote Agents" feature
- See [[docs-channels]] — the "Channels" feature
- See [[news-security-review]] — the security blog post
- See [[../../landscape-2026-05.md]] §1.3 — handbook landscape summary of these
- See InfoQ: https://www.infoq.com/news/2026/05/code-with-claude/
- See The New Stack: https://thenewstack.io/anthropic-launches-a-multi-agent-code-review-tool-for-claude-code/
- See DevOps.com: https://devops.com/anthropic-adds-automated-security-reviews-to-claude-code/

## Open questions / follow-ups

- Find the stable canonical URL for Anthropic's official Code w/ Claude SF recap post and upgrade this note from T3 to T1.
- Pull the `/docs/en/whats-new/2026-w15` release notes content directly when accessible for the CI auto-fix mechanics.
