---
source_url: https://code.claude.com/docs/en/skills
canonical_url: https://code.claude.com/docs/en/skills
source_title: Extend Claude with skills
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-code-internals
tier: T1-official
cert_domains: [3]
cert_task_areas: ["Custom slash commands + skills (.claude/commands/, .claude/skills/)"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Skills — `.claude/skills/<name>/SKILL.md` (custom commands merged into skills)

The CLI-consumer side of skills: how `SKILL.md` frontmatter, `.claude/commands/`-merge semantics, and `context: fork` work in the interactive terminal. Cross-reference [[../04-agent-sdk/docs-skills]] for the programmatic-SDK view (`skills` option as context filter).

## Key takeaways

- **Skills are markdown directories**: `.claude/skills/<name>/SKILL.md`. Optional supporting files (`reference.md`, `examples.md`, `scripts/`, etc.) live alongside.
- **Custom commands have been merged into skills.** A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy`. Existing `.claude/commands/` files keep working but skills are recommended for new work — they add directory bundling, frontmatter, and auto-invocation.
- **Four scopes** (precedence: enterprise > personal > project; plugin skills use `plugin-name:skill-name` namespace and never conflict):
  - Enterprise (managed settings) — all users in org
  - Personal: `~/.claude/skills/<name>/SKILL.md` — all your projects
  - Project: `.claude/skills/<name>/SKILL.md` — this project; auto-discovered in `cwd` and every parent up to repo root, plus nested subdirectories on demand
  - Plugin: `<plugin>/skills/<name>/SKILL.md` — namespaced `/plugin-name:skill-name`
- **Live change detection**: adding/editing/removing a skill in `~/.claude/skills/`, project `.claude/skills/`, or `.claude/skills/` inside an `--add-dir` directory takes effect within the current session **without restart**. Creating a top-level `skills/` dir that did not exist at session start requires restart.
- **Lazy-loaded body**: descriptions (~100 tokens each) are loaded at session start so Claude knows what's available. Full content loads on invocation. **Once invoked, the rendered content enters the conversation as a single message and stays for the rest of the session** (re-read on subsequent turns is NOT re-done).
- **Compaction carries skills forward** within a budget: first 5,000 tokens of each most-recently-invoked skill, **combined budget 25,000 tokens** post-compaction.
- **Dynamic context injection** with `` !`<command>` `` (inline) or ` ```! ` (fenced block): runs the shell command **before** Claude sees the skill, replacing the placeholder with output. Substitution runs once over the original file; output is not re-scanned.

## Quoted (citation-ready)

> "Skills are markdown files that give your agent specialized knowledge and invocable workflows. Unlike `CLAUDE.md` (which loads every session), skills load on demand. The agent receives skill descriptions at startup and loads the full content when relevant."
>
> — Extend Claude with skills, Configure skills / Types of skill content (also restated in SDK dossier)
>
> Anchor: `Configure skills + Skills are markdown files that give your agent`

> "**Custom commands have been merged into skills.** A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way. Your existing `.claude/commands/` files keep working."
>
> — Extend Claude with skills, opening note
>
> Anchor: `Extend Claude with skills + Custom commands have been merged into skills`

> "When you or Claude invoke a skill, the rendered `SKILL.md` content enters the conversation as a single message and stays there for the rest of the session. Claude Code does not re-read the skill file on later turns, so write guidance that should apply throughout a task as standing instructions rather than one-time steps."
>
> — Extend Claude with skills, Skill content lifecycle
>
> Anchor: `Skill content lifecycle + When you or Claude invoke a skill`

## SKILL.md frontmatter reference

| Field | Required | Description |
|---|:---:|---|
| `name` | No | Display name; defaults to directory name. Lowercase letters, numbers, hyphens only; max 64 chars |
| `description` | Recommended | What the skill does and when to use it. Used by Claude to auto-invoke. Combined `description + when_to_use` capped at 1,536 chars |
| `when_to_use` | No | Additional trigger phrases / example requests, appended to `description` (counts toward 1,536 cap) |
| `argument-hint` | No | Hint shown during autocomplete. Example: `[issue-number]` or `[filename] [format]` |
| `arguments` | No | Named positional arguments for `$name` substitution. Space-separated string or YAML list |
| `disable-model-invocation` | No | `true` = only user can invoke (via `/`); Claude cannot auto-invoke. Also blocks subagent preloading. Default: `false` |
| `user-invocable` | No | `false` = hide from `/` menu; only Claude can invoke. Default: `true` |
| `allowed-tools` | No | Tools Claude can use without per-use approval when this skill is active. Space-separated string or YAML list. **CLI-only**; ignored by SDK |
| `model` | No | Override model when skill is active; applies for the rest of the current turn. Resumes session model on next prompt |
| `effort` | No | Override effort level when skill is active |
| `context` | No | Set to `fork` to run in a forked subagent context |
| `agent` | No | Which subagent type to use when `context: fork` is set |
| `hooks` | No | Hooks scoped to this skill's lifecycle (see [[docs-hooks]] hooks-in-skills-and-agents) |
| `paths` | No | Glob patterns that limit when this skill is activated. Loaded only when working with matching files |
| `shell` | No | `bash` (default) or `powershell` for `` !`command` `` blocks. PowerShell requires `CLAUDE_CODE_USE_POWERSHELL_TOOL=1` |

## String substitutions inside SKILL.md

| Variable | Description |
|---|---|
| `$ARGUMENTS` | All arguments passed when invoking. If absent in content, appended as `ARGUMENTS: <value>` |
| `$ARGUMENTS[N]`, `$N` | Specific 0-indexed argument. `$0` = first, `$1` = second |
| `$name` | Named argument declared in `arguments:` frontmatter |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_EFFORT}` | Current effort level |
| `${CLAUDE_SKILL_DIR}` | Directory containing the skill's `SKILL.md`. For plugin skills, the skill's subdir, not the plugin root |

Indexed arguments use shell-style quoting: `/my-skill "hello world" second` → `$0` = `hello world`, `$1` = `second`. `$ARGUMENTS` always expands to the full argument string as typed.

## Dynamic context injection

```yaml
---
name: pr-summary
description: Summarize changes in a pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## Pull request context
- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`
```

