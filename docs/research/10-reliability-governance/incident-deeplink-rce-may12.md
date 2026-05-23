---
source_url: https://www.theregister.com/security/2026/05/20/even-claude-agrees-hole-in-its-sandbox-was-real-and-dangerous/
canonical_url: https://www.theregister.com/security/2026/05/20/even-claude-agrees-hole-in-its-sandbox-was-real-and-dangerous/
source_title: claude-cli:// deeplink RCE — patched v2.1.118 (May 12, 2026)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: reliability-governance
tier: T3-practitioner
cert_domains: [3, 5]
cert_task_areas:
  - Information provenance (claim-source mappings, temporal data)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Claude Code `claude-cli://` deeplink RCE — patched v2.1.118 (May 12, 2026)

Third-party reporting. The "third incident in the Q2 cluster." A custom-protocol-handler vulnerability rather than a sandbox / supply-chain issue.

Note: SecurityWeek and Cyberpress URLs returned 404 at fetch time. The note below is reconstructed from the landscape doc §6.2 plus the GitHub advisory database. Re-verify against direct sources before citing.

## Key takeaways

- **Mechanism**: the `claude-cli://` custom protocol handler accepted deeplinks that could write arbitrary settings — including shell-executable hook commands — into the user's local Claude Code configuration. A malicious web page or email link could invoke `claude-cli://...?settings=...` and silently mutate the next CLI startup to execute attacker code.
- **Why this is severe**: settings-file injection bypasses workspace-trust prompts entirely. The user does not see a `Bash(...)` approval dialog because the malicious command is registered as a startup hook that runs before any prompt-time gating.
- **Disclosure**: reported by **Joernchen of 0day.click**.
- **Patch**: **v2.1.118** on May 12, 2026.
- **Anthropic response framing** (per The Register reporting in [[incident-sandbox-bypass]]): Anthropic acknowledged the issue and confirmed the patch in v2.1.118; specifics of advisory-publication timing should be confirmed against the GitHub advisories database.
- **Related GHSA pattern**: this is the same class of bug as **CVE-2026-25725** (GHSA-ff64-7w26-62rf, "Sandbox Escape via Persistent Configuration Injection in settings.json", < v2.1.2, Feb 6, 2026) — an earlier *file-based* settings-injection escape. The deeplink RCE is the *protocol-handler-based* variant. The class of vulnerability is "settings file is too privileged a write target."
- **Mitigation surface in managed settings**:
  - `allowManagedHooksOnly` — prevents user-scope hooks from loading, defeating the post-patch ressurance even if a similar bug recurs.
  - `forceRemoteSettingsRefresh` — fails closed if managed-settings fetch fails, narrowing windows where stale settings + malicious user-scope settings could interact.
  - `strictPluginOnlyCustomization` — blocks hooks from user/project scope entirely.
- These three settings collectively make a v2.1.118-class bug not exploitable on a managed-policy-deployed instance.

## Quoted (citation-ready)

> The note below stands in until SecurityWeek / Cyberpress URLs are re-fetched successfully. When source is recovered, capture exact quoted attribution sentence (mechanism + reporter + patch version).
>
> — pending re-fetch verification
>
> Anchor: pending

## Cross-references

- See [[advisories-claude-code-github]] — for **CVE-2026-25725 (GHSA-ff64-7w26-62rf)**, the related settings-injection class of bug, patched in v2.1.2.
- See [[doc-managed-settings]] — `allowManagedHooksOnly`, `strictPluginOnlyCustomization`, `forceRemoteSettingsRefresh` are the enterprise mitigations.
- See [[incident-sandbox-bypass]] + [[incident-sourcemap-leak]] — companion 2026-Q2 incidents.
- See `/Users/brandonbehring/claude-books/docs/landscape-2026-05.md` §6.2.

## Open questions / follow-ups

- **Confirm exact CVE / GHSA ID** for the deeplink RCE — not visible in the GHSA list as of fetch (the list does not contain a "v2.1.118 deeplink" entry, suggesting either a separate non-GHSA advisory or that the GHSA list was not yet refreshed). Re-check on the next pass.
- **Confirm exact patch date** (May 12, 2026 per landscape doc; reconcile with the actual GitHub release notes for v2.1.118).
- **Anthropic security policy on custom-protocol handlers** — does Claude Code register additional handlers (`claude://`, `vscode-claude://`, etc.)? Each handler is a potential repeat target.
