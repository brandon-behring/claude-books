#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from research_integrity import validate


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate the claude-books research lock and bindings.")
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--require-release-ready", action="store_true")
    args = parser.parse_args(argv)
    errors, counts = validate(args.root.resolve(), args.require_release_ready)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(json.dumps({"status": "valid", **counts}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
