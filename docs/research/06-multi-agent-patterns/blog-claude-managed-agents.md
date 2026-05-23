---
source_url: https://claude.com/blog/claude-managed-agents
canonical_url: https://claude.com/blog/claude-managed-agents
source_title: "Claude Managed Agents: get to production 10x faster"
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

# claude.com blog — Claude Managed Agents: get to production 10x faster

Anthropic's productized take on the multi-agent research-system pattern. Public beta on Claude Platform from Apr 8, 2026; the three additional capabilities (Multiagent Orchestration, Outcomes, Dreaming) were announced/expanded at Code with Claude SF on May 6, 2026. This is the source for the **named launch customers** (Notion, Rakuten, Asana, Sentry, Atlassian, ServiceNow) and the **8 cents per session-hour** runtime pricing.

## Key takeaways

- **Claude Managed Agents** is a pre-built configurable **agent harness** that runs in Anthropic-managed (or self-hosted) infrastructure. Handles sandboxing, authentication, tool execution, prompt caching, compaction, and other performance optimizations. Public beta on Claude Platform; beta header `managed-agents-2026-04-01` required on all requests.
- **Three new capabilities announced May 6 at Code with Claude SF** (some in beta, Dreaming in research preview):
  1. **Multiagent Orchestration** (public beta) — lead agent fans work out to specialist subagents running in parallel
  2. **Outcomes** (public beta) — self-grading evaluator scores agent output against a written rubric and tells it what to fix
  3. **Dreaming** (research preview) — background task reviews past sessions, identifies patterns, updates persistent memory; "agents review prior sessions and self-improve via memory artifacts"
- **Stateful by design**: sessions are long-running, resume cleanly after pauses, store conversation history, container state, and outputs server-side. Consequence: **not currently eligible for ZDR or HIPAA BAA** coverage.
- **Pricing**: standard Claude Platform token rates **plus $0.08 per session-hour** for active runtime.
- **Named launch customers**: Notion (Custom Agents alpha), Rakuten (specialist agents in <1 week), Asana (AI Teammates), Sentry (Seer + patch-writer combo), Atlassian (in-Jira agents), Vibecode (10× infra spin-up), ServiceNow.
- **Rate limits**: 300 create RPM, 600 read RPM per org.
- **Reported performance** (May 6 announcement): Harvey ~6× task completion improvement; Outcomes self-grading shows up to 10-point task-success improvement; Wisedocs 50% faster reviews.

## Quoted (citation-ready)

> "Claude Managed Agents is stateful by design: sessions are long-running, resume cleanly after pauses, and store conversation history, container state, and outputs server-side."
>
> — Claude Managed Agents overview docs
>
> Anchor: `Overview + "Claude Managed Agents is stateful by design"`

> "Agents can spin up and direct other agents to parallelize complex work" (research preview—access requires request).
>
> — Claude Managed Agents launch announcement
>
> Anchor: `Launch announcement + multi-agent coordination capability description`

> "Memory lets each agent capture what it learns as it works."
>
> — Code with Claude SF 2026, Dreaming announcement (May 6 2026)
>
> Anchor: `Dreaming announcement + cross-session memory description`

> "With Claude Managed Agents, we can build agents for developers directly into the workflows teams already rely on in weeks instead of months, so customers can assign tasks right from Jira."
>
> — Sanchan Saxena, SVP, Head of Product, Atlassian
>
> Anchor: `Launch announcement customer quote section`

> "Spin up infrastructure at least 10x quicker than before."
>
> — Ansh Nanda, Co-founder, Vibecode
>
> Anchor: `Launch announcement customer quote section`

## Architecture (productized hub-and-spoke)

**Four core concepts** (per overview docs):

| Concept | Description |
|---|---|
| **Agent** | The model, system prompt, tools, MCP servers, and skills |
| **Environment** | Where sessions run: Anthropic-managed cloud container or self-hosted sandbox |
| **Session** | A running agent instance within an environment, performing a specific task |
| **Events** | Messages exchanged between application and agent (user turns, tool results, status updates) |

**Multiagent topology** (per `docs-multiagent-sessions.md`):

- **Shared container, filesystem, and vault credentials** across all agents in a session (consistent with the "artifacts pattern" from the multi-agent research-system blog).
- **Each agent runs in its own session thread** — context-isolated event stream with its own conversation history (consistent with "isolated subagent contexts" from the research-system blog).
- **Coordinator delegates to up to 20 unique agents** declared in `multiagent.agents`; coordinator can call multiple copies of each.
- **Depth > 1 is ignored** — coordinator can only delegate to one level of agents (no recursive hierarchies in beta).
- **Threads are persistent**: the coordinator can send a follow-up to an agent it called earlier, and that agent retains everything from its previous turns.
- **Max 25 concurrent threads** per session.
- **`{"type": "self"}`** entry lets the coordinator spawn copies of itself.

## The three new capabilities (Code w/ Claude SF, May 6 2026)

### Multiagent Orchestration (public beta)

Lead agent fans a job out to specialist subagents running in parallel. Each specialist runs with its own model, prompt, and tools. **Three patterns documented**:

