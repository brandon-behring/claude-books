---
source_url: https://www.anthropic.com/engineering/april-23-postmortem
canonical_url: https://www.anthropic.com/engineering/april-23-postmortem
source_title: An update on recent Claude Code quality reports
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: reliability-governance
tier: T1-official
cert_domains: [3, 4, 5]
cert_task_areas:
  - Error propagation across multi-agent systems (structured error context)
  - Human review workflows + confidence calibration
  - Long-conversation context (progressive summarization risks, lost-in-the-middle)
  - Validation, retry, feedback loops (semantic vs schema errors)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Anthropic engineering — April 23 postmortem (canonical home)

This is the canonical postmortem note for the three-bug Claude Code quality incident. The brief multi-agent cross-reference lives at [[blog-april-23-postmortem-stub]] in `06-multi-agent-patterns/` and points here.

## Key takeaways

- **Three production bugs ran concurrently for weeks** without being individually caught by Anthropic's eval suite. Their aggregate effect — "broad, inconsistent degradation" reported by users across many tasks — was qualitatively distinct from any single bug's symptom. The window spanned **Mar 4 → Apr 20, 2026** (~7 weeks of partial degradation).
- **Bug 1 — Reasoning effort default change** (Mar 4 → Apr 7, 2026): Default reasoning effort was lowered from `high` to `medium` for Sonnet 4.6 and Opus 4.6 to reduce latency from "UI freezing." Internal tests showed only "slightly lower intelligence with significantly less latency," but users reported Claude felt "less intelligent." **Reverted Apr 7** — restored `xhigh` for Opus 4.7, `high` for others.
- **Bug 2 — Clear-thinking caching bug** (Mar 26 → Apr 10, 2026): A March 26 caching optimization used the `clear_thinking_20251015` API header incorrectly, clearing reasoning history **on every turn** rather than once. Result: Claude appeared "forgetful and repetitive," and cache misses drained usage limits faster. Affected Sonnet 4.6 and Opus 4.6. **Fixed in v2.1.101 on Apr 10** — took >1 week to diagnose.
- **Bug 3 — Verbosity-reduction prompt** (Apr 16 → Apr 20, 2026): System prompt added "keep text between tool calls to ≤25 words. Keep final responses to ≤100 words." Broad evals revealed a **3% drop on coding evals for both Opus 4.6 and 4.7**. Affected all three production models (Sonnet 4.6, Opus 4.6, Opus 4.7). **Reverted in v2.1.116 on Apr 20**.
- **Apr 23 — Usage limits reset** for all subscribers as restitution for the cache-bloat consumption caused by Bug 2.
- **Process changes Anthropic adopted** (the most book-worthy artifact): (a) require larger share of internal staff to dogfood the exact public build; (b) expand internal Code Review tool with additional Anthropic repositories as context; (c) **mandatory broad per-model evals for every system-prompt change**; (d) continued **ablation testing** to understand the impact of each prompt line; (e) new tooling for prompt review and audit; (f) added guidance to CLAUDE.md for model-specific changes; (g) **soak periods + broader eval suite + gradual rollouts** for intelligence-affecting changes.
- **Detection difficulty** was the central lesson: bugs affected different traffic slices; neither internal usage nor initial evals reproduced them. The eval suite at the time of each change did not catch the regression — only broader, per-model evals on prompt changes would have.
- **Cross-system interaction was the second lesson**: the caching bug crossed context management, API header semantics, and the extended-thinking system. This is exactly the kind of compounding failure that multi-agent / multi-stage deployments are prone to.

## Quoted (citation-ready)

> "One of these evaluations showed a 3% drop for both Opus 4.6 and 4.7."
>
> — *An update on recent Claude Code quality reports*, §Verbosity-reduction prompt
>
> Anchor: `Verbosity-reduction prompt + One of these evaluations showed a 3% drop`

> "When Claude reasons through a task, that reasoning is normally kept in the conversation history so that on every subsequent turn, Claude can see why it made the edits and tool calls it did."
>
> — *An update on recent Claude Code quality reports*, §Clear-thinking caching bug
>
> Anchor: `Clear-thinking caching bug + When Claude reasons through a task that reasoning`

## Process changes — citation-ready bullet form

> The post lists the following process changes Anthropic committed to: ensure a larger share of internal staff use the exact public build; run a broad suite of per-model evals for every system-prompt change; continue ablations to understand the impact of each prompt line; build new tooling for prompt review and audit; add guidance to CLAUDE.md for model-specific changes; implement soak periods, a broader eval suite, and gradual rollouts.
>
> — *An update on recent Claude Code quality reports*, §What we're changing
>
> Anchor: `What we're changing + ensure that a larger share of internal staff use`

## Cross-references

- See [[blog-april-23-postmortem-stub]] (`06-multi-agent-patterns/`) — multi-agent angle (silent error propagation, cross-stage interaction).
- See [[blog-multi-agent-research-system]] for "Without effective mitigations, minor system failures can be catastrophic for agents" — the postmortem is the case study that validates that line.
- See [[advisories-claude-code-github]] (this dossier) for the security-incident timeline that overlapped the quality incident window.

## Open questions / follow-ups

- **Did Anthropic publish a separate "evaluation methodology" engineering post** after this one (containing the broader eval framework they committed to)? Worth a quarterly check on `anthropic.com/engineering`.
- **Is the "per-model eval-on-every-prompt-change" gate now externally verifiable** (e.g., changelog references), or implicit? Cite the gate only after confirmation.
- **The 3% eval drop figure** is the only quantitative impact disclosed. The cache-bloat consumption was acknowledged via the Apr 23 usage-limit reset but the aggregate $ or token impact was not.
