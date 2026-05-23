---
source_url: https://code.claude.com/docs/en/permission-modes
canonical_url: https://code.claude.com/docs/en/permission-modes
source_title: Choose a permission mode
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-code-internals
tier: T1-official
cert_domains: [3]
cert_task_areas: ["Plan mode vs direct execution", "Iterative refinement"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Permission modes — plan mode, auto mode, Shift+Tab cycle, protected paths

The six permission modes that control how often Claude pauses for approval. Plan mode is the centerpiece for "research before edit" workflows.

## Key takeaways

- **Six modes** with distinct safety/convenience tradeoffs:
  - **`default`** — reads-only auto-approved. Best for getting started or sensitive work.
  - **`acceptEdits`** — reads + file edits + common filesystem commands (`mkdir`, `touch`, `rm`, `rmdir`, `mv`, `cp`, `sed`) auto-approved for paths in cwd or `additionalDirectories`. Best for iterating on code under review.
  - **`plan`** — reads-only; Claude researches and proposes but doesn't make changes. Best for exploring a codebase before changing it.
  - **`auto`** — everything auto-approved with background safety classifier. Best for long tasks. Requires v2.1.83+; Sonnet 4.6+/Opus 4.6+/Opus 4.7. Only on Anthropic API (NOT Bedrock/Vertex/Foundry).
  - **`dontAsk`** — only pre-approved tools and read-only Bash. Best for locked-down CI/scripts.
  - **`bypassPermissions`** — no checks at all (except root `/` and home `~` removals still prompt as circuit breaker). **Only use in isolated containers/VMs.**
- **Shift+Tab cycle** in CLI: `default` → `acceptEdits` → `plan`. Optional modes (`auto`, `bypassPermissions`) slot in after `plan` when enabled, with `bypassPermissions` first and `auto` last. `dontAsk` never appears in cycle — only via `--permission-mode dontAsk`.
- **Plan mode** enter routes:
  - `Shift+Tab` until status shows plan mode
  - Prefix a single prompt with `/plan` (or `/plan fix the auth bug`)
  - Start in plan mode: `claude --permission-mode plan`
  - Set as default: `permissions.defaultMode: "plan"` in `.claude/settings.json`
- **Plan approval flow**: when plan is ready, Claude presents it. From there:
  - Approve and start in auto mode
  - Approve and accept edits
  - Approve and review each edit manually
  - Keep planning with feedback
  - Refine with **Ultraplan** (browser-based review)
- **Approving a plan exits plan mode** and switches the session to the permission mode the chosen option describes. To plan again, cycle back to plan mode or use `/plan`.
- **Ctrl+G** in plan-approval prompt opens the proposed plan in your default text editor for direct editing before Claude proceeds. With `showClearContextOnPlanAccept` enabled, each approve option offers to clear planning context first.
- **Accepting a plan auto-names the session** from the plan content (unless name already set via `--name` or `/rename`).
- **Auto mode classifier**: separate model reviews actions before they run, blocking escalation, unrecognized infrastructure targets, hostile-content-driven actions. Blocks 3 in a row OR 20 total → auto mode pauses, Claude Code resumes prompting. Counters reset on allowed actions (consecutive) or limit-trigger (total).
- **Protected paths** never auto-approved in any mode except `bypassPermissions`:
  - Directories: `.git`, `.vscode`, `.idea`, `.husky`, `.claude` (except `.claude/commands`, `.claude/agents`, `.claude/skills`, `.claude/worktrees`)
  - Files: `.gitconfig`, `.gitmodules`, `.bashrc`, `.bash_profile`, `.zshrc`, `.zprofile`, `.profile`, `.ripgreprc`, `.mcp.json`, `.claude.json`

## Quoted (citation-ready)

> "Plan mode tells Claude to research and propose changes without making them. Claude reads files, runs shell commands to explore, and writes a plan, but does not edit your source. Permission prompts still apply the same as default mode."
>
> — Choose a permission mode, Analyze before you edit with plan mode
>
> Anchor: `Analyze before you edit with plan mode + Plan mode tells Claude to research and propose changes`

> "Approving a plan exits plan mode and switches the session to the permission mode each approve option describes, so Claude starts editing. To plan again, cycle back to plan mode with `Shift+Tab`, or prefix your next prompt with `/plan`."
>
> — Choose a permission mode, Review and approve a plan
>
> Anchor: `Review and approve a plan + Approving a plan exits plan mode`

> "Auto mode is a research preview. It reduces prompts but does not guarantee safety. Use it for tasks where you trust the general direction, not as a replacement for review on sensitive operations."
>
> — Choose a permission mode, Eliminate prompts with auto mode (Warning)
>
> Anchor: `Eliminate prompts with auto mode + Auto mode is a research preview`

## Setting permission mode

| Method | Where | Persistence |
|---|---|---|
| `Shift+Tab` (CLI) | During session | Session only |
| Mode indicator click (VS Code/Desktop/web) | During session | Session only |
| `--permission-mode <name>` flag | CLI startup | Session only |
| `permissions.defaultMode` in settings | settings.json | Persistent (managed > local > project > user; auto rejected from project/local) |
| `--dangerously-skip-permissions` or `--allow-dangerously-skip-permissions` | CLI startup (bypass mode enable) | Session only |

**Notes**:
- `defaultMode: "auto"` is **ignored** from `.claude/settings.json` and `.claude/settings.local.json` (Claude Code refuses to grant a repo auto-mode access). Must be in user settings.
- `--allow-dangerously-skip-permissions` adds `bypassPermissions` to the cycle without activating it.
- VS Code `claudeCode.initialPermissionMode` does not accept `auto` — use user settings `defaultMode` instead.

## Plan-mode invocation patterns

```bash
# CLI startup
claude --permission-mode plan

# Single prompt with task
/plan fix the auth bug

# Just enter plan mode
/plan
```

After plan presented, approve options:
- Auto mode (highest autonomy)
- Accept edits (medium autonomy)
- Review each edit (lowest autonomy)
- Keep planning (back to plan mode)
- Refine with Ultraplan (browser-based)

## Auto mode requirements

- **Plan**: All plans (Pro, Max, Team, Enterprise, API)
- **Admin** (Team/Enterprise): admin must enable in Claude Code admin settings before users can turn on. Admins can lock off via `permissions.disableAutoMode: "disable"` in managed settings.
- **Model**: Sonnet 4.6, Opus 4.6, Opus 4.7. **NOT** Sonnet 4.5, Opus 4.5, Haiku, claude-3.
- **Provider**: Anthropic API only. NOT Bedrock, Vertex, or Foundry.

## Auto-mode classifier behavior

**Blocked by default**:
- Downloading and executing code (`curl | bash`)
- Sending sensitive data to external endpoints
- Production deploys and migrations
- Mass deletion on cloud storage
- Granting IAM or repo permissions
- Modifying shared infrastructure
- Irreversibly destroying files that existed before the session
- Force push or pushing directly to `main`

**Allowed by default**:
- Local file operations in cwd
- Installing dependencies declared in lock files/manifests
- Reading `.env` and sending credentials to their matching API
- Read-only HTTP requests
- Pushing to the branch you started on or one Claude created

Run `claude auto-mode defaults` to see full rule lists. Admins can add trusted repos/buckets/services via `autoMode.environment`.

## In-conversation boundaries (auto mode)

Stating "don't push" or "wait until I review before deploying" makes the classifier block matching actions even when default rules would allow. Boundary stays in force until you lift it. **Not stored as rules — re-read from transcript on each check**, so can be lost if compaction removes the message stating it. For hard guarantee, add deny rule.

## Auto-mode fallback

Blocked 3 in a row OR 20 total → auto mode pauses, normal prompting resumes. Approving the prompted action resumes auto mode. **Thresholds are NOT configurable.**

In `-p` non-interactive mode, repeated blocks abort the session (no user to prompt).

## Auto-mode classifier decision order

1. Allow/deny rules from `/en/permissions` resolve immediately
2. Read-only actions and file edits in cwd auto-approved (except protected paths)
3. Everything else → classifier
4. Classifier blocks → Claude receives reason, tries alternative

On entering auto mode, **broad allow rules granting arbitrary code execution are dropped**:
- `Bash(*)` or `PowerShell(*)`
- Wildcarded interpreters like `Bash(python*)`
- Package-manager run commands
- `Agent` allow rules

Narrow rules like `Bash(npm test)` carry over. Dropped rules restored when leaving auto mode.

The classifier sees user messages, tool calls, CLAUDE.md content. **Tool results are stripped** so hostile content in a file/web page cannot manipulate the classifier directly. A separate server-side probe scans incoming tool results.

## Auto mode subagent handling

Classifier checks subagent work at three points:
1. **Before subagent starts** — delegated task description evaluated
2. **During subagent run** — each action goes through classifier with parent's rules; any `permissionMode` in subagent frontmatter is **ignored**
3. **When subagent finishes** — full action history reviewed; flagged concerns prepend a security warning to results

## Cost/latency notes

Classifier runs on server-configured model (independent of `/model` selection). Calls count toward token usage. Reads and working-directory edits outside protected paths skip the classifier.

## `bypassPermissions` safety guards

- Cannot enter from a session not started with `--permission-mode bypassPermissions` or `--dangerously-skip-permissions` or `--allow-dangerously-skip-permissions`. Restart required.
- Refuses to start under root/sudo on Linux/macOS (unless inside recognized sandbox). For containerized autonomy, use dev container config.
- Admins block via `permissions.disableBypassPermissionsMode: "disable"` in managed settings.
- v2.1.126+: writes to protected paths execute (earlier versions still prompted).
- Root/home directory removals (`rm -rf /`, `rm -rf ~`) still prompt as circuit breaker.

## Cross-references

- See [[docs-model-config]] for `opusplan` alias (Opus in plan mode, Sonnet for execution).
- See [[docs-sub-agents]] for built-in **Plan** subagent (read-only research agent invoked during plan mode).
- See [[docs-commands]] for `/plan`, `/permissions`, `/sandbox` commands.
- See [[docs-hooks]] for the `permission_mode` input field on hook events and the `PermissionRequest`/`PermissionDenied` events.
- See [[docs-settings]] for `permissions.allow`/`ask`/`deny`/`defaultMode`, `additionalDirectories`, `disableAutoMode`, `disableBypassPermissionsMode`.

## Open questions / follow-ups

- The exact interaction between in-conversation boundaries and `/compact` — boundary stored in transcript, but if compaction summarizes that message, classifier may lose it. Document explicitly notes this risk but doesn't say what specific verbiage Claude tends to include in summaries.
- Whether the auto-mode classifier reads `.claude/rules/*.md` path-scoped rules or only CLAUDE.md — documentation says "user messages, tool calls, and your CLAUDE.md content" but doesn't mention rules.
- Auto-mode availability through LLM gateways (`ANTHROPIC_BASE_URL`) — the documentation lists "Anthropic API only" but gateways could be transparent passthroughs.
