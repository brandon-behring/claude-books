---
source_url: https://platform.claude.com/docs/en/managed-agents/multi-agent
canonical_url: https://platform.claude.com/docs/en/managed-agents/multi-agent
source_title: Multiagent sessions — Claude API Docs
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: multi-agent-patterns
tier: T1-official
cert_domains: [1, 5]
cert_task_areas:
  - Coordinator-subagent patterns (hub-and-spoke, isolated context)
  - Subagent invocation (Task tool, allowedTools, AgentDefinition)
  - Multi-step workflows (programmatic vs prompt-based enforcement, handoff)
  - Session state (resume, fork_session, scratchpads)
  - Error propagation across multi-agent systems (structured error context)
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# platform.claude.com — Multiagent sessions

The API surface for Claude Managed Agents' Multiagent Orchestration feature. Documents the **coordinator + roster** model, **shared container** semantics, **session-thread isolation**, **25-thread concurrency cap**, **depth-1 delegation constraint**, and the **primary-thread event-stream proxy** that surfaces subagent activity. Companion to `blog-claude-managed-agents.md` (the product-marketing announcement).

## Key takeaways

- **Architecture**: one **coordinator** delegates to a declared **roster** of up to 20 unique agents. Each delegated call spawns a **session thread** — a context-isolated event stream with its own conversation history.
- **Shared resources** across all threads in a session: **container, filesystem, vault credentials**. Each agent uses its **own** model, system prompt, tools, MCP servers, and skills (declared at agent-creation time).
- **Depth-1 delegation only**: "The coordinator can only delegate to one level of agents; depth > 1 is ignored." No recursive multi-level hierarchies in beta.
- **`{"type": "self"}` roster entry** lets the coordinator spawn copies of itself.
- **25-thread concurrency cap** per session; coordinator can call multiple copies of one roster agent (sharing the same `agent` ID).
- **Thread persistence**: coordinator can send a follow-up to an earlier-called agent, which retains everything from its previous turns.
- **Primary thread = session-level event stream** (`/v1/sessions/:id/events/stream`). Holds a condensed view of all thread activity, including blocking events like tool-permission requests.
- **Beta header required**: `managed-agents-2026-04-01` on all requests; SDK sets automatically.
- **MCP scoping**: MCP servers are *agent*-scoped; vault credentials are *session*-scoped. Coordinator does not auto-inherit subagent MCP servers.

## Quoted (citation-ready)

> "Multiagent orchestration lets one agent coordinate with others to complete complex work. Agents can act in parallel with their own isolated context, which helps improve output quality and can also improve time to completion."
>
> — Multiagent sessions, intro paragraph
>
> Anchor: `intro paragraph + "Multiagent orchestration lets one agent"`

> "All agents share the same container, filesystem, and vault credentials, but each agent runs in its own session thread, a context-isolated event stream with its own conversation history."
>
> — Multiagent sessions, How it works
>
> Anchor: `How it works + "All agents share the same"`

> "Each agent uses its own configuration (model, system prompt, tools, MCP servers, and skills) as defined when that agent was created. Tools, MCP servers, and context are not shared."
>
> — Multiagent sessions, How it works
>
> Anchor: `How it works + "Each agent uses its own"`

> "The coordinator can only delegate to one level of agents; depth > 1 is ignored. A maximum of 20 unique agents can be listed in `multiagent.agents`, but the coordinator can call multiple copies of each agent."
>
> — Multiagent sessions, Configure the coordinator
>
> Anchor: `Configure the coordinator + "multiagent.agents can accept any"`

> "A maximum of 25 concurrent threads are supported. The coordinator can call multiple copies of a single agent in the roster, creating multiple threads associated with one `agent`."
>
> — Multiagent sessions, Threads
>
> Anchor: `Threads + "Session threads are where"`

> "Threads are persistent: the coordinator can send a follow-up to an agent it called earlier, and that agent retains everything from its previous turns."
>
> — Multiagent sessions, How it works
>
> Anchor: `How it works + "Threads are persistent"`

## Mechanism

### Coordinator configuration

A coordinator agent is created like any other agent, with two additions:

1. **`tools`** includes `{"type": "agent_toolset_20260401"}` — exposes the delegate-to-agent toolset.
2. **`multiagent`** declares the roster:

```python
multiagent={
    "type": "coordinator",
    "agents": [
        {"type": "agent", "id": reviewer_agent.id},
        {"type": "agent", "id": test_writer_agent.id},
    ],
}
```

Each roster entry is one of:

- `{"type": "agent", "id": ...}` — references an agent by ID; defaults to latest version
- `{"type": "agent", "id": ..., "version": ...}` — pins a specific version
- `{"type": "self"}` — coordinator spawns copies of itself

### Three documented use patterns

