/**
 * rain-ui 的 Tailwind 词表：设计系统里唯一一份「令牌 → 类名」映射。
 *
 * 为什么单独一个文件：颜色 / 字号 / 圆角 / 阴影四张表要同时给两边用——库自己的
 * demo 走 `tailwind.config.cjs` 的 presets，宿主（Android-Toolkit）引
 * `rain-ui/tailwind-preset` 也是同一份。在项目里再抄一遍就必然漂，漂了就会出现
 * 「同一个 text-body 在库里 13px、在项目里 14px」这种查不出来的 bug。
 *
 * 这里只做转接头：所有值都指向 assets/styles 里的 CSS 变量，不许出现字面色值。
 * 真正定义颜色的是 palettes.css（亮暗两套 + 桥接层），这个文件一行颜色都不定义。
 *
 * 两套命名并存，别混着用：
 *   · shadcn 语义（bg-card / border-border / text-muted-foreground）——旧代码在用，先不动。
 *   · 本库词汇（bg-surface-1 / border-line-2 / text-ink-secondary / text-title）——新代码一律用这套。
 * 注意 `bg-accent` 是 shadcn 的「悬停底」，`bg-accent-strong` 才是强调色：
 * 名字像、用途完全不同，写 hover:bg-accent 之前想清楚要哪个。
 *
 * 动效时长没有单独映射：Tailwind 自带的 duration-150 / duration-200 里的那两个数
 * 就是 --transition-fast / --transition-base 用的值，工具类直接写它们。
 *
 * 不在这里写 darkMode / content：那是各仓库自己的事（库用 class，宿主用 [data-theme="dark"]）。
 *
 * 怎么用（消费方的 tailwind.config.cjs）：
 *   const { dirname, join } = require("node:path");
 *   // 走「包根 + dist 路径」而不是 `rain-ui/tailwind-preset`：本地 file: 依赖下
 *   // node_modules/rain-ui/package.json 是安装那一刻的快照，exports 的改动不会同步，
 *   // 用子路径会直接 ERR_PACKAGE_PATH_NOT_EXPORTED。按包根解析两条路都成立。
 *   const rainUiRoot = dirname(require.resolve("rain-ui/package.json"));
 *   module.exports = { presets: [require(join(rainUiRoot, "dist/tailwind-preset.cjs"))] };
 * 从 GitHub tag 正式安装的消费方可以直接写 require("rain-ui/tailwind-preset")。
 */

/** 三元组令牌：palettes.css 里存的是 `H S% L%`，所以这里必须补上 hsl() 外壳。 */
const hsl = (name) => `hsl(var(--${name}))`;

/** 完整色值令牌：palettes.css 里存的就是 `hsl(...)` / `rgba(...)` 整串，不能再套一层 hsl()。 */
const val = (name) => `var(--${name})`;

