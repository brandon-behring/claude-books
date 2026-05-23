---
source_url: https://anthropic.skilljar.com/claude-code-in-action
canonical_url: https://anthropic.skilljar.com/claude-code-in-action
source_title: Claude Code in Action
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: academy-courses
tier: T2-release-notes
cert_domains: [1, 2, 3, 5]
cert_task_areas:
  - CLAUDE.md hierarchy (user / project / directory; `@import`)
  - Custom slash commands + skills (`.claude/commands/`, `.claude/skills/`)
  - Plan mode vs direct execution
  - Iterative refinement (concrete examples, test-driven, interview pattern)
  - Built-in tools (Read, Write, Edit, Bash, Grep, Glob)
  - MCP server config (`.mcp.json` vs `~/.claude.json`, env var expansion)
  - Agent SDK hooks (`PostToolUse`, tool interception, normalization)
  - Long-conversation context (progressive summarization risks, lost-in-the-middle)
  - Large-codebase context (scratchpads, subagent delegation, `/compact`)
  - CI/CD integration (`-p` flag, `--output-format json`, `--json-schema`)
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Claude Code in Action

## Key takeaways

- Practical / hands-on counterpart to [[course-claude-code-101]]. Tagline: "Practical walkthrough of using Claude Code to accelerate your development workflow." Catalog and Skilljar agree on the headline stats: **15 lectures, 1 hour of video, 1 quiz, Certificate of completion**.
- Curriculum is a single 10-lesson section ("Claude Code in action") that covers: how coding assistants work, setup, context management, making changes, MCP servers, GitHub integration, hook implementations.
- Eight published learning objectives (verbatim list captured below) span: built-in tools, context management (`/init`, `Claude.md`, `@` mentions), conversation hotkeys, Plan Mode + Thinking Mode, custom commands, MCP servers (including browser automation), GitHub PR/issue integration, and hooks.
- Prerequisites: "Basic familiarity with command line interfaces; Access to Claude Code and an API key" — slightly stricter than Code 101 because hooks/MCP/CI work assumes installation.
- Audience scope is narrower than 101: "Engineers who want to speed up their development workflow with AI assistance." No mention of new-developer track.
- Hits cert D3 hardest (Claude Code Configuration & Workflows), but also covers D1 (hooks for tool interception), D2 (MCP server config + built-in tools), and D5 (`/init`, `Claude.md`, `@` mentions for context management). The GitHub PR/issue lecture maps to handbook ch12 "Headless & Automation" territory.

## Quoted (citation-ready)

> "This course covers Claude Code, a command-line AI assistant that uses language models to perform development tasks. You'll learn how Claude Code reads files, executes commands, and modifies code through its tool system, along with techniques for managing context, creating custom workflows, extending Claude Code with hooks, and integrating with external services."
>
> — Claude Code in Action, About this course
>
> Anchor: `About this course + This course covers Claude Code, a command-line`

> "By the end of this course, you'll be able to: Use Claude Code's core tools for file manipulation, command execution, and code analysis; Manage context effectively using /init, Claude.md files, and @ mentions; Control conversation flow with a variety of hotkeys and commands; Enable Plan Mode and Thinking Mode for complex tasks requiring deeper analysis; Create custom commands for automating repetitive development workflows; Extend Claude Code with MCP servers to add browser automation and other capabilities; Set up GitHub integration for automated PR reviews and issue handling; Write hooks to add additional behavior into Claude Code."
>
> — Claude Code in Action, Learning objectives
>
> Anchor: `Learning objectives + By the end of this course, you'll be able`

> "Complete guide to using Claude Code effectively. Starts with understanding how coding assistants work, then moves through setup, context management, making changes, and advanced features like MCP servers, GitHub integration, and hook implementations."
>
> — Claude Code in Action, Course sections — Claude Code in action
>
> Anchor: `Claude Code in action + Complete guide to using Claude Code effectively`

## Cross-references

- See [[course-claude-code-101]] for the conceptual prerequisite (agentic-loop fundamentals).
- See [[course-introduction-to-model-context-protocol]] for deeper MCP coverage cited as a lecture topic here.
- See [[course-introduction-to-subagents]] (the related Claude Code track companion).
- See [[course-introduction-to-agent-skills]] (same Claude Code track).
- See [[course-building-with-the-claude-api]] for the API-side complement.

## Open questions / follow-ups

- "Thinking Mode" terminology used here predates the May 2026 "adaptive thinking" naming (per landscape doc §1.5). Does the lecture content match the new terminology, or do they still teach the legacy "extended thinking" block API mental model?
- The footer shows "© 2025 Anthropic PBC" alongside "© 2026" — the content was likely last refreshed in late 2025 and may pre-date the v2.10/v2.11 release-train changes (`/btw`, `/rewind`, expanded hook count to ~31).
- The single-section "10 lessons" structure shown on the landing page conflicts with the catalog row's "15 lectures" — likely 15 video items + supplements but partitioned into 10 "lesson" groupings.
