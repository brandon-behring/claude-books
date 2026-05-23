---
source_url: https://code.claude.com/docs/en/agent-sdk/quickstart
canonical_url: https://code.claude.com/docs/en/agent-sdk/quickstart
source_title: Quickstart
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [1]
cert_task_areas: ["Agentic loops", "Agent SDK hooks"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Quickstart — bug-fixing agent in minutes

The on-ramp page that walks a first-time user through installing the SDK, setting an API key, dropping in a buggy `utils.py`, and running a `query()`-driven agent that finds and fixes the bugs autonomously.

## Key takeaways

- **Prerequisites**: Node.js 18+ or Python 3.10+ and an Anthropic account.
- **Two install paths** for Python — `uv init && uv add claude-agent-sdk` (recommended; uv handles venvs) or `pip install claude-agent-sdk` inside a manual venv. TypeScript: `npm install @anthropic-ai/claude-agent-sdk`.
- **Canonical first program**: `query()` async-for loop with `allowed_tools=["Read", "Edit", "Glob"]` and `permission_mode="acceptEdits"` to run end-to-end without manual approval.
- **Three orthogonal axes** the page makes explicit:
  - **Tools** = what the agent can do (Read/Edit/Bash/etc.; permissive lists vs read-only)
  - **Permission modes** = how much human oversight (`acceptEdits`, `dontAsk`, `auto`, `bypassPermissions`, `default`)
  - **Authentication** = where the credit/billing comes from (Anthropic vs Bedrock/Vertex/Foundry/AWS)
- **Opus 4.7 upgrade note**: the page documents a known error — "API Error: 400 \"thinking.type.enabled\" is not supported for this model" — which is fixed in **Agent SDK v0.2.111+**. Opus 4.7 uses `thinking.type.adaptive` and `output_config.effort` rather than the legacy `thinking.type.enabled` block.

## Quoted (citation-ready)

> "The `async for` loop keeps running as Claude thinks, calls tools, observes results, and decides what to do next. Each iteration yields a message: Claude's reasoning, a tool call, a tool result, or the final outcome. The SDK handles the orchestration (tool execution, context management, retries) so you just consume the stream."
>
> — Quickstart, Build an agent that finds and fixes bugs
>
> Anchor: `Build an agent that finds and fixes bugs + The async for loop keeps running`

> "Tools control what your agent can do … Permission modes control how much human oversight you want."
>
> — Quickstart, Key concepts
>
> Anchor: `Key concepts + Tools control what your agent can do`

## The minimal autonomous agent (Python)

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage


async def main():
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],
            permission_mode="acceptEdits",
        ),
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")


asyncio.run(main())
```

The agent autonomously **Reads** `utils.py`, **Analyzes** edge cases that would crash (e.g., `calculate_average([])`, `get_user_name(None)`), and **Edits** the file to add defensive handling — without further user input.

## Tool / permission-mode reference tables (from the page)

**Tools quick-pick:**

| Tools | What the agent can do |
|---|---|
| `Read`, `Glob`, `Grep` | Read-only analysis |
| `Read`, `Edit`, `Glob` | Analyze and modify code |
| `Read`, `Edit`, `Bash`, `Glob`, `Grep` | Full automation |

**Permission modes quick-pick:**

| Mode | Behavior | Use case |
|---|---|---|
| `acceptEdits` | Auto-approves file edits and common filesystem commands; asks for other actions | Trusted development workflows |
| `dontAsk` | Denies anything not in `allowedTools` | Locked-down headless agents |
| `auto` (TS only) | Model classifier approves or denies each tool call | Autonomous agents with safety guardrails |
| `bypassPermissions` | Runs every tool without prompts | Sandboxed CI, fully trusted environments |
| `default` | Requires a `canUseTool` callback to handle approval | Custom approval flows |

## Cross-references

- See [[docs-overview]] for the SDK's place in the Claude product stack and the broader feature inventory.
- See [[docs-agent-loop]] for the deeper "what happens inside `query()`" walkthrough.
- See [[docs-permissions]] for the full permission-evaluation order (modes are step 3 of 5).
- See [[docs-user-input]] for `canUseTool` callback patterns that pair with `permission_mode="default"`.

## Open questions / follow-ups

- The quickstart hard-codes `permission_mode="acceptEdits"` — chapter authors may want to lead with `default` + `canUseTool` for safety-first framing; both are valid entry points.
- The Opus 4.7 error message is a "known migration" hazard worth surfacing in the handbook's troubleshooting chapter.
