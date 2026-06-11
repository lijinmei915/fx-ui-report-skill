#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
校验 components.manifest.json 与 components.html 是否同步。
该一起改的没一起改，这里会拦下来。

用法:  python3 check-sync.py
退出码: 0 = 一致；1 = 有不一致（可挂 git pre-commit hook）

校验项:
  A 漂移   manifest 各组件 html 用到的 class，必须都在 components.html <style> 里有定义
  B 残留   manifest 不该再出现 css 字段（CSS 唯一真身在 components.html）
  C 覆盖   列出 components.html 的组件区块与 manifest 组件清单，供核对遗漏
"""
import json, re, sys, os

ROOT = os.path.dirname(os.path.abspath(__file__))
COMP = os.path.join(ROOT, 'components.html')
MANI = os.path.join(ROOT, 'components.manifest.json')

errors, warns = [], []

html = open(COMP, encoding='utf-8').read()
m = re.search(r'<style>(.*?)</style>', html, re.S)
style = m.group(1) if m else ''
defined = set(re.findall(r'\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)', style))

mani = json.load(open(MANI, encoding='utf-8'))

used, has_css = {}, []
def walk(node, cid):
    if isinstance(node, dict):
        if 'css' in node:
            has_css.append(cid)
        nid = node.get('id', cid)
        for cluster in re.findall(r'class="([^"]*)"', node.get('html', '')):
            for cls in cluster.split():
                used.setdefault(cls, nid)
        for v in node.values():
            walk(v, nid)
    elif isinstance(node, list):
        for v in node:
            walk(v, cid)
walk(mani.get('components', []), 'root')

# A 漂移
for cls, owner in sorted({c: i for c, i in used.items() if c not in defined}.items()):
    errors.append(f'[漂移] manifest「{owner}」用了 .{cls}，但 components.html <style> 没有定义')

# B 残留 css
for owner in sorted(set(has_css)):
    errors.append(f'[残留] manifest「{owner}」仍含 css 字段，CSS 应只留在 components.html')

# C 覆盖：区块 @id 锚点 ↔ manifest 组件 双向硬核对
declared = set()
for note in re.findall(r'/\* ──.*?── \*/', html):
    declared |= set(re.findall(r'@([\w-]+)', note))
mani_ids = {c.get('id', '?') for c in mani.get('components', [])}
for i in sorted(declared - mani_ids):
    errors.append(f'[覆盖] components.html 区块声明了 @{i}，manifest 里没有该组件')
for i in sorted(mani_ids - declared):
    errors.append(f'[覆盖] manifest 有组件「{i}」，但没有区块用 @{i} 声明它')
print(f'区块声明 id ({len(declared)}): ' + ', '.join(sorted(declared)))
print(f'manifest 组件 ({len(mani_ids)}): ' + ', '.join(sorted(mani_ids)))
print()

if errors:
    for e in errors:
        print('❌', e)
    print(f'\n校验未通过：{len(errors)} 处不一致')
    sys.exit(1)

for w in warns:
    print('⚠️ ', w)
print('✅ manifest 与 components.html 同步一致')
