# Topic 10 — Reliability, governance, compliance

Primary-source dossier for the **April 23 postmortem**, the **2026-Q2 security incident cluster**, **multi-agent failure data**, **Anthropic compliance posture** (FedRAMP / Bedrock GovCloud / managed settings), and the **EU AI Act** (Article 99 penalties + Aug 2, 2026 full applicability).

Companion to `docs/landscape-2026-05.md` §6 (failure modes), §3.5 (enterprise compliance state), §4.5 (EU AI Act in the industry-trends block). Cross-references back to `06-multi-agent-patterns/` for the multi-agent angle.

## Notes table

| Slug | Tier | Source | Topic |
|---|---|---|---|
| [blog-april-23-postmortem](./blog-april-23-postmortem.md) | T1 | Anthropic Engineering | Three-bug Claude Code quality incident (Mar 4–Apr 20, 2026); process changes adopted |
| [blog-fedramp-high-bedrock](./blog-fedramp-high-bedrock.md) | T1 | Anthropic News | FedRAMP High + DoD IL4/5 authorization via Bedrock GovCloud (Jun 11, 2025) |
| [doc-managed-settings](./doc-managed-settings.md) | T1 | Claude Code docs | Settings hierarchy + managed-only settings (the enterprise enforcement layer) |
| [advisories-claude-code-github](./advisories-claude-code-github.md) | T2 | GitHub Security Advisories | 27+ published CVEs (Jun 2025–May 2026); High-severity timeline table |
| [incident-sandbox-bypass](./incident-sandbox-bypass.md) | T3 | The Register | SOCKS5 sandbox bypass v2.0.24–v2.1.89, silently patched in v2.1.90 |
| [incident-sourcemap-leak](./incident-sourcemap-leak.md) | T3 | Trend Micro / Zscaler | Mar 31, 2026 npm sourcemap leak in v2.1.88 + lure-and-payload cycle |
| [incident-deeplink-rce-may12](./incident-deeplink-rce-may12.md) | T3 | SecurityWeek / Cyberpress | `claude-cli://` deeplink RCE patched in v2.1.118 (May 12, 2026) |
| [blog-augment-multi-agent-failure](./blog-augment-multi-agent-failure.md) | T3 | Augment Code | 41–86.7% production failure rate via MAST taxonomy; recommended fixes |
| [news-eu-ai-act-deadline](./news-eu-ai-act-deadline.md) | T1 | EU Commission Digital Strategy | Aug 2, 2026 full applicability; Annex III categories; GPAI / deployer obligations |
| [news-eu-ai-act-article-99](./news-eu-ai-act-article-99.md) | T2 | artificialintelligenceact.eu (mirror) | Article 99 penalty tiers — €35M / 7%, €15M / 3%, €7.5M / 1% |

## Cert task-area coverage (D5)

This dossier is the primary source for the three D5 task areas that the cert-coverage matrix lists as unowned across all three books:

- **D5 — Error propagation across multi-agent systems (structured error context)** — see [[blog-april-23-postmortem]] (the case study) + [[blog-augment-multi-agent-failure]] (the production-data backing).
- **D5 — Human review workflows + confidence calibration** — see [[doc-managed-settings]] (`feedbackSurveyRate`, `companyAnnouncements`, audit-trail patterns via hooks) + [[news-eu-ai-act-deadline]] (regulatory mandate for "appropriate human oversight measures") + [[blog-augment-multi-agent-failure]] (isolated-judge architecture).
- **D5 — Information provenance (claim-source mappings, temporal data)** — see [[advisories-claude-code-github]] (versioned vulnerability timeline) + [[incident-sandbox-bypass]] (silently-patched governance case) + EU AI Act §"activity logging for traceability."

Also touches D3 (Claude Code Configuration & Workflows) via [[doc-managed-settings]] and D1 (Agentic Architecture) via the multi-agent failure data.

## Incidents timeline — 2026 cluster

A compact reference. For full per-bug detail see the individual notes.

