---
source_url: https://code.claude.com/docs/en/agent-sdk/skills
canonical_url: https://code.claude.com/docs/en/agent-sdk/skills
source_title: Agent Skills in the SDK
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [3]
cert_task_areas: ["Custom slash commands + skills", "Multi-step workflows"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Agent Skills in the SDK — filesystem-only with `skills` filter

How skills load via `settingSources`, what the `skills` option does, and why there's no programmatic skill registration API.

## Key takeaways

- **Skills are filesystem artifacts only**: `.claude/skills/<name>/SKILL.md`. No programmatic registration API on the SDK.
- **Discovered through `settingSources`**: the `user` source enables `~/.claude/skills/`; the `project` source enables `<cwd>/.claude/skills/` and `.claude/skills/` in every parent up to the repository root.
- **`skills` option is a context filter, not a sandbox**: "Unlisted Skills are hidden from the model and rejected by the Skill tool, but their files remain on disk and are reachable through Read and Bash."
- **Three `skills` values**:
  - **Omitted** (default) — discovered skills are enabled and the Skill tool is available (matches CLI behavior).
  - **`"all"`** — enable every discovered skill.
  - **`["pdf", "docx"]`** — enable only named skills. Use `plugin:skill` for plugin-provided skills.
  - **`[]`** — disable all skills.
- **The SDK auto-enables the Skill tool** when `skills` is set — you don't need to add `"Skill"` to `allowedTools`.
- **Lazy-loading model**: "the agent receives skill descriptions at startup and loads the full content when relevant." (Same as Claude Code CLI behavior — descriptions ~100 tokens, body lazy-loaded per [[blog-advanced-tool-use-overview]] sibling material.)
- **`allowed-tools` frontmatter field in SKILL.md does NOT apply through the SDK** — only the CLI honors it. Use the main `allowedTools` option in SDK applications.
- **`AgentDefinition.skills`** lets a subagent preload specific skills (others remain invocable via the Skill tool).

## Quoted (citation-ready)

> "Skills are markdown files that give your agent specialized knowledge and invocable workflows. Unlike `CLAUDE.md` (which loads every session), skills load on demand. The agent receives skill descriptions at startup and loads the full content when relevant."
>
> — Agent Skills in the SDK / Use Claude Code features cross-ref, Skills section
>
> Anchor: `Skills + Skills are markdown files that give your agent`

> "The `skills` option is a context filter, not a sandbox. Unlisted Skills are hidden from the model and rejected by the Skill tool, but their files remain on disk and are reachable through Read and Bash."
>
> — Agent Skills in the SDK, Using Skills with the SDK
>
> Anchor: `Using Skills with the SDK + The skills option is a context filter`

## Filesystem layout

```
.claude/skills/processing-pdfs/
└── SKILL.md
```

SKILL.md is a markdown file with YAML frontmatter. The `description` field determines when Claude invokes the skill.

## Skill locations (canonical)

| Skill scope | Path | Loaded when |
|---|---|---|
| Project skills | `.claude/skills/*` | `settingSources` includes `"project"` |
| User skills | `~/.claude/skills/*` | `settingSources` includes `"user"` |
| Plugin skills | Bundled inside installed plugins | Plugin loaded via the `plugins` option |

## Canonical Python example

```python
options = ClaudeAgentOptions(
    cwd="/path/to/project",
    setting_sources=["user", "project"],
    skills="all",
    allowed_tools=["Read", "Write", "Bash"],
)

async for message in query(
    prompt="Help me process this PDF document", options=options
):
    print(message)
```

## Common pitfalls

- **Skills not found** — confirm `settingSources` includes `"user"` or `"project"`. Setting `settingSources=[]` disables discovery.
- **Wrong `cwd`** — skills load from `<cwd>` and parents up to the repository root only. If `cwd` is outside the skills' repo, they won't load.
- **Skill not used** — confirm the skill's name is in the `skills` list (if set), and that its `description` is keyword-rich. See [Agent Skills Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) for description guidance.

## Cross-references

- See [[docs-claude-code-features]] for `settingSources` and the broader filesystem-features model.
- See [[docs-subagents]] for `AgentDefinition.skills` (subagent-scoped preloading).
- See `docs/research/01-academy-courses/course-introduction-to-agent-skills.md` for the conceptual / authoring side.

## Open questions / follow-ups

- The page links to `/en/agent-sdk/plugins` for plugin-provided skills — defer to a future note in this dossier if a chapter relies heavily on plugin distribution.
- `plugin:skill` namespacing syntax is mentioned once but not detailed. Worth a follow-up if chapter material uses third-party plugin skills.
