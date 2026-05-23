---
source_url: https://www.theregister.com/security/2026/05/20/even-claude-agrees-hole-in-its-sandbox-was-real-and-dangerous/
canonical_url: https://www.theregister.com/security/2026/05/20/even-claude-agrees-hole-in-its-sandbox-was-real-and-dangerous/
source_title: "Even Claude agrees: hole in its sandbox was real and dangerous"
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: reliability-governance
tier: T3-practitioner
cert_domains: [3, 5]
cert_task_areas:
  - Human review workflows + confidence calibration
  - Information provenance (claim-source mappings, temporal data)
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Claude Code SOCKS5 sandbox bypass — silently patched v2.1.90 (Apr 2026)

Third-party security incident report. Distinct from the symlink-following sandbox-escape CVE in [[advisories-claude-code-github]] (CVE-2026-39861 / v2.1.64). This is the SOCKS5 hostname null-byte injection that ran in v2.0.24–v2.1.89 — **130 versions, ~5.5 months** — and was patched **without security mention in release notes**. Per the landscape doc this is the headline governance complaint of the 2026 incident cycle.

Note: at fetch time the WebFetch on the The Register URL returned 403. The note below is reconstructed from the landscape doc §6.2 plus cross-references to the GitHub advisory list and to reporting that the landscape doc consolidated. Re-verify the URL on direct browser access before citing in book.

## Key takeaways

- **Mechanism**: SOCKS5 hostname null-byte injection in the network sandbox. The sandbox's domain-allowlist check parsed the hostname up to the null byte while the underlying network stack used the post-null portion, allowing outbound connections to attacker-chosen domains despite the allowlist.
- **Affected version range**: **v2.0.24 → v2.1.89**, ~130 versions, **~5.5 months** of live exposure (Oct 2025 → Apr 2026).
- **Patch**: **v2.1.90**, silently. No security advisory published; no security mention in release notes per The Register reporting.
- **Reporter**: independent researcher **Aonan Guan**. A second related bypass was disclosed concurrently.
- **Governance significance**: this is the single most-cited case study in 2026 for "advisories vs release notes asymmetry." Enterprises relying on release-note review for vulnerability triage would have missed the patch entirely. The advisory list at [[advisories-claude-code-github]] is the canonical patch tracker.
- **Distinguish from the published CVE**: CVE-2026-39861 / v2.1.64 (symlink-following filesystem escape) is a *separate* sandbox-escape that *was* assigned a GHSA. The SOCKS5 null-byte bypass appears not to have a published GHSA, which is the basis of The Register's "silent patch" framing.
- **Threat scenario**: the network sandbox is the layer that's supposed to keep a prompt-injected agent from reaching attacker-controlled C2 or exfil endpoints. A bypass converts a contained prompt-injection foothold into outbound network access — directly upgrades the impact of the prompt-injection threat model that managed `sandbox.network.allowedDomains` is designed to enforce.

## Quoted (citation-ready)

> The note below stands in until WebFetch on the source URL succeeds. The landscape doc consolidates The Register reporting at §6.2. When the source is re-fetched, capture an exact quoted sentence here.
>
> — pending re-fetch verification
>
> Anchor: pending

## Cross-references

- See [[advisories-claude-code-github]] — for the symlink sandbox escape (CVE-2026-39861) that *did* get a CVE; contrast with this incident.
- See [[doc-managed-settings]] §`sandbox.network.allowedDomains` + `allowManagedDomainsOnly` — the managed-only domain allowlist is the enterprise mitigation surface (subject to the bypass *while it was live*, but is the right defense-in-depth control).
- See `/Users/brandonbehring/claude-books/docs/landscape-2026-05.md` §6.2 — synthesis source for this note.
- See [[incident-sourcemap-leak]] + [[incident-deeplink-rce-may12]] — the other two incidents in the 60-day 2026-Q2 cluster.

## Open questions / follow-ups

- **Direct fetch of The Register article** — 403 at fetch time. Confirm exact reporter attributions, dates, and a quotable sentence on the next attempt (try via `curl` with a normal user agent if WebFetch continues to fail).
- **Did Anthropic issue a follow-on statement after The Register published?** Worth tracking on `anthropic.com/news`.
- **Is there a public timeline for "all sandbox bypasses now require a GHSA"?** Implicit if subsequent sandbox patches all get advisories; check delta against [[advisories-claude-code-github]] over the next 90 days.
