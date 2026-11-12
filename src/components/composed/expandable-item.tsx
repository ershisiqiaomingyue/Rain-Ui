"use client"

import * as React from "react"

import { AppIcon, type AppIconName } from "../icons/AppIcon"
import { cn } from "../../lib/utils"
import { DATA_TONES } from "../../lib/tone"

/**
 * 可展开条目（整块可点的那一层）。
 *
 * 折叠逻辑就一条：**一个条目自始至终只有一张卡片**。收起时它是一行，展开时还是
 * 同一张卡片、只是变高了——外框、圆角、底色都不换，展开区只跟标题之间加一条分隔线，
 * 所以不会看成「上面一行 + 下面另一个块」。
 *
 * 层级靠「底色一层层加深」堆出来，不靠描边堆：
 *   页面底 → 条目卡片（白）→ 展开区里的分项卡片（浅色，见 ExpandableItemSection）
 *   → 分项里的输入框（回到白）。
 * 分项卡片一律灰底，颜色由 tone 决定——只有「中性 / 出错 / 暂停 / 完成」这几种意思，
 * 卡片本身不沾主题色（主题色留给按钮、徽标、进度条）。一张卡片里想放几种分项就放几张。
 *
 * 交互约定：
 *   1. 点击整行即展开/收起；行首那颗小箭头只是记号（展开时转 90°），不另做展开按钮；
 *   2. 右端的 Switch / Select / 按钮是另一块区域，点它们不会连带开合这一行；
 *   3. hover 铺满整张卡（连右端控件一起，不留内边距白框），只有这一个 hover 信号；
 *   4. 收起行最多两行：标题那行带状态徽标与右端按钮，下面一行灰字（subtitle）写来源 / 明细，
 *      百分比写在徽标里，不另摆进度条。
 *
 * 这一层只管壳：图标 / 标题 / 简要信息 / 状态 / 收起行操作 / 展开区槽位。
 * 需要具体形态就用它的四个变体：ToolItem / ToolInfoItem / ToolUpdateItem / ToolChoiceItem。
 */

/** 行首视觉：给 AppIcon 名就用默认的图标盘，也可以塞自定义节点（例如 ToolIcon）。 */
export type ExpandableItemIcon = AppIconName | React.ReactNode

/** 图标盘色调：跟着这一行的状态走（可用 / 待更新 / 出错…）。 */
export type ExpandableItemTone = "neutral" | "primary" | "success" | "warning" | "danger"

/**
 * 展开区分项卡片的色调：卡片一律灰底，tone 只改标题与进度的颜色。
 * 只有「中性 / 出错 / 暂停 / 完成」这几种意思，不做「分类色」——
 * 一张卡里两三个色就是花。
 */
export type ExpandableItemSectionTone = "neutral" | "primary" | "success" | "warning" | "danger"

/** 底色复用统计面板那套 tone（浅底 + 深一档文字），别在组件里另写一组色值。 */
const TONE_TILE: Record<ExpandableItemTone, string> = {
  neutral: "bg-muted text-muted-foreground ring-border/70",
  primary: "bg-muted text-primary ring-border/70",
  success: cn(DATA_TONES.emerald.soft, DATA_TONES.emerald.ink, "ring-emerald-500/25"),
  warning: cn(DATA_TONES.amber.soft, DATA_TONES.amber.ink, "ring-amber-500/25"),
  danger: "bg-destructive/[0.14] text-destructive ring-destructive/25",
}

interface SectionToneClasses {
  /** 分项卡片外框：平涂底色 + 同色系细描边 */
  wrap: string
  /** 分项标题色 */
  ink: string
  /** 颜色（用于里面的 Progress） */
  bar: string
}

/**
 * 分项卡片一律平涂灰底（跟设置里的分组卡一样）：卡片本身不沾主题色。
 * 主题色只留给按钮、徽标、进度条这些「组件」；success / warning / danger
 * 只在真完成、真暂停、真出错时出现。
 */
