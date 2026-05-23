---
source_url: https://code.claude.com/docs/en/agent-sdk/python
canonical_url: https://code.claude.com/docs/en/agent-sdk/python
source_title: Agent SDK reference - Python
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

# Python SDK API reference — exhaustive field list

The canonical Python API reference. This note enumerates every exported function, class, and `ClaudeAgentOptions` field documented on the page. Pair with [[docs-typescript-reference]] for the TS surface and [[docs-agent-loop]] for execution semantics.

## Key takeaways

- **Two top-level entry points**:
  - `query()` — async function returning `AsyncIterator[Message]` for single-conversation work.
  - `ClaudeSDKClient` — context-manager class for **multi-turn conversations** in one process; the Python equivalent of how the TypeScript SDK's `query()` works internally.
- **`query()` signature** is keyword-only:

  ```python
  async def query(
      *,
      prompt: str | AsyncIterable[dict[str, Any]],
      options: ClaudeAgentOptions | None = None,
      transport: Transport | None = None,
  ) -> AsyncIterator[Message]
  ```

- **`ClaudeAgentOptions` is a `@dataclass`** with **40+ fields** (see Configuration section). Field names use **snake_case**.
- **`AgentDefinition` uses camelCase field names** (`disallowedTools`, `permissionMode`, `mcpServers`, `initialPrompt`, `maxTurns`) to match the wire format — explicitly different from `ClaudeAgentOptions`.
- **TypedDict vs `@dataclass`** matters: `@dataclass` classes (`ResultMessage`, `TextBlock`, `AgentDefinition`) support attribute access (`msg.result`); `TypedDict` classes (`ThinkingConfigEnabled`, `McpStdioServerConfig`, `SyncHookJSONOutput`) are plain dicts at runtime and need key access (`config["budget_tokens"]`).
- **Session management API**: `list_sessions()`, `get_session_messages()`, `get_session_info()`, `rename_session()`, `tag_session()` for enumerating and mutating session files on disk.
- **In-process MCP**: `tool()` decorator + `create_sdk_mcp_server()` for defining tools as Python async functions without spawning a child process.

## Quoted (citation-ready)

> "Creates a new session for each interaction with Claude Code by default. Returns an async iterator that yields messages as they arrive."
>
> — Python SDK reference, `query()` description
>
> Anchor: `query() + Creates a new session for each interaction`

> "Maintains a conversation session across multiple exchanges. This is the Python equivalent of how the TypeScript SDK's `query()` function works internally."
>
> — Python SDK reference, ClaudeSDKClient class description
>
> Anchor: `ClaudeSDKClient + Maintains a conversation session across multiple exchanges`

> "When iterating over messages, avoid using `break` to exit early as this can cause asyncio cleanup issues. Instead, let the iteration complete naturally or use flags to track when you've found what you need."
>
> — Python SDK reference, Important Notes
>
> Anchor: `Important Notes + When iterating over messages, avoid using break`

## `ClaudeAgentOptions` — full field list

Snake_case fields on the dataclass (defaults shown where the docs specify them):

