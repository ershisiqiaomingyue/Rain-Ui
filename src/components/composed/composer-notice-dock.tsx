"use client"

import * as React from "react"
import {
  Check,
  ChevronRight,
  ClipboardList,
  FolderOpen,
  ListPlus,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type NoticeItemKind =
  | "permission"
  | "question"
  | "plan"
  | "background"
  | "queue"
  | "files"
  | "compaction"

export type NoticeState = "done" | "running" | "pending" | "error"

export interface NoticeDetail {
  id: string
  title: string
  description?: string
  meta?: string
  state?: NoticeState
}

export interface NoticeFileEntry {
  id: string
  path: string
  state?: NoticeState
  added?: number
  removed?: number
}

export interface ComposerNoticeItem {
  id: string
  kind: NoticeItemKind
  label: string
  summary: string
  count?: number
  running?: boolean
  attention?: boolean
  badge?: string
  /** 结构化明细：展开后渲染为卡片式的 Item 列表 */
  details?: NoticeDetail[]
  /** 文件改动专用 */
  files?: NoticeFileEntry[]
  addedLines?: number
  removedLines?: number
  /** 覆盖默认展开内容 */
  content?: React.ReactNode
  /** 展开后的操作按钮 */
  actions?: React.ReactNode
}

export interface ComposerNoticeDockProps {
  items: ComposerNoticeItem[]
  className?: string
}

const toneOf: Record<
  NoticeItemKind,
  { icon: React.ComponentType<{ className?: string }>; accent: string; text: string }
> = {
  permission: { icon: ShieldCheck, accent: "text-amber-500", text: "text-amber-600 dark:text-amber-400" },
  question: { icon: MessageCircleQuestion, accent: "text-primary", text: "text-primary" },
  plan: { icon: ClipboardList, accent: "text-muted-foreground", text: "text-foreground" },
  background: { icon: Sparkles, accent: "text-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  queue: { icon: ListPlus, accent: "text-muted-foreground", text: "text-foreground" },
  files: { icon: FolderOpen, accent: "text-muted-foreground", text: "text-foreground" },
  compaction: { icon: Sparkles, accent: "text-primary", text: "text-primary" },
}

function StateMark({ state }: { state?: NoticeState }) {
  if (state === "running") {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
        <Spinner size="xs" className="size-3" />
      </span>
    )
  }
  if (state === "done") {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-2.5" strokeWidth={3} />
      </span>
    )
  }
  if (state === "error") {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
        !
      </span>
    )
  }
  return (
    <span className="size-4 shrink-0 rounded-full border-[1.5px] border-muted-foreground/35" />
  )
}

/** 展开后的一张张明细卡片：复用基础组件 Card / Item / Badge */
function NoticeDetailList({ details }: { details: NoticeDetail[] }) {
  return (
    <div className="space-y-1.5">
      {details.map((detail) => (
        <Card key={detail.id} className="rounded-[10px] border-border/70 shadow-none">
          <CardContent className="flex items-center gap-2.5 p-2.5">
            <StateMark state={detail.state} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{detail.title}</p>
              {detail.description && (
                <p className="truncate text-[11px] text-muted-foreground">{detail.description}</p>
              )}
            </div>
            {detail.meta && (
              <Badge variant="muted" className="h-5 shrink-0 font-mono text-[10.5px]">
                {detail.meta}
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/** 文件改动：独立卡，展开方向朝上、悬浮覆盖，不占布局高度 */
function FilesNotice({ item }: { item: ComposerNoticeItem }) {
  const files = item.files ?? []
  const added = item.addedLines ?? files.reduce((sum, file) => sum + (file.added ?? 0), 0)
  const removed = item.removedLines ?? files.reduce((sum, file) => sum + (file.removed ?? 0), 0)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-8 gap-1.5 px-2.5 font-normal"
          aria-label="文件改动"
        >
          <FolderOpen className="size-3.5 text-muted-foreground" />
          <span className="text-xs text-foreground">文件改动</span>
          <span className="font-mono text-[11px] tabular-nums">
            <em className="not-italic text-emerald-600 dark:text-emerald-400">+{added}</em>
            <i className="ml-1 not-italic text-destructive">−{removed}</i>
          </span>
          <span className="text-[11px] text-muted-foreground">{files.length} 个文件</span>
          <ChevronRight className="ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform [[aria-expanded=true]>&]:rotate-90" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" sideOffset={6} className="w-80 p-2">
        <div className="flex items-center justify-between px-1 pb-1.5">
          <span className="text-xs font-medium text-foreground">文件改动</span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            <em className="not-italic text-emerald-600 dark:text-emerald-400">+{added}</em>
            <i className="ml-1 not-italic text-destructive">−{removed}</i>
          </span>
        </div>
        <Separator className="mb-1.5" />
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-muted"
            >
              <StateMark state={file.state ?? "done"} />
              <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground" title={file.path}>
                {file.path}
              </span>
              {(file.added != null || file.removed != null) && (
                <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-muted-foreground">
                  <em className="not-italic text-emerald-600 dark:text-emerald-400">+{file.added ?? 0}</em>
                  <i className="ml-1 not-italic text-destructive">−{file.removed ?? 0}</i>
                </span>
              )}
            </div>
          ))}
          {files.length === 0 && (
            <p className="px-1.5 py-2 text-center text-[11px] text-muted-foreground">没有文件改动</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * ComposerNoticeDock
 * -----------------------------------------------------------------------------
 * 可展开的通知卡组。收起时是一行行胶囊，点击展开为卡片明细；同一时刻只展开一张。
 * 文件改动是特殊卡：朝上浮层展开，不占位、不参与互斥。
 */
export function ComposerNoticeDock({ items, className }: ComposerNoticeDockProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  if (!items || items.length === 0) return null

  return (
    <div className={cn("flex w-full flex-col items-start gap-1.5", className)}>
      {items.map((item) => {
        if (item.kind === "files") return <FilesNotice key={item.id} item={item} />

        const tone = toneOf[item.kind]
        const Icon = tone.icon
        const expanded = expandedId === item.id
        const inline = item.kind === "queue"

        return (
          <div key={item.id} className="w-full">
            <div
              className={cn(
                "flex min-h-8 items-center gap-2 rounded-[10px] border border-border/70 bg-card px-2.5 transition-colors",
                expanded && "border-border"
              )}
            >
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <span className={cn("flex size-4 shrink-0 items-center justify-center", tone.accent)}>
                  {item.running ? <Spinner size="xs" className="size-3" /> : <Icon className="size-3.5" />}
                </span>
                <span className={cn("shrink-0 text-xs font-medium", tone.text)}>{item.label}</span>
                <span className="min-w-0 truncate text-xs text-muted-foreground">{item.summary}</span>
                {item.count != null && (
                  <Badge variant="muted" className="h-5 shrink-0 px-1.5 font-mono text-[10.5px]">
                    {item.count}
                  </Badge>
                )}
                {item.badge && (
                  <Badge variant={item.attention ? "destructive" : "secondary"} className="h-5 shrink-0 px-1.5 text-[10.5px]">
                    {item.badge}
                  </Badge>
                )}
                {!inline && (
                  <ChevronRight
                    className={cn(
                      "ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform",
                      expanded && "rotate-90"
                    )}
                  />
                )}
              </button>
              {item.actions}
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="关闭"
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-3" />
              </Button>
            </div>

            {expanded && (
              <div className="mt-1.5 rounded-[10px] border border-border/70 bg-muted/30 p-2">
                {item.content ?? (item.details ? <NoticeDetailList details={item.details} /> : null)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
