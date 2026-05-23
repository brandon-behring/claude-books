---
source_url: https://github.com/anthropics/claude-agent-sdk-python
canonical_url: https://github.com/anthropics/claude-agent-sdk-python
source_title: anthropics/claude-agent-sdk-python (GitHub repo)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T2-release-notes
cert_domains: [1, 2]
cert_task_areas: ["Agentic loops", "Subagent invocation", "Agent SDK hooks", "MCP server config"]
volatility: fast-moving
verified: true
supersedes: []
superseded_by: []
---

# `anthropics/claude-agent-sdk-python` — repo metadata + release cadence

The Python Agent SDK package. Originally named "Claude Code SDK"; renamed to "Claude Agent SDK" to reflect the broader agentic scope.

## Key takeaways

- **Repo**: [`anthropics/claude-agent-sdk-python`](https://github.com/anthropics/claude-agent-sdk-python)
- **Stars (2026-05-22)**: 7,014
- **License**: MIT
- **Created**: 2025-06-11
- **Last push**: 2026-05-22 22:57 UTC
- **Default branch**: `main`
- **Current release**: **v0.2.86** (2026-05-22)
- **Release cadence**: ~daily during May 2026 (v0.2.86 May 22, v0.2.85 May 22, v0.2.84 May 21, v0.2.83 May 21, v0.2.82 May 15) — fast-moving package.
- **PyPI**: `pip install claude-agent-sdk` (requires Python 3.10+).
- **The Claude Code CLI is bundled** with the package — no separate install required. To override: `ClaudeAgentOptions(cli_path="/path/to/claude")`.

## Quoted (citation-ready)

> "Python SDK for Claude Agent. See the [Claude Agent SDK documentation](https://platform.claude.com/docs/en/agent-sdk/python) for more information."
>
> — README.md, opening line
>
> Anchor: `README.md + Python SDK for Claude Agent`

> "By default, Claude has access to the full Claude Code toolset (Read, Write, Edit, Bash, and others). `allowed_tools` is a permission allowlist: listed tools are auto-approved, and unlisted tools fall through to `permission_mode` and `can_use_tool` for a decision. It does not remove tools from Claude's toolset. To block specific tools, use `disallowed_tools`."
>
> — README.md, Using Tools section
>
> Anchor: `Using Tools + By default, Claude has access to the full Claude Code toolset`

## Two-API model (from README)

The README is explicit about when to use which entry point:

- **`query()`** (`from claude_agent_sdk import query`) — async function returning an `AsyncIterator` of response messages. For single-conversation work.
- **`ClaudeSDKClient`** (`from claude_agent_sdk import ClaudeSDKClient`) — bidirectional, interactive conversations. Unlike `query()`, `ClaudeSDKClient` additionally enables **custom tools** and **hooks**, both of which can be defined as Python functions.

## Custom tool decorator (canonical pattern)

```python
from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions, ClaudeSDKClient

@tool("greet", "Greet a user", {"name": str})
async def greet_user(args):
    return {"content": [{"type": "text", "text": f"Hello, {args['name']}!"}]}

server = create_sdk_mcp_server(name="my-tools", version="1.0.0", tools=[greet_user])
```

These are "in-process MCP servers that run directly within your Python application, eliminating the need for separate processes that regular MCP servers require."

## Recent release cadence (5 most recent)

| Tag | Published |
|---|---|
| `v0.2.86` | 2026-05-22 |
| `v0.2.85` | 2026-05-22 |
| `v0.2.84` | 2026-05-21 |
| `v0.2.83` | 2026-05-21 |
| `v0.2.82` | 2026-05-15 |

For chapters that pin a specific minimum version, current floor that supports Opus 4.7 adaptive thinking is **v0.2.111** (per [[docs-quickstart]] troubleshooting) — but the PYTHON CHANGELOG numbering is `0.2.x` while the TS is `0.3.x`, so be careful about cross-language version pinning.

## Cross-references

- See [[docs-python-reference]] for the API reference.
- See [[github-claude-agent-sdk-typescript]] for the sibling repo.
- See [[docs-overview]] for the SDK's position in the Anthropic product stack.

## Open questions / follow-ups

- The repo has no `homepageUrl` set despite the README pointing to `platform.claude.com/docs/en/agent-sdk/python`. Minor.
- Whether `v0.2.111` (referenced in [[docs-quickstart]] for Opus 4.7) actually exists in the release stream or is a forward-looking version. As of 2026-05-22, latest tag is v0.2.86 — the Opus 4.7 fix may live in v0.2.86 or a newer version not yet tagged.
- The README references `src/claude_agent_sdk/query.py` and `src/claude_agent_sdk/client.py` as authoritative sources for `query()` and `ClaudeSDKClient` — chapter authors who need ground truth may want to read those directly.
