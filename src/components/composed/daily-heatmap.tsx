"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { dataToneClasses, type DataTone } from "../../lib/tone"

export interface HeatmapDay {
  /** `YYYY-MM-DD`（本地日期）：用于排布、月份分组与提示 */
  date: string
  /** 当天数值；0 表示这天没有记录（画成空格子，不是浅色格子） */
  value: number
  /** 自定义提示文案，省略时为「日期 · 数值」 */
  label?: string
}

export interface DailyHeatmapProps {
  /** 连续的日期序列（旧 → 新）。缺口由调用方补 0，组件不猜时间范围 */
  days: HeatmapDay[]
  /** 配色：色相只决定方块的颜色倾向，深浅由数值分档 */
  tone?: DataTone
  size?: "sm" | "md" | "lg"
  /**
   * 排布方式：
   * - `strip`（默认）：一整条按周分列，适合「最近 N 天」；
   * - `months`：按月分块（每块自己从周一对齐），格子能给得更大，但月份之间断开。
   */
  layout?: "strip" | "months"
  /**
   * 让 `strip` 铺满容器宽度：列宽均分、格子按正方形自适应（上限 20px）。
   * 整年 53 列连成一条时靠它把格子撑到「宽度允许的最大值」，而不用横向滚动。
   */
  fluid?: boolean
  /** 右下角「少 → 多」图例 */
  showLegend?: boolean
  /** 顶部月份标签（仅 `strip`；`months` 每块自带月份标题） */
  showMonths?: boolean
  /** 提示里的数值格式化，默认 toLocaleString */
  formatValue?: (value: number) => string
  /** 单位后缀，例如 `token` */
  unit?: string
  /** 给了就把格子变成可点击按钮 */
  onSelect?: (day: HeatmapDay) => void
  className?: string
}

const CELL_SIZE: Record<NonNullable<DailyHeatmapProps["size"]>, string> = {
  sm: "size-[11px]",
  md: "size-[14px]",
  lg: "size-[18px]",
}

/** 格子间距跟尺寸一起长，不然放大后挤在一起像一块实心板。 */
const CELL_GAP: Record<NonNullable<DailyHeatmapProps["size"]>, string> = {
  sm: "gap-[3px]",
  md: "gap-[3px]",
  lg: "gap-[4px]",
}

const CELL_ROUND: Record<NonNullable<DailyHeatmapProps["size"]>, string> = {
  sm: "rounded-[2px]",
  md: "rounded-[2px]",
  lg: "rounded-[3px]",
}

/** 六档：0 = 空白（当天没有记录），1–5 = 由浅到深。字面量，Tailwind 才扫得到。 */
const LEVEL_TONE = ["", "opacity-[0.16]", "opacity-[0.34]", "opacity-[0.56]", "opacity-[0.78]", "opacity-100"] as const
/** 空白格不用色相：灰底，避免和「有数据但很小」混淆。 */
const LEVEL_EMPTY = "bg-muted-foreground/[0.13]"

const WEEKDAY_LABELS = ["一", "二", "三", "四", "五", "六", "日"]
const MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

/** `YYYY-MM-DD` → 周一为 0 的列内行号。 */
const weekdayIndex = (date: string): number => {
  const [year, month, day] = date.split("-").map((part) => Number(part))
  if (!year || !month || !day) return 0
  return (new Date(year, month - 1, day).getDay() + 6) % 7
}

const monthOf = (date: string): number => Number(date.split("-")[1] ?? "0")

/**
 * 按分位数把数值分到 1–5 档。
 *
 * 不用「value / max」线性分档：token 用量差一两个数量级是常态，线性分档会让
 * 除了峰值那天以外的格子全落在第 1 档，整张图看起来「没数据」。
 */
function buildThresholds(values: number[]): number[] {
  const sorted = values.filter((value) => value > 0).sort((left, right) => left - right)
  if (sorted.length === 0) return [0, 0, 0, 0]
  return [0.2, 0.4, 0.6, 0.8].map((ratio) => sorted[Math.floor(ratio * (sorted.length - 1))])
}

