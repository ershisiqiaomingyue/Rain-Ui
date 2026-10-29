"use client"

import * as React from "react"
import { ShieldAlert, ShieldCheck, ShieldX, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

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
        "rounded-xl border border-amber-500/30 bg-amber-500/[0.07] p-3 space-y-2.5",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="size-5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <ShieldAlert className="size-3" />
        </span>
        <span className="text-xs font-semibold text-foreground">需要授权</span>
        <span className="text-xs text-muted-foreground truncate">
          请求执行 {toolLabel}
          {environmentLabel ? ` · ${environmentLabel}` : ""}
        </span>
        {expiresIn != null && (
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground tabular-nums">
            <Timer className="size-3" />
            {expiresIn}s
          </span>
        )}
      </div>

      {command && (
        <pre className="rounded-lg bg-muted/70 px-2.5 py-1.5 font-mono text-[11px] text-foreground overflow-x-auto">
          {command}
        </pre>
      )}

      {question && (
        <p className="text-[11.5px] text-muted-foreground leading-relaxed">{question}</p>
      )}

      {onInstructionChange && (
        <Input
          value={instruction}
          onChange={(e) => onInstructionChange(e.target.value)}
          placeholder="可选：补充说明给 Agent（例如：只允许读取，不要删除）"
          className=""
        />
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" disabled={busy} onClick={onDeny} className="gap-1.5">
          <ShieldX className="size-3.5" /> 拒绝
        </Button>
        <Button variant="outline" size="sm" disabled={busy} onClick={onAlwaysAllow} className="gap-1.5">
          <ShieldCheck className="size-3.5" /> 本会话始终允许
        </Button>
        <Button size="sm" disabled={busy} onClick={onAllow} className="gap-1.5">
          <ShieldCheck className="size-3.5" /> 允许执行
        </Button>
      </div>
    </div>
  )
}
