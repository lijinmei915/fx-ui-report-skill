#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the minimal distributable fx-ui-report-skill package."""
import os
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST_ROOT = ROOT / "dist"
PACKAGE = DIST_ROOT / "fx-ui-report-skill"
ZIP_PATH = DIST_ROOT / "fx-ui-report-skill.zip"

FILES = [
    "SKILL.md",
    "USAGE.md",
    "agents/openai.yaml",
    "assets/data/components.manifest.json",
    "assets/data/design-tokens.json",
    "assets/scripts/theme-toolbar.js",
    "assets/templates/components.html",
    "assets/templates/example.html",
    "assets/templates/lucide-snippet.html",
    "assets/templates/starter.html",
    "references/charts.html",
    "references/design.md",
    "scripts/check-sync.py",
]


def run(cmd, cwd):
    result = subprocess.run(cmd, cwd=cwd, text=True)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def copy_required_files():
    if PACKAGE.exists():
        shutil.rmtree(PACKAGE)
    for rel in FILES:
        src = ROOT / rel
        if not src.exists():
            raise FileNotFoundError(f"Missing required file: {rel}")
        dest = PACKAGE / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)


def remove_junk():
    for path in PACKAGE.rglob(".DS_Store"):
        path.unlink()
    for path in PACKAGE.rglob("__pycache__"):
        shutil.rmtree(path)


def build_zip():
    if ZIP_PATH.exists():
        ZIP_PATH.unlink()
    with zipfile.ZipFile(ZIP_PATH, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(PACKAGE.rglob("*")):
            if path.is_file():
                zf.write(path, path.relative_to(DIST_ROOT))


def main():
    os.chdir(ROOT)
    run([sys.executable, "scripts/check-sync.py"], ROOT)
    copy_required_files()
    remove_junk()
    run([sys.executable, "scripts/check-sync.py"], PACKAGE)
    build_zip()
    print(f"Built {PACKAGE}")
    print(f"Built {ZIP_PATH}")


if __name__ == "__main__":
    main()
