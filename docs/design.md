# rain-ui 设计规范

这份文档是**唯一来源**。`assets/styles/palettes.css` 是它的实现，两者数字必须一致；
改了这里就同步改那里，别让文档和代码漂开。

- 消费方：`Android-Toolkit` 及其他所有用 `rain-ui` 的界面。
- 上一版尺度规则见 `scale-rules.html`（尺寸、行高、图标），本文只管**配色、字号、层级、状态**。
- 本文取代宿主 `AGENTS.md` §2 里「靛青 `#6366F1` 一个强调色」那套描述：**`#6366F1` 已退役。**

---

## 0. 三条不可让步的前提

1. **暗色是默认，亮色是覆盖。** `:root` 写暗色，`html[data-theme="light"]` 覆盖。
   先在暗色做到位，再去亮色量一遍对比度，不许只交一套。
2. **一个界面只用一个主题家族。** 没有「换一套配色」的开关，没有 `data-palette`。
   换主题 = 换明暗，不换色相。
3. **一切值走 token。** 组件里不许出现 `#6366f1`、`13.5px`、`rgba(0,0,0,.2)` 这类数字。
   需要新值 → 在 `palettes.css` 加一个 token，不许就地硬写。

---

## 1. 色彩模型

### 1.1 只有一个色相家族

全部中性色、强调色、选中色都落在同一个靛蓝色相带（H ≈ 230–243）。
整体色相不跑：不出现第三种色相的灰。

唯一允许引入其他色相的是**状态色**（§4），且只用于表达语义，不参与装饰。

### 1.2 淡色，不是深色

强调色、危险色、成功色全部是**浅底 + 同色相深字**，不是「饱和底 + 白字」。

```
淡靛底 hsl(239 84% 94%)  +  靛字 hsl(243 68% 52%)   ← 主按钮、选中项
```

这是对 shadcn 默认语义的**刻意偏离**：shadcn 的 `--primary` 是饱和底配白字，
我们反过来。原因——淡底在同色相深字下对比度足够（≥4.5:1），而饱和底会把整屏拉成
「一块块色块」，跟这套以中性表面为主的设计打架。

**但**：`--error` 是例外，它是实心纯红配白字（§4.5）。

### 1.3 表面永远中性

表面（页面、卡片、输入框）不带任何强调色。强调只出现在**小块面积**上：
按钮、徽标、选中行、进度条、焦点环。

不做：整块主色面板、主色渐变底、彩色侧边条、彩色左边框。

### 1.4 第二套配色：只换色相

「配色可以做几套」不等于几份完整调色板。**中性骨架是共用的**，一套配色只需要换掉
`--ring` / `--primary*` / `--accent-strong*` / `--accent-solid` / `--selected-*`
这十来个**带色相**的 token（外加 `--ambient-glow` / `--blob-*` / `--inference-*`
那几处装饰），其余一律不动 —— 这正是 §1.3「表面永远中性」的直接收益。

现成第二套是玫瑰：`assets/styles/palettes.css` 末尾的
`html[data-palette="rose"]` 与 `html[data-theme="light"][data-palette="rose"]`。

写第三套时要守三条：

1. **只换色相，明度/饱和度的关系照抄**，这样层级和对比度都是已经验过的那一档；
2. 亮色块必须写**两个属性**（`html[data-theme="light"][data-palette="…"]`）——
   和亮色块选择器同级时靠源码顺序分胜负，属性多一个才稳；
3. 白字只允许落在 `--accent-solid` / `--error` / `--destructive` 上，
   所以 `--accent-solid` 的明度要卡在能过 4.5:1 的那一档（暗 48% / 亮 44%）。

自检：`?theme=…&palette=…` 出四张图（暗/亮 × 默认/新套），关键对至少量一遍
（白字 on `--accent-solid`、`--primary-foreground` on `--primary`、
`--selected-fg` on `--selected-bg`、`--accent-strong` on 卡面）。

---

## 2. 表面与层级

### 2.1 四层表面，每层都有 1px 线

层级靠**底色差 + 线**同时表达。线逐级变淡，底色按主题分别处理。

| 层 | 是什么 | 暗色底色 | 亮色底色 |
| --- | --- | --- | --- |
| `--surface-shell` | 外壳：顶栏 + 导航栏 | `hsl(232 17% 13%)` | `hsl(230 34% 99%)` |
| `--surface-0` | 工作区（凹陷） | `hsl(232 20% 7%)` | `hsl(230 30% 96%)` |
| `--surface-1` | L1：区域外沿（页面上最外那圈 card） | `hsl(232 18% 10%)` | `#ffffff` |
| `--surface-2` | L2：区内的分组 | 同 L1 | 同 L1 |
| `--surface-3` | L3：组内的条目 | 同 L1 | 同 L1 |
| `--surface-hover` | 悬停底 | `hsl(232 16% 14%)` | `hsl(230 30% 98%)` |

