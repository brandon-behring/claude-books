---
source_url: https://code.claude.com/docs/en/agent-sdk/typescript-v2-preview
canonical_url: https://code.claude.com/docs/en/agent-sdk/typescript-v2-preview
source_title: TypeScript SDK V2 session API (removed)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [1]
cert_task_areas: ["Session state", "Agentic loops"]
volatility: stable
verified: true
supersedes: []
superseded_by: ["docs-typescript-reference", "docs-sessions"]
---

# TypeScript V2 session API — REMOVED in v0.3.142

The V2 `createSession()` / `send()` / `stream()` pattern was an experimental interface; it has been removed. This note exists to disambiguate landscape-doc references that still mention V2 and to provide the migration path.

## Key takeaways

- **The V2 session API is removed.** TypeScript Agent SDK **v0.3.142** dropped `unstable_v2_createSession`, `unstable_v2_resumeSession`, `unstable_v2_prompt`, and the `SDKSession` and `SDKSessionOptions` types.
- **`@anthropic-ai/claude-agent-sdk@0.2.x`** is the last version that includes V2. To pin: `npm install @anthropic-ai/claude-agent-sdk@0.2`.
- **The V2 surface had three primitives**:
  - `createSession()` / `resumeSession()` — start or continue
  - `session.send()` — send a message
  - `session.stream()` — get the response
- **Migration path**: use the V1 [`query()` API](https://code.claude.com/docs/en/agent-sdk/typescript) and the [session options](https://code.claude.com/docs/en/agent-sdk/sessions) it accepts. For multi-turn, pass an `AsyncIterable<SDKUserMessage>` as the `prompt`. For resume, use `options.resume`.
- **V2 did not support all V1 features.** Notably session forking (`forkSession`) and some advanced streaming-input patterns required V1.

## Quoted (citation-ready)

> "The V2 session API is no longer supported. TypeScript Agent SDK 0.3.142 removes `unstable_v2_createSession`, `unstable_v2_resumeSession`, `unstable_v2_prompt`, and the `SDKSession` and `SDKSessionOptions` types."
>
> — TypeScript SDK V2 session API (removed), Warning callout
>
> Anchor: `TypeScript SDK V2 session API + The V2 session API is no longer supported`

> "V2 was an experimental session API that removed the need for async generators and yield coordination. Instead of managing generator state across turns, each turn was a separate `send()`/`stream()` cycle."
>
> — TypeScript SDK V2 session API (removed), introductory paragraph
>
> Anchor: `TypeScript SDK V2 session API + V2 was an experimental session API`

## Why this matters

- The `docs/landscape-2026-05.md` §1.4 lists "V2 send/stream pattern" as a current SDK surface. **This is outdated** — the V2 API was removed before the May 22 snapshot. Update on next refresh.
- The Python SDK never had a V2 equivalent; the `ClaudeSDKClient` class (Python) plays the same "session-holding client object" role that V2 played in TS.
- Sample V2 code that surfaces in third-party tutorials, blog posts, or older Anthropic demos should be migrated to V1 `query()` + session options.

## Migration cheat sheet

| V2 pattern | V1 equivalent |
|---|---|
| `unstable_v2_prompt(prompt, options)` | `query({ prompt, options })` + iterate stream |
| `unstable_v2_createSession(options)` + `session.send()` + `session.stream()` | `query({ prompt: <AsyncIterable<SDKUserMessage>>, options })` for multi-turn |
| `unstable_v2_resumeSession(sessionId, options)` | `query({ prompt, options: { resume: sessionId } })` |
| `await using session = ...` | Drive the async generator from `query()` to completion |

## Cross-references

- See [[docs-typescript-reference]] for the current `query()` interface (the V1 SDK).
- See [[docs-sessions]] for `continue` / `resume` / `fork` patterns that replaced V2's session primitives.
- See [[github-claude-agent-sdk-typescript]] for the v0.3.142 changelog entry that documents the removal.

## Open questions / follow-ups

- Whether V2 will be reintroduced in some form: the docs warning is unambiguous about removal but leaves the door open ("kept for reference if you maintain code on Agent SDK 0.2.x or earlier"). Track release notes.
- Some V2-style demo code may persist at `https://github.com/anthropics/claude-agent-sdk-demos/tree/main/hello-world-v2` — chapter authors should verify currency before citing.
