---
source_url: https://code.claude.com/docs/en/model-config
canonical_url: https://code.claude.com/docs/en/model-config
source_title: Model configuration
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-code-internals
tier: T1-official
cert_domains: [3]
cert_task_areas: ["CLAUDE.md hierarchy", "Iterative refinement"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Model configuration — aliases, effort levels, opusplan, model overrides

How Claude Code resolves the active model and effort level. Cross-references settings hierarchy ([[docs-settings]]), CLAUDE.md ([[docs-memory]]), and the effort field on skills/subagents.

## Key takeaways

- **Eight model aliases**: `default`, `best`, `sonnet`, `opus`, `haiku`, `sonnet[1m]`, `opus[1m]`, **`opusplan`** (uses Opus in plan mode, switches to Sonnet for execution).
- **On Anthropic API and Claude Platform on AWS**, `opus` resolves to **Opus 4.7**, `sonnet` to **Sonnet 4.6**. On Bedrock / Vertex / Foundry, `opus` is **Opus 4.6**, `sonnet` is **Sonnet 4.5** — set `ANTHROPIC_DEFAULT_OPUS_MODEL` to override.
- **Five-level effort precedence** for setting the active model:
  1. `/model <alias|name>` during session (since v2.1.144, session-only; press `d` to save as default)
  2. `claude --model <alias|name>` at startup
  3. `ANTHROPIC_MODEL` environment variable
  4. `model` field in settings file (with managed > local > project > user priority)
- **Effort levels per model**: Opus 4.7 = `low/medium/high/xhigh/max`; Opus 4.6 + Sonnet 4.6 = `low/medium/high/max`. Default since v2.1.117: `xhigh` on Opus 4.7, `high` on Opus 4.6 / Sonnet 4.6. **`max` is session-only** (except when set via `CLAUDE_CODE_EFFORT_LEVEL` env).
- **`ultrathink` keyword** in any prompt triggers deeper reasoning for that turn without changing session effort. Other phrases like "think hard" are passed through as ordinary prompt text and **not** recognized as keywords.
- **`availableModels` allowlist** (managed-only enforcement): restricts what `/model`, `--model`, and `ANTHROPIC_MODEL` can select. The Default option in the picker is **never restricted** — it always resolves to the user's tier default. To fully control: combine `model` (initial selection) + `availableModels` (allowlist) + `ANTHROPIC_DEFAULT_*_MODEL` env (pin Default resolution).
- **`opusplan`**: plan-mode Opus phase runs with **standard 200K context**; the automatic 1M upgrade applies to the `opus` alias only, **not** to `opusplan`.
- **Adaptive thinking** is always-on for Opus 4.7 (cannot be disabled). For Opus 4.6 / Sonnet 4.6, `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING=1` reverts to fixed thinking budget controlled by `MAX_THINKING_TOKENS`.

## Quoted (citation-ready)

> "On the Anthropic API and Claude Platform on AWS, `opus` resolves to Opus 4.7 and `sonnet` resolves to Sonnet 4.6. On Bedrock, Vertex, and Foundry, `opus` resolves to Opus 4.6 and `sonnet` resolves to Sonnet 4.5; newer models are available on those providers by selecting the full model name explicitly or setting `ANTHROPIC_DEFAULT_OPUS_MODEL` or `ANTHROPIC_DEFAULT_SONNET_MODEL`."
>
> — Model configuration, Model aliases
>
> Anchor: `Model aliases + On the Anthropic API and Claude Platform on AWS`

> "When `availableModels` is set, users cannot switch to models not in the list via `/model`, `--model` flag, or `ANTHROPIC_MODEL` environment variable. ... The Default option in the model picker is not affected by `availableModels`. It always remains available and represents the system's runtime default."
>
> — Model configuration, Restrict model selection / Default model behavior
>
> Anchor: `Restrict model selection + Default option in the model picker is not affected`

> "The `opusplan` model alias provides an automated hybrid approach: **In plan mode** — Uses `opus` for complex reasoning and architecture decisions. **In execution mode** — Automatically switches to `sonnet` for code generation and implementation."
>
> — Model configuration, `opusplan` model setting
>
> Anchor: `opusplan model setting + opusplan model alias provides an automated hybrid approach`

## Model alias reference

| Alias | Resolves to (Anthropic API) | Resolves to (Bedrock/Vertex/Foundry) | Notes |
|---|---|---|---|
| `default` | Tier default (Opus 4.7 on Max/Team Premium, Sonnet 4.6 on Pro/Team Std/Enterprise/API, Sonnet 4.5 on third-party) | Sonnet 4.5 | Special value clears any override |
| `best` | Opus 4.7 | Opus 4.6 | Equivalent to `opus` |
| `sonnet` | Sonnet 4.6 | Sonnet 4.5 | Daily coding tasks |
| `opus` | Opus 4.7 | Opus 4.6 | Complex reasoning |
| `haiku` | Haiku | Haiku | Fast/cheap |
| `sonnet[1m]` | Sonnet with 1M context | Sonnet 4.5 1M | Long sessions |
| `opus[1m]` | Opus with 1M context | Opus 4.6 1M | Long sessions |
| `opusplan` | Opus (plan) → Sonnet (execute) | Same | **No 1M upgrade** |

**Opus 4.7 requires Claude Code v2.1.111 or later.**

## Effort level reference

| Level | Recommended use |
|---|---|
| `low` | Short, scoped, latency-sensitive tasks; not intelligence-sensitive |
| `medium` | Cost-sensitive work; can trade off some intelligence |
| `high` | Minimum for intelligence-sensitive work; balances tokens and intelligence |
| `xhigh` | Best results for most coding and agentic tasks. **Recommended default on Opus 4.7** |
| `max` | Demanding tasks; diminishing returns and prone to overthinking. Test before adopting broadly. **Session-only** unless set via `CLAUDE_CODE_EFFORT_LEVEL` env |

**Effort precedence (highest to lowest)**:
1. `CLAUDE_CODE_EFFORT_LEVEL` env var
2. Configured `effortLevel` in settings
3. Model default

Frontmatter `effort` on a skill or subagent applies when that component is active, overriding session level but not the env var.

## How to set the model

1. `/model <alias|name>` — **session only** as of v2.1.144; press `d` on row in picker to save to user settings
2. `claude --model <alias|name>` — startup, session-only
3. `ANTHROPIC_MODEL=<alias|name>` — startup, session-only
4. `model` field in settings file — persistent default

Resumed sessions (`--resume`, `--continue`, `/resume`) **keep the model they used when the transcript was saved**, regardless of the current `model` setting. If that model has been retired, the session falls through to the normal precedence order.

When the active model at startup comes from project or managed settings rather than your own selection, the startup header shows which settings file set it.

## `modelOverrides` setting (provider-specific routing)

```json
{
  "modelOverrides": {
    "claude-opus-4-7": "arn:aws:bedrock:us-east-2:123456789012:application-inference-profile/opus-prod",
    "claude-sonnet-4-6": "arn:aws:bedrock:us-east-2:123456789012:application-inference-profile/sonnet-prod"
  }
}
```

- Keys must be Anthropic model IDs (date suffix exact if present).
- On Bedrock, overrides take precedence over auto-discovered inference profiles.
- Values from `ANTHROPIC_MODEL` / `--model` / `ANTHROPIC_DEFAULT_*_MODEL` env are **not** transformed by `modelOverrides`.
- `availableModels` is evaluated against the Anthropic model ID, not the override value.

## Custom model option

```bash
export ANTHROPIC_CUSTOM_MODEL_OPTION="my-gateway/claude-opus-4-7"
export ANTHROPIC_CUSTOM_MODEL_OPTION_NAME="Opus via Gateway"
export ANTHROPIC_CUSTOM_MODEL_OPTION_DESCRIPTION="Internal LLM gateway"
```

Adds an entry to `/model` picker without replacing built-in aliases. Skipped validation; useful for gateway-routed deployments.

## Pinned model capabilities declaration (third-party providers)

For Bedrock / Vertex / Foundry, set `ANTHROPIC_DEFAULT_*_MODEL_SUPPORTED_CAPABILITIES`:

| Capability | Enables |
|---|---|
| `effort` | Effort levels and `/effort` command |
| `xhigh_effort` | The `xhigh` level (v2.1.111+) |
| `max_effort` | The `max` level |
| `thinking` | Extended thinking |
| `adaptive_thinking` | Adaptive reasoning |
| `interleaved_thinking` | Thinking between tool calls |

When set, listed capabilities are enabled and unlisted are disabled. When unset, Claude Code falls back to built-in detection based on model ID pattern.

## Extended context (1M)

- **Opus 4.7, Opus 4.6, Sonnet 4.6** support 1M context window.
- Max/Team/Enterprise: Opus 1M included with subscription; Sonnet 1M requires usage credits.
- Pro: both require usage credits.
- API / pay-as-you-go: full access.
- Append `[1m]` to alias or full model name (e.g., `/model opus[1m]`, `claude-opus-4-7[1m]`).
- For pinned models: `export ANTHROPIC_DEFAULT_OPUS_MODEL='claude-opus-4-7[1m]'` — applies to all uses of that alias including `opusplan`.
- Disable globally with `CLAUDE_CODE_DISABLE_1M_CONTEXT=1`.

## Prompt caching environment variables

| Env var | Effect |
|---|---|
| `DISABLE_PROMPT_CACHING` | Disable caching for all models |
| `DISABLE_PROMPT_CACHING_HAIKU` | Haiku only |
| `DISABLE_PROMPT_CACHING_SONNET` | Sonnet only |
| `DISABLE_PROMPT_CACHING_OPUS` | Opus only |

## Cross-references

- See [[docs-settings]] for `model`, `effortLevel`, `availableModels`, `modelOverrides`, `claudeMdExcludes` settings.
- See [[docs-skills]] for the `model` and `effort` frontmatter fields that override the session setting.
- See [[docs-sub-agents]] for `model` and `effort` on subagent definitions.
- See [[docs-permission-modes]] — `opusplan` interacts with plan mode.
- See [[../05-claude-api/]] for the underlying API-side `claude-opus-4-7` model.

## Open questions / follow-ups

- Whether the `default` model can be coerced via `ANTHROPIC_DEFAULT_*_MODEL` for the user-tier auto-default mechanism, or whether tier defaults are entirely server-side.
- Behavior when `availableModels` is set but `model` is set to a model not in the list — implied to fall through but not explicit.
