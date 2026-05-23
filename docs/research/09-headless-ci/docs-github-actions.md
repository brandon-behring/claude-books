---
source_url: https://code.claude.com/docs/en/github-actions
canonical_url: https://code.claude.com/docs/en/github-actions
source_title: Claude Code GitHub Actions
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: headless-ci
tier: T1-official
cert_domains: [3]
cert_task_areas: ["CI/CD integration (`-p` flag, `--output-format json`, `--json-schema`)"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# GitHub Actions integration — the canonical CI surface

## Key takeaways

- Claude Code GitHub Actions is built on the Claude Agent SDK and wraps `claude -p` in a GitHub Action runner. It supports **four providers**: Anthropic direct API, Amazon Bedrock, Google Vertex AI, Microsoft Foundry — the latter three via OIDC / Workload Identity Federation, no static keys.
- Quickest setup: open Claude Code in your terminal and run `/install-github-app`. Requires repo admin to install the GitHub App + add `ANTHROPIC_API_KEY` secret.
- **v1.0 simplifies the interface**: `mode` is auto-detected (no more `mode: "tag"` / `mode: "agent"`); use `prompt` for all instructions and `claude_args` for any CLI passthrough.
- Default model is Sonnet; configure Opus 4.7 with `claude_args: --model claude-opus-4-7`.
- Claude responds to `@claude` mentions in PRs/issues by default; override with `trigger_phrase`.
- For automated reviews **without** a trigger, see the separate managed [[docs-code-review]] service.

## Quoted (citation-ready)

> "Claude Code GitHub Actions brings AI-powered automation to your GitHub workflow. With a simple `@claude` mention in any PR or issue, Claude can analyze your code, create pull requests, implement features, and fix bugs — all while following your project's standards."
>
> — Claude Code GitHub Actions, opening paragraph
>
> Anchor: `Claude Code GitHub Actions + brings AI-powered automation`

> "The easiest way to set up this action is through Claude Code in the terminal. Just open claude and run `/install-github-app`. This command will guide you through setting up the GitHub app and required secrets."
>
> — Claude Code GitHub Actions, "Quick setup"
>
> Anchor: `Quick setup + The easiest way to set up`

> "Claude Code GitHub Actions v1.0 introduces breaking changes that require updating your workflow files in order to upgrade to v1.0 from the beta version."
>
> — Claude Code GitHub Actions, "Upgrading from Beta" warning
>
> Anchor: `Upgrading from Beta + Claude Code GitHub Actions v1.0`

> "The action now automatically detects whether to run in interactive mode (responds to `@claude` mentions) or automation mode (runs immediately with a prompt) based on your configuration."
>
> — Claude Code GitHub Actions, "Before and After Example" tip
>
> Anchor: `The action now automatically detects + interactive mode automation mode`

## Canonical workflow YAML — Basic shape

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          # Responds to @claude mentions in comments
```

## Scheduled / triggered automation shape

```yaml
name: Daily Report
on:
  schedule:
    - cron: "0 9 * * *"
jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Generate a summary of yesterday's commits and open issues"
          claude_args: "--model opus"
```

## PR-event automation with code-review plugin (skill invocation)

```yaml
name: Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          plugin_marketplaces: "https://github.com/anthropics/claude-code.git"
          plugins: "code-review@claude-code-plugins"
          prompt: "/code-review:code-review ${{ github.repository }}/pull/${{ github.event.pull_request.number }}"
```

## Action inputs (v1.0)

| Parameter | Description | Required |
|---|---|---|
| `prompt` | Instructions for Claude (plain text or a skill name like `/skill-name` or `/plugin-name:skill-name`) | No (optional for `@claude` mentions) |
| `claude_args` | CLI arguments passed to Claude Code (`--max-turns 5 --model claude-sonnet-4-6 --mcp-config /path` etc.) | No |
| `plugin_marketplaces` | Newline-separated list of plugin marketplace Git URLs | No |
| `plugins` | Newline-separated list of plugin names to install before execution | No |
| `anthropic_api_key` | Claude API key | Yes for direct API |
| `github_token` | GitHub token for API access | No |
| `trigger_phrase` | Custom trigger phrase (default: `@claude`) | No |
| `use_bedrock` | Use Amazon Bedrock instead of Claude API | No |
| `use_vertex` | Use Google Vertex AI instead of Claude API | No |
| `use_foundry` | Use Microsoft Foundry (per `anthropics/claude-code-action` README) | No |

## Beta → GA migration table (from docs)

| Old beta input | New v1.0 input |
|---|---|
| `mode` | *(Removed — auto-detected)* |
| `direct_prompt` | `prompt` |
| `override_prompt` | `prompt` with GitHub variables |
| `custom_instructions` | `claude_args: --append-system-prompt` |
| `max_turns` | `claude_args: --max-turns` |
| `model` | `claude_args: --model` |
| `allowed_tools` | `claude_args: --allowedTools` |
| `disallowed_tools` | `claude_args: --disallowedTools` |
| `claude_env` | `settings` JSON format |

## Bedrock workflow (OIDC, no static AWS keys)

```yaml
name: Claude PR Action

permissions:
  contents: write
  pull-requests: write
  issues: write
  id-token: write

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]

