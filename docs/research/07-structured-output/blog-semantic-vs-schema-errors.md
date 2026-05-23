---
source_url: https://code.claude.com/docs/en/agent-sdk/structured-outputs
canonical_url: https://code.claude.com/docs/en/agent-sdk/structured-outputs
source_title: Get structured output from agents (semantic vs schema errors synthesis)
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: structured-output
tier: T1-official
cert_domains: [4, 5]
cert_task_areas: ["Validation, retry, feedback loops (semantic vs schema errors)", "Information provenance (claim-source mappings)"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Semantic vs schema errors — the validation-retry-feedback layer above structured outputs

Synthesis note. **Schema errors** are eliminated by Anthropic's constrained-decoding implementation of structured outputs ([[docs-structured-outputs]], [[docs-strict-tool-use]]); the Agent SDK handles the residual ones via retry ([[docs-agent-sdk-structured-outputs]]). The next layer up — **semantic errors**, where the JSON is shape-valid but the *data* is wrong — is the cert's "Validation, retry, feedback loops" task area and the v0.1 cert PDF's heavy emphasis area. This note synthesizes the patterns supported by the docs.

## The error taxonomy

| Error class | What | Caught by | Mitigation |
|---|---|---|---|
| **Syntax error** — invalid JSON token | Output isn't parseable | Caller's `JSON.parse` / SDK | Structured outputs (constrained decoding eliminates this) |
| **Schema error — type** — wrong type for a field | `passengers: "2"` instead of `2` | `strict: true` (eliminates) or SDK retry | Strict tool use / structured outputs |
| **Schema error — required** — missing required field | `email` field absent | Same as above | Same as above |
| **Schema error — enum** — value not in enum | `sentiment: "happy"` when enum is `[positive, negative, neutral]` | Same as above | Same as above |
| **Schema error — constraint** — fails `minLength`, `minimum`, regex (non-supported) | Hand-rolled validation | Caller's post-hoc Zod/Pydantic | SDK schema-transformation + post-validation |
| **Semantic error — wrong data** | `customer_name: "John"` when source says "Jane" | NOTHING in the API automatically; needs domain logic | Cross-checks, attribute-first verification, two-pass extract+verify |
| **Semantic error — fabricated value** | Output includes plausible but unsupported data | Same | Provenance / citation patterns |
| **Semantic error — conflict** | Two extracted fields disagree (`stated_total` vs `line_items.sum`) | Same | Schema-level conflict-detection fields |

## What structured outputs eliminates

> "Structured outputs guarantee schema-compliant responses through constrained decoding: Always valid: No more JSON.parse() errors. Type safe: Guaranteed field types and required fields. Reliable: No retries needed for schema violations."
>
> — [[docs-structured-outputs]] (Anchor `How It Works + Structured outputs guarantee schema-compliant responses through constrained decoding`)

The first three error classes above are gone. The constraint+regex limits (`minLength` etc.) are stripped by SDKs and re-validated client-side, so you'll catch them but in a way that's downstream of the model, not a model-level retry.

## What structured outputs does NOT eliminate

> "An important distinction: Instead of parsing errors (which structured outputs eliminate), you now need to think about semantic errors—responses that are valid JSON matching your schema but contain incorrect data."
>
> — Anthropic docs synthesis (search result; matches Agent SDK guidance)
>
> Anchor: `agent SDK + responses that are valid JSON matching your schema but contain incorrect data`

This is the cert's emphasis area. There's no API-level "is this semantically correct" validator — by definition, that requires domain knowledge or ground-truth comparison.

## Schema-level patterns for catching semantic errors

These are **schema design patterns** that *encode* semantic-validation hooks into the JSON itself, so the model has to commit to (and the caller can cross-check) verification signals:

### Pattern 1 — `detected_pattern` for type inference

When extracting heterogeneous data, include a field where the model declares what *category* it inferred:

```json
{
  "value": {"type": "string"},
  "detected_pattern": {
    "type": "string",
    "enum": ["currency_usd", "currency_eur", "percentage", "date_iso", "phone_us", "other"],
    "description": "The format pattern detected for `value`."
  }
}
```

The caller can then run a regex / pattern verifier matching `detected_pattern` against `value` — a model that misclassifies is caught downstream.

### Pattern 2 — `calculated_total` vs `stated_total`

For numerical extractions with internal arithmetic relationships (invoices, financial reports):

```json
{
  "line_items": {"type": "array", "items": {...}},
  "stated_total": {"type": "number", "description": "Total as stated on the document."},
  "calculated_total": {"type": "number", "description": "Sum of line_items[].amount, computed by you."}
}
```

The caller compares `stated_total` vs `calculated_total`. Mismatch → either the OCR / source is bad OR the model fabricated a value. Both demand human review.

### Pattern 3 — `conflict_detected` boolean

For documents with potentially-conflicting fields (medical records with multiple data sources, contracts with revisions):

```json
{
  "fields_extracted": {...},
  "conflict_detected": {
    "type": "boolean",
    "description": "True if any extracted field is contradicted elsewhere in the source."
  },
  "conflict_reason": {
    "type": ["string", "null"],
    "description": "If conflict_detected is true, describe which fields conflict and how."
  }
}
```

When `conflict_detected: true`, route to human review. This is a way to *delegate* semantic-error detection back to the model, but in a structured form that's measurable.

### Pattern 4 — Nullable + "other" with detail string

For closed-vocabulary fields that may not match (most extraction tasks have a long tail):

```json
{
  "category": {
    "type": "string",
    "enum": ["billing", "technical", "feature_request", "complaint", "other"],
    "description": "Pick the closest. Use 'other' only if no enum value fits."
  },
  "other_detail": {
    "type": ["string", "null"],
    "description": "If category is 'other', describe the actual category. Otherwise null."
  }
}
```

Always-nullable secondary fields + "other"+detail enum patterns are the canonical way to allow the model to **refuse to confabulate** without breaking the schema.

### Pattern 5 — Information provenance (matches D5 task area)

For RAG-style extraction where claims need source attribution:

```json
{
  "claim": {"type": "string"},
  "source": {
    "type": "object",
    "properties": {
      "document_id": {"type": "string"},
      "span_quote": {"type": "string", "description": "The exact text in the source that supports this claim."},
      "confidence": {"type": "string", "enum": ["high", "medium", "low"]}
    },
    "required": ["document_id", "span_quote", "confidence"]
  }
}
```

The caller verifies `span_quote` actually appears in `document_id`. If it doesn't, the model fabricated the citation. See [[../05-claude-api/docs-citations]] for the API-native version where the model can't fabricate because cited text is grammar-constrained to actual document spans (though it's mutually exclusive with structured outputs — so when you need both, this prompt-engineered version is the fallback).

## The "validation, retry, feedback loop" macro-pattern

Combining the layers:

```python
def extract_with_semantic_validation(client, source_text, max_attempts=3):
    history = [{"role": "user", "content": f"Extract from:\n{source_text}"}]
    for attempt in range(max_attempts):
        resp = client.messages.create(
            model="claude-opus-4-7", max_tokens=2048,
            output_config={"format": {"type": "json_schema", "schema": EXTRACTION_SCHEMA}},
            messages=history,
        )
        if resp.stop_reason == "refusal":
            return {"error": "refused", "billed": True}
        data = json.loads(resp.content[0].text)
        # Layer 1: schema is enforced by API — no parse / type errors possible
        # Layer 2: semantic checks
        errors = []
        if data["calculated_total"] != sum(li["amount"] for li in data["line_items"]):
            errors.append("calculated_total does not equal sum(line_items.amount)")
        if data["conflict_detected"] and not data["conflict_reason"]:
            errors.append("conflict_detected=true but conflict_reason is null")
        if data["category"] == "other" and not data["other_detail"]:
            errors.append("category='other' requires other_detail")
        if not errors:
            return data
        # Layer 3: feedback loop
        history.append({"role": "assistant", "content": resp.content[0].text})
        history.append({"role": "user", "content": (
            "The previous extraction has these semantic issues:\n"
            + "\n".join(f"- {e}" for e in errors)
            + "\nRe-extract correcting these issues."
        )})
    return {"error": "semantic_validation_exhausted", "last_attempt": data}
```

**Key**: structured outputs handles layer 1, application code handles layer 2, the feedback loop is what closes layer 3. Each layer can be implemented independently, and skipping any of them surfaces a different failure mode.

## Cross-references

- See [[docs-structured-outputs]] — schema-error elimination via constrained decoding.
- See [[docs-strict-tool-use]] — tool-input version of the same.
- See [[docs-agent-sdk-structured-outputs]] — built-in retry loop for residual schema mismatches.
- See [[../05-claude-api/docs-citations]] — API-native information provenance; incompatible with structured outputs (400) but the right tool when you can use it standalone.
- See [[docs-claude-4-best-practices-structured-output]] — the prompt-engineering layer (few-shot for ambiguity, XML for hybrid outputs).
- See `../../cert-coverage.md` — D5 "Information provenance (claim-source mappings, temporal data)" — same task area, this note is its primary-source synthesis.

## Open questions / follow-ups

- **Anthropic-published evals on the semantic-error patterns**: nothing public benchmarks `calculated_total` vs `stated_total` etc. These are extrapolated from the cookbook + Agent SDK patterns; worth a chapter author A/B.
- **`output_config.format` + retry-with-feedback latency**: each retry pays full first-call latency if the cache is cold AND has the grammar-compile overhead if `output_config.format` itself changes between attempts. Worth a chapter snippet on keeping the schema stable across retries.
- **Refusal during a retry loop**: docs are clear refusals are billed and 200; the loop above doesn't show what to do if refusal happens after partial extraction. Likely: surface to human review with the partial data.
- **MCP integration**: when the source data lives behind an MCP server, the extraction pipeline becomes: MCP-fetch → structured-output extract → semantic-validate → MCP-write-back. None of this is documented end-to-end; would be a strong chapter for the architect's reference.
