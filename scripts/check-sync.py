#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
校验 components.manifest.json、components.html 与 starter.html 是否同步。
该一起改的没一起改，这里会拦下来。

用法:  python3 check-sync.py
退出码: 0 = 一致；1 = 有不一致（可挂 git pre-commit hook）

校验项:
  A 漂移   manifest 各组件 html 用到的 class，必须都在 components.html <style> 里有定义
  B 残留   manifest 不该再出现 css 字段（CSS 唯一真身在 components.html）
  C 覆盖   列出 components.html 的组件区块与 manifest 组件清单，供核对遗漏
  D 骨架   components.html 定义的 class，必须在 starter.html <style> 里存在
  E 声明   manifest 组件涉及的 CSS selector，在 components.html 与 starter.html 中声明必须一致
  F 图标   manifest 使用的 data-lucide 图标，必须存在于 starter.html 内联图标字典
  G 图标源 lucide-snippet.html 与 starter.html 内联图标字典必须一致
"""
import json, re, sys, os

ROOT = os.path.dirname(os.path.abspath(__file__))
SKILL_ROOT = os.path.dirname(ROOT)
COMP = os.path.join(SKILL_ROOT, 'assets', 'templates', 'components.html')
MANI = os.path.join(SKILL_ROOT, 'assets', 'data', 'components.manifest.json')
STARTER = os.path.join(SKILL_ROOT, 'assets', 'templates', 'starter.html')
LUCIDE = os.path.join(SKILL_ROOT, 'assets', 'templates', 'lucide-snippet.html')

errors, warns = [], []

html = open(COMP, encoding='utf-8').read()
m = re.search(r'<style>(.*?)</style>', html, re.S)
style = m.group(1) if m else ''
defined = set(re.findall(r'\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)', style))

starter_html = open(STARTER, encoding='utf-8').read()
starter_match = re.search(r'<style>(.*?)</style>', starter_html, re.S)
starter_style = starter_match.group(1) if starter_match else ''
starter_defined = set(re.findall(r'\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)', starter_style))

def normalize_css(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    return re.sub(r'\s+', ' ', css).strip()

def css_rules(css):
    """返回简单 selector -> 声明；当前组件 CSS 不依赖嵌套 @media。"""
    rules = {}
    clean = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    for selector_group, body in re.findall(r'([^{}]+)\{([^{}]*)\}', clean):
        selector_group = normalize_css(selector_group)
        if selector_group.startswith('@') or selector_group in ('from', 'to') or '%' in selector_group:
            continue
        declaration = normalize_css(body)
        for selector in selector_group.split(','):
            rules[normalize_css(selector)] = declaration
    return rules

component_rules = css_rules(style)
starter_rules = css_rules(starter_style)

mani = json.load(open(MANI, encoding='utf-8'))

used, has_css = {}, []
used_icons = set()
def walk(node, cid):
    if isinstance(node, dict):
        if 'css' in node:
            has_css.append(cid)
        nid = node.get('id', cid)
        for cluster in re.findall(r'class="([^"]*)"', node.get('html', '')):
            for cls in cluster.split():
                used.setdefault(cls, nid)
        used_icons.update(re.findall(r'data-lucide="([^"]+)"', node.get('html', '')))
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

# D 骨架：starter 必须包含组件库定义的全部 class；允许 starter 有骨架专用 class
for cls in sorted(defined - starter_defined):
    errors.append(f'[骨架] components.html 定义了 .{cls}，但 starter.html <style> 中缺失')

# E 声明：只比较 manifest 实际涉及的组件 selector，忽略组件预览页专用规则
component_classes = set(used)
for selector, declaration in sorted(component_rules.items()):
    selector_classes = set(re.findall(r'\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)', selector))
    if not selector_classes.intersection(component_classes):
        continue
    if selector not in starter_rules:
        errors.append(f'[声明] starter.html 缺少组件 selector「{selector}」')
    elif starter_rules[selector] != declaration:
        errors.append(f'[声明] selector「{selector}」在 components.html 与 starter.html 中内容不一致')

# F 图标：manifest 中明确声明的图标必须能由 starter 的内联 Lucide 字典渲染
starter_icons = set(re.findall(r"'([a-z0-9-]+)'\s*:", starter_html))
for icon in sorted(used_icons - starter_icons):
    errors.append(f'[图标] manifest 使用 data-lucide="{icon}"，但 starter.html 内联图标字典中缺失')

# G 图标源：独立维护参考与生成骨架必须包含相同图标名及路径
lucide_html = open(LUCIDE, encoding='utf-8').read()
icon_entry_pattern = r"'([a-z0-9-]+)'\s*:\s*'([^']*)'"
snippet_icons = dict(re.findall(icon_entry_pattern, lucide_html))
starter_icon_entries = dict(re.findall(icon_entry_pattern, starter_html))
for icon in sorted(set(snippet_icons) - set(starter_icon_entries)):
    errors.append(f'[图标源] lucide-snippet.html 有「{icon}」，但 starter.html 内联字典缺失')
for icon in sorted(set(starter_icon_entries) - set(snippet_icons)):
    errors.append(f'[图标源] starter.html 内联字典有「{icon}」，但 lucide-snippet.html 缺失')
for icon in sorted(set(snippet_icons) & set(starter_icon_entries)):
    if snippet_icons[icon] != starter_icon_entries[icon]:
        errors.append(f'[图标源] 「{icon}」在 lucide-snippet.html 与 starter.html 中路径不一致')
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
print('✅ manifest、components.html 与 starter.html 同步一致')
