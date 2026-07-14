"""Deterministic claude-books research-integrity generation and validation."""

from __future__ import annotations

import hashlib
import json
import os
import re
from collections import Counter, defaultdict
from datetime import date, datetime
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import urlparse

import yaml


SCHEMA_VERSION = "1.0.0"
CONFIG_PATH = Path("research-integrity/config.json")
UPSTREAM_CANDIDATES = Path(
    "research-integrity/upstream/migration-consumer-binding-candidates.jsonl"
)
CANONICAL_BINDINGS = Path("research-integrity/consumer-bindings.jsonl")

CITATION_RE = re.compile(
    r"<Citation\b[^>]*\bsrc\s*=\s*[\"']([^\"']+)[\"']"
)
FENCED_CODE_RE = re.compile(r"(?s)(```.*?```|~~~.*?~~~)")
INLINE_CODE_RE = re.compile(r"`+[^`\n]*`+")
ID_RE = re.compile(r"^[A-Za-z][A-Za-z0-9._:-]*$")
SHA_RE = re.compile(r"^[a-f0-9]{64}$")
RELEASE_RE = re.compile(r"^rr-[0-9]{8}[.][0-9]+$")


class IntegrityError(ValueError):
    """Raised for invalid source or integrity artifacts."""


def canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def pretty_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n"


def jsonl(rows: Iterable[dict[str, Any]]) -> str:
    return "".join(canonical_json(row) + "\n" for row in rows)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    hasher = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def safe_repo_path(root: Path, value: Any) -> Path | None:
    """Resolve a non-empty repository-relative path without allowing escape."""
    if not isinstance(value, str) or not value:
        return None
    try:
        relative = Path(value)
        if relative.is_absolute():
            return None
        path = (root / relative).resolve()
        path.relative_to(root.resolve())
    except (OSError, ValueError):
        return None
    return path


def record_id(prefix: str, value: dict[str, Any]) -> str:
    return f"{prefix}_{sha256_bytes(canonical_json(value).encode())[:20]}"


def write_if_changed(path: Path, content: str | bytes) -> bool:
    raw = content.encode("utf-8") if isinstance(content, str) else content
    if path.exists() and path.read_bytes() == raw:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_bytes(raw)
    os.replace(temporary, path)
    return True


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise IntegrityError(f"missing JSON artifact: {path}") from exc
    except json.JSONDecodeError as exc:
        raise IntegrityError(f"{path}: invalid JSON: {exc.msg}") from exc


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except FileNotFoundError as exc:
        raise IntegrityError(f"missing JSONL artifact: {path}") from exc
    rows: list[dict[str, Any]] = []
    for number, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            value = json.loads(line)
        except json.JSONDecodeError as exc:
            raise IntegrityError(f"{path}:{number}: invalid JSON: {exc.msg}") from exc
        if not isinstance(value, dict):
            raise IntegrityError(f"{path}:{number}: expected an object")
        rows.append(value)
    return rows


def load_config(root: Path) -> dict[str, Any]:
    value = load_json(root / CONFIG_PATH)
    if not isinstance(value, dict):
        raise IntegrityError(f"{CONFIG_PATH}: expected an object")
    if value.get("schema_version") != SCHEMA_VERSION:
        raise IntegrityError(f"{CONFIG_PATH}: unsupported schema version")
    if not RELEASE_RE.fullmatch(str(value.get("release_id", ""))):
        raise IntegrityError(f"{CONFIG_PATH}: invalid release ID")
    return value


def _mask_match(match: re.Match[str]) -> str:
    return "".join("\n" if char == "\n" else " " for char in match.group(0))


def mask_markdown_code(text: str) -> str:
    """Mask code spans while preserving offsets and line numbers."""
    return INLINE_CODE_RE.sub(_mask_match, FENCED_CODE_RE.sub(_mask_match, text))


