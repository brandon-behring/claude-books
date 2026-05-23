---
source_url: https://code.claude.com/docs/en/ultrareview
canonical_url: https://code.claude.com/docs/en/ultrareview
source_title: Find bugs with ultrareview
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

# Ultrareview — on-demand multi-agent review for CI

## Key takeaways

- Research preview; Claude Code v2.1.86+. Runs in cloud sandbox (Claude Code on the web infra), NOT locally.
- Two surfaces: `/ultrareview` in interactive sessions; `claude ultrareview [target]` as a CI-compatible subcommand.
- **CI-friendly** semantics: prints findings to stdout, progress to stderr, exits 0 success / 1 failure / 130 on Ctrl-C. `--json` for raw `bugs.json` payload. `--timeout <minutes>` (default 30).
- Pricing: Pro/Max get 3 free runs (one-time allotment); $5–20 per review afterward (via usage credits, NOT included usage).
- Auth: claude.ai account only (not API-key only). NOT available on Bedrock/Vertex/Foundry. NOT available with Zero Data Retention.
- Compared to `/review` (local, single-pass, seconds): ultrareview is multi-agent + independently verified, takes 5–10 minutes, targets pre-merge confidence.

## Quoted (citation-ready)

> "Ultrareview is a deep code review that runs on Claude Code on the web infrastructure. When you run `/ultrareview`, Claude Code launches a fleet of reviewer agents in a remote sandbox to find bugs in your branch or pull request."
>
> — Find bugs with ultrareview, opening
>
> Anchor: `Ultrareview is a deep code review + that runs on Claude Code on the web`

> "Use the `claude ultrareview` subcommand to start an ultrareview from CI or a script without an interactive session. The subcommand launches the same review as `/ultrareview`, blocks until the remote review finishes, prints the findings to stdout, and exits with code 0 on success or 1 on failure."
>
> — Find bugs with ultrareview, "Run ultrareview non-interactively"
>
> Anchor: `Run ultrareview non-interactively + Use the claude ultrareview subcommand`

> "Higher signal: every reported finding is independently reproduced and verified, so the results focus on real bugs rather than style suggestions."
>
> — Find bugs with ultrareview, "Compared to a local /review"
>
> Anchor: `Compared to a local /review + Higher signal`

## CI-mode invocations

```bash
# Review current branch vs default branch (including uncommitted/staged changes)
claude ultrareview

# Review a specific PR
claude ultrareview 1234

# Review against a specific base branch
claude ultrareview origin/main

# JSON output for downstream parsing
claude ultrareview --json

# Custom timeout
claude ultrareview --timeout 60 1234
```

Progress messages + live session URL go to **stderr** (stdout stays parseable).

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Review completed (with or without findings) |
| 1 | Review failed to launch / remote session errored / timeout elapsed |
| 130 | Interrupted with Ctrl-C (remote review keeps running; follow URL in stderr to monitor) |

## Pricing

| Plan | Free runs | After |
|---|---|---|
| Pro | 3 | Usage credits |
| Max | 3 | Usage credits |
| Team / Enterprise | None | Usage credits |

A run counts once the remote session starts (stopped/failed reviews still consume a free run). Paid runs bill only the portion that ran.

## Compared to `/review` (table from docs)

| | `/review` | `/ultrareview` |
|---|---|---|
| Runs | Locally in your session | Remotely in a cloud sandbox |
| Depth | Single-pass | Multi-agent fleet with independent verification |
| Duration | Seconds to a few minutes | ~5–10 minutes |
| Cost | Normal usage | Free runs, then ~$5–20 as usage credits |
| Best for | Quick feedback while iterating | Pre-merge confidence on substantial changes |

## CI gating pattern

> "For automatic reviews on GitHub pull requests, Code Review integrates with your repository directly and posts findings as inline PR comments without a CLI step."
>
> — Find bugs with ultrareview, "Run ultrareview non-interactively"
>
> Anchor: `For automatic reviews on GitHub pull requests + Code Review integrates`

→ Anthropic's positioning: use **Code Review** (managed service) for hands-off PR review; use `claude ultrareview` for explicit CI invocation, e.g., as a release-blocker step before the merge button.

## Cross-references

- See [[docs-code-review]] for the managed always-on GitHub equivalent
- See [[news-security-review]] (when published) for the security-focused command
- See [[docs-cli-reference]] for the `claude ultrareview` subcommand row

## Open questions / follow-ups

- The `bugs.json` schema for `--json` output isn't documented inline. A teardown of a real run would help chapter readers.
- Behavior when called from a `claude -p` non-interactive run (the docs cover the subcommand explicitly but don't describe interaction with `--bare`).
