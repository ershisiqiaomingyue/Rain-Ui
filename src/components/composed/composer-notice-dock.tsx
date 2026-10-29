"use client"

import * as React from "react"
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FolderOpen,
  HelpCircle,
  ListPlus,
  Loader2,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export type NoticeItemKind =
  | "permission"
  | "question"
  | "plan"
  | "background"
  | "queue"
  | "files"
  | "compaction"

export interface ComposerNoticeItem {
  id: string
  kind: NoticeItemKind
  label: string
  summary: string
  count?: number
  running?: boolean
  attention?: boolean
  badge?: string
  content?: React.ReactNode
}

export interface ComposerNoticeDockProps {
  items: ComposerNoticeItem[]
  activeId?: string
  onToggleItem?: (id: string) => void
  onDismissItem?: (id: string) => void
  className?: string
}

const noticeConfig: Record<
  NoticeItemKind,
  {
    icon: React.ComponentType<{ className?: string }>
    toneClasses: {
      bar: string
      iconBg: string
      badge: string
    }
  }
> = {
  permission: {
    icon: ShieldAlert,
    toneClasses: {
      bar: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      iconBg: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
      badge: "bg-amber-500/20 text-amber-600",
    },
  },
  question: {
    icon: HelpCircle,
    toneClasses: {
      bar: "border-primary/30 bg-primary/10 text-primary",
      iconBg: "bg-primary/20 text-primary",
      badge: "bg-primary/20 text-primary",
    },
  },
  plan: {
    icon: ClipboardList,
    toneClasses: {
      bar: "border-border/80 bg-card text-foreground",
      iconBg: "bg-muted text-muted-foreground",
      badge: "bg-muted text-muted-foreground",
    },
  },
  background: {
    icon: Loader2,
    toneClasses: {
      bar: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      iconBg: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-600",
    },
  },
  queue: {
    icon: ListPlus,
    toneClasses: {
      bar: "border-border/80 bg-card text-foreground",
      iconBg: "bg-muted text-muted-foreground",
      badge: "bg-muted text-muted-foreground",
    },
  },
  files: {
    icon: FolderOpen,
    toneClasses: {
      bar: "border-border/80 bg-card text-foreground",
      iconBg: "bg-muted text-muted-foreground",
      badge: "bg-muted text-muted-foreground",
    },
  },
  compaction: {
    icon: Sparkles,
    toneClasses: {
      bar: "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
      iconBg: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
      badge: "bg-indigo-500/20 text-indigo-600",
    },
  },
}

export function ComposerNoticeDock({
  items,
  activeId,
  onToggleItem,
  onDismissItem,
  className,
}: ComposerNoticeDockProps) {
  const [internalActiveId, setInternalActiveId] = React.useState<string | null>(
    activeId || null
  )

  const currentActiveId = activeId !== undefined ? activeId : internalActiveId

  const handleToggle = (id: string) => {
    if (onToggleItem) {
      onToggleItem(id)
    } else {
      setInternalActiveId((prev) => (prev === id ? null : id))
    }
  }

  if (!items || items.length === 0) return null

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {items.map((item) => {
        const config = noticeConfig[item.kind]
        const Icon = config.icon
        const isExpanded = currentActiveId === item.id

        return (
          <div
            key={item.id}
            className={cn(
              "rounded-xl border transition-all duration-200 overflow-hidden shadow-xs",
              config.toneClasses.bar,
              isExpanded ? "ring-1 ring-primary/30" : "hover:border-border"
            )}
          >
            {/* 顶部标题栏 (可点击折叠/展开) */}
            <div
              onClick={() => handleToggle(item.id)}
              className="flex items-center justify-between gap-3 px-3 py-2 cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className={cn(
                    "size-6 rounded-md flex items-center justify-center shrink-0",
                    config.toneClasses.iconBg
                  )}
                >
                  {item.running ? (
                    <Spinner size="xs" />
                  ) : (
                    <Icon className="size-3.5" />
                  )}
                </span>
                <span className="text-xs font-semibold shrink-0">
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {item.summary}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.count != null && (
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-full bg-background/50 border border-border/40 tabular-nums">
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10.5px] px-1.5 py-0.5 rounded-md font-medium",
                      config.toneClasses.badge
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-5 rounded-md text-muted-foreground hover:text-foreground"
                  aria-label={isExpanded ? "折叠" : "展开"}
                >
                  {isExpanded ? (
                    <ChevronDown className="size-3.5" />
                  ) : (
                    <ChevronRight className="size-3.5" />
                  )}
                </Button>
                {onDismissItem && (
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDismissItem(item.id)
                    }}
                    className="size-5 rounded-md text-muted-foreground hover:text-destructive"
                    aria-label="关闭"
                  >
                    <X className="size-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* 展开的详情内容区域 */}
            {isExpanded && item.content && (
              <div className="px-3 pb-3 pt-1 border-t border-border/40 text-xs text-foreground/90 bg-background/40">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