**关键点：L1 / L2 / L3 三层底色完全相同，只有线在变淡。**

暗色下越往内容深处越亮、亮色下三层都是纯白 —— 视觉上的「深度」全部由线承担，
所以永远不会出现「三层三个不同的灰」这种脏效果。

### 2.2 线（`--line-1/-2/-3`）

| token | 用在哪 | 暗色 | 亮色 |
| --- | --- | --- | --- |
| `--line-1` | L1 外沿、card、弹层边界 | `rgba(255,255,255,.10)` | `hsl(230 22% 90%)` |
| `--line-2` | L2 分组 | `rgba(255,255,255,.065)` | `hsl(230 22% 93%)` |
| `--line-3` | L3 条目、行间分隔 | `rgba(255,255,255,.04)` | `hsl(230 24% 95%)` |
| `--line-strong` | 需要强调的边界（极少） | `rgba(255,255,255,.16)` | `hsl(230 22% 84%)` |

暗色为什么用 `rgba(255,255,255,α)` 而不是实色灰：叠在任意底色上都会自动跟着变亮，
嵌套三层也不会算出三个不同的灰。亮色反过来用实色 —— 白底上叠白会直接消失。

### 2.3 层级堆叠规则

```
┌─ L1  card         线 line-1  ─┐
│  ┌─ L2  group     线 line-2 ─┐│
│  │  ┌─ L3 item    线 line-3 ─┐││
│  │  └───────────────────────┘││
│  └───────────────────────────┘│
└───────────────────────────────┘
```

- **每一层都带线**，但**每一层的线都比上一层淡**。这是硬规则。
- 不允许出现两层同样重的线相邻 —— 那会读成「两道栅栏」。
- 层数上限 **3 层**。第 4 层开始改用间距或折叠，不再画框。
- 选中态**只换底色，线一秒都不动**（§5.1）。选中染线是上一版被否掉的做法。

### 2.4 阴影：只有亮色有

| | 暗色 | 亮色 |
| --- | --- | --- |
| card | 无 | `0 1px 2px rgba(30,41,59,.04)` |
| 弹层 / 浮层 | 无 | `0 8px 24px -6px rgba(30,41,59,.12)` |

暗色一律不投阴影。暗底上阴影看不见，只会让边缘发脏；明度分层已经够了。

---

## 3. 强调色（primary）

淡靛。**唯一的正向强调色**，没有第二个。

| token | 暗色 | 亮色 |
| --- | --- | --- |
| `--primary` | `hsl(239 36% 22%)` | `hsl(239 84% 94%)` |
| `--primary-foreground` | `hsl(239 92% 86%)` | `hsl(243 68% 52%)` |
| `--primary-hover` | `hsl(239 38% 26%)` | `hsl(239 84% 90%)` |
| `--primary-active` | `hsl(239 40% 29%)` | `hsl(239 82% 86%)` |

交互方向记住一条：**暗色按下变亮，亮色按下变深。**

按钮只有两个正向形态，不许有第三个：

```css
/* 主按钮 */
background: var(--primary);
color: var(--primary-foreground);   /* 亮色下是靛字，不是黑字也不是白字 */

/* 次按钮（outline，默认形态） */
background: transparent;
color: var(--ink-primary);
border: 1px solid var(--line-1);
```

> 亮色主按钮上的字**不能是白色**（1.4:1，等于没有），**也不能是黑色**（读起来像禁用）。
> 必须是同色相深靛 `hsl(243 68% 52%)`。

同一个靛分三个「深度」，按用途选，不许互借：

| token | 暗色 | 亮色 | 只用在 |
| --- | --- | --- | --- |
| `--primary` | `239 36% 22%` | `239 84% 94%` | 按钮填充、`status-info` 底 |
| `--accent-strong` | `239 68% 72%` | `243 68% 52%` | 图标、进度条、选中项文字、`series-1` |
| `--accent-solid` | `239 60% 52%` | `243 68% 52%` | **上面要压白字**的地方：勾选盘、开关 |

`--accent-solid` 存在的唯一理由是白字：`--accent-strong` 在暗色是 L72，压白字只有 2.2:1。

---

## 4. 状态色

五种，各有明确职责，**不许混用**。

三支「淡底」状态（success / warning / destructive-soft）各拆成三个 token：
`--x` 是**图标和指示线**用的饱和色，`--x-bg` 是**填充底**，`--x-bg-foreground` 是**压在底上的字**。
拆开的原因：亮色下 `hsl(158 42% 56%)` 压白底只有 2.6:1，当文字是看不见的；
要当文字必须沉到 L40，但 L40 当图标又太闷。两个用途本来就该是两个值。

**文字色一律用 `-bg-foreground`，不是 `-bg`。**

