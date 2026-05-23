---
source_url: https://code.claude.com/docs/en/memory
canonical_url: https://code.claude.com/docs/en/memory
source_title: How Claude remembers your project
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-code-internals
tier: T1-official
cert_domains: [3]
cert_task_areas: ["CLAUDE.md hierarchy (user / project / directory; @import)", ".claude/rules/ with YAML glob path-scoping"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Memory — CLAUDE.md hierarchy, `.claude/rules/` path-scoping, auto memory

The canonical doc on persistent context for Claude Code: hand-written CLAUDE.md files at four scopes, the `.claude/rules/*.md` system with YAML glob path-scoping, and Claude-written auto memory at `~/.claude/projects/<project>/memory/`.

## Key takeaways

- **Two complementary memory systems**: CLAUDE.md files (you write) and auto memory (Claude writes). **Both load at the start of every conversation.** Both are context, not enforced configuration.
- **Four CLAUDE.md scopes** (loaded in this order, broadest → most specific):
  1. **Managed policy** — `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS), `/etc/claude-code/CLAUDE.md` (Linux/WSL), `C:\Program Files\ClaudeCode\CLAUDE.md` (Windows). Or via `claudeMd` key in `managed-settings.json`. **Cannot be excluded by individual settings.**
  2. **User** — `~/.claude/CLAUDE.md`
  3. **Project** — `./CLAUDE.md` OR `./.claude/CLAUDE.md`. Loaded by walking up the directory tree from cwd.
  4. **Local** — `./CLAUDE.local.md` (add to `.gitignore`)
- **Discovery walks up the directory tree** from cwd. All discovered files **concatenate** rather than override — no hard precedence between levels. Order: filesystem root down to cwd. Within each directory, `CLAUDE.local.md` is appended after `CLAUDE.md`.
- **Nested CLAUDE.md** below cwd: not loaded at launch; loaded **on demand** when Claude reads a file in that subdir.
- **`@path/to/import`** syntax inside CLAUDE.md: imported files expand and load at launch alongside the referencing file. Max recursion depth 5. Relative paths resolve relative to the file containing the import. **First time importing, Claude shows approval dialog**; declining disables imports permanently (dialog doesn't reappear).
- **`AGENTS.md`** — Claude Code reads `CLAUDE.md`, **not** `AGENTS.md`. Create a `CLAUDE.md` that imports `@AGENTS.md` to share with other agents. `/init` reads existing `AGENTS.md`, `.cursorrules`, `.windsurfrules` and incorporates relevant parts.
- **`.claude/rules/*.md`** — modular rules system, loaded into context every session (or when matching files are opened). Recursive discovery; subdirs supported. Rules without `paths` frontmatter load unconditionally, same priority as `.claude/CLAUDE.md`. Path-scoped rules trigger when Claude reads matching files (not on every tool use).
- **Symlinks work** in `.claude/rules/` — link shared rules from a central dir; circular symlinks detected gracefully.
- **`claudeMdExcludes`** setting (`settings.local.json`-friendly): glob patterns matched against absolute paths. **Managed policy CLAUDE.md cannot be excluded.** Arrays merge across layers.
- **Auto memory** at `~/.claude/projects/<project>/memory/`. Storage location overridable via `autoMemoryDirectory` (accepted from policy/user settings or `--settings` flag — **NOT** from project/local settings to prevent repo-side redirection). First **200 lines or 25KB** of `MEMORY.md` (whichever first) loads into every session. Disable with `autoMemoryEnabled: false` or `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`. Requires v2.1.59+.
- **Block-level HTML comments** (`<!-- maintainer notes -->`) in CLAUDE.md are **stripped before context injection**. Comments inside code blocks preserved.
- **Compaction survival**: project-root CLAUDE.md survives compaction (re-read from disk after `/compact`). Nested CLAUDE.md files are **not** re-injected automatically; they reload when Claude next reads a file in that subdirectory.

## Quoted (citation-ready)

> "Each Claude Code session begins with a fresh context window. Two mechanisms carry knowledge across sessions: **CLAUDE.md files**: instructions you write to give Claude persistent context. **Auto memory**: notes Claude writes itself based on your corrections and preferences."
>
> — How Claude remembers your project, opening
>
> Anchor: `How Claude remembers your project + Each Claude Code session begins with a fresh context window`

> "All discovered files are concatenated into context rather than overriding each other. Across the directory tree, content is ordered from the filesystem root down to your working directory."
>
> — How Claude remembers your project, How CLAUDE.md files load
>
> Anchor: `How CLAUDE.md files load + All discovered files are concatenated into context`

> "Rules without [`paths` frontmatter](#path-specific-rules) are loaded at launch with the same priority as `.claude/CLAUDE.md`. ... Path-scoped rules trigger when Claude reads files matching the pattern, not on every tool use."
>
> — How Claude remembers your project, Organize rules with `.claude/rules/` / Path-specific rules
>
> Anchor: `Path-specific rules + Rules without paths frontmatter are loaded at launch`

## Path-specific rules (`.claude/rules/<name>.md` with YAML glob)

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules

- All API endpoints must include input validation
- Use the standard error response format
- Include OpenAPI documentation comments
```

Glob pattern reference:

| Pattern | Matches |
|---|---|
| `**/*.ts` | All TypeScript files in any directory |
| `src/**/*` | All files under `src/` |
| `*.md` | Markdown in project root |
| `src/components/*.tsx` | React components in specific dir |
| `src/**/*.{ts,tsx}` | Brace expansion: multi-extension |

Multiple patterns and brace expansion supported. **Same format as `paths` in skill frontmatter** ([[docs-skills]]).

## Directory layout example

```
your-project/
├── .claude/
│   ├── CLAUDE.md           # Main project instructions
│   └── rules/
│       ├── code-style.md   # Loaded unconditionally
│       ├── testing.md      # Loaded unconditionally
│       ├── security.md     # Loaded unconditionally
│       ├── frontend/
│       │   └── react.md    # With paths: src/frontend/**/*.tsx
│       └── backend/
│           └── api.md      # With paths: src/api/**/*.ts
```

## `claudeMdExcludes` (skip ancestor CLAUDE.md files)

```json
{
  "claudeMdExcludes": [
    "**/monorepo/CLAUDE.md",
    "/home/user/monorepo/other-team/.claude/rules/**"
  ]
}
```

Matches against absolute file paths using glob syntax. Configure at any layer (user, project, local, managed). **Arrays merge across layers.** Managed-policy CLAUDE.md cannot be excluded.

## `claudeMd` managed-settings key

```json
{
  "claudeMd": "Always run `make lint` before committing.\nNever push directly to main."
}
```

Lets managed-settings deploy CLAUDE.md content **inline** without a separate file. Honored only in managed and policy settings; ignored in user/project/local. Loads before user and project CLAUDE.md.

## Auto memory directory structure

```
~/.claude/projects/<project>/memory/
├── MEMORY.md          # Concise index, loaded into every session
├── debugging.md       # Detailed notes; loaded on demand
├── api-conventions.md
└── ...
```

**Only first 200 lines / 25KB of `MEMORY.md`** loads at session start. Topic files load on demand via standard file tools. `<project>` is derived from the git repo, so all worktrees and subdirectories of one repo share an auto memory directory.

`autoMemoryDirectory` override (managed/user settings or `--settings` flag only):

```json
{
  "autoMemoryDirectory": "~/my-custom-memory-dir"
}
```

Value must be absolute path or start with `~/`. **Not accepted from project/local settings** because a cloned repo could redirect auto memory writes to sensitive locations.

## Loading from `--add-dir` directories

```bash
CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 claude --add-dir ../shared-config
```

Loads `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md`, and `CLAUDE.local.md` from the added directory. `CLAUDE.local.md` is skipped if `local` is excluded from `--setting-sources`.

## `/memory` command

Lists all CLAUDE.md, CLAUDE.local.md, and rules files loaded in the current session. Toggle auto memory on/off. Opens auto memory folder.

When you ask Claude "remember that..." Claude saves to auto memory. To add to CLAUDE.md instead, ask Claude directly: "add this to CLAUDE.md".

## CLAUDE.md vs auto memory

| | CLAUDE.md files | Auto memory |
|---|---|---|
| **Who writes it** | You | Claude |
| **What it contains** | Instructions and rules | Learnings and patterns |
| **Scope** | Project, user, or org | Per repository, shared across worktrees |
| **Loaded into** | Every session | Every session (first 200 lines / 25KB) |
| **Use for** | Coding standards, workflows, architecture | Build commands, debugging insights, preferences |

## `/init` command

Generates a starter CLAUDE.md. If one already exists, `/init` suggests improvements rather than overwriting.

`CLAUDE_CODE_NEW_INIT=1` enables an interactive multi-phase flow: asks which artifacts to set up (CLAUDE.md, skills, hooks), explores codebase with a subagent, fills in gaps via follow-up questions, presents a reviewable proposal before writing.

Running `/init` in a repo with existing `AGENTS.md`, `.cursorrules`, or `.windsurfrules` reads them and incorporates relevant parts.

## Cross-references

- See [[docs-skills]] for `.claude/skills/` (cousin of rules; lazy-loaded vs rules' eager-load).
- See [[docs-settings]] for `claudeMdExcludes`, `autoMemoryEnabled`, `autoMemoryDirectory`, `claudeMd`.
- See [[docs-sub-agents]] for `memory: user|project|local` on subagents (separate memory store from auto memory).
- See [[docs-hooks]] for `InstructionsLoaded` hook (logs exactly which instruction files load, when, why).
- See [[../04-agent-sdk/docs-claude-code-features]] for `settingSources` and SDK-side loading.

## Open questions / follow-ups

- **Compaction handling for `.claude/rules/`**: project-root CLAUDE.md is documented as re-injected post-compaction. Whether `.claude/rules/*.md` (especially path-scoped ones) also re-injects, or only re-loads when Claude next reads a matching file, isn't fully spelled out.
- **`@import` expansion vs include depth limit of 5**: behavior when depth exceeded (silent truncation? error?) isn't documented.
- **Auto memory file shape inside topic files** (e.g., `debugging.md`): no schema documented. The page suggests freeform markdown, but consistency across sessions would benefit from a documented template.
