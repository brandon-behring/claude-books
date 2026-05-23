---
source_url: https://artificialintelligenceact.eu/article/99/
canonical_url: https://artificialintelligenceact.eu/article/99/
source_title: EU AI Act — Article 99 (Penalties)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: reliability-governance
tier: T2-release-notes
cert_domains: [3, 5]
cert_task_areas:
  - Human review workflows + confidence calibration
  - Information provenance (claim-source mappings, temporal data)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# EU AI Act Article 99 — penalty structure (exact figures)

Companion to [[news-eu-ai-act-deadline]]. The penalty tiers are the single number book chapters most often need, so a dedicated note with the exact figures.

`artificialintelligenceact.eu` is a third-party mirror but reproduces the official text verbatim; treat as T2 (release-notes-equivalent for regulatory text) and cross-cite the official EUR-LEX URL when the books cite the regulation.

## Key takeaways

- **Three-tier penalty structure (Article 99)**:
  - **Tier 1 — Prohibited AI practices (Article 5 violations)**: up to **€35,000,000 or 7% of total worldwide annual turnover** (whichever is higher).
  - **Tier 2 — Other operator / notified-body violations** (most provider / deployer non-compliance): up to **€15,000,000 or 3% global turnover**.
  - **Tier 3 — False or misleading information** (to authorities): up to **€7,500,000 or 1% global turnover**.
- **SME / startup carve-out**: Member States must apply **whichever cap is lower** (the absolute amount vs the percentage). For small companies this typically means the percentage cap dominates; for large companies the percentage cap usually dominates anyway because 7% of $30B+ revenue >> €35M.
- **Enforcement principles** (Article 99(2)): penalties must be "**effective, proportionate and dissuasive**." Factors enumerated for fine sizing: violation severity, company size, prior violations, cooperation level, intent / negligence.
- **Reporting**: Member States must annually report imposed fines to the European Commission.
- **In force since Aug 2, 2025** — enforcement infrastructure live one year before full high-risk-system regime kicks in on Aug 2, 2026.
- **Landscape doc reconciliation**: the landscape doc §4.5 cites "€40M or 7% global turnover" for the headline figure. The **precise figure is €35,000,000** for the top tier (prohibited-practice violations). The €40M figure appears in some press reporting because it rounds up. **Recommend book chapters cite €35M / 7%** with this article as the source.
- **Multi-layer exposure**: an enterprise can be hit at multiple tiers simultaneously — e.g., a GPAI provider that ships an Annex-III-touching system without proper documentation could face Tier 2 (provider obligations) + Tier 3 (false documentation) penalties.

## Quoted (citation-ready)

> "administrative fines of up to 35 000 000 EUR or, if the offender is an undertaking, up to 7 % of its total worldwide annual turnover"
>
> — EU AI Act, Article 99 (Penalties) §1 — prohibited-practice tier
>
> Anchor: `Article 99 Penalties + administrative fines of up to 35 000 000 EUR or`

> "administrative fines of up to 15 000 000 EUR or, if the offender is an undertaking, up to 3 % of its total worldwide annual turnover"
>
> — EU AI Act, Article 99 (Penalties) §2 — operator / notified-body tier
>
> Anchor: `Article 99 Penalties + administrative fines of up to 15 000 000 EUR or`

> "administrative fines of up to 7 500 000 EUR or, if the offender is an undertaking, up to 1 % of its total worldwide annual turnover"
>
> — EU AI Act, Article 99 (Penalties) §3 — false-or-misleading-information tier
>
> Anchor: `Article 99 Penalties + administrative fines of up to 7 500 000 EUR or`

## Cross-references

- See [[news-eu-ai-act-deadline]] — applicability timeline + GPAI / deployer obligations + Annex III categories.
- See `/Users/brandonbehring/claude-books/docs/landscape-2026-05.md` §4.5 — update the landscape doc to use the precise €35M figure (rather than €40M) when book content lands.

## Open questions / follow-ups

- **Official EUR-LEX URL** for Regulation (EU) 2024/1689 Article 99 — capture as the primary source URL when book content lands. The `artificialintelligenceact.eu` mirror is convenient but books should cite the official text.
- **Recent fines actually imposed** under the Aug 2, 2025-in-force tier (prohibited-practice + GPAI provider non-compliance) — track via European Commission annual reporting. Useful for the field-guide.
