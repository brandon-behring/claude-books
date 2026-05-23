---
source_url: https://platform.claude.com/docs/en/build-with-claude/citations
canonical_url: https://platform.claude.com/docs/en/build-with-claude/citations
source_title: Citations
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-api
tier: T1-official
cert_domains: [4, 5]
cert_task_areas: ["Validation, retry, feedback loops", "Information provenance (claim-source mappings)"]
volatility: stable
verified: true
supersedes: []
superseded_by: []
---

# Citations — attribution support for document Q&A

## Key takeaways

- **Citations is GA and ZDR-eligible.** All active models support it **except Haiku 3** (effectively all current Claude 4.x).
- **Enable per-document with `citations: {"enabled": true}`** on each document block. Currently all-or-none within a request: every document or none.
- **Three document modes**:
  - **Plain text** — auto-chunked to sentences; citations emit `char_location` (0-indexed, exclusive end).
  - **PDF** — auto-chunked to sentences; citations emit `page_location` (1-indexed pages, exclusive end). Scans without extractable text are not citable (image-citation is not yet supported).
  - **Custom content** — you provide the chunks as a list of content blocks; citations emit `content_block_location` (0-indexed block indices, exclusive end). No further chunking.
- **Response shape**: the assistant's `content` becomes multiple text blocks; cited claims have a sibling `citations: [...]` array pointing to source documents.
- **`cited_text` does NOT count toward output tokens**, and when sent back in subsequent turns it does NOT count toward input tokens either. Output-cost saving vs prompt-based "quote your sources" patterns.
- **Citations + Structured Outputs are incompatible** — combining them returns **400**. Cited text must interleave with response text, which violates strict JSON schema.
- **Citations + prompt caching work together** — apply `cache_control` to the document block; cited responses themselves are not cached, but the document content is.
- **Compatible with Batch processing and token counting.**

## Quoted (citation-ready)

> "Claude is capable of providing detailed citations when answering questions about documents, helping you track and verify information sources in responses. All active models support citations, with the exception of Haiku 3."
>
> — Citations, intro
>
> Anchor: `Citations + Claude is capable of providing detailed citations`

> "Set `citations.enabled=true` on each of your documents. Currently, citations must be enabled on all or none of the documents within a request. Note that only text citations are currently supported and image citations are not yet possible."
>
> — Citations, "How citations work" → step 1
>
> Anchor: `How citations work + Set citations.enabled=true on each of your documents`

> "Enabling citations incurs a slight increase in input tokens due to system prompt additions and document chunking. However, the citations feature is very efficient with output tokens. Under the hood, the model is outputting citations in a standardized format that are then parsed into cited text and document location indices. The `cited_text` field is provided for convenience and does not count towards output tokens."
>
> — Citations, "Token costs"
>
> Anchor: `Token costs + Enabling citations incurs a slight increase in input tokens`

> "Citations cannot be used together with Structured Outputs. If you enable citations on any user-provided document (Document blocks or RequestSearchResultBlock) and also include the `output_config.format` parameter (or the deprecated `output_format` parameter), the API will return a 400 error."
>
> — Citations, "Feature compatibility" (Warning callout)
>
> Anchor: `Feature compatibility + Citations cannot be used together with Structured Outputs`

## API shape (text document)

```json
{
  "model": "claude-opus-4-7",
  "messages": [{
    "role": "user",
    "content": [
      {
        "type": "document",
        "source": {"type": "text", "media_type": "text/plain", "data": "The grass is green. The sky is blue."},
        "title": "My Document",
        "context": "This is a trustworthy document.",
        "citations": {"enabled": true}
      },
      {"type": "text", "text": "What color is the grass and sky?"}
    ]
  }]
}
```

## Response shape

```python
{
  "content": [
    {"type": "text", "text": "According to the document, "},
    {
      "type": "text",
      "text": "the grass is green",
      "citations": [{
        "type": "char_location",
        "cited_text": "The grass is green.",   # not billed
        "document_index": 0,
        "document_title": "Example Document",
        "start_char_index": 0,
        "end_char_index": 20
      }]
    },
    ...
  ]
}
```

## Document type modes — citation format reference

| Mode | Chunking | Citation type | Location fields |
|---|---|---|---|
| Plain text | Sentences | `char_location` | `start_char_index` (0), `end_char_index` (exclusive) |
| PDF | Sentences | `page_location` | `start_page_number` (1), `end_page_number` (exclusive) |
| Custom content | None (you supply) | `content_block_location` | `start_block_index` (0), `end_block_index` (exclusive) |

`title` and `context` are passed to the model but **not citable** — useful for metadata that should inform without being quoted back.

## Streaming

Citations stream as `citations_delta` events nested inside `content_block_delta` events:

```sse
event: content_block_delta
data: {"type": "content_block_delta", "index": 0,
       "delta": {"type": "citations_delta",
                 "citation": {"type": "char_location", "cited_text": "...", ...}}}
```

See [[docs-streaming]] for full event taxonomy.

## Documents can come from the Files API

PDFs and text documents may be supplied either inline (base64 / text data) or via `file_id` from [[docs-files-api]]. Same `citations: {"enabled": true}` toggle applies.

## Cross-references

- See [[docs-files-api]] for `file_id` references on document blocks.
- See [[docs-batch-api]] — citations compose with batch (50% off + cited text not billed twice).
- See [[docs-streaming]] for `citations_delta`.
- See `../../landscape-2026-05.md` §1.5 — "Citations: GA" — consistent with this note.

## Open questions / follow-ups

- **Image citations** are explicitly not yet supported; track when this changes for multimodal RAG chapters.
- **`RequestSearchResultBlock`** is referenced in the "incompatible with Structured Outputs" warning but is not documented here. Worth a follow-up — likely tied to the Memory Tool / structured-search experimental surface.
- **Structured-output incompatibility workaround**: the docs hint a "search result" interleave path. For chapters covering both at once, the recommended pattern is two-pass (cite, then schema-coerce).
