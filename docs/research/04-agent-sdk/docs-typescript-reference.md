---
source_url: https://code.claude.com/docs/en/agent-sdk/typescript
canonical_url: https://code.claude.com/docs/en/agent-sdk/typescript
source_title: Agent SDK reference - TypeScript
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [1, 2]
cert_task_areas: ["Agentic loops", "Subagent invocation", "Session state", "Agent SDK hooks", "MCP server config"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# TypeScript SDK API reference — exhaustive field list

Canonical TS API reference. Pair with [[docs-python-reference]] for Python parity and [[docs-typescript-v2-preview-removed]] for the now-removed V2 `send()` / `stream()` pattern.

## Key takeaways

- **`query()` is the only blessed entry point** for V1 (V2's `unstable_v2_createSession` was removed in `0.3.142`). Signature:

  ```typescript
  function query({
    prompt,
    options
  }: {
    prompt: string | AsyncIterable<SDKUserMessage>;
    options?: Options;
  }): Query;
  ```

- **Return type `Query` extends `AsyncGenerator<SDKMessage, void>` plus 14+ control methods** (`interrupt`, `rewindFiles`, `setPermissionMode`, `setModel`, `setMaxThinkingTokens`, `applyFlagSettings`, `supportedCommands`, `supportedModels`, `supportedAgents`, `mcpServerStatus`, `reconnectMcpServer`, `toggleMcpServer`, `setMcpServers`, `streamInput`, `stopTask`, `close`, `initializationResult`, `accountInfo`).
- **`startup()`** returns a `WarmQuery` (`AsyncDisposable`) — pre-warms the Claude Code subprocess so the first prompt has zero latency. Useful for server-side apps with bursty traffic.
- **`Options` field naming is camelCase** (matches the wire format). Notable that the Python dataclass uses snake_case but TS already-camelCase serializes directly.
- **`PermissionMode` adds `"auto"`** vs Python: `"default" | "acceptEdits" | "bypassPermissions" | "plan" | "dontAsk" | "auto"`. `"auto"` uses a model classifier to approve/deny tool calls.
- **`SDKAssistantMessage` wraps the raw Anthropic API message in a `.message` field** — `message.message.content`, not `message.content`. This is a frequent source of TS-vs-Python code-snippet divergence.
- **No V2 `send()`/`stream()`** — the page does not advertise one. The V2 interface was removed in SDK `0.3.142`; see [[docs-typescript-v2-preview-removed]].

## Quoted (citation-ready)

> "The primary function for interacting with Claude Code. Creates an async generator that streams messages as they arrive."
>
> — TypeScript SDK reference, `query()` description
>
> Anchor: `query() + The primary function for interacting with Claude Code`

> "Pre-warms the CLI subprocess for zero-latency first prompts."
>
> — TypeScript SDK reference, `startup()`
>
> Anchor: `startup() + Pre-warms the CLI subprocess`

## Top-level exports

| Symbol | Kind | Purpose |
|---|---|---|
| `query` | function | Primary entry point |
| `startup` | function | Pre-warm a subprocess; returns `WarmQuery` |
| `tool` | function | Type-safe MCP tool factory (Zod-style) |
| `createSdkMcpServer` | function | Build in-process MCP server |
| `listSessions` / `getSessionMessages` / `getSessionInfo` / `renameSession` / `tagSession` | functions | Session management |
| `resolveSettings` | function (alpha) | Read MDM settings (macOS plist / Windows HKLM\HKCU) |
| `Query` / `WarmQuery` / `Options` / `AgentDefinition` / `PermissionMode` / `HookCallback` | types | Public type surface |

## `Options` — selected field list (most important for chapter content)

The TS Options interface is exhaustively documented; here's the subset most relevant for the architect-reference. Defaults shown where the docs specify them.

| Field | Type | Default | Notes |
|---|---|---|---|
| `abortController` | `AbortController` | `new AbortController()` | Cancellation handle |
| `additionalDirectories` | `string[]` | `[]` | Extra dirs Claude can access (escape `cwd`) |
| `agent` | `string` | `undefined` | Agent name for the main thread |
| `agents` | `Record<string, AgentDefinition>` | `undefined` | Programmatic subagent defs |
| `agentProgressSummaries` | `boolean` | `false` | One-line summaries for subagents |
| `allowDangerouslySkipPermissions` | `boolean` | `false` | Required to enter `bypassPermissions` |
| `allowedTools` | `string[]` | `[]` | Auto-approve allowlist |
| `betas` | `SdkBeta[]` | `[]` | Beta-feature flags |
| `canUseTool` | `CanUseTool` | `undefined` | Permission callback (step 5 of eval) |
| `continue` | `boolean` | `false` | Continue most recent session |
| `cwd` | `string` | `process.cwd()` | Working dir |
| `debug` / `debugFile` | `boolean` / `string` | `false` / `undefined` | Debug logs |
| `disallowedTools` | `string[]` | `[]` | Bare-name (removes tool) or scoped (`"Bash(rm *)"` — blocks at step 2) |
| `effort` | `'low' \| 'medium' \| 'high' \| 'xhigh' \| 'max'` | `'high'` | TS default = `'high'`; Python leaves unset |
| `enableFileCheckpointing` | `boolean` | `false` | File-change tracking for `rewindFiles` |
| `env` | `Record<string, string \| undefined>` | `process.env` | Set `CLAUDE_AGENT_SDK_CLIENT_APP` for User-Agent |
| `executable` | `'bun' \| 'deno' \| 'node'` | Auto-detected | JS runtime |
| `executableArgs` | `string[]` | `[]` | Args to executable |
| `extraArgs` | `Record<string, string \| null>` | `{}` | Extra CLI args |
| `fallbackModel` | `string` | `undefined` | Fallback model |
| `forkSession` | `boolean` | `false` | Fork instead of continue |
| `forwardSubagentText` | `boolean` | `false` | Forward subagent text as nested messages with `parent_tool_use_id` |
| `hooks` | `Partial<Record<HookEvent, HookCallbackMatcher[]>>` | `{}` | Hook map |
| `includeHookEvents` | `boolean` | `false` | Surface hook events in message stream |
| `includePartialMessages` | `boolean` | `false` | Surface partial-message stream events |
| `loadTimeoutMs` | `number` | `60000` | Alpha: `sessionStore.load()` timeout |
| `managedSettings` | `Settings` | `undefined` | Policy-tier settings from parent process |
| `maxBudgetUsd` | `number` | `undefined` | Cost-based stop |
| `maxThinkingTokens` | `number` | `undefined` | **Deprecated** — use `thinking` |
| `maxTurns` | `number` | `undefined` | Turn-based stop |
| `mcpServers` | `Record<string, McpServerConfig>` | `{}` | MCP map |
| `model` | `string` | CLI default | E.g. `"claude-opus-4-7"` |
| `onElicitation` | callback | `undefined` | MCP elicitation handler |
| `outputFormat` | `{ type: 'json_schema', schema: JSONSchema }` | `undefined` | Structured-output spec |
| `pathToClaudeCodeExecutable` | `string` | Auto-resolved | Required if optional deps skipped |
| `permissionMode` | `PermissionMode` | `'default'` | See list above |
| `permissionPromptToolName` | `string` | `undefined` | MCP tool for permission prompts |
| `persistSession` | `boolean` | `true` | Set `false` to skip JSONL write |
| `planModeInstructions` | `string` | `undefined` | Custom plan-mode prompt |
| `plugins` | `SdkPluginConfig[]` | `[]` | Local plugin paths |
| `promptSuggestions` | `boolean` | `false` | Emit `prompt_suggestion` messages |
| `resume` | `string` | `undefined` | Session ID to resume |
| `resumeSessionAt` | `string` | `undefined` | Resume at specific message UUID |
| `sandbox` | `SandboxSettings` | `undefined` | Sandbox programmatic config |
| `sessionId` | `string` | Auto-generated | Use specific UUID |
| `sessionStore` | `SessionStore` | `undefined` | Transcript mirror |
| `sessionStoreFlush` | `'batched' \| 'eager'` | `'batched'` | Alpha |
| `settings` | `string \| Settings` | `undefined` | Inline or path |
| `settingSources` | `SettingSource[]` | All sources | `"user" \| "project" \| "local"` |
| `skills` | `string[] \| 'all'` | `undefined` | Skill allowlist (`'all'` to enable every discovered) |
| `spawnClaudeCodeProcess` | function | `undefined` | Custom spawn (for VMs, remotes) |
| `stderr` | `(data: string) => void` | `undefined` | Stderr callback |
| `strictMcpConfig` | `boolean` | `false` | Ignore `.mcp.json` + user settings |
| `systemPrompt` | `string \| { type: 'preset'; preset: 'claude_code'; append?: string; excludeDynamicSections?: boolean }` | `undefined` (minimal default) | See [[docs-system-prompts]] |
| `taskBudget` | `{ total: number }` | `undefined` | Alpha: API-side task budget |
| `thinking` | `ThinkingConfig` | `{ type: 'adaptive' }` | Default = adaptive in TS |
| `title` | `string` | `undefined` | Display title |
| `toolAliases` | `Record<string, string>` | `undefined` | Map built-in tool names to MCP names |
| `toolConfig` | `ToolConfig` | `undefined` | Per-tool config (e.g. `askUserQuestion.previewFormat`) |
| `tools` | `string[] \| { type: 'preset'; preset: 'claude_code' }` | `undefined` | Tool list or preset |

## `Query` interface — control methods

After kicking off `const q = query({...})`, the returned object exposes runtime controls:

```typescript
interface Query extends AsyncGenerator<SDKMessage, void> {
  interrupt(): Promise<void>;
  rewindFiles(userMessageId: string, options?: { dryRun?: boolean }): Promise<RewindFilesResult>;
  setPermissionMode(mode: PermissionMode): Promise<void>;
  setModel(model?: string): Promise<void>;
  setMaxThinkingTokens(maxThinkingTokens: number | null): Promise<void>;
  applyFlagSettings(settings: Partial<Settings>): Promise<void>;
  initializationResult(): Promise<SDKControlInitializeResponse>;
  supportedCommands(): Promise<SlashCommand[]>;
  supportedModels(): Promise<ModelInfo[]>;
  supportedAgents(): Promise<AgentInfo[]>;
  mcpServerStatus(): Promise<McpServerStatus[]>;
  accountInfo(): Promise<AccountInfo>;
  reconnectMcpServer(serverName: string): Promise<void>;
  toggleMcpServer(serverName: string, enabled: boolean): Promise<void>;
  setMcpServers(servers: Record<string, McpServerConfig>): Promise<McpSetServersResult>;
  streamInput(stream: AsyncIterable<SDKUserMessage>): Promise<void>;
  stopTask(taskId: string): Promise<void>;
  close(): void;
}
```

`applyFlagSettings()` is the runtime knob: "Changes settings at runtime without restarting. Writes to the flag-settings layer (high precedence, overridden only by managed policy). Only available in streaming input mode." Pass `null` for a key to clear an override.

## `SDKMessage` union — observability events

The full union is long; the agent-loop-driving subset is `SDKSystemMessage | SDKAssistantMessage | SDKUserMessage | SDKResultMessage | SDKPartialAssistantMessage | SDKCompactBoundaryMessage`. Additional **TS-only** observability events that Python does not emit:

`SDKHookStartedMessage`, `SDKHookProgressMessage`, `SDKHookResponseMessage`, `SDKPluginInstallMessage`, `SDKToolProgressMessage`, `SDKAuthStatusMessage`, `SDKTaskStartedMessage`, `SDKTaskProgressMessage`, `SDKTaskUpdatedMessage`, `SDKTaskNotificationMessage`, `SDKSessionStateChangedMessage`, `SDKNotificationMessage`, `SDKFilesPersistedEvent`, `SDKToolUseSummaryMessage`, `SDKMemoryRecallMessage`, `SDKRateLimitEvent`, `SDKElicitationCompleteMessage`, `SDKPermissionDeniedMessage`, `SDKPromptSuggestionMessage`, `SDKAPIRetryMessage`, `SDKMirrorErrorMessage`.

`SDKResultMessage` error subtypes: `error_max_turns`, `error_during_execution`, `error_max_budget_usd`, `error_max_structured_output_retries`.

## `AgentDefinition` (TS)

```typescript
type AgentDefinition = {
  description: string;
  prompt: string;
  tools?: string[];
  disallowedTools?: string[];
  model?: string;
  mcpServers?: AgentMcpServerSpec[];
  skills?: string[];
  initialPrompt?: string;
  maxTurns?: number;
  background?: boolean;
  memory?: "user" | "project" | "local";
  effort?: "low" | "medium" | "high" | "xhigh" | "max" | number;
  permissionMode?: PermissionMode;
  criticalSystemReminder_EXPERIMENTAL?: string;
};
```

Note `effort` accepts a `number` (token budget) in addition to the named levels — a TS-only flexibility not exposed by the Python dataclass.

## MCP server config (TS)

```typescript
type McpServerConfig =
  | McpStdioServerConfig            // command + args + env
  | McpSSEServerConfig              // type: "sse"
  | McpHttpServerConfig             // type: "http" (or "streamable-http" in .mcp.json)
  | McpSdkServerConfigWithInstance; // type: "sdk", instance: McpServer
```

`.mcp.json` accepts `"streamable-http"` as an alias for `"http"`; the programmatic `mcpServers` option accepts only `"http"`.

## Environment-variable timeouts (chapter-worthy)

Pass through `env`:

- `API_TIMEOUT_MS` — per-request timeout (default `600000` ms)
- `CLAUDE_CODE_MAX_RETRIES` — max retries (default `10`)
- `CLAUDE_ASYNC_AGENT_STALL_TIMEOUT_MS` — stall watchdog for background subagents (default `600000` ms)
- `CLAUDE_ENABLE_STREAM_WATCHDOG=1` + `CLAUDE_STREAM_IDLE_TIMEOUT_MS` — abort on idle stream (off by default; min `300000` ms)
- `CLAUDE_AGENT_SDK_CLIENT_APP` — set in `User-Agent` for telemetry

## Cross-references

- See [[docs-python-reference]] for snake_case parity and Python-specific deltas (`ClaudeSDKClient` class, no `auto` mode, etc.).
- See [[docs-typescript-v2-preview-removed]] for the removed V2 session API.
- See [[docs-hooks-reference]] for the TS-only hook events.
- See [[docs-permissions]] for `PermissionMode` semantics including `"auto"`.
- See [[docs-system-prompts]] for `systemPrompt` preset/append/`excludeDynamicSections` mechanics.
- See [[github-claude-agent-sdk-typescript]] for live `v0.3.149` metadata.

## Open questions / follow-ups

- `taskBudget`, `sessionStore`, `sessionStoreFlush`, `loadTimeoutMs` all marked alpha — chapter authors should not document them as stable.
- `criticalSystemReminder_EXPERIMENTAL` on `AgentDefinition` is suffixed `_EXPERIMENTAL` and undocumented elsewhere — worth a follow-up if a chapter wants to use it.
- The `auto` permission mode (TS-only) defers to a "model classifier" — no detail on which classifier or its accuracy; the page links to `/en/permission-modes#eliminate-prompts-with-auto-mode` which should be sourced separately if needed.
- `resolveSettings()` is alpha and surfaces MDM-deployed settings (macOS plist / Windows registry). Enterprise chapter material.