| Field | Type | Default | Description |
|---|---|---|---|
| `tools` | `list[str] \| ToolsPreset \| None` | `None` | Tools configuration. Use `{"type": "preset", "preset": "claude_code"}` for Claude Code defaults |
| `allowed_tools` | `list[str]` | `[]` | Tools to auto-approve without prompting |
| `system_prompt` | `str \| SystemPromptPreset \| None` | `None` | System prompt configuration |
| `mcp_servers` | `dict[str, McpServerConfig] \| str \| Path` | `{}` | MCP server configurations or path to config file |
| `strict_mcp_config` | `bool` | `False` | Ignore `.mcp.json` / user settings if `True`; only use `mcp_servers` |
| `permission_mode` | `PermissionMode \| None` | `None` | Permission mode for tool usage |
| `continue_conversation` | `bool` | `False` | Continue the most recent conversation |
| `resume` | `str \| None` | `None` | Session ID to resume |
| `max_turns` | `int \| None` | `None` | Maximum agentic turns (tool-use round trips) |
| `max_budget_usd` | `float \| None` | `None` | Stop query when client-side cost estimate reaches this USD value |
| `disallowed_tools` | `list[str]` | `[]` | Tools to deny |
| `model` | `str \| None` | `None` | Claude model to use |
| `fallback_model` | `str \| None` | `None` | Fallback model if primary fails |
| `betas` | `list[SdkBeta]` | `[]` | Beta features to enable |
| `output_format` | `dict[str, Any] \| None` | `None` | Output format for structured responses |
| `permission_prompt_tool_name` | `str \| None` | `None` | MCP tool name for permission prompts |
| `cwd` | `str \| Path \| None` | `None` | Current working directory |
| `cli_path` | `str \| Path \| None` | `None` | Custom path to Claude Code CLI executable |
| `settings` | `str \| None` | `None` | Path to settings file |
| `add_dirs` | `list[str \| Path]` | `[]` | Additional directories Claude can access |
| `env` | `dict[str, str]` | `{}` | Environment variables |
| `extra_args` | `dict[str, str \| None]` | `{}` | Additional CLI arguments |
| `max_buffer_size` | `int \| None` | `None` | Maximum bytes when buffering CLI stdout |
| `stderr` | `Callable[[str], None] \| None` | `None` | Callback function for stderr output |
| `debug_stderr` | `Any` | `sys.stderr` | *Deprecated* — use `stderr` |
| `can_use_tool` | `CanUseTool \| None` | `None` | Tool permission callback function |
| `hooks` | `dict[HookEvent, list[HookMatcher]] \| None` | `None` | Hook configurations |
| `user` | `str \| None` | `None` | User identifier |
| `include_partial_messages` | `bool` | `False` | Include partial message streaming events |
| `include_hook_events` | `bool` | `False` | Include hook lifecycle events in message stream |
| `fork_session` | `bool` | `False` | When resuming, fork to new session ID instead of continuing |
| `agents` | `dict[str, AgentDefinition] \| None` | `None` | Programmatically defined subagents |
| `setting_sources` | `list[SettingSource] \| None` | `None` (CLI default: all sources) | Control which filesystem settings to load |
| `sandbox` | `SandboxSettings \| None` | `None` | Configure sandbox behavior programmatically |
| `plugins` | `list[SdkPluginConfig]` | `[]` | Load custom plugins from local paths |
| `max_thinking_tokens` | `int \| None` | `None` | *Deprecated* — use `thinking` instead |
| `thinking` | `ThinkingConfig \| None` | `None` | Controls extended/adaptive thinking behavior |
| `effort` | `EffortLevel \| None` | `None` | Effort level for thinking depth |
| `enable_file_checkpointing` | `bool` | `False` | Enable file change tracking for rewinding |
| `session_store` | `SessionStore \| None` | `None` | Mirror session transcripts to external backend |
| `session_store_flush` | `Literal["batched", "eager"]` | `"batched"` | When to flush mirrored transcript entries |

## `ClaudeSDKClient` methods (selected)

Context-manager class for multi-turn conversations. Selected methods (full list in source page):

- `async connect(prompt)` — connect with optional initial prompt
- `async query(prompt, session_id)` — send a new request in streaming mode
- `async receive_messages()` — async iterator over all messages
- `async receive_response()` — receive messages until and including `ResultMessage`
- `async interrupt()` — send interrupt signal (streaming mode only). **Important behavior:** "Messages already produced by the interrupted task, including its `ResultMessage` (with `subtype="error_during_execution"`), remain in the stream. You must drain them with `receive_response()` before reading the response to a new query."
- `async set_permission_mode(mode)` — change permission mode mid-session
- `async set_model(model)` — change model mid-session
- `async rewind_files(user_message_id)` — restore files to state at a specific user message
- `async get_mcp_status()` / `reconnect_mcp_server(server_name)` / `toggle_mcp_server(name, enabled)` — runtime MCP management
- `async stop_task(task_id)` — stop a running background task

## `AgentDefinition` — fields (camelCase!)

```python
@dataclass
class AgentDefinition:
    description: str               # Required
    prompt: str                    # Required
    tools: list[str] | None = None
    disallowedTools: list[str] | None = None
    model: str | None = None       # "sonnet" | "opus" | "haiku" | "inherit" | full ID
    skills: list[str] | None = None
    memory: Literal["user", "project", "local"] | None = None
    mcpServers: list[str | dict[str, Any]] | None = None
    initialPrompt: str | None = None
    maxTurns: int | None = None
    background: bool | None = None
    effort: EffortLevel | int | None = None
    permissionMode: PermissionMode | None = None
```

