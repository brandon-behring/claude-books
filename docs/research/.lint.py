#!/usr/bin/env python3
"""Frontmatter linter for the claude-books research cache.

Run from repo root:
    python3 docs/research/.lint.py

Validates every note in docs/research/<topic>/*.md against the per-file template
defined in the research-sprint plan. Exits non-zero if any violations are found.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).parent.resolve()

REQUIRED_FIELDS = {
    "source_url",
    "canonical_url",
    "source_title",
    "fetched_at",
    "last_verified_at",
    "topic",
    "tier",
    "cert_domains",
    "cert_task_areas",
    "volatility",
    "verified",
    "supersedes",
    "superseded_by",
}

VALID_TIERS = {"T1-official", "T2-release-notes", "T3-practitioner"}
VALID_VOLATILITY = {"stable", "evolving", "fast-moving"}
VALID_CERT_DOMAINS = {1, 2, 3, 4, 5}

# Canonical task-area phrasings from docs/cert-coverage.md
# (Notes' cert_task_areas should be a subset of these.)
CANONICAL_TASK_AREAS = {
    # D1
    "Agentic loops (stop_reason, tool result handling)",
    "Coordinator-subagent patterns (hub-and-spoke, isolated context)",
    "Subagent invocation (Task tool, allowedTools, AgentDefinition)",
    "Multi-step workflows (programmatic vs prompt-based enforcement, handoff)",
    "Agent SDK hooks (PostToolUse, tool interception, normalization)",
    "Task decomposition (sequential pipelines vs adaptive decomposition)",
    "Session state (--resume, fork_session, scratchpads)",
    # D2
    "Effective tool interfaces (descriptions, boundaries, naming)",
    "Structured error responses (isError, errorCategory, retryability)",
    "Tool distribution + tool_choice (auto/any/forced)",
    "MCP server config (.mcp.json vs ~/.claude.json, env var expansion)",
    "Built-in tools (Read, Write, Edit, Bash, Grep, Glob)",
    # D3
    "CLAUDE.md hierarchy (user / project / directory; @import)",
    "Custom slash commands + skills (.claude/commands/, .claude/skills/)",
    ".claude/rules/ with YAML glob path-scoping",
    "Plan mode vs direct execution",
    "Iterative refinement (concrete examples, test-driven, interview pattern)",
    "CI/CD integration (-p flag, --output-format json, --json-schema)",
    # D4
    "Explicit criteria over vague instructions",
    "Few-shot prompting (targeting ambiguous cases, format consistency)",
    "Structured output via tool_use + JSON schemas",
    "Validation, retry, feedback loops (semantic vs schema errors)",
    "Batch processing (Message Batches API, custom_id, SLA matching)",
    "Multi-instance / multi-pass review (independent reviewers, attention dilution)",
    # D5
    "Long-conversation context (progressive summarization risks, lost-in-the-middle)",
    "Escalation / ambiguity resolution patterns",
    "Error propagation across multi-agent systems (structured error context)",
    "Large-codebase context (scratchpads, subagent delegation, /compact)",
    "Human review workflows + confidence calibration",
    "Information provenance (claim-source mappings, temporal data)",
}


def parse_frontmatter(text: str) -> dict | None:
    """Parse YAML frontmatter using PyYAML. Returns dict or None if absent."""
    m = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if not m:
        return None
    try:
        fm = yaml.safe_load(m.group(1))
        return fm if isinstance(fm, dict) else None
    except yaml.YAMLError:
        return None


def lint_file(path: Path) -> list[str]:
    """Return list of violations for a single note file."""
    violations: list[str] = []
    text = path.read_text()
    fm = parse_frontmatter(text)
    if fm is None:
        return [f"no frontmatter"]

    # Required fields
    missing = REQUIRED_FIELDS - set(fm.keys())
    if missing:
        violations.append(f"missing fields: {sorted(missing)}")

    # tier
    tier = fm.get("tier")
    if tier and tier not in VALID_TIERS:
        violations.append(f"invalid tier '{tier}' (must be one of {VALID_TIERS})")

    # volatility
    vol = fm.get("volatility")
    if vol and vol not in VALID_VOLATILITY:
        violations.append(f"invalid volatility '{vol}' (must be one of {VALID_VOLATILITY})")

    # cert_domains: must be list of ints in 1..5
    cd = fm.get("cert_domains")
    if cd is None:
        violations.append("cert_domains missing or empty")
    elif not isinstance(cd, list):
        violations.append(f"cert_domains not a list: {cd!r}")
    else:
        for d in cd:
            # Accept ints or string ints; reject 'D'-prefix or arbitrary strings
            if isinstance(d, int):
                if d not in VALID_CERT_DOMAINS:
                    violations.append(f"cert_domains contains invalid int {d}")
            elif isinstance(d, str):
                if d.startswith("D"):
                    violations.append(f"cert_domains uses 'D' prefix: {d!r} (must be int 1..5)")
                else:
                    try:
                        n = int(d)
                        if n not in VALID_CERT_DOMAINS:
                            violations.append(f"cert_domains contains invalid '{d}'")
                    except ValueError:
                        violations.append(f"cert_domains contains non-int '{d}'")
            else:
                violations.append(f"cert_domains element wrong type: {d!r}")

    # cert_task_areas: must be list; warn if no overlap with canonical phrasings.
    # Fuzzy match: strip backticks/quotes, collapse whitespace, lowercase before compare.
    def _norm(s: str) -> str:
        s = s.replace("`", "").replace('"', "").replace("'", "")
        s = re.sub(r"\s+", " ", s).strip().lower()
        return s

    canonical_norm = {_norm(a) for a in CANONICAL_TASK_AREAS}

    def _matches_canonical(value: str) -> bool:
        """A note's value matches if its normalized form is contained in
        any canonical normalized form, or vice versa (≥15-char substring)."""
        v = _norm(value)
        if v in canonical_norm:
            return True
        # Permissive substring match in either direction (avoid trivial 1-2 word collisions)
        if len(v) < 15:
            return False
        for c in canonical_norm:
            if v in c or c in v:
                return True
        return False

    cta = fm.get("cert_task_areas")
    if cta is None or (isinstance(cta, list) and not cta):
        if fm.get("tier") == "T1-official" and cd:
            violations.append("cert_task_areas empty (T1 notes should map to canonical task areas)")
    elif not isinstance(cta, list):
        violations.append(f"cert_task_areas not a list: {cta!r}")
    else:
        unrecognized = [a for a in cta if not _matches_canonical(a)]
        if unrecognized and len(unrecognized) == len(cta):
            violations.append(f"cert_task_areas has no canonical overlap (examples: {unrecognized[:2]})")
        elif unrecognized:
            violations.append(f"cert_task_areas: {len(unrecognized)} of {len(cta)} unrecognized (e.g., {unrecognized[0]!r})")

    # Body checks
    body = text[text.index("---\n", 4) + 4:] if "---\n" in text[4:] else ""
    # ≥3 Key Takeaway bullets — permissive: accept "Key takeaways" with any suffix.
    # Skip for pedagogy-topic notes: their per-area template is structurally rich
    # (per-section analysis like "Astro/MDX integration", "Accessibility", etc.) and
    # doesn't reduce to a single bullet block. The synthesis lives in the topic
    # README rather than per-note.
    topic = fm.get("topic", "")
    is_pedagogy = isinstance(topic, str) and topic.startswith("pedagogy")
    if not is_pedagogy:
        kt_match = re.search(r"##\s*Key [Tt]akeaways?\b[^\n]*\n(.*?)(?:\n##|\Z)", body, re.DOTALL)
        if not kt_match:
            violations.append("missing 'Key takeaways' section")
        else:
            bullets = [l for l in kt_match.group(1).split("\n") if l.lstrip().startswith("-")]
            if len(bullets) < 3:
                violations.append(f"Key takeaways: only {len(bullets)} bullets (≥3 required)")

    # ≥1 direct quote with Anchor — search whole body, not a specific section.
    # Citation-ready quotes use ">" markdown blockquote + "Anchor:" line nearby.
    has_quote_marker = bool(re.search(r"^>\s+", body, re.MULTILINE))
    has_anchor = bool(re.search(r"Anchor\s*:", body))
    if not has_quote_marker:
        violations.append("no '>' quote marker found in body")
    if not has_anchor:
        violations.append("no 'Anchor:' line found in body")

    return violations


def main() -> int:
    # Notes live at depth-2 (docs/research/<topic>/note.md). Skip top-level
    # docs (READMEs, METHODOLOGY-LESSONS.md), dotfiles, and any all-caps doc names.
    note_files = sorted(
        p for p in ROOT.rglob("*.md")
        if p.name != "README.md"
        and not p.name.startswith(".")
        and not p.name.isupper().__bool__() is False or "-" in p.name and p.stem.isupper() is False
        and p.parent != ROOT  # skip top-level files
    )
    # Simpler: skip anything not in a topic subdirectory.
    note_files = sorted(
        p for p in ROOT.rglob("*.md")
        if p.name != "README.md"
        and not p.name.startswith(".")
        and p.parent != ROOT  # skip top-level docs like METHODOLOGY-LESSONS.md
    )
    total = len(note_files)
    failing = 0
    field_drift_counts: dict[str, int] = {}
    print(f"Linting {total} notes under {ROOT}\n")
    for path in note_files:
        rel = path.relative_to(ROOT)
        violations = lint_file(path)
        if violations:
            failing += 1
            print(f"FAIL {rel}")
            for v in violations:
                print(f"  • {v}")
                # bucket the violation type
                bucket = v.split(":")[0].strip()
                field_drift_counts[bucket] = field_drift_counts.get(bucket, 0) + 1
            print()
    print("=" * 60)
    print(f"Summary: {total - failing}/{total} clean ({failing} failing)\n")
    if field_drift_counts:
        print("Violations by category:")
        for k, v in sorted(field_drift_counts.items(), key=lambda kv: -kv[1]):
            print(f"  {v:3d}  {k}")
    return 1 if failing else 0


if __name__ == "__main__":
    sys.exit(main())
