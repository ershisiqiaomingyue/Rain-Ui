#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AppIcon 候选图标生成器。

上游：../hugeicons.json —— Hugeicons 4.4.0 原始元数据（6091 个字形，MIT，已入库）。
按下面的 SLOTS 表取出候选字形、规范化后产出两个评审用文件（都不入库）：

    preview.html   评审页：明/暗、多尺寸多线宽、候选可点选、实时导出 TSX
    entries.tsx    当前选中方案对应的 AppIcon 条目，评审通过后照着抄

用法（在 icons/tools/ 下执行）：

    python gen_icons.py --search wallet   # 不知道上游叫什么就先搜关键字
    python gen_icons.py                   # 生成 preview.html + entries.tsx
    python gen_icons.py --check           # 只校验：字形在不在、body 有没有 id 污染
    python merge_icons.py                 # 评审通过后写进 AppIcon.tsx（幂等）
    python final_check.py                 # 写库后的自检页，按 14/16px 真实尺寸看

加图标 = 在 SLOTS 里追加一个槽位（name / label / note / options，第一个选项是默认方案），
再跑一遍上面的流程。完整步骤见 README.md。
"""

from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
ICONS_DIR = HERE.parent
HUGEICONS = ICONS_DIR / "hugeicons.json"
APP_ICON = ICONS_DIR.parent / "src" / "components" / "icons" / "AppIcon.tsx"

# ---------------------------------------------------------------------------
# 候选表
#   name      AppIconName 里要用的语义名（英文，kebab-case）
#   label     中文名
#   note      什么场景用它（评审页会显示，避免语义重叠）
#   options   候选字形，第一个是默认方案；未与现有图标重复的不必多列
#   compare   与库内已有图标的对照（说明为什么不复用已有的那个）
#
# 下面这批就是 2026-11 已进库的 19 个，留着当范例；加新图标在末尾追加一项即可。
# ---------------------------------------------------------------------------
SLOTS: list[dict] = [
    {
        "name": "reset",
        "label": "重置",
        "note": "恢复默认设置 / 把当前状态清回初始（会话、表单、视图）",
        "compare": "refresh",
        "why": "refresh 语义是“重新取一次（重新生成/刷新数据）”；重置是回到初始态，两者同框时箭头方向必须能区分",
        "options": ["refresh-ccw-dot", "circle-arrow-reload-01", "arrow-reload-horizontal", "timer-reset"],
    },
    {
        "name": "test",
        "label": "测试",
        "note": "跑测试 / 测试用例 / 校验结果",
        "compare": "flask",
        "why": "库里的 flask 是圆底烧瓶，偏“实验/试验性功能”；单支试管/锥形瓶和它撞脸，用成排试管（test-tubes）在 14px 下也能和 flask 分开",
        "options": ["test-tubes", "test-tube-01", "beaker", "test-tube-diagonal"],
    },
    {
        "name": "todo",
        "label": "待办",
        "note": "任务清单 / 待办事项 / 执行进度勾选",
        "compare": "clipboard-list",
        "why": "clipboard-list 是“把清单摊开看”（计划面板），待办要表达逐条勾选完成",
        "options": ["list-todo", "task-01", "queue-01", "task-done-01"],
    },
    {
        "name": "mic",
        "label": "语音输入",
        "note": "对话输入框的语音输入 / 朗读入口",
        "compare": None,
        "why": "",
        "options": ["mic-01", "mic-02", "voice"],
    },
    {
        "name": "mic-off",
        "label": "关闭语音",
        "note": "语音进行中 → 点击关闭；与 mic 成对出现",
        "compare": None,
        "why": "",
        "options": ["mic-off-01", "mic-off-02"],
    },
    {
        "name": "globe",
        "label": "联网 / 浏览器",
        "note": "联网搜索、网页抓取、内置浏览器入口",
        "compare": "network",
        "why": "库里的 network 是节点连线（本地网络拓扑），表达“上网”会歧义",
        "options": ["globe", "globe-02", "ai-web-browsing"],
    },
    {
        "name": "bell",
        "label": "通知",
        "note": "开启通知 / 任务完成提醒 / 未读提醒",
        "compare": None,
        "why": "",
        "options": ["bell", "bell-dot", "bell-ring"],
    },
    {
        "name": "share",
        "label": "分享 / 导出",
        "note": "分享会话或产物、导出为文件/链接",
        "compare": "external-link",
        "why": "external-link 只表示“跳到外部”，导出/分享需要更宽的语义",
        "options": ["share-08", "share-05", "share-01", "share-03"],
    },
    {
        "name": "star",
        "label": "星标 / 收藏",
        "note": "收藏消息或会话、置顶精选",
        "compare": "bookmark",
        "why": "两者常同时出现（收藏 vs 书签），需要形不同",
        "options": ["star", "star-circle", "stars"],
    },
    {
        "name": "redo",
        "label": "重做",
        "note": "编辑消息后的重做；与已有 undo 成对",
        "compare": "undo",
        "why": "库里有 undo 没有 redo，方向必须镜像匹配",
        "options": ["redo", "redo-01", "redo-02"],
    },
    {
        "name": "reply",
        "label": "引用回复",
        "note": "引用某条消息继续追问 / 回复",
        "compare": "corner-down-left",
        "why": "corner-down-left 是“回车发送”，引用回复要能看出引号或指向",
        "options": ["reply", "message-square-reply", "quote"],
    },
    {
        "name": "thumbs-up",
        "label": "赞",
        "note": "回答反馈 / 正反馈",
        "compare": None,
        "why": "",
        "options": ["thumbs-up", "thumbs-up-ellipse", "thumbs-up-rectangle"],
    },
    {
        "name": "thumbs-down",
        "label": "踩",
        "note": "回答反馈 / 负反馈；与 thumbs-up 成对",
        "compare": None,
        "why": "",
        "options": ["thumbs-down", "thumbs-down-ellipse", "thumbs-down-rectangle"],
    },
    {
        "name": "zap",
        "label": "极速模式",
        "note": "快速/低延迟档位、加速推理开关",
        "compare": "loader",
        "why": "loader 是进行中，zap 是档位标识",
        "options": ["zap", "bolt", "database-lightning"],
    },
    {
        "name": "menu",
        "label": "菜单",
        "note": "窄屏抽屉入口、会话行内操作菜单",
        "compare": "panel-left",
        "why": "panel-left 是“折叠侧栏”，与“打开菜单”不是一件事",
        "options": ["menu-01", "menu-two-line", "menu-09", "hamburger-02"],
    },
    {
        "name": "balance",
        "label": "余额",
        "note": "账户余额 / 剩余额度 / 充值入口",
        "compare": "chart",
        "why": "chart 是“用掉了多少”的曲线，余额是“还剩多少”，只该用钱包类字形",
        "options": ["wallet-01", "wallet-minimal", "coins-01", "token-circle"],
    },
    {
        "name": "user",
        "label": "账户",
        "note": "登录账号、头像占位、用量归属",
        "compare": None,
        "why": "",
        "options": ["user", "user-circle", "user-round"],
    },
    {
        "name": "lightbulb",
        "label": "提示 / 想法",
        "note": "空状态引导、灵感建议、提示词推荐",
        "compare": "sparkles",
        "why": "sparkles 已用于 AI 生成类入口，引导提示需要与它区分",
        "options": ["lightbulb", "bulb", "idea"],
    },
    {
        "name": "translate",
        "label": "翻译",
        "note": "翻译消息、多语言切换",
        "compare": None,
        "why": "",
        "options": ["translate", "translation", "ai-translate"],
    },
]

STROKE_WIDTH_RE = re.compile(r'\s*stroke-width="[^"]*"')
RISKY_RE = re.compile(r"<(defs|mask|clipPath|filter|symbol|use)\b|url\(#")


def load_upstream() -> dict:
    if not HUGEICONS.exists():
        sys.exit(f"上游元数据缺失：{HUGEICONS}")
    with HUGEICONS.open(encoding="utf-8") as fh:
        return json.load(fh)["icons"]


def normalize(body: str) -> str:
    """和 AppIcon.tsx 里已有条目的写法对齐：去掉硬编码线宽（由组件统一给 1.7）。"""
    return STROKE_WIDTH_RE.sub("", body).strip()


def existing_bodies() -> dict:
    """从 AppIcon.tsx 的 BODIES 表里抠出已有字形，用于“新 vs 旧”对照。"""
    if not APP_ICON.exists():
        return {}
    src = APP_ICON.read_text(encoding="utf-8")
    block = src.split("const BODIES: Record<AppIconName, string> = {", 1)
    if len(block) < 2:
        return {}
    block = block[1].split("\n};", 1)[0]
    found = {}
    for key, val in re.findall(r'\n  "([^"]+)":\s*\n?\s*"((?:[^"\\]|\\.)*)",', block):
        found[key] = val.encode().decode("unicode_escape")
    return found


def build(upstream: dict, existing: dict) -> tuple[list, list]:
    slots, problems = [], []
    for slot in SLOTS:
        options = []
        for name in slot["options"]:
            if name not in upstream:
                problems.append(f"{slot['name']}: 上游不存在字形 {name}")
                continue
            body = normalize(upstream[name]["body"])
            if RISKY_RE.search(body):
                problems.append(f"{slot['name']}: {name} 含 defs/mask/id 引用，内联会有风险")
            options.append({"id": name, "body": body})
        if not options:
            problems.append(f"{slot['name']}: 没有任何可用候选")
            continue
        slots.append({
            "name": slot["name"],
            "label": slot["label"],
            "note": slot["note"],
            "why": slot["why"],
            "compare": slot["compare"],
            "compareBody": existing.get(slot["compare"]) if slot["compare"] else None,
            "options": options,
        })
    return slots, problems


# ---------------------------------------------------------------------------
# 产物
# ---------------------------------------------------------------------------
def entries_tsx(slots: list, pinned: dict | None = None) -> str:
    """生成可直接抄进 AppIcon.tsx 的两段：union 追加 + BODIES 条目。"""
    pinned = pinned or {}
    picked = [(s, pinned.get(s["name"], s["options"][0]["id"])) for s in slots]
    pick_body = {
        name: next(o["body"] for o in s["options"] if o["id"] == name) for s, name in picked
    }

    lines = ["// 评审通过后，把下面两段按同样顺序追加到 src/components/icons/AppIcon.tsx", ""]
    lines.append("/* 1) AppIconName 联合类型追加（放在 \"undo\" 之前，保持成对语义相邻） */")
    for s, name in picked:
        lines.append(f'  | "{s["name"]}"')
    lines.append("")
    lines.append("/* 2) BODIES 表追加 */")
    for s, name in picked:
        body = pick_body[name].replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'  "{s["name"]}":')
        lines.append(f'    "{body}",')
    lines.append("")
    lines.append("/* 3) icons/README.md 记录：")
    for s, name in picked:
        lines.append(f'     AppIcon "{s["name"]}" ({s["label"]}) ← Hugeicons {name}')
    lines.append("*/")
    return "\n".join(lines)


def preview_html(slots: list, existing: dict) -> str:
    # 内联进 <script> 时把 "</" 转义成 "<\/"，JS 字符串里等价，但不会提前闭合 script
    payload = json.dumps({"slots": slots}, ensure_ascii=False).replace("</", "<\\/")
    return TEMPLATE.replace("__DATA__", payload)


TEMPLATE = r"""<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>AppIcon 候选图标评审</title>
<style>
  :root {
    --bg: #ffffff; --fg: #16181d; --muted: #6b7280; --line: #e5e7eb;
    --card: #fafafa; --chip: #f1f3f5; --accent: #2563eb; --warn: #b45309;
  }
  html[data-theme="dark"] {
    --bg: #0d0f12; --fg: #e8eaed; --muted: #9aa1ab; --line: #262a30;
    --card: #14171b; --chip: #1c2026; --accent: #7aa2ff; --warn: #fbbf24;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 32px 40px 80px; background: var(--bg); color: var(--fg);
    font: 14px/1.6 -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif;
  }
  h1 { font-size: 20px; margin: 0 0 6px; }
  .sub { color: var(--muted); margin: 0 0 24px; }
  .sub code { background: var(--chip); padding: 1px 5px; border-radius: 4px; }
  .bar { position: sticky; top: 0; z-index: 5; display: flex; gap: 12px; align-items: center;
         margin: -8px -8px 20px; padding: 8px; background: color-mix(in srgb, var(--bg) 88%, transparent);
         backdrop-filter: blur(6px); border-bottom: 1px solid var(--line); }
  .bar .spacer { flex: 1; }
  .tip { color: var(--muted); font-size: 12.5px; }
  button {
    font: inherit; color: inherit; background: var(--chip); border: 1px solid var(--line);
    border-radius: 7px; padding: 5px 12px; cursor: pointer;
  }
  button:hover { border-color: var(--accent); }
  button.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(390px, 1fr)); gap: 16px; }
  .card { border: 1px solid var(--line); border-radius: 12px; background: var(--card); padding: 16px 16px 14px; }
  .head { display: flex; align-items: baseline; gap: 8px; }
  .head .name { font-family: ui-monospace, Consolas, monospace; font-size: 13px; color: var(--accent); }
  .head .label { font-size: 15px; font-weight: 600; }
  .head .src { margin-left: auto; font-family: ui-monospace, Consolas, monospace; font-size: 11px; color: var(--muted); }
  .note { color: var(--muted); font-size: 12.5px; margin: 6px 0 12px; min-height: 34px; }
  .stage { display: flex; align-items: center; gap: 22px; padding: 14px 12px; border-radius: 10px; background: var(--bg); border: 1px dashed var(--line); }
  .stage .big { display: grid; place-items: center; width: 64px; height: 64px; }
  .sizes { display: flex; align-items: flex-end; gap: 14px; color: var(--fg); }
  .sizes figure { margin: 0; display: grid; justify-items: center; gap: 6px; }
  .sizes figcaption { font-size: 10px; color: var(--muted); }
  .strokes { margin-left: auto; display: flex; gap: 12px; align-items: flex-end; }
  .opts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .opt { display: flex; align-items: center; gap: 7px; padding: 5px 9px 5px 7px; border: 1px solid var(--line);
         border-radius: 8px; background: var(--chip); cursor: pointer; font-family: ui-monospace, Consolas, monospace;
         font-size: 11px; color: var(--muted); }
  .opt:hover { border-color: var(--accent); }
  .opt[aria-pressed="true"] { border-color: var(--accent); color: var(--fg); box-shadow: inset 0 0 0 1px var(--accent); }
  .why { margin-top: 11px; font-size: 12px; color: var(--muted); border-top: 1px dashed var(--line); padding-top: 9px; }
  .why b { color: var(--warn); font-weight: 600; }
  .cmp { display: flex; align-items: center; gap: 10px; margin-top: 8px; font-size: 12px; color: var(--muted); }
  .cmp .cell { display: grid; place-items: center; gap: 4px; }
  pre { white-space: pre-wrap; word-break: break-all; background: var(--card); border: 1px solid var(--line);
        border-radius: 10px; padding: 14px; font-size: 11.5px; line-height: 1.7; margin: 0; }
  h2 { font-size: 15px; margin: 34px 0 12px; }
  svg { display: block; }
