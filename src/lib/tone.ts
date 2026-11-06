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
  /** 浅色块底：图标方块、名次方块（约 12% 主色） */
  soft: string
  /** 叠在 soft 上的文字/图标色，浅底深一档、深底浅一档 */
  ink: string
  /** 实心标记：数据点、图例圆点 */
  solid: string
  /** 给 Progress 染色（子元素是设计系统自己的 progress-indicator） */
  bar: string
  /**
   * 自发光色：给「自己画深色底」的图（星图夜空、深色画布）用的文字色。
   * 这类地方的底色不跟随主题，所以这色也不跟主题走 —— 浅色主题下也得亮。
   */
  glow: string
}

export const DATA_TONES: Record<DataTone, DataToneClasses> = {
  sky: {
    soft: "bg-sky-500/[0.12] dark:bg-sky-400/[0.16]",
    ink: "text-sky-700 dark:text-sky-300",
    solid: "bg-sky-500",
    bar: "[&>[data-slot=progress-indicator]]:bg-sky-500",
    glow: "text-sky-400",
  },
  indigo: {
    soft: "bg-indigo-500/[0.12] dark:bg-indigo-400/[0.16]",
    ink: "text-indigo-700 dark:text-indigo-300",
    solid: "bg-indigo-500",
    bar: "[&>[data-slot=progress-indicator]]:bg-indigo-500",
    glow: "text-indigo-400",
  },
  // 历史色：绿色系（emerald / teal）已经从默认色板里拿掉了，定义留着只为兼容
  // 显式传 `tone="emerald"` 的老调用点。它们不在 DATA_TONE_ORDER 里，
  // 所以哈希取色不会再落到绿色上。
  emerald: {
    soft: "bg-emerald-500/[0.12] dark:bg-emerald-400/[0.16]",
    ink: "text-emerald-700 dark:text-emerald-300",
    solid: "bg-emerald-500",
    bar: "[&>[data-slot=progress-indicator]]:bg-emerald-500",
    glow: "text-emerald-400",
  },
  amber: {
    soft: "bg-amber-500/[0.14] dark:bg-amber-400/[0.16]",
    ink: "text-amber-700 dark:text-amber-300",
    solid: "bg-amber-500",
    bar: "[&>[data-slot=progress-indicator]]:bg-amber-500",
    glow: "text-amber-400",
  },
  violet: {
    soft: "bg-violet-500/[0.12] dark:bg-violet-400/[0.16]",
    ink: "text-violet-700 dark:text-violet-300",
    solid: "bg-violet-500",
    bar: "[&>[data-slot=progress-indicator]]:bg-violet-500",
    glow: "text-violet-400",
  },
  rose: {
    soft: "bg-rose-500/[0.12] dark:bg-rose-400/[0.16]",
    ink: "text-rose-700 dark:text-rose-300",
    solid: "bg-rose-500",
    bar: "[&>[data-slot=progress-indicator]]:bg-rose-500",
    glow: "text-rose-400",
  },
  // 淡紫红（玫红）：整个 UI 的主强调色（KPI、日历、排行榜都是这一族）。
  // 它在 DATA_TONE_ORDER 里，所以工作区 / 会话 / 模型的哈希取色也会用到它。
  plum: {
    soft: "bg-pink-500/[0.12] dark:bg-pink-400/[0.16]",
    ink: "text-pink-600 dark:text-pink-300",
    solid: "bg-pink-500",
    bar: "[&>[data-slot=progress-indicator]]:bg-pink-500",
    glow: "text-pink-400",
  },
  teal: {
    soft: "bg-teal-500/[0.12] dark:bg-teal-400/[0.16]",
    ink: "text-teal-700 dark:text-teal-300",
    solid: "bg-teal-500",
    bar: "[&>[data-slot=progress-indicator]]:bg-teal-500",
    glow: "text-teal-400",
  },
  neutral: {
    soft: "bg-foreground/[0.06]",
    ink: "text-muted-foreground",
    solid: "bg-muted-foreground/60",
    bar: "",
    glow: "text-slate-300",
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
 *   sky: { ink: "text-brand-700 dark:text-brand-300", solid: "bg-brand-500" },
 * });
 * ```
 *
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