| token | 语义 | 暗色（图标 / 底 / 底色上的字） | 亮色（图标 / 底 / 底色上的字） |
| --- | --- | --- | --- |
| `--success` | 通过、完成 | `158 40% 68%` / `158 32% 15%` / `158 52% 76%` | `158 46% 40%` / `158 46% 93%` / `158 58% 24%` |
| `--warning` | 待确认、注意 | `38 60% 66%` / `36 40% 16%` / `38 62% 76%` | `38 62% 44%` / `38 70% 93%` / `32 68% 26%` |
| `--destructive-soft` | 撤销、消极、可恢复 | `350 52% 70%` / `350 34% 17%` / `350 60% 78%` | `350 55% 58%` / `350 62% 96%` / `350 58% 36%` |
| `--destructive` | 不可逆删除 | `350 62% 52%`（白字） | `350 62% 48%`（白字） |
| `--error` | 报错、失败 | `0 68% 52%`（白字） | `0 66% 48%`（白字） |

规则：

- **白字只有 `--destructive` 和 `--error` 配得上。** 淡底状态一律同色相深字。
- **`--destructive` 只在「删了就没了」的动作上用**（删除会话、清空数据）。
  能撤销的用 `--destructive-soft`。
- **状态色只表语义，不做装饰。** 不许拿 `--success` 当绿色主题用。
- 每个状态色都需要配套的 `-hover`，方向同 §3（亮色向暗、暗色向亮）。

> 验收线（已用脚本量过，54 组全过）：三支淡底的「底 + 字」都对到 **≥4.5:1**，
> 图标压在卡片底上 **≥3:1**，白字压在 `--destructive` / `--error` 上 **≥4.5:1**。

---

## 5. 交互状态

### 5.1 选中（selected）

| | 底色 | 线 |
| --- | --- | --- |
| 暗色 | `hsl(239 58% 74% / .16)` | **不变** |
| 亮色 | `hsl(239 84% 94%)` | **不变** |

- **没有左侧竖条。** 不用彩色边框。选中只靠底色。
- 暗色用 16% 透明靛而不是实色深紫：实色底要跨 8 个明度点，整块跳出来像另一个弹窗；
  16% 只跨 2–3 个点，是「染上一层光」，跟 hover 的关系才连得上。

### 5.2 悬停（hover）

暗色变亮一档（`--surface-hover`），亮色变浅灰一档。**不换线、不换字色**。

### 5.3 按下（active）

在 hover 基础上再走一档：

| | hover | active |
| --- | --- | --- |
| 亮色淡靛 | L90 | L86 |
| 暗色淡靛 | L26 | L29 |
| 亮色中性 | L98 | L97 |
| 暗色中性 | L14 | L13 |

### 5.4 焦点（focus）

**只在外框外面加一圈，输入框里的底色和边框都不动。**

```css
--ring:       239 58% 74%;              /* 圈的颜色（三元组，Tailwind 用） */
--focus-ring: 0 0 0 3px hsl(var(--ring) / 0.22);   /* 圈本身，一个 box-shadow */
```

用法一律是 `box-shadow: <该元素本来的阴影>, var(--focus-ring);`

- 亮色 `--ring: 239 84% 88%`，透明度提到 `.9`（白底上 .22 根本看不见）。
- 用 `box-shadow` 的 spread，不用 `outline` —— `outline-offset` 在圆角上对不齐，圆角处会露直角。
- **不要「染色边框 + 外圈」双层**。两层就是重影。
- **例外：内环。** 全宽行、标签页、分段按钮、拖拽条这些位置，外环会被父级的
  `overflow: hidden` 或相邻元素吃掉，改用 `--focus-ring-inset`（画在元素自己的边框盒里）：

  ```css
  --focus-ring-inset: inset 0 0 0 2px hsl(var(--accent-strong) / 0.5);   /* 暗色 */
  --focus-ring-inset: inset 0 0 0 2px hsl(var(--accent-strong) / 0.6);   /* 亮色 */
  ```

  内环压在控件自己的底色上，不能用 `--ring` —— 亮色 `--ring` 是 88% 亮度，叠在淡色
  按钮上等于没有；所以内环用深一档的 `--accent-strong`。判断标准一句话：
  **外环会被裁掉就换内环，其余一律外环。** 两种环都不许用 `outline`。

> 名字为什么是两个：`--focus-ring` 在旧 `tokens.css` 里已经是**一个完整的 box-shadow**，
> 且被多处引用。把它改成颜色会静默改坏所有引用点，所以圈的颜色另起名 `--ring`
> （也正好是 shadcn 的名字），`--focus-ring` 继续当那个阴影。

### 5.5 禁用（disabled）

`opacity: .45` + `cursor: not-allowed`，不换色相。字色降到 `--ink-muted`。

---

## 6. 文字

