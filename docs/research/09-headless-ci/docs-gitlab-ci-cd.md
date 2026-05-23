---
source_url: https://code.claude.com/docs/en/gitlab-ci-cd
canonical_url: https://code.claude.com/docs/en/gitlab-ci-cd
source_title: Claude Code GitLab CI/CD
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

# GitLab CI/CD integration

## Key takeaways

- Integration is in **beta**, maintained by GitLab (not Anthropic): support tracked at `gitlab.com/gitlab-org/gitlab/-/issues/573776`.
- Three provider options: Claude API (SaaS), Amazon Bedrock (OIDC), Google Vertex AI (Workload Identity Federation).
- Install in your CI image with `curl -fsSL https://claude.ai/install.sh | bash`, then call `claude -p ...` in a job script.
- Uses `AI_FLOW_*` environment variables (e.g. `AI_FLOW_INPUT`, `AI_FLOW_CONTEXT`, `AI_FLOW_EVENT`) populated by note-event webhooks for `@claude` mention triggers.
- Optional GitLab MCP server (`/bin/gitlab-mcp-server`) provides the `mcp__gitlab` tool for opening MRs / commenting from inside the job.
- Auth via `ANTHROPIC_API_KEY` masked variable, or `CI_JOB_TOKEN` / Project Access Token for GitLab API ops.

## Quoted (citation-ready)

> "Each job runs in an isolated container with restricted network access. Claude's changes flow through MRs so reviewers see every diff. Branch protection and approval rules apply to AI-generated code. Claude Code uses workspace-scoped permissions to constrain writes. Costs remain under your control because you bring your own provider credentials."
>
> — Claude Code GitLab CI/CD, "Security and governance"
>
> Anchor: `Security and governance + Each job runs in an isolated container`

> "Event-driven orchestration: GitLab listens for your chosen triggers (for example, a comment that mentions `@claude` in an issue, MR, or review thread). The job collects context from the thread and repository, builds prompts from that input, and runs Claude Code."
>
> — Claude Code GitLab CI/CD, "How it works"
>
> Anchor: `How it works + Event-driven orchestration`

> "Claude Code for GitLab CI/CD is currently in beta. Features and functionality may evolve as we refine the experience. This integration is maintained by GitLab."
>
> — Claude Code GitLab CI/CD, Info banner
>
> Anchor: `Claude Code for GitLab CI/CD + currently in beta`

## Canonical .gitlab-ci.yml (Claude API)

```yaml
stages:
  - ai

claude:
  stage: ai
  image: node:24-alpine3.21
  rules:
    - if: '$CI_PIPELINE_SOURCE == "web"'
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
  variables:
    GIT_STRATEGY: fetch
  before_script:
    - apk update
    - apk add --no-cache git curl bash
    - curl -fsSL https://claude.ai/install.sh | bash
  script:
    - /bin/gitlab-mcp-server || true
    - >
      claude
      -p "${AI_FLOW_INPUT:-'Summarize recent changes and suggest improvements'}"
      --permission-mode acceptEdits
      --allowedTools "Bash Read Edit Write mcp__gitlab"
      --debug
  # Claude Code will use ANTHROPIC_API_KEY from CI/CD variables
```

## Amazon Bedrock (OIDC) — distinctive parts

- Exchanges `CI_JOB_JWT_V2` for temporary AWS creds with `aws sts assume-role-with-web-identity`.
- Required vars: `AWS_ROLE_TO_ASSUME`, `AWS_REGION`.
- Model IDs include region prefix (e.g. `us.anthropic.claude-sonnet-4-6`).

```yaml
claude-bedrock:
  stage: ai
  image: node:24-alpine3.21
  rules:
    - if: '$CI_PIPELINE_SOURCE == "web"'
  before_script:
    - apk add --no-cache bash curl jq git python3 py3-pip
    - pip install --no-cache-dir awscli
    - curl -fsSL https://claude.ai/install.sh | bash
    - export AWS_WEB_IDENTITY_TOKEN_FILE="${CI_JOB_JWT_FILE:-/tmp/oidc_token}"
    - if [ -n "${CI_JOB_JWT_V2}" ]; then printf "%s" "$CI_JOB_JWT_V2" > "$AWS_WEB_IDENTITY_TOKEN_FILE"; fi
    - >
      aws sts assume-role-with-web-identity
      --role-arn "$AWS_ROLE_TO_ASSUME"
      --role-session-name "gitlab-claude-$(date +%s)"
      --web-identity-token "file://$AWS_WEB_IDENTITY_TOKEN_FILE"
      --duration-seconds 3600 > /tmp/aws_creds.json
    - export AWS_ACCESS_KEY_ID="$(jq -r .Credentials.AccessKeyId /tmp/aws_creds.json)"
    - export AWS_SECRET_ACCESS_KEY="$(jq -r .Credentials.SecretAccessKey /tmp/aws_creds.json)"
    - export AWS_SESSION_TOKEN="$(jq -r .Credentials.SessionToken /tmp/aws_creds.json)"
  script:
    - /bin/gitlab-mcp-server || true
    - >
      claude
      -p "${AI_FLOW_INPUT:-'Implement the requested changes and open an MR'}"
      --permission-mode acceptEdits
      --allowedTools "Bash Read Edit Write mcp__gitlab"
      --debug
  variables:
    AWS_REGION: "us-west-2"
```

## Google Vertex AI (Workload Identity Federation) — distinctive parts

- Uses `gcloud auth login --cred-file=<(...)` with `external_account` JSON config.
- Required vars: `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`, `CLOUD_ML_REGION`.

## Security and governance (per docs)

- Each job runs in isolated container with restricted network access
- Claude's changes flow through MRs — reviewers see every diff
- Branch protection / approval rules apply to AI-generated code
- Workspace-scoped permissions constrain writes
- Customer brings provider credentials → cost control

## Common parameters / variables called out

- `prompt` / `prompt_file` — inline (`-p`) or via file
- `max_turns` — limit iterations
- `timeout_minutes` — total execution cap
- `ANTHROPIC_API_KEY` — required for Claude API (not used for Bedrock/Vertex)
- Provider-specific: `AWS_REGION`, GCP project/region vars

> "Exact flags and parameters may vary by version of `@anthropic-ai/claude-code`. Run `claude --help` in your job to see supported options."
>
> — Claude Code GitLab CI/CD, "Common parameters and variables"
>
> Anchor: `Common parameters and variables + Exact flags and parameters may vary`

## Cross-references

- See [[docs-github-actions]] for the GitHub equivalent (Anthropic-maintained)
- See [[docs-headless]] for the underlying `claude -p` semantics

## Open questions / follow-ups

- The docs reference `AI_FLOW_INPUT`, `AI_FLOW_CONTEXT`, `AI_FLOW_EVENT` as variables populated by webhook listeners — no link to a reference event-listener implementation. GitLab community may have one but it's not in the official docs.
- `gitlab-mcp-server` is invoked as `/bin/gitlab-mcp-server || true` — no canonical docs page on its tool surface; we'll need to chase the GitLab-side issue tracker.
