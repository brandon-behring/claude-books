---
source_url: https://www.anthropic.com/news/automate-security-reviews-with-claude-code
canonical_url: https://claude.com/blog/automate-security-reviews-with-claude-code
source_title: Automate security reviews with Claude Code
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: headless-ci
tier: T1-official
cert_domains: [3]
cert_task_areas: ["CI/CD integration (`-p` flag, `--output-format json`, `--json-schema`)"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Automate security reviews with Claude Code

## Key takeaways

- Two surfaces: `/security-review` slash command (ad-hoc in-terminal) and a GitHub Action for automated PR scanning.
- Targets common vuln classes: SQL injection, XSS, authn/authz flaws, insecure data handling, dependency vulns.
- Workflow: scan → propose fixes → developer requests Claude to implement them.
- Anthropic's internal use surfaced a remote code execution vuln exploitable via DNS rebinding and SSRF attacks **before code merged**.
- Multi-stage verification: Claude finds a candidate issue, then re-examines it **adversarially** before surfacing — the same verification pattern as the multi-agent Code Review service.
- Distinct from the managed Code Review service (this is the security-focused sibling).

## Quoted (citation-ready)

> "Claude Code introduces two security-focused capabilities to help developers identify and fix vulnerabilities: a `/security-review` command for ad-hoc analysis, and an automated GitHub Action for pull request reviews."
>
> — Automate security reviews with Claude Code, "Feature Overview"
>
> Anchor: `Feature Overview + Claude Code introduces two security-focused capabilities`

> "Anthropic describes it as reading code the way a human security researcher would: understanding how components interact, tracing how data moves through your application, and catching complex vulnerabilities that rule-based tools miss. Each vulnerability goes through what Anthropic calls a multi-stage verification process. Claude identifies an issue, then re-examines its own finding adversarially, attempting to prove or disprove it before surfacing it to analysts."
>
> — Code w/ Claude SF coverage reporting on the blog post
>
> Anchor: `human security researcher + understanding how components interact`

> "Anthropic's team used these features internally and caught critical vulnerabilities, including a remote code execution vulnerability exploitable through DNS rebinding and SSRF attacks before code merged."
>
> — Automate security reviews with Claude Code, "Real-World Impact"
>
> Anchor: `Real-World Impact + Anthropic's team used these features internally`

## Vuln classes the `/security-review` command checks

- SQL injection
- Cross-site scripting (XSS)
- Authentication / authorization flaws
- Insecure data handling
- Dependency vulnerabilities

## Usage flow

1. Developer runs `/security-review` in their terminal session before committing
2. Claude scans cwd for vuln patterns
3. Developer asks Claude to implement fixes for each identified issue

## GitHub Action surface

- Triggers automatically on PR open
- Reviews code changes for security concerns
- Customizable filters to reduce false positives
- Posts inline comments with vulnerability details + recommendations
- Goal: "creates a consistent security review process across your entire team, ensuring no code reaches production without a baseline security review"

## Cross-references

- See [[docs-code-review]] for the general-purpose managed PR review (Code Review tagger 🔴/🟡/🟣)
- See [[docs-ultrareview]] for the user-invoked deep-review variant
- See [[news-cwc-sf-2026]] for the broader Code w/ Claude SF announcement context
- See [[../10-reliability-governance/]] (when published) for how this fits the compliance picture

## Open questions / follow-ups

- No dedicated `code.claude.com/docs/en/security-review` page was found in the docs index at fetch time (only blog post + Snyk/Stackhawk third-party coverage). If/when published, prefer the docs page over the blog as canonical reference.
- The GitHub Action workflow YAML for `/security-review` isn't quoted in the blog post; the action shape likely matches `claude-code-action@v1` with a security-review skill invocation. Confirm canonical example.
