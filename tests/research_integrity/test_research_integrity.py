from __future__ import annotations

import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from research_integrity import (  # noqa: E402
    CANONICAL_BINDINGS,
    expected_artifacts,
    load_json,
    load_jsonl,
    validate,
    validate_schema,
)


class ResearchIntegrityTests(unittest.TestCase):
    def test_current_repository_is_integrity_valid_but_blocked(self) -> None:
        errors, counts = validate(ROOT)
        self.assertEqual([], errors)
        self.assertEqual(1469, counts["citation_occurrences"])
        self.assertEqual(2712, counts["binding_candidates"])
        self.assertEqual(0, counts["canonical_bindings"])
        status = load_json(ROOT / "research-integrity/release-status.json")
        self.assertEqual("blocked", status["state"])

    def test_ready_gate_rejects_pending_release(self) -> None:
        errors, _counts = validate(ROOT, require_release_ready=True)
        self.assertTrue(any("ResearchReleaseManifest v1" in error for error in errors))
        self.assertTrue(any("is not ready" in error for error in errors))
        self.assertTrue(any("candidate bindings remain" in error for error in errors))
        self.assertTrue(any("without canonical bindings" in error for error in errors))

    def test_every_citation_occurrence_has_a_candidate(self) -> None:
        citations = load_jsonl(ROOT / "research-integrity/citation-inventory.jsonl")
        candidates = load_jsonl(ROOT / "research-integrity/consumer-binding-candidates.jsonl")
        covered = {row["citation_occurrence_id"] for row in candidates}
        self.assertTrue(
            all(row["citation_occurrence_id"] in covered for row in citations)
        )

    def test_generation_is_byte_deterministic(self) -> None:
        first, first_errors, first_counts = expected_artifacts(ROOT)
        second, second_errors, second_counts = expected_artifacts(ROOT)
        self.assertEqual(first_errors, second_errors)
        self.assertEqual(first_counts, second_counts)
        self.assertEqual(first, second)

    def test_lock_matches_bundled_toolkit_schema(self) -> None:
        lock = load_json(ROOT / "research-lock.json")
        schema = load_json(ROOT / "research-integrity/schemas/research-lock.schema.json")
        self.assertEqual([], validate_schema(lock, schema, "research-lock"))
        locked_paths = {artifact["path"] for artifact in lock["artifacts"]}
        self.assertIn("research-integrity/config.json", locked_paths)

    def test_candidate_records_cannot_claim_semantic_adjudication(self) -> None:
        candidates = load_jsonl(ROOT / "research-integrity/consumer-binding-candidates.jsonl")
        self.assertTrue(candidates)
        self.assertTrue(all(row["claim_id"] is None for row in candidates))
        self.assertTrue(all(row["status"] in {"pending", "stale"} for row in candidates))

    def _copy_fixture(self, destination: Path) -> None:
        shutil.copytree(ROOT / "research-integrity", destination / "research-integrity")
        shutil.copy2(ROOT / "research-lock.json", destination / "research-lock.json")
        for book in (
            "agentic-coding",
            "agentic-systems-design",
            "architect-reference",
            "handbook",
        ):
            shutil.copytree(ROOT / book / "sources", destination / book / "sources")
            source = ROOT / book / "src" / "content"
            target = destination / book / "src" / "content"
            for path in source.rglob("*"):
                if path.is_file() and path.suffix in {".md", ".mdx"}:
                    relative = path.relative_to(source)
                    (target / relative).parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(path, target / relative)

    def test_tampered_locked_artifact_is_detected(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            fixture = Path(temporary)
            self._copy_fixture(fixture)
            candidate_path = fixture / "research-integrity/consumer-binding-candidates.jsonl"
            candidate_path.write_text(candidate_path.read_text() + "\n", encoding="utf-8")
            errors, _counts = validate(fixture)
            self.assertTrue(any("stale" in error for error in errors))
            self.assertTrue(any("hash mismatch" in error for error in errors))

    def test_content_change_invalidates_inventory_and_binding_candidates(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            fixture = Path(temporary)
            self._copy_fixture(fixture)
            target = next((fixture / "handbook/src/content/chapters").glob("*.mdx"))
            target.write_text(target.read_text(encoding="utf-8") + "\n", encoding="utf-8")
            errors, _counts = validate(fixture)
            stale = [error for error in errors if "generated artifact is stale" in error]
            self.assertGreaterEqual(len(stale), 2)

    def test_invalid_canonical_binding_is_rejected(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            fixture = Path(temporary)
            self._copy_fixture(fixture)
            bad = {
                "schema_version": "1.0.0",
                "binding_id": "binding_bad",
                "dossier_id": "dossier_bad",
                "claim_id": "claim_bad"
            }
            (fixture / CANONICAL_BINDINGS).write_text(
                json.dumps(bad, sort_keys=True) + "\n", encoding="utf-8"
            )
            errors, _counts = validate(fixture)
            self.assertTrue(any("required field is missing" in error for error in errors))

    def test_canonical_binding_cannot_escape_repository(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            fixture = Path(temporary)
            self._copy_fixture(fixture)
            binding = {
                "schema_version": "1.0.0",
                "binding_id": "binding_escape",
                "dossier_id": "dossier_example",
                "claim_id": "claim_example",
                "consumer_repo": "claude-books",
                "consumer_path": "../outside.md",
                "anchor": "example",
                "content_sha256": "0" * 64,
                "release_role": "reader-facing",
                "last_verified_at": "2026-07-14T00:00:00-04:00",
                "status": "removed",
            }
            (fixture / CANONICAL_BINDINGS).write_text(
                json.dumps(binding, sort_keys=True) + "\n", encoding="utf-8"
            )
            errors, _counts = validate(fixture)
            self.assertTrue(any("consumer path escapes repository" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
