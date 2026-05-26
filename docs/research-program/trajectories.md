# Topic trajectories — momentum dashboard (v0)

One row per topic in [`taxonomy.graph.json`](./taxonomy.graph.json). Tracks how each topic is
moving so depth follows the field and nothing silently rots.

> **Momentum is a parked decision.** *How* to score momentum objectively (publication/release
> velocity + a little community signal, vs. editorial judgment) is **undecided** — it needs the
> gather-phase finding of *what signals actually exist*. The values below are **provisional
> reads** (rough proxies from volatility + 2026 activity), to be replaced once the signal is
> defined (the pilot proposes it). See the plan's *Open decisions*.

**Momentum legend (provisional):** 🔥 heating · ☀️ stable/active · 🌥️ cooling · 💤 dormant · ↩️ revived
· `?` unknown. **Tier:** `strict-live` / `cache` / `stub`.

## Environment Engineering
| Topic | Momentum | Tier | Last checked | Notes |
|---|---|---|---|---|
| Repo & doc design for agents | 🔥 | stub | 2026-05-26 | Active practitioner discourse (HumanLayer, Groff, Boeckeler). Near-term focus. |
| CLAUDE.md/AGENTS.md discipline (60-line) | 🔥 | stub | 2026-05-26 | Convergence w/ shipped handbook Ch2; ETH study + 60k AGENTS.md repos. |
| Guardrails & reversibility | 🔥 | stub | 2026-05-26 | Sandbox shift + Replit lessons keep it hot. |
| Cross-domain / large-repo structure | ☀️ | stub | 2026-05-26 | Stable patterns (ADRs, INTERFACE.md). Deferred. |
| Failure breadcrumbs | ☀️ | stub | 2026-05-26 | Stable discipline (Hashimoto). Deferred. |

## Context & Assembly
| Topic | Momentum | Tier | Last checked | Notes |
|---|---|---|---|---|
| **Context assembly** (KV-cache, compaction, JIT) | 🔥 | stub | 2026-05-26 | **PILOT.** Very active in 2026 (Manus, compaction bugs, code-exec-with-MCP). |
| Context rot / long-context limits | 🔥 | stub | 2026-05-26 | Active research literature (Chroma, ARC 2026). Sister of assembly. |
| Context as currency | ☀️ | cache | 2026-05-23 | Shipped (handbook Ch5). Stable principle. |

## Memory
| Topic | Momentum | Tier | Last checked | Notes |
|---|---|---|---|---|
| Memory anti-patterns (typed/decay) | 🔥 | stub | 2026-05-26 | "Memory unsolved as of mid-2026"; active (Cloudflare Agent Memory). |
| Documentation-vs-memory boundary | ☀️ | stub | 2026-05-26 | Conceptual; near-term. |
| Claude Code memory & sessions | ☀️ | cache | 2026-05-23 | Evolving feature surface. |

## Tools & MCP
| Topic | Momentum | Tier | Last checked | Notes |
|---|---|---|---|---|
| Tool minimization (subtract-first) | 🔥 | stub | 2026-05-26 | Strong 2026 case studies; near-term. |
| MCP design & security | 🔥 | stub | 2026-05-26 | MCP roadmap moving fast (Apps, Tasks, Tunnels); security live. |
| Advanced tool use (Tool Search, PTC) | ☀️ | cache | 2026-05-23 | Evolving. |
| MCP spec + ecosystem | 🔥 | cache | 2026-05-23 | Spec churns quarterly; re-verify often. |

## Agents & Orchestration
| Topic | Momentum | Tier | Last checked | Notes |
|---|---|---|---|---|
| Harness frame & vocabulary | 🔥 | stub | 2026-05-26 | Vocabulary crystallized Feb–Apr 2026; near-term. |
| Sub-agents (context isolation) | ☀️ | cache | 2026-05-23 | Evolving (forked sub-agents, P/G/E). |
| Multi-agent patterns | ☀️ | cache | 2026-05-23 | Evolving. |
| Claude Agent SDK | 🔥 | cache | 2026-05-23 | Fast-moving API surface; re-verify. |

## Evaluation & Verification
| Topic | Momentum | Tier | Last checked | Notes |
|---|---|---|---|---|
| Eval harnesses (LLM-judge, task suites) | 🔥 | stub | 2026-05-26 | "Build evals before harnesses"; 2 Anthropic T1 sources. Near-term. |
| Eval tooling landscape | 🔥 | stub | 2026-05-26 | Consolidating (Promptfoo→OpenAI); fast-moving. Deferred. |
| Benchmarks (Terminal-Bench, SWE-bench Pro) | 🔥 | stub | 2026-05-26 | Shifting 2026; contamination arms race. Deferred. |
| Validation architecture (6-layer) | ☀️ | cache | 2026-05-23 | Shipped (handbook Ch7). Stable. |

## Prompting & Structured Output
| Topic | Momentum | Tier | Last checked | Notes |
|---|---|---|---|---|
| Prompt engineering | ☀️ | cache | 2026-05-23 | Stable principles. |
| Structured output (tool_use, JSON) | ☀️ | cache | 2026-05-23 | Evolving. |

## Claude Code Config & Workflows
| Topic | Momentum | Tier | Last checked | Notes |
|---|---|---|---|---|
| Claude Code internals | 🔥 | cache | 2026-05-23 | Fast-moving; frequent releases + CVEs. |
| Headless / CI / automation | ☀️ | cache | 2026-05-23 | Evolving. |

## Reliability, Governance & Security
| Topic | Momentum | Tier | Last checked | Notes |
|---|---|---|---|---|
| Incidents (Replit, sandbox bypass) | 🔥 | stub/cache | 2026-05-26 | Replit = stub (near-term); CC incidents cached. |
| Sandboxes (self-hosted, MCP tunnels) | 🔥 | stub | 2026-05-26 | 2026 infra shift; fast-moving. Deferred. |
| Governance & compliance (EU AI Act) | ☀️ | cache | 2026-05-23 | EU AI Act Aug-2-2026 deadline approaching. |

## Foundations & Ecosystem
| Topic | Momentum | Tier | Last checked | Notes |
|---|---|---|---|---|
| Anthropic Academy courses | ☀️ | cache | 2026-05-23 | Stable T1 pool. |
| Claude API surfaces | 🔥 | cache | 2026-05-23 | Fast-moving. |
| Market & ecosystem (funding/adoption) | 🔥 | stub | 2026-05-26 | Hot but **low book value** + fast-decaying; excluded from harvest. |

## Pedagogy & Authoring
| Topic | Momentum | Tier | Last checked | Notes |
|---|---|---|---|---|
| Pedagogy & authoring research | ☀️ | cache | 2026-05-23 | Stable (meta). |
