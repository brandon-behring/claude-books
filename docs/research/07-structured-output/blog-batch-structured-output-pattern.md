---
source_url: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
canonical_url: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
source_title: Structured outputs + Batch processing (combined pattern)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: structured-output
tier: T1-official
cert_domains: [4]
cert_task_areas: ["Batch processing (Message Batches API, custom_id, SLA matching)", "Structured output via tool_use + JSON schemas"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Structured outputs on Batch — the bulk-extraction pattern

Synthesis note. The Structured Outputs page lists Batch as a compatible feature; [[../05-claude-api/docs-batch-api]] is the full batch reference. This note captures the specific combined pattern for **bulk structured extraction** — the cert's D4 sweet spot for cost-sensitive ETL workloads.

## Key takeaways

- **Structured outputs + Batch compose with both discounts**: 50% off batch pricing PLUS grammar-cache hits across batch entries (compiled grammar reused for every request with the same schema).
- **Extended output beta header**: `anthropic-beta: output-300k-2026-03-24` raises `max_tokens` to 300,000 on **Opus 4.7 / 4.6 / Sonnet 4.6** in batch only (NOT synchronous Messages API). Single-shot generations of full books / multi-megabyte invoices become feasible.
- **Single-shot per request — no multi-turn tool calling in batch**, but structured outputs IS single-shot, so this is the natural fit. The agentic-loop variant lives in [[docs-agent-sdk-structured-outputs]] and requires synchronous calls.
- **Same schema = same grammar cache**. The 24-hour cache is per-schema, so a 10,000-row batch all using the same schema pays the grammar-compile cost once total, not per row.
- **`custom_id` matching is essential** — batch results return in arbitrary order; pair each request with a deterministic `custom_id` so you can join back to your source records.
- **Cache-control optimization**: applying `cache_control: {type: "ephemeral"}` to identical system / instruction blocks across batch requests stacks the prompt-cache discount with the batch discount AND the grammar-cache reuse. Three concurrent discount mechanisms.
- **Result type matters**: only `succeeded` results are billed; `errored` / `canceled` / `expired` are not. Schema-validation failures (when SDKs do post-hoc validation) need to be re-batched separately.

## Quoted (citation-ready)

> "Works with: Batch processing (50% discount), Token counting (count tokens without compilation), Streaming, Vision (image inputs), Prompt caching (with cache invalidation when changing `output_config`)."
>
> — [[docs-structured-outputs]] (Feature Compatibility)
>
> Anchor: `Feature Compatibility + Works with Batch processing`

> "The `output-300k-2026-03-24` beta header raises the `max_tokens` cap to 300,000 for batch requests using Claude Opus 4.7, Claude Opus 4.6, or Claude Sonnet 4.6."
>
> — [[../05-claude-api/docs-batch-api]] (Extended output beta)
>
> Anchor: `Extended output beta + The output-300k-2026-03-24 beta header raises the max_tokens cap`

## Pattern — bulk extraction at scale

```python
import anthropic

client = anthropic.Anthropic()

SCHEMA = {
    "type": "object",
    "properties": {
        "invoice_number": {"type": "string"},
        "date": {"type": "string", "format": "date"},
        "total_amount": {"type": "number"},
        "customer_name": {"type": "string"},
        "line_items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "description": {"type": "string"},
                    "quantity": {"type": "integer"},
                    "amount": {"type": "number"}
                },
                "required": ["description", "quantity", "amount"],
                "additionalProperties": False
            }
        }
    },
    "required": ["invoice_number", "date", "total_amount", "customer_name", "line_items"],
    "additionalProperties": False
}

requests = [
    {
        "custom_id": f"invoice-{row['id']}",
        "params": {
            "model": "claude-opus-4-7",
            "max_tokens": 4096,
            "messages": [{"role": "user", "content": [
                {"type": "text", "text": "Extract invoice fields:"},
                {"type": "text", "text": row["raw_text"], "cache_control": {"type": "ephemeral"}}
            ]}],
            "output_config": {"format": {"type": "json_schema", "schema": SCHEMA}}
        }
    }
    for row in source_rows
]

batch = client.messages.batches.create(requests=requests)
```

Then poll → stream `results_url` → `custom_id`-match → load JSON from `result.message.content[0].text`.

## Pattern — large-document extraction with 300k output

```bash
curl https://api.anthropic.com/v1/messages/batches \
  -H "anthropic-beta: output-300k-2026-03-24" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "requests": [{
      "custom_id": "long-extraction-1",
      "params": {
        "model": "claude-opus-4-7",
        "max_tokens": 300000,
        "messages": [{"role": "user", "content": "Extract every section of this 500-page report as structured JSON..."}],
        "output_config": {"format": {"type": "json_schema", "schema": LARGE_SCHEMA}}
      }
    }]
  }'
```

A single request can take **over an hour** under the 300k cap. Plan submissions inside the 24-hour batch expiry window.

## Discount stack (illustrative — exact percentages vary)

| Layer | Mechanism | Savings |
|---|---|---|
| Batch | 50% off input + output | -50% |
| Prompt caching | Identical system block / document block cached | reads at 0.1× base |
| Grammar caching | Same schema compiles once across batch | latency only (not billed) |
| **Stacked** | All three at once | ~50% off + cache reads at 0.1× for cached portions |

The grammar cache savings are *latency*, not dollars; the dollar-side savings come from batch + prompt caching. But latency matters for "fastest 1M-row extraction job within a 24-hour batch SLA" planning.

## Failure modes specific to this pattern

1. **Schema drift mid-batch**: if you regenerate the batch with a tweaked schema, the grammar cache misses and the per-request latency cost spikes. Lock the schema before batching.
2. **`max_tokens: 0`**: not supported in batch (the ephemeral cache would expire before the follow-up). Don't use the cache-pre-warm pattern with batch.
3. **Refusals are still billed (200, `stop_reason: refusal`)**: even in batch. Filter `result.message.stop_reason == "refusal"` and route to human review.
4. **`max_tokens` truncation**: with structured outputs, hitting `max_tokens` produces a 200 response with `stop_reason: "max_tokens"` and possibly *invalid* JSON (mid-grammar). Re-batch the failing rows with a higher `max_tokens`.
5. **Refile rate when extracting from heterogeneous sources**: structured outputs grammar is global to the batch; if your source documents are wildly different shapes, schema mismatch may cause more refusals than fits-the-shape-perfectly retries. Either narrow the schema (per-document-type batches) or use `output_config.format` with `additionalProperties: false` + plenty of `["string", "null"]` nullable types.
6. **No multi-turn tool calling in batch** ([[../05-claude-api/docs-batch-api]] FAQ) — if the extraction requires fetching extra context via tools, switch to synchronous + Agent SDK retry loop.

## Cross-references

- See [[docs-structured-outputs]] — the structured-outputs feature itself.
- See [[../05-claude-api/docs-batch-api]] — full batch API reference (custom_id rules, expiration, result types, 256MB cap).
- See [[../05-claude-api/docs-pricing]] — the 50% batch discount applies to both input and output.
- See [[docs-agent-sdk-structured-outputs]] — for the multi-turn case that batch can't do.
- See [[blog-semantic-vs-schema-errors]] — semantic-validation patterns apply equally to batch extractions; the validation step runs against the JSONL results.

## Open questions / follow-ups

- **Grammar cache scope**: docs say "compiled grammars cached for 24 hours from last use" — is the cache **per-API-key**, **per-workspace**, or **organization-wide**? For batch this matters because a large batch may keep the cache warm across multiple API keys submitting in parallel.
- **Schema fingerprinting**: how exactly does the cache compute a "same schema" hash — semantic equivalence, exact-string, normalized JSON? Whitespace / key-order changes shouldn't invalidate but no docs commitment.
- **Extended-output 300k availability over time**: the beta header has a date suffix (`-2026-03-24`) suggesting it's still beta. Watch for GA + a stable cap.
- **Bedrock / Vertex / Foundry batch parity for structured outputs**: docs are explicit that extended-output 300k is API + AWS-marketplace only. Structured outputs themselves on those clouds isn't enumerated. Confirm before any chapter promises "works on all clouds."
