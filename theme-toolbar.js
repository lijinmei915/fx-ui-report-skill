/**
 * fx-ui Theme Toolbar
 * Drop-in 主题切换工具栏：<script src="theme-toolbar.js"></script>
 * 主题变更时 dispatch CustomEvent('fxthemechange') 到 document
 */
(function (win, doc) {
  'use strict';

  /* ── 预设主题 ──────────────────────────────────────────────── */
  var PRESETS = {
    orange: {'--seed-primary':'#FF8000','--seed-bg':'#FFFCF7','--map-primary-50':'#FFF7E6','--map-primary-100':'#FFE9C0','--map-primary-500':'#FF8000','--map-primary-700':'#D96500','--brand':'#FF8000','--brand-subtle':'#FFF7E6','--brand-shadow':'rgba(255,128,0,0.25)','--brand-gradient-end':'#FFE9C0','--text-1':'#181C25','--text-2':'#545861','--text-3':'#91959E','--text-4':'#C1C5CE','--bg-page':'#FFFCF7','--bg-card':'#FFFFFF','--bg-subtle':'#F2F3F5','--bg-inset':'#F8F9FA','--border-base':'#DEE1E8','--border-subtle':'#EAEBEE','--danger-bg':'#FFF1F2','--warning-bg':'#FFFBEB','--success-bg':'#F0FDF4','--info-bg':'#EFF6FF','--danger-soft':'#FEE2E2','--warning-soft':'#FEF3C7','--success-soft':'#DCFCE7','--info-soft':'#DBEAFE','--hd-blob-1':'rgba(255,220,80,0.60)','--hd-blob-2':'rgba(220,80,20,0.50)','--hd-blob-3':'rgba(255,160,40,0.35)','--hd-text':'#fff','--hd-text-soft':'rgba(255,255,255,0.80)'},
    blue:   {'--seed-primary':'#2563EB','--seed-bg':'#F8FAFF','--map-primary-50':'#EFF6FF','--map-primary-100':'#DBEAFE','--map-primary-500':'#2563EB','--map-primary-700':'#1D4ED8','--brand':'#2563EB','--brand-subtle':'#EFF6FF','--brand-shadow':'rgba(37,99,235,0.25)','--brand-gradient-end':'#DBEAFE','--text-1':'#181C25','--text-2':'#545861','--text-3':'#91959E','--text-4':'#C1C5CE','--bg-page':'#F8FAFF','--bg-card':'#FFFFFF','--bg-subtle':'#F2F3F5','--bg-inset':'#F8F9FA','--border-base':'#DEE1E8','--border-subtle':'#EAEBEE','--danger-bg':'#FFF1F2','--warning-bg':'#FFFBEB','--success-bg':'#F0FDF4','--info-bg':'#EFF6FF','--danger-soft':'#FEE2E2','--warning-soft':'#FEF3C7','--success-soft':'#DCFCE7','--info-soft':'#DBEAFE','--hd-blob-1':'rgba(100,170,255,0.55)','--hd-blob-2':'rgba(30,80,220,0.45)','--hd-blob-3':'rgba(80,200,255,0.30)','--hd-text':'#fff','--hd-text-soft':'rgba(255,255,255,0.80)'},
    green:  {'--seed-primary':'#16A34A','--seed-bg':'#F7FDF9','--map-primary-50':'#F0FDF4','--map-primary-100':'#DCFCE7','--map-primary-500':'#16A34A','--map-primary-700':'#15803D','--brand':'#16A34A','--brand-subtle':'#F0FDF4','--brand-shadow':'rgba(22,163,74,0.25)','--brand-gradient-end':'#DCFCE7','--text-1':'#181C25','--text-2':'#545861','--text-3':'#91959E','--text-4':'#C1C5CE','--bg-page':'#F7FDF9','--bg-card':'#FFFFFF','--bg-subtle':'#F2F3F5','--bg-inset':'#F8F9FA','--border-base':'#DEE1E8','--border-subtle':'#EAEBEE','--danger-bg':'#FFF1F2','--warning-bg':'#FFFBEB','--success-bg':'#F0FDF4','--info-bg':'#EFF6FF','--danger-soft':'#FEE2E2','--warning-soft':'#FEF3C7','--success-soft':'#DCFCE7','--info-soft':'#DBEAFE','--hd-blob-1':'rgba(80,220,130,0.55)','--hd-blob-2':'rgba(20,150,70,0.45)','--hd-blob-3':'rgba(120,220,60,0.30)','--hd-text':'#fff','--hd-text-soft':'rgba(255,255,255,0.80)'},
    purple: {'--seed-primary':'#8B5CF6','--seed-bg':'#FDFAFF','--map-primary-50':'#F5F3FF','--map-primary-100':'#EDE9FE','--map-primary-500':'#8B5CF6','--map-primary-700':'#6D28D9','--brand':'#8B5CF6','--brand-subtle':'#F5F3FF','--brand-shadow':'rgba(139,92,246,0.25)','--brand-gradient-end':'#EDE9FE','--text-1':'#181C25','--text-2':'#545861','--text-3':'#91959E','--text-4':'#C1C5CE','--bg-page':'#FDFAFF','--bg-card':'#FFFFFF','--bg-subtle':'#F2F3F5','--bg-inset':'#F8F9FA','--border-base':'#DEE1E8','--border-subtle':'#EAEBEE','--danger-bg':'#FFF1F2','--warning-bg':'#FFFBEB','--success-bg':'#F0FDF4','--info-bg':'#EFF6FF','--danger-soft':'#FEE2E2','--warning-soft':'#FEF3C7','--success-soft':'#DCFCE7','--info-soft':'#DBEAFE','--hd-blob-1':'rgba(200,140,255,0.55)','--hd-blob-2':'rgba(130,60,240,0.45)','--hd-blob-3':'rgba(200,80,255,0.30)','--hd-text':'#fff','--hd-text-soft':'rgba(255,255,255,0.80)'},
    blackgold: {'--seed-primary':'#D4AF37','--seed-bg':'#0F0E0B','--map-primary-50':'#2A2510','--map-primary-100':'#4A4120','--map-primary-500':'#D4AF37','--map-primary-700':'#F0D060','--brand':'#D4AF37','--brand-subtle':'#2A2510','--brand-shadow':'rgba(212,175,55,0.25)','--text-1':'#F5F0E8','--text-2':'#C8C0A8','--text-3':'#8A8070','--text-4':'#4A4540','--bg-page':'#0F0E0B','--bg-card':'#1C1A14','--bg-subtle':'#252218','--bg-inset':'#2A2720','--border-base':'#3A3520','--border-subtle':'#302C1C','--danger-bg':'#2A1215','--warning-bg':'#2A2010','--success-bg':'#0F2418','--info-bg':'#101828','--danger-soft':'#3A1820','--warning-soft':'#332510','--success-soft':'#1A3525','--info-soft':'#152030','--brand-gradient-end':'#F0D060','--hd-blob-1':'rgba(255,220,60,0.45)','--hd-blob-2':'rgba(180,130,20,0.38)','--hd-blob-3':'rgba(240,190,50,0.25)','--hd-text':'#18181f','--hd-text-soft':'rgba(24,24,31,0.65)'}
  };

  /* ── 颜色工具函数 ─────────────────────────────────────────── */
  function relLuminance(r, g, b) {
    return [r, g, b].reduce(function (a, v, i) {
      v /= 255; v = v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      return a + v * [0.2126, 0.7152, 0.0722][i];
    }, 0);
  }
  function hdTextTokens(p7hex) {
    var r = parseInt(p7hex.slice(1, 3), 16), g = parseInt(p7hex.slice(3, 5), 16), b = parseInt(p7hex.slice(5, 7), 16);
    var ok = 1.05 / (relLuminance(r, g, b) + 0.05) >= 3;
    return {'--hd-text': ok ? '#fff' : '#18181f', '--hd-text-soft': ok ? 'rgba(255,255,255,0.80)' : 'rgba(24,24,31,0.65)'};
  }
  function hexToHsl(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
      var d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) { case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break; case g: h = ((b - r) / d + 2) / 6; break; default: h = ((r - g) / d + 4) / 6; }
    }
    return {h: h * 360, s: s * 100, l: l * 100};
  }
  function hslToHex(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    var r, g, b;
    if (s === 0) { r = g = b = l; } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
      var f = function (p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
      r = f(p, q, h + 1 / 3); g = f(p, q, h); b = f(p, q, h - 1 / 3);
    }
    return '#' + [r, g, b].map(function (x) { return Math.round(x * 255).toString(16).padStart(2, '0'); }).join('');
  }
  function h2(n) { return n.toString(16).padStart(2, '0'); }

  /* ── 调色板生成 ───────────────────────────────────────────── */
  function generatePalette(hex) {
    var c = hexToHsl(hex), h = c.h, s = c.s, l = c.l;
    var ri = parseInt(hex.slice(1, 3), 16), gi = parseInt(hex.slice(3, 5), 16), bi = parseInt(hex.slice(5, 7), 16);
    var p50 = hslToHex(h, Math.max(s * 0.12, 4), Math.min(l + (100 - l) * 0.93, 98));
    var p100 = hslToHex(h, Math.max(s * 0.22, 7), Math.min(l + (100 - l) * 0.78, 95));
    var p700 = hslToHex(h, Math.min(s * 1.05, 100), Math.max(l * 0.72, 15));
    var bgHex = hslToHex(h, Math.max(s * 0.08, 3), Math.min(l + (100 - l) * 0.96, 99));
    var lum500 = relLuminance(ri, gi, bi), tooLight = lum500 > 0.30;
    var brandHex = tooLight ? p700 : hex;
    var p7r = parseInt(p700.slice(1, 3), 16), p7g = parseInt(p700.slice(3, 5), 16), p7b = parseInt(p700.slice(5, 7), 16);
    var bR = tooLight ? p7r : ri, bG = tooLight ? p7g : gi, bB = tooLight ? p7b : bi;
    var b1r = Math.min(255, ri + 60), b1g = Math.min(255, gi + 60), b1b = Math.min(255, bi + 20);
    var b2r = Math.max(0, ri - 20), b2g = Math.max(0, gi - 40), b2b = Math.min(255, bi + 30);
    var b3r = Math.min(255, ri + 30), b3g = Math.min(255, gi + 30), b3b = Math.min(255, bi + 50);
    return Object.assign({'--seed-primary': hex, '--seed-bg': bgHex, '--map-primary-50': p50, '--map-primary-100': p100, '--map-primary-500': hex, '--map-primary-700': p700, '--brand': brandHex, '--brand-subtle': p50, '--brand-gradient-end': p100, '--brand-shadow': 'rgba(' + bR + ',' + bG + ',' + bB + ',0.25)', '--bg-page': bgHex, '--bg-card': '#FFFFFF', '--bg-subtle': '#F2F3F5', '--bg-inset': '#F8F9FA', '--text-1': '#181C25', '--text-2': '#545861', '--text-3': '#91959E', '--text-4': '#C1C5CE', '--border-base': '#DEE1E8', '--border-subtle': '#EAEBEE', '--danger-bg': '#FFF1F2', '--warning-bg': '#FFFBEB', '--success-bg': '#F0FDF4', '--info-bg': '#EFF6FF', '--danger-soft': '#FEE2E2', '--warning-soft': '#FEF3C7', '--success-soft': '#DCFCE7', '--info-soft': '#DBEAFE', '--shadow-1': '0 2px 12px rgba(0,0,0,0.03)', '--shadow-2': '0 4px 20px -2px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)', '--shadow-3': '0 8px 28px -4px rgba(0,0,0,0.10)', '--hd-blob-1': 'rgba(' + b1r + ',' + b1g + ',' + b1b + ',0.55)', '--hd-blob-2': 'rgba(' + b2r + ',' + b2g + ',' + b2b + ',0.45)', '--hd-blob-3': 'rgba(' + b3r + ',' + b3g + ',' + b3b + ',0.30)'}, hdTextTokens(p700));
  }
  function generateDarkPalette(hex) {
    var ri = parseInt(hex.slice(1, 3), 16), gi = parseInt(hex.slice(3, 5), 16), bi = parseInt(hex.slice(5, 7), 16);
    var c = hexToHsl(hex), h = c.h, s = c.s;
    var lumOrig = relLuminance(ri, gi, bi);
    var brandHex = lumOrig >= 0.14 ? ('#' + [Math.min(255, Math.round(ri * 1.15 + 20)), Math.min(255, Math.round(gi * 1.15 + 20)), Math.min(255, Math.round(bi * 1.15 + 20))].map(function (x) { return h2(x); }).join('')) : hslToHex(h, s, 65);
    var br = parseInt(brandHex.slice(1, 3), 16), bgc = parseInt(brandHex.slice(3, 5), 16), bbc = parseInt(brandHex.slice(5, 7), 16);
    var p700 = '#' + [Math.min(255, br + 20), Math.min(255, bgc + 20), Math.min(255, bbc + 20)].map(h2).join('');
    var p50 = '#' + [Math.round(ri * 0.14), Math.round(gi * 0.14), Math.round(bi * 0.14)].map(h2).join('');
    var p100 = '#' + [Math.round(ri * 0.28), Math.round(gi * 0.28), Math.round(bi * 0.28)].map(h2).join('');
    var b1r = Math.min(255, br + 80), b1g = Math.min(255, bgc + 80), b1b = Math.min(255, bbc + 40);
    var b2r = Math.max(0, br - 15), b2g = Math.max(0, bgc - 25), b2b = Math.min(255, bbc + 25);
    var b3r = Math.min(255, br + 50), b3g = Math.min(255, bgc + 50), b3b = Math.min(255, bbc + 60);
    return Object.assign({'--seed-primary': brandHex, '--seed-bg': '#0F0E0B', '--map-primary-50': p50, '--map-primary-100': p100, '--map-primary-500': brandHex, '--map-primary-700': p700, '--brand': brandHex, '--brand-subtle': p50, '--brand-shadow': 'rgba(' + ri + ',' + gi + ',' + bi + ',0.25)', '--brand-gradient-end': p700, '--text-1': '#F5F0E8', '--text-2': '#C8C0A8', '--text-3': '#8A8070', '--text-4': '#4A4540', '--bg-page': '#0F0E0B', '--bg-card': '#1C1A14', '--bg-subtle': '#252218', '--bg-inset': '#2A2720', '--border-base': '#3A3520', '--border-subtle': '#302C1C', '--danger-bg': '#2A1215', '--warning-bg': '#2A2010', '--success-bg': '#0F2418', '--info-bg': '#101828', '--danger-soft': '#3A1820', '--warning-soft': '#332510', '--success-soft': '#1A3525', '--info-soft': '#152030', '--shadow-1': '0 2px 12px rgba(0,0,0,0.20)', '--shadow-2': '0 4px 20px -2px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.20)', '--shadow-3': '0 8px 28px -4px rgba(0,0,0,0.50)', '--hd-blob-1': 'rgba(' + b1r + ',' + b1g + ',' + b1b + ',0.45)', '--hd-blob-2': 'rgba(' + b2r + ',' + b2g + ',' + b2b + ',0.38)', '--hd-blob-3': 'rgba(' + b3r + ',' + b3g + ',' + b3b + ',0.25)'}, hdTextTokens(p700));
  }

  /* ── 应用主题（统一出口，dispatch 事件） ─────────────────── */
  function applyTokens(tokens) {
    var r = doc.documentElement.style;
    Object.keys(tokens).forEach(function (k) { r.setProperty(k, tokens[k]); });
    doc.dispatchEvent(new CustomEvent('fxthemechange', {detail: tokens}));
  }

  /* ── 工具栏状态 ───────────────────────────────────────────── */
  var _cur = {light: '#FF8000', dark: '#D4AF37'};
  var _activeId = 'sw-orange';

  /* ── 工具栏 UI 函数（需挂 window，供 onclick 调用） ──────── */
  function setTheme(name) { applyTokens(PRESETS[name]); }
  function setCustomTheme(hex) { applyTokens(generatePalette(hex)); }
  function setCustomDarkTheme(hex) { applyTokens(generateDarkPalette(hex)); }

  function setActiveBar(id, color) {
    doc.querySelectorAll('[data-sw]').forEach(function (el) { el.style.boxShadow = ''; });
    var el = doc.getElementById(id) || doc.querySelector('[data-sw="' + id + '"]');
    if (el) el.style.boxShadow = '0 0 0 2.5px #fff,0 0 0 4px ' + (color || el.style.background);
    _activeId = id;
  }
  function togglePanel(mode, btn) {
    var inp = doc.getElementById(mode === 'light' ? 'lp-hidden' : 'dp-hidden');
    var rect = btn.getBoundingClientRect();
    inp.style.left = rect.left + 'px';
    inp.style.top = (rect.bottom + 4) + 'px';
    inp.value = _cur[mode];
    void inp.getBoundingClientRect();
    inp.click();
  }
  function previewCustom(mode, hex) {
    _cur[mode] = hex;
    mode === 'light' ? setCustomTheme(hex) : setCustomDarkTheme(hex);
  }
  function pickAndSave(mode, hex) {
    _cur[mode] = hex;
    mode === 'light' ? setCustomTheme(hex) : setCustomDarkTheme(hex);
    var s = JSON.parse(localStorage.getItem('fx-' + mode) || '[]');
    if (s.indexOf(hex) === -1) { s.push(hex); }
    s = s.slice(-6);
    localStorage.setItem('fx-' + mode, JSON.stringify(s));
    renderSwatches(mode);
    setActiveBar('sw-c-' + mode + '-' + hex.slice(1), hex);
  }
  function applyCustom(mode, hex) {
    _cur[mode] = hex;
    mode === 'light' ? setCustomTheme(hex) : setCustomDarkTheme(hex);
    setActiveBar('sw-c-' + mode + '-' + hex.slice(1), hex);
  }
  function removeCustom(mode, hex) {
    var s = JSON.parse(localStorage.getItem('fx-' + mode) || '[]');
    localStorage.setItem('fx-' + mode, JSON.stringify(s.filter(function (c) { return c !== hex; })));
    renderSwatches(mode);
  }
  function renderSwatches(mode) {
    var el = doc.getElementById('swatches-' + mode); if (!el) return;
    var s = JSON.parse(localStorage.getItem('fx-' + mode) || '[]');
    el.innerHTML = s.map(function (hex) {
      var sid = 'sw-c-' + mode + '-' + hex.slice(1);
      return '<div style="position:relative;width:28px;height:28px;flex-shrink:0"'
        + ' onmouseenter="this.querySelector(\'.sw-x\').style.opacity=\'1\'"'
        + ' onmouseleave="this.querySelector(\'.sw-x\').style.opacity=\'0\'">'
        + '<button id="' + sid + '" data-sw onclick="FxTheme.applyCustom(\'' + mode + '\',\'' + hex + '\')" title="' + hex + '" style="width:28px;height:28px;border-radius:8px;border:none;cursor:pointer;background:' + hex + ';padding:0;display:block;transition:box-shadow .15s"></button>'
        + '<button class="sw-x" onclick="FxTheme.removeCustom(\'' + mode + '\',\'' + hex + '\')" title="删除" style="position:absolute;top:-4px;right:-4px;width:14px;height:14px;border-radius:50%;background:rgba(0,0,0,0.55);color:#fff;border:1.5px solid #fff;cursor:pointer;font-size:9px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;opacity:0;transition:opacity .12s;z-index:1">×</button>'
        + '</div>';
    }).join('');
  }

  /* ── 注入工具栏 HTML ──────────────────────────────────────── */
  function inject() {
    /* 工具栏 */
    var bar = doc.createElement('div');
    bar.id = 'theme-bar';
    bar.style.cssText = 'position:fixed;top:16px;right:16px;z-index:9999;display:flex;align-items:center;gap:5px;background:#fff;padding:8px 12px;border-radius:14px;box-shadow:0 2px 16px rgba(0,0,0,0.09)';
    bar.innerHTML =
      '<span style="font-size:11px;font-weight:600;color:#bbb;margin-right:2px">浅色</span>'
      + '<button id="sw-orange" data-sw onclick="FxTheme.setTheme(\'orange\');FxTheme.setActiveBar(\'sw-orange\',\'#FF8000\')" title="橙色" style="width:28px;height:28px;border-radius:8px;border:none;cursor:pointer;background:#FF8000;padding:0;flex-shrink:0;box-shadow:0 0 0 2.5px #fff,0 0 0 4px #FF8000"></button>'
      + '<span id="swatches-light" style="display:flex;gap:5px;align-items:center"></span>'
      + '<button onclick="FxTheme.togglePanel(\'light\',this)" title="添加浅色" style="width:28px;height:28px;border-radius:8px;border:1.5px dashed #d0d0d0;cursor:pointer;background:none;color:#ccc;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;flex-shrink:0">+</button>'
      + '<span style="width:1px;height:18px;background:rgba(0,0,0,0.10);margin:0 3px"></span>'
      + '<span style="font-size:11px;font-weight:600;color:#bbb;margin-right:2px">深色</span>'
      + '<span id="swatches-dark" style="display:flex;gap:5px;align-items:center"></span>'
      + '<button onclick="FxTheme.togglePanel(\'dark\',this)" title="添加深色" style="width:28px;height:28px;border-radius:8px;border:1.5px dashed #d0d0d0;cursor:pointer;background:none;color:#ccc;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;flex-shrink:0">+</button>';
    doc.body.appendChild(bar);

    /* 隐藏 color input × 2 */
    ['light', 'dark'].forEach(function (mode) {
      var inp = doc.createElement('input');
      inp.type = 'color';
      inp.id = (mode === 'light' ? 'lp' : 'dp') + '-hidden';
      inp.style.cssText = 'position:fixed;left:-999px;top:0;width:1px;height:1px;opacity:0;border:none;padding:0';
      inp.addEventListener('input', function (e) { FxTheme.previewCustom(mode, e.target.value); });
      inp.addEventListener('change', function (e) { FxTheme.pickAndSave(mode, e.target.value); });
      doc.body.appendChild(inp);
    });

    renderSwatches('light');
    renderSwatches('dark');
  }

  /* ── 公开 API（供 onclick 和页面代码调用） ───────────────── */
  win.FxTheme = {
    setTheme:           setTheme,
    setActiveBar:       setActiveBar,
    togglePanel:        togglePanel,
    previewCustom:      previewCustom,
    pickAndSave:        pickAndSave,
    applyCustom:        applyCustom,
    removeCustom:       removeCustom,
    generatePalette:    generatePalette,
    generateDarkPalette: generateDarkPalette,
    setCustomTheme:     setCustomTheme,
    setCustomDarkTheme: setCustomDarkTheme,
  };

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

}(window, document));
