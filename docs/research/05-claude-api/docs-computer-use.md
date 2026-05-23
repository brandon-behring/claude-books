---
source_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
canonical_url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool
source_title: Computer use tool
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-api
tier: T1-official
cert_domains: [2]
cert_task_areas: ["Tool distribution + tool_choice", "Effective tool interfaces"]
volatility: fast-moving
verified: true
supersedes: []
superseded_by: []
---

# Computer use tool — desktop / browser control (beta)

## Key takeaways

- **Beta — two header generations live concurrently**:
  - `computer-use-2025-11-24` → Opus 4.7, Opus 4.6, Sonnet 4.6, Opus 4.5 (uses tool type `computer_20251124`)
  - `computer-use-2025-01-24` → Sonnet 4.5, Haiku 4.5, Opus 4.1, deprecated Opus 4 / Sonnet 4 (uses tool type `computer_20250124`)
- **ZDR-eligible**, unlike the Files and Batch APIs.
- **Mechanism**: provides screenshot + mouse/keyboard control as a schema-less tool. Claude requests actions; your application implements them and returns results. Anthropic provides a [reference implementation](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) with Docker + Xvfb.
- **Token overhead** (Claude 4.x):
  - System prompt: **466–499 tokens**
  - Tool definition: **735 tokens**
  - Plus screenshots (vision pricing) and `tool_result` payloads
- **Available actions** (basic): `screenshot`, `left_click`, `type`, `key`, `mouse_move`. **Enhanced** in `computer_20250124`: `scroll`, `left_click_drag`, `right_click`/`middle_click`, `double_click`/`triple_click`, `left_mouse_down`/`up`, `hold_key`, `wait`. **Enhanced in `computer_20251124`** (Opus 4.7 / 4.6 / 4.5, Sonnet 4.6): `zoom` (requires `enable_zoom: true`; takes `region: [x1,y1,x2,y2]`).
- **Modifier keys** (`shift`, `ctrl`, `alt`, `super`) on click/scroll via the `text` parameter (distinct from `hold_key`).
- **Prompt-injection defense layer**: Anthropic runs classifiers that flag injected instructions in screenshots and steer the model to ask for confirmation. Opt-out by contacting support; not suitable for fully-unattended pipelines without compensating controls.
- **Recommended `effort` settings for computer use** (internal benchmarking):
  - Opus 4.7 — `high` default; `low` for high-throughput.
  - Sonnet 4.6 / Opus 4.6 — `medium` default; **avoid `max`** (cost without accuracy gain).
  - On Sonnet 4.6 / Opus 4.6, `low` *outperforms thinking-disabled* on cost-per-correct-action (fewer retries).
- **WebArena benchmark**: state-of-the-art among single-agent systems (per docs intro).

## Quoted (citation-ready)

> "Claude can interact with computer environments through the computer use tool, which provides screenshot capabilities and mouse/keyboard control for autonomous desktop interaction. On WebArena, a benchmark for autonomous web navigation across real websites, Claude achieves state-of-the-art results among single-agent systems, demonstrating strong ability to complete multi-step browser tasks end to end."
>
> — Computer use tool, intro
>
> Anchor: `Computer use tool + Claude can interact with computer environments`

> "Computer use is in beta and requires a beta header:
> - `"computer-use-2025-11-24"` for Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 4.6, and Claude Opus 4.5
> - `"computer-use-2025-01-24"` for Claude Sonnet 4.5, Claude Haiku 4.5, Claude Opus 4.1, Claude Sonnet 4 (deprecated), and Claude Opus 4 (deprecated)"
>
> — Computer use tool, beta-header callout
>
> Anchor: `Computer use tool + Computer use is in beta and requires a beta header`

> "In some circumstances, Claude will follow commands found in content even if it conflicts with the user's instructions. For example, Claude instructions on webpages or contained in images might override instructions or cause Claude to make mistakes. ... If you use the computer use tools, classifiers will automatically run on your prompts to flag potential instances of prompt injections. When these classifiers identify potential prompt injections in screenshots, they will automatically steer the model to ask for user confirmation before proceeding with the next action."
>
> — Computer use tool, "Security considerations"
>
> Anchor: `Security considerations + In some circumstances, Claude will follow commands found in content`

> "**Important:** Your application must explicitly run the computer use tool; Claude cannot run it directly. You are responsible for implementing the screenshot capture, mouse movements, keyboard inputs, and other actions based on Claude's requests."
>
> — Computer use tool, "Tool parameters" (Note callout)
>
> Anchor: `Tool parameters + Your application must explicitly run the computer use tool`