</style>
</head>
<body>
<h1>AppIcon 候选图标评审</h1>
<p class="sub">
  上游 <code>icons/hugeicons.json</code>（Hugeicons 4.4.0, MIT）· 24 网格 · 组件统一 <code>stroke-width=1.7</code>、圆头圆角 ·
  点候选可换默认方案，底部代码实时更新。确认后我按底部条目写进 <code>src/components/icons/AppIcon.tsx</code>。
</p>

<div class="bar">
  <button id="theme">切换明/暗</button>
  <span class="tip">当前选中会写进 <code>BODIES</code> / <code>AppIconName</code></span>
  <span class="spacer"></span>
  <button class="primary" id="copy">复制 TSX 条目</button>
</div>

<div class="grid" id="grid"></div>

<h2>待抄入 AppIcon.tsx 的条目（随点选实时更新）</h2>
<pre id="out"></pre>

<script>
const DATA = __DATA__;
const picked = {};
DATA.slots.forEach(s => picked[s.name] = s.options[0].id);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function glyph(body, size, stroke = 1.7) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

function escBody(body) {
  return '"' + body.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function renderTsx() {
  const lines = [];
  lines.push('/* 1) AppIconName 联合类型追加（放在 "undo" 之前） */');
  DATA.slots.forEach(s => lines.push('  | "' + s.name + '"'));
  lines.push("");
  lines.push("/* 2) BODIES 表追加 */");
  DATA.slots.forEach(s => {
    const body = s.options.find(o => o.id === picked[s.name]).body;
    lines.push('  "' + s.name + '":');
    lines.push("    " + escBody(body) + ",");
  });
  lines.push("");
  lines.push("/* 3) icons/README.md 记录 */");
  DATA.slots.forEach(s => lines.push('     AppIcon "' + s.name + '" (' + s.label + ') ← Hugeicons ' + picked[s.name]));
  return lines.join("\n");
}

function render() {
  const grid = document.getElementById("grid");
  grid.innerHTML = DATA.slots.map(s => {
    const chosen = s.options.find(o => o.id === picked[s.name]);
    const compare = s.compareBody
      ? `<div class="cmp">与库里已有的 <code>${s.compare}</code> 对照：<span class="cell">${glyph(s.compareBody, 22)}</span>
         <span class="cell">${glyph(chosen.body, 22)}</span> <span>← 本次新增</span></div>`
      : "";
    return `<div class="card">
      <div class="head">
        <span class="name">${s.name}</span><span class="label">${s.label}</span>
        <span class="src">${chosen.id}</span>
      </div>
      <p class="note">${s.note}</p>
      <div class="stage">
        <div class="big">${glyph(chosen.body, 48)}</div>
        <div class="sizes">
          ${[20, 16, 14, 12].map(n => `<figure>${glyph(chosen.body, n)}<figcaption>${n}px</figcaption></figure>`).join("")}
        </div>
        <div class="strokes">
          ${[1.5, 1.7, 2].map(w => `<figure>${glyph(chosen.body, 26, w)}<figcaption>${w}</figcaption></figure>`).join("")}
        </div>
      </div>
      <div class="opts">
        ${s.options.map(o => `<button class="opt" aria-pressed="${o.id === picked[s.name]}" data-slot="${s.name}" data-id="${o.id}">
            ${glyph(o.body, 16)}<span>${o.id}</span></button>`).join("")}
      </div>
      ${s.why ? `<div class="why"><b>为什么不用 ${s.compare}</b>：${s.why}</div>` : ""}
      ${compare}
    </div>`;
  }).join("");
  document.getElementById("out").textContent = renderTsx();
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".opt");
  if (!btn) return;
  picked[btn.dataset.slot] = btn.dataset.id;
  render();
});

