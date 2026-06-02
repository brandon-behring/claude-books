---
source_url: https://code.claude.com/docs/en/how-claude-code-works
canonical_url: https://code.claude.com/docs/en/how-claude-code-works
source_title: "How Claude Code works"
fetched_at: 2026-06-02
last_verified_at: 2026-06-02
topic: claude-code-internals
tier: T1-official
cert_domains: [1]
cert_task_areas: ["Agentic loops", "Built-in tools", "Session state"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# How Claude Code works (Anthropic docs)

The Claude Code architecture page: the agentic loop, the two components that power it, the built-in
tool categories, sessions, context, and permissions. Captured 2026-06-02 to back D1.1 (manifest key
`how-claude-code-works` previously had no in-repo cache copy — closed an audit backing-orphan).

## Key takeaways

- The loop has **three phases: gather context, take action, verify results** — they blend; Claude uses tools throughout and course-corrects from each step.
- The loop is **powered by two components: models that reason and tools that act.** Claude Code is the **agentic harness** providing tools, context management, and execution environment.
- **Without tools, Claude can only respond with text** — tools are what make it agentic; each tool result feeds back into the loop.
- Built-in tools fall into **five categories**: File operations, Search, Execution, Web, Code intelligence (plus orchestration tools — subagents, asking questions).
- **Sessions are independent** (fresh context window each); `--continue`/`--resume` reopen the same session id, `--fork-session`/`/branch` copy history into a new id.
- **Permission modes** cycle via `Shift+Tab`: Default, Auto-accept edits, Plan mode (read-only), Auto mode (research preview).

## Quoted (citation-ready)

> "The agentic loop is powered by two components: models that reason and tools that act. Claude Code serves as the agentic harness around Claude: it provides the tools, context management, and execution environment that turn a language model into a capable coding agent."
>
> Anchor: `agentic loop + powered by two components models that reason and tools that act`

> "When you give Claude a task, it works through three phases: gather context, take action, and verify results."
>
> Anchor: `three phases + gather context take action verify results`

> "Tools are what make Claude Code agentic. Without tools, Claude can only respond with text."
>
> Anchor: `tools make it agentic + Without tools Claude can only respond with text`

## Worked-example material (D1.1)

The page gives a concrete loop trace for "fix the failing tests": (1) run the test suite, (2) read the
error output, (3) search for the relevant source files, (4) read those files, (5) edit to fix, (6) run
the tests again to verify — "Each tool use gives Claude new information that informs the next step."
This is the canonical worked example for D1.1's loop.
