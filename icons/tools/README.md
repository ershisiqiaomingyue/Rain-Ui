# tools/ —— AppIcon 生成脚本

这套脚本只干一件事：把「从上游挑字形 → 规范化 → 写进 `AppIcon.tsx` → 按真实尺寸看一眼」
变成可复现的几条命令，不再手工复制 SVG 片段。

## 前置

- Python 3.9+，只用标准库，不用装依赖。
- 上游 [`../hugeicons.json`](../hugeicons.json) 已在库里（Hugeicons 4.4.0，MIT，6091 个字形）。
- 产物 `preview.html` / `entries.tsx` / `final-check.html` / `*.png` 都已被 `.gitignore` 忽略，
  入库的只有脚本和本文档。

## 生成一个图标：五步

### 1. 先找上游叫什么

```bash
python gen_icons.py --search wallet
```

子串匹配、不区分大小写，直接打印字形名。挑 3–4 个语义最贴近的当候选——同义词越歧义，
越要多给几个候选让人眼选。

### 2. 填候选表

编辑 `gen_icons.py` 里的 `SLOTS`，末尾追加一项：

```python
{
    "name": "wallet",          # AppIconName 里用的语义名，kebab-case
    "label": "钱包",           # 中文名，评审页显示
    "note": "账户余额 / 充值入口",  # 什么场景用；避免和已有图标语义重叠
    "compare": "chart",        # 库里最容易混的那个已有图标，没有就 None
    "why": "chart 是花掉多少的曲线，钱包才是还剩多少",
    "options": ["wallet-01", "wallet-minimal", "coins-01"],  # 第一个是默认方案
},
```

### 3. 出评审页

```bash
python gen_icons.py            # 生成 preview.html + entries.tsx
python gen_icons.py --check    # 只校验，不写文件
```

打开 `preview.html`：明/暗双主题、12/14/16/20px 四个尺寸、1.5/1.7/2.0 三档线宽都在一页里，
点候选按钮可换默认方案，和 `compare` 那个已有图标并排对照，底部实时输出要抄的 TSX。

`--check` 报的两类问题：字形在上游不存在；body 里含 `defs` / `mask` / `clipPath` / `filter` /
`url(#…)` 这类内联会互相污染的引用。

### 4. 写进组件库

```bash
python merge_icons.py
pnpm typecheck
```

`merge_icons.py` 只写 `options[0]` 那套方案，幂等（已存在的名字跳过），按 `"undo"` 锚点插到它前面，
保住 undo / redo 这类成对图标的相邻顺序。写完 `pnpm typecheck`：`Record<AppIconName, string>`
会同时校验联合类型和 `BODIES` 两边一一对应，漏一边就报错。

### 5. 写库后自检

```bash
python final_check.py          # 生成 final-check.html
```

字形直接从 `AppIcon.tsx` 的 `BODIES` 读，按真实尺寸摆进对话场景（行内操作 14px、输入区 16px），
亮/暗各一份——评审页看不出的小尺寸糊成一团，在这里能看出来。

最后在 [`../README.md`](../README.md) 的来源表里补一行（`merge_icons.py` 会把新增名字打在终端上）。
demo 的 AppIcon 演示页遍历 `APP_ICON_NAMES`，新图标自动出现，不用改导航。

> 两个入口都能用：`cd icons/tools && python gen_icons.py`，或者在仓库根目录
> `python icons/tools/gen_icons.py`——路径都按 `__file__` 推，不依赖当前目录。

## 约定

- 24×24 网格、`fill="none"`、`stroke="currentColor"`、圆头圆角；线宽由组件统一给 1.7，
  所以 `normalize()` 会剥掉上游 body 里硬编码的 `stroke-width`。
- 名字用**语义**而不是上游名（`reset` 而非 `refresh-ccw-dot`），这样换上游时调用处不用动。
- 语义相近的图标必须在 14px 下也能分辨：`refresh`（重新取一次）/ `reset`（回到初始态）/
  `redo`（与 undo 成对）、`flask`（实验性功能）/ `test`（跑测试）。
- 不为「差不多意思」新增图标——先查 `AppIcon.tsx` 里有没有能复用的，`compare` 字段就是逼自己写清
  为什么不复用。

## 文件

| 文件 | 用途 |
| --- | --- |
| `gen_icons.py` | 候选表 + 评审页生成；`--search` 搜上游、`--check` 只校验 |
| `merge_icons.py` | 把默认方案写进 `AppIcon.tsx`（幂等） |
| `final_check.py` | 写库后的真实尺寸自检页 |
| `preview.html` / `entries.tsx` / `final-check.html` / `*.png` | 产物，不入库 |

## 已进库：2026-11-08

19 个（`reset` `test` `todo` `mic` `mic-off` `globe` `bell` `share` `star` `redo` `reply`
`thumbs-up` `thumbs-down` `zap` `menu` `balance` `user` `lightbulb` `translate`）已写进
`src/components/icons/AppIcon.tsx`，来源对照见 [`../README.md`](../README.md)。
`SLOTS` 里保留这批当范例：再加图标时照着某个槽位的写法追加即可。
