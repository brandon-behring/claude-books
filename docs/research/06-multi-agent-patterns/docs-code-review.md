---
source_url: https://code.claude.com/docs/en/code-review
canonical_url: https://code.claude.com/docs/en/code-review
source_title: Code Review
fetched_at: 2026-05-23
last_verified_at: 2026-05-23
topic: multi-agent-patterns
tier: T1-official
cert_domains: [4]
cert_task_areas:
  - "Multi-instance / multi-pass review (independent reviewers, attention dilution)"
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Claude Code Docs — Code Review (multi-agent PR review)

The official docs page for Anthropic's managed Code Review product (Code w/ Claude SF 2026 launch, research preview for Team / Enterprise). The architecture is the canonical Anthropic-authored example of **multi-instance review with parallel independent reviewers + a verification pass to filter false positives**, run on Anthropic infrastructure against GitHub PRs. Each reviewer agent is specialized to a different class of issue; the fleet runs in parallel; findings are deduplicated and ranked. This is the productized form of the "have one Claude write while another reviews" pattern from the Best Practices doc — formalized as a fleet, not a pair.

## Key takeaways

- **Multi-agent parallel review architecture**: when a review runs, *multiple agents analyze the diff and surrounding code in parallel on Anthropic infrastructure*, **each agent looking for a different class of issue**. This is the architectural answer to attention dilution — instead of asking one Claude to find every bug class, you fan out to a fleet of specialists.
- **Two-stage pipeline**: parallel candidate-finding agents → **a verification step checks candidates against actual code behavior to filter out false positives** → dedupe + severity ranking → inline PR comments. The verification pass is the explicit defense against multi-agent false-positive accumulation.
- **`@claude review once`** is the canonical "fresh independent review" trigger: starts a single review on demand without subscribing to push-triggered reviews. Use it for *a one-off second opinion without changing the PR's review behavior* — the docs frame this as the way to get an independent second-opinion pass.
- **Per-PR re-review on every push** is also a supported mode (auto-resolves threads when the issue is fixed) — the multi-pass pattern is the default, not a one-off.
- **`REVIEW.md`** is *injected into the system prompt of every agent in the review pipeline as the highest-priority instruction block* — the docs make explicit that there is no single review prompt; the same instructions are broadcast to all parallel reviewers.
- **Attention-dilution mitigation in REVIEW.md guidance**: the docs explicitly call out *"a long REVIEW.md dilutes the rules that matter most"* — Anthropic's own framing of attention dilution as a tunable axis.
- **Re-review convergence pattern**: the docs suggest an instruction like *"after the first review, suppress new nits and post Important findings only"* — explicit multi-pass-convergence guidance to prevent one-line fixes from reaching round seven on style alone.
- **Findings include collapsible extended reasoning sections** showing *why Claude flagged the issue and how it verified the problem* — the verification step's reasoning is exposed per-finding for human auditability.
- **Each review averages \$15-25** and **completes in 20 minutes on average**, scaling with PR size and how many issues require verification. The cost is the empirical floor for fleet-based multi-pass review at production quality.
- **Severity tagging is three-tier**: 🔴 Important (bug, fix before merge) / 🟡 Nit (worth fixing, not blocking) / 🟣 Pre-existing (in codebase, not introduced by PR). The third class is a multi-agent-specific affordance — fresh-context reviewers can't trivially distinguish PR-introduced bugs from background bugs without the git-history-aware classifier.
- **Restricted compatibility**: research preview, Team / Enterprise subscriptions only, **not available for ZDR organizations**. This is a managed service, not a self-host pattern (for self-host, the docs point to GitHub Actions / GitLab CI/CD / GitHub Enterprise Server).

## Quoted (citation-ready)

> "When a review runs, multiple agents analyze the diff and surrounding code in parallel on Anthropic infrastructure. Each agent looks for a different class of issue, then a verification step checks candidates against actual code behavior to filter out false positives."
>
> — Code Review, How reviews work
>
> Anchor: `How reviews work + "Once an admin enables Code Review for"`

> "The results are deduplicated, ranked by severity, and posted as inline comments on the specific lines where issues were found, with a summary in the review body."
>
> — Code Review, How reviews work
>
> Anchor: `How reviews work + "When a review runs, multiple"`

> "Code Review analyzes your GitHub pull requests and posts findings as inline comments on the lines of code where it found issues. A fleet of specialized agents examine the code changes in the context of your full codebase, looking for logic errors, security vulnerabilities, broken edge cases, and subtle regressions."
>
> — Code Review, (page intro)
>
> Anchor: `(intro) + "Code Review analyzes your GitHub"`

> "To request a fresh review without pushing, comment `@claude review once` as a top-level PR comment."
>
> — Code Review, Rate and reply to findings
>
> Anchor: `Rate and reply to findings + "Replying to an inline comment"`

> "Use `@claude review once` when you want feedback on the current state of a PR but don't want every subsequent push to incur a review. This is useful for long-running PRs with frequent pushes, or when you want a one-off second opinion without changing the PR's review behavior."
>
> — Code Review, Manually trigger reviews
>
> Anchor: `Manually trigger reviews + "Two comment commands start a review"`

> "`REVIEW.md` is a file at your repository root that overrides how Code Review behaves on your repo. Its contents are injected into the system prompt of every agent in the review pipeline as the highest-priority instruction block, taking precedence over the default review guidance."
>
> — Code Review, REVIEW.md
>
> Anchor: `REVIEW.md + "REVIEW.md is a file at your"`

