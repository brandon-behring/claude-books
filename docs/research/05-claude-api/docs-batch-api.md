---
source_url: https://platform.claude.com/docs/en/build-with-claude/batch-processing
canonical_url: https://platform.claude.com/docs/en/build-with-claude/batch-processing
source_title: Batch processing (Message Batches API)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-api
tier: T1-official
cert_domains: [4, 5]
cert_task_areas: ["Batch processing (Message Batches API, custom_id, SLA matching)"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Message Batches API — async, 50% off, 300k output (beta)

## Key takeaways

- **Asynchronous batch with 50% discount on input and output across all tiers.** Most batches finish in under an hour; SLA is 24 hours before expiration. Results are available for 29 days after batch creation.
- **Batch limits**: 100,000 requests *or* 256 MB per batch, whichever hits first. Each request needs a unique `custom_id` (1–64 chars, alphanumeric + `-` + `_`). `max_tokens >= 1`; `max_tokens: 0` (cache pre-warm) **not supported in batch** (ephemeral cache would expire before the follow-up).
- **Supports all Messages API features inside a batch**: vision, tool use, system messages, multi-turn conversations, beta features. **Streaming is not supported for batch requests.** Multi-turn tool calling within a single batched request also doesn't work (the request is single-shot — no follow-up tool_result round trips).
- **Extended output (beta, `output-300k-2026-03-24`)**: raises `max_tokens` cap to **300,000** for **Opus 4.7, Opus 4.6, and Sonnet 4.6** on the **batch API only** (not synchronous Messages API). One 300k-token generation can take **over an hour**; plan submissions within the 24-hour window. Standard batch pricing applies (50% of base).
- **Result types**: `succeeded`, `errored`, `canceled`, `expired`. You are **not billed for errored, canceled, or expired requests.** Results stream as `.jsonl`; **order is not guaranteed** — always match by `custom_id`.
- **Workspace isolation**: batches and their results are scoped to the workspace of the API key. Org-level policy can disable Console downloads.
- **Cache hits in batch are best-effort** (30–98% hit rate is typical). Use **identical `cache_control` blocks** across every batched request to maximize hits. Pricing discounts from caching and batching **stack**.
- **Models supported**: all active models support the Batches API.

## Quoted (citation-ready)

> "The Message Batches API is a powerful, cost-effective way to asynchronously process large volumes of Messages requests. This approach is well-suited to tasks that do not require immediate responses, with most batches finishing in less than 1 hour while reducing costs by 50% and increasing throughput."
>
> — Batch processing, "Message Batches API"
>
> Anchor: `Message Batches API + The Message Batches API is a powerful, cost-effective way`

> "A Message Batch is limited to either 100,000 Message requests or 256 MB in size, whichever is reached first. The system processes each batch as fast as possible, with most batches completing within 1 hour. You can access batch results when all messages have completed or after 24 hours, whichever comes first. Batches expire if processing does not complete within 24 hours."
>
> — Batch processing, "Batch limitations"
>
> Anchor: `Batch limitations + A Message Batch is limited to either 100,000 Message requests`

> "The `output-300k-2026-03-24` beta header raises the `max_tokens` cap to 300,000 for batch requests using Claude Opus 4.7, Claude Opus 4.6, or Claude Sonnet 4.6. Include the header to generate outputs far longer than the standard limit (64k to 128k depending on model) in a single turn."
>
> — Batch processing, "Extended output (beta)"
>
> Anchor: `Extended output beta + The output-300k-2026-03-24 beta header raises the max_tokens cap`

> "Yes, the Message Batches API supports all features available in the Messages API, including beta features. However, streaming is not supported for batch requests."
>
> — Batch processing, FAQ
>
> Anchor: `FAQ + the Message Batches API supports all features available in the Messages API`

> "Batch results can be returned in any order, and may not match the ordering of requests when the batch was created. ... To correctly match results with their corresponding requests, always use the `custom_id` field."
>
> — Batch processing, "Retrieving batch results"
>
> Anchor: `Retrieving batch results + Batch results can be returned in any order`

## API shape

### Create a batch

```json
POST /v1/messages/batches
{
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-opus-4-7",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": "Hello, world"}]
            }
        }
    ]
}
```

Response on creation has `processing_status: "in_progress"`, `request_counts: {processing, succeeded, errored, canceled, expired}`, and `expires_at` (24h out).

### Extended output (beta)

```bash
curl https://api.anthropic.com/v1/messages/batches \
  -H "anthropic-beta: output-300k-2026-03-24" \
  -d '{"requests":[{"custom_id":"long-form-request","params":{"model":"claude-opus-4-7","max_tokens":300000,"messages":[...]}}]}'
```

Extended output is available on the Claude API and Claude Platform on AWS; **not on Bedrock, Vertex, or Microsoft Foundry**.

### Cache-aware batch

Include the same `cache_control: {"type": "ephemeral"}` markers on identical system/document content in every request to maximize hit rate. The **1-hour cache** is recommended for batches because most batches take longer than 5 minutes.

## Result types

| Type | Billed? | Description |
|---|---|---|
| `succeeded` | yes | Request was successful; includes the message result |
| `errored` | no | Invalid request or internal server error |
| `canceled` | no | User canceled before the request was sent to the model |
| `expired` | no | Batch hit the 24-hour expiry before this request ran |

Results are JSONL streamed via `results_url`. Stream rather than download in one shot for large batches.

## Workflow summary

1. POST `/v1/messages/batches` with a list of `{custom_id, params}` requests.
2. Poll `GET /v1/messages/batches/{id}` until `processing_status == "ended"`.
3. Stream from `results_url` (`.jsonl`, one result per line).
4. Match each result to its request by `custom_id`.
5. (Optional) `DELETE /v1/messages/batches/{id}` to clean up before the 29-day retention window expires.

## Best practices

- **Dry-run a single request** through the Messages API first — batch validation errors are returned only after the entire batch completes.
- **Meaningful `custom_id`s** are mandatory because order is non-deterministic.
- **Break huge datasets into multiple batches** for easier retry / monitoring.
- **Watch HTTP 413** (`request_too_large`) — keep total batch payload under 256 MB.

## Cross-references

- See [[docs-pricing]] for the full batch price grid (50% off all tiers).
- See [[docs-models-overview]] for which models accept the 300k extended-output header (Opus 4.7 / 4.6 / Sonnet 4.6).
- See [[docs-streaming]] (note that **streaming is not supported in batch**; the cross-ref is a "what you can't do" pointer).
- See [[docs-files-api]] for input-via-`file_id` references inside batched requests.
- See [[../03-advanced-tool-use/docs-tool-use-overview]] — tool use is allowed inside batch but multi-turn tool round-trips are not.
- See `../../landscape-2026-05.md` §1.2 for the marketing-table batch entry.

## Open questions / follow-ups

- **"Multi-turn tool calling not supported in batch"** is documented at landscape-doc §1.5 but the primary docs language is gentler ("Yes, the Message Batches API supports all features … however, streaming is not supported"). The practical constraint is that a single batched request is single-shot — there is no way to send a follow-up turn within the batch. If a chapter relies on this, cite the FAQ.
- **Bedrock / Vertex / Foundry feature-parity** for batch is not explicitly enumerated; the extended-output beta is API + AWS-marketplace only. Worth verifying batch availability per partner cloud before a chapter that gives platform-specific guidance.
- **Cache-hit rate** ("30% to 98%") is wide; no benchmark provided. Treat as illustrative.
- **Spend-limit overage**: docs note "batches may go slightly over your Workspace's configured spend limit" due to concurrency. Operationally relevant for finance chapters.
