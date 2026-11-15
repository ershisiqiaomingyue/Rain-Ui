# rain-ui 设计规范

分工（别让文档和代码漂开）：

- **配色唯一来源是 `assets/styles/palettes.css`**，它的头注释就是铁律：语义层只有
  shadcn 那 19 个名字（外加 `success` / `warning` 两个特批状态名），领域调色板
  （终端 ANSI / 代码高亮 / 推理滑块）是仅有的字面值区。**本文不再维护配色规范。**
- 非色尺度（圆角、焦点环、阴影、动效时长）在 `assets/styles/tokens.css`。
- 卡片的形态（底色、描边、嵌套降级、圆角收缩）由 `src/components/ui/card.tsx`
  的 `Card` 组件**自带**，消费方不写卡面类名。
- 尺寸（行高、图标、控件密度）见 `scale-rules.html`。本文只管字号、交互状态、
  Tailwind 词表，以及旧词表的名录（防止回潮）。

---

## 0. 前提

1. **暗色是默认，亮色是覆盖。** `:root` 写暗色，`html[data-theme="light"]` 覆盖。
   先在暗色做到位，再去亮色量一遍对比度，不许只交一套。
2. **一切值走 token。** 组件里不许出现 `#6366f1`、`13.5px`、`rgba(0,0,0,.2)` 这类数字。
3. **卡面自带。** `Card` 直接用 `bg-card` + `--border` 发丝线：shadcn 默认里 `--card`
   等于 `--background`，所以**卡片和页面同色，只靠 1px 线分开**，暗色无阴影、亮色一层
   极淡影（`--shadow-card`）。卡里再放 `Card` 不用写类名——深度上下文自动降级成半透明
   card 底、圆角 14 → 10 → 8 收缩、去阴影。想要灰面 / 只描边用 `variant="muted"` /
   `variant="outline"`，边框一律 `--border`，卡面本身不承担语义，语义归 Badge 和内容。

---

## 1. 交互状态

### 1.1 选中（selected）

| | 底色 | 字 | 线 |
| --- | --- | --- | --- |
| 两个主题 | `hsl(var(--primary) / 0.1)` | `hsl(var(--primary))` | **不变** |

- **没有左侧竖条**，不用彩色边框，选中只靠底色。
- 用 10% 透明度而不是实色：亮色下落在白底上是一档很淡的染层，和 hover 只差两三个
  明度点；暗色同一个公式反向工作。列表行选中也可用中性底（`bg-secondary` / `bg-accent`），
  线同样一秒都不动。

### 1.2 悬停（hover）与按下（active）

- hover：中性底换 `bg-accent`（`--accent` 与 `--muted` 同值）。**不换线、不换字色**。
- active：在 hover 基础上再深一档，
  `color-mix(in srgb, hsl(var(--accent)) 88%, hsl(var(--foreground)))`。
- `--primary` 一族的 hover / active 由按钮组件自己处理，库内一律写 `bg-primary/90`，
  不另设别名。

### 1.3 焦点（focus）

**只在外框外面加一圈，输入框里的底色和边框都不动。** 圈的定义在 `tokens.css`：

```css
/* 暗色 2px / alpha .45；亮色 3px / alpha .35 —— 以 tokens.css 现值为准 */
--focus-ring: 0 0 0 2px hsl(var(--ring) / 0.45);
```

用法一律是 `box-shadow: <该元素本来的阴影>, var(--focus-ring);`

- 用 `box-shadow` 的 spread，不用 `outline` —— `outline-offset` 在圆角上对不齐。
- **不要「染色边框 + 外圈」双层**，两层就是重影。
- **外环会被裁掉的位置**（全宽行、标签页、分段按钮、拖拽条——父级 `overflow: hidden`
  或相邻元素吃掉外环）改画内环：`inset 0 0 0 2px hsl(var(--ring) / 0.6)`，写在元素自己的
  样式里即可，`--focus-ring-inset` 这个 token 已删除。判断标准一句话：
  **外环会被裁掉就换内环，其余一律外环。** 两种环都不许用 `outline`。

### 1.4 禁用（disabled）

`opacity: .45` + `cursor: not-allowed`，不换色相、不再单独降字色
（旧 `--ink-muted` 已随 ink 阶删除）。

---

## 2. 文字

### 2.1 字号：六级

| token | 字号 | 行高 | 字重 | 用在哪 |
| --- | --- | --- | --- | --- |
| `--fs-headline` | 20px | 1.3 | 600 | 页面标题 |
| `--fs-title` | 16px | 1.4 | 600 | 区块标题、卡片标题 |
| `--fs-body` | 13px | 1.5 | 400 | 正文、列表主文字 |
| `--fs-label` | 12px | 1.45 | 500 | 控件标签、分组小标题 |
| `--fs-meta` | 11px | 1.4 | 400 | 时间、计数、次级说明 |
| `--fs-micro` | 10px | 1.3 | 500 | 徽标、角标、键帽 |

配套：`--lh-headline/-title/-body/-label/-meta/-micro`、`--fw-headline/-title/-body/-label/-meta/-micro`。
Tailwind 侧是 `text-headline` … `text-micro`（preset 连行高字重一起给）。

### 2.2 文字颜色只有两级

正文 `--foreground`，弱一档 `--muted-foreground`；承载信息的字最低到
`--muted-foreground`。旧的五级 `--ink-*` 色阶已整体删除，不要再引。

### 2.3 字体与数字

- 字族沿用 `--font-sans`（Inter 系），不引入第二套。
- **数字一律 `tabular-nums`**：时间、耗时、字节、计数。否则每次刷新都在抖。
- 等宽场景（代码、命令行、路径）用 `--font-mono`，不加 `font-weight` 变化。

---

## 3. 圆角 / 阴影 / 动效

