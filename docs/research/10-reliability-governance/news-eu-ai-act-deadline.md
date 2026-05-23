---
source_url: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
canonical_url: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
source_title: Regulatory framework on AI — European Commission Digital Strategy
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: reliability-governance
tier: T1-official
cert_domains: [3, 5]
cert_task_areas:
  - Human review workflows + confidence calibration
  - Information provenance (claim-source mappings, temporal data)
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# EU AI Act — full applicability August 2, 2026 + GPAI / deployer compliance layers

The single biggest regulatory event of 2026 affecting agentic-coding deployments in Europe and any European-customer-facing US deployment. Cited in landscape doc §4.5; this note is the canonical primary-source citation.

## Key takeaways

- **Regulation identifier**: Regulation (EU) 2024/1689 (the "AI Act"), published in the Official Journal on **July 12, 2024**.
- **Full applicability timeline**:
  - **Aug 1, 2024** — AI Act entered into force.
  - **Feb 2, 2025** — prohibited AI practices applicable (manipulative / exploitative systems banned).
  - **Aug 2, 2025** — governance rules + **GPAI (general-purpose AI) provider obligations applicable**.
  - **Aug 2, 2026** — **full applicability** of remaining provisions, including the Annex III high-risk system regime.
  - **Aug 2, 2028** — extended transition for systems embedded in regulated products (lifts, toys, etc.).
  - **Dec 2, 2027** — *simplified timeline* per the Omnibus agreement (May 2026) for certain Annex III categories: biometrics, critical infrastructure, education, employment, migration, asylum, border control. Some categories moved to this later date by the Omnibus simplification package.
- **Annex III — high-risk use-case categories** (9 in current text):
  1. AI safety components in critical infrastructures (transport, energy).
  2. Education AI affecting access and professional development.
  3. AI-based safety components in products (e.g., robot-assisted surgery).
  4. Employment AI tools (CV-sorting, worker management, self-employment access).
  5. Essential service access AI (credit scoring, loan decisions).
  6. Biometric systems (remote identification, emotion recognition, categorization).
  7. Law-enforcement AI affecting fundamental rights (evidence reliability).
  8. Migration, asylum, border control automation (visa processing).
  9. Justice and democratic process administration (court-ruling preparation).
- **GPAI provider obligations** (in force since Aug 2, 2025):
  - Transparency and copyright-related rules.
  - Models with **systemic risks** require risk assessment + mitigation.
  - **Public summary of training content**, including data sources and processing aspects (template provided by Commission).
  - GPAI Code of Practice (voluntary compliance instrument addressing transparency, copyright, safety, security).
  - AI-generated content must be **identifiable**; deep fakes + public-interest text require "clear and visibly labelled" disclosure.
- **Multi-layer compliance the books need to convey** (per landscape doc §4.5):
  - **GPAI provider** layer — Anthropic itself, as foundation-model provider.
  - **Orchestrator / downstream provider** layer — anyone who builds a Claude-powered agent product that touches an Annex III category (this is where most enterprise autonomous-coding deployments land if the coding agent has access to HR, credit-scoring, or critical-infrastructure code paths).
  - **Deployer** layer — the customer organization using the agent in their operations. Required: "human oversight and monitoring," report serious incidents.
- **Provider obligations for high-risk systems** (deployer / orchestrator differs):
  - Adequate risk assessment and mitigation systems.
  - High-quality datasets to minimize discriminatory outcomes.
  - Activity logging for traceability.
  - Detailed documentation for authority assessment.
  - Appropriate human oversight measures.
  - High level of robustness, cybersecurity, and accuracy.
  - Post-market monitoring.
- **Penalty structure** (EU AI Act Article 99 — see [[news-eu-ai-act-article-99]] for full citation):
  - **Prohibited-practice violations**: up to **€35M or 7% of total worldwide annual turnover**, whichever is higher.
  - **Other operator / notified-body violations**: up to **€15M or 3% global turnover**.
  - **False or misleading information**: up to **€7.5M or 1% global turnover**.
  - SME / startup provisions: apply whichever cap is lower.
  - Note the landscape doc's "€40M / 7%" phrasing rounds €35M up to €40M. The exact figure is **€35,000,000 or 7%**; use the precise amount in book chapters.
- **Penalties applicable since Aug 2, 2025** (one year before full applicability of the high-risk regime — the enforcement infrastructure precedes the regulated activity).

## Quoted (citation-ready)

> "The AI Act is the first-ever comprehensive legal framework on AI worldwide. The aim of the rules is to foster trustworthy AI in Europe."
>
> — *Regulatory framework on AI*, European Commission Digital Strategy
>
> Anchor: `Regulatory framework on AI + The AI Act is the first-ever comprehensive legal`

> "AI use cases that can pose serious risks to health, safety or fundamental rights are classified as high-risk."
>
> — *Regulatory framework on AI*, European Commission Digital Strategy
>
> Anchor: `Regulatory framework on AI + AI use cases that can pose serious risks`

> "All AI systems considered a clear threat to the safety, livelihoods and rights of people are banned."
>
> — *Regulatory framework on AI*, European Commission Digital Strategy
>
> Anchor: `Regulatory framework on AI + All AI systems considered a clear threat`

## Cross-references

- See [[news-eu-ai-act-article-99]] — full Article 99 penalty structure with quoted figures.
- See [[blog-fedramp-high-bedrock]] — parallel US compliance regime; ZDR + FedRAMP High address some but not all EU AI Act obligations.
- See [[doc-managed-settings]] — managed settings (logging via hooks, model restriction, audit trail) are partial deployer-layer compliance controls.
- See [[blog-augment-multi-agent-failure]] — independent validation / isolated judges are the technical implementation of "appropriate human oversight measures" for autonomous agents.
- See `/Users/brandonbehring/claude-books/docs/landscape-2026-05.md` §4.5 + §8.1 chapter 15 update line for the book-mapping context.

## Open questions / follow-ups

- **Exact text of "August 2, 2026" applicability** in Regulation (EU) 2024/1689 — pull the EUR-LEX URL into a separate primary-source note if the books cite the regulation directly (vs the Commission summary captured here).
- **Omnibus simplification effect on Aug 2, 2026 specifically** — confirm which Annex III categories remain on Aug 2, 2026 vs the categories shifted to Dec 2, 2027.
- **Anthropic's published EU AI Act compliance posture** — search `anthropic.com/news` and `trust.anthropic.com` for an official compliance statement; not located at fetch time.
- **GPAI Code of Practice signatories** — Anthropic's signatory status would be a citable detail; verify before claiming.
