---
source_url: https://code.claude.com/docs/en/code-review
canonical_url: https://code.claude.com/docs/en/code-review
source_title: Code Review
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: headless-ci
tier: T1-official
cert_domains: [3]
cert_task_areas: ["CI/CD integration (`-p` flag, `--output-format json`, `--json-schema`)"]
volatility: fast-moving
verified: true
supersedes: []
superseded_by: []
---

# Code Review — managed multi-agent PR review

## Key takeaways

- Managed service: a fleet of specialized agents reviews diffs in the context of the full codebase looking for logic errors, security vulnerabilities, broken edge cases, subtle regressions.
- **Research preview**, **Team & Enterprise only** — NOT available with Zero Data Retention.
- Three trigger modes per repo: Once after PR creation / After every push / Manual (`@claude review` or `@claude review once`).
- Findings tagged 🔴 Important / 🟡 Nit / 🟣 Pre-existing, posted as inline comments. Check run is always neutral conclusion — never blocks merging through branch protection.
- Customizable via repo files: `CLAUDE.md` (general project context, violations → Nit) and `REVIEW.md` (review-only, injected as highest-priority).
- Average review = $15–25, ~20 minutes; billed via usage credits (NOT plan-included usage). Spend cap configurable.
- Findings include a **machine-readable comment** in the check run text: parse with `gh` + `jq` to gate merges in your own CI.

## Quoted (citation-ready)

> "Code Review analyzes your GitHub pull requests and posts findings as inline comments on the lines of code where it found issues. A fleet of specialized agents examine the code changes in the context of your full codebase, looking for logic errors, security vulnerabilities, broken edge cases, and subtle regressions."
>
> — Code Review, opening paragraph
>
> Anchor: `Code Review + analyzes your GitHub pull requests`

> "When a review runs, multiple agents analyze the diff and surrounding code in parallel on Anthropic infrastructure. Each agent looks for a different class of issue, then a verification step checks candidates against actual code behavior to filter out false positives. The results are deduplicated, ranked by severity, and posted as inline comments on the specific lines where issues were found, with a summary in the review body."
>
> — Code Review, "How reviews work"
>
> Anchor: `How reviews work + When a review runs`

> "The check run always completes with a neutral conclusion so it never blocks merging through branch protection rules. If you want to gate merges on Code Review findings, read the severity breakdown from the check run output in your own CI."
>
> — Code Review, "Check run output"
>
> Anchor: `Check run output + The check run always completes with a neutral conclusion`

> "Code Review is in research preview, available for Team and Enterprise subscriptions. It is not available for organizations with Zero Data Retention enabled."
>
> — Code Review, top-of-page Note
>
> Anchor: `Code Review is in research preview + Team and Enterprise`

## Severity tags

| Marker | Severity | Meaning |
|---|---|---|
| 🔴 | Important | A bug that should be fixed before merging |
| 🟡 | Nit | A minor issue, worth fixing but not blocking |
| 🟣 | Pre-existing | A bug that exists in the codebase but was not introduced by this PR |

## Trigger mode comparison

| Mode | Behavior | Cost shape |
|---|---|---|
| Once after PR creation | Review fires when PR opens / marked ready | 1 review per PR |
| After every push | Re-reviews on each push; auto-resolves threads when issues fixed | × push count |
| Manual | Only when `@claude review` (subscribes to push) or `@claude review once` (one-off) commented | On demand |

## Machine-readable check-run gate

```bash
gh api repos/OWNER/REPO/check-runs/CHECK_RUN_ID \
  --jq '.output.text | split("bughunter-severity: ")[1] | split(" -->")[0] | fromjson'
```

Returns `{"normal": 2, "nit": 1, "pre_existing": 0}` — `normal` is the Important count; non-zero means at least one bug worth fixing before merge.

## Customization files

| File | Scope | How Code Review treats it |
|---|---|---|
| `CLAUDE.md` | Shared project memory (used by all Claude Code tasks) | Read as project context; newly-introduced violations flagged as Nit |
| `REVIEW.md` | Review-only | Injected verbatim into every reviewer agent's system prompt as **highest-priority instruction block** |

**`REVIEW.md` tunable patterns** (per docs):
1. **Severity recalibration** — what counts as 🔴 vs 🟡 in this repo
2. **Nit volume cap** — "report at most 5 nits, mention the rest as a count"
3. **Skip rules** — paths, branches, finding categories to ignore (lockfiles, generated code, vendored deps, anything CI already enforces)
4. **Repo-specific checks** — e.g. "new API routes must have an integration test"
5. **Verification bar** — require evidence before posting a class of finding
6. **Re-review convergence** — "after the first review, suppress new nits and post Important findings only"
7. **Summary shape** — e.g. open with `2 factual, 4 style` tally

Important: `@` import syntax is NOT expanded in `REVIEW.md`; it's pasted verbatim. Long files dilute high-priority rules.

## Example `REVIEW.md` (from docs)

```markdown
# Review instructions

## What Important means here

Reserve Important for findings that would break behavior, leak data,
or block a rollback: incorrect logic, unscoped database queries, PII
in logs or error messages, and migrations that aren't backward
compatible. Style, naming, and refactoring suggestions are Nit at
most.

## Cap the nits

Report at most five Nits per review. If you found more, say "plus N
similar items" in the summary instead of posting them inline. If
everything you found is a Nit, lead the summary with "No blocking
issues."

## Do not report

- Anything CI already enforces: lint, formatting, type errors
- Generated files under `src/gen/` and any `*.lock` file
- Test-only code that intentionally violates production rules

## Always check

- New API routes have an integration test
- Log lines don't include email addresses, user IDs, or request bodies
- Database queries are scoped to the caller's tenant
```

## Pricing surface

- Average $15–25 per review (scales with PR size + codebase complexity)
- Billed against **usage credits**, NOT included plan usage
- Monthly spend cap configurable at `claude.ai/admin-settings/usage`
- When cap hit, single comment posted on PR; reviews resume next billing period or when admin raises cap

## Setup flow (admin)

1. `claude.ai/admin-settings/claude-code` → Code Review section → **Setup**
2. Install Claude GitHub App (Contents: r/w; Issues: r/w; Pull requests: r/w)
3. Select repositories
4. Per-repo **Review Behavior** dropdown: Once / After every push / Manual

## Self-hosted alternative

> "To run Claude in your own CI infrastructure instead of this managed service, see GitHub Actions or GitLab CI/CD."
>
> — Code Review, page intro
>
> Anchor: `To run Claude in your own CI infrastructure + this managed service`

## Cross-references

- See [[docs-github-actions]] for the self-hosted equivalent
- See [[docs-gitlab-ci-cd]] for GitLab self-hosted reviews
- See [[news-cwc-sf-2026]] for "used by every team at Anthropic" announcement
- See [[docs-ultrareview]] for the on-demand local equivalent
- See [[news-security-review]] for the security-focused sibling

## Open questions / follow-ups

- How "verification step" works under the hood (the docs describe it but don't expose the agent architecture).
- Whether Code Review honors `--max-turns` limits per agent.
- Whether GitHub Enterprise Server self-hosted is fully supported (page mentions it but doesn't link a dedicated guide).
