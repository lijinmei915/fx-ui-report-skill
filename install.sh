#!/usr/bin/env bash
# FX-UI-REPORT-SKILL 安装脚本
# 用法：在项目根目录执行 bash install.sh
set -e

SKILL_NAME="fx-ui-report-skill"
DEST="$HOME/.claude/skills/$SKILL_NAME"
SRC="$(cd "$(dirname "$0")" && pwd)"

echo "安装 $SKILL_NAME → $DEST"

if [ -d "$DEST" ]; then
  echo "检测到已有安装，覆盖更新..."
  rm -rf "$DEST"
fi

mkdir -p "$DEST"

rsync -a \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='.claude' \
  --exclude='.codex' \
  --exclude='.gitignore' \
  --exclude='__pycache__' \
  --exclude='source' \
  --exclude='测试' \
  --exclude='测试素材' \
  --exclude='install.sh' \
  "$SRC/" "$DEST/"

echo "✅ 安装完成：$DEST"
echo "   在 Claude Code 中输入 /fx-ui-report-skill 触发"
