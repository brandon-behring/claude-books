---
source_url: https://platform.claude.com/docs/en/build-with-claude/files
canonical_url: https://platform.claude.com/docs/en/build-with-claude/files
source_title: Files API
fetched_at: 2026-05-22
last_verified_at: 2026-05-22
topic: claude-api
tier: T1-official
cert_domains: [2, 4]
cert_task_areas: ["Built-in tools (Read, Write, Edit, Bash, Grep, Glob)"]
volatility: evolving
verified: true
supersedes: []
superseded_by: []
---

# Files API — upload-once, reference-many

## Key takeaways

- **Beta** (`anthropic-beta: files-api-2025-04-14`). Use the `file_id` returned from upload in subsequent Messages requests instead of re-uploading content each turn.
- **Three lifecycle ops are free**: upload, download, list, retrieve-metadata, delete. **Content used in `Messages` is priced as input tokens.**
- **Supported file types**:
  - PDF (`application/pdf`) → `document` block
  - Plain text (`text/plain`) → `document` block
  - Images (`image/jpeg`, `image/png`, `image/gif`, `image/webp`) → `image` block
  - Datasets and other formats → `container_upload` block (for code execution)
- **Not directly supported as `document`**: `.csv`, `.xlsx`, `.docx`, `.md`, `.txt`. Convert to plain text and inline, OR convert .docx with images to PDF first.
- **Storage limits**: 500 MB per file; 500 GB total per organization.
- **Workspace-scoped**: files visible to all API keys in the same workspace. Files persist until deleted (no automatic TTL). Files inaccessible shortly after deletion, but may persist briefly in active Messages calls.
- **Download is restricted** to files *created by* skills or the code execution tool. Files you uploaded **cannot** be downloaded — your origin is the source of truth.
- **Available on**: Claude API, Claude Platform on AWS, Microsoft Foundry. **Not currently on Amazon Bedrock or Vertex AI.**
- **Rate limit during beta**: ~100 file-API operations per minute.
- **NOT ZDR-eligible**: data is retained per the feature's standard retention policy.

## Quoted (citation-ready)

> "The Files API lets you upload and manage files to use with the Claude API without re-uploading content with each request. This is particularly useful when using the code execution tool to provide inputs (e.g. datasets and documents) and then download outputs (e.g. charts). You can also use the Files API to prevent having to continually re-upload frequently used documents and images across multiple API calls."
>
> — Files API, intro
>
> Anchor: `Files API + The Files API lets you upload and manage files`

> "To use the Files API, you'll need to include the beta feature header: `anthropic-beta: files-api-2025-04-14`."
>
> — Files API, "How to use the Files API"
>
> Anchor: `How to use the Files API + To use the Files API, you'll need to include the beta feature header`

> "You can only download files that were created by skills or the code execution tool. Files that you uploaded cannot be downloaded."
>
> — Files API, "Downloading a file" (Note callout)
>
> Anchor: `Downloading a file + You can only download files that were created by skills`

## API shape

### Upload

```bash
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@/path/to/document.pdf"
```

Response:

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-01-01T00:00:00Z",
  "downloadable": false
}
```

### Use in a Messages request

PDF reference:

```json
{
  "type": "document",
  "source": {"type": "file", "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"},
  "title": "Doc title (optional)",
  "context": "Extra context not cited (optional)",
  "citations": {"enabled": true}
}
```

Image reference:

```json
{
  "type": "image",
  "source": {"type": "file", "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"}
}
```

### Management

- `GET /v1/files` → list
- `GET /v1/files/{id}` → metadata
- `DELETE /v1/files/{id}` → delete
- `GET /v1/files/{id}/content` → download (skills/code-execution outputs only)

## Error handling (selected)

- **404** file not found / no access
- **400** invalid file type for content block
- **400** exceeds context window size
- **400** filename invalid (1–255 chars; forbidden chars `< > : " | ? * \ /` or unicode 0–31)
- **413** > 500 MB
- **403** workspace at 500 GB storage limit

## Cross-references

- See [[docs-citations]] for the `citations: {"enabled": true}` on document blocks; the Files API is the typical input path for citations on large PDFs.
- See [[docs-batch-api]] — batched requests can reference `file_id`s; useful for evaluating against a large shared document set.
- See [[docs-models-overview]] for which models support PDFs and other file types (referenced via the PDF support page).
- See `../../landscape-2026-05.md` §1.5 — flagged as GA in the marketing summary, but the docs still mark it **beta**; trust this note over the landscape summary for verifiability.

## Open questions / follow-ups

- **Beta vs GA discrepancy**: landscape-2026-05.md §1.5 calls the Files API "GA"; the current docs still mark it beta and require the `files-api-2025-04-14` header. Landscape doc is wrong; update on next refresh.
- **Bedrock / Vertex availability** is explicitly excluded. Worth tracking whether parity ships before the book publishes.
- **`docx` with images** workflow: convert to PDF, then upload, then use PDF citations. No first-class .docx ingestion.
- **`max_content_tokens`** (on web fetch / similar) is not exposed on the Files API itself — file content is loaded based on the document block's natural size, capped by the context window.