### 6.1 字号：六级

取代旧的 5 级（20 / 16 / 13 / 12 / 11），往下补一级 10px。
补这一级的理由：徽标、角标、键帽原本散着 9 / 9.5 / 10 / 10.5px，收进来比让它们
继续在阶梯外面飘着好。更早一稿里的 32px `display` 已删除，实际没人用到那个尺寸。

| token | 字号 | 行高 | 字重 | 用在哪 |
| --- | --- | --- | --- | --- |
| `--fs-headline` | 20px | 1.3 | 600 | 页面标题 |
| `--fs-title` | 16px | 1.4 | 600 | 区块标题、卡片标题 |
| `--fs-body` | 13px | 1.5 | 400 | 正文、列表主文字 |
| `--fs-label` | 12px | 1.45 | 500 | 控件标签、分组小标题 |
| `--fs-meta` | 11px | 1.4 | 400 | 时间、计数、次级说明 |
| `--fs-micro` | 10px | 1.3 | 500 | 徽标、角标、键帽 |

配套：`--lh-headline/-title/-body/-label/-meta/-micro`、`--fw-headline/-title/-body/-label/-meta/-micro`。

> **命名变更**：旧 `typography.css` 用 `--text-display` / `--text-body` 这类名字表示**字号**，
> 而 `tokens.css` 的 `--text-primary` / `--text-secondary` 表示**颜色**，同一个
> `--text-` 前缀下两套语义是踩过的坑。字号统一改成 `--fs-*`，颜色统一改成 `--ink-*`。
> 宿主还有 6 处引用旧名，`typography.css` 里留了一小段兼容别名，第 6 步改完宿主即删。

### 6.2 文字色阶：五级

| token | 语义 | 暗色 | 亮色 |
| --- | --- | --- | --- |
| `--ink-high` | 最高：标题、关键数字 | `hsl(228 26% 97%)` | `hsl(232 32% 12%)` |
| `--ink-primary` | 主：正文 | `hsl(228 20% 90%)` | `hsl(232 26% 20%)` |
| `--ink-secondary` | 次：辅助说明 | `hsl(230 14% 68%)` | `hsl(232 16% 38%)` |
| `--ink-tertiary` | 次次：元信息、时间 | `hsl(231 12% 52%)` | `hsl(232 12% 50%)` |
| `--ink-muted` | 最低：禁用、占位 | `hsl(232 10% 40%)` | `hsl(232 10% 62%)` |

- **承载信息的字最低到 `--ink-secondary`。** `--ink-tertiary` 只给「时间 / 计数」这类
  不看也不影响理解的元信息，`--ink-muted` 只给禁用和 placeholder。
- 旧版有四个近义名字（`--text-secondary` / `--text-tertiary` / `--text-muted` /
  `--text-quaternary`），两个色相、明度只差 1–3 个点，是「灰得丑」的根因。现在只剩五级。

### 6.3 字体与数字

- 字族沿用 `--font-sans`（Inter 系），不引入第二套。
- **数字一律 `tabular-nums`**：时间、耗时、字节、计数。否则每次刷新都在抖。
- 等宽场景（代码、命令行、路径）用 `--font-mono`，不加 `font-weight` 变化。

---

## 7. 组件清单：换 / 不换

### 7.1 换（用本文的 token 重做配色）

按 §3–§6 全部替换，交互态（hover / active / focus / selected / disabled）都要给到。

| 组件 | 说明 |
| --- | --- |
| `Button` | primary 淡靛填 + outline 中性描边，只有这两个正向形态 |
| `Badge` / tag | 淡底 + 同色相深字 |
| `Card` | §2 三层线，无阴影（暗色） |
| `Alert` / notice | 淡底 + 左侧无竖条，用 `--error` / `--warning` / `--success` 的软版本 |
| `Table` | 行 hover / 选中走 §5，行间 `--line-3` |
| `Item` / list-item | hover / selected 走 §5 |
| `Dialog` / `Modal` | 边框 `--line-1`，亮色加浮层阴影 |
| `Tooltip` | 中性反转，不用强调色 |
| `Progress` | 轨道 `--surface-inset`（凹槽，不用 `--line-*`，线色是给 1px 发丝线的），填充 `--accent-strong` |
| `DropdownMenu` / `ContextMenu` | 选中项走 §5.1 |
| `Sidebar` 导航项 | 选中走 §5.1，无左侧竖条 |
| `Toast`（sonner） | 按状态色映射 |
| `Separator` / `Divider` | 统一 `--line-3` |
| `Checkbox` / `RadioGroup` / `Slider` | 勾选态用 `--primary`，轨道用 `--line-3` |
| `Skeleton` | `--surface-hover` |

### 7.2 不换（保持现状，这批先不动）