| Pattern | Description |
|---|---|
| **Parallelization** | Fan out independent subtasks simultaneously (search multiple sources, analyze separate files); coordinator synthesizes |
| **Specialization** | Route to domain-focused agents (security agent, documentation agent) instead of one bloated generalist |
| **Escalation** | Consult a more capable agent or model for a subset of complex subtasks |

These map 1:1 to the three "yes" scenarios from `blog-when-to-use-multi-agent.md`.

### Threading model

- **Primary thread** = session-level event stream (`/v1/sessions/:id/events/stream`) — condensed view of all thread activity. Includes start/end of subagent work and blocking events.
- **Session threads** = each delegated agent's own event stream. Drill down at `/v1/sessions/:id/threads/:thread_id/events`.
- **`parent_thread_id`** is null for the primary thread; non-null for delegated threads.
- **Session status** is the aggregate of all agent activity; `running` if any thread is running.

### Primary-thread events (cross-thread proxies)

| Event | Description |
|---|---|
| `session.thread_created` | New thread spawned (incl. `session_thread_id` and `agent_name`) |
| `session.thread_status_running` | Thread started activity |
| `session.thread_status_idle` | Agent awaiting input; includes `stop_reason` |
| `session.thread_status_terminated` | Thread archived or terminal error |
| `agent.thread_message_received` | Subagent delivered result to coordinator (`from_session_thread_id`, `from_agent_name`, `content`) |
| `agent.thread_message_sent` | Coordinator sent follow-up to subagent (`to_session_thread_id`, `to_agent_name`, `content`) |

### Interrupt + archive

- **Interrupt a thread**: send `user.interrupt` with `session_thread_id`. Against a thread blocked on `requires_action`, this marks each pending tool call denied and re-emits `session.thread_status_idle` with `stop_reason: end_turn` — the model is not sampled. Against a thread already idle, no-op.
- **Archive a thread**: frees up a slot against the 25-thread limit. Only succeeds if the thread is `idle`; if running or blocked, must interrupt first.

### Tool permissions and custom tools (cross-thread routing)

If a subagent needs something from the client (e.g., permission for an `always_ask` tool, or a custom-tool result), the event **cross-posts to the primary thread** with `session_thread_id` identifying the originating thread. Reply via `user.tool_confirmation` (with `tool_use_id`) or `user.custom_tool_result` (with `custom_tool_use_id`); the server routes to the correct subagent thread.

### MCP scoping rule

- **MCP servers are agent-scoped** — declared at agent definition time.
- **Vault credentials are session-scoped** — `vault_ids` passed at session creation apply to every thread.

Implications:
1. Authentication requires a vault credential for **every** MCP server used across all agents.
2. **Coordinator does not auto-inherit** subagent MCP servers — security by default.

Example: a researcher subagent declares the GitHub MCP server; coordinator does *not* have access; the session's `vault_ids` supply the GitHub credential only to the researcher's thread.

## Rate limits (Managed Agents)

- **Create endpoints** (agents, sessions, environments): **300 RPM**
- **Read endpoints** (retrieve, list, stream): **600 RPM**
- Organization-level spend limits and tier-based rate limits apply additionally.

## Cross-references

- See [[blog-claude-managed-agents]] for the product announcement and launch customers.
- See [[blog-multi-agent-research-system]] for the research blog that inspired this design (shared filesystem = artifacts pattern; isolated threads = isolated subagent contexts; coordinator = lead agent).
- See [[blog-when-to-use-multi-agent]] for the decision framework that informs which pattern (parallelization / specialization / escalation) maps to which subagent.
- See the Agent SDK subagents docs ([`platform.claude.com/docs/en/agent-sdk/subagents`](https://platform.claude.com/docs/en/agent-sdk/subagents)) for the SDK-side analog (lighter-weight, runs in your infrastructure).
- See [`/Users/brandonbehring/claude-books/docs/research/04-agent-sdk/`](../04-agent-sdk/) (when populated) for SDK substrate details.

## Open questions / follow-ups

- **Depth-1 limit**: how do production teams build deeper hierarchies? Pattern: outer Agent SDK orchestration calls Managed Agents sessions, each of which delegates one level.
- **Coordinator-as-roster-agent`{"type": "self"}`**: documented but no use-case example — when would a coordinator usefully spawn copies of itself? Possibly fan-out symmetric tasks (e.g., per-file processing).
- **25-thread concurrency cap**: is this a soft limit (raise via support) or hard? Docs do not say.
- **Outcomes integration** with multiagent: does the rubric evaluator run on the coordinator's final output, on each subagent's output, or both? The Outcomes docs (separate page) would clarify — not in this dossier.
- **Thread archive behavior** on session end: do archived threads survive session resume? Docs say sessions resume cleanly but don't address archived-thread retention.