const SECTION_TONE: Record<ExpandableItemSectionTone, SectionToneClasses> = {
  neutral: { wrap: "border-border bg-muted/60", ink: "text-foreground", bar: "" },
  primary: {
    wrap: "border-border bg-muted/60",
    ink: "text-foreground",
    bar: "[&>[data-slot=progress-indicator]]:bg-primary",
  },
  success: {
    wrap: "border-emerald-500/30 bg-emerald-500/10",
    ink: DATA_TONES.emerald.ink,
    bar: DATA_TONES.emerald.bar,
  },
  warning: {
    wrap: "border-amber-500/30 bg-amber-500/10",
    ink: DATA_TONES.amber.ink,
    bar: DATA_TONES.amber.bar,
  },
  danger: {
    wrap: "border-destructive/30 bg-destructive/[0.08]",
    ink: "text-destructive",
    bar: DATA_TONES.rose.bar,
  },
}

/** 给分项里的 Progress 染色（Progress 的根节点是染色的那一层，所以要直接挂在它身上）。 */
export function expandableSectionBar(tone: ExpandableItemSectionTone): string {
  return SECTION_TONE[tone].bar
}

/** 分项标题色（分项里的小标题也可以用同一个色，保持一族）。 */
export function expandableSectionInk(tone: ExpandableItemSectionTone): string {
  return SECTION_TONE[tone].ink
}

export interface ExpandableItemProps {
  icon?: ExpandableItemIcon
  /** 图标盘色调，默认中性灰 */
  tone?: ExpandableItemTone
  /** 收起态的主标题 */
  title: React.ReactNode
  /** 收起态跟在标题后的简要信息（版本号、路径尾段…），等宽显示 */
  meta?: React.ReactNode
  /** 标题右侧的状态徽标（用 StatusBadge） */
  status?: React.ReactNode
  /**
   * 标题下面那行灰色说明（来源路径、仓库地址、传输量…），一行截断。
   * 只放文字：进度百分比已经在 status 里，别在这里再摆一条进度条。
   */
  subtitle?: React.ReactNode
  /** 收起行右端的操作（Switch / Select / 按钮），与展开区互不干扰 */
  actions?: React.ReactNode
  /** 受控展开态；不传就是内部自己管 */
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** 展开区底部左侧（例如只读的可执行文件路径） */
  footerLeft?: React.ReactNode
  /** 展开区底部右侧动作（保存 / 还原 …） */
  footer?: React.ReactNode
  /** 整行禁用（保存中 / 检测中）：不能展开，已展开的内容也一起锁住 */
  disabled?: boolean
  className?: string
  contentClassName?: string
  children?: React.ReactNode
}

/** 行首图标盘：统一 32px 方块；tone 决定底色与图标色，传节点时忽略 tone。 */
export function ExpandableItemMedia({
  icon,
  tone = "neutral",
  className,
}: {
  icon?: ExpandableItemIcon
  tone?: ExpandableItemTone
  className?: string
}) {
  if (icon === undefined || icon === null || icon === false) return null
  const custom = typeof icon !== "string"
  return (
    <span
      data-slot="expandable-item-media"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-[9px]",
        custom ? undefined : cn("ring-1", TONE_TILE[tone]),
        className
      )}
    >
      {typeof icon === "string" ? (
        <AppIcon name={icon as AppIconName} className="size-4" />
      ) : (
        icon
      )}
    </span>
  )
}

/**
 * 展开区里的「分项卡片」：叠在条目卡片之上的一层浅色卡片。
 *
 * 展开区不需要分区时别用它是最好——只在真的有分项（一段设置、一组版本信息、
 * 一块进度）时才叠一层，层级才有意义。同一张条目卡片里可以叠多张不同 tone 的分项。
 */