| 组件 | 原因 |
| --- | --- |
| `Input` | 中性控件，现有边框/底色已经对，换色只会引入新变量 |
| `InputGroup` | 同上，且它是 Input 的组合 |
| `Textarea` | 同上 |
| `Label` | 只是文字，走 `--ink-*` 就够了，不需要单独的配色层 |
| `Select` | 触发器与面板都是中性，现有值可用 |
| `Combobox` | 同上 |
| `Toggle` / `Switch` | 开关只有开/关两态，现有 `--control-checked-bg` 换个值即可，结构不动 |
| `Tabs`（rain-ui `tabs`） | 没提；保持现状 |
| `Menubar` | 保持现状 |
| `Spinner` | 单色转圈，跟 `--ink-tertiary` 走 |
| `AppIcon` | 图标本身不配色，颜色由父级 `currentColor` 决定 |

> 这批「不换」是**暂缓**，不是永远不改。等 §7.1 那批落地、亮暗两套都验过之后，
> 再单独一轮处理。理由很简单：一次改太多，出问题分不清是哪一层引起的。

### 7.3 判定新组件归哪边（沿用宿主 AGENTS.md §1.2）

满足任意一条就进 `rain-ui`，否则留在项目里：

1. 两个以上界面/视图要用；
2. 属于设计系统语义（一出现就代表某种含义）；
3. 只是基础组件的组合，且不沾业务 store、不调 Tauri。

---

## 8. 设计原则（照抄宿主 `AGENTS.md` §2，改的只有强调色那条）

> 以下原文来自 `Android-Toolkit/AGENTS.md`。已作废的是「靛青 `#6366F1` 一个强调色」，
> 其余仍然有效，改代码时按这份执行。

- **尺寸取档，不取像素。** 字号 20 / 16 / 13 / 12 / 11；控件高 32（默认）/ 28（紧凑）；
  间距 4 / 8 / 12 / 16 / 20；圆角走 token（控件 10、卡片 18、胶囊 9999）。新需求先问「归哪一档」。
- **层级靠墨色，不开新灰阶。** 正文 `--ink-primary`，弱一档 `--ink-secondary`，
  时间/计数这类元信息用 `--ink-tertiary`；承载信息的字最低到 secondary。
- **分隔用 1px 发丝线**（`--line-*`），不叠「边框 + 阴影」；卡片是细描边 + 大圆角 + 无阴影。
- **状态色只表语义。** success / warning / danger 三支不参与装饰；错在哪写在 meta 里，修的动作做成按钮。
- **数字一律等宽**（`tabular-nums`）：时间、耗时、字节、计数，否则每次刷新都在抖。
- **动效 120–200ms，位移 ≤8px，不弹跳。** 时长走 `--transition-fast` / `--transition-base`，
  曲线走 `--ease-spring`；`prefers-reduced-motion` 下停。
- **暗色是默认。** `:root` 本身就是暗色（`color-scheme: dark`），亮色是
  `html[data-theme="light"]` 覆盖。所以先在暗色下做到位，再去亮色里量一遍对比度，别只交一套。
- **宽度跟内容走。** select / combobox / 下拉 / 按钮的宽度 = 最长数据项文字宽度 + 一点预留，
  不写死像素、不 `w-full` 铺满。
- **不许用 emoji 当图标**，不许引第二套 icon 包，不许内联 `<svg>` 复制路径。图标只有 `AppIcon`。
- **注释和用户可见文案用中文**，标识符用英文；注释解释「为什么」，不复述代码。

---

## 9. Token 总表

唯一实现是 `assets/styles/palettes.css`，本节只是它的目录 + 命名约定。
**改配色只改那一个文件。**

### 9.1 写法约定：三元组 vs 完整色值

shadcn 的语义 token 全部写成**裸三元组**（`239 36% 22%`，不带 `hsl()` 外壳），
因为 `tailwind.config.cjs` 里的映射是 `hsl(var(--primary))`。
写成 `hsl(239 36% 22%)` 会让它变成 `hsl(hsl(239 36% 22%))`，整条链直接失效。

| 层 | 写法 | 例子 | 谁在用 |
| --- | --- | --- | --- |
| A 基础层 | 完整色值 | `--surface-1: hsl(232 18% 10%)` | 手写 CSS、`palettes.css` 内部 |
| B 语义层（shadcn） | 裸三元组 | `--primary: 239 36% 22%` | Tailwind `hsl(var(--x))` |
| C 桥接层 | 派生值 | `--bg-canvas: hsl(var(--background))` | 旧 token 名，兼容期用 |

手写 CSS 引用语义层时**必须补 `hsl()`**：`hsl(var(--primary))`。
要带透明度写 `hsl(var(--ring) / 0.22)`。

