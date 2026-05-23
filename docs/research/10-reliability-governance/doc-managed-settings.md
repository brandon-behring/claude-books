---
source_url: https://code.claude.com/docs/en/settings
canonical_url: https://code.claude.com/docs/en/settings
source_title: Claude Code — Settings
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: reliability-governance
tier: T1-official
cert_domains: [3, 5]
cert_task_areas:
  - CLAUDE.md hierarchy (user / project / directory; @import)
  - Tool distribution + tool_choice (auto/any/forced)
  - MCP server config (.mcp.json vs ~/.claude.json, env var expansion)
  - Human review workflows + confidence calibration
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Claude Code managed settings — enterprise enforcement layer

The single most-important governance primitive in the Claude Code product surface. Defines the **highest-priority configuration tier**, the only way an enterprise can enforce policy that **users and projects cannot override**.

## Key takeaways

- **Settings hierarchy (priority, highest to lowest)**: **Managed** → Command line arguments → Local → Project → User. Managed scope "can't be overridden by anything." Anything an enterprise needs to *enforce* (security, compliance, model allowlists, MCP allowlists) must live in managed settings; anything in user/project scope is advisory only.
- **Three delivery channels for managed settings**:
  1. **Server-managed settings** — delivered from Anthropic servers via the Claude.ai admin console (enterprise plans).
  2. **MDM / OS-level policies** — macOS configuration profiles (domain `com.anthropic.claudecode`, Jamf/Iru/Kandji); Windows registry (`HKLM\SOFTWARE\Policies\ClaudeCode` admin, `HKCU\...` user, deployed via Group Policy or Intune).
  3. **File-based** — `/Library/Application Support/ClaudeCode/` (macOS), `/etc/claude-code/` (Linux/WSL), `C:\Program Files\ClaudeCode\` (Windows; legacy `C:\ProgramData\ClaudeCode\managed-settings.json` unsupported since v2.1.75). A drop-in directory `managed-settings.d/` supports independent policy fragments merged systemd-style.
- **Managed-only settings (cannot be set in user/project scope)** — the critical enterprise toolkit:
  - `allowManagedPermissionRulesOnly` — prevents user/project from defining `allow`, `ask`, or `deny` rules; only managed rules apply.
  - `allowManagedHooksOnly` — only managed/SDK/plugin-enabled hooks load; blocks user, project, and other plugin hooks.
  - `allowManagedMcpServersOnly` — only managed `allowedMcpServers` is respected; the denylist still merges.
  - `allowedMcpServers` / `deniedMcpServers` — allowlist + denylist of MCP servers. Denylist takes precedence.
  - `allowedChannelPlugins` — allowlist of channel plugins (Telegram/Discord/iMessage); empty array = block all.
  - `blockedMarketplaces` / `strictKnownMarketplaces` — block/allow plugin marketplaces.
  - `strictPluginOnlyCustomization` — blocks skills/agents/hooks/MCP servers from user/project sources; only plugins or managed sources allowed.
  - `claudeMd` — CLAUDE.md-style organization-managed memory injected as instructions; ignored in user/project scope.
  - `disableAgentView` — turns off background agents and supervisor view (`claude agents`, `--bg`, `/background`).
  - `disableAutoMode` — prevents auto mode activation (removes from `Shift+Tab` cycle).
  - `disableRemoteControl` — disables Remote Control entirely (requires v2.1.128+).
  - `disableSkillShellExecution` — disables inline `` !`...` `` shell execution in skills.
  - `forceRemoteSettingsRefresh` — blocks CLI startup until remote managed settings are fetched (fails closed).
  - `policyHelper` — admin-deployed executable that computes managed settings dynamically at startup (requires v2.1.136+).
  - `pluginTrustMessage` — custom message appended to plugin trust warnings.
- **Other enterprise-critical (settable anywhere but enforced from managed)**:
  - `availableModels` — restricts which models users can select via `/model`, `--model`, `ANTHROPIC_MODEL`. (Introduced Apr 23 per landscape doc §1.3.)
  - `forceLoginMethod` — `claudeai` or `console`; blocks API-key / `apiKeyHelper` / third-party login at startup.
  - `forceLoginOrgUUID` — restricts login to one or more org UUIDs; empty array fails closed.
  - `model` — overrides default model.
  - `disableAllHooks` — disables all hooks and custom status line.
  - `allowedHttpHookUrls` / `httpHookAllowedEnvVars` — allowlist URL patterns + env vars for HTTP hooks.
  - `companyAnnouncements` — startup announcements; cycled randomly when multiple.
  - `feedbackSurveyRate` — probability (0–1) of session quality survey; `0` suppresses.
  - `sandbox.*` (with managed-only sub-settings `allowManagedReadPathsOnly`, `allowManagedDomainsOnly`).
  - `minimumVersion` — floor version preventing auto-updates from installing below it.
  - `autoUpdatesChannel` — `"stable"` (~1 week old, skips regressions) or `"latest"`.
- **Why this is a book-grade primitive**: enterprises with FedRAMP / IL5 / EU AI Act exposure need to (a) restrict which models can be used (`availableModels`), (b) prevent users from adding rogue MCP servers (`allowManagedMcpServersOnly`), (c) prevent permission rule overrides (`allowManagedPermissionRulesOnly`), (d) lock model choice via Bedrock GovCloud channels, (e) push organization-wide guardrails via `claudeMd`. The whole managed-settings surface is the *governance* layer. The April 23 reset of usage limits and the security advisory cadence (16+ CVEs in ~9 months) make the case that this is non-optional for production enterprise deployments.

## Quoted (citation-ready)

> "When the same setting appears in multiple scopes, Claude Code applies them in priority order: 1. Managed (highest) - can't be overridden by anything"
>
> — *Claude Code Settings*, §Settings hierarchy
>
> Anchor: `Settings hierarchy + When the same setting appears in multiple scopes`

> "File-based managed settings also support a drop-in directory at `managed-settings.d/` in the same system directory alongside `managed-settings.json`. This lets separate teams deploy independent policy fragments without coordinating edits to a single file."
>
> — *Claude Code Settings*, §File-based managed settings
>
> Anchor: `File-based managed settings + File-based managed settings also support a drop-in directory`

> "Managed scope is for: Security policies that must be enforced organization-wide; Compliance requirements that can't be overridden; Standardized configurations deployed by IT/DevOps"
>
> — *Claude Code Settings*, §Managed scope
>
> Anchor: `Managed scope + Managed scope is for Security policies that must be`

## Cross-references

- See [[blog-fedramp-high-bedrock]] — managed settings are how a Bedrock GovCloud deployment locks the surface (`forceLoginMethod`, model allowlist).
- See [[news-eu-ai-act-deadline]] — the deployer-layer obligations are partly satisfied through managed settings (logging via hook allowlists, model restriction).
- See [[advisories-claude-code-github]] — managed `sandbox.*`, `allowManagedHooksOnly`, `strictPluginOnlyCustomization` directly mitigate categories of CVE that have appeared.
- See `/Users/brandonbehring/claude-books/docs/landscape-2026-05.md` §1.3 (Settings hierarchy paragraph: "Managed > CLI > Local > Project > User. New managed-only setting: `availableModels` allowlist (Apr 23).").

## Open questions / follow-ups

- **Full setting count** — the docs page has many more entries beyond the managed-critical subset captured above. For a comprehensive reference table, parse the full page and add to App C of the architect-reference.
- **Verify `policyHelper`** — `min-version: 2.1.136` indicates this is recent. Worth confirming actual behavior (executable signature checking, fail-modes) before recommending in book.
- **Server-managed settings (Claude.ai admin console UI)** — separate doc at `/en/server-managed-settings`; not fetched here. Capture before chapter 14 / 15.
- **MDM deployment templates** — `examples/mdm` exists in `anthropics/claude-code` repo. Worth listing template names for the book if the chapter recommends specific MDM products.
