---
source_url: https://code.claude.com/docs/en/commands
canonical_url: https://code.claude.com/docs/en/commands
source_title: Commands
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-code-internals
tier: T1-official
cert_domains: [3]
cert_task_areas: ["Custom slash commands + skills", "Plan mode vs direct execution", "Iterative refinement"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Slash commands — built-in commands and bundled skills (workflow-organized)

The complete reference of `/` commands in Claude Code. Built-in commands are coded into the CLI; **bundled skills** use the same mechanism as skills you write yourself (Claude can also auto-invoke them) and are marked `[Skill]` in the table below. Custom commands are merged into skills — see [[docs-skills]].

## Key takeaways

- **A command is only recognized at the start of your message.** Text after the command name is passed as arguments.
- **70+ built-in commands and bundled skills** organized by workflow phase: setup, in-task, parallel work, pre-ship, between-sessions, troubleshooting.
- **Bundled skills** (`[Skill]`-marked): `/code-review`, `/batch`, `/debug`, `/loop`, `/claude-api`, `/run`, `/verify`, `/run-skill-generator`, `/fewer-permission-prompts`. They use the same prompt-handed-to-Claude mechanism as user-written skills.
- **MCP prompts as commands**: `/mcp__<server>__<prompt>` — dynamically discovered from connected MCP servers. Server and prompt names normalized (spaces → underscores).
- **Plugin-provided commands**: namespaced `/<plugin-name>:<command-name>`.
- **Availability varies** by platform, plan, and environment. `/desktop` only on macOS/Windows with subscription; `/upgrade` only on Pro/Max; `/passes` only when eligible.
- **Some commands removed/renamed**: `/pr-comments` removed in v2.1.91 (ask Claude directly instead). `/vim` removed in v2.1.92 (use `/config` → Editor mode).
- **`/init` interactive flow**: `CLAUDE_CODE_NEW_INIT=1` enables multi-phase setup (CLAUDE.md + skills + hooks + personal memory).

## Quoted (citation-ready)

> "Commands control Claude Code from inside a session. They provide a quick way to switch models, manage permissions, clear context, run a workflow, and more. ... A command is only recognized at the start of your message. Text that follows the command name is passed to it as arguments."
>
> — Commands, opening
>
> Anchor: `Commands + Commands control Claude Code from inside a session`

> "Entries marked `[Skill]` are bundled skills. They use the same mechanism as skills you write yourself: a prompt handed to Claude, which Claude can also invoke automatically when relevant. Everything else is a built-in command whose behavior is coded into the CLI."
>
> — Commands, All commands
>
> Anchor: `All commands + Entries marked Skill are bundled skills`

## Workflow-grouped command reference

### First session in a repo

| Command | Purpose |
|---|---|
| `/init` | Initialize project with `CLAUDE.md` guide. `CLAUDE_CODE_NEW_INIT=1` for interactive flow (CLAUDE.md + skills + hooks + memory) |
| `/memory` | Edit `CLAUDE.md` files, toggle auto memory, view auto memory entries |
| `/mcp` | Manage MCP server connections and OAuth |
| `/agents` | Manage agent configurations |
| `/permissions` | Manage allow/ask/deny rules. Alias: `/allowed-tools` |
| `/config` | Open Settings interface. Alias: `/settings` |

### During a task

| Command | Purpose |
|---|---|
| `/plan [description]` | Enter plan mode (optionally with starter task: `/plan fix the auth bug`) |
| `/model [model]` | Set the AI model for the session. `d` on row in picker = save as default |
| `/effort [level\|auto]` | Set effort level. Slider with no arg. Takes effect immediately |
| `/context [all]` | Visualize context usage as colored grid; shows optimization suggestions |
| `/compact [instructions]` | Free context by summarizing. Optional focus instructions |
| `/btw <question>` | Quick side question without adding to conversation |
| `/copy [N]` | Copy last (or Nth-latest) assistant response. Press `w` for file output |
| `/goal [condition\|clear]` | Set a goal Claude works toward across turns until met |

### Running work in parallel

| Command | Purpose |
|---|---|
| `/agents` | Manage subagents |
| `/tasks` | List/manage background tasks. Also `/bashes` |
| `/background [prompt]` | Detach session to background. Alias: `/bg` |
| `/batch <instruction>` | **[Skill]** Decompose into 5-30 independent units; spawn background subagents in isolated git worktrees, each opens PR. Requires git repo |
| `/fork` (when `CLAUDE_CODE_FORK_SUBAGENT=1`) | Spawn forked subagent |
| `/branch [name]` | Branch current conversation. Alias: `/fork` when fork-subagent NOT set |
| `/loop [interval] [prompt]` | **[Skill]** Run prompt repeatedly. Self-paces if no interval. Alias: `/proactive` |
| `/schedule [description]` | Create/update/list cloud-routine via `claude.ai`. Alias: `/routines` |

### Before you ship

| Command | Purpose |
|---|---|
| `/diff` | Interactive diff viewer (uncommitted changes + per-turn diffs) |
| `/code-review [low\|...] [--comment] [target]` | **[Skill]** Review diff for correctness bugs. `--comment` posts inline on GitHub PR. Formerly `/simplify` |
| `/review [PR]` | Review a pull request locally |
| `/security-review` | Analyze pending changes for security vulnerabilities |
| `/ultrareview [PR]` | Deep multi-agent review in cloud sandbox. 3 free runs on Pro/Max |
| `/ultraplan <prompt>` | Draft plan in cloud, review in browser, execute remotely or locally |
| `/run` | **[Skill]** Launch and drive your app. Requires v2.1.145+ |
| `/verify` | **[Skill]** Build, run, observe app. Requires v2.1.145+ |
| `/run-skill-generator` | **[Skill]** Generate per-project launch recipe |

### Between sessions

| Command | Purpose |
|---|---|
| `/clear [name]` | Start fresh conversation; previous available in `/resume`. Aliases: `/reset`, `/new` |
| `/resume [session]` | Resume by ID/name; opens picker. Alias: `/continue` |
| `/rewind` | Rewind code/conversation to a checkpoint. Aliases: `/checkpoint`, `/undo` |
| `/teleport` | Pull a Claude Code on the web session into terminal. Alias: `/tp` |
| `/remote-control` | Make session available for remote control from claude.ai. Alias: `/rc` |
| `/desktop` | Continue session in Claude Code Desktop app. Alias: `/app` |
| `/rename [name]` | Rename session |
| `/export [filename]` | Export conversation as plain text |
| `/stop` | Stop current background session (only when attached) |
| `/exit` | Exit CLI. In attached background session = detach. Alias: `/quit` |

### Troubleshooting

| Command | Purpose |
|---|---|
| `/doctor` | Diagnose installation/settings. Press `f` to have Claude fix issues |
| `/debug [description]` | **[Skill]** Enable debug logging and troubleshoot. Off by default unless launched with `--debug` |
| `/feedback [report]` | Submit feedback/bug/conversation. Aliases: `/bug`, `/share` |
| `/heapdump` | Write JS heap snapshot for diagnosing high memory |
| `/release-notes` | View changelog |
| `/status` | Settings interface (Status tab): version, model, account, connectivity |
| `/usage` | Cost, plan usage, activity stats. Aliases: `/cost`, `/stats` |
| `/insights` | Report analyzing your sessions (areas, patterns, friction points) |

### Customization

| Command | Purpose |
|---|---|
| `/plugin` | Manage plugins (Discover/Installed/Marketplaces/Errors tabs) |
| `/reload-plugins` | Reload all active plugins without restart |
| `/skills` | List skills. `t` sort by tokens; `Space` cycle visibility |
| `/hooks` | Read-only view of hook configurations |
| `/theme` | Change color theme |
| `/color [color\|default]` | Set prompt bar color |
| `/statusline` | Configure status line |
| `/keybindings` | Open/create keybindings config |
| `/tui [default\|fullscreen]` | Set terminal UI renderer; relaunches |
| `/scroll-speed` | Adjust mouse wheel scroll speed (fullscreen only) |
| `/focus` | Toggle focus view (only last prompt + tool summary + final response) |

### Network and account

| Command | Purpose |
|---|---|
| `/login` | Sign in to Anthropic account |
| `/logout` | Sign out |
| `/passes` | Share free week (when eligible) |
| `/upgrade` | Switch to higher plan tier (Pro/Max only) |
| `/privacy-settings` | View/update privacy (Pro/Max only) |
| `/usage-credits` | Configure usage credits (formerly `/extra-usage`) |
| `/ide` | Manage IDE integrations and show status |
| `/web-setup` | Connect GitHub account to Claude Code on the web |
| `/remote-env` | Configure default remote env for web sessions |
| `/install-github-app` | Set up Claude GitHub Actions for a repo |
| `/install-slack-app` | Install Claude Slack app |
| `/setup-bedrock` | Configure Amazon Bedrock (only when `CLAUDE_CODE_USE_BEDROCK=1`) |
| `/setup-vertex` | Configure Google Vertex AI (only when `CLAUDE_CODE_USE_VERTEX=1`) |
| `/chrome` | Configure Claude in Chrome settings |

### Misc / Personalization / Output

| Command | Purpose |
|---|---|
| `/sandbox` | Toggle sandbox mode |
| `/fast [on\|off]` | Toggle fast mode |
| `/voice [hold\|tap\|off]` | Toggle voice dictation. Requires Claude.ai account |
| `/team-onboarding` | Generate team onboarding guide from session history (Pro/Max/Team/Enterprise also get share link) |
| `/autofix-pr [prompt]` | Spawn Claude Code on the web session that watches PR and pushes fixes on CI failure / review comments |
| `/recap` | One-line summary of current session |
| `/help` | Show help and available commands |
| `/powerup` | Discover features through interactive lessons |
| `/add-dir <path>` | Add working directory for file access |
| `/mobile` | Show QR code for mobile app. Aliases: `/ios`, `/android` |
| `/stickers` | Order Claude Code stickers |
| `/radio` | Open Claude FM lo-fi radio (not Bedrock/Vertex/Foundry) |
| `/terminal-setup` | Configure terminal keybindings (VS Code, Cursor, Windsurf, Alacritty, Zed) |
| `/claude-api [migrate\|managed-agents-onboard]` | **[Skill]** Load Claude API reference; migrate models; onboard Managed Agents. Auto-activates on `import anthropic` or `@anthropic-ai/sdk` |
| `/fewer-permission-prompts` | **[Skill]** Scan transcripts for common read-only Bash/MCP calls; add allowlist to project settings |

## MCP prompts as commands

Format: `/mcp__<server>__<prompt>`. Dynamically discovered. Arguments space-separated:

```text
/mcp__github__list_prs
/mcp__github__pr_review 456
/mcp__jira__create_issue "Bug in login flow" high
```

See [[docs-mcp]] for full MCP-prompt mechanics.

## Plugin commands

Plugin-provided commands and skills are namespaced: `/<plugin-name>:<command-name>` or for subfolders `/<plugin-name>:<subfolder>:<command-name>`.

## Cross-references

- See [[docs-skills]] for writing custom skills (the recommended way to add new commands).
- See [[docs-plugins]] for plugin-provided commands.
- See [[docs-mcp]] for MCP prompts surfacing as commands.
- See [[docs-permission-modes]] for `/plan` and the plan-mode flow.
- See [[docs-model-config]] for `/model`, `/effort`, and `ultrathink` prompt keyword.
- See [[docs-memory]] for `/init`, `/memory` semantics.

## Open questions / follow-ups

- Whether the `[Skill]`-marked bundled commands are listed in `/skills` and counted against `skillListingBudgetFraction`. Implied yes since they use the same mechanism, but not explicit.
- Plugin command visibility under `disable-model-invocation: true` — same rules as user-skill or different?
- `/ultraplan` and `/ultrareview` cloud-sandbox semantics — defer for full integration story to `09-headless-ci/`.
