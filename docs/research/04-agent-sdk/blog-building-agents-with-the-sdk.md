---
source_url: https://claude.com/blog/building-agents-with-the-claude-agent-sdk
canonical_url: https://claude.com/blog/building-agents-with-the-claude-agent-sdk
source_title: "Building agents with the Claude Agent SDK"
fetched_at: 2026-06-02
last_verified_at: 2026-06-02
topic: agent-sdk
tier: T1-official
cert_domains: [1]
cert_task_areas: ["Agentic loops", "Multi-step workflows"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Building agents with the Claude Agent SDK (Anthropic blog)

Author: **Thariq Shihipar** (with Molly Vorwerck, Suzanne Wang, Alex Isken, Cat Wu, Keir Bradwell,
Alexander Bricken, Ashwin Bhat). Published **2025-09-29**. The Agent SDK's own model of the agent
loop — the gather-context → take-action → verify-work cycle and tools as the execution primitive.
Captured 2026-06-02 to back D1.1 (manifest key `building-agents-with-the-sdk` previously had no
in-repo cache copy — closed an audit backing-orphan).

## Key takeaways

- Claude operates in a **feedback loop: gather context → take action → verify work → repeat.**
- **Tools are the primary building blocks of execution** — the action half of the loop.
- **Gather context** via agentic file-system search, semantic search, subagents, and compaction.
- **Verify work** via rule-based feedback (linting), visual feedback (screenshots), and LLM-as-judge — catching errors before they compound.
- The improvement cycle is **identify missing tools / information gaps / failure patterns**, then iterate.

## Quoted (citation-ready)

> "Tools are the primary building blocks of execution for your agent."
>
> Anchor: `tools + the primary building blocks of execution for your agent`

> "Claude often operates in a specific feedback loop: gather context -> take action -> verify work -> repeat."
>
> Anchor: `feedback loop + gather context take action verify work repeat`

## Notes for the Cert book (D1.1)

D1.1's "Where Claude Code's loop sits" section cites this for "tools as the primary building blocks of
execution" — verbatim-supported here ("Tools are the primary building blocks of execution for your
agent"). The gather→act→verify loop is the same three-phase shape `how-claude-code-works` describes;
cite whichever page the specific sentence is closest to.