def manifest_index(
    root: Path, config: dict[str, Any]
) -> tuple[dict[tuple[str, str], dict[str, Any]], list[str]]:
    index: dict[tuple[str, str], dict[str, Any]] = {}
    errors: list[str] = []
    for book in config["books"]:
        path = root / book / "sources" / "manifest.yaml"
        try:
            value = yaml.safe_load(path.read_text(encoding="utf-8")) or []
        except (OSError, yaml.YAMLError) as exc:
            errors.append(f"{path.relative_to(root)}: cannot load manifest: {exc}")
            continue
        if not isinstance(value, list):
            errors.append(f"{path.relative_to(root)}: manifest root must be a list")
            continue
        for row in value:
            if not isinstance(row, dict) or not row.get("id"):
                errors.append(f"{path.relative_to(root)}: every source must have an ID")
                continue
            source_id = str(row["id"])
            if ID_RE.fullmatch(source_id) is None:
                errors.append(f"{path.relative_to(root)}: invalid source ID {source_id!r}")
                continue
            source_url = row.get("url")
            try:
                parsed_url = urlparse(source_url) if isinstance(source_url, str) else None
            except ValueError:
                parsed_url = None
            if (
                parsed_url is None
                or parsed_url.scheme not in {"http", "https"}
                or not parsed_url.netloc
            ):
                errors.append(
                    f"{path.relative_to(root)}: source {source_id} must have an HTTP(S) URL"
                )
                continue
            key = (book, source_id)
            if key in index:
                errors.append(f"{path.relative_to(root)}: duplicate source ID {row['id']}")
                continue
            index[key] = {
                **row,
                "manifest_path": path.relative_to(root).as_posix(),
            }
    return index, errors


def _frontmatter(text: str) -> tuple[dict[str, Any], int] | None:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None
    try:
        end = next(index for index, line in enumerate(lines[1:], 1) if line.strip() == "---")
    except StopIteration as exc:
        raise IntegrityError("frontmatter is not closed") from exc
    try:
        value = yaml.safe_load("\n".join(lines[1:end])) or {}
    except yaml.YAMLError as exc:
        raise IntegrityError(f"invalid frontmatter YAML: {exc}") from exc
    if not isinstance(value, dict):
        raise IntegrityError("frontmatter root must be a mapping")
    return value, end


def _source_declaration_lines(text: str, end: int, source_ids: list[str]) -> list[int]:
    lines = text.splitlines()
    output: list[int] = []
    start = next(
        (index for index in range(1, end) if re.match(r"^sources\s*:", lines[index])),
        1,
    )
    cursor = start + 1
    for source_id in source_ids:
        pattern = re.compile(rf"^\s*-\s*{re.escape(source_id)}\s*$")
        found = next((index for index in range(cursor, end) if pattern.match(lines[index])), None)
        if found is None:
            found = next((index for index in range(start + 1, end) if pattern.match(lines[index])), start)
        output.append(found + 1)
        cursor = found + 1
    return output