圆角**按层级给三档**（`tokens.css`，以现值为准）：

| token | 值 | 用在哪 |
| --- | --- | --- |
| `--radius-control` | 10px | 按钮、输入框、分段片 |
| `--radius-panel` | 14px | 卡片、面板 |
| `--radius-overlay` | 14px | 弹窗、下拉面板 |
| `--radius-full` | 9999px | 徽标、开关、胶囊 |

嵌套卡的圆角收缩（14 → 10 → 8）由 `Card` 的深度上下文自动处理，**不再用
`calc(--card-radius - Npx)` 手算**（旧的 L1/L2/L3 半径阶梯已废）。

阴影**只有亮色有**（`--shadow-card` 暗色为 `none`，亮色一层极淡影）。暗底上投阴影
看不见影子，只会让边缘发脏。动效时长走 `--transition-fast` / `--transition-base`，
曲线走 `--ease-spring`。

---

## 4. Tailwind 词表（`tailwind-preset.cjs`）

`tailwind-preset.cjs` 是「token → 类名」的唯一转接头，一行字面色值都没有。库自己的
`tailwind.config.cjs` 用 `presets` 引它，消费方引同一个文件，项目里不抄第二份。

| 表 | 键 | 例子 |
| --- | --- | --- |
| `colors` | shadcn 19 名 + `success` / `warning` 两支特批状态色 | `bg-primary`、`text-success-foreground` |
| `fontSize` | 6 档，`lineHeight` / `fontWeight` 一起给 | `text-body` 一次拿到 13px / 1.5 / 400 |
| `boxShadow` | `card` `popover` 等 | `shadow-card` |

- preset **没有 `borderRadius` 表**：半径在库里只有 CSS token，`rounded-control` /
  `-panel` / `-overlay` / `-nested` 是消费方（宿主）在自己 `tailwind.config.cjs` 补的。
- **`bg-accent` 不是强调色**，它是悬停底（shadcn 语义）；强调色只有 `bg-primary`。
- **焦点环不要写 `shadow-focus`**：Tailwind 的 `shadow-*` 整体覆盖 `--tw-shadow`，
  会把卡片阴影顶掉。要「原阴影 + 焦点环」就写
  `box-shadow: var(--shadow-card), var(--focus-ring)` 或 ring 体系。
- **`fontSize` 的键名和 `colors` 的键名刻意不重叠**：`text-*` 两处同名时只命中一边，
  另一边静默失效——所以 `label` / `body` / `meta` 只做字号，不做颜色。

消费方**按包根解析**取这个文件：

```js
const { dirname, join } = require("node:path");
const rainUiRoot = dirname(require.resolve("rain-ui/package.json"));
module.exports = { presets: [require(join(rainUiRoot, "dist/tailwind-preset.cjs"))] };
```

不要写 `require("rain-ui/tailwind-preset")`：本地 `file:` 依赖下，`node_modules/rain-ui`
是安装那一刻的快照，`exports` 里新加的子路径不会同步过去，会直接报
`ERR_PACKAGE_PATH_NOT_EXPORTED`。

---

## 5. 设计原则

- **尺寸取档，不取像素。** 字号 20 / 16 / 13 / 12 / 11 / 10；控件高 32（默认）/ 28（紧凑）；
  间距 4 / 8 / 12 / 16 / 20；圆角走三档 token。新需求先问「归哪一档」。
- **层级靠墨色，不开新灰阶。** 正文 `--foreground`，弱一档 `--muted-foreground`。
- **分隔用 1px 发丝线**（`--border`），不叠「边框 + 阴影」；卡片是细描边 + 大圆角 + 无阴影。
- **数字一律等宽**（`tabular-nums`）：时间、耗时、字节、计数，否则每次刷新都在抖。
- **动效 120–200ms，位移 ≤8px，不弹跳。** 时长走 `--transition-fast` / `--transition-base`，
  曲线走 `--ease-spring`；`prefers-reduced-motion` 下停。
- **暗色是默认。** `:root` 本身就是暗色（`color-scheme: dark`），亮色是
  `html[data-theme="light"]` 覆盖。先在暗色下做到位，再去亮色里量一遍对比度。
- **宽度跟内容走。** select / combobox / 下拉 / 按钮的宽度 = 最长数据项文字宽度 + 一点预留，
  不写死像素、不 `w-full` 铺满。
- **不许用 emoji 当图标**，不许引第二套 icon 包，不许内联 `<svg>` 复制路径。图标只有 `AppIcon`。
- **注释和用户可见文案用中文**，标识符用英文；注释解释「为什么」，不复述代码。

---

## 6. 禁止事项

- 写死颜色 / 字号（`#6366f1`、`13.5px`、`rgba(0,0,0,.08)`），绕开 token。
- 焦点态同时改边框和加外环（两层 = 重影）。
- 给选中态加左侧竖条或彩色边框。选中只换底色，线不动。
- 暗色下投阴影；`backdrop-filter` 做玻璃态。
- 开第二套灰阶、第二套配色、第二个主题家族。
- **旧词表不许回潮**：`--surface-*` / `--line-*` / `--ink-*` / `--selected-*` /
  `--card-tone-*` / `--accent-strong` / `--accent-solid` / `--field-bg` / `--btn-*` /
  `--status-*` / `--bg-*` / `--text-*`（颜色义）/ `data-palette` 换色族已从
  `palettes.css` 整体删除。要什么颜色就用 shadcn 语义，不够就说明组件设计有问题，
  不是令牌不够。
- **裸三元组语义 token 别再包一层 `hsl()`**（`palettes.css` 里是 `H S% L%`，
  组件里写 `hsl(var(--x))`；写成 `hsl(hsl(...))` 是无效值，整条声明悄悄退回继承色）。
