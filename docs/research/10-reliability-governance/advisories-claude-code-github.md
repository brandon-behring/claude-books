---
source_url: https://github.com/anthropics/claude-code/security/advisories
canonical_url: https://github.com/anthropics/claude-code/security/advisories
source_title: GitHub Security Advisories — anthropics/claude-code
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: reliability-governance
tier: T2-release-notes
cert_domains: [3, 5]
cert_task_areas:
  - Human review workflows + confidence calibration
  - Information provenance (claim-source mappings, temporal data)
volatility: fast-moving
verified: true
supersedes: []
superseded_by: []
---

# Claude Code published security advisories — 27+ CVEs since 2025-06

Source: GitHub Security Advisories database for `anthropics/claude-code`, accessed via `gh api repos/anthropics/claude-code/security-advisories` on 2026-05-22.

## Key takeaways

- **27 publicly disclosed CVEs** between Jun 2025 and May 2026 against `@anthropic-ai/claude-code` or Claude Desktop, plus parallel IDE-extension advisories.
- **Severity distribution**: 22 High, 3 Medium/Moderate, 2 Low. No Critical published as of fetch.
- **Dominant CVE pattern**: trust-dialog / approval-prompt bypasses, command-injection through tool wrappers (find, sed, echo, rg, ZSH clobber), settings-file injection, and sandbox escapes via symlinks / directory junctions. These cluster directly against the prompt-injection and lateral-execution threat model that managed settings + sandbox config are designed to mitigate.
- **Recent (Apr-May 2026) high-severity CVEs that the book should cite**:
  - **CVE-2026-39861 (GHSA-vp62-r36r-9xqp)** — Sandbox Escape via Symlink Following, < v2.1.64, patched v2.1.64, CVSS 7.7. Sandboxed process creates symlink within workspace; unsandboxed app writes through it to arbitrary location. Exploitation requires prompt-injection foothold.
  - **CVE-2026-40068 (GHSA-q5hj-mxqh-vv77)** — Trust Dialog Bypass via Git Worktree Spoofing, v2.1.63–v2.1.84, patched v2.1.84. Spoofed worktree path bypasses workspace-trust check.
  - **CVE-2026-44467 (GHSA-3rwf-2g6p-c2f9)** — Claude Desktop SSH Host Key Verification Bypass / MITM on Remote sessions, Desktop 1.2581.0 → 1.4304.0, patched 1.4304.0.
  - **CVE-2026-44470 (GHSA-5p5x-5294-qhp3)** — Claude Desktop Local Privilege Escalation via Directory Junction in CoworkVMService (SYSTEM-level), patched 1.3834.0.
  - **CVE-2026-35603 (GHSA-5cwg-9f6j-9jvx)** — Windows Insecure System-Wide Configuration Loading Enables Local Privilege Escalation, < v2.1.75, patched v2.1.75 (the same patch that retired the legacy `C:\ProgramData\ClaudeCode\` managed-settings path).
  - **CVE-2026-33068 (GHSA-mmgp-wc2j-qcv7)** — Workspace Trust Dialog Bypass via Repo-Controlled Settings File, < v2.1.53, patched v2.1.53.
- **Earlier 2026 cluster** (Feb 6 batch of seven advisories): `find` command injection (v2.0.72), `sed`-pipe write-restriction bypass (v2.0.55), settings.json sandbox-escape (v2.1.2), directory-change command injection (v2.0.57), symlink permission-deny bypass (v2.1.7), ZSH-clobber path-restriction bypass (v2.0.74), domain-validation bypass (v1.0.111). All point to a 2025-Q4 / 2026-Q1 emphasis on hardening the tool wrappers against prompt-injection-driven escapes.
- **Reporter ecosystem**: HackerOne researchers (`hackerone.com/piquo`), independent disclosure (Joernchen of 0day.click for the deeplink RCE — see [[incident-deeplink-rce-may12]]); academic / corporate teams (Trend Micro, Zscaler ThreatLabz on the sourcemap leak — see [[incident-sourcemap-leak]]; Aonan Guan on the sandbox bypass — see [[incident-sandbox-bypass]]).
- **Disclosure-vs-release-notes gap (governance concern)**: per [[incident-sandbox-bypass]], at least the SOCKS5 sandbox bypass was patched **without security mention in release notes**. The advisories page is the **only canonical source** for what was patched and when; release notes alone are insufficient for enterprise vulnerability tracking.

## Versioned timeline (verified high-severity, last 6 months)

| Date published | GHSA | CVE | Affected (Claude Code) | Patched in | Severity |
|---|---|---|---|---|---|
| 2026-05-06 | GHSA-5p5x-5294-qhp3 | CVE-2026-44470 | Claude Desktop < 1.3834.0 | 1.3834.0 | High |
| 2026-05-06 | GHSA-3rwf-2g6p-c2f9 | CVE-2026-44467 | Claude Desktop 1.2581.0–1.4304.0 | 1.4304.0 | High |
| 2026-04-24 | GHSA-q5hj-mxqh-vv77 | CVE-2026-40068 | v2.1.63–v2.1.84 | v2.1.84 | High |
| 2026-04-20 | GHSA-vp62-r36r-9xqp | CVE-2026-39861 | < v2.1.64 | v2.1.64 | High |
| 2026-04-17 | GHSA-5cwg-9f6j-9jvx | CVE-2026-35603 | < v2.1.75 (Windows) | v2.1.75 | Medium |
| 2026-03-18 | GHSA-mmgp-wc2j-qcv7 | CVE-2026-33068 | < v2.1.53 | v2.1.53 | High |
| 2026-02-06 | GHSA-66q4-vfjg-2qhh | CVE-2026-25722 | < v2.0.57 | v2.0.57 | High |
| 2026-02-06 | GHSA-mhg7-666j-cqg4 | CVE-2026-25723 | < v2.0.55 | v2.0.55 | High |
| 2026-02-06 | GHSA-ff64-7w26-62rf | CVE-2026-25725 | < v2.1.2 | v2.1.2 | High |
| 2026-02-06 | GHSA-4q92-rfm6-2cqx | CVE-2026-25724 | < v2.1.7 | v2.1.7 | Low |
| 2026-02-03 | GHSA-qgqw-h4xq-7w8w | CVE-2026-24887 | < v2.0.72 | v2.0.72 | High |
| 2026-02-03 | GHSA-q728-gf8j-w49r | CVE-2026-24053 | < v2.0.74 | v2.0.74 | High |
| 2026-02-03 | GHSA-vhw5-3g5m-8ggf | CVE-2026-24052 | < v1.0.111 | v1.0.111 | High |
| 2026-01-20 | GHSA-jh7p-qr78-84p7 | CVE-2026-21852 | < v2.0.65 | v2.0.65 | Medium |
| 2025-12-03 | GHSA-xq4m-mc3c-vvg3 | CVE-2025-66032 | < v1.0.93 | v1.0.93 | High |
| 2025-11-20 | GHSA-7mv8-j34q-vp7q | CVE-2025-64755 | < v2.0.31 | v2.0.31 | High |
| 2025-11-19 | GHSA-5hhx-v7f6-x7gv | CVE-2025-65099 | < v1.0.39 | v1.0.39 | High |
| 2025-10-03 | GHSA-66m2-gx93-v996 | CVE-2025-59829 | < v1.0.120 | v1.0.120 | Low |
| 2025-10-03 | GHSA-4fgq-fpq9-mr3g | CVE-2025-59536 | < v1.0.111 | v1.0.111 | High |
| 2025-09-24 | GHSA-2jjv-qf24-vfm4 | CVE-2025-59828 | < v1.0.39 | v1.0.39 | High |
| 2025-09-09 | GHSA-j4h9-wv2m-wrf7 | CVE-2025-59041 | < 1.0.105 | 1.0.105 | High |
| 2025-09-09 | GHSA-qxfv-fcpc-w36x | CVE-2025-58764 | < 1.0.105 | 1.0.105 | High |
| 2025-09-02 | GHSA-ph6w-f82w-28w6 | (none) | < v1.0.87 | v1.0.87 | High |
| 2025-08-15 | GHSA-x5gv-jw7f-j6xj | CVE-2025-55284 | < v1.0.4 | v1.0.4 | High |
| 2025-08-01 | GHSA-x56v-x2h6-7j34 | CVE-2025-54795 | < v1.0.20 | v1.0.20 | High |
| 2025-08-01 | GHSA-pmw4-pwvc-3hx2 | CVE-2025-54794 | < v0.2.111 | v0.2.111 | High |
| 2025-06-23 | GHSA-9f65-56v6-gxw7 | CVE-2025-52882 | IDE ext 0.2.116–1.0.24 | 1.0.24 | High |

## Quoted (citation-ready)

> "The sandbox did not prevent sandboxed processes from creating symbolic links pointing to locations outside the workspace. … Reliable exploitation required the ability to inject untrusted content into a Claude Code context window to trigger sandboxed code execution via prompt injection."
>
> — GitHub Security Advisory GHSA-vp62-r36r-9xqp / CVE-2026-39861, §Mechanism description
>
> Anchor: `Mechanism description + The sandbox did not prevent sandboxed processes`

## Cross-references

- See [[incident-sandbox-bypass]] — the second SOCKS5 sandbox bypass (separate from CVE-2026-39861) reported by Aonan Guan; silently patched in v2.1.90 with no release-notes mention per The Register.
- See [[incident-sourcemap-leak]] — March 31 npm sourcemap leak in 2.1.88; not strictly a CVE but the most-cited 2026 incident.
- See [[incident-deeplink-rce-may12]] — `claude-cli://` deeplink RCE patched in v2.1.118.
- See [[doc-managed-settings]] — `sandbox.*`, `allowManagedHooksOnly`, `strictPluginOnlyCustomization`, `forceLoginMethod` directly address whole categories of advisories above.

## Open questions / follow-ups

- **Anthropic-published security policy** (responsible disclosure window, patch SLA targets, embargoed-advisory cadence) — does an explicit policy exist? Not located at fetch.
- **Are the silently-patched bugs Aonan Guan + Trend Micro / Zscaler identified represented in this list, or are they outside the GHSA database?** The advisories list does not include a "SOCKS5 hostname null-byte injection" entry matching v2.1.90 specifically — confirms the governance complaint in [[incident-sandbox-bypass]].
- **Refresh cadence**: this list is fast-moving. Re-verify before each book draft cite.
