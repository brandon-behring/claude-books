#!/usr/bin/env python3
"""Cross-reference + cert-task-area gap-check for the research cache.

Walks all [[link]] references; checks targets exist.
Counts backing notes per canonical cert task-area phrasing.
"""
from __future__ import annotations

import re
import sys
from collections import defaultdict
from pathlib import Path

import yaml

ROOT = Path(__file__).parent.resolve()

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


def _norm(s: str) -> str:
    s = s.replace("`", "").replace('"', "").replace("'", "").replace("--", "")
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s


def parse_frontmatter(text: str) -> dict | None:
    m = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if not m:
        return None
    try:
        fm = yaml.safe_load(m.group(1))
        return fm if isinstance(fm, dict) else None
    except yaml.YAMLError:
        return None


def main() -> int:
    # Notes live at depth-2 (docs/research/<topic>/note.md). Skip top-level docs.
    note_files = sorted(
        p for p in ROOT.rglob("*.md")
        if p.name != "README.md"
        and not p.name.startswith(".")
        and p.parent != ROOT
    )

    # Index all slugs (filenames without .md) for [[link]] resolution
    slugs = {p.stem: p for p in note_files}

    # Walk [[links]]
    dangling: list[tuple[str, str]] = []
    link_counts: dict[str, int] = defaultdict(int)
    for path in note_files:
        text = path.read_text()
        for m in re.finditer(r"\[\[([\w\-]+)\]\]", text):
            target = m.group(1)
            link_counts[target] += 1
            if target not in slugs:
                dangling.append((str(path.relative_to(ROOT)), target))

    print(f"=== Cross-reference check ===")
    print(f"Notes: {len(note_files)}")
    print(f"Total [[link]] references found: {sum(link_counts.values())}")
    print(f"Unique link targets: {len(link_counts)}")
    print(f"Dangling references: {len(dangling)}")
    if dangling:
        print("\nDangling links (note → target):")
        for src, tgt in dangling[:50]:
            print(f"  {src} → [[{tgt}]]")
        if len(dangling) > 50:
            print(f"  ... and {len(dangling) - 50} more")
    print()

    # Cert task-area coverage
    canonical_norm_map = {_norm(a): a for a in CANONICAL_TASK_AREAS}

    # For each canonical task area, list backing notes (and their tiers)
    coverage: dict[str, list[tuple[str, str]]] = {a: [] for a in CANONICAL_TASK_AREAS}

    for path in note_files:
        fm = parse_frontmatter(path.read_text())
        if not fm:
            continue
        tier = fm.get("tier", "?")
        cta = fm.get("cert_task_areas")
        if not isinstance(cta, list):
            continue
        for note_value in cta:
            note_norm = _norm(note_value)
            # Match: exact canonical OR substring in either direction (≥15 chars)
            for canon_norm, canon_full in canonical_norm_map.items():
                if (
                    note_norm == canon_norm
                    or (len(note_norm) >= 10 and (note_norm in canon_norm or canon_norm in note_norm))
                ):
                    coverage[canon_full].append((str(path.relative_to(ROOT)), tier))
                    break

    # Report coverage
    print("=== Cert task-area coverage ===")
    print(f"{'Task area':<70} {'T1':>4} {'T2':>4} {'T3':>4} {'tot':>4}")
    print("-" * 90)

    by_domain = defaultdict(list)
    domain_keys = {
        "D1": ["Agentic loops", "Coordinator-subagent", "Subagent invocation", "Multi-step", "Agent SDK hooks", "Task decomposition", "Session state"],
        "D2": ["Effective tool interfaces", "Structured error responses", "Tool distribution", "MCP server config", "Built-in tools"],
        "D3": ["CLAUDE.md hierarchy", "Custom slash commands", ".claude/rules/", "Plan mode", "Iterative refinement", "CI/CD integration"],
        "D4": ["Explicit criteria", "Few-shot prompting", "Structured output via", "Validation, retry", "Batch processing", "Multi-instance"],
        "D5": ["Long-conversation context", "Escalation /", "Error propagation across", "Large-codebase context", "Human review workflows", "Information provenance"],
    }

    zero_coverage = []
    for domain, key_prefixes in domain_keys.items():
        print(f"\n{domain}:")
        for kp in key_prefixes:
            for area, notes in coverage.items():
                if area.startswith(kp):
                    t1 = sum(1 for _, t in notes if t == "T1-official")
                    t2 = sum(1 for _, t in notes if t == "T2-release-notes")
                    t3 = sum(1 for _, t in notes if t == "T3-practitioner")
                    total = len(notes)
                    label = area[:70]
                    print(f"  {label:<70} {t1:>4} {t2:>4} {t3:>4} {total:>4}")
                    if t1 == 0:
                        zero_coverage.append((domain, area))
                    break

    print()
    if zero_coverage:
        print(f"=== Cert task areas with ZERO T1 backing ({len(zero_coverage)}) ===")
        for d, a in zero_coverage:
            print(f"  {d}: {a}")
    else:
        print("All cert task areas have ≥1 T1 backing note. ✅")

    return 1 if (dangling or zero_coverage) else 0


if __name__ == "__main__":
    sys.exit(main())
