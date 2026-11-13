#!/usr/bin/env python3
"""Fail when the books repeat a statement already found false or unsafe.

Each row of ``known_false.tsv`` holds one phrase that was deleted or corrected, as a regular
expression (matched case-insensitively, line by line), with the old sentence it must match (its
fixture), the vendor page that settles it, and a note. The scan reads every Markdown, MDX and
Astro file under the books' content roots and reports each match by file, line and row id.
``--self-test`` checks that every pattern still matches its own fixture, so a pattern edited
into uselessness fails loudly instead of passing silently.

Exit codes: 0 clean; 1 a known-false phrase is present, or a fixture no longer matches its
pattern; 2 the phrase file or a content root is missing or malformed.

Stage 4 of the remediation extends this into the offline fact lint.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
PHRASES = Path(__file__).resolve().with_name("known_false.tsv")
CONTENT_ROOTS = (
    "handbook/src",
    "agentic-coding/src",
    "agentic-systems-design/src",
    "architect-reference/src",
    "glossary",
    "hub/src",
    "series",
)
SUFFIXES = frozenset({".md", ".mdx", ".astro"})
COLUMNS = ("id", "pattern", "fixture", "source", "note")


@dataclass(frozen=True)
class Phrase:
    """One known-false phrase: its id, compiled pattern, fixture sentence, source and note."""

    id: str
    pattern: re.Pattern[str]
    fixture: str
    source: str
    note: str


def parse_phrases(text: str, origin: str = "known_false.tsv") -> list[Phrase]:
    """Parse the phrase file's text; raise ValueError naming the line of any malformed row.

    Blank lines and lines starting with ``#`` are skipped. The first other line is the header.

    Examples
    --------
    >>> rows = parse_phrases("id\\tpattern\\tfixture\\tsource\\tnote\\nx\\tfoo\\tsay foo\\thttps://e\\tn\\n")
    >>> rows[0].id, bool(rows[0].pattern.search("FOO"))
    ('x', True)
    """
    phrases: list[Phrase] = []
    header_seen = False
    ids: set[str] = set()
    for lineno, raw in enumerate(text.splitlines(), start=1):
        if not raw.strip() or raw.startswith("#"):
            continue
        fields = raw.split("\t")
        if not header_seen:
            if tuple(fields) != COLUMNS:
                raise ValueError(f"{origin}:{lineno}: header must be {COLUMNS}, found {tuple(fields)}")
            header_seen = True
            continue
        if len(fields) != len(COLUMNS) or not all(f.strip() for f in fields):
            raise ValueError(
                f"{origin}:{lineno}: expected {len(COLUMNS)} non-empty tab-separated fields, "
                f"found {len(fields)}"
            )
        pid, pattern, fixture, source, note = fields
        if pid in ids:
            raise ValueError(f"{origin}:{lineno}: duplicate id {pid!r}")
        try:
            compiled = re.compile(pattern, re.IGNORECASE)
        except re.error as exc:
            raise ValueError(f"{origin}:{lineno}: id {pid!r}: bad pattern: {exc}") from exc
        ids.add(pid)
        phrases.append(Phrase(pid, compiled, fixture, source, note))
    if not phrases:
        raise ValueError(f"{origin}: no phrases (a header and at least one row are required)")
    return phrases


def load_phrases(path: Path = PHRASES) -> list[Phrase]:
    """Read and parse the phrase file; raise ValueError when it is missing or malformed.

    Examples
    --------
    >>> all(p.pattern.search(p.fixture) for p in load_phrases())
    True
    """
    if not path.is_file():
        raise ValueError(f"phrase file not found: {path}")
    return parse_phrases(path.read_text(encoding="utf-8"), origin=str(path))


def self_test(phrases: list[Phrase]) -> list[str]:
    """Return the ids whose pattern no longer matches its own fixture (empty when all match).

    Examples
    --------
    >>> self_test(load_phrases())
    []
    """
    return [p.id for p in phrases if not p.pattern.search(p.fixture)]


def content_files(root: Path) -> list[Path]:
    """Return the Markdown, MDX and Astro files under the content roots, sorted.

    Raises ValueError naming any content root that is missing, so a moved book cannot shrink the
    scan without notice.

    Examples
    --------
    >>> any(p.suffix == ".mdx" for p in content_files(REPO))
    True
    """
    missing = [rel for rel in CONTENT_ROOTS if not (root / rel).is_dir()]
    if missing:
        raise ValueError(f"content root(s) missing under {root}: {', '.join(missing)}")
    files: list[Path] = []
    for rel in CONTENT_ROOTS:
        for path in (root / rel).rglob("*"):
            if path.suffix in SUFFIXES and path.is_file() and "node_modules" not in path.parts:
                files.append(path)
    return sorted(files)


def scan(root: Path, phrases: list[Phrase]) -> list[tuple[str, int, str]]:
    """Return (path relative to root, line number, phrase id) for every match, in file order.

    Examples
    --------
    >>> scan(REPO, load_phrases())
    []
    """
    hits: list[tuple[str, int, str]] = []
    for path in content_files(root):
        rel = path.relative_to(root).as_posix()
        for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
            hits.extend((rel, lineno, p.id) for p in phrases if p.pattern.search(line))
    return hits


def main(argv: list[str] | None = None) -> int:
    """Run the self-test, then the scan; print every problem and return the exit code."""
    parser = argparse.ArgumentParser(description="Fail on statements already found false.")
    parser.add_argument("--root", type=Path, default=REPO, help="repository root to scan")
    parser.add_argument(
        "--self-test", action="store_true", help="only check that each fixture matches"
    )
    args = parser.parse_args(argv)
    try:
        phrases = load_phrases()
    except ValueError as exc:
        print(f"known-false: {exc}", file=sys.stderr)
        return 2
    broken = self_test(phrases)
    for pid in broken:
        print(f"known-false: fixture of {pid!r} no longer matches its pattern", file=sys.stderr)
    if broken:
        return 1
    if args.self_test:
        print(f"known-false: {len(phrases)} fixtures match their patterns")
        return 0
    try:
        hits = scan(args.root, phrases)
    except ValueError as exc:
        print(f"known-false: {exc}", file=sys.stderr)
        return 2
    notes = {p.id: (p.note, p.source) for p in phrases}
    for rel, lineno, pid in hits:
        note, source = notes[pid]
        print(f"{rel}:{lineno}: {pid}: {note} ({source})")
    print(f"known-false: {len(hits)} match(es) of {len(phrases)} phrases under {args.root}")
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