jobs:
  claude-pr:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    env:
      AWS_REGION: us-west-2
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate GitHub App token
        id: app-token
        uses: actions/create-github-app-token@v2
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}

      - name: Configure AWS Credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}
          aws-region: us-west-2

      - uses: anthropics/claude-code-action@v1
        with:
          github_token: ${{ steps.app-token.outputs.token }}
          use_bedrock: "true"
          claude_args: '--model us.anthropic.claude-sonnet-4-6 --max-turns 10'
```

Required secrets: `AWS_ROLE_TO_ASSUME`, `APP_ID`, `APP_PRIVATE_KEY`. Model IDs include the region prefix (e.g. `us.anthropic.claude-sonnet-4-6`).

## Vertex AI workflow (Workload Identity Federation)

```yaml
name: Claude PR Action

permissions:
  contents: write
  pull-requests: write
  issues: write
  id-token: write

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]

jobs:
  claude-pr:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'issues' && contains(github.event.issue.body, '@claude'))
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate GitHub App token
        id: app-token
        uses: actions/create-github-app-token@v2
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}

      - name: Authenticate to Google Cloud
        id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - uses: anthropics/claude-code-action@v1
        with:
          github_token: ${{ steps.app-token.outputs.token }}
          trigger_phrase: "@claude"
          use_vertex: "true"
          claude_args: '--model claude-sonnet-4-5@20250929 --max-turns 10'
        env:
          ANTHROPIC_VERTEX_PROJECT_ID: ${{ steps.auth.outputs.project_id }}
          CLOUD_ML_REGION: us-east5
          VERTEX_REGION_CLAUDE_4_5_SONNET: us-east5
```

Required secrets: `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`, `APP_ID`, `APP_PRIVATE_KEY`.

## Permissions the Claude GitHub App requests

- **Contents**: Read & Write (modify repo files)
- **Issues**: Read & Write (respond to issues)
- **Pull requests**: Read & Write (create PRs, push changes)

## Best-practice / security guidance from docs

- "Never commit API keys directly to your repository."
- Always reference via `${{ secrets.ANTHROPIC_API_KEY }}`.
- Limit Action permissions to only what's necessary.
- Use issue templates to provide context; keep `CLAUDE.md` concise; configure appropriate timeouts.
- Use specific `@claude` commands to reduce API calls; configure `--max-turns` to prevent excessive iterations; set workflow-level timeouts.

## Customization layer

1. **CLAUDE.md** — repo-root memory file Claude reads for project conventions
2. **Custom prompts** — pass workflow-specific `prompt` input

## Common `@claude` invocations in issues / PR comments

```text
@claude implement this feature based on the issue description
@claude how should I implement user authentication for this endpoint?
@claude fix the TypeError in the user dashboard component
```

## Cross-references

- See [[github-claude-code-action]] for repo metadata + release cadence
- See [[docs-code-review]] for the managed (no-trigger-needed) automated review
- See [[docs-gitlab-ci-cd]] for the GitLab equivalent
- See [[docs-headless]] for the underlying `-p` CLI surface
- See [[news-cwc-sf-2026]] for "CI auto-fix" announcement context

## Open questions / follow-ups

- No public official docs page for `use_foundry`; only the GitHub action README + Microsoft Learn pages. We pulled the env-var pattern from a third-party search summary — verify exact official YAML when Anthropic publishes the Foundry-in-Actions doc.
- The "CI auto-fix" feature announced at Code w/ Claude SF (May 6) currently lives only in a 2026-w15 release-notes entry per Simon Willison; no dedicated `code.claude.com/docs/en/ci-auto-fix` page found. Track for full docs.
