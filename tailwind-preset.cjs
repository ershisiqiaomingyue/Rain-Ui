/**
 * rain-ui 的 Tailwind 词表：设计系统里唯一一份「令牌 → 类名」映射。
 *
 * 为什么单独一个文件：颜色 / 字号 / 圆角 / 阴影四张表要同时给两边用——库自己的
 * demo 走 `tailwind.config.cjs` 的 presets，宿主（Android-Toolkit）引
 * `rain-ui/tailwind-preset` 也是同一份。在项目里再抄一遍就必然漂，漂了就会出现
 * 「同一个 text-body 在库里 13px、在项目里 14px」这种查不出来的 bug。
 *
 * 这里只做转接头：所有值都指向 assets/styles 里的 CSS 变量，不许出现字面色值。
 * 真正定义颜色的是 palettes.css（shadcn 语义亮暗两套 + 领域调色板），这个文件一行颜色都不定义。
 *
 * 颜色只有 shadcn 那一套（bg-card / border-border / text-muted-foreground / hover:bg-accent）。
 * 本库自造的词汇表已整体删除：bg-surface-* / border-line-* / text-ink-* / bg-success-*
 * 这些类名不会再生成，用之前先看 palettes.css 里还剩什么。
 * 注意 `bg-accent` 是 shadcn 的「悬停底」，强调色是 `bg-primary`：
 * 名字像、用途完全不同，写之前想清楚要哪个。
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
      /* ── 颜色：只有 shadcn 那 19 个名字 ────────────────────────────────────
         一个都不许新增。A 基础层（surface / line / ink）、桥接层（accent-strong /
         btn-* / card-* / hover-tint / segmented-*）和状态族（success / warning /
         error / destructive-soft）已整体删除 —— 重建前不要往回加。
         bg-accent 是「悬停底」，不是强调色；强调色只有 primary。 */
      colors: {
        border: hsl("border"),
        input: hsl("input"),
        ring: hsl("ring"),
        background: hsl("background"),
        foreground: hsl("foreground"),
        primary: { DEFAULT: hsl("primary"), foreground: hsl("primary-foreground") },
        secondary: { DEFAULT: hsl("secondary"), foreground: hsl("secondary-foreground") },
        destructive: { DEFAULT: hsl("destructive"), foreground: hsl("destructive-foreground") },
        muted: { DEFAULT: hsl("muted"), foreground: hsl("muted-foreground") },
        accent: { DEFAULT: hsl("accent"), foreground: hsl("accent-foreground") },
        popover: { DEFAULT: hsl("popover"), foreground: hsl("popover-foreground") },
        card: { DEFAULT: hsl("card"), foreground: hsl("card-foreground") },
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
