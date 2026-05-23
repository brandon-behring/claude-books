---
source_url: https://anthropic.skilljar.com/introduction-to-subagents
canonical_url: https://anthropic.skilljar.com/introduction-to-subagents
source_title: Introduction to subagents
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: academy-courses
tier: T2-release-notes
cert_domains: [1, 3, 5]
cert_task_areas:
  - Coordinator-subagent patterns (hub-and-spoke, isolated context)
  - Subagent invocation (`Task` tool, `allowedTools`, `AgentDefinition`)
  - Task decomposition (sequential pipelines vs adaptive decomposition)
  - Large-codebase context (scratchpads, subagent delegation, `/compact`)
  - Custom slash commands + skills (`.claude/commands/`, `.claude/skills/`)
  - Long-conversation context (progressive summarization risks, lost-in-the-middle)
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Introduction to subagents

## Key takeaways

- Short Claude Code track course (catalog: **4 lectures, 20 minutes** of video; no quiz line shown on landing page). Goal is single-topic literacy — when/how to delegate work to a subagent so the main session stays focused.
- Four-section curriculum (each section ≈ one lecture): **What are subagents?**, **Creating a subagent**, **Designing effective subagents**, **Using subagents effectively**.
- Four published learning objectives: (1) **How sub-agents work** — isolated context window, input flow, summary return; (2) **Creating custom sub-agents** via the `/agents` command; (3) **Designing effective sub-agents** — structured output formats, obstacle reporting, limiting tool access; (4) **When to use them (and when not to)** — anti-patterns called out.
- Maps directly to cert D1 (Agentic Architecture & Orchestration) — the highest-weighted domain at 27%. Specifically covers "Coordinator-subagent patterns (hub-and-spoke, isolated context)", "Subagent invocation (`Task` tool, `allowedTools`, `AgentDefinition`)", and "Task decomposition" task areas from `cert-coverage.md`.
- The "structured output formats, obstacle reporting, and limiting tool access" framing aligns with the Anthropic engineering blog [multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) decomposition heuristics — this course is the practitioner-flavored teaching of that architecture pattern.
- Recent addition (per landscape doc §3.4, listed under "recent additions last 90 days") — content is current to the v2.10/v2.11 release-train where `/agents` command and Claude Managed Agents shipped.

## Quoted (citation-ready)

> "Sub-agents are one of the most practical ways to get more out of longer Claude Code sessions. They let you delegate tasks to isolated assistants that do their work separately and return just the information you need — keeping your main context window clean and your conversations focused."
>
> — Introduction to subagents, About this course
>
> Anchor: `About this course + Sub-agents are one of the most practical ways`

> "How sub-agents work — what happens when Claude Code spins up a separate context window, how inputs flow in, and how summaries come back."
>
> — Introduction to subagents, In this course, you'll learn
>
> Anchor: `In this course, you'll learn + How sub-agents work — what happens when Claude`

> "Designing effective sub-agents — patterns that make sub-agents reliable, including structured output formats, obstacle reporting, and limiting tool access."
>
> — Introduction to subagents, In this course, you'll learn
>
> Anchor: `In this course, you'll learn + Designing effective sub-agents — patterns that make sub-agents`

> "By the end, you'll know how to break complex work into focused pieces, build sub-agents that finish on time and report back clearly, and make the right call on when delegation is worth it."
>
> — Introduction to subagents, About this course
>
> Anchor: `About this course + By the end, you'll know how to break complex`

## Cross-references

- See [[course-claude-code-101]] (Section 4 introduces subagents at a higher level).
- See [[course-claude-code-in-action]] for the broader Claude Code customization picture.
- See [[course-introduction-to-agent-skills]] — the parallel companion course on skills (the other major "customize Claude Code" axis).
- Landscape §5.1 (multi-agent research system) and §5.2 (multi-agent decision framework) document the canonical Anthropic engineering source the course draws from.

## Open questions / follow-ups

- The course uses the spelling **"sub-agent"** with a hyphen in the description but **"subagents"** in the URL/title/curriculum. Codebases and the `/agents` command use "subagent" / "agent" — terminology will need normalization in the books.
- "Limiting tool access" maps to `allowedTools` allowlists — does the course teach `AgentDefinition` YAML/Markdown frontmatter or only the interactive `/agents` command? Page does not say.
- No quiz mentioned on the landing page (catalog row also blank for quiz count) — likely the shortest course in the catalog.
