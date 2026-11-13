"use client"

import * as React from "react"

import { AppIcon } from "../icons/AppIcon"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  ExpandableItem,
  ExpandableItemSection,
  type ExpandableItemProps,
  type ExpandableItemSectionTone,
} from "./expandable-item"
import { StatusBadge, type StatusBadgeVariant } from "./status-badge"

/**
 * 工具条目 —— 展开后是「下载 / 更新」的那一套。
 *
 * 收起行照技能列表那样两行：上面是名称 + 版本 + 状态徽标（下载中 38%）+ 一颗按钮，
 * 下面一行灰字写来源 / 传输量。进度只用百分比，不另摆进度条；
 * 展开区是「详情」：版本对比、出错原因，其余内容等下载完再看。
 *
 * 取消一律用淡红那颗（destructive），意思是「就地停下」；继续 / 重试 / 更新用主题色。
 *
 * 组件只负责摆样式和按状态切按钮，不自己发请求：开始 / 停止 / 继续 / 取消 / 重试
 * 全是回调，字节与速度的换算留在调用方（各自的单位文案不一样，不该塞进库里）。
 */

export type ToolUpdateState = "idle" | "downloading" | "paused" | "installing" | "done" | "error"

export interface ToolUpdateItemProps
  extends Omit<ExpandableItemProps, "children" | "actions" | "status"> {
  state?: ToolUpdateState
  /** 本地当前版本；没有就是还没装 */
  currentVersion?: string
  /** 目标版本（要更新到的那个） */
  targetVersion?: string
  /** 0–100；null / undefined 表示还没拿到可报告的进度，进度条走不确定态 */
  progress?: number | null
  /** 标题下面那行灰字：安装包大小 / 来源地址、已下载 / 总量、速度、剩余时间… */
  detail?: string
  /** 展开区第一行的说明 */
  description?: React.ReactNode
  errorText?: string
  /** 展开区详情卡片的标题，默认「版本详情 / 出错详情」 */
  sectionLabel?: React.ReactNode
  /** 展开区详情卡片的配色，默认中性灰（出错时转红） */
  sectionTone?: ExpandableItemSectionTone
  /** 收起行主按钮文案，默认按状态给「更新 / 下载 / 重试」 */
  actionLabel?: string
  /** 忙时的取消按钮文案，默认「取消下载 / 取消安装」 */
  cancelLabel?: string
  onStart?: () => void
  onStop?: () => void
  onResume?: () => void
  onCancel?: () => void
  /** 覆盖收起行右端的操作 */
  actions?: React.ReactNode
  /** 覆盖收起行的状态徽标 */
  status?: React.ReactNode
  children?: React.ReactNode
}

const DEFAULT_STATUS: Record<ToolUpdateState, { text: string; variant: StatusBadgeVariant }> = {
  idle: { text: "可更新", variant: "warning" },
  downloading: { text: "下载中", variant: "primary" },
  paused: { text: "已暂停", variant: "warning" },
  installing: { text: "正在安装", variant: "primary" },
  done: { text: "已完成", variant: "success" },
  error: { text: "下载失败", variant: "danger" },
}

/** 详情卡片的标题：正常是版本详情，出错就是出错详情。 */
const DETAIL_LABEL = { normal: "版本详情", error: "出错详情" } as const

