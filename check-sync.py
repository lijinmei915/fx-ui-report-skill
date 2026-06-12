#!/usr/bin/env python3
"""Compatibility wrapper for the packaged skill validation script."""
import os
import runpy

ROOT = os.path.dirname(os.path.abspath(__file__))
runpy.run_path(os.path.join(ROOT, "scripts", "check-sync.py"), run_name="__main__")