The page calls out: "Field names in `AgentDefinition` use camelCase (e.g., `disallowedTools`, `permissionMode`) unlike `ClaudeAgentOptions` which uses snake_case." This is a frequent gotcha — flag it in chapter examples.

## Permission types

```python
PermissionMode = Literal[
    "default",
    "acceptEdits",
    "plan",
    "dontAsk",
    "bypassPermissions",
]
# Note: TS adds "auto" (model-classifier); Python does not.
```

```python
EffortLevel = Literal["low", "medium", "high", "xhigh", "max"]
# "xhigh" is Opus 4.7-only per docs/landscape-2026-05.md §1.1
```

```python
SettingSource = Literal["user", "project", "local"]
SdkBeta = Literal["context-1m-2025-08-07"]
```

## Message types (Union)

```python
Message = (
    UserMessage
    | AssistantMessage
    | SystemMessage
    | ResultMessage
    | StreamEvent
    | RateLimitEvent
)
```

Key facts:

- `SystemMessage.subtype == "init"` carries `session_id` inside `SystemMessage.data["session_id"]` (Python; TS has it at the top level).
- `ResultMessage.subtype` is the termination indicator: `success | error_max_turns | error_during_execution | error_max_budget_usd | error_max_structured_output_retries`.
- `ResultMessage.usage` dict keys: `input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`.
- `ResultMessage.model_usage` (per-model, camelCase keys): `inputTokens`, `outputTokens`, `cacheReadInputTokens`, `cacheCreationInputTokens`, `webSearchRequests`, `costUSD`, `contextWindow`, `maxOutputTokens`.
- `ResultMessage.structured_output: Any` — populated when `output_format` is set; see [[docs-structured-outputs]].
- `ResultMessage.deferred_tool_use: DeferredToolUse | None` — populated when a hook returned `permissionDecision: "defer"` and the query ended for later resumption.

## MCP server config — Python union shapes

```python
McpServerConfig = (
    McpStdioServerConfig
    | McpSSEServerConfig
    | McpHttpServerConfig
    | McpSdkServerConfig
)
```

Each is a `TypedDict` (dict at runtime). `McpSdkServerConfig` carries `instance: Any` — an in-process MCP `Server` instance from `create_sdk_mcp_server()`.

## Custom tools API

```python
def tool(
    name: str,
    description: str,
    input_schema: type | dict[str, Any],
    annotations: ToolAnnotations | None = None,
) -> Callable[..., SdkMcpTool[Any]]

def create_sdk_mcp_server(
    name: str, version: str = "1.0.0", tools: list[SdkMcpTool[Any]] | None = None
) -> McpSdkServerConfig
```

These compose with `ClaudeAgentOptions.mcp_servers` to expose custom Python tools to Claude inside the same process. The README confirms: "in-process MCP servers that run directly within your Python application, eliminating the need for separate processes that regular MCP servers require."

## Cross-references

- See [[docs-typescript-reference]] for the parallel TS surface and the differences (no `auto` permission mode in Python; no `SessionStart`/`SessionEnd` SDK callback hooks in Python; etc.).
- See [[docs-hooks-reference]] for the full hook event list and the Python-vs-TS parity table.
- See [[docs-subagents]] for `AgentDefinition` usage patterns.
- See [[docs-sessions]] for `resume`/`fork_session`/`ClaudeSDKClient` patterns.
- See [[docs-permissions]] for `PermissionMode` semantics.
- See [[docs-mcp]] for `mcp_servers` server-type selection.
- See [[github-claude-agent-sdk-python]] for the live `v0.2.86` package metadata.

## Open questions / follow-ups

- `SandboxSettings` referenced via the `sandbox` option but no schema detail surfaced on the Python reference page itself — likely on `/en/agent-sdk/sandbox` (defer to chapter author's needs).
- `SessionStore` / `session_store_flush` semantics need their own note if a chapter cross-references the [[github-claude-agent-sdk-python]] CHANGELOG for the "session storage adapter" feature.
- `extra_args` is documented as `dict[str, str | None]` — the empty-string vs `None` distinction's effect on CLI arg passing isn't spelled out on this page.