def discover_citations(
    root: Path, config: dict[str, Any]
) -> tuple[list[dict[str, Any]], list[str]]:
    manifests, errors = manifest_index(root, config)
    rows: list[dict[str, Any]] = []
    for book in config["books"]:
        content_root = root / book / "src" / "content"
        paths = sorted(
            path
            for path in content_root.rglob("*")
            if path.is_file() and path.suffix in {".md", ".mdx"}
        )
        for path in paths:
            text = path.read_text(encoding="utf-8")
            relative = path.relative_to(root).as_posix()
            content_hash = sha256_bytes(text.encode("utf-8"))
            try:
                frontmatter = _frontmatter(text)
            except IntegrityError as exc:
                errors.append(f"{relative}: {exc}")
                frontmatter = None
            if frontmatter is not None:
                metadata, end = frontmatter
                declared = metadata.get("sources") or []
                if not isinstance(declared, list):
                    errors.append(f"{relative}: frontmatter sources must be a list")
                    declared = []
                source_ids = [str(item) for item in declared]
                for citation_id, line in zip(
                    source_ids, _source_declaration_lines(text, end, source_ids), strict=True
                ):
                    source_line = text.splitlines()[line - 1]
                    column = max(source_line.find(citation_id), 0) + 1
                    manifest = manifests.get((book, citation_id))
                    if manifest is None:
                        errors.append(f"{relative}:{line}: undeclared manifest source {citation_id}")
                    base = {
                        "schema_version": SCHEMA_VERSION,
                        "book": book,
                        "citation_id": citation_id,
                        "citation_kind": "frontmatter-source",
                        "consumer_path": relative,
                        "line": line,
                        "column": column,
                        "anchor": f"frontmatter:{citation_id}:L{line}:C{column}",
                        "content_sha256": content_hash,
                        "source_manifest_path": manifest.get("manifest_path") if manifest else None,
                        "source_url": manifest.get("url") if manifest else None,
                    }
                    base["citation_occurrence_id"] = record_id("citation", base)
                    rows.append(base)
            masked = mask_markdown_code(text)
            for match in CITATION_RE.finditer(masked):
                citation_id = match.group(1)
                line = text.count("\n", 0, match.start()) + 1
                line_start = text.rfind("\n", 0, match.start()) + 1
                column = match.start() - line_start + 1
                manifest = manifests.get((book, citation_id))
                if manifest is None:
                    errors.append(f"{relative}:{line}: undeclared manifest source {citation_id}")
                base = {
                    "schema_version": SCHEMA_VERSION,
                    "book": book,
                    "citation_id": citation_id,
                    "citation_kind": "inline-citation",
                    "consumer_path": relative,
                    "line": line,
                    "column": column,
                    "anchor": f"citation:{citation_id}:L{line}:C{column}",
                    "content_sha256": content_hash,
                    "source_manifest_path": manifest.get("manifest_path") if manifest else None,
                    "source_url": manifest.get("url") if manifest else None,
                }
                base["citation_occurrence_id"] = record_id("citation", base)
                rows.append(base)
    rows.sort(
        key=lambda row: (
            row["consumer_path"],
            row["line"],
            row["citation_kind"],
            row["citation_id"],
        )
    )
    identifiers = [row["citation_occurrence_id"] for row in rows]
    if len(identifiers) != len(set(identifiers)):
        errors.append("citation occurrence IDs are not unique")
    return rows, errors


