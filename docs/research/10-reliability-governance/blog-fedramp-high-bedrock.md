---
source_url: https://www.anthropic.com/news/claude-in-amazon-bedrock-fedramp-high
canonical_url: https://www.anthropic.com/news/claude-in-amazon-bedrock-fedramp-high
source_title: Claude in Amazon Bedrock receives FedRAMP High and DoD IL4/5 authorization
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: reliability-governance
tier: T1-official
cert_domains: [3, 5]
cert_task_areas:
  - CLAUDE.md hierarchy (user / project / directory; @import)
  - Information provenance (claim-source mappings, temporal data)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Claude in Amazon Bedrock — FedRAMP High + DoD IL4/5 (June 2025)

Foundational compliance-availability announcement. Establishes the regulated-environment baseline that any later "what's allowed in government / regulated workloads" discussion in the book builds on.

## Key takeaways

- **Authorization scope**: Claude on **Amazon Bedrock in AWS GovCloud (US)** approved for **FedRAMP High** and **DoD Impact Level 4 and 5** workloads.
- **Models covered at announcement**: Claude 3.5 Sonnet v1 and Claude 3 Haiku. **Claude 3.7 Sonnet and Claude 4 models pending** at time of publication. Subsequent model generations (Opus 4.5, 4.6, 4.7; Sonnet 4.5, 4.6) extend through Bedrock GovCloud as they receive authorization (verify per-model in landscape doc).
- **Bedrock services in scope**: Bedrock Agents, Guardrails, Knowledge Bases, and Model Evaluation are usable alongside the authorized models.
- **Existing channels** (per the same announcement): Google Cloud Vertex AI for FedRAMP High + IL2; Amazon Bedrock previously for FedRAMP Moderate/High + IL2 + IL4/5.
- **Publication date**: June 11, 2025.
- **Authorization tier framing**: DoD IL4/5 and FedRAMP High are described as "the highest levels of cloud security certification for unclassified and controlled unclassified information."
- **Cloud-availability matrix the book should track** (per this announcement + cert-coverage.md):
  - **AWS GovCloud / Bedrock**: FedRAMP High, IL4/5
  - **Google Cloud Vertex Assured Workloads**: FedRAMP High, IL2 (verify any IL4/5 upgrade)
  - **Microsoft Foundry**: separate channel; verify authorization scope before citing
  - **Direct Anthropic API**: not government-authorized for High/IL5 scopes
- **Why this matters for the architect-reference**: any agent design intended for federal / defense workloads must run through a Bedrock GovCloud deployment path; the Direct API is not in scope. Agent SDK consumers should set `CLAUDE_CODE_USE_BEDROCK=1` with appropriate AWS credentials for these environments.

## Quoted (citation-ready)

> "DoD Impact Level 4, 5, and FedRAMP High authorizations represent the highest levels of cloud security certification for unclassified and controlled unclassified information."
>
> — *Claude in Amazon Bedrock receives FedRAMP High and DoD IL4/5 authorization*, §Enabling secure AI for the most sensitive workloads
>
> Anchor: `Enabling secure AI for the most sensitive workloads + DoD Impact Level 4 5 and FedRAMP High`

> "Claude on Amazon Bedrock provides a fully managed service that eliminates infrastructure complexity while maintaining required security controls."
>
> — *Claude in Amazon Bedrock receives FedRAMP High and DoD IL4/5 authorization*, §Accelerating government AI adoption
>
> Anchor: `Accelerating government AI adoption + Claude on Amazon Bedrock provides a fully managed service`

## Cross-references

- See [[doc-managed-settings]] for `forceLoginMethod`, `forceLoginOrgUUID`, and the managed-settings hierarchy that government deployments use to enforce model + permission policy alongside the Bedrock channel.
- See `/Users/brandonbehring/claude-books/docs/landscape-2026-05.md` §3.5 (Anthropic business state) — cites the same FedRAMP High + IL5 baseline.
- See [[news-eu-ai-act-deadline]] for the parallel-but-distinct EU regulatory compliance layer.

## Open questions / follow-ups

- **Per-model authorization status** for Opus 4.5/4.6/4.7 and Sonnet 4.5/4.6 on Bedrock GovCloud — needs verification on the AWS Marketplace listings or a follow-on Anthropic news post. The June 2025 announcement names only 3.5 Sonnet + 3 Haiku.
- **Microsoft Foundry authorization scope** — is there a parallel FedRAMP / IL5 path or is government deployment Bedrock-only? Worth tracking.
- **A subsequent Anthropic announcement on Vertex AI Assured Workloads IL4/5** would close the multi-cloud parity gap; not located at fetch time.
