---
source_url: https://anthropic.skilljar.com/introduction-to-agent-skills
canonical_url: https://anthropic.skilljar.com/introduction-to-agent-skills
source_title: Introduction to agent skills
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: academy-courses
tier: T2-release-notes
cert_domains: [1, 3, 5]
cert_task_areas:
  - Custom slash commands + skills (`.claude/commands/`, `.claude/skills/`)
  - CLAUDE.md hierarchy (user / project / directory; `@import`)
  - Subagent invocation (`Task` tool, `allowedTools`, `AgentDefinition`)
  - Coordinator-subagent patterns (hub-and-spoke, isolated context)
  - Large-codebase context (scratchpads, subagent delegation, `/compact`)
  - Long-conversation context (progressive summarization risks, lost-in-the-middle)
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Introduction to agent skills

## Key takeaways

- Claude Code track course (catalog: **6 lectures, 30 minutes** of video). Six-section curriculum: **What are skills?**, **Creating your first skill**, **Configuration and multi-file skills**, **Skills vs. other Claude Code features**, **Sharing skills**, **Troubleshooting skills**.
- Course teaches Skills as **reusable markdown instructions** that Claude **automatically applies to the right tasks at the right time** — the "teach Claude once" / progressive-disclosure design philosophy.
- Explicit comparison-of-customization-mechanisms framing: a whole section ("Skills vs. other Claude Code features") contrasts Skills with **CLAUDE.md, hooks, and subagents** — directly addresses the cert D3 confusion zone of "which customization tool to reach for".
- Concrete artifacts taught: `SKILL.md` frontmatter, "effective descriptions that reliably trigger matching", multi-file skill directory layout, **progressive disclosure** to keep context windows efficient, `allowed-tools` to restrict tool access, **scripts that execute without consuming context**.
- Distribution / team chapter: commit to repo, **plugins** for broader distribution, **enterprise managed settings** for org-wide rollout, **wiring Skills into custom subagents** for isolated expert delegation. Final section is troubleshooting (trigger failures, priority conflicts, runtime errors).
- Newer course (per landscape doc §3.4 "recent additions") — mirrors the [`anthropics/skills` repo](https://github.com/anthropics/skills) and the unified `claude.ai/directory` rollout.

## Quoted (citation-ready)

> "Learn how to build, configure, and share Skills in Claude Code — reusable markdown instructions that Claude automatically applies to the right tasks at the right time. This course takes you from creating your first Skill to distributing them across teams and troubleshooting common issues."
>
> — Introduction to agent skills, course tagline
>
> Anchor: `course tagline + Learn how to build, configure, and share Skills`

> "In this course, you'll learn how to stop repeating yourself and start teaching Claude once. You'll discover what Skills are and how they differ from other Claude Code customization options like CLAUDE.md, hooks, and subagents."
>
> — Introduction to agent skills, About this course
>
> Anchor: `About this course + In this course, you'll learn how to stop`

> "You'll create your first Skill from scratch — writing the SKILL.md frontmatter, crafting effective descriptions that reliably trigger matching, and organizing your skill directory with progressive disclosure to keep context windows efficient. You'll also explore advanced configuration options like restricting tool access with allowed-tools and using scripts that execute without consuming context."
>
> — Introduction to agent skills, About this course
>
> Anchor: `About this course + You'll create your first Skill from scratch`

> "Beyond building individual Skills, you'll learn how to share them with your team by committing them to a repository, distribute them more broadly through plugins, and deploy them organization-wide using enterprise managed settings. You'll see how to wire Skills into custom subagents for isolated, expert task delegation."
>
> — Introduction to agent skills, About this course
>
> Anchor: `About this course + Beyond building individual Skills, you'll learn how`

## Cross-references

- See [[course-introduction-to-subagents]] — companion course; this one explicitly wires Skills into subagents.
- See [[course-claude-code-101]] (Section 4 introduces Skills at a higher level).
- See [[course-claude-code-in-action]] for context on the broader customization stack.
- Landscape §7.1 explains MCP vs Skills vs Plugins distinction: "Skills = procedural knowledge / playbooks ('how to do X') — ~100 tokens per skill at scan-time, full body lazy-loaded."

## Open questions / follow-ups

- Course teaches `allowed-tools` (hyphenated) which matches SKILL.md frontmatter convention; verify whether agent-definition YAML uses the same hyphen style or camelCase elsewhere in the codebase.
- "Plugins" distribution path is taught — should cross-reference the unified `claude.ai/directory` and `anthropics/claude-plugins-official` marketplace.
- The progressive-disclosure design (~100 tokens at scan, full body lazy-loaded) is mentioned implicitly; would be valuable to capture explicit token-budget guidance from the course (not visible on the landing page).