def build_candidates(
    root: Path,
    config: dict[str, Any],
    citations: list[dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[str]]:
    upstream = load_jsonl(root / UPSTREAM_CANDIDATES)
    exact_index: dict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    taxonomy: list[dict[str, Any]] = []
    errors: list[str] = []
    upstream_ids: set[str] = set()
    allowed_types = {
        "taxonomy_target",
        "exact_source_url_and_citation_id",
        "exact_source_url_manifest_only",
    }
    for number, row in enumerate(upstream, 1):
        upstream_id = row.get("id")
        candidate_type = row.get("candidate_type")
        consumer_path = row.get("consumer_path")
        valid = True
        if not isinstance(upstream_id, str) or ID_RE.fullmatch(upstream_id) is None:
            errors.append(f"{UPSTREAM_CANDIDATES}:{number}: invalid candidate ID")
            valid = False
        elif upstream_id in upstream_ids:
            errors.append(f"{UPSTREAM_CANDIDATES}:{number}: duplicate candidate ID {upstream_id}")
            valid = False
        else:
            upstream_ids.add(upstream_id)
        if candidate_type not in allowed_types:
            errors.append(f"{UPSTREAM_CANDIDATES}:{number}: invalid candidate type")
            valid = False
        if row.get("claim_id") is not None:
            errors.append(f"{UPSTREAM_CANDIDATES}:{number}: claim_id must remain null")
            valid = False
        if row.get("consumer_repository") != "claude-books":
            errors.append(f"{UPSTREAM_CANDIDATES}:{number}: invalid consumer repository")
            valid = False
        if safe_repo_path(root, consumer_path) is None:
            errors.append(f"{UPSTREAM_CANDIDATES}:{number}: consumer path escapes repository")
            valid = False
        if not valid:
            continue
        if candidate_type == "taxonomy_target":
            taxonomy.append(row)
        elif candidate_type in {
            "exact_source_url_and_citation_id",
            "exact_source_url_manifest_only",
        }:
            exact_index[(str(row.get("consumer_path")), str(row.get("consumer_anchor")))].append(row)
    output: list[dict[str, Any]] = []
    matched_upstream: set[str] = set()
    for citation in citations:
        matches = exact_index.get((citation["consumer_path"], citation["citation_id"]), [])
        if matches:
            for upstream_row in sorted(matches, key=lambda row: row["id"]):
                matched_upstream.add(str(upstream_row["id"]))
                base = {
                    "schema_version": "1.0.0-candidate",
                    "release_id": config["release_id"],
                    "candidate_type": (
                        "dossier-source-to-inline-citation"
                        if citation["citation_kind"] == "inline-citation"
                        else "dossier-source-to-frontmatter-source"
                    ),
                    "dossier_id": upstream_row.get("dossier_id"),
                    "claim_id": None,
                    "source_id": upstream_row.get("source_id"),
                    "citation_occurrence_id": citation["citation_occurrence_id"],
                    "citation_id": citation["citation_id"],
                    "consumer_repo": "claude-books",
                    "consumer_path": citation["consumer_path"],
                    "anchor": citation["anchor"],
                    "content_sha256": citation["content_sha256"],
                    "release_role": (
                        "reader-facing"
                        if citation["citation_kind"] == "inline-citation"
                        else "index"
                    ),
                    "status": "pending",
                    "basis": [upstream_row["id"]],
                    "limitation": "exact source reuse does not identify or verify an entailing dossier claim",
                }
                base["candidate_id"] = record_id("binding_candidate", base)
                output.append(base)
        else:
            base = {
                "schema_version": "1.0.0-candidate",
                "release_id": config["release_id"],
                "candidate_type": (
                    "unmapped-inline-citation"
                    if citation["citation_kind"] == "inline-citation"
                    else "unmapped-frontmatter-source"
                ),
                "dossier_id": None,
                "claim_id": None,
                "source_id": None,
                "citation_occurrence_id": citation["citation_occurrence_id"],
                "citation_id": citation["citation_id"],
                "consumer_repo": "claude-books",
                "consumer_path": citation["consumer_path"],
                "anchor": citation["anchor"],
                "content_sha256": citation["content_sha256"],
                "release_role": (
                    "reader-facing"
                    if citation["citation_kind"] == "inline-citation"
                    else "index"
                ),
                "status": "pending",
                "basis": [],
                "limitation": "no current dossier source candidate was found",
            }
            base["candidate_id"] = record_id("binding_candidate", base)
            output.append(base)
    for upstream_row in sorted(taxonomy, key=lambda row: row["id"]):
        path = safe_repo_path(root, upstream_row["consumer_path"])
        assert path is not None
        content_hash = sha256_file(path) if path.is_file() else None
        base = {
            "schema_version": "1.0.0-candidate",
            "release_id": config["release_id"],
            "candidate_type": "taxonomy-target",
            "dossier_id": upstream_row.get("dossier_id"),
            "claim_id": None,
            "source_id": None,
            "citation_occurrence_id": None,
            "citation_id": None,
            "consumer_repo": "claude-books",
            "consumer_path": upstream_row["consumer_path"],
            "anchor": str(upstream_row.get("consumer_anchor")),
            "content_sha256": content_hash,
            "release_role": "index",
            "status": "pending" if content_hash else "stale",
            "basis": [upstream_row["id"]],
            "limitation": "topic-level book target does not identify a claim-bearing passage",
        }
        base["candidate_id"] = record_id("binding_candidate", base)
        output.append(base)
    for row in upstream:
        if str(row.get("candidate_type", "")).startswith("exact_") and row.get(
            "id"
        ) not in matched_upstream:
            errors.append(f"upstream source candidate no longer resolves: {row.get('id')}")
    output.sort(
        key=lambda row: (
            row["consumer_path"],
            row["anchor"],
            row["candidate_type"],
            row.get("dossier_id") or "",
            row["candidate_id"],
        )
    )
    return output, errors


def dossier_release(config: dict[str, Any]) -> dict[str, Any]:
    dossier = config["dossiers"]
    return {
        "schema_version": "claude-books.dossier-release-pin/1.0.0",
        "release_id": config["release_id"],
        "status": "blocked",
        "source_repository": "research-dossiers",
        "source_commit": dossier["source_commit"],
        "migration_commit": dossier["migration_commit"],
        "migration_schema_version": dossier["migration_schema_version"],
        "migration_generated_digest": dossier["migration_generated_digest"],
        "dossier_count": dossier["dossier_count"],
        "structurally_validated_count": dossier["structurally_validated_count"],
        "canonical_toolkit_v1_valid": dossier["canonical_toolkit_v1_valid"],
        "semantic_review_complete": False,
        "report_sha256": {
            "corpus_census": dossier["corpus_census_sha256"],
            "relevant_dossier_census": dossier["relevant_dossier_census_sha256"],
            "migration_validation": dossier["migration_validation_sha256"],
        },
        "blocking_conditions": [
            "migration records do not validate against toolkit canonical v1 schemas",
            "semantic dossier review is incomplete",
            "no coordinated dossier release manifest has reviewer acceptance",
        ],
    }


def release_status(
    config: dict[str, Any],
    citations: list[dict[str, Any]],
    candidates: list[dict[str, Any]],
    canonical_binding_count: int,
) -> dict[str, Any]:
    counts = Counter(row["candidate_type"] for row in candidates)
    return {
        "schema_version": "claude-books.research-release-status/1.0.0",
        "release_id": config["release_id"],
        "state": "blocked" if config.get("force_blocked", True) else "pending",
        "semantic_review_complete": False,
        "citation_occurrence_count": len(citations),
        "candidate_binding_count": len(candidates),
        "canonical_binding_count": canonical_binding_count,
        "candidate_type_counts": dict(sorted(counts.items())),
        "blocking_conditions": [
            "canonical dossier release is unavailable",
            "claim-to-passage semantic adjudication is incomplete",
            "canonical consumer bindings are incomplete",
            "dossier source watches and semantic reviews are incomplete",
        ],
        "unresolved_findings": [
            "DR-semantic-review-pending",
            "FP-freshness-configuration-pending",
            "TK-corpus-contract-v1-migration-required",
        ],
        "waivers": [],
        "reviewer_acceptance": [],
    }


def lock_record(
    root: Path,
    config: dict[str, Any],
    contents: dict[Path, bytes],
) -> dict[str, Any]:
    dossier_path = Path("research-integrity/dossier-release.json")
    artifact_paths = sorted(
        [
            CONFIG_PATH,
            dossier_path,
            UPSTREAM_CANDIDATES,
            Path("research-integrity/citation-inventory.jsonl"),
            Path("research-integrity/consumer-binding-candidates.jsonl"),
            CANONICAL_BINDINGS,
            Path("research-integrity/release-status.json"),
            Path("research-integrity/schemas/consumer-binding.schema.json"),
            Path("research-integrity/schemas/research-lock.schema.json"),
        ],
        key=str,
    )
    artifacts = []
    for path in artifact_paths:
        raw = contents.get(path)
        if raw is None:
            raw = (root / path).read_bytes()
        artifacts.append({"path": path.as_posix(), "sha256": sha256_bytes(raw)})
    dossier_raw = contents[dossier_path]
    return {
        "schema_version": SCHEMA_VERSION,
        "lock_version": "1",
        "release_id": config["release_id"],
        "dossier_release_sha256": sha256_bytes(dossier_raw),
        "toolkit": {
            "commit": config["toolkit"]["commit"],
            "version": config["toolkit"]["plugin_version"],
        },
        "artifacts": artifacts,
        "generated_at": config["generated_at"],
    }


def expected_artifacts(root: Path) -> tuple[dict[Path, bytes], list[str], dict[str, int]]:
    config = load_config(root)
    expected_upstream_hash = config["dossiers"]["upstream_candidate_sha256"]
    actual_upstream_hash = sha256_file(root / UPSTREAM_CANDIDATES)
    errors: list[str] = []
    if actual_upstream_hash != expected_upstream_hash:
        errors.append(
            f"{UPSTREAM_CANDIDATES}: expected {expected_upstream_hash}, got {actual_upstream_hash}"
        )
    citations, citation_errors = discover_citations(root, config)
    candidates, candidate_errors = build_candidates(root, config, citations)
    errors.extend(citation_errors)
    errors.extend(candidate_errors)
    canonical_path = root / CANONICAL_BINDINGS
    if not canonical_path.exists():
        canonical_raw = b""
        canonical_count = 0
    else:
        canonical_raw = canonical_path.read_bytes()
        try:
            canonical_count = len(load_jsonl(canonical_path))
        except IntegrityError as exc:
            errors.append(str(exc))
            canonical_count = 0
    dossier = dossier_release(config)
    status = release_status(config, citations, candidates, canonical_count)
    contents: dict[Path, bytes] = {
        Path("research-integrity/citation-inventory.jsonl"): jsonl(citations).encode(),
        Path("research-integrity/consumer-binding-candidates.jsonl"): jsonl(candidates).encode(),
        CANONICAL_BINDINGS: canonical_raw,
        Path("research-integrity/dossier-release.json"): pretty_json(dossier).encode(),
        Path("research-integrity/release-status.json"): pretty_json(status).encode(),
    }
    contents[Path("research-lock.json")] = pretty_json(
        lock_record(root, config, contents)
    ).encode()
    counts = {
        "citation_occurrences": len(citations),
        "binding_candidates": len(candidates),
        "canonical_bindings": canonical_count,
        "inline_citations": sum(row["citation_kind"] == "inline-citation" for row in citations),
        "frontmatter_sources": sum(
            row["citation_kind"] == "frontmatter-source" for row in citations
        ),
        "unmapped_candidates": sum(row["candidate_type"].startswith("unmapped-") for row in candidates),
        "taxonomy_candidates": sum(row["candidate_type"] == "taxonomy-target" for row in candidates),
    }
    return contents, errors, counts


def generate(root: Path, check: bool = False) -> tuple[list[str], dict[str, int]]:
    contents, errors, counts = expected_artifacts(root)
    for relative, raw in contents.items():
        path = root / relative
        if check:
            if not path.exists():
                errors.append(f"missing generated artifact: {relative}")
            elif path.read_bytes() != raw:
                errors.append(f"generated artifact is stale: {relative}")
        else:
            write_if_changed(path, raw)
    return errors, counts


def _matches_type(value: Any, expected: str) -> bool:
    return {
        "object": isinstance(value, dict),
        "array": isinstance(value, list),
        "string": isinstance(value, str),
        "integer": isinstance(value, int) and not isinstance(value, bool),
        "number": isinstance(value, (int, float)) and not isinstance(value, bool),
        "boolean": isinstance(value, bool),
        "null": value is None,
    }.get(expected, False)


def _format_valid(value: str, name: str) -> bool:
    try:
        if name == "date":
            date.fromisoformat(value)
            return True
        if name == "date-time":
            datetime.fromisoformat(value.replace("Z", "+00:00"))
            return "T" in value
        if name == "uri":
            parsed = urlparse(value)
            return bool(parsed.scheme and (parsed.netloc or parsed.scheme == "urn"))
    except ValueError:
        return False
    return True


def validate_schema(value: Any, schema: dict[str, Any], location: str = "$") -> list[str]:
    errors: list[str] = []
    expected = schema.get("type")
    if expected is not None:
        choices = expected if isinstance(expected, list) else [expected]
        if not any(_matches_type(value, choice) for choice in choices):
            return [f"{location}: expected {' or '.join(choices)}"]
    if "const" in schema and value != schema["const"]:
        errors.append(f"{location}: expected constant {schema['const']!r}")
    if "enum" in schema and value not in schema["enum"]:
        errors.append(f"{location}: invalid enum value {value!r}")
    if isinstance(value, str):
        if "minLength" in schema and len(value) < schema["minLength"]:
            errors.append(f"{location}: string too short")
        if "pattern" in schema and re.fullmatch(schema["pattern"], value) is None:
            errors.append(f"{location}: does not match {schema['pattern']!r}")
        if "format" in schema and not _format_valid(value, schema["format"]):
            errors.append(f"{location}: invalid {schema['format']}")
    if isinstance(value, list):
        if "minItems" in schema and len(value) < schema["minItems"]:
            errors.append(f"{location}: too few items")
        if schema.get("uniqueItems"):
            encoded = [canonical_json(item) for item in value]
            if len(encoded) != len(set(encoded)):
                errors.append(f"{location}: items are not unique")
        if isinstance(schema.get("items"), dict):
            for index, item in enumerate(value):
                errors.extend(validate_schema(item, schema["items"], f"{location}[{index}]"))
    if isinstance(value, dict):
        for key in schema.get("required", []):
            if key not in value:
                errors.append(f"{location}.{key}: required field is missing")
        properties = schema.get("properties", {})
        for key, item in value.items():
            if key in properties:
                errors.extend(validate_schema(item, properties[key], f"{location}.{key}"))
            elif schema.get("additionalProperties") is False:
                errors.append(f"{location}.{key}: unexpected field")
    return errors


def validate(root: Path, require_release_ready: bool = False) -> tuple[list[str], dict[str, int]]:
    errors, counts = generate(root, check=True)
    config = load_config(root)
    lock = load_json(root / "research-lock.json")
    lock_schema = load_json(root / "research-integrity/schemas/research-lock.schema.json")
    errors.extend(validate_schema(lock, lock_schema, "research-lock"))
    if isinstance(lock, dict):
        if lock.get("release_id") != config["release_id"]:
            errors.append("research-lock.json: release ID differs from config")
        for artifact in lock.get("artifacts", []):
            artifact_path = artifact.get("path")
            path = safe_repo_path(root, artifact_path)
            if path is None:
                errors.append(
                    f"research-lock.json: artifact escapes repository: {artifact_path}"
                )
                continue
            if not path.is_file():
                errors.append(f"research-lock.json: missing artifact {artifact.get('path')}")
            elif sha256_file(path) != artifact.get("sha256"):
                errors.append(f"research-lock.json: hash mismatch for {artifact.get('path')}")
    candidates = load_jsonl(root / "research-integrity/consumer-binding-candidates.jsonl")
    candidate_ids = [row.get("candidate_id") for row in candidates]
    if len(candidate_ids) != len(set(candidate_ids)):
        errors.append("consumer-binding-candidates.jsonl: duplicate candidate IDs")
    for number, row in enumerate(candidates, 1):
        if row.get("claim_id") is not None:
            errors.append(f"consumer-binding-candidates.jsonl:{number}: claim_id must remain null")
        if row.get("status") not in {"pending", "stale"}:
            errors.append(f"consumer-binding-candidates.jsonl:{number}: invalid candidate status")
        content_hash = row.get("content_sha256")
        consumer_path = safe_repo_path(root, row.get("consumer_path"))
        if consumer_path is None:
            errors.append(
                f"consumer-binding-candidates.jsonl:{number}: consumer path escapes repository"
            )
        elif (
            content_hash is not None
            and consumer_path.is_file()
            and sha256_file(consumer_path) != content_hash
        ):
            errors.append(f"consumer-binding-candidates.jsonl:{number}: stale content hash")
    citations = load_jsonl(root / "research-integrity/citation-inventory.jsonl")
    covered = {row.get("citation_occurrence_id") for row in candidates}
    for row in citations:
        if row.get("citation_occurrence_id") not in covered:
            errors.append(
                f"citation inventory occurrence has no candidate: {row.get('citation_occurrence_id')}"
            )
    binding_schema = load_json(root / "research-integrity/schemas/consumer-binding.schema.json")
    bindings = load_jsonl(root / CANONICAL_BINDINGS)
    for number, row in enumerate(bindings, 1):
        errors.extend(
            f"consumer-bindings.jsonl:{number}: {error}"
            for error in validate_schema(row, binding_schema, "consumer-binding")
        )
        consumer_path = safe_repo_path(root, row.get("consumer_path"))
        if consumer_path is None:
            errors.append(
                f"consumer-bindings.jsonl:{number}: consumer path escapes repository"
            )
            continue
        if row.get("status") == "active":
            if not consumer_path.is_file():
                errors.append(f"consumer-bindings.jsonl:{number}: active consumer is missing")
            elif sha256_file(consumer_path) != row.get("content_sha256"):
                errors.append(f"consumer-bindings.jsonl:{number}: active content hash is stale")
    status = load_json(root / "research-integrity/release-status.json")
    if not isinstance(status, dict) or status.get("release_id") != config["release_id"]:
        errors.append("release-status.json: invalid release identity")
    if require_release_ready:
        dossier_pin = load_json(root / "research-integrity/dossier-release.json")
        if not isinstance(dossier_pin, dict) or dossier_pin.get("schema_version") != SCHEMA_VERSION:
            errors.append(
                "release authorization requires a standard ResearchReleaseManifest v1; "
                "the pinned dossier artifact is blocked provenance only"
            )
        if not isinstance(status, dict) or status.get("state") != "ready":
            errors.append(f"release {config['release_id']} is not ready")
        if candidates:
            errors.append("release cannot be ready while candidate bindings remain")
        if not bindings:
            errors.append("release cannot be ready without canonical bindings")
    return errors, counts