export function ExpandableItemSection({
  label,
  hint,
  tone = "neutral",
  className,
  children,
}: {
  /** 分项标题，用分项色调显示 */
  label?: React.ReactNode
  /** 分项标题右侧的补充信息 */
  hint?: React.ReactNode
  tone?: ExpandableItemSectionTone
  className?: string
  children?: React.ReactNode
}) {
  const t = SECTION_TONE[tone]
  return (
    <div
      data-slot="expandable-item-section"
      data-tone={tone}
      className={cn("min-w-0 rounded-[11px] border px-3 py-2.5", t.wrap, className)}
    >
      {label || hint ? (
        <div className="mb-2 flex min-w-0 items-baseline justify-between gap-2">
          {label ? (
            <span className={cn("truncate text-[11px] font-semibold", t.ink)}>{label}</span>
          ) : null}
          {hint ? <span className={cn("shrink-0 text-[11px] font-normal", t.ink)}>{hint}</span> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export function ExpandableItem({
  icon,
  tone,
  title,
  meta,
  status,
  subtitle,
  actions,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  footerLeft,
  footer,
  disabled = false,
  className,
  contentClassName,
  children,
}: ExpandableItemProps) {
  const bodyId = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState(defaultExpanded)

  const controlled = expanded !== undefined
  const open = controlled ? expanded : uncontrolled
  const hasBody = children !== null && children !== undefined && children !== false
  const clickable = hasBody && !disabled

  const handleToggle = () => {
    if (!clickable) return
    if (!controlled) setUncontrolled(!open)
    onExpandedChange?.(!open)
  }

  /**
   * 整行可点：能开合的其实只有标题那颗按钮，行内边距（上下各 10px、左右各 14px）点下去没反应 ——
   * 可鼠标在这一圈是手型、hover 也会把整张卡点亮，看着就是能点的，于是老有人要点第二下。
   * 点击因此收在壳上：真正的控件（按钮 / 开关 / 输入框 / 右端操作）只归它们自己，
   * 剩下的空白一律算点这一行。
   */
  const handleRowClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!clickable) return
    const target = event.target as HTMLElement
    if (target.closest("[data-slot=expandable-item-actions]")) return
    if (target.closest("button, a, input, select, textarea, [role=switch]")) return
    handleToggle()
  }

  return (
    <div
      data-slot="expandable-item"
      data-expanded={open && hasBody ? "true" : "false"}
      data-disabled={disabled ? "true" : undefined}
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-card shadow-xs transition-colors",
        hasBody && open ? "border-border shadow-sm" : "border-border/80",
        disabled && "opacity-70",
        className
      )}
    >
      {/*
        整块一条：hover 直接铺满整张卡（箭头、文字、状态、右端操作一起），
        只有一个 hover 信号，不做逐段高亮；层级靠箭头、字重和留白，不靠色块。
      */}
      <div
        className={cn(
          "px-3.5 py-2.5 transition-colors",
          clickable && "cursor-pointer hover:bg-muted/70"
        )}
        onClick={clickable ? handleRowClick : undefined}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            aria-expanded={hasBody ? open : undefined}
            aria-controls={hasBody ? bodyId : undefined}
            onClick={handleToggle}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2.5 rounded-[8px] text-left outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring/40",
              clickable ? "cursor-pointer" : "cursor-default"
            )}
          >
            {icon ? (
              <ExpandableItemMedia icon={icon} tone={tone} />
            ) : hasBody ? (
              // 没有图标时用一颗小箭头当入口：展开转 90°，不另做展开按钮。
              <AppIcon
                name="chevron-right"
                aria-hidden
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-150",
                  open && "rotate-90"
                )}
              />
            ) : null}
            <span className="flex min-w-0 flex-1 items-baseline gap-2">
              <span className="truncate text-[13px] font-semibold text-foreground">{title}</span>
              {meta ? (
                <span className="truncate font-mono text-[11px] text-muted-foreground">{meta}</span>
              ) : null}
            </span>
            {status ? <span className="flex shrink-0 items-center gap-1.5">{status}</span> : null}
          </button>
          {actions ? (
            // 兜住冒泡：以后哪怕外层也变成整块可点，右端控件依旧只管自己。
            <div
              data-slot="expandable-item-actions"
              className="flex shrink-0 items-center gap-1.5"
              onClick={(event) => event.stopPropagation()}
            >
              {actions}
            </div>
          ) : null}
        </div>
        {subtitle ? (
          // 说明行跟标题左对齐（箭头 14 + 间距 10）；点它算点这一行 —— 交给外层那次点击处理，
          // 这一层不再自己接一遍，否则一次点击会开合两次（等于没反应）。
          <p
            data-slot="expandable-item-subtitle"
            className={cn(
              "mt-1 mb-0 truncate text-[12px] leading-snug text-muted-foreground",
              icon ? "pl-[42px]" : "pl-[24px]"
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {hasBody && open ? (
        <div
          id={bodyId}
          data-slot="expandable-item-body"
          className={cn(
            "border-t border-border/70 px-3.5 pt-3 pb-3",
            "animate-in fade-in-0 slide-in-from-top-1 duration-150 motion-reduce:animate-none",
            disabled && "pointer-events-none",
            contentClassName
          )}
        >
          {children}
          {footerLeft || footer ? (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2.5">
              <div className="min-w-0 text-[11px] text-muted-foreground">{footerLeft}</div>
              <div className="flex shrink-0 items-center gap-2">{footer}</div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
