---
source_url: https://code.claude.com/docs/en/agent-sdk/overview
canonical_url: https://code.claude.com/docs/en/agent-sdk/overview
source_title: Agent SDK overview
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: agent-sdk
tier: T1-official
cert_domains: [1, 2]
cert_task_areas: ["Agentic loops", "Agent SDK hooks", "Subagent invocation", "Session state", "MCP server config", "Built-in tools"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Agent SDK overview — entry-point note

The top-level docs page describing what the Claude Agent SDK is, what it gives you, and how it relates to the Anthropic Client SDK, the Claude Code CLI, and Managed Agents. This note serves as the dossier's gateway; per-feature deep dives live in sibling notes.

## Key takeaways

- **Two packages** (the same agent loop, two language surfaces):
  - **Python**: `claude-agent-sdk` (`pip install claude-agent-sdk`); current version `v0.2.86` (2026-05-22, MIT-licensed).
  - **TypeScript**: `@anthropic-ai/claude-agent-sdk` (`npm install @anthropic-ai/claude-agent-sdk`); current version `v0.3.149` (2026-05-22). The TS package **bundles a native Claude Code binary** for the host platform as an optional dependency — no separate CLI install required.
- **Authentication paths**: `ANTHROPIC_API_KEY` for Anthropic direct, or one of four bring-your-own-cloud env vars: `CLAUDE_CODE_USE_BEDROCK=1` (Amazon Bedrock), `CLAUDE_CODE_USE_ANTHROPIC_AWS=1` + `ANTHROPIC_AWS_WORKSPACE_ID` (Claude Platform on AWS), `CLAUDE_CODE_USE_VERTEX=1` (Google Vertex AI), `CLAUDE_CODE_USE_FOUNDRY=1` (Microsoft Azure AI Foundry).
- **Anthropic prohibits claude.ai-login passthrough** for SDK-built products: "Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK." API-key auth only unless previously approved.
- **Six capability surfaces** highlighted on the overview, each a separate sub-page: **Built-in tools**, **Hooks**, **Subagents**, **MCP**, **Permissions**, **Sessions**. Plus Claude Code filesystem features (Skills, Slash commands, Memory/CLAUDE.md, Plugins) via `setting_sources` / `settingSources`.
- **Agent SDK credit (subscription-plan pricing change inbound)**: starting **2026-06-15**, Agent SDK and `claude -p` usage on subscription plans draws from a separate monthly **Agent SDK credit** allotment, independent of interactive Claude Code usage limits. See [support.claude.com/en/articles/15036540](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan).
- **Branding rules for partners**: "Claude Agent" is the preferred dropdown label; "{YourAgentName} Powered by Claude" is allowed. "Claude Code" or "Claude Code Agent" naming is **not permitted** for SDK-built products — your product cannot appear to be Claude Code.
- **Commercial Terms apply** by default ("including when you use it to power products and services that you make available to your own customers and end users") with per-component LICENSE exceptions.

## Quoted (citation-ready)

> "Build AI agents that autonomously read files, run commands, search the web, edit code, and more. The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript."
>
> — Agent SDK overview, opening paragraph
>
> Anchor: `Agent SDK overview + Build AI agents that autonomously`

> "Starting June 15, 2026, Agent SDK and `claude -p` usage on subscription plans will draw from a new monthly Agent SDK credit, separate from your interactive usage limits."
>
> — Agent SDK overview, Note callout
>
> Anchor: `Agent SDK overview + Starting June 15, 2026, Agent SDK and claude -p`

> "Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK. Please use the API key authentication methods described in this document instead."
>
> — Agent SDK overview, Set your API key step
>
> Anchor: `Set your API key + Unless previously approved`

## Minimal example (Python)

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions


async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
    ):
        print(message)


asyncio.run(main())
```

## Minimal example (TypeScript)

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.ts",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);
}
```

Note the Python/TS naming difference: `allowed_tools` (snake_case Python dataclass) vs `allowedTools` (TS object property). The wire format is camelCase; the Python SDK exposes snake_case at the dataclass layer.

## How the SDK differs from sibling Claude surfaces

The overview page includes a comparison-table tabset; the key distinctions are:

| Comparison | What the overview says |
|---|---|
| **vs Anthropic Client SDK** | "With the Client SDK, you implement a tool loop. With the Agent SDK, Claude handles it." Client SDK = direct API + your tool executor; Agent SDK = managed agent loop with built-in tools. |
| **vs Claude Code CLI** | Same capabilities, different interface. Suggested mix: "CLI for daily development, SDK for production. Workflows translate directly between them." |
| **vs Managed Agents** (hosted REST API) | Agent SDK runs in your process / your infrastructure; Managed Agents runs on Anthropic-managed infra with a per-session sandbox. Suggested path: "prototype with the Agent SDK locally, then move to Managed Agents for production." |

## Sub-page TOC (from the docs index)

The overview page links forward to these sub-pages — each gets its own note in this dossier:

- `/en/agent-sdk/quickstart` → [[docs-quickstart]]
- `/en/agent-sdk/python` (Python API reference) → [[docs-python-reference]]
- `/en/agent-sdk/typescript` (TypeScript API reference) → [[docs-typescript-reference]]
- `/en/agent-sdk/typescript-v2-preview` (V2 removed) → [[docs-typescript-v2-preview-removed]]
- `/en/agent-sdk/agent-loop` → [[docs-agent-loop]]
- `/en/agent-sdk/sessions` → [[docs-sessions]]
- `/en/agent-sdk/hooks` → [[docs-hooks-reference]]
- `/en/agent-sdk/subagents` → [[docs-subagents]]
- `/en/agent-sdk/mcp` → [[docs-mcp]]
- `/en/agent-sdk/permissions` → [[docs-permissions]]
- `/en/agent-sdk/skills` → [[docs-skills]]
- `/en/agent-sdk/claude-code-features` → [[docs-claude-code-features]]
- `/en/agent-sdk/modifying-system-prompts` → [[docs-system-prompts]]
- `/en/agent-sdk/user-input` → [[docs-user-input]]
- `/en/agent-sdk/structured-outputs` → [[docs-structured-outputs]]
- Also referenced but deferred to other dossiers: `/en/agent-sdk/streaming-output`, `/en/agent-sdk/streaming-vs-single-mode`, `/en/agent-sdk/slash-commands`, `/en/agent-sdk/plugins`, `/en/agent-sdk/custom-tools`, `/en/agent-sdk/file-checkpointing`, `/en/agent-sdk/hosting`, `/en/agent-sdk/session-storage`, `/en/agent-sdk/secure-deployment`, `/en/agent-sdk/tool-search`, `/en/agent-sdk/cost-tracking`.

## Cross-references

- See [[github-claude-agent-sdk-python]] and [[github-claude-agent-sdk-typescript]] for repo metadata and release cadence.
- See [[docs-agent-loop]] for the canonical agent-loop walkthrough (the SDK's central concept).
- See `02-mcp-spec/` for the MCP protocol that the `mcp_servers` option exposes.
- See `docs/landscape-2026-05.md` §1.4 for high-level framing this dossier supplements.

## Open questions / follow-ups

- The overview links example agents at `github.com/anthropics/claude-agent-sdk-demos` — confirm star count, license, and currency of those demos for a separate `github-demos.md` if chapters cite them.
- The "Agent SDK credit" allotment is announced for 2026-06-15 but the page does not specify the credit's monthly token / dollar value — track the linked support article.
- Branding-guideline enforcement: the overview lists "not permitted" naming but says nothing about consequences. Worth following up with sales if a chapter takes a strong position on partner branding.