| Date | Event | Source / Patch |
|---|---|---|
| Jan 20, 2026 | CVE-2026-21852 — settings env-var pre-trust data leak (< v2.0.65) | GHSA-jh7p-qr78-84p7 / v2.0.65 |
| Feb 3, 2026 | CVE-2026-24887 + 24053 + 24052 — `find` injection, ZSH-clobber path bypass, domain-validation bypass | GHSA batch / v2.0.72, v2.0.74, v1.0.111 |
| Feb 6, 2026 | Batch of 7 CVEs — `sed` injection, settings.json sandbox escape, etc. | v2.0.55–v2.1.7 |
| Mar 4, 2026 | (Quality incident, not security) Default reasoning effort lowered `high` → `medium` | [[blog-april-23-postmortem]] Bug 1 |
| Mar 18, 2026 | CVE-2026-33068 — workspace trust bypass via repo-controlled settings | GHSA-mmgp-wc2j-qcv7 / v2.1.53 |
| Mar 26, 2026 | (Quality incident) `clear_thinking` caching bug introduced | [[blog-april-23-postmortem]] Bug 2 |
| Mar 31, 2026 | **npm sourcemap leak in v2.1.88** — 59.8 MB / 513K lines exposed | [[incident-sourcemap-leak]] |
| Apr 7, 2026 | Quality fix — reasoning effort default reverted | [[blog-april-23-postmortem]] |
| Apr 10, 2026 | Quality fix — caching bug patched | v2.1.101 |
| Apr 16, 2026 | (Quality incident) Verbosity ≤25 words prompt added | [[blog-april-23-postmortem]] Bug 3 |
| Apr 17, 2026 | CVE-2026-35603 — Windows config LPE | GHSA-5cwg-9f6j-9jvx / v2.1.75 |
| Apr 20, 2026 | CVE-2026-39861 — symlink sandbox escape | GHSA-vp62-r36r-9xqp / v2.1.64 |
| Apr 20, 2026 | Quality fix — verbosity prompt reverted (v2.1.116); **3% eval drop observed** | [[blog-april-23-postmortem]] |
| Apr 23, 2026 | **Postmortem published**; usage limits reset for all subscribers | [[blog-april-23-postmortem]] |
| Apr 24, 2026 | CVE-2026-40068 — trust dialog bypass via git worktree spoofing | GHSA-q5hj-mxqh-vv77 / v2.1.84 |
| Apr 2026 | **SOCKS5 sandbox bypass silently patched in v2.1.90** (v2.0.24–v2.1.89 affected ~5.5 months) | [[incident-sandbox-bypass]] |
| May 6, 2026 | CVE-2026-44470 (CoworkVMService LPE) + CVE-2026-44467 (SSH MITM) | GHSA-5p5x-5294-qhp3, GHSA-3rwf-2g6p-c2f9 |
| May 12, 2026 | **`claude-cli://` deeplink RCE patched in v2.1.118** | [[incident-deeplink-rce-may12]] |
| May 20, 2026 | The Register publishes sandbox-bypass disclosure | [[incident-sandbox-bypass]] |

## Compliance posture summary

**Anthropic certifications + cloud-channel availability** (state at 2026-05-22; verify before chapter cite):

| Compliance / cloud channel | Status | Source |
|---|---|---|
| FedRAMP High | Authorized via **Amazon Bedrock in AWS GovCloud** | [[blog-fedramp-high-bedrock]] (Jun 11, 2025) |
| DoD IL4/5 | Authorized via **Amazon Bedrock in AWS GovCloud** | [[blog-fedramp-high-bedrock]] |
| Google Cloud Vertex AI Assured Workloads | FedRAMP High + IL2 (per announcement); IL4/5 not confirmed in fetched text | [[blog-fedramp-high-bedrock]] |
| SOC 2 Type II | Cited in landscape doc §3.5; **trust page not directly fetched** at this pass | Open question — re-verify |
| ISO 27001 | Cited in landscape doc §3.5; trust page not directly fetched | Open question — re-verify |
| ISO/IEC 42001 (AI management) | Cited in landscape doc §3.5; trust page not directly fetched | Open question — re-verify |
| HIPAA BAA | Cited in landscape doc §3.5; trust page not directly fetched | Open question — re-verify |
| ZDR (Zero Data Retention) | Cited in landscape doc as enterprise feature; trust page not directly fetched | Open question — re-verify |
| EU AI Act compliance posture | No published Anthropic statement located at fetch | Open question |

**Books-side governance primitive**: managed settings ([[doc-managed-settings]]) is the **single most-important configuration surface** for compliance — model allowlists, MCP allowlists, permission-rule lockdown, hook lockdown, sandbox config, login enforcement. Any chapter on enterprise / regulated deployment must cover this.

## EU AI Act deadline callout

**August 2, 2026 — full applicability of Regulation (EU) 2024/1689.**

Most autonomous-coding-agent deployments in regulated EU enterprise contexts land in the Annex III high-risk bucket. Multi-layer compliance: GPAI provider (Anthropic) + orchestrator / downstream provider (the customer-product builder) + deployer (the end-customer operator). Penalty exposure: up to **€35M or 7% global turnover** (prohibited-practice tier), €15M / 3% (other operator obligations), €7.5M / 1% (false information). See [[news-eu-ai-act-deadline]] + [[news-eu-ai-act-article-99]].

## Open questions / gaps

- **Anthropic trust page not directly verified** at this fetch — the `trust.anthropic.com` and `anthropic.com/security` URLs returned 404 / connection errors. The landscape doc states SOC 2 Type II, ISO 27001, ISO/IEC 42001, HIPAA BAA, FedRAMP High, IL5 — confirm each before the field-guide chapter ships.
- **Anthropic ZDR (Zero Data Retention) primary citation** — `privacy.claude.com` 404 at fetch; track down the canonical policy URL.
- **DigitalApplied H1 2026 multi-agent retrospective** — URL returned 404; not yet captured.
- **The "85% per-step accuracy ⇒ 20% pipeline success" compounding-math attribution** — the Augment article does not contain this; track the original source separately if the books want to cite the math.
- **SecurityWeek + Cyberpress** for the deeplink RCE — both returned 404 / 403 at fetch; reconstructed note from landscape doc. Re-verify before citing the May 12 patch precisely.
- **EU AI Act EUR-LEX official text URL** — capture for the books' citation of the regulation directly (vs the Commission summary).
- **Vertex AI Assured Workloads IL4/5 parity** — confirm whether Anthropic has parity authorization on the GCP channel comparable to Bedrock.