document.getElementById("theme").onclick = () => {
  const el = document.documentElement;
  el.dataset.theme = el.dataset.theme === "dark" ? "light" : "dark";
};

document.getElementById("copy").onclick = async () => {
  await navigator.clipboard.writeText(renderTsx());
  const b = document.getElementById("copy");
  const t = b.textContent; b.textContent = "已复制";
  setTimeout(() => b.textContent = t, 1200);
};

render();
</script>
</body>
</html>
"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="只校验，不写文件")
    ap.add_argument("--search", metavar="关键词", help="在上游字形名里搜关键字（不区分大小写），只列名字")
    args = ap.parse_args()

    upstream = load_upstream()
    if args.search:
        keyword = args.search.strip().lower()
        hits = sorted(name for name in upstream if keyword in name.lower())
        for name in hits:
            print(name)
        print(f"--- {keyword}: 命中 {len(hits)} 个 / 上游共 {len(upstream)} 个", file=sys.stderr)
        return 0

    existing = existing_bodies()
    slots, problems = build(upstream, existing)

    for p in problems:
        print(f"[warn] {p}", file=sys.stderr)
    if args.check:
        print(f"候选槽位 {len(slots)} 个，字形 {sum(len(s['options']) for s in slots)} 个，问题 {len(problems)} 个")
        return 1 if problems else 0

    (HERE / "preview.html").write_text(preview_html(slots, existing), encoding="utf-8")
    (HERE / "entries.tsx").write_text(entries_tsx(slots), encoding="utf-8")
    print(f"已生成 {(HERE / 'preview.html')}")
    print(f"已生成 {(HERE / 'entries.tsx')}")
    print(f"槽位 {len(slots)} 个 / 字形 {sum(len(s['options']) for s in slots)} 个 / 问题 {len(problems)} 个")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
