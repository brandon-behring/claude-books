"""Tests for known_false.py: the phrase file, the self-test, the scan and the exit codes.

Run: python3 -m unittest discover -s scripts/freshness -v
"""

from __future__ import annotations

import contextlib
import io
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import known_false as kf  # noqa: E402

HEADER = "\t".join(kf.COLUMNS)


def make_tree(root: Path) -> None:
    """Create every content root under *root*, empty."""
    for rel in kf.CONTENT_ROOTS:
        (root / rel).mkdir(parents=True, exist_ok=True)


class PhraseFileTests(unittest.TestCase):
    def test_every_fixture_matches_its_pattern(self) -> None:
        self.assertEqual(kf.self_test(kf.load_phrases()), [])

    def test_ids_are_unique_and_sources_are_links(self) -> None:
        phrases = kf.load_phrases()
        self.assertEqual(len({p.id for p in phrases}), len(phrases))
        self.assertTrue(all(p.source.startswith("https://") for p in phrases))

    def test_wrong_header_is_an_error(self) -> None:
        with self.assertRaisesRegex(ValueError, "header"):
            kf.parse_phrases("id\tpattern\nx\ty\n")

    def test_short_row_is_an_error_naming_its_line(self) -> None:
        with self.assertRaisesRegex(ValueError, r":3: expected 5"):
            kf.parse_phrases(f"# comment\n{HEADER}\nx\tfoo\tsay foo\n")

    def test_bad_regex_is_an_error(self) -> None:
        with self.assertRaisesRegex(ValueError, "bad pattern"):
            kf.parse_phrases(f"{HEADER}\nx\t(unclosed\tsay\thttps://e\tn\n")

    def test_duplicate_id_is_an_error(self) -> None:
        row = "x\tfoo\tsay foo\thttps://e\tn"
        with self.assertRaisesRegex(ValueError, "duplicate id"):
            kf.parse_phrases(f"{HEADER}\n{row}\n{row}\n")

    def test_header_without_rows_is_an_error(self) -> None:
        with self.assertRaisesRegex(ValueError, "no phrases"):
            kf.parse_phrases(f"{HEADER}\n")

    def test_pattern_that_misses_its_fixture_fails_the_self_test(self) -> None:
        phrases = kf.parse_phrases(f"{HEADER}\nx\tfoo\tsay bar\thttps://e\tn\n")
        self.assertEqual(kf.self_test(phrases), ["x"])


class ScanTests(unittest.TestCase):
    def test_every_fixture_planted_in_a_book_is_reported(self) -> None:
        phrases = kf.load_phrases()
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            make_tree(root)
            page = root / "handbook/src/content/planted.mdx"
            page.parent.mkdir(parents=True)
            page.write_text("intro\n" + "\n".join(p.fixture for p in phrases) + "\n", "utf-8")
            hit_ids = {pid for _, _, pid in kf.scan(root, phrases)}
        self.assertEqual(hit_ids, {p.id for p in phrases})

    def test_hit_names_path_and_line(self) -> None:
        phrase = kf.load_phrases()[0]
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            make_tree(root)
            (root / "glossary/term.md").write_text(f"a\nb\n{phrase.fixture}\n", "utf-8")
            self.assertEqual(kf.scan(root, [phrase]), [("glossary/term.md", 3, phrase.id)])

    def test_other_suffixes_and_node_modules_are_skipped(self) -> None:
        phrase = kf.load_phrases()[0]
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            make_tree(root)
            (root / "hub/src/notes.txt").write_text(phrase.fixture, "utf-8")
            vendored = root / "series/node_modules/pkg"
            vendored.mkdir(parents=True)
            (vendored / "README.md").write_text(phrase.fixture, "utf-8")
            self.assertEqual(kf.scan(root, [phrase]), [])

    def test_missing_content_root_is_an_error(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(ValueError, "content root"):
                kf.scan(Path(tmp), kf.load_phrases())

    def test_repository_is_clean(self) -> None:
        self.assertEqual(kf.scan(kf.REPO, kf.load_phrases()), [])


class MainTests(unittest.TestCase):
    def run_main(self, *argv: str) -> tuple[int, str, str]:
        """Run main() with *argv*; return (exit code, stdout, stderr)."""
        out, err = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            code = kf.main(list(argv))
        return code, out.getvalue(), err.getvalue()

    def test_self_test_exits_0(self) -> None:
        code, out, _ = self.run_main("--self-test")
        self.assertEqual(code, 0)
        self.assertIn("fixtures match", out)

    def test_planted_phrase_exits_1_and_is_named(self) -> None:
        phrase = kf.load_phrases()[0]
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            make_tree(root)
            (root / "handbook/src/x.mdx").write_text(phrase.fixture + "\n", "utf-8")
            code, out, _ = self.run_main("--root", tmp)
        self.assertEqual(code, 1)
        self.assertIn(f"handbook/src/x.mdx:1: {phrase.id}", out)

    def test_missing_root_exits_2(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            code, _, err = self.run_main("--root", tmp)
        self.assertEqual(code, 2)
        self.assertIn("content root", err)


if __name__ == "__main__":
    unittest.main()
