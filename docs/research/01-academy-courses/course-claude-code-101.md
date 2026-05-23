---
source_url: https://anthropic.skilljar.com/claude-code-101
canonical_url: https://anthropic.skilljar.com/claude-code-101
source_title: Claude Code 101
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: academy-courses
tier: T2-release-notes
cert_domains: [1, 2, 3, 5]
cert_task_areas:
  - CLAUDE.md hierarchy (user / project / directory; `@import`)
  - Custom slash commands + skills (`.claude/commands/`, `.claude/skills/`)
  - Plan mode vs direct execution
  - MCP server config (`.mcp.json` vs `~/.claude.json`, env var expansion)
  - Built-in tools (Read, Write, Edit, Bash, Grep, Glob)
  - Long-conversation context (progressive summarization risks, lost-in-the-middle)
  - Coordinator-subagent patterns (hub-and-spoke, isolated context)
  - Subagent invocation (`Task` tool, `allowedTools`, `AgentDefinition`)
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Claude Code 101

## Key takeaways

- Entry-level course teaching the Claude Code agentic loop from first principles. Catalog row says "12 lectures / 1 hr / no quiz / Claude Code track", but the Skilljar landing page header reports **12 lectures, 1.5 hours of video, 1 quiz, Certificate of completion** — the Skilljar value is treated as authoritative here (catalog appears to lag).
- Four-section curriculum: (1) **What is Claude Code?** [2 lessons] — agent vs chat, agentic loop, tools, permissions; (2) **Your first prompt** [2 lessons] — install across terminal / VS Code / JetBrains / Desktop / web; approval mode, auto-accept, Plan Mode; (3) **Daily workflows** [3 lessons] — Explore → Plan → Code → Commit rhythm; `/compact`, `/clear`, `/context`; code review; (4) **Customizing Claude Code** [5 lessons] — `CLAUDE.md`, subagents, skills, MCP servers, hooks.
- Audience explicitly straddles novices and seasoned engineers: "New developers entering software engineering who want AI-assisted workflows from the start, and experienced engineers curious about coding agents but who haven't taken the plunge yet."
- Prerequisites are intentionally light: "Basic familiarity with a code editor and the command line. You'll also need a Claude account (Pro, Max, or Enterprise) or an API key. No prior experience with AI tools is assumed."
- Maps directly to cert D3 (Claude Code Configuration & Workflows, 20%) — every D3 task area appears as a lecture topic. Section 4 also touches D1 (subagents) and D2 (MCP servers, hooks).
- Free, LinkedIn-shareable certificate; hosted on Skilljar LMS under the Anthropic Academy umbrella.

## Quoted (citation-ready)

> "AI coding agents are changing what it means to write software. Tasks that used to take an afternoon — tracing a bug across a large codebase, scaffolding a new service, reviewing a stack of pull requests — can now happen in a single focused session, with an agent that reads your code, runs your commands, and edits files alongside you. But getting real value from an agent requires more than installing it and typing a request. It requires understanding how the agent thinks, what context it has access to, and how to steer it when it heads in the wrong direction."
>
> — Claude Code 101, About this course
>
> Anchor: `About this course + AI coding agents are changing what it means`

> "We start from first principles — what an agentic loop actually is, how the context window shapes what Claude can see, how tools and permissions determine what it can do — so that the techniques later in the course make sense rather than feeling like a list of tricks to memorize."
>
> — Claude Code 101, About this course
>
> Anchor: `About this course + We start from first principles — what an agentic`

> "The core of the course is the Explore → Plan → Code → Commit workflow: a repeatable rhythm for breaking down a task, letting Claude propose an approach, reviewing the work as it happens, and landing it cleanly."
>
> — Claude Code 101, About this course
>
> Anchor: `About this course + The core of the course is the Explore`

> "Out of the box, Claude Code is general-purpose. This section shows you how to make it yours: write a CLAUDE.md file so it remembers your project's conventions, build subagents and skills for the workflows you repeat, wire in external systems through MCP servers, and add hooks for deterministic guardrails."
>
> — Claude Code 101, Course sections — Customizing Claude Code
>
> Anchor: `Customizing Claude Code + Out of the box, Claude Code is general-purpose`

## Cross-references

- See [[course-claude-code-in-action]] for the follow-on hands-on companion (1 hr lab-style).
- See [[course-introduction-to-subagents]] for deeper coverage of the Section 4 subagent topic.
- See [[course-introduction-to-agent-skills]] for deeper coverage of the Section 4 skills topic.
- See [[course-introduction-to-model-context-protocol]] for deeper coverage of the Section 4 MCP topic.
- See [[course-claude-101]] for the non-engineering counterpart aimed at general users.

## Open questions / follow-ups

- Catalog says 12 lectures / 1 hr / no quiz; Skilljar landing page says 12 lectures / 1.5 hr / 1 quiz. Which surface is authoritative? Note discrepancy in topic README.
- Lecture titles per section are not published on the public landing page; would need to enroll to capture (out of scope for a primary-source dossier).
- Does the course explicitly cover Opus 4.7's `xhigh` effort level / adaptive-thinking distinction, or stay model-agnostic? Page does not say.
