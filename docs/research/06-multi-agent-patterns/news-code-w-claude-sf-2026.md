---
source_url: https://simonwillison.net/2026/May/6/code-w-claude-2026/
canonical_url: https://simonwillison.net/2026/May/6/code-w-claude-2026/
source_title: Code w/ Claude 2026 (live blog)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: multi-agent-patterns
tier: T3-practitioner
cert_domains: [1]
cert_task_areas:
  - Coordinator-subagent patterns (hub-and-spoke, isolated context)
  - Multi-step workflows (programmatic vs prompt-based enforcement, handoff)
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Simon Willison — Code w/ Claude 2026 live blog (San Francisco, May 6, 2026)

T3-practitioner source. Capturing key quotes from Anthropic principals at the May 6 Code with Claude SF event because they frame the architectural direction (**async code generation**, **Routines as higher-order prompts**, **Dreaming as cross-session memory**). Primary value is verbatim attribution; treat Simon's editorial framing as practitioner commentary, not Anthropic-canonical.

## Key takeaways

- **Boris Cherny (Claude Code creator) on async**: "We think that going forward a lot of code is going to be written in an async way." Routines + Multiagent Orchestration are the productization of this view.
- **Boris Cherny on Routines**: "Routines are higher-order prompts." Frames Routines (prompts on cron / GitHub webhooks / API endpoints, shipped May 18) as the natural composition unit *above* prompts in the abstraction hierarchy.
- **Boris Cherny on PR-ready async output**: "With Routines, developers can setup async automations and wake up to PRs that are ready to merge."
- **Live-blog observation on Dreaming**: "Dreaming looks really interesting. You can run a task overnight which examines previous sessions and creates new memories."
- **Katelyn Lesse & Angela Kiang (Claude Platform) framing for Managed Agents**: "Claude Managed Agents is meant to help teams ship 10 times faster."
- **Dianne Na Penn (Head of Product, Research) on capability planning**: "Design for the next model. Build things that don't quite work today on the assumption that they'll start working with a model upgrade." Relevant to multi-agent: today's reliability ceiling is tomorrow's baseline.

## Quoted (citation-ready)

> "We think that going forward a lot of code is going to be written in an async way."
>
> — Boris Cherny, Code w/ Claude SF 2026 (per Simon Willison live blog, May 6 2026)
>
> Anchor: `Boris Cherny session + async code generation framing`

> "Routines are higher-order prompts."
>
> — Boris Cherny, Code w/ Claude SF 2026
>
> Anchor: `Boris Cherny session + Routines abstraction`

> "With Routines, developers can setup async automations and wake up to PRs that are ready to merge."
>
> — Boris Cherny, Code w/ Claude SF 2026
>
> Anchor: `Boris Cherny session + Routines async PR flow`

> "Claude Managed Agents is meant to help teams ship 10 times faster."
>
> — Katelyn Lesse & Angela Kiang, Claude Platform team, Code w/ Claude SF 2026
>
> Anchor: `Claude Managed Agents demo + framing claim`

> "Dreaming looks really interesting. You can run a task overnight which examines previous sessions and creates new memories."
>
> — Simon Willison live blog observation, 09:32 entry
>
> Anchor: `Live blog 09:32 + Dreaming description`

> "Design for the next model. Build things that don't quite work today on the assumption that they'll start working with a model upgrade."
>
> — Dianne Na Penn, Head of Product (Research), Code w/ Claude SF 2026
>
> Anchor: `Research product session + capability planning principle`

## Architectural insights

### Routines as the composition layer

If **prompts** are the unit of work and **agents** are the unit of capability, **Routines** are the unit of *scheduled* / *event-driven* invocation:

- Triggered by cron, GitHub webhooks, or API endpoints
- Shipped May 18, 2026
- Higher-order in that they compose one or more agents/prompts into a recurring or event-bound workflow
- The async-PR pattern (Boris Cherny) demonstrates Routines + Multiagent Orchestration combined

This frames the natural relationship between Routines (when to run) and Claude Managed Agents (how to run): **Routines invoke Managed Agents sessions**.

### Async as architectural default

Boris Cherny's "code is going to be written in an async way" is the design principle behind the May 6 + May 18 shipments:

- Managed Agents = long-running stateful sessions
- Dreaming = cross-session memory persistence
- Routines = scheduled / event-triggered invocations
- Remote Agents = phone-controlled async work
- Worktrees = parallel isolated branches

The architecture is converging on "fire-and-forget, return when ready" — and multi-agent coordination is the unit that makes this productive.

### Capability planning (Dianne Na Penn)

The "design for the next model" principle is relevant to multi-agent because **today's multi-agent reliability bottlenecks (silent error propagation, judgment failures) are most likely to be the gaps the next model closes**. Architects should design multi-agent systems with explicit reliability ceilings today (Outcomes evaluators, manual verification) while planning for those guardrails to relax with future models.

## Cross-references

- See [[blog-claude-managed-agents]] for the Apr 8 product announcement and the May 6 expansion (Multiagent Orchestration, Outcomes, Dreaming).
- See [[blog-multi-agent-research-system]] for the research-system pattern Routines + Managed Agents productize.
- See [[blog-when-to-use-multi-agent]] for the decision framework.
- See `/Users/brandonbehring/claude-books/docs/landscape-2026-05.md` §1.3 for the Code with Claude SF announcement synthesis.
- See InfoQ article ([infoq.com/news/2026/05/code-with-claude/](https://www.infoq.com/news/2026/05/code-with-claude/)) for the parallel third-party coverage including SWE-bench 87% (Opus 4.7) and $30B annualized revenue (early April 2026).

## Open questions / follow-ups

- **"Higher-order prompts" formalization**: is there an Anthropic-canonical post defining Routines as a primitive? Currently only verbal at conference + product launch May 18.
- **Routines + Managed Agents** integration semantics: does a Routine invocation create a Managed Agents session, or are they distinct compute paths? Awaiting docs.
- **Boris Cherny + Cat Wu Latent Space podcast** (referenced in landscape §7.3): worth fetching as another primary practitioner source.
- **ServiceNow / launch-customer numbers** are not in the Simon Willison live blog — the canonical source for those is the Apr 8 announcement and the ServiceNow newsroom (see `blog-claude-managed-agents.md`).