- **Parallelization** — fan out independent subtasks (searching multiple sources, analyzing separate files)
- **Specialization** — route to domain-focused agents instead of one bloated generalist
- **Escalation** — consult a more capable agent for a complex subset

(These map 1:1 to the three scenarios in `blog-when-to-use-multi-agent.md` — context protection, parallelization, specialization — confirming the decision framework drove the product design.)

### Outcomes (public beta)

Self-grading loop where a **separate evaluator scores agent output against a written rubric and tells it what to fix**. Reported metrics from the May 6 announcement:
- Up to 10-point improvement in task success on structured file generation
- 8.4% quality increase on .docx files
- 10.1% quality increase on .pptx files

**This is the productized equivalent of the "verification subagent pattern"** from `blog-when-to-use-multi-agent.md`. Whether Outcomes replaces manual verification is an open question (see follow-ups).

### Dreaming (research preview)

Cross-session memory. Background process runs between jobs, **reviews past sessions to find patterns**, and updates persistent memory. Two control modes:
- **Automatic** — dreaming updates memory without review
- **Review-before-land** — changes are surfaced for human review

Harvey reported ~6× task-completion improvement with Dreaming enabled (internal testing).

## Launch customers

| Customer | Use case | Quote attribution |
|---|---|---|
| Notion | Custom Agents alpha — delegate work to Claude inside workspace | Eric Liu, Product Manager |
| Rakuten | Enterprise agents (product/sales/marketing/finance) in Slack & Teams; deployed in <1 week | Yusuke Kaji, GM of AI for Business |
| Asana | AI Teammates working alongside humans inside Asana projects | Amritansh Raghav, CTO |
| Sentry | Seer debugging agent + Claude patch-writer + PR-opener pipeline | Indragie Karunaratne, Sr Director Eng AI/ML |
| Atlassian | In-Jira developer agents; "weeks instead of months" delivery | Sanchan Saxena, SVP Head of Product |
| Vibecode | "10× quicker" infrastructure spin-up | Ansh Nanda, Co-founder |
| ServiceNow | Claude default for Build Agent; rolled to **29,000+ employees** for sales prep (95% reduction reported) | per ServiceNow newsroom & anthropic.com/news/servicenow-anthropic-claude |

ServiceNow + Anthropic partnership announced **Jan 28, 2026**; the 29K-employee rollout includes both Claude (sales prep) and Claude Code (engineering); Build Agent usage expected to **quadruple over the next 12 months**.

## Beta + research-preview status (2026-05-22)

| Feature | Status | Beta header |
|---|---|---|
| Claude Managed Agents core | Public beta | `managed-agents-2026-04-01` |
| Multiagent Orchestration | Public beta | (same header) |
| Outcomes | Public beta | (same header) |
| Dreaming | Research preview (request access) | (same header) |
| MCP tunnels | Research preview (request access) | (same header) |

## Built-in tool set (for Managed Agents)

- **Bash** — shell commands in container
- **File ops** — Read, Write, Edit, Glob, Grep
- **Web** — web search and fetch
- **MCP servers** — external tool providers

(Tool list aligns with the Agent SDK built-ins documented in landscape-2026-05.md §1.4.)

## Branding (relevant for OEM/embed integrations)

- **Allowed**: "Claude Agent" (preferred in dropdowns), "Claude" (inside an Agents-labeled menu), "{YourAgentName} Powered by Claude"
- **Not permitted**: "Claude Code", "Claude Cowork", anything that mimics Claude Code branding/ASCII art

## Cross-references

- See [[blog-multi-agent-research-system]] — the research blog that documented the mechanism this product implements.
- See [[blog-when-to-use-multi-agent]] — the decision framework that informs *when* Multiagent Orchestration is the right choice.
- See [[docs-multiagent-sessions]] for the multiagent API surface (coordinator config, threads, events, archive).
- See [`/Users/brandonbehring/claude-books/docs/landscape-2026-05.md`](../../landscape-2026-05.md) §5.3 and §1.3 for context on the SF announcement and the launch-customer list.

## Open questions / follow-ups

- **Does Outcomes replace the manual verification-subagent pattern?** The product framing (separate evaluator with written rubric) is identical in shape. Worth a chapter-author A/B test: manual verifier vs Outcomes-managed evaluator on the same task.
- **ZDR / HIPAA gap**: stateful sessions block Zero Data Retention and HIPAA BAA. Customers with those requirements must use self-hosted sandboxes (see `docs-multiagent-sessions.md` link from overview).
- **`Dreaming` privacy semantics**: how cross-session memory interacts with multi-tenant data is not detailed in public docs as of 2026-05-22.
- **Depth > 1 ignored**: explicit limit; long-horizon multi-agent hierarchies still require external coordination (Agent SDK + custom orchestration).
- **Anthropic-internal "Outcomes" eval data**: 8.4% / 10.1% quality lifts are reported on .docx / .pptx — task-specific. Treat as illustrative, not generalizable.
- **Branding rule re: "Claude Cowork"** suggests Cowork is being kept distinct from Managed Agents at the product layer.