## API shape (Opus 4.7, new header)

```bash
curl https://api.anthropic.com/v1/messages \
  -H "anthropic-beta: computer-use-2025-11-24" \
  -d '{
    "model": "claude-opus-4-7",
    "max_tokens": 1024,
    "tools": [
      {"type": "computer_20251124", "name": "computer",
       "display_width_px": 1024, "display_height_px": 768, "display_number": 1},
      {"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"},
      {"type": "bash_20250124", "name": "bash"}
    ],
    "messages": [{"role": "user", "content": "Save a picture of a cat to my desktop."}]
  }'
```

## Action grammar (selected)

```json
// Screenshot
{"action": "screenshot"}

// Click
{"action": "left_click", "coordinate": [500, 300]}

// Type
{"action": "type", "text": "Hello, world!"}

// Scroll
{"action": "scroll", "coordinate": [500, 400], "scroll_direction": "down", "scroll_amount": 3}

// Modifier+click (multi-select, range select, etc.)
{"action": "left_click", "coordinate": [500, 300], "text": "shift"}

// Zoom (computer_20251124, requires enable_zoom: true)
{"action": "zoom", "region": [100, 200, 400, 350]}
```

Modifier `text` values: `shift`, `ctrl`, `alt`, `super` (Command on macOS / Windows key on Win/Linux).

## Tool parameters

| Parameter | Required | Description |
|---|---|---|
| `type` | yes | `computer_20251124` (new header) or `computer_20250124` (old header) |
| `name` | yes | Must be `"computer"` |
| `display_width_px` | yes | Display width in pixels |
| `display_height_px` | yes | Display height in pixels |
| `display_number` | no | X11 display number |
| `enable_zoom` | no | `computer_20251124` only; default `false`; enables the `zoom` action |

## Agent loop sketch (Python skeleton)

```python
def sampling_loop(model, messages, max_iterations=10):
    for _ in range(max_iterations):
        response = client.beta.messages.create(
            model=model,
            max_tokens=4096,
            messages=messages,
            tools=TOOLS,
            betas=["computer-use-2025-11-24"],
        )
        messages.append({"role": "assistant", "content": response.content})
        tool_results = process_tool_calls(response)
        if not tool_results:
            return messages
        messages.append({"role": "user", "content": tool_results})
    return messages
```

## Prompting tips (from docs)

1. Specify simple, well-defined tasks with explicit per-step instructions.
2. Ask Claude to **screenshot + evaluate after each step** ("Explicitly show your thinking: 'I have evaluated step X…'").
3. Prefer keyboard shortcuts over mouse for tricky UI (dropdowns, scrollbars).
4. For repeatable tasks, include example screenshots + tool calls in the system prompt.
5. **Credentials in XML tags** (e.g., `<robot_credentials>`) if login is required. Read the prompt-injection guidance first.
6. **Place instruction text BEFORE the screenshot image** in the user-turn content array — "providing the target description before the image is processed improves click accuracy."

## Security & safety controls (from docs)

- Use a dedicated VM or container with minimal privileges.
- Avoid sensitive credentials where possible.
- Allowlist outbound network domains.
- Require human confirmation for irreversible actions (financial txns, agreements, cookie consent).
- Classifier-driven prompt-injection defense is **on by default**; opt out by contacting support if you have a fully-headless workflow with compensating controls.

## Cross-references

- See [[docs-pricing]] for the 466–499 + 735-token overhead table.
- See [[docs-tool-use]] for the foundation contract (`tool_use` / `tool_result`).
- See [[../03-advanced-tool-use/docs-tool-use-overview]] for the broader server-tool / client-tool taxonomy.
- See [[docs-streaming]] — `input_json_delta` on `computer` tool calls streams the action JSON.
- See `../../landscape-2026-05.md` §1.5 — listed as beta with ~466–499 + 735 input tokens; matches this note.

## Open questions / follow-ups

- **`computer_20251124` GA timeline** — unstated. The dual-header window means deployments need conditional code per-model for at least the next several months.
- **`bash_20250124`** and **`text_editor_20250728`** versioning is tied to but independent from the computer-use header; verify version compatibility before pinning.
- **WebArena number** — "state-of-the-art among single-agent systems" but no specific score. Cross-reference with public WebArena leaderboard if a chapter cites it.
- **Effort tradeoff anomaly**: docs claim `low` on Sonnet 4.6 / Opus 4.6 uses *fewer* output tokens than disabled thinking, because retries are cheaper than mistakes. Worth empirical verification before recommending in a cost chapter.
