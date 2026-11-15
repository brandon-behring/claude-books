# Corrections

This file records factual corrections to the books. The books carry no erratum notes: a page shows
the corrected text only, and this file keeps the history. Each entry gives the old claim, with
enough of its wording to search for; the corrected form; and the evidence that decided it.

- **The short list.** An old claim that a writer could plausibly bring back is also a row of
  `scripts/freshness/known_false.tsv`. The `fact-lint` workflow fails a pull request that repeats
  one. An entry names its rows under "Lint".
- **Before this file.** The corrections of November 2026 that came first (pull requests #37 and
  #38) are recorded as rows of that phrase file only.
- **Forward only.** Dated records keep the wording of their date: design notes, research notes and
  `agentic-systems-design/OUTLINE.md` are not edited backwards. Where an entry lists pages under
  "Not yet corrected", those pages still carry the old claim and wait for a later batch.
- **Dates.** "Read" is the day a vendor page was fetched and compared with the book. A correction
  does not move a chapter's review date.
- **Evidence lines** quote the vendor page word for word, without its link markup.

## 2026-11-15 — Agentic Systems Design: sub-agents, context assembly, observability, cost

Pages read on 2026-11-15. The old sentences and the new ones were given, unlabelled and in random
order, to checkers that saw only the vendor pages; a script then looked up every quotation the
checkers returned in the page files. Where a checker had judged an old sentence against a page other
than the one the sentence cited, the cited page was fetched as well and searched. Three old
quotations proved to be on their own pages (the analytics dashboard's viewer roles, the 30-day
transcript retention, and a sub-agent described as an isolated instance), so they are not recorded
here.

### C1 — A sub-agent starts with a fresh history, not with nothing

- **Was:** "On the way in, a sub-agent inherits nothing"; "a fresh window that inherits nothing and
  returns only the result"; in the figure, "inherits nothing: no history, no tool results, no
  system prompt".
- **Now:** A named sub-agent starts without the parent's conversation history, but its context is
  not empty. Claude Code composes it from the agent's own system prompt, the delegation message,
  the CLAUDE.md files, a git-status snapshot and any preloaded skills. Its final message returns on
  completion; direction, resumption and messages between named agents can also cross the boundary.
- **Evidence:**
  - "Unless the subagent is a fork, its context window starts fresh, with no parent conversation, but isn't empty." — [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)
  - "Each subagent starts with a fresh, isolated context window. It doesn't see your conversation history, the skills you've already invoked, or the files Claude has already read." — [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- **Changed:** `ch12-beyond-one-agent`, `ch18-sub-agents`, figure `subagent-isolation`.
- **Lint:** `subagent-inherits-nothing`.
- **Not yet corrected:** `architect-reference/src/content/chapters/d1-03-subagent-invocation.mdx`
  quotes an earlier wording of the first sentence above, without the exception for forks.

### C2 — A fork carries the conversation; `fork_session` does not start one

- **Was:** "**Fork mode** (`fork_session`) inverts the *input* side: it carries the parent's context
  *into* the sub-agent"; and, citing the SDK, that a sub-agent "runs in its own fresh conversation"
  and that "the *only* channel from parent to sub-agent is the prompt string you pass it", with no
  exception for forks.
- **Now:** A fork is a sub-agent that inherits the whole conversation so far. Fork mode is on by
  default; setting `CLAUDE_CODE_FORK_SUBAGENT` to `0` turns it off. Every other sub-agent starts
  with a fresh history. The SDK's `forkSession` is a different thing: it copies a stored session's
  entries under a new key.
- **Evidence:**
  - "A fork is a subagent that inherits the entire conversation so far instead of starting fresh." — [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
  - "Claude can start a fork on its own while fork mode is on, as it is by default." — [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
  - "Turn fork mode off: set `CLAUDE_CODE_FORK_SUBAGENT` to `0`, following the steps in Let Claude wait for a subagent." — [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
  - "Context isolation: each subagent runs in its own conversation, which starts fresh unless the subagent is a fork." — [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents)
  - "`forkSession({ sessionStore })` reads the source entries, rewrites every `sessionId` field and remaps message UUIDs, then appends the transformed entries under a new key." — [Persist sessions to external storage](https://code.claude.com/docs/en/agent-sdk/session-storage)
- **Changed:** `ch18-sub-agents`, figure `subagent-isolation`.
- **Lint:** `subagent-fork-session`.
- **Left as they are:** the pages that use `fork_session` for branching an SDK session, not for a
  fork sub-agent (architect-reference `d1-07`; handbook `ch10`, `ch11`). Whether that option's
  name is current was not checked in this batch.

### C3 — A sub-agent runs the conversation's model by default, not always

- **Was:** "A sub-agent runs the same model you already have"; "It is the same model with no extra
  ability".
- **Now:** A sub-agent runs on the conversation's model by default, and its definition can name
  another model. It also has its own system prompt, tool access and permissions. The chapters say
  instead that any capability a sub-agent adds comes from how it is configured.
- **Evidence:**
  - "By default, a subagent you define runs on the same model as the conversation that starts it. To choose its model yourself, set the `model` field in its definition to one of these values:" — [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
  - "Each subagent runs in its own context window with a custom system prompt, specific tool access, and independent permissions." — [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- **Changed:** `ch18-sub-agents`; the same point in `ch12-beyond-one-agent` and
  `ch20-composing-tools-orchestration`.
- **Lint:** `subagent-same-model`.

### C4 — A sub-agent shares the checkout unless it gets a worktree

- **Was:** "Because it makes each unit of work **independent and non-interfering**."
- **Now:** A sub-agent works in its own context, but it starts in the main conversation's working
  directory, so it works on the same checkout unless `isolation: worktree` gives it an isolated
  copy of the repository.
- **Evidence:**
  - "A subagent starts in the main conversation's current working directory." — [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
  - "To give the subagent an isolated copy of the repository instead, set `isolation: worktree`." — [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- **Changed:** `ch18-sub-agents`. The review the books called a "clean-room" review or verifier is
  now a "fresh-trajectory" review or verifier in `ch18-sub-agents`, `ch19-multi-agent` and
  `ch20-composing-tools-orchestration`: only the reviewer's history is fresh, and it shares the
  checkout and, by default, the model.
- **Lint:** `subagent-non-interfering`.
- **Left as it is:** "clean-room" in architect-reference `d2-04`, which names a clean
  configuration, not a reviewer.

### C5 — "A critical but finite resource" is not the article's wording

- **Was:** Context is "a critical but finite resource for AI agents".
- **Now:** The chapters quote the article's own sentence: context "must be treated as a finite
  resource with diminishing marginal returns."
- **Evidence:**
  - "Context, therefore, must be treated as a finite resource with diminishing marginal returns." — [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
  - The article's HTML, its headings and subtitle included, does not contain the old phrase.
- **Changed:** `ch01-harness-frame`, `ch02-environment-context-discipline`,
  `ch12-beyond-one-agent`, `ch20-composing-tools-orchestration`, `ch25-cost-economics`.
- **Lint:** `context-critical-finite-quote`.

### C6 — OpenTelemetry's token metrics are `gen_ai.client.inference.usage.*`

- **Was:** "The standard token-usage metric is `gen_ai.client.token.usage`, documented as the
  "Number of input and output tokens used,""
- **Now:** The GenAI semantic conventions, which are in Development status, define inference token
  metrics as the `gen_ai.client.inference.usage.*` counters. Claude Code's own telemetry sets no
  `gen_ai.usage.*` attributes.
- **Evidence:**
  - "Status: Development" — [Semantic conventions for generative AI metrics](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-metrics.md)
  - "Inference token metrics (`gen_ai.client.inference.usage.*` counters and `gen_ai.client.inference.operation.*` histograms) are defined in Inference Token Metrics." — [Semantic conventions for generative AI metrics](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-metrics.md)
  - "Claude Code doesn't set `gen_ai.usage.*` attributes." — [Monitoring](https://code.claude.com/docs/en/monitoring-usage)
- **Changed:** `ch24-observability`.
- **Lint:** `otel-token-usage-metric`.

### C7 — Compaction invalidates the conversation layer, not every cached prefix

- **Was:** "Compaction is a cache-invalidation boundary: a shipping-product regression report (since
  closed as not-planned) reasons that "any prefix cached before compaction is guaranteed stale
  after it.""; "**Symptom: cost spikes right after a long session compacts.** → *Cache
  invalidation at the compaction boundary*."
- **Now:** In Claude Code, compaction replaces the history with a summary, so the conversation
  layer misses and is rebuilt on the next turn, for the much shorter history; the next request
  still reads the system-prompt layer from the cache. The chapter tells readers to compare cache
  reads with cache creations after the boundary and to fix the layer that changed. The quotation is
  accurate to the GitHub issue it came from, but that issue was closed as not planned, and the
  vendor's page now describes the behavior.
- **Evidence:**
  - "By design, this invalidates the conversation layer: the next request has a new, shorter history that doesn't share a prefix with the old one." — [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching)
  - "System prompt: the next request reads this layer from the cache, unless a resumed conversation kept a system prompt that is now out of date." — [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching)
  - "In both the warm and cold cases, the turn after compaction rebuilds the conversation cache for only the much shorter history, so that turn isn't the slow part." — [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching)
- **Changed:** `ch09-context-assembly`.
- **Lint:** `compaction-guaranteed-stale`.
- **Left as it is:** "compaction can invalidate the cache", which the page supports.

### C8 — A cache read costs 0.1× on most models, not on all

- **Was:** "Reading from the cache (a cache hit) costs about **0.1×** the base input price — roughly
  a tenth."; Claude Code bills cache reads "at roughly 10% of the standard input rate"; "caching
  pays off after just one cache read".
- **Now:** A 5-minute cache write costs 1.25× base input and a 1-hour write 2×. A cache read costs
  0.1× on most models and less on some; the pricing page lists which. Caching pays for itself after
  one read with the 5-minute write and after two with the 1-hour write. Claude Code's page gives no
  percentage: it bills a cache read at the model's cached token rate.
- **Evidence:**
  - "0.1x base input price on most models" — [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
  - "All other models use the standard 0.1x multiplier." — [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
  - "5-minute duration (1.25x write): after one cache read" — [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
  - "1-hour duration (2x write): after two cache reads" — [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
  - "Tokens served from cache on this turn, billed at the model's cached token rate, below the standard input rate" — [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching)
- **Changed:** `ch25-cost-economics`, figure `cost-levers`.
- **Lint:** `cache-read-tenth`.
- **Not yet corrected:** `handbook/src/content/chapters/ch16-enterprise-deployment.mdx` gives cache
  reads as about 90% off the input price, without the exceptions, at lines 121, 145, 174, 216 and
  244.

### C9 — `/usage` shows an estimate; where the bill is depends on the account

- **Was:** "The dollar figure in `/usage` "is an estimate computed locally from token counts and may
  differ from your actual bill" — the authoritative figure lives in the Console."; "the Console
  holds the authoritative figure".
- **Now:** Claude Code computes the `/usage` dollar figure locally from token counts; it is an
  estimate, not an invoice. The authoritative figure is in the Claude Console only for an API
  organization: Teams and Enterprise plans and cloud providers each report usage on their own
  surface.
- **Evidence:**
  - "Claude Code computes the dollar figure locally from token counts at list price, unless a `modelPricing` table is in effect." — [Manage costs effectively](https://code.claude.com/docs/en/costs)
  - "The figures are still estimates, not an invoice." — [Manage costs effectively](https://code.claude.com/docs/en/costs)
  - "Which controls you have depends on how your organization accesses Claude Code: a Claude for Teams or Enterprise plan, the Claude Console, or a cloud provider." — [Manage costs effectively](https://code.claude.com/docs/en/costs)
- **Changed:** `ch24-observability`.
- **Lint:** `usage-actual-bill-quote`.

### C10 — A `Co-Authored-By` trailer names the model, not the session

- **Was:** "by default, commits carry a `Co-Authored-By` git trailer "which can be customized or
  disabled.""; "The commit itself becomes the handle: from a merged diff you can walk back to the
  session log and trace that produced it."; and that CI must run "using the GitHub App or custom
  app (not Actions user)" for its commits to be attributable.
- **Now:** Commits carry a `Co-Authored-By` trailer by default, and the `attribution` setting
  changes or hides it; the quoted words are not on the vendor's pages. The trailer names the model
  in use, not the session. Only a commit from a cloud or Remote Control session also carries a
  `Claude-Session` trailer with the session's link; any other run link has to be stored. In GitHub
  Actions, the GitHub App or a custom app token matters because GitHub does not trigger workflows on
  commits made with the default `GITHUB_TOKEN`; the page does not tie it to attribution.
- **Evidence:**
  - "Commits get a git trailer such as `Co-Authored-By` by default; pull request descriptions get plain text." — [All settings](https://code.claude.com/docs/en/settings-reference)
  - "Change or hide the trailer Claude Code adds to commits" — [All settings](https://code.claude.com/docs/en/settings-reference)
  - "The name is the model in use when the commit is made, such as `Claude Sonnet 5`." — [All settings](https://code.claude.com/docs/en/settings-reference)
  - "Omit the claude.ai session link from cloud and Remote Control commits" — [All settings](https://code.claude.com/docs/en/settings-reference)
  - "Claude Code adds the link as a `Claude-Session` trailer on commits and as a link in pull request descriptions." — [All settings](https://code.claude.com/docs/en/settings-reference)
  - "GitHub doesn't trigger workflows on commits made with the default `GITHUB_TOKEN`." — [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions)
- **Changed:** `ch24-observability`.
- **Lint:** `attribution-trailer-handle`.

### C11 — Input context is not always the largest cost

- **Was:** "The input context an agent reprocesses each turn — not the output it generates — is the
  dominant cost driver."; "Input context, not output, is the cost driver".
- **Now:** The bill is a sum of uncached input, cache writes, cache reads, output (thinking
  included) and tool charges, each at its own rate. Repeated context often dominates a long
  tool-using loop, but output-heavy, thinking-heavy and server-tool workloads can differ, so the
  chapters say to measure the mix before naming a driver.
- **Evidence:**
  - "Token costs scale with context size: the more context Claude processes, the more tokens you use." — [Manage costs effectively](https://code.claude.com/docs/en/costs)
  - "Thinking tokens are billed as output tokens, and the default budget can be tens of thousands of tokens per request depending on the model." — [Manage costs effectively](https://code.claude.com/docs/en/costs)
  - "Client-side tools are priced the same as any other Claude API request, although server-side tools can incur additional charges based on their specific usage." — [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- **Changed:** `ch21-measuring-operating-agents`, `ch25-cost-economics`, figure `cost-levers`.
- **Lint:** `cost-driver-input`.
- **Left as it is:** handbook `ch05`'s "tool results are the dominant cost", which is about what
  fills the context window, not about the bill.

### C12 — What a session transcript holds

- **Was:** "Claude Code writes a **session transcript** for each run — "every message, tool call,
  and tool result" — as a per-session JSONL file".
- **Now:** The transcript is a JSONL file. Each line is a JSON object: a message, a tool use or
  result, a record of a request Claude Code sent the model, or a metadata entry. The entry format
  is internal to Claude Code and changes between versions. The quoted words were not on the page
  the chapter cited, which lists messages, tool calls and tool results, and also the system prompt,
  tool definitions and request parameters.
- **Evidence:**
  - "Each line is a JSON object: a message, a tool use or result, a record of a request Claude Code sent the model, or a metadata entry." — [Manage sessions](https://code.claude.com/docs/en/sessions)
  - "The entry format is internal to Claude Code and changes between versions, so scripts that parse these files directly can break on any release." — [Manage sessions](https://code.claude.com/docs/en/sessions)
  - "Conversation transcript: messages, tool calls, and tool results, plus the system prompt, tool definitions, and parameters of the requests Claude Code sent the model" — [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory)
- **Changed:** `ch24-observability`.
- **Lint:** none. Without quotation marks the old words are a fair summary, so no phrase marks the
  error.
- **Not a correction:** "one JSON-safe object per line". The SessionStore page uses the same words:
  - "Entries are JSON-safe objects, one per line in the local JSONL." — [Persist sessions to external storage](https://code.claude.com/docs/en/agent-sdk/session-storage)