function levelOf(value: number, thresholds: number[]): number {
  if (value <= 0) return 0
  let level = 1
  for (const threshold of thresholds) {
    if (value > threshold) level += 1
  }
  return Math.min(level, 5)
}

/**
 * 日历热力图：一天一个小方块。
 *
 * 两种排布：`strip` 是一整条（列 = 周，行 = 周一…周日），适合「最近 N 天」；
 * `months` 按月份切块（每块 7 列），适合整年日历——同样宽度下格子能大一圈。
 * 组件只负责排版和分档，时间窗口、补零、日期格式都由调用方决定；
 * 颜色走 tone 接口，深浅靠 opacity，所以换 hue 只需要换 `tone`。
 */
export function DailyHeatmap({
  days,
  tone,
  size = "sm",
  layout = "strip",
  fluid = false,
  showLegend = true,
  showMonths = true,
  formatValue,
  unit,
  onSelect,
  className,
}: DailyHeatmapProps) {
  const palette = dataToneClasses(tone)
  const cellSize = CELL_SIZE[size]
  const cellGap = CELL_GAP[size]
  const cellRound = CELL_ROUND[size]
  const printer = formatValue ?? ((value: number) => value.toLocaleString("zh-CN"))
  const thresholds = React.useMemo(() => buildThresholds(days.map((day) => day.value)), [days])

  // fluid 只对整条排布生效：格子边长跟着列宽走（正方形），所以只用 w-full + aspect-square。
  const fluidStrip = fluid && layout === "strip"
  const baseCell = fluidStrip
    ? cn("block aspect-square w-full", cellRound)
    : cn(cellSize, cellRound, "block")

  if (days.length === 0) return null

  const describe = (day: HeatmapDay): string =>
    day.label ?? `${day.date} · ${printer(day.value)}${unit ? ` ${unit}` : ""}`

  const renderCell = (day: HeatmapDay) => {
    const level = levelOf(day.value, thresholds)
    const shared = cn(
      baseCell,
      "transition-colors",
      level === 0 ? LEVEL_EMPTY : cn("bg-current", palette.ink, LEVEL_TONE[level]),
    )
    const title = describe(day)
    return onSelect ? (
      <button
        key={day.date}
        type="button"
        title={title}
        aria-label={title}
        onClick={() => onSelect(day)}
        className={cn(shared, "cursor-pointer hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring")}
      />
    ) : (
      <span key={day.date} title={title} className={shared} />
    )
  }

  const legend = showLegend ? (
    <div className="flex items-center justify-end gap-[3px] text-[9px] leading-none text-muted-foreground">
      <span className="mr-1">少</span>
      <span className={cn(cellSize, cellRound, "block", LEVEL_EMPTY)} />
      {[1, 2, 3, 4, 5].map((level) => (
        <span
          key={level}
          className={cn(cellSize, cellRound, "block bg-current", palette.ink, LEVEL_TONE[level])}
        />
      ))}
      <span className="ml-1">多</span>
    </div>
  ) : null

  if (layout === "months") {
    // 按月切块：每个月自己补齐首尾空位，块内就是「周一…周日」的天然历表。
    const buckets = new Map<string, HeatmapDay[]>()
    for (const day of days) {
      const key = day.date.slice(0, 7)
      const bucket = buckets.get(key)
      if (bucket) bucket.push(day)
      else buckets.set(key, [day])
    }
    const months = [...buckets.entries()].map(([key, monthDays]) => {
      const cells: (HeatmapDay | null)[] = [
        ...Array(weekdayIndex(monthDays[0].date)).fill(null),
        ...monthDays,
      ]
      while (cells.length % 7 !== 0) cells.push(null)
      const weeks: (HeatmapDay | null)[][] = []
      for (let index = 0; index < cells.length; index += 7) {
        weeks.push(cells.slice(index, index + 7))
      }
      return {
        key,
        label: MONTH_LABELS[monthOf(monthDays[0].date) - 1] ?? key,
        weeks,
      }
    })

    return (
      <div
        data-slot="daily-heatmap"
        role="img"
        aria-label={`${days[0].date} 起共 ${days.length} 天的每日用量`}
        className={cn("flex flex-col gap-2", className)}
      >
        <div className="grid grid-cols-3 gap-x-3 gap-y-3 min-[600px]:grid-cols-4">
          {months.map((month) => (
            <div key={month.key} className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] leading-none text-muted-foreground">{month.label}</span>
              <div className={cn("flex flex-col", cellGap)}>
                {month.weeks.map((week, weekIndex) => (
                  <div key={`${month.key}-w${weekIndex}`} className={cn("flex", cellGap)}>
                    {week.map((day, dayIndex) =>
                      day ? (
                        renderCell(day)
                      ) : (
                        <span
                          key={`${month.key}-empty-${weekIndex}-${dayIndex}`}
                          className={cn(cellSize, "block")}
                        />
                      ),
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {legend}
      </div>
    )
  }

  // 头部留空，让第一列从周一开始对齐；尾部留空补满最后一列。
  const cells: (HeatmapDay | null)[] = [...Array(weekdayIndex(days[0].date)).fill(null), ...days]
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (HeatmapDay | null)[][] = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }

  return (
    <div
      data-slot="daily-heatmap"
      role="img"
      aria-label={`${days[0].date} 至 ${days[days.length - 1].date} 共 ${days.length} 天的每日用量`}
      className={cn("flex flex-col gap-1.5", className)}
    >
      <div className={cn("flex pb-0.5", fluidStrip ? "w-full gap-[2px]" : cn("overflow-x-auto", cellGap))}>
        <div
          className={cn(
            "mr-0.5 flex flex-col pt-[14px]",
            // fluid 时星期列和格子列一样宽：格子边长由列宽决定，列宽不同就会错位。
            fluidStrip ? "min-w-0 flex-1 gap-[2px] max-w-[20px]" : cn("shrink-0", cellGap),
          )}
        >
          {WEEKDAY_LABELS.map((label, index) => (
            <span
              key={label}
              className={cn(
                "flex items-center justify-end text-[9px] leading-none text-muted-foreground",
                fluidStrip ? "aspect-square w-full" : cellSize,
                index % 2 === 0 ? "opacity-100" : "opacity-0",
              )}
            >
              {label}
            </span>
          ))}
        </div>
        {weeks.map((week, weekIndex) => {
          const first = week.find((cell) => cell !== null) ?? null
          const previous = weeks[weekIndex - 1]?.find((cell) => cell !== null) ?? null
          const showMonth =
            showMonths && first !== null && (weekIndex === 0 || monthOf(first.date) !== monthOf(previous?.date ?? ""))
          return (
            <div
              key={`week-${weekIndex}`}
              className={cn(
                "relative flex flex-col",
                fluidStrip ? "min-w-0 flex-1 gap-[2px] max-w-[20px]" : cn("shrink-0", cellGap),
              )}
            >
              {/* 月份标签绝对定位：否则「12月」比格子宽，整列被撑开就错位了 */}
              <span className="block h-[14px]" />
              <span className="pointer-events-none absolute left-0 top-0 whitespace-nowrap text-[9px] leading-none text-muted-foreground">
                {showMonth && first ? `${monthOf(first.date)}月` : ""}
              </span>
              {week.map((day, dayIndex) =>
                day ? (
                  renderCell(day)
                ) : (
                  <span
                    key={`empty-${weekIndex}-${dayIndex}`}
                    className={fluidStrip ? "block aspect-square w-full" : cn(cellSize, "block")}
                  />
                ),
              )}
            </div>
          )
        })}
      </div>
      {legend}
    </div>
  )
}
