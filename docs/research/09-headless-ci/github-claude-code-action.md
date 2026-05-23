---
source_url: https://github.com/anthropics/claude-code-action
canonical_url: https://github.com/anthropics/claude-code-action
source_title: anthropics/claude-code-action (GitHub repo)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: headless-ci
tier: T2-release-notes
cert_domains: [3]
cert_task_areas: ["CI/CD integration (`-p` flag, `--output-format json`, `--json-schema`)"]
volatility: fast-moving
verified: true
supersedes: []
superseded_by: []
---

# `anthropics/claude-code-action` — repo + release cadence

## Key takeaways

- Stars: **7,688** (as of 2026-05-22); 1,900 forks; TypeScript 93.5%; MIT.
- Latest release: **v1.0.132** (2026-05-22). v1.0 GA shipped 2025-08-26.
- Supports four providers: Anthropic direct (API key or **Workload Identity Federation (WIF)** — added in v1.0.130, 2026-05-21), Amazon Bedrock, Google Vertex AI, **Microsoft Foundry**.
- Inputs mirror docs ([[docs-github-actions]]): `prompt`, `claude_args`, `plugin_marketplaces`, `plugins`, `anthropic_api_key`, `github_token`, `trigger_phrase`, `use_bedrock`, `use_vertex`, `use_foundry`.
- Runs entirely on GitHub-hosted runners; only API calls leave the runner. Local execution preserved as a security property.
- 196 total releases; releases cadence on 2026-05-21 / 2026-05-22 (multiple patch releases per day at peak) — treat as **fast-moving** for any pinned version.

## Quoted (citation-ready)

> "We're excited to announce the v1.0 release of Claude Code GitHub Action! This major release brings significant improvements in simplicity, flexibility, and power to AI-assisted development workflows. … Automatic mode detection — No more manual `mode` configuration. The action intelligently determines whether to run in interactive or automation mode based on your setup."
>
> — anthropics/claude-code-action v1.0 release notes, 2025-08-26
>
> Anchor: `Claude Code GitHub Action v1.0 + Now Generally Available`

> "Add Workload Identity Federation (OIDC) authentication support."
>
> — anthropics/claude-code-action v1.0.130 release notes, 2026-05-21
>
> Anchor: `v1.0.130 + Add Workload Identity Federation (OIDC) authentication support`

## Inputs (per repo README)

### Authentication

| Input | Use |
|---|---|
| `anthropic_api_key` | Direct Claude API |
| `use_bedrock` | AWS Bedrock |
| `use_vertex` | Google Vertex AI |
| `use_foundry` | Microsoft Foundry |
| `github_token` | GitHub authentication token |

### Configuration

| Input | Use |
|---|---|
| `prompt` | Custom prompt (or skill name like `/skill-name`) |
| `claude_args` | Any CLI passthrough (e.g. `--max-turns 5 --model claude-opus-4-7`) |
| `plugin_marketplaces` | Newline-separated marketplace Git URLs |
| `plugins` | Newline-separated plugin names to install before execution |
| `trigger_phrase` | Custom activation phrase (default `@claude`) |

## Feature surface (per README)

- Intelligent Mode Detection (interactive vs automation, based on context)
- Interactive Assistant (Q&A, code review, implementation)
- Progress Tracking (visual checkboxes that update dynamically)
- Structured JSON Output → becomes GitHub Action outputs for downstream automation
- Flexible Tool Access (GitHub APIs, file ops, configurable MCP servers)
- Runs Locally (executes on GitHub runners; only API calls go to provider)

## Documented automation patterns (Solutions section in repo)

- Automatic PR Code Review
- Path-Specific Reviews
- External Contributor Handling
- Custom Review Checklists
- Scheduled Maintenance
- Issue Triage & Labeling
- Documentation Sync
- Security-Focused Reviews

## Release-cadence snapshot

| Release | Date | Notable |
|---|---|---|
| v1.0.132 | 2026-05-22 | patch |
| v1.0.131 | 2026-05-22 | patch |
| v1.0.130 | 2026-05-21 | **WIF (OIDC) auth support added** |
| v1.0.129 | 2026-05-21 | patch |
| v1.0 | 2025-08-26 | GA — breaking API changes |

196 total releases. Pin to a major (`@v1`) for stability; pin to a specific version for full reproducibility.

## Microsoft Foundry note (third-party verification)

Per Microsoft Learn ([Configure Claude Code for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/configure-claude-code)), the pattern for Foundry in GitHub Actions is:

```yaml
- uses: anthropics/claude-code-action@v1
  env:
    CLAUDE_CODE_USE_FOUNDRY: "1"
    ANTHROPIC_FOUNDRY_RESOURCE: ${{ secrets.ANTHROPIC_FOUNDRY_RESOURCE }}
    ANTHROPIC_FOUNDRY_API_KEY: ${{ secrets.ANTHROPIC_FOUNDRY_API_KEY }}
  with:
    use_foundry: "true"
```

Microsoft Entra ID authentication is the recommended path for enterprise CI/CD.

## Documentation structure (per README)

- Solutions Guide — ready-to-use patterns
- Migration Guide — upgrading v0.x → v1.0
- Setup Guide — manual setup, custom GitHub Apps, security
- Usage Guide — basic usage, workflow config
- Custom Automations — automated workflow examples
- Configuration — MCP servers, permissions, env vars
- Cloud Providers — Bedrock/Vertex/Foundry
- Security — access control, permissions, commit signing
- Capabilities & Limitations

## Cross-references

- See [[docs-github-actions]] for the docs counterpart to this repo
- See [[docs-headless]] for the `claude -p` flags that flow through `claude_args`
- See [[news-cwc-sf-2026]] for the conference-context positioning

## Open questions / follow-ups

- The action's `outputs` (structured JSON exposed as GitHub Action outputs) aren't documented inline in the README; the docs page mentions JSON action outputs but doesn't enumerate field names. A small sample workflow with `${{ steps.claude.outputs.* }}` would be useful for the chapter.
- The release cadence (multiple per day) makes the "pin major" recommendation important; the chapter should call this out.