```css
/* ── A 基础层 ─────────────────────────────────────────────────────── */
--surface-shell   /* 外壳：顶栏 + 侧栏，全屏最亮一层 */
--surface-0       /* 凹陷工作区（= --background） */
--surface-1       /* 卡片 / 输入框抬起一层。L1/L2/L3 同值，深度靠线不靠底色 */
--surface-2 --surface-3
--surface-hover --surface-active
--surface-inset   /* 凹槽：输入框、表头、分段轨道 */
--surface-popover
--card-tone-muted --card-tone-subtle --card-tone-deep  /* 卡片四级色调，另一套语义 */
--line-1 --line-2 --line-3 --line-strong
--ink-high --ink-primary --ink-secondary --ink-tertiary --ink-muted

/* ── B 语义层（三元组） ───────────────────────────────────────────── */
/* 表面 */
--background --foreground
--card --card-foreground
--popover --popover-foreground
--muted --muted-foreground
--accent --accent-foreground          /* 悬停底，中性，不是强调色 */
--secondary --secondary-foreground
--border --input --ring

/* 强调 */
--primary --primary-foreground         /* 淡靛填 + 同色相深字 */
--primary-hover --primary-active
--accent-strong                        /* 图形强调：图标/进度/选中底上的字 */
--accent-strong-soft
--accent-solid                         /* 实心强调：上面要压白字的地方 */

/* 状态：三支淡底各三件套 + 两支实心 */
--success --success-bg --success-bg-foreground --success-hover
--warning --warning-bg --warning-bg-foreground --warning-hover
--destructive-soft --destructive-soft-bg --destructive-soft-bg-foreground --destructive-soft-hover
--destructive --destructive-foreground --destructive-hover
--error --error-foreground --error-hover

/* ── C 扩展（完整色值） ───────────────────────────────────────────── */
--selected-bg --selected-fg            /* 选中只换底，线不动 */
--focus-ring --focus-glow              /* 完整 box-shadow，不是颜色 */
--shadow-card --shadow-popover --shadow-btn --shadow-btn-hover --shadow-inset-highlight
--segmented-active-bg --segmented-active-hover-bg
--ambient-glow --blob-1..4
--inference-fill --inference-fill-deep --inference-fill-highlight
--inference-fill-warm --inference-spark --inference-spark-warm
--inference-track --inference-accent --inference-thumb
```

C 段里还有一大批 `--btn-*` / `--status-*` / `--bg-*` / `--card-*` / `--text-*` / `--divider-*`
的名字，它们**只存在于桥接层**，指向上面这些新 token。
新代码不许再用它们；等所有组件重构完，桥接层整段删除，见 §11 第 7 步。

### 9.2 字号

```css
--fs-headline --fs-title --fs-body --fs-label --fs-meta --fs-micro
--lh-*       （同上六级）
--fw-*       （同上六级）
```

### 9.3 圆角 / 阴影 / 动效

圆角**按层级给三档**，不是全局一个值：

| 层级 | token | 值 | 说明 |
| --- | --- | --- | --- |
| L1 卡片 | `--card-radius` = `--radius-panel` | **11px** | 宿主原来的 `18px` 作废 |
| L2 卡片内嵌卡片 | 同上减一档 | **8px** | `calc(var(--card-radius) - 3px)` |
| L3 内嵌的内嵌 | 再减一档 | **6px** | `calc(var(--card-radius) - 5px)` |
| 控件 | `--radius-control` | 7px | 按钮、输入框、分段片 |
| 浮层 | `--radius-overlay` | 14px | 弹窗、下拉面板 |
| 胶囊 | `--radius-full` | 9999px | 徽标、开关 |

三层各减 3px / 再减 2px，不是各减一半：同心圆角要保证「内圆角 = 外圆角 − 层间距」，
减一半会让内层看起来比外层更方。

```css
--transition-fast / --transition-base
--ease-spring
```

阴影**只有亮色有**（`--shadow-card` / `--shadow-popover` / `--shadow-btn` 暗色全为
`0 0 0 0 transparent`）。暗底上投阴影看不见影子，只会让边缘发脏。
`--shadow-inset-highlight` 是给亮色按钮加的那道 1px 上高光，暗色同样清空。

---

## 10. 禁止事项

- 写死颜色 / 字号（`#6366f1`、`13.5px`、`rgba(0,0,0,.08)`），绕开 token。
- 用 `--primary`（靛）以外的颜色做正向强调。
- 给选中态加左侧竖条或彩色边框。选中只换底色。
- 焦点态同时改边框和加外环（两层 = 重影）。
- **拿「淡色表面」token 当填充。** `--primary` / `--card` / `--muted` 在亮色主题下都是
  90%+ 明度的淡色 —— 那是按钮和卡片的**底**，铺在同样淡的轨道上会整条看不见。
  实拍踩过两次：推理滑块的填充（`hsl(var(--primary))` 铺在 L97% 轨道上）和一整排
  关闭态的开关/勾选框。**填充、进度、指示点要用强的那一档**：`--accent-strong`
  （图标、进度、选中文字）或 `--accent-solid`（压白字的实心）；控件关态的轨道本身没有
  描边，用 `--line-strong`（暗色 = 16% 白 ≈ 迁移前的 `rgba(255,255,255,0.14)`）。
