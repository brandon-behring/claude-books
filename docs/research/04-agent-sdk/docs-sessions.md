---
source_url: https://code.claude.com/docs/en/agent-sdk/sessions
canonical_url: https://code.claude.com/docs/en/agent-sdk/sessions
source_title: Work with sessions
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [1, 5]
cert_task_areas: ["Session state", "Long-conversation context", "Multi-step workflows"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Sessions — continue, resume, fork, and the persistence model

The doc page that explains where session JSONL lives, when to use `continue` vs `resume`, what fork does, and what to do across hosts (CI workers, ephemeral containers).

## Key takeaways

- **A session is the conversation history**: prompt, every tool call, every tool result, every response. JSONL on disk by default. Persisted to `~/.claude/projects/<encoded-cwd>/<session-id>.jsonl`.
- **`<encoded-cwd>`** = absolute working directory with every non-alphanumeric character replaced by `-`. E.g., `/Users/me/proj` becomes `-Users-me-proj`. This is the most common source of "resume returned a fresh session" bugs — mismatched `cwd` looks up the wrong path.
- **Three primary controls**:
  - **`continue: true`** (TS) / **`continue_conversation=True`** (Python) — picks up the most recent session in `cwd`. No ID tracking required.
  - **`resume: sessionId`** — picks up a specific session by ID. Required for multi-user / multi-conversation apps.
  - **`fork_session=True`** (Python) / **`forkSession: true`** (TS) — creates a new session ID that starts with a copy of the original's history. Original stays unchanged.
- **Automatic management interfaces**:
  - Python: `ClaudeSDKClient` context manager tracks the session ID internally; each `client.query()` call continues the same session.
  - TypeScript: there is no client class; pass `continue: true` on subsequent `query()` calls instead.
- **`persistSession: false`** (TS only) — disables JSONL write; session exists only in memory for the call. Python always persists.
- **Sessions persist the conversation, not the filesystem.** Subagent transcripts persist independently — main-session compaction does not affect them.

## Quoted (citation-ready)

> "Sessions persist the **conversation**, not the filesystem. To snapshot and revert file changes the agent made, use [file checkpointing]."
>
> — Work with sessions, opening Note
>
> Anchor: `Work with sessions + Sessions persist the conversation, not the filesystem`

> "Forking branches the conversation history, not the filesystem. If a forked agent edits files, those changes are real and visible to any session working in the same directory. To branch and revert file changes, use file checkpointing."
>
> — Work with sessions, Fork to explore alternatives (Note)
>
> Anchor: `Fork to explore alternatives + Forking branches the conversation history`

> "If a `resume` call returns a fresh session instead of the expected history, the most common cause is a mismatched `cwd`. Sessions are stored under `~/.claude/projects/<encoded-cwd>/*.jsonl`, where `<encoded-cwd>` is the absolute working directory with every non-alphanumeric character replaced by `-` (so `/Users/me/proj` becomes `-Users-me-proj`). If your resume call runs from a different directory, the SDK looks in the wrong place."
>
> — Work with sessions, Resume by ID (Tip)
>
> Anchor: `Resume by ID + If a resume call returns a fresh session`

## Choose an approach (decision table from the page)

| What you're building | What to use |
|---|---|
| One-shot task: single prompt, no follow-up | Nothing extra. One `query()` call handles it |
| Multi-turn chat in one process | `ClaudeSDKClient` (Python) or `continue: true` (TS). SDK tracks the session for you |
| Pick up where you left off after a process restart | `continue_conversation=True` / `continue: true`. Resumes the most recent session in the directory |
| Resume a specific past session (not the most recent) | Capture the session ID and pass it to `resume` |
| Try an alternative approach without losing the original | Fork the session |
| Stateless task, don't want disk writes (TS only) | `persistSession: false` |

## Capturing the session ID

- **Python**: `ResultMessage.session_id` (always present, even on errors). The init `SystemMessage.data["session_id"]` works too.
- **TypeScript**: `SDKResultMessage.session_id`, OR the init `SystemMessage` exposes it as a top-level `message.session_id` field for early capture.

## Resume across hosts (CI, ephemeral containers)

Two options:

1. **Move the session file** — persist `~/.claude/projects/<encoded-cwd>/<session-id>.jsonl` from the first run, restore to the **same path** (matching `cwd`) on the new host before calling `resume`.
2. **Don't rely on session resume** — capture the artifacts you care about (analysis output, decisions, file diffs) as application state and pass into a fresh session's prompt. The page recommends this as "often more robust than shipping transcript files around."

For multi-tenant / serverless / cross-host setups, the page points to `SessionStore` adapters (alpha; documented at `/en/agent-sdk/session-storage`).

## Session-mutating helper functions

Both SDKs expose enumerate + mutate helpers:

- **Python**: `list_sessions()`, `get_session_messages()`, `get_session_info()`, `rename_session()`, `tag_session()`.
- **TypeScript**: `listSessions()`, `getSessionMessages()`, `getSessionInfo()`, `renameSession()`, `tagSession()`.

`SDKSessionInfo` carries: `sessionId`, `summary`, `lastModified`, `fileSize`, `customTitle`, `firstPrompt`, `gitBranch`, `cwd`, `tag`, `createdAt`.

## Important footnote — V2 session API removal

The page includes a Note callout flagging that the experimental V2 session API (`createSession()` with `send`/`stream` pattern) was **removed in TypeScript Agent SDK 0.3.142**. See [[docs-typescript-v2-preview-removed]] for the full migration story.

## Canonical patterns

**Resume to recover from `error_max_turns`**:

```python
# First call hit max_turns; we have its session_id
async for message in query(
    prompt="Continue where you left off",
    options=ClaudeAgentOptions(
        resume=session_id,
        max_turns=60,  # Bump the limit
    ),
):
    ...
```

**Fork to try an alternative direction**:

```python
forked_id = None
async for message in query(
    prompt="Instead of JWT, implement OAuth2 for the auth module",
    options=ClaudeAgentOptions(resume=session_id, fork_session=True),
):
    if isinstance(message, ResultMessage):
        forked_id = message.session_id  # distinct from session_id
```

## Cross-references

- See [[docs-agent-loop]] for what counts as a turn (the unit of "where the agent left off").
- See [[docs-subagents]] for subagent-resume mechanics (`agentId` + main session `resume` together).
- See [[docs-typescript-v2-preview-removed]] for the removed V2 session API and the migration to V1.
- See [[docs-claude-code-features]] for how `setting_sources` interact with session loading.

## Open questions / follow-ups

- `SessionStore` adapter (alpha) — defer to `09-headless-ci/` dossier for production patterns (cross-host resume, S3 / Redis transcript mirrors).
- `cleanupPeriodDays` (default 30) — subagent transcript expiry is mentioned in [[docs-subagents]] but the main-session expiry doesn't appear on this page; presumably the same setting governs both.
- File-checkpointing relationship: the page repeatedly redirects to `/en/agent-sdk/file-checkpointing` for "branch and revert filesystem changes." Worth a separate note if a chapter wants to pair forking with checkpointing.
