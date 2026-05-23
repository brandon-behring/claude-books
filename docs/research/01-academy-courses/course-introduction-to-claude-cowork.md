---
source_url: https://anthropic.skilljar.com/introduction-to-claude-cowork
canonical_url: https://anthropic.skilljar.com/introduction-to-claude-cowork
source_title: Introduction to Claude Cowork
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: academy-courses
tier: T2-release-notes
cert_domains: [3, 5]
cert_task_areas:
  - Iterative refinement (concrete examples, test-driven, interview pattern)
  - CLAUDE.md hierarchy (user / project / directory; `@import`)
  - Custom slash commands + skills (`.claude/commands/`, `.claude/skills/`)
  - Human review workflows + confidence calibration
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Introduction to Claude Cowork

## Key takeaways

- The newest non-engineering course in the Claude Cowork track (catalog row shows no duration but Skilljar header shows **14 lectures, 0.5 hours of video, 1 quiz, Certificate of completion**). Catalog and Skilljar agree on lecture count.
- Cowork is positioned as **"working session"** vs Chat's **"conversation"**: "Cowork is Claude working directly with your files, folders, and apps — reading, editing, and producing real outputs on your machine. Where Chat is a conversation, Cowork is a working session."
- Four-section curriculum, 14 lessons total: (1) **Meet Claude Cowork** [4] — what Cowork is vs Chat, setup, first end-to-end task; (2) **Make Claude Cowork yours** [4] — global instructions, projects, skills, plugins; (3) **Use Claude wherever you work** [2] — Claude in Chrome + add-ins for **Word, Excel, PowerPoint, Outlook**; (4) **Sharing and safety in Claude Cowork** [4] — plan/output review, skill validation, sharing plugins.
- Six published learning objectives include the unusual mention of **"scheduled tasks and Dispatch for recurring work"** — Dispatch is Cowork's scheduling/recurring-task feature (not previously named in the landscape doc, **net-new to this dossier**).
- Prerequisites: **paid Claude plan (Pro, Max, Team, or Enterprise)** with access to the Claude desktop app; comfort with everyday desktop apps; **no coding or command-line experience needed**. Audience: "Knowledge workers whose day is spent moving information between files, apps, and tools."
- Cert-relevance is mostly D3 (skills/plugins as configuration; projects as context) and D5 (human review workflows / confidence calibration — the entire "Sharing and safety" section maps directly). Not a primary cert-prep course.
- This course is **the canonical reference for "Cowork product surface"** — the only place skill validation, plan review, and add-in coverage are described in a course-bounded summary.

## Quoted (citation-ready)

> "Learn to work alongside Claude on your real files and projects. This hands-on course covers the Cowork task loop, skills and plugins, extending Claude into Chrome, Word, Excel, PowerPoint, and Outlook, and how to steer multi-step work responsibly — so you're productive in your first week."
>
> — Introduction to Claude Cowork, course tagline
>
> Anchor: `course tagline + Learn to work alongside Claude on your real`

> "Cowork is Claude working directly with your files, folders, and apps — reading, editing, and producing real outputs on your machine. Where Chat is a conversation, Cowork is a working session: you describe the task, Claude plans and executes it, and you steer along the way."
>
> — Introduction to Claude Cowork, About this course
>
> Anchor: `About this course + Cowork is Claude working directly with your files`

> "Set up Claude Cowork with a working folder, connectors, and the right permissions; Run your first end-to-end task — clarify, steer mid-run, and review the deliverable; Give Claude standing context with global instructions, projects, skills, and plugins; Set up scheduled tasks and Dispatch for recurring work; Bring Claude into the browser with Claude in Chrome and into Word, Excel, PowerPoint, and Outlook; Test the skills you build and share plugins with your team safely."
>
> — Introduction to Claude Cowork, Learning objectives
>
> Anchor: `Learning objectives + By the end of this course, you'll be able`

> "Work safely by reviewing plans and outputs, validate skills before you rely on them, and share plugins and workflows with your team."
>
> — Introduction to Claude Cowork, Course sections — Sharing and safety in Claude Cowork
>
> Anchor: `Sharing and safety in Claude Cowork + Work safely by reviewing plans`

## Cross-references

- See [[course-claude-101]] (broader Claude product onboarding) — covers Cowork at a higher level.
- See [[course-introduction-to-agent-skills]] (skills are taught in both, but this course handles the consumer/desktop perspective).
- Landscape §1.6 records **Claude Cowork** launch as "enterprise expansion beyond coding" (Apr/May 2026 launches).
- Landscape §1.3 mentions **Claude Code Channels** (Telegram/Discord/iMessage) and Remote Agents — Cowork is a distinct surface from these.

## Open questions / follow-ups

- **Dispatch** (scheduled tasks / recurring work) is named here for the first time in my source base. Landscape doc does not mention Dispatch — refresh trigger or net-new product feature?
- "Claude in Chrome" — landscape doc does not specifically name a Chrome extension. Is this a new browser surface or a re-skin of an existing connector?
- The Office add-ins (Word, Excel, PowerPoint, Outlook) suggest Microsoft 365 integration beyond connectors — does this involve native COM/JS add-ins?
- "Test the skills you build" — implies a skill-validation harness; is there a Cowork-specific skill test command, or does it reuse the Skills SDK test path? Out of scope for landing-page sources.
