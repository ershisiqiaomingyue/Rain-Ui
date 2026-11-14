"use client"

import * as React from "react"
import { AppIcon } from "../icons/AppIcon"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/utils"

export interface PermissionRequestBarProps {
  toolLabel: string
  command?: string
  environmentLabel?: string
  question?: string
  /** 剩余秒数，null 表示不显示倒计时 */
  expiresIn?: number | null
  busy?: boolean
  instruction?: string
  onInstructionChange?: (value: string) => void
  onAllow?: () => void
  onAlwaysAllow?: () => void
  onDeny?: () => void
  className?: string
}

/**
 * 工具授权请求。所有按钮都用 Button default（32px / 10px 圆角 / 12px）。
 */
export function PermissionRequestBar({
  toolLabel,
  command,
  environmentLabel,
  question,
  expiresIn,
  busy = false,
  instruction,
  onInstructionChange,
  onAllow,
  onAlwaysAllow,
  onDeny,
  className,
}: PermissionRequestBarProps) {
  return (
    <div
      className={cn(
        /* 授权请求是「要人看一眼」，不是报错：用唯一强调色的淡底，不另开琥珀色阶。 */
        "space-y-2.5 rounded-xl border border-border bg-[hsl(var(--primary)/0.06)] p-3",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--primary)/0.14)] text-primary">
          <AppIcon name="shield-alert" className="size-3" />
        </span>
        <span className="text-xs font-semibold text-foreground">需要授权</span>
        <span className="min-w-0 truncate text-xs text-muted-foreground">
          请求执行 {toolLabel}
          {environmentLabel ? ` · ${environmentLabel}` : ""}
        </span>
        {expiresIn != null && (
          <Badge variant="muted" className="ml-auto h-5 shrink-0 gap-1 px-1.5 font-mono text-[10.5px]">
            <AppIcon name="timer" className="size-2.5" />
            {expiresIn}s
          </Badge>
        )}
      </div>

      {command && (
        <pre className="overflow-x-auto rounded-[10px] bg-muted/70 px-2.5 py-1.5 font-mono text-[11px] text-foreground">
          {command}
        </pre>
      )}

      {question && <p className="text-[11.5px] leading-relaxed text-muted-foreground">{question}</p>}

      {onInstructionChange && (
        <Input
          value={instruction}
          onChange={(e) => onInstructionChange(e.target.value)}
          placeholder="可选：补充说明给 Agent（例如：只允许读取，不要删除）"
        />
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" disabled={busy} onClick={onDeny} className="gap-1.5">
          <AppIcon name="shield-x" className="size-3.5" />
          拒绝
        </Button>
        <Button variant="default" disabled={busy} onClick={onAlwaysAllow} className="gap-1.5">
          <AppIcon name="shield-check" className="size-3.5" />
          本会话始终允许
        </Button>
        <Button disabled={busy} onClick={onAllow} className="gap-1.5">
          <AppIcon name="shield-check" className="size-3.5" />
          允许执行
        </Button>
      </div>
    </div>
  )
}
