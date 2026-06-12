#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build the minimal distributable fx-ui-report-skill package."""
import os
import json
import shutil
import subprocess
import sys
import zipfile
from datetime import datetime, timezone
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


def capture(cmd, cwd, fallback="unknown"):
    result = subprocess.run(cmd, cwd=cwd, text=True, capture_output=True)
    if result.returncode != 0:
        return fallback
    return result.stdout.strip() or fallback


def package_version():
    ref_name = os.environ.get("GITHUB_REF_NAME", "").strip()
    if ref_name.startswith("v"):
        return ref_name
    return capture(["git", "describe", "--tags", "--exact-match"], ROOT, fallback="")


def build_metadata():
    version = package_version()
    commit = capture(["git", "rev-parse", "--short", "HEAD"], ROOT)
    built_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    return {
        "name": "fx-ui-report-skill",
        "version": version or f"local-{commit}",
        "commit": commit,
        "builtAt": built_at,
        "downloadUrl": "https://github.com/lijinmei915/fx-ui-report-skill/releases/latest/download/fx-ui-report-skill.zip",
        "releaseUrl": "https://github.com/lijinmei915/fx-ui-report-skill/releases/latest",
        "note": "Use the latest download URL for updates. This file identifies the package version after unzip.",
    }


def write_version_file(metadata):
    (PACKAGE / "VERSION.json").write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def stamp_skill_metadata(metadata):
    skill_path = PACKAGE / "SKILL.md"
    content = skill_path.read_text(encoding="utf-8")
    lines = content.splitlines()
    if len(lines) < 2 or lines[0] != "---":
        raise ValueError("SKILL.md must start with YAML frontmatter")
    try:
        end_index = lines[1:].index("---") + 1
    except ValueError as exc:
        raise ValueError("SKILL.md frontmatter must end with ---") from exc

    stamp_lines = [
        f'version: "{metadata["version"]}"',
        f'updated_at: "{metadata["builtAt"][:10]}"',
        f'build_commit: "{metadata["commit"]}"',
        f'download_url: "{metadata["downloadUrl"]}"',
    ]
    stamped = lines[:end_index] + stamp_lines + lines[end_index:]
    skill_path.write_text("\n".join(stamped) + "\n", encoding="utf-8")


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
    metadata = build_metadata()
    write_version_file(metadata)
    stamp_skill_metadata(metadata)
    remove_junk()
    run([sys.executable, "scripts/check-sync.py"], PACKAGE)
    build_zip()
    print(f"Built {PACKAGE}")
    print(f"Built {ZIP_PATH}")


if __name__ == "__main__":
    main()
