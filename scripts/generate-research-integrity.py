#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from research_integrity import generate


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Generate deterministic research consumer artifacts.")
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--check", action="store_true", help="fail if committed artifacts are stale")
    args = parser.parse_args(argv)
    errors, counts = generate(args.root.resolve(), check=args.check)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(json.dumps({"status": "current" if args.check else "generated", **counts}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
