# Icon metadata

`hugeicons.json` 是 [Hugeicons](https://hugeicons.com/) 4.4 的原始图标元数据（MIT），
作为 `AppIcon` 的唯一上游来源保留在这里。运行时不会读取这个文件：字形已经内联进
[`src/components/icons/AppIcon.tsx`](../src/components/icons/AppIcon.tsx)，
组件包仍然只依赖 React。

## 取一个字形

```js
const data = require("./hugeicons.json");
const body = data.icons["search-01"].body; // <path .../>
```

`body` 是 24×24 网格、无颜色的 SVG 片段，由 `AppIcon` 统一套上
`fill="none"`、`stroke="currentColor"`、`stroke-width="1.7"` 和圆角线帽。

## 新增图标

1. 在 `hugeicons.json` 里找到语义最接近的图标，取 `icons[name].body`。
2. 在 `AppIcon.tsx` 的 `AppIconName` 联合类型和 `BODIES` 表里各加一条。
3. 调用处统一写 `<AppIcon name="..." size={14} />`，不要再直接引第三方图标库。

要批量加、或者想让「选哪个字形」这件事可复现，用 [`tools/`](tools/README.md)：
`tools/gen_icons.py` 按候选表生成评审页，`tools/merge_icons.py` 写进 `AppIcon.tsx`。
`tools/` 只在本地跑，不参与组件库构建。

## 对话场景补充（2026-11）

下面这批是给对话界面补的，`AppIcon` 名是语义名，括号里是上游 Hugeicons 名。
都是 24 网格描边字形，调用处照常 `<AppIcon name="..." />`。

| AppIcon | 语义 | 上游 |
| --- | --- | --- |
| `reset` | 重置 | `refresh-ccw-dot` |
| `test` | 测试 | `test-tubes` |
| `todo` | 待办 | `list-todo` |
| `mic` / `mic-off` | 语音输入 / 关闭语音 | `mic-01` / `mic-off-01` |
| `globe` | 联网、浏览器 | `globe` |
| `bell` | 通知 | `bell` |
| `share` | 分享、导出 | `share-08` |
| `star` | 星标、收藏 | `star` |
| `redo` | 重做（与 `undo` 成对） | `redo` |
| `reply` | 引用回复 | `reply` |
| `thumbs-up` / `thumbs-down` | 赞 / 踩 | 同名 |
| `zap` | 极速模式 | `zap` |
| `menu` | 菜单 | `menu-01` |
| `balance` | 余额、剩余额度 | `wallet-01` |
| `user` | 账户 | `user` |
| `lightbulb` | 提示、想法 | `lightbulb` |
| `translate` | 翻译 | `translate` |

## 有意保留的例外

- `branch`：Tabler `git-fork`，分叉会话专用。
- `pin-fill`：Tabler `pin-filled`，置顶激活态。
- `chevrons-up-down`：由 Hugeicons 的 chevron 重画成同一套圆角描边。
- `circle-fill`：`AppIcon` 内的自定义实心圆，用于状态点。

这些字形已经写在 `AppIcon.tsx` 里，不需要再从原始 JSON 取。
