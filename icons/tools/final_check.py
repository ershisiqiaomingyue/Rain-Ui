#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""写库之后的最终自检页。

字形直接从 AppIcon.tsx 的 BODIES 取（所以要先跑 merge_icons.py），按真实尺寸摆进对话场景
（行内操作 14px、输入区 16px），亮/暗各一份；候选清单取自 gen_icons.SLOTS。
产出 final-check.html（不入库），想留图就用 scripts/shot.mjs 截成 PNG。
"""

from __future__ import annotations

import gen_icons

NEW = [slot["name"] for slot in gen_icons.SLOTS]

BODIES = gen_icons.existing_bodies()

MESSAGE_ACTIONS = ["reply", "copy", "thumbs-up", "thumbs-down", "redo", "share", "star", "edit", "trash", "reset"]
COMPOSER = ["paperclip", "mic", "send"]
COMPARE = ["refresh", "flask", "clipboard-list", "chart", "undo", "external-link", "bookmark", "sparkles"]


def icon(name: str, size: int = 14, stroke: float = 1.7) -> str:
    body = BODIES.get(name)
    if body is None:
        # 还没合并进度（或这个场景里的图标不在库里）就跳过，别让整页生不出来。
        return ""
    return (
        f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        f'stroke-width="{stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" '
        f'data-app-icon="{name}">{body}</svg>'
    )


def action_row() -> str:
    return "".join(
        f'<span class="act">{icon(n)}<i>{n}</i></span>' for n in MESSAGE_ACTIONS
    )


def composer() -> str:
    return (
        '<div class="composer"><span class="grow"></span>'
        + "".join(f'<span class="btn">{icon(n, 16)}</span>' for n in COMPOSER)
        + "</div>"
    )


def header() -> str:
    return (
        '<div class="header">'
        f'<span class="btn">{icon("menu", 16)}</span>'
        '<b>会话标题</b><span class="grow"></span>'
        f'<span class="btn">{icon("globe", 14)}</span>'
        f'<span class="btn">{icon("bell", 14)}</span>'
        f'<span class="pill">{icon("balance", 14)} ¥ 12.40</span>'
        f'<span class="btn">{icon("user", 16)}</span>'
        "</div>"
    )


def sidebar() -> str:
    items = [("todo", "待办 3"), ("star", "已收藏"), ("bell", "通知"), ("translate", "翻译"), ("lightbulb", "提示")]
    return '<div class="side">' + "".join(
        f'<span class="row">{icon(n, 14)}<i>{t}</i></span>' for n, t in items
    ) + "</div>"


def card(theme: str) -> str:
    return f"""
    <div class="app {theme}">
      {header()}
      <div class="body">
        {sidebar()}
        <div class="main">
          <div class="bubble">这条回答可以「引用回复」，也可以点「重置」重跑。</div>
          <div class="acts">{action_row()}</div>
          {composer()}
        </div>
      </div>
    </div>"""


def gallery() -> str:
    return "".join(
        f'<div class="cell"><div class="big">{icon(n, 32)}</div>'
        f'<div class="sizes">{icon(n, 16)}{icon(n, 14)}{icon(n, 12)}</div>'
        f"<code>{n}</code></div>"
        for n in NEW
    )


def compare_row() -> str:
    return "".join(
        f'<span class="act">{icon(n, 14)}<i>{n}</i></span>' for n in COMPARE
    )


HTML = f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8" />
<title>写入后的自检</title>
<style>
  body {{ margin: 0; padding: 28px 32px 40px; font: 13px/1.6 -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif;
         background: #f6f7f9; color: #16181d; }}
  h1 {{ font-size: 17px; margin: 0 0 4px; }}
  p.sub {{ color: #6b7280; margin: 0 0 18px; }}
  .apps {{ display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }}
  .app {{ border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }}
  .app.light {{ background: #fff; color: #16181d; }}
  .app.dark {{ background: #111317; color: #e8eaed; border-color: #262a30; }}
  .header {{ display: flex; align-items: center; gap: 8px; padding: 9px 10px; border-bottom: 1px solid currentColor; border-bottom-color: #0001; }}
  .header b {{ font-size: 12.5px; }}
  .grow {{ flex: 1; }}
  .btn {{ display: grid; place-items: center; width: 26px; height: 26px; border-radius: 7px; background: #00000010; }}
  .dark .btn {{ background: #ffffff14; }}
  .pill {{ display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; padding: 3px 8px; border-radius: 999px; background: #00000010; }}
  .dark .pill {{ background: #ffffff14; }}
  .body {{ display: flex; }}
  .side {{ width: 132px; padding: 10px 8px; display: grid; gap: 2px; align-content: start; border-right: 1px solid #0001; }}
  .dark .side {{ border-right-color: #ffffff1a; }}
  .row {{ display: flex; align-items: center; gap: 7px; padding: 5px 7px; border-radius: 6px; font-size: 12px; color: inherit; opacity: .78; }}
  .main {{ flex: 1; padding: 12px; }}
  .bubble {{ background: #00000008; border-radius: 10px; padding: 9px 11px; font-size: 12.5px; }}
  .dark .bubble {{ background: #ffffff0f; }}
  .acts {{ display: flex; flex-wrap: wrap; gap: 4px; margin: 8px 0 10px; }}
  .act {{ display: inline-flex; align-items: center; gap: 5px; padding: 4px 7px; border-radius: 6px; }}
  .act i {{ font-style: normal; font-size: 10.5px; opacity: .62; }}
  .dark .act:hover {{ background: #ffffff10; }}
  .composer {{ display: flex; align-items: center; gap: 6px; border: 1px solid #0002; border-radius: 10px; padding: 6px 7px; }}
  .dark .composer {{ border-color: #ffffff26; }}
  h2 {{ font-size: 13.5px; margin: 26px 0 10px; }}
  .gal {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 10px; }}
  .cell {{ background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 6px 8px; text-align: center; }}
  .cell .big {{ display: grid; place-items: center; margin-bottom: 6px; }}
  .cell .sizes {{ display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px; }}
  .cell code {{ font-size: 10px; color: #6b7280; }}
  .cmpline {{ background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 8px 10px; display: flex; flex-wrap: wrap; gap: 6px; }}
</style></head>
<body>
<h1>写入后的自检</h1>
<p class="sub">字形直接取自 <code>src/components/icons/AppIcon.tsx</code> 的 <code>BODIES</code>，按真实尺寸摆放（行内操作 14px、输入区 16px）。</p>

<div class="apps">
  {card("light")}
  {card("dark")}
</div>

<h2>与已有图标的同框对照（同一行、同为 14px）</h2>
<div class="cmpline">{compare_row()}</div>

<h2>{len(NEW)} 个候选图标</h2>
<div class="gal">{gallery()}</div>
</body></html>
"""

if __name__ == "__main__":
    out = gen_icons.HERE / "final-check.html"
    out.write_text(HTML, encoding="utf-8")
    print(f"已生成 {out}")
