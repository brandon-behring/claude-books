---
source_url: https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts
canonical_url: https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts
source_title: Modifying system prompts
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [3, 4]
cert_task_areas: ["CLAUDE.md hierarchy", "Explicit criteria over vague instructions", "Few-shot prompting"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# System prompts — preset vs append vs custom, with prompt-cache reuse

How the Agent SDK's system prompt is constructed. Critical for chapters on prompt engineering, cost optimization (prompt-cache reuse), and "how to make my agent not be Claude Code."

## Key takeaways

- **Three starting points**:
  - **Minimal default** — when you don't set `systemPrompt` / `system_prompt`. Covers tool calling but omits Claude Code's coding guidelines, response style, and project context. **This differs from `claude -p` CLI**, which uses the full Claude Code prompt by default. Migrating from CLI? Set the preset.
  - **`claude_code` preset** — full Claude Code system prompt (tool guidance, coding guidelines, response tone, safety, environment context). Configure as `systemPrompt: { type: "preset", preset: "claude_code" }`.
  - **Custom string** — your own prompt; SDK sends only what you provide. You become responsible for any tool guidance and safety instructions.
- **`append`** (preset only): "preserves all built-in functionality" while adding your instructions at the end. Lowest-risk customization.
- **`excludeDynamicSections: true`** (TS) / `"exclude_dynamic_sections": True` (Python) — moves per-session dynamic context (working directory, git-repo flag, platform, shell, OS version, auto-memory paths) out of the system prompt and into the first user message. **Enables prompt-cache reuse across sessions/users/machines.** Requires `@anthropic-ai/claude-agent-sdk` v0.2.98+ / `claude-agent-sdk` v0.1.58+.
- **CLAUDE.md is NOT a system-prompt mechanism**: "the SDK injects its content into the conversation as project context, not into the system prompt, so they work with any system prompt configuration." This means CLAUDE.md works alongside any preset / append / custom prompt.
- **Output styles** are filesystem configurations that modify Claude's system prompt — stored as markdown files at `~/.claude/output-styles/` or `.claude/output-styles/`. Loaded via `settingSources`. Activate via `/config`, settings, or TS `Options.settings.outputStyle`. **Python SDK has no programmatic output-style selection** — use `append` or a custom prompt instead.

## Quoted (citation-ready)

> "Minimal default: when you don't set `systemPrompt` in TypeScript or `system_prompt` in Python, the SDK uses a minimal prompt that covers tool calling but omits Claude Code's coding guidelines, response style, and project context. This differs from `claude -p`, which uses the full Claude Code prompt by default. If you're migrating from the CLI and want matching behavior, set the `claude_code` preset."
>
> — Modifying system prompts, How system prompts work
>
> Anchor: `How system prompts work + Minimal default`

> "By default, two sessions that use the same `claude_code` preset and `append` text still cannot share a prompt cache entry if they run from different working directories. This is because the preset embeds per-session context in the system prompt ahead of your `append` text: the working directory, whether it's a git repository, the platform, the active shell, the OS version, and auto-memory paths. Any difference in that context produces a different system prompt and a cache miss."
>
> — Modifying system prompts, Improve prompt caching across users and machines
>
> Anchor: `Improve prompt caching across users and machines + By default, two sessions`

## Decide on a starting point (decision table)

| You're building | Use | What you get |
|---|---|---|
| A CLI or IDE-like coding tool where a human watches and steers, and Claude Code's defaults are what you want | `claude_code` preset | Full Claude Code prompt: tool guidance, safety rules, terminal-friendly responses, repo-convention awareness |
| Same kind of tool, plus product-specific rules | `claude_code` preset with `append` | Everything above, with your instructions appended. Nothing removed — lowest-risk customization |
| An agent with a different surface, identity, or permission model, or a non-coding agent | Custom prompt string | Only what you write. You take responsibility for replacing tool guidance and safety instructions |
| A thin tool-calling loop with no agent persona, where you supply all behavior in the user prompt | No `systemPrompt` option | Minimal default: tool-calling support and nothing else |

## Comparison of four approaches (chapter-grade)

| Feature | CLAUDE.md | Output Styles | `systemPrompt` with `append` | Custom `systemPrompt` |
|---|---|---|---|---|
| **Persistence** | Per-project file | Saved as files | Session only | Session only |
| **Reusability** | Per-project | Across projects | Code duplication | Code duplication |
| **Management** | On filesystem | CLI + files | In code | In code |
| **Default tools** | Preserved | Preserved | Preserved | Lost (unless included) |
| **Built-in safety** | Maintained | Maintained | Maintained | Must be added |
| **Environment context** | Automatic | Automatic | Automatic | Must be provided |
| **Customization level** | Additions only | Replace or extend default | Additions only | Complete control |
| **Version control** | With project | Yes | With code | With code |
| **Scope** | Project-specific | User or project | Code session | Code session |

## Prompt-cache trick (the chapter-worthy detail)

For fleets of agents running from different directories that should share a cache entry, set `excludeDynamicSections: true`:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Triage the open issues in this repo",
  options: {
    systemPrompt: {
      type: "preset",
      preset: "claude_code",
      append: "You operate Acme's internal triage workflow. Label issues by component and severity.",
      excludeDynamicSections: true
    }
  }
})) {
  // ...
}
```

**Tradeoff**: the working directory, git-repo flag, platform, shell, OS version, and auto-memory paths still reach Claude — but as part of the first user message rather than the system prompt. "Instructions in the user message carry marginally less weight than the same text in the system prompt, so Claude may rely on them less strongly when reasoning about the current directory or auto-memory paths." Enable when cross-session cache reuse matters more than maximally authoritative environment context.

## Output style frontmatter — `keep-coding-instructions`

When you create a custom output style at `~/.claude/output-styles/code-reviewer.md`:

```markdown
---
name: Code Reviewer
description: Thorough code review assistant
keep-coding-instructions: true
---
You are an expert code reviewer.
...
```

By default, a custom output style **replaces** the `claude_code` preset's software-engineering instructions. `keep-coding-instructions: true` layers your instructions on top while preserving the preset's coding guidance. Keep `true` when the agent is still doing software engineering. Leave out when replacing the role entirely.

## Cross-references

- See [[docs-claude-code-features]] for `settingSources` mechanics — CLAUDE.md and output styles load through it.
- See [[docs-python-reference]] / [[docs-typescript-reference]] for the `system_prompt` / `systemPrompt` field shape.
- See [[docs-typescript-reference]] for `Options.settings.outputStyle` (the only programmatic output-style switch — Python lacks it).

## Open questions / follow-ups

- The CLI's `--exclude-dynamic-system-prompt-sections` flag is the equivalent for non-interactive mode — useful for a CI-pattern chapter.
- "Auto memory" (referenced as part of the dynamic context) is referenced but not documented in this dossier. It lives at `~/.claude/projects/<project>/memory/` and loads regardless of `settingSources`.
- The CLI's `/config` command for output-style switching is one of the few CLI-only features the SDK can't reach programmatically (Python).