export function ToolUpdateItem({
  state = "idle",
  currentVersion,
  targetVersion,
  progress,
  detail,
  description,
  errorText,
  sectionLabel,
  sectionTone,
  actionLabel,
  cancelLabel,
  onStart,
  onStop,
  onResume,
  onCancel,
  actions,
  status,
  children,
  ...rest
}: ToolUpdateItemProps) {
  const percent =
    progress === null || progress === undefined ? null : Math.min(100, Math.max(0, progress))
  const busy = state === "downloading" || state === "installing"
  const transferring = busy || state === "paused"
  const upToDate = Boolean(targetVersion && currentVersion && targetVersion === currentVersion)

  // 闲置时按「版本差」自己判断：没装 / 已是最新 / 可更新。
  const idleStatus: { text: string; variant: StatusBadgeVariant } = !currentVersion
    ? { text: "未安装", variant: "neutral" }
    : upToDate
      ? { text: "已是最新", variant: "success" }
      : DEFAULT_STATUS.idle

  // 徽标是这一行的头条：状态词 + 百分比（跟设置里的「下载中 38%」是同一颗）。
  const statusText =
    state === "idle"
      ? idleStatus.text
      : transferring && percent !== null
        ? `${DEFAULT_STATUS[state].text} ${Math.round(percent)}%`
        : DEFAULT_STATUS[state].text
  const statusVariant = state === "idle" ? idleStatus.variant : DEFAULT_STATUS[state].variant

  const detailTone: ExpandableItemSectionTone =
    sectionTone ?? (state === "error" ? "danger" : "neutral")
  const detailLabel = sectionLabel ?? (state === "error" ? DETAIL_LABEL.error : DETAIL_LABEL.normal)

  const defaultActions = () => {
    // 传输中只有一颗：转圈 + 取消（淡红）。取消后回到「安装 / 下载」。
    // 宿主里真停不下来的那几条（npm / npx 只有 300 秒超时，没有取消命令）
    // 不给按钮：摆一颗点了没反应的「取消下载」比不摆更糟。
    if (busy) {
      if (!onCancel && !onStop) return null
      return (
        <Button
          size="sm"
          variant="destructive"
          icon={<AppIcon name="loader" className="animate-spin" />}
          onClick={onCancel ?? onStop}
        >
          {cancelLabel ?? (state === "installing" ? "取消安装" : "取消下载")}
        </Button>
      )
    }
    if (state === "paused") {
      return (
        <>
          {onCancel ? (
            <Button size="sm" variant="destructive" onClick={onCancel}>
              取消
            </Button>
          ) : null}
          <Button size="sm" variant="default" icon={<AppIcon name="play" />} onClick={onResume}>
            继续
          </Button>
        </>
      )
    }
    if (state === "error") {
      return (
        <Button size="sm" variant="default" icon={<AppIcon name="refresh" />} onClick={onStart}>
          重试
        </Button>
      )
    }
    if (state === "done") return null
    // 已是最新：状态徽标（绿色）已经说清楚了，不再摆一颗点了没反应的按钮。
    if (upToDate) return null
    return (
      <Button size="sm" variant="default" icon={<AppIcon name="download" />} onClick={onStart}>
        {actionLabel ?? (currentVersion ? "更新" : "下载")}
      </Button>
    )
  }

  const statusNode =
    state === "idle" && upToDate ? (
      <StatusBadge variant="success">已是最新</StatusBadge>
    ) : (
      <StatusBadge variant={statusVariant} pulse={busy}>
        {statusText}
      </StatusBadge>
    )

  return (
    <ExpandableItem
      {...rest}
      meta={rest.meta ?? (currentVersion ? currentVersion : undefined)}
      subtitle={rest.subtitle ?? detail}
      status={status !== undefined ? status : statusNode}
      actions={actions ?? defaultActions()}
    >
      <div className="flex flex-col gap-2">
        {description ? (
          <p className="m-0 px-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}

        <ExpandableItemSection tone={detailTone} label={detailLabel}>
          <div className="flex flex-col gap-2">
            {currentVersion || targetVersion ? (
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span>当前版本</span>
                <Badge
                  variant="muted"
                  className="h-5 border border-border/60 bg-card px-1.5 font-mono text-[10.5px] text-foreground"
                >
                  {currentVersion ?? "未安装"}
                </Badge>
                {targetVersion ? (
                  <>
                    <AppIcon name="arrow-right" aria-hidden className="size-3 text-muted-foreground/60" />
                    <span>目标版本</span>
                    <Badge
                      variant="muted"
                      className="h-5 border border-border/60 bg-card px-1.5 font-mono text-[10.5px] text-foreground"
                    >
                      {targetVersion}
                    </Badge>
                  </>
                ) : null}
              </div>
            ) : null}

            {errorText ? (
              <p className="m-0 text-[11.5px] leading-relaxed font-medium text-destructive" role="alert">
                {errorText}
              </p>
            ) : null}
          </div>
        </ExpandableItemSection>

        {children}
      </div>
    </ExpandableItem>
  )
}
