#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 gen_icons.py 里 SLOTS 的默认方案写进 src/components/icons/AppIcon.tsx。

幂等：已经存在的名字会跳过。写完请跑 pnpm typecheck —— Record<AppIconName, string>
会同时校验“联合类型有但 BODIES 没有”和反过来的情况。
"""

from __future__ import annotations

import pathlib
import sys

import gen_icons

UNION_ANCHOR = '  | "undo";'
BODIES_ANCHOR = '  "undo":'


def js(body: str) -> str:
    return '"' + body.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main() -> int:
    path = gen_icons.APP_ICON
    raw = path.read_bytes().decode("utf-8")
    nl = "\r\n" if "\r\n" in raw else "\n"

    upstream = gen_icons.load_upstream()
    slots, problems = gen_icons.build(upstream, gen_icons.existing_bodies())
    for p in problems:
        print(f"[warn] {p}", file=sys.stderr)

    todo = []
    for slot in slots:
        name, body = slot["name"], slot["options"][0]["body"]
        if f'| "{name}"' in raw or f'  "{name}":' in raw:
            print(f"[skip] {name} 已存在")
            continue
        todo.append((name, body))

    if not todo:
        print("没有需要新增的图标")
        return 0

    if raw.count(UNION_ANCHOR) != 1 or raw.count(BODIES_ANCHOR) != 1:
        sys.exit("锚点不唯一，放弃写入（AppIcon.tsx 结构变了？）")

    union_block = "".join(f'  | "{name}"{nl}' for name, _ in todo)
    bodies_block = "".join(f'  "{name}":{nl}    {js(body)},{nl}' for name, body in todo)

    raw = raw.replace(UNION_ANCHOR, union_block + UNION_ANCHOR)
    raw = raw.replace(BODIES_ANCHOR, bodies_block + BODIES_ANCHOR)

    path.write_bytes(raw.encode("utf-8"))
    print(f"写入 {path}：新增 {len(todo)} 个 → {', '.join(n for n, _ in todo)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
