# Anthropic Academy courses

Per-course notes for the major free, self-paced courses on **Anthropic Academy** (`anthropic.skilljar.com`). Each note captures title, audience, learning objectives, key topics, and a citation-ready quote from the course page. Courses are tiered **T2-release-notes** (Anthropic-managed but not the primary spec/docs).

This dossier feeds the **Architect's Reference** (greenfield; Academy is the principal study material Anthropic recommends as cert prep) and provides cross-references for the **Handbook** and **Field-Guide** where their chapters touch the same material.

## Notes in this directory

| File | Title | Tier | Cert domains | Key takeaway (1 line) |
|---|---|---|---|---|
| [course-claude-101](./course-claude-101.md) | Claude 101 | T2 | D1–D5 | General introduction to Claude for non-technical users |
| [course-claude-code-101](./course-claude-code-101.md) | Claude Code 101 | T2 | D3 | Entry-level Claude Code course for engineers |
| [course-claude-code-in-action](./course-claude-code-in-action.md) | Claude Code in Action | T2 | D3, D1 | Practical Claude Code workflows for developers |
| [course-introduction-to-subagents](./course-introduction-to-subagents.md) | Introduction to subagents | T2 | D1 | Spawning and coordinating subagents in Claude Code |
| [course-introduction-to-agent-skills](./course-introduction-to-agent-skills.md) | Introduction to agent skills | T2 | D3 | SKILL.md format, `context: fork`, `allowed-tools` |
| [course-introduction-to-claude-cowork](./course-introduction-to-claude-cowork.md) | Introduction to Claude Cowork | T2 | D1, D5 | Enterprise Claude Cowork product walkthrough |
| [course-building-with-the-claude-api](./course-building-with-the-claude-api.md) | Building with the Claude API | T2 | D1–D5 | 8.1 hr, 10 quizzes — biggest Anthropic course |
| [course-introduction-to-model-context-protocol](./course-introduction-to-model-context-protocol.md) | Introduction to MCP | T2 | D2 | Concepts: tools, resources, prompts, sampling |
| [course-model-context-protocol-advanced-topics](./course-model-context-protocol-advanced-topics.md) | MCP: Advanced Topics | T2 | D2 | Authorization, transports, production patterns |
| [course-ai-fluency-framework-foundations](./course-ai-fluency-framework-foundations.md) | AI Fluency: Framework & Foundations | T2 | D4 | 4D Framework vocabulary alignment |

## Cert task areas covered

- **D1** "Coordinator-subagent patterns", "Subagent invocation" — see [[course-introduction-to-subagents]]
- **D2** "MCP server config", "Effective tool interfaces" — see [[course-introduction-to-model-context-protocol]] + [[course-model-context-protocol-advanced-topics]]
- **D3** "Custom slash commands + skills", "CLAUDE.md hierarchy", "Plan mode vs direct execution" — see [[course-claude-code-101]] + [[course-claude-code-in-action]] + [[course-introduction-to-agent-skills]]
- **D4** "Explicit criteria over vague instructions", "Iterative refinement (concrete examples, test-driven, interview pattern)" — see [[course-ai-fluency-framework-foundations]] + [[course-building-with-the-claude-api]]
- **D5** cross-cutting; touched by most courses tangentially

## Open questions for this topic

- AI Fluency course metadata (lecture count, duration, quiz count) was not captured via WebFetch — Skilljar returned a marketing shell. A Playwright refresh pass would fill that gap; deferred since 9 of 10 priority courses have full metadata.
- Optional courses **Claude with Amazon Bedrock** + **Claude with Google Vertex AI** (both 8 hr, 10 quizzes per the landscape doc) and **AI Fluency for Small Businesses** (newest, ~May 2026) were not covered — vendor-specific (Bedrock/Vertex) or domain-specific (small business); lower priority for the books. Add in a refresh pass if a chapter needs them.
- Full lesson/lecture lists for some courses (e.g., Building with the Claude API at 84 lectures) are likely too granular to capture per-lecture; course-level notes capture the syllabus shape but not every lecture title.

## Sprint log

- **2026-05-22**: Initial dossier — 9 courses captured by a research agent (which crashed on a socket error after writing those 9 notes); AI Fluency note added separately; topic README written.
