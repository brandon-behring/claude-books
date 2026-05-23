---
source_url: https://code.claude.com/docs/en/discover-plugins
canonical_url: https://code.claude.com/docs/en/discover-plugins
source_title: Discover and install prebuilt plugins through marketplaces
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-code-internals
tier: T1-official
cert_domains: [3]
cert_task_areas: ["Custom slash commands + skills"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Discover plugins — marketplaces, `/plugin install`, team distribution

The consumer side of plugins: marketplace registration, browsing, installation scopes, auto-update toggles. Cross-reference [[docs-plugins]] for the plugin-creator side.

## Key takeaways

- **Two-step model**: (1) add marketplace (registers catalog with Claude Code), (2) install individual plugins from it. Like adding an app store, then downloading apps individually.
- **Two official Anthropic marketplaces**:
  - **`claude-plugins-official`** — curated by Anthropic; **automatically available** in every Claude Code installation. View at `claude.com/plugins`. Inclusion at Anthropic's discretion.
  - **`claude-community`** at `anthropics/claude-plugins-community` — third-party submissions after automated validation and safety screening. **Add manually** with `/plugin marketplace add anthropics/claude-plugins-community`, then install with `<name>@claude-community`.
- **Plus the demo marketplace** `claude-code-plugins` (`anthropics/claude-code` repo) with example plugins.
- **Four marketplace sources**:
  - GitHub repo: `owner/repo` (e.g., `anthropics/claude-code`)
  - Git URL (with `.git` suffix; supports `#branch-or-tag`)
  - Local path: directory or direct path to `marketplace.json`
  - Remote URL: direct URL to hosted `marketplace.json` (with limitations on relative paths)
- **Four install scopes** (precedence enterprise > user > project > local on tie):
  - **User scope** (default) — `~/.claude/...`, all your projects
  - **Project scope** — `.claude/settings.json`, all collaborators on this repo
  - **Local scope** — `.claude/settings.local.json`, you only in this repo, NOT shared
  - **Managed scope** — admin-installed via managed settings; cannot be modified by user
- **`/plugin` TUI** with four tabs (cycle with Tab/Shift+Tab):
  - **Discover** — browse all marketplaces; v2.1.143+ shows context cost estimate; v2.1.144+ shows last-updated; v2.1.145+ shows "Will install" section listing commands/agents/skills/hooks/MCP/LSP added
  - **Installed** — manage; `f` to favorite, type to filter, errors-first sort
  - **Marketplaces** — add/remove/update/auto-update toggle
  - **Errors** — view load errors
- **Auto-update**: enabled by default for official Anthropic marketplaces. Third-party and local-dev disabled by default. Admins can enable per-marketplace via `extraKnownMarketplaces[<name>].autoUpdate: true` in managed settings.
- **`/reload-plugins`** applies install/enable/disable changes without restart. Reports counts for plugins, skills, agents, hooks, MCP servers, LSP servers.
- **Code-intelligence LSP plugins**: 11 languages in official marketplace (`clangd-lsp`, `csharp-lsp`, `gopls-lsp`, `jdtls-lsp`, `kotlin-lsp`, `lua-lsp`, `php-lsp`, `pyright-lsp`, `rust-analyzer-lsp`, `swift-lsp`, `typescript-lsp`). Each requires the LSP binary installed on your system. Gives Claude automatic diagnostics after edits + code navigation (jump-to-def, find-refs, hover types, call hierarchies).

## Quoted (citation-ready)

> "Plugins extend Claude Code with skills, agents, hooks, and MCP servers. Plugin marketplaces are catalogs that help you discover and install these extensions without building them yourself."
>
> — Discover and install prebuilt plugins through marketplaces, opening
>
> Anchor: `Discover and install prebuilt plugins through marketplaces + Plugins extend Claude Code`

> "Make sure you trust a plugin before installing it. Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they work as intended. Check each plugin's homepage for more information."
>
> — Discover and install prebuilt plugins, Install plugins (Warning)
>
> Anchor: `Install plugins + Make sure you trust a plugin before installing it`

> "Plugins and marketplaces are highly trusted components that can execute arbitrary code on your machine with your user privileges. Only install plugins and add marketplaces from sources you trust."
>
> — Discover and install prebuilt plugins, Security
>
> Anchor: `Security + Plugins and marketplaces are highly trusted components`

## Marketplace command reference

```bash
# Add marketplaces (shortcut: /plugin market)
/plugin marketplace add anthropics/claude-code              # GitHub owner/repo
/plugin marketplace add https://gitlab.com/x/plugins.git    # Git URL
/plugin marketplace add ./my-marketplace                    # Local dir
/plugin marketplace add ./path/to/marketplace.json          # Local file
/plugin marketplace add https://example.com/marketplace.json  # Remote URL
/plugin marketplace add https://gitlab.com/x/plugins.git#v1.0.0  # Specific ref

# Manage
/plugin marketplace list
/plugin marketplace update <name>
/plugin marketplace remove <name>   # alias: rm. WARNING: uninstalls all plugins from it

# Install (default scope: user)
/plugin install <name>@<marketplace-name>
# Example: /plugin install commit-commands@anthropics-claude-code

# Manage plugins
/plugin disable <name>@<marketplace>
/plugin enable <name>@<marketplace>
/plugin uninstall <name>@<marketplace>
/plugin                              # Opens TUI

# Apply changes mid-session
/reload-plugins
```

CLI variant: `claude plugin install formatter@your-org --scope project`.

## Official marketplace plugin categories

### Code intelligence (11 LSP plugins)

| Language | Plugin | Binary required |
|---|---|---|
| C/C++ | `clangd-lsp` | `clangd` |
| C# | `csharp-lsp` | `csharp-ls` |
| Go | `gopls-lsp` | `gopls` |
| Java | `jdtls-lsp` | `jdtls` |
| Kotlin | `kotlin-lsp` | `kotlin-language-server` |
| Lua | `lua-lsp` | `lua-language-server` |
| PHP | `php-lsp` | `intelephense` |
| Python | `pyright-lsp` | `pyright-langserver` |
| Rust | `rust-analyzer-lsp` | `rust-analyzer` |
| Swift | `swift-lsp` | `sourcekit-lsp` |
| TypeScript | `typescript-lsp` | `typescript-language-server` |

What Claude gains:
- **Automatic diagnostics** after every file edit — language server analyzes changes and reports errors/warnings. Claude sees type errors, missing imports, syntax issues without compiling or linting.
- **Code navigation** — jump to definitions, find references, hover for types, list symbols, find implementations, trace call hierarchies. More precise than grep-based search.

Inline diagnostics shown by pressing **Ctrl+O** when "diagnostics found" indicator appears.

### External integrations (pre-configured MCP servers)

- Source control: `github`, `gitlab`
- Project management: `atlassian`, `asana`, `linear`, `notion`
- Design: `figma`
- Infrastructure: `vercel`, `firebase`, `supabase`
- Communication: `slack`
- Monitoring: `sentry`

### Development workflows

- `commit-commands` — git commit, push, PR creation
- `pr-review-toolkit` — specialized PR review agents
- `agent-sdk-dev` — Claude Agent SDK tools
- `plugin-dev` — plugin authoring toolkit
- `mcp-server-dev` — MCP server scaffolding skill

### Output styles

- `explanatory-output-style` — educational insights about implementation choices
- `learning-output-style` — interactive learning mode

## Team marketplaces (auto-suggest at trust dialog)

Add `extraKnownMarketplaces` to project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "my-team-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  }
}
```

When team members trust the repo folder, Claude Code prompts them to install these marketplaces and plugins. Set `"autoUpdate": true` to enable auto-update in managed settings.

Private repositories work the same way for keeping plugins internal.

## Auto-update environment variables

| Env var | Effect |
|---|---|
| `DISABLE_AUTOUPDATER` | Disable all auto-updates (Claude Code and plugins) |
| `FORCE_AUTOUPDATE_PLUGINS=1` (with `DISABLE_AUTOUPDATER`) | Disable Claude Code auto-update but **keep plugin auto-update enabled** |

## Manage authentication for MCP-server plugins

Plugins bundling MCP servers (e.g., `github`, `sentry`) require OAuth authentication. Use `/mcp` to complete the OAuth flow once the plugin is installed.

## Cross-references

- See [[docs-plugins]] for the creator side: `plugin.json`, directory structure, version management, marketplace submission.
- See [[docs-mcp]] for plugin-provided MCP servers (auto-start when plugin enabled, `${CLAUDE_PLUGIN_ROOT}` substitution).
- See [[docs-settings]] for `extraKnownMarketplaces`, `enabledPlugins`, plugin install scope locations.
- See [[docs-commands]] for the `/plugin` and `/reload-plugins` commands.

## Open questions / follow-ups

- The exact mechanism for managed marketplace restrictions (`/en/plugin-marketplaces#managed-marketplace-restrictions`) — defer for full enumeration if the cert exam covers it.
- Behavior of `/plugin install` when the same plugin name exists in multiple registered marketplaces but the user only specifies `@marketplace-name`. Presumably must be qualified.