module.exports = {
  theme: {
    extend: {
      colors: {
        /* ── shadcn 语义（对应 palettes.css 的 B 层裸三元组） ───────────────── */
        border: hsl("border"),
        input: hsl("input"),
        ring: hsl("ring"),
        background: hsl("background"),
        foreground: hsl("foreground"),
        primary: {
          DEFAULT: hsl("primary"),
          foreground: hsl("primary-foreground"),
          hover: hsl("primary-hover"),
          active: hsl("primary-active"),
        },
        secondary: {
          DEFAULT: hsl("secondary"),
          foreground: hsl("secondary-foreground"),
        },
        destructive: {
          DEFAULT: hsl("destructive"),
          foreground: hsl("destructive-foreground"),
          hover: hsl("destructive-hover"),
        },
        muted: {
          DEFAULT: hsl("muted"),
          foreground: hsl("muted-foreground"),
        },
        accent: {
          DEFAULT: hsl("accent"),
          foreground: hsl("accent-foreground"),
        },
        popover: {
          DEFAULT: hsl("popover"),
          foreground: hsl("popover-foreground"),
        },
        card: {
          DEFAULT: hsl("card"),
          foreground: hsl("card-foreground"),
        },

        /* ── 强调色三档（design.md §3） ─────────────────────────────────────
           accent-strong     图标、进度、选中文字、图表第一支
           accent-strong-soft 上面那档的浅色版，用于同色系的第二层
           accent-solid      压白字的实心填充（勾选盘、开关）；accent-strong 是 L72，
                             在暗色下压白字只有 2.2:1，不能拿来放白字。 */
        "accent-strong": hsl("accent-strong"),
        "accent-strong-soft": hsl("accent-strong-soft"),
        "accent-solid": hsl("accent-solid"),

        /* ── 状态色三件套（design.md §4） ───────────────────────────────────
           每个状态都是「图标色 / 淡底 / 淡底上的字」三个值，用法是
           `bg-success` + `text-success-foreground`。不要拿 text-success 去画
           淡底上的字——那是给图标和描边的，对比度不够（54 组对比度的表在 §4）。 */
        success: {
          DEFAULT: hsl("success"),
          bg: hsl("success-bg"),
          foreground: hsl("success-bg-foreground"),
          hover: hsl("success-hover"),
        },
        warning: {
          DEFAULT: hsl("warning"),
          bg: hsl("warning-bg"),
          foreground: hsl("warning-bg-foreground"),
          hover: hsl("warning-hover"),
        },
        "destructive-soft": {
          DEFAULT: hsl("destructive-soft"),
          bg: hsl("destructive-soft-bg"),
          foreground: hsl("destructive-soft-bg-foreground"),
          hover: hsl("destructive-soft-hover"),
        },
        error: {
          DEFAULT: hsl("error"),
          foreground: hsl("error-foreground"),
          hover: hsl("error-hover"),
        },

        /* ── 墨色五级（design.md §6.2，完整值：不带透明度修饰符） ─────────────
           承载信息的字最低到 ink-secondary；ink-tertiary / ink-muted 只放
           时间、计数、占位这类可以忽略的内容。 */
        ink: {
          high: val("ink-high"),
          primary: val("ink-primary"),
          secondary: val("ink-secondary"),
          tertiary: val("ink-tertiary"),
          muted: val("ink-muted"),
        },

        /* ── 发丝线四级（完整值） ───────────────────────────────────────────
           每层嵌套各带一条自己的线，层级越深线越淡（design.md §2）。
           border-line-1 是外层卡片线，border-line-3 是表格行间线。 */
        line: {
          1: val("line-1"),
          2: val("line-2"),
          3: val("line-3"),
          strong: val("line-strong"),
        },

        /* ── 表面层级（完整值） ─────────────────────────────────────────────
           shell 最亮（外壳）→ 0 是凹陷的工作区 → 1 是抬起来的卡片/输入框
           → hover / active 是交互底。亮色主题下这套关系整体反转，所以不要
           在代码里判断主题，只按「谁在谁上面」挑档。 */
        surface: {
          shell: val("surface-shell"),
          0: val("surface-0"),
          1: val("surface-1"),
          2: val("surface-2"),
          3: val("surface-3"),
          inset: val("surface-inset"),
          popover: val("surface-popover"),
          hover: val("surface-hover"),
          active: val("surface-active"),
        },

        /* 选中态：暗色是一层淡靛蓝洗，亮色是淡靛蓝底（完整值）。 */
        selected: {
          DEFAULT: val("selected-bg"),
          foreground: val("selected-fg"),
        },
      },

      /* ── 圆角（design.md §9.3） ────────────────────────────────────────────
         三层嵌套各减 3px / 再减 2px，不是各减一半——各减一半会让内层圆角
         和外层视觉上量不到一起。nested / nested-deep 用 --card-radius 算，
         所以改了卡片圆角，两层一起跟着走。
         lg / md / sm 是 shadcn 那套，保留给旧代码（宿主 --radius 是 10px）。 */
      borderRadius: {
        control: val("radius-control"),
        panel: val("radius-panel"),
        overlay: val("radius-overlay"),
        nested: "calc(var(--card-radius) - 3px)",
        "nested-deep": "calc(var(--card-radius) - 5px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* ── 字号（design.md §6.1） ────────────────────────────────────────────
         六级，配对的 line-height / font-weight 一起给，写 text-body 就同时
         拿到行高和字重，行距不再跟着上层容器漂。中间值（10.5 / 12.5 / 13.5）
         一个都不给，避免又长回十档。
         这些键名和 colors 里的键名没有重叠，所以 text-label 只可能是字号。 */
      fontSize: {
        headline: ["var(--fs-headline)", { lineHeight: "var(--lh-headline)", fontWeight: "var(--fw-headline)" }],
        title: ["var(--fs-title)", { lineHeight: "var(--lh-title)", fontWeight: "var(--fw-title)" }],
        body: ["var(--fs-body)", { lineHeight: "var(--lh-body)", fontWeight: "var(--fw-body)" }],
        label: ["var(--fs-label)", { lineHeight: "var(--lh-label)", fontWeight: "var(--fw-label)" }],
        meta: ["var(--fs-meta)", { lineHeight: "var(--lh-meta)", fontWeight: "var(--fw-meta)" }],
        micro: ["var(--fs-micro)", { lineHeight: "var(--lh-micro)", fontWeight: "var(--fw-micro)" }],
      },

      /* ── 阴影 ──────────────────────────────────────────────────────────────
         暗色下一律是 none：层级靠描边和表面亮度，不叠「边框 + 阴影」。
         值在 palettes.css 里分主题，所以同一句 shadow-card 暗色无阴影、
         亮色有浮起感——不要在组件里判断主题。
         焦点环不要用 shadow-focus（Tailwind 的 shadow-* 是整体覆盖 --tw-shadow，
         写 shadow-card shadow-focus 会把卡片阴影顶掉），用 ring 体系：
         `ring ring-ring/[0.22]`——Tailwind 的 ring 默认就是 3px，任意值 0.22
         和 --focus-ring 的 alpha 完全一致，而且 ring 是叠加在 shadow 之上的。 */
      boxShadow: {
        card: val("shadow-card"),
        popover: val("shadow-popover"),
        control: val("shadow-btn"),
        "control-hover": val("shadow-btn-hover"),
        "inset-highlight": val("shadow-inset-highlight"),
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};