- 相邻两层用同样重的线。
- 淡色底上放纯黑字（像禁用）或纯白字（对比度 1.4:1）。
- 暗色下投阴影。
- `backdrop-filter` 做玻璃态。这套设计是纯色平面，不是毛玻璃。
- 开第二套灰阶、第二套配色、第二个主题家族。
- **在桥接层里写死色值。** 桥接层只能用 `var()` / `hsl(var(--x))`。它排在亮色块之后，
  夹一个深色字面值进去，亮色主题会被它一起盖掉。
- **把整值 token 再包一层 `hsl()`。** `--ink-*` / `--line-*` / `--surface-*` / `--selected-*`
  本身就是 `hsl(...)` 全值，再写成 `hsl(var(--ink-secondary))` 就是 `hsl(hsl(...))`。那是
  **无效值**：不报错，但所有用到它的声明在计算期整条失效、悄悄退回继承色 —— 最难查的一种坏。
  只有三胞胎（§9.1）才包 `hsl()`；要透明度用
  `color-mix(in srgb, var(--ink-muted) 45%, transparent)`，别写 `hsl(var(--ink-muted) / .45)`。

---

## 11. 落地顺序

一次一层，每层独立可验证，别一口气全铺。

1. ✅ **`palettes.css`** —— 新建，实现 §9 全部 token，`index.css` 里 `@import` 进来
   （必须排在 `tokens.css` **之后**，否则压不住它的旧值）。
2. ✅ **`typography.css`** —— 五级改六级，`--text-*`（字号）改名 `--fs-*`，同步改所有引用点。
3. ✅ **Tailwind 词表** —— 新建 `tailwind-preset.cjs`，把 §9 的 token 映射成类名；
   库的 `tailwind.config.cjs` 与消费方引同一个文件，见 §11.2。
4. ✅ **`Card` / `Button` / `Badge`** —— 三个最常用的，已落这一批（Badge 本来就合规，
   只改了 Card / Button）；同时把全库的焦点环统一成 `box-shadow`（§5.4），暗亮两套各过一遍。
5. ✅ **其余 §7.1 组件** —— 已收口：输入族聚焦只留环（底色/边框不再跟着变）、开关与勾选框的
   关态轨道可见（见 §10 那条）、代码 diff / 任务步骤 / 启动光环 / 星图 / 嵌套表格线 / 弹层阴影
   全部改走 §9 token；全库 CSS 现在 0 处写死颜色（只剩 `border-glow` 的 mask 渐变和两处
   `rgb(from var(--popover-bg) …)`，那是有意的）。`--card-tone-*` **保留**：它不是死 token，
   而是 `Card` 组件的 `tone` 属性（`surface` / `muted` / `subtle` / `deep`）。
6. ✅ **宿主 `rain.css` / `tokens.css`** —— 宿主不再抄一份：`rain.css` 只剩 `@tailwind` 三条指令、
   `border-border` 基线、tooltip 与强调按钮三处补丁、`inline-spin`；`tokens.css` 每条都是派生
   （`var(--库 token)` / `color-mix`）或本产品独有的族（字体、输入族、输入坞、终端调色板、
   代码高亮）。`tailwind.config.cjs` 只挂 `presets: [库的 dist/tailwind-preset.cjs]`，
   颜色/字号/圆角/阴影不再有第二份定义。`--accent-primary: #6366f1` 及其派生全部退役。
   两个坑记一下：宿主 `tokens.css` 同时是 `tests/terminalTheme.test.mts` 的**测试夹具**
   （用正则抓文本），删声明前要 `grep tests/`；那条「面和画布不能同色」已改成读终端页自己
   那份 token。另外 `prepare-rain-ui.mjs` 注入的 `node_modules/rain-ui/package.json` 是安装时
   的快照，`exports` 里新加的 `./tailwind-preset` 它看不见，所以 preset 要按「包根 + dist/…」解析。
7. **删桥接层（下一步，未做）** —— 宿主 CSS 里仍有大量 `--bg-*` / `--text-*` / `--btn-*` /
   `--status-*` 的读取点，`palettes.css` 那段映射还是它们的唯一来源，因此**不能整段删**。
   正确顺序：先把宿主 CSS 的读取点逐个换成 §9.1 的 A/B/C 名字（或 Tailwind 类），再删映射，
   最后清 `tokens.css` 里被掏空的旧声明。
   已知两处尾巴：`Android-Toolkit/src/views/Chat/styles/conversation-base.css` 还有 199 处写死的
   石板灰/宝蓝（旧主题残留，部分已被 `conversation-workspace.css` 覆盖，要按规则换成
   `--ink-*` / `--accent-strong`，且必须对着 Chat 视图逐个核）；终端页的
   `terminal-tokens.css` 是生成物、对上游的 parity 契约，故意不跟本产品换色。
   这一步做完，`palettes.css` 里就只剩一份真相。

