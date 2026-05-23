---
source_url: https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/tasks
canonical_url: https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/tasks
source_title: Tasks — Model Context Protocol Specification 2025-11-25
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: mcp-spec
tier: T1-official
cert_domains: [2]
cert_task_areas:
  - Effective tool interfaces (descriptions, boundaries, naming)
  - Structured error responses (`isError`, `errorCategory`, retryability)
volatility: fast-moving
verified: true
supersedes: []
superseded_by: []
---

# MCP Tasks (experimental in 2025-11-25; graduated to extension in 2026-07-28 RC)

Tasks turn a request into a **durable state machine**: instead of blocking on a long-running `tools/call`, the receiver returns a task handle immediately, the requestor polls (`tasks/get`) or awaits (`tasks/result`), and lifecycle events flow through. **Currently experimental in 2025-11-25 — chapter authors should treat this as advance notice that long-running tool calls are coming, not as a stable production API.** The 2026-07-28 RC graduates Tasks to a formal extension (no longer in core), removes `tasks/list`, and shifts task-creation from client-driven to server-driven. Marked `volatility: fast-moving`.

## Key takeaways
- Tasks are an **experimental** feature in 2025-11-25 (per the page's prominent Note: "design and behavior of tasks may evolve in future protocol versions").
- Either side can be requestor or receiver — clients can create tasks (e.g., for long-running `tools/call`) and servers can create tasks (e.g., for long-running `sampling/createMessage` or `elicitation/create`).
- Methods: `tasks/list` (paginated), `tasks/get` (poll), `tasks/result` (block until terminal), `tasks/cancel`. Notification: `notifications/tasks/status`.
- A task has: `taskId` (string, receiver-generated, unique), `status`, `statusMessage`, `createdAt`, `lastUpdatedAt`, `ttl` (ms), `pollInterval` (ms).
- Five statuses: `working`, `input_required`, `completed`, `failed`, `cancelled`. Terminal: completed / failed / cancelled.
- Status transitions are normatively constrained: from `working` -> `input_required` / terminal; from `input_required` -> `working` / terminal; terminal -> stays terminal.
- Capability negotiation: both parties declare `tasks` cap, indicating which **specific request types** support augmentation (e.g., `tasks.requests.tools.call: {}`). Plus per-tool `execution.taskSupport` (`"forbidden"` default / `"optional"` / `"required"`).
- The `io.modelcontextprotocol/related-task` `_meta` key threads task ID across all associated messages.
- Access control: tasks **MUST** be bound to authorization context when one exists. Without auth, receivers **MUST** generate cryptographically secure task IDs and **SHOULD NOT** declare `tasks.list` capability.

## Quoted (citation-ready)

> "Tasks were introduced in version 2025-11-25 of the MCP specification and are currently considered **experimental**. The design and behavior of tasks may evolve in future protocol versions."
>
> — Specification 2025-11-25 / Basic / Utilities / Tasks (Note block at top)
>
> Anchor: `Tasks + Tasks were introduced in version 2025-11-25 of the MCP specification`

> "Normal requests: The server processes the request and returns the actual operation result directly. Task-augmented requests: The server accepts the request and immediately returns a CreateTaskResult containing task data. The actual operation result becomes available later through tasks/result after the task completes."
>
> — Specification 2025-11-25 / Basic / Utilities / Tasks / Creating Tasks
>
> Anchor: `Creating Tasks + Task-augmented requests follow a two-phase response pattern`

## Mechanism: capability declaration

**Server caps** (which server-side requests can be task-augmented):
```json
{
  "capabilities": {
    "tasks": {
      "list":   {},     // tasks/list supported
      "cancel": {},     // tasks/cancel supported
      "requests": {
        "tools": { "call": {} }     // tools/call may be task-augmented
      }
    }
  }
}
```

**Client caps** (which client-side requests can be task-augmented):
```json
{
  "capabilities": {
    "tasks": {
      "list":   {},
      "cancel": {},
      "requests": {
        "sampling":    { "createMessage": {} },
        "elicitation": { "create": {} }
      }
    }
  }
}
```

The set of request types in `capabilities.tasks.requests` is **exhaustive** — if a request type isn't there, it can't be task-augmented.

### Per-tool taskSupport

Tools advertise via `execution.taskSupport` in `tools/list`:
- Absent or `"forbidden"` — **default**. Clients **MUST NOT** task-augment this tool. Server **SHOULD** return `-32601` if attempted.
- `"optional"` — clients **MAY** invoke as task or as normal request.
- `"required"` — clients **MUST** task-augment. Server **MUST** return `-32601` if not.

## Mechanism: creating a task

Requestor sends a normal request with a `task` field in params:
```json
{
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": { "city": "New York" },
    "task": { "ttl": 60000 }
  }
}
```

Receiver replies with a `CreateTaskResult` (not the actual operation result):
```json
{
  "result": {
    "task": {
      "taskId": "786512e2-9e0d-44bd-8f29-789f320fe840",
      "status": "working",
      "statusMessage": "The operation is now in progress.",
      "createdAt": "2025-11-25T10:30:00Z",
      "lastUpdatedAt": "2025-11-25T10:40:00Z",
      "ttl": 60000,
      "pollInterval": 5000
    }
  }
}
```

Optional `_meta` key for tool-call tasks specifically: `io.modelcontextprotocol/model-immediate-response` — a string the host can pass as an immediate tool result to the model so the model continues processing while the task runs.

## Mechanism: poll vs await

**Poll** — `tasks/get`:
```json
{ "method": "tasks/get", "params": { "taskId": "786512e2-..." } }
```
Returns the Task object with current status. Requestor **SHOULD** respect `pollInterval`.

**Await** — `tasks/result`:
```json
{ "method": "tasks/result", "params": { "taskId": "786512e2-..." } }
```
Blocks until the task reaches a terminal status, then returns **exactly what the underlying request would have returned** (success or JSON-RPC error).

## Mechanism: status lifecycle (normative)

```
[*] -> working
working -> input_required
working -> terminal (completed | failed | cancelled)
input_required -> working
input_required -> terminal
terminal -> [*]
```

Transitions:
- Tasks **MUST** begin in `working` when created.
- From `working`: -> `input_required`, `completed`, `failed`, `cancelled`.
- From `input_required`: -> `working`, `completed`, `failed`, `cancelled`.
- Terminal states **MUST NOT** transition further.

### `input_required` semantics

When the receiver needs additional input (e.g., a follow-up elicitation):
1. Receiver **SHOULD** move task to `input_required`.
2. Receiver **MUST** include `io.modelcontextprotocol/related-task` `_meta` in the side-channel request.
3. When requestor sees `input_required`, it **SHOULD** preemptively call `tasks/result` (to receive the inline request blocking inside).
4. When receiver has all required input, task **SHOULD** transition back to `working`.

## Mechanism: `notifications/tasks/status`

Receivers **MAY** push status changes:
```json
{
  "method": "notifications/tasks/status",
  "params": {
    "taskId": "786512e2-...",
    "status": "completed",
    "createdAt": "2025-11-25T10:30:00Z",
    "lastUpdatedAt": "2025-11-25T10:50:00Z",
    "ttl": 60000,
    "pollInterval": 5000
  }
}
```
Requestors **MUST NOT** rely on receiving notifications — receivers may emit them only for some transitions, or never.

## Mechanism: `tasks/cancel`

```json
{ "method": "tasks/cancel", "params": { "taskId": "786512e2-..." } }
```
Receivers **MUST** reject cancel for tasks already in terminal status with `-32602`. Upon valid cancel, receivers **SHOULD** stop execution and **MUST** transition to `cancelled` before responding. Cancelled tasks **MUST** stay cancelled even if execution continued.

## Mechanism: TTL + resource management (verbatim subset)

- Receivers **MUST** include `createdAt` and `lastUpdatedAt` (ISO 8601) on all task responses.
- Receivers **MAY** override requested `ttl`.
- Receivers **MUST** include actual `ttl` (or `null` for unlimited) in `tasks/get` responses.
- After TTL elapses, receivers **MAY** delete task + results regardless of status.
- Receivers **MAY** include `pollInterval` (ms) suggesting polling cadence; requestors **SHOULD** respect it.

## Mechanism: associating messages with tasks

All requests, notifications, and responses related to a task **MUST** include:
```json
{
  "_meta": {
    "io.modelcontextprotocol/related-task": { "taskId": "786512e2-..." }
  }
}
```

Exception: `tasks/get` / `tasks/list` / `tasks/cancel` requests **SHOULD NOT** include this meta (the taskId is already in the params). `tasks/result` response **MUST** include it (because the result body doesn't carry the taskId otherwise).

## Mechanism: protocol errors

- Invalid/nonexistent `taskId` in get/result/cancel: `-32602`.
- Invalid cursor in list: `-32602`.
- Cancel on terminal task: `-32602`.
- Internal errors: `-32603`.
- Non-task-augmented request when receiver requires augmentation: `-32600` (optional).

Task execution errors (e.g., tool returned `isError: true`): task moves to `failed`. `tasks/get` `statusMessage` **SHOULD** include diagnostic info.

## Mechanism: security (verbatim subset)

- When an authorization context exists, receivers **MUST** bind tasks to it.
- Without authorization, receivers **MUST** use cryptographically secure task IDs (high entropy) and **SHOULD** document the limitation.
- Receivers that can't identify requestors **SHOULD NOT** declare `tasks.list`.
- For all task ops, receivers with auth context **MUST** reject ops on tasks in a different auth context.
- Receivers **SHOULD** rate-limit task operations.

## How implementers interact with this section
- **Server author with long-running tools**: this is experimental — don't ship Tasks-dependent production code yet. If you do, plan to migrate when the 2026-07-28 RC ships (Tasks moves to an extension; lifecycle restructured; `tasks/list` removed).
- **Client author**: if you implement Tasks today, support poll + await + cancel. Be prepared for the RC's changes to the lifecycle.
- **Tool implementer**: don't set `execution.taskSupport: "required"` until you're sure all your clients support Tasks. `"optional"` is the safer choice.

## Cross-references
- See [[spec-tools]] for `execution.taskSupport` and the underlying `tools/call`.
- See [[spec-sampling]] for task-augmented sampling.
- See [[spec-elicitation]] for task-augmented elicitation.
- See [[blog-rc-2026-07-28]] for the major RC change: Tasks graduates from experimental core to formal extension (SEP-2663), lifecycle restructured, `tasks/list` removed, task creation becomes server-directed (server decides when a call runs as a task; client just advertises capability).

## Open questions / follow-ups
- The 2026-07-28 RC documents migration as breaking: "Anyone who shipped against the 2025-11-25 experimental Tasks API will need to migrate to the new lifecycle." Chapter authors covering Tasks should explicitly call out that the 2025-11-25 experimental API is not forward-compatible.
