/**
 * 数据可视化用的分类色接口（tone）。
 *
 * 为什么单独抽一层：统计面板（KPI、排行、表格）要求「同一个工作区 / 模型 / 供应商
 * 在任何列表、任何页面都是同一种颜色」，但颜色本身不该散落到消费方代码里。
 * 这里只做两件事：
 *   1. 把「色名 → 一组语义 class」集中定义在 DATA_TONES；
 *   2. 用稳定哈希把任意 key 映射到色名（dataToneFor），保证跨组件同色。
 *
 * 消费方（Android-Toolkit、demo、后续应用）拿到的是 `tone` / `seed` 两个入参：
 * 想统一改配色（换品牌色、调暗色调、换成更灰的色板）只改 DATA_TONES 一处；
 * 只想覆盖某一个点就传 `className`（组件内部用 tailwind-merge 合并，后者优先）。
 *
 * ── 一个原则：色名是「档位」，不是色相 ──────────────────────────────────────
 * 设计系统只有一套强调色（--primary）＋中性（muted / foreground）＋危险（--destructive），
 * 换配色只该换 token。所以这里一个色相值都不能出现：sky / indigo / violet / plum
 * 是同一支强调色的四档浓度，amber 是「需要看一眼」的高对比中性档，rose 是危险档。
 * 六个名字必须留着——宿主的 Store / KPI 已经在用 `tone="plum"` 这类写法，改名就是
 * 改公开 API。档位差别体现在浓度（soft 底、solid 点、bar 进度）而不是色相：
 * 强调 8% → 12% → 16% → 20%，实心 40% → 60% → 80% → 100%。
 * 副作用：一张表里两行不再是「红对蓝」，而是「深对浅」。要分类，用文字 / 图标 / Badge（dot），
 * 不要指望颜色（只有一支强调色的前提下，颜色本来就不该承担分类职责）。
 *
 * 注意：这里必须是字面量 class 字符串。Tailwind 只扫描得到写死的类名，
 * 用模板串拼出来的 `bg-${hue}-500` 一定不会出现在产物里。
 */

export type DataTone =
  | "sky"
  | "indigo"
  | "violet"
  | "plum"
  | "rose"
  | "amber"
  | "emerald"
  | "teal"
  | "neutral"

export interface DataToneClasses {
  /** 浅色块底：图标方块、名次方块（一支强调色的低浓度） */
  soft: string
  /** 叠在 soft 上的文字/图标色，浅底深一档、深底浅一档 */
  ink: string
  /** 实心标记：数据点、图例圆点 */
  solid: string
  /** 给 Progress 染色（子元素是设计系统自己的 progress-indicator） */
  bar: string
  /**
   * 自发光色：给「自己画深色底」的图（星图夜空、深色画布）用的文字色。
   * 这类地方底色不跟随主题，所以这里挑的是两主题下都能在深底上读到的组合：
   * 亮色主题给中性灰（--primary 在亮色下是深蓝，落在深底上等于消失），
   * 暗色主题给强调色。星图因此在两个主题下都是单色，簇与簇靠位置和亮度区分。
   */
  glow: string
}

/** 深色画布（星图夜空）上的自发光色：两主题都可读的那一支。 */
const GLOW = "text-muted-foreground dark:text-primary"

