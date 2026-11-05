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

## 有意保留的例外

- `branch`：Tabler `git-fork`，分叉会话专用。
- `pin-fill`：Tabler `pin-filled`，置顶激活态。
- `chevrons-up-down`：由 Hugeicons 的 chevron 重画成同一套圆角描边。
- `circle-fill`：`AppIcon` 内的自定义实心圆，用于状态点。

这些字形已经写在 `AppIcon.tsx` 里，不需要再从原始 JSON 取。