- The `` !`<command>` `` syntax runs **before** Claude sees the skill content.
- Inline form only recognized when `!` appears at start of line or after whitespace.
- For multi-line, use a fenced block opened with ` ```! `.
- Disable globally with `"disableSkillShellExecution": true` in settings (most useful in managed settings).

## `context: fork` (run skill in subagent)

```yaml
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly...
```

Comparison of skill-in-subagent vs subagent-with-skills:

| Approach | System prompt | Task | Also loads |
|---|---|---|---|
| Skill with `context: fork` | From agent type | SKILL.md content | CLAUDE.md (except Explore/Plan agents) |
| Subagent with `skills` field | Subagent's markdown body | Claude's delegation message | Preloaded skills + CLAUDE.md |

Built-in Explore and Plan agents skip CLAUDE.md and git status to keep their context small.

## `paths`-scoped activation

```yaml
---
paths:
  - "src/api/**/*.ts"
---
```

| Pattern | Matches |
|---|---|
| `**/*.ts` | All TS files in any directory |
| `src/**/*` | All files under `src/` |
| `*.md` | Markdown in project root |
| `src/components/*.tsx` | React components in dir |
| `src/**/*.{ts,tsx}` | Brace expansion for multi-ext |

Same format as `.claude/rules/*.md` `paths` frontmatter (see [[docs-memory]]).

## `disable-model-invocation` + `user-invocable` semantics

| Frontmatter | User can invoke | Claude can invoke | When loaded |
|---|---|---|---|
| (default) | Yes | Yes | Description always in context; full skill loads on invocation |
| `disable-model-invocation: true` | Yes | No | Description NOT in context; full skill loads when user invokes |
| `user-invocable: false` | No | Yes | Description always in context; full skill loads on Claude invocation |

`user-invocable` only controls menu visibility. To block programmatic invocation entirely, use `disable-model-invocation: true`.

## `skillOverrides` setting (visibility control from settings)

```json
{
  "skillOverrides": {
    "legacy-context": "name-only",
    "deploy": "off"
  }
}
```

| Value | Listed to Claude | In `/` menu |
|---|---|---|
| `"on"` | Name and description | Yes |
| `"name-only"` | Name only | Yes |
| `"user-invocable-only"` | Hidden | Yes |
| `"off"` | Hidden | Hidden |

Plugin skills are NOT affected by `skillOverrides` — manage via `/plugin`.

## Bundled skills (built-in)

`/code-review`, `/batch`, `/debug`, `/loop`, `/claude-api`, `/run`, `/verify`, `/run-skill-generator`, `/fewer-permission-prompts`. All bundled skills are listed in [[docs-commands]] marked `[Skill]`.

## Description budget overflow

Skill descriptions are loaded into context. Budget scales at **1% of model's context window** by default. When it overflows, descriptions for least-invoked skills are dropped first. Configure via `skillListingBudgetFraction` (e.g., `0.02` = 2%) or `SLASH_COMMAND_TOOL_CHAR_BUDGET`. The 1,536-char per-description cap is configurable with `maxSkillDescriptionChars`.

Run `/doctor` to see whether the budget is overflowing.

## Cross-references

- See [[docs-commands]] for the full list of built-in commands and bundled skills.
- See [[docs-sub-agents]] for `skills` field (preload skills into subagent) — inverse of `context: fork` here.
- See [[docs-memory]] for `.claude/rules/*.md` (cousin of skills with `paths`-scoping but loaded into every session).
- See [[docs-hooks]] for `hooks` in skill frontmatter (component-scoped lifecycle).
- See [[../04-agent-sdk/docs-skills]] for the programmatic-SDK view (`skills` option as context filter; `allowed-tools` does NOT apply through the SDK).

## Open questions / follow-ups

- Interaction between `disable-model-invocation` skills and `skill` permission rules: confirmed that `Skill(name)` exact-match and `Skill(name *)` prefix-match permission rules exist, but the precedence when both `disable-model-invocation: true` AND `permissions.allow: ["Skill(name)"]` are set isn't fully spelled out.
- The 25,000-token combined post-compaction budget — whether this is configurable, and what happens when a user invokes many bundled + custom skills in one session that each individually fit but collectively exceed 25K.