// 四档浓度必须逐条写全：bar / solid 里的 opacity 修饰符没法用模板串拼
// （Tailwind 只认源码里看得见的完整类名，拼出来的 class 一定不生成）。
export const DATA_TONES: Record<DataTone, DataToneClasses> = {
  sky: {
    soft: "bg-primary/[0.08]",
    ink: "text-muted-foreground",
    solid: "bg-primary/40",
    bar: "[&>[data-slot=progress-indicator]]:bg-primary/40",
    glow: GLOW,
  },
  indigo: {
    soft: "bg-primary/[0.12]",
    ink: "text-primary",
    solid: "bg-primary/60",
    bar: "[&>[data-slot=progress-indicator]]:bg-primary/60",
    glow: GLOW,
  },
  violet: {
    soft: "bg-primary/[0.16]",
    ink: "text-primary",
    solid: "bg-primary/80",
    bar: "[&>[data-slot=progress-indicator]]:bg-primary/80",
    glow: GLOW,
  },
  // 淡紫红（玫红）：原来是整个 UI 的主强调色（KPI、日历、排行榜都是这一族），
  // 现在它就是强调色的最浓一档，`tone="plum"` 的调用点不用改。
  plum: {
    soft: "bg-primary/[0.20]",
    ink: "text-primary",
    solid: "bg-primary",
    bar: "[&>[data-slot=progress-indicator]]:bg-primary",
    glow: GLOW,
  },
  // 琥珀 = 「需要看一眼」档。暖色不在语义层里，用最亮的中性色（foreground）表达，
  // 至少比 neutral 抢眼一档，但不再有「黄」。
  amber: {
    soft: "bg-foreground/[0.10]",
    ink: "text-foreground",
    solid: "bg-foreground/70",
    bar: "[&>[data-slot=progress-indicator]]:bg-foreground/70",
    glow: GLOW,
  },
  // 危险 / 失败。实心红只给「不可逆」用，这里是数据点与进度条，不是按钮。
  // ink 是`--destructive-ink`而不是 `--destructive`：后者明度 30.6%，压在 12% 淡红上只有 2:1。
  rose: {
    soft: "bg-destructive/[0.12]",
    ink: "text-[color:var(--destructive-ink)]",
    solid: "bg-destructive",
    bar: "[&>[data-slot=progress-indicator]]:bg-destructive",
    glow: GLOW,
  },
  // 历史色：绿色系（emerald / teal）已经从默认色板里拿掉了，定义留着只为兼容
  // 显式传 `tone="emerald"` 的老调用点。它们不在 DATA_TONE_ORDER 里，
  // 所以哈希取色不会再落到绿色上；现在它们也不会再是绿色。
  emerald: {
    soft: "bg-primary/[0.12]",
    ink: "text-primary",
    solid: "bg-primary/60",
    bar: "[&>[data-slot=progress-indicator]]:bg-primary/60",
    glow: GLOW,
  },
  teal: {
    soft: "bg-muted-foreground/[0.14]",
    ink: "text-muted-foreground",
    solid: "bg-muted-foreground/80",
    bar: "[&>[data-slot=progress-indicator]]:bg-muted-foreground/80",
    glow: GLOW,
  },
  neutral: {
    soft: "bg-foreground/[0.06]",
    ink: "text-muted-foreground",
    solid: "bg-muted-foreground/60",
    bar: "",
    glow: GLOW,
  },
}

/** 哈希取色的固定顺序（不含 neutral：无色不参与轮转）。绿色系已移出，见上面的历史色说明。 */
export const DATA_TONE_ORDER: readonly DataTone[] = ["sky", "indigo", "violet", "plum", "rose", "amber"]

/**
 * 稳定哈希：同一个 key 在任何列表、任何会话、任何进程里都落到同一个色。
 * 不用 Math.random / 索引取色 —— 否则同一工作区在两张表里会变色。
 */
export function dataToneFor(seed: string | null | undefined): DataTone {
  const text = (seed ?? "").trim()
  if (!text) return DATA_TONE_ORDER[0]
  let hash = 0
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) % 1_000_003
  }
  return DATA_TONE_ORDER[hash % DATA_TONE_ORDER.length] ?? DATA_TONE_ORDER[0]
}

/** 组件内部用：显式 tone 优先，否则按 seed 取色，兜底第一个色。 */
export function dataToneClasses(tone?: DataTone, seed?: string | null): DataToneClasses {
  const resolved = tone ?? (seed === undefined ? DATA_TONE_ORDER[0] : dataToneFor(seed))
  return DATA_TONES[resolved] ?? DATA_TONES[DATA_TONE_ORDER[0]]
}

/**
 * 宿主应用全局改配色：传哪几个就覆盖哪几个，之后渲染的组件立刻用新色。
 *
 * 这是给消费方的「配色接口」——不想改组件库源码、也不想每个调用点传 className 时，
 * 在应用启动时跑一次即可：
 *
 * ```ts
 * registerDataTones({
 *   sky: { ink: "text-muted-foreground", solid: "bg-primary/40" },
 * });
 * ```
 *
 * 覆盖值同样只能用语义 token（换色请改 --primary，不要在这里塞色板类名）。
 * 注意：`DATA_TONES` 是模块内单例，覆盖对整棵组件树生效；
 * 单点覆盖仍然用组件的 `className`（内部 tailwind-merge，后者优先）。
 */
export function registerDataTones(
  overrides: Partial<Record<DataTone, Partial<DataToneClasses>>>,
): void {
  for (const [name, patch] of Object.entries(overrides)) {
    const key = name as DataTone
    const current = DATA_TONES[key]
    if (!current || !patch) continue
    DATA_TONES[key] = { ...current, ...patch }
  }
}