每步都要在暗亮两套主题下各截图确认一次，再进下一步。

### 11.2 Tailwind 词表（`tailwind-preset.cjs`）

§9 的 token 要在 JSX 里直接可用，就得有一份「token → 类名」的映射。这份映射**只有一个
文件**：`tailwind-preset.cjs`。它只做转接头，一行字面色值都没有——真正定义颜色的是
`palettes.css`。库自己的 `tailwind.config.cjs` 用 `presets` 引它，消费方引同一个文件，
项目里不再抄第二份（抄了就会漂：同一个 `text-body` 在库里 13px、在项目里 14px，查不出来）。

| 表 | 键 | 例子 |
| --- | --- | --- |
| `colors`（裸三元组） | shadcn 那套 + `accent-strong` / `-strong-soft` / `-solid` + 四组状态色 + `-hover` / `-active` | `bg-primary`、`text-success-foreground` |
| `colors`（完整色值） | `ink.*`、`line.*`、`surface.*`、`selected.*` | `text-ink-secondary`、`border-line-2`、`bg-surface-1` |
| `fontSize` | 6 档，`lineHeight` / `fontWeight` 一起给 | `text-body` 一次拿到 13px / 1.5 / 400 |
| `borderRadius` | `control` `panel` `overlay` `nested` `nested-deep` | `rounded-panel` = 11px |
| `boxShadow` | `card` `popover` `control` `control-hover` `inset-highlight` | `shadow-card` |

三个容易踩的点：

- **`bg-accent` 不是强调色。** 它是 shadcn 的「悬停底」（`--accent`）。强调色是
  `accent-strong`（图标、进度、选中文字）和 `accent-solid`（压白字的实心填充），见 §3。
- **焦点环不要写 `shadow-focus`。** Tailwind 的 `shadow-*` 是整体覆盖 `--tw-shadow`，
  `shadow-card shadow-focus` 会把卡片阴影顶掉，而设计规则是「原阴影 **+** 焦点环」。
  用 ring 体系：`ring ring-ring/[0.22]`。ring 默认就是 3px，`[0.22]` 与
  `--focus-ring` 的 alpha 完全一致，且 ring 是叠在 shadow 之上的（已实测产物）。
- **`fontSize` 的键名和 `colors` 的键名刻意不重叠。** `text-*` 在两处同名时只会命中
  其中一边，另一边静默失效——所以 `label` / `body` / `meta` 只做字号，不做颜色。

消费方**按包根解析**取这个文件：

```js
const { dirname, join } = require("node:path");
const rainUiRoot = dirname(require.resolve("rain-ui/package.json"));
module.exports = { presets: [require(join(rainUiRoot, "dist/tailwind-preset.cjs"))] };
```

不要写 `require("rain-ui/tailwind-preset")`：本地 `file:` 依赖下，`node_modules/rain-ui`
是按 `files` 字段拷出来的副本，`package.json` 是安装那一刻的快照，`exports` 里新加的
子路径不会同步过去，会直接报 `ERR_PACKAGE_PATH_NOT_EXPORTED`。按包根解析则两种安装
方式都成立。`exports` 里那句 `"./tailwind-preset"` 留着，给从 tag 正式安装的消费方用。

### 11.1 对比度自检脚本

配色不是靠眼睛定的。`rainui-contrast.py`（临时脚本，逻辑在 §4 末尾的验收线）
解析 `palettes.css`，把所有「前景压背景」的组合算一遍 WCAG 比值，不达标就退出码 1。
当前 54 组在暗亮两套下全过。**改配色后必须重跑**，尤其是动了 `--ink-*` 或状态色。

还有一道「计算值」闸：把 `palettes.css` 里每个名字的 computed value 打出来，检查
① 两套主题下都非空、② 没有 `hsl(hsl(`、③ 没有残留没解析的 `var(`。做法是在页面里
`getComputedStyle(document.documentElement).getPropertyValue(name)` 逐条读，再用
`msedge --headless=new --dump-dom` 把结果取回来。这套东西抓到过对比度脚本抓不到的坏：
桥接层 27 处「整值 token 又被包了一层 `hsl()`」，表面上不报错，实际让
`--text-secondary` / `--sidebar-bg` / `--tooltip-bg` / `--badge-text` / `--scrollbar-thumb`
全部悄悄退回继承色 —— 对比度脚本只算声明里的字面值，算不出计算期失效。

