---
source_url: https://www.anthropic.com/engineering/building-effective-agents
canonical_url: https://www.anthropic.com/engineering/building-effective-agents
source_title: "Building effective agents"
fetched_at: 2026-06-02
last_verified_at: 2026-06-02
topic: multi-agent-patterns
tier: T1-official
cert_domains: [1]
cert_task_areas: ["Agentic loops", "Coordinator-subagent patterns", "Task decomposition"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Building effective agents (Anthropic Engineering)

Authors: **Erik Schluntz and Barry Zhang**. Published **2024-12-19**. The canonical Anthropic
statement of the agent-vs-workflow distinction and the "augmented LLM" building block. Captured
2026-06-02 to back D1.1 (Agentic Loops) / D1.2 / D1.6 — the manifest key `building-effective-agents`
previously had no in-repo cache copy (closed an audit backing-orphan).

## Key takeaways

- The **foundational building block is the augmented LLM** — an LLM enhanced with retrieval, tools, and memory.
- **Workflows vs agents** is the load-bearing architectural distinction: workflows run on *predefined code paths*; agents *dynamically direct their own* process and tool usage.
- An agent's operational shape is **a loop driven by environmental feedback** — the model acts via a tool, reads the result, and decides the next step.
- Use agents for **open-ended problems** where the number of steps is unpredictable and you cannot hard-code the path; prefer workflows when the path is known.
- Design principles: **simplicity, transparency** (show the planning steps), and a careful **agent–computer interface (ACI)** — clear tool documentation and design.

## Quoted (citation-ready)

> "Agents are typically just LLMs using tools based on environmental feedback in a loop."
>
> Anchor: `agent loop + LLMs using tools based on environmental feedback in a loop`

> "Workflows are systems where LLMs and tools are orchestrated through predefined code paths. Agents, on the other hand, are systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks."
>
> Anchor: `agent vs workflow + LLMs dynamically direct their own processes and tool usage`

> "Some customers define agents as fully autonomous systems that operate independently over extended periods, using various tools to accomplish complex tasks."
>
> Anchor: `agent definition + fully autonomous systems that operate independently`

## Notes for the Cert book (D1.1)

D1.1's opening definition must use the verbatim "LLMs using tools based on environmental feedback in
a loop" (the earlier chapter gloss "an LLM autonomously using tools in a loop" was not in this source —
that compressed phrasing is closer to the SDK blog). The agent/workflow contrast is the cleanest
one-sentence framing for D1.4 (programmatic vs prompt-based) too.