> "Length has a cost: a long `REVIEW.md` dilutes the rules that matter most. Keep it to instructions that change review behavior, and leave general project context in `CLAUDE.md`."
>
> — Code Review, Keep it focused
>
> Anchor: `Keep it focused + "Length has a cost"`

> "Re-review convergence: tell Claude how to behave when a PR has already been reviewed. A rule like 'after the first review, suppress new nits and post Important findings only' stops a one-line fix from reaching round seven on style alone."
>
> — Code Review, What you can tune
>
> Anchor: `What you can tune + "Re-review convergence"`

> "Findings include a collapsible extended reasoning section you can expand to understand why Claude flagged the issue and how it verified the problem."
>
> — Code Review, Severity levels
>
> Anchor: `Severity levels + "Each finding is tagged with"`

## Multi-pass / multi-instance architecture (mechanism)

1. **Trigger**: PR open / push / `@claude review` / `@claude review once`. Different triggers map to different multi-pass cadences.
2. **Fan-out**: a *fleet of specialized agents* runs in parallel. Each agent is told (via injected `REVIEW.md` + default review prompt + per-agent class assignment) to look for a single class of issue: logic errors, security vulnerabilities, broken edge cases, subtle regressions, `CLAUDE.md` compliance, etc. Each agent operates on the diff + surrounding code context.
3. **Verification pass**: candidate findings from the parallel agents are then checked against actual code behavior. False positives are filtered. This is the explicit countermeasure against the typical multi-agent failure mode of "all reviewers flag plausible-looking but wrong issues."
4. **Dedupe + rank**: surviving findings are deduplicated (multiple specialists may have spotted the same bug from different angles) and ranked by severity (Important / Nit / Pre-existing).
5. **Post**: inline comments on the lines where issues were found + a check run summary table + Files-changed-tab annotations. Triple-channel posting handles cases where GitHub rejects an inline comment on a line that moved.
6. **Re-review on push**: in push-triggered mode, the next run resolves threads when the issue is fixed (idempotent multi-pass convergence). Authors can also tune the convergence behavior via `REVIEW.md` ("after the first review, suppress new nits").

The architecture matters for cert-task-area framing: this is a worked example of how Anthropic deploys multi-instance review **as a product**, not just as a recommended pattern.

## Tuning levers documented in `REVIEW.md`

| Lever | What it does | Anti-attention-dilution role |
|---|---|---|
| **Severity** redefinition | Re-calibrate Important / Nit thresholds per repo | Stops agents from over-flagging in low-stakes repos |
| **Nit volume cap** | "Report at most five nits" | Prevents per-PR comment-spam from parallel agents |
| **Skip rules** | Paths / branches / categories to ignore | Removes load from agents on auto-generated code |
| **Repo-specific checks** | "New API routes must have an integration test" | Pinned high-priority instructions land more reliably than CLAUDE.md |
| **Verification bar** | "Behavior claims need a `file:line` citation, not an inference" | Empirical guardrail against fabricated findings |
| **Re-review convergence** | "After first review, only post Important findings" | Multi-pass convergence rule for long PRs |
| **Summary shape** | One-line tally, lead with "no factual issues" when true | Forces the multi-agent fleet into a single readable summary |

## Cross-references

- See [[blog-multi-agent-research-system]] for the canonical Anthropic-authored multi-agent architecture (lead + subagents, isolated contexts, artifact pattern) that Code Review productizes for the PR-review use case.
- See [[blog-when-to-use-multi-agent]] for the decision framework (when to reach for multi-agent vs single-agent + Tool Search).
- See [[docs-best-practices-writer-reviewer]] for the local-pair Writer/Reviewer pattern this fleet-scale architecture generalizes.
- See [[blog-claude-managed-agents]] for the broader Claude Managed Agents productization line that Code Review fits into.
- See [`/Users/brandonbehring/claude-books/docs/research/06-multi-agent-patterns/news-code-w-claude-sf-2026.md`](./news-code-w-claude-sf-2026.md) for the launch context if present.

## Open questions / follow-ups

- **Exact agent count and class taxonomy**: the docs say "a fleet" and "each agent looks for a different class of issue" but don't enumerate the classes or count. The web-search snippet for `code.claude.com/docs/en/code-review` mentioned *five independent reviewers* with specific classes (CLAUDE.md compliance, bug detection, git-history context, previous PR comment review, code comment verification) but those specifics are not in the current docs page text. Possible upstream drift between web-indexed and current docs — verify if a more detailed architecture page surfaces.
- **Verification-step model**: is the verification pass a separate model class (e.g., a smaller / different-trained verifier) or the same general Claude model with a different prompt? Not stated.
- **Dedupe algorithm**: how are candidate findings from different specialists matched as duplicates? Token-level fuzzy match? Embedding-similarity? Not stated.
- **Latency vs cost trade-off**: 20 minutes on average for a \$15-25 review is the headline number. How does this scale on a 5,000-line PR vs a 50-line PR? Not quantified.
- **Self-hostable equivalent**: the docs point to GitHub Actions / GitLab CI/CD for self-hosted but those are single-agent. Is there a published recipe for replicating the multi-agent fleet on your own infra? Likely a chapter or follow-up post.
- **Conflict with Outcomes / Outcome-Grader**: Claude Managed Agents documents a *grader is independent and stateless, running in its own context window so it cannot be influenced by the writer*. The Code Review verification step has the same shape — are they the same primitive? Verify when reading the Outcomes docs.
