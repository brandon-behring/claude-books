# Topic trajectories — momentum dashboard (v1)

One row per topic in [`taxonomy.graph.json`](./taxonomy.graph.json). Tracks how each topic is moving so depth follows the field and nothing silently rots.

> **Momentum is a parked decision.** *How* to score it objectively (publication/release velocity + a little community signal, vs. editorial judgment) is **undecided** — it needs the gather-phase finding of *what signals actually exist*. Values below are **provisional reads** (proxies from volatility + 2026 activity), replaced once the signal is defined (the pilot proposes it).

**Momentum (provisional):** 🔥 heating · ☀️ stable/active · 🌥️ cooling · 💤 dormant · ↩️ revived · `?` unknown.
**Tier:** `strict-live` / `cache` / `stub`. **Band:** ★ active frontier · · positioned.

## ★ Active frontier

### Environment Engineering
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Repo & doc design for agents | 🔥 | stub | 2026-05-26 | Active practitioner discourse (HumanLayer, Groff, Boeckeler). |
| CLAUDE.md/AGENTS.md discipline | 🔥 | stub | 2026-05-26 | Convergence w/ shipped Ch2; ETH study + 60k AGENTS.md repos. |
| Guardrails & reversibility | 🔥 | stub | 2026-05-26 | Sandbox shift + Replit lessons keep it hot. |
| Cross-domain / large-repo structure | ☀️ | stub | 2026-05-26 | Stable patterns (ADRs, INTERFACE.md). Deferred. |
| Failure breadcrumbs | ☀️ | stub | 2026-05-26 | Stable discipline (Hashimoto). Deferred. |
| Skills & progressive disclosure | 🔥 | stub | 2026-05-26 | Anthropic Skills guide (Jan-2026); first-class artifact. |

### Context & Assembly
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| **Context assembly** (KV-cache, compaction, JIT) | 🔥 | stub | 2026-05-26 | **PILOT.** Very active in 2026 (Manus, compaction bugs, code-exec-with-MCP). |
| Context rot / long-context limits | 🔥 | stub | 2026-05-26 | Active research literature (Chroma, ARC 2026). Sister of assembly. |
| Context as currency | ☀️ | cache | 2026-05-23 | Shipped (handbook Ch5). Stable principle. |

### Memory
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Memory anti-patterns (typed/decay) | 🔥 | stub | 2026-05-26 | "Memory unsolved mid-2026"; active (Cloudflare Agent Memory). |
| Documentation-vs-memory boundary | ☀️ | stub | 2026-05-26 | Conceptual; near-term. |
| Claude Code memory & sessions | ☀️ | cache | 2026-05-23 | Evolving feature surface. |

### Tools & MCP
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Tool minimization (subtract-first) | 🔥 | stub | 2026-05-26 | Strong 2026 case studies. |
| MCP design & security | 🔥 | stub | 2026-05-26 | MCP roadmap moving fast (Apps, Tasks, Tunnels). |
| Advanced tool use (Tool Search, PTC) | ☀️ | cache | 2026-05-23 | Evolving. |
| MCP spec + ecosystem | 🔥 | cache | 2026-05-23 | Spec churns quarterly; re-verify often. |

### Agents & Orchestration
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Agent loop / agentic architecture | ☀️ | cache | 2026-05-23 | Stable core (handbook Ch1); the D1 anchor. |
| Harness frame & vocabulary | 🔥 | stub | 2026-05-26 | Vocabulary crystallized Feb–Apr 2026. |
| Build-vs-buy a custom harness | 🔥 | stub | 2026-05-26 | Active "use existing vs build" debate. |
| Sub-agents (context isolation) | ☀️ | cache | 2026-05-23 | Evolving (forked sub-agents, P/G/E). |
| Multi-agent patterns | ☀️ | cache | 2026-05-23 | Evolving. |
| Claude Agent SDK | 🔥 | cache | 2026-05-23 | Fast-moving API surface. |

### Evaluation & Verification
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Eval harnesses (LLM-judge, task suites) | 🔥 | stub | 2026-05-26 | "Build evals before harnesses"; 2 Anthropic T1 sources. |
| Eval tooling landscape | 🔥 | stub | 2026-05-26 | Consolidating (Promptfoo→OpenAI). Deferred. |
| Benchmarks (Terminal-Bench, SWE-bench Pro) | 🔥 | stub | 2026-05-26 | Shifting 2026; contamination arms race. Deferred. |
| Validation architecture (6-layer) | ☀️ | cache | 2026-05-23 | Shipped (handbook Ch7). Stable. |

### Production Operations
| Topic | Mom. | Tier | Last | Notes |
|---|---|---|---|---|
| Observability / tracing / attribution | ☀️ | stub | 2026-05-26 | OTel + session logs + git attribution; steady. |
| Cost / token economics | 🔥 | stub | 2026-05-26 | KV-cache economics; cross-cutting, rising attention. |
| Security / prompt-injection / supply-chain | 🔥 | stub | 2026-05-26 | Malicious-skill registries, exposed instances; hot + serious. |
| Human-in-the-loop / oversight | ☀️ | stub | 2026-05-26 | Approval gates, planning modes; steady. |
| Sandboxes (OS-level, self-hosted, tunnels) | 🔥 | stub | 2026-05-26 | 2026 infra shift; fast-moving. Deferred. |

## · Positioned (mapped, not yet active)

| Topic | Cluster | Mom. | Tier | Last | Notes |
|---|---|---|---|---|---|
| Prompt engineering | Prompting & SO | ☀️ | cache | 2026-05-23 | Stable principles. |
| Structured output | Prompting & SO | ☀️ | cache | 2026-05-23 | Evolving. |
| Claude Code internals | CC product surface | 🔥 | cache | 2026-05-23 | Frequent releases + CVEs. |
| Headless / CI / automation | CC product surface | ☀️ | cache | 2026-05-23 | Evolving. |
| Claude Platform & API surfaces | Claude Platform & API | 🔥 | cache | 2026-05-23 | Fast-moving. |
| Claude Code incidents & postmortems | Reliability/Gov/Compliance | 🔥 | cache | 2026-05-23 | Frequent CVEs; re-verify. |
| Governance & compliance (EU AI Act) | Reliability/Gov/Compliance | ☀️ | cache | 2026-05-23 | EU AI Act Aug-2-2026 deadline nearing. |
| Mental model / what Claude Code is | Handbook Foundations | ☀️ | cache | 2026-05-23 | Shipped (Ch1). Stable. |
| Getting started / first session / productivity | Handbook Foundations | ☀️ | cache | 2026-05-23 | Shipped (Ch3–4). Stable. |
| Team adoption & scaling patterns | Field Patterns & Adoption | ☀️ | stub | 2026-05-26 | 67-repo audit corpus (field-guide draft). |
| Public case studies (Replit, Vercel, Copilot) | Field Patterns & Adoption | 🔥 | stub | 2026-05-26 | Contrast genre to the audit; near-term. |
| Market & ecosystem (funding/adoption) | Field Patterns & Adoption | 🔥 | stub | 2026-05-26 | Hot but **low book value** + fast-decaying; excluded from harvest. |
| Pedagogy & authoring research | Pedagogy & Authoring | ☀️ | cache | 2026-05-23 | Stable (meta). |
