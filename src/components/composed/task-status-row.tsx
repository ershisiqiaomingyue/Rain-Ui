"use client"

import * as React from "react"
import { AlertCircle, Check } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StepSpinner } from "@/components/ui/step-spinner"
import { cn } from "@/lib/utils"

export type TaskStatus = "done" | "running" | "pending" | "error"

export interface TaskItem {
  id: string
  title: string
  chip?: string
  status: TaskStatus
}

export interface TaskStatusRowProps {
  /** 卡片标题 */
  title?: string
  description?: string
  tasks: TaskItem[]
  onToggleStatus?: (id: string) => void
  className?: string
}

const STATUS_TEXT: Record<TaskStatus, string> = {
  done: "已完成",
  running: "进行中",
  pending: "等待中",
  error: "失败",
}

function TaskMark({ status }: { status: TaskStatus }) {
  if (status === "done") {
    return (
      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-2.5" strokeWidth={3.2} />
      </span>
    )
  }
  if (status === "running") {
    return (
      <span className="flex shrink-0 items-center justify-center">
        <StepSpinner size={18} />
      </span>
    )
  }
  if (status === "error") {
    return (
      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
        <AlertCircle className="size-3" />
      </span>
    )
  }
  return <span className="size-[18px] shrink-0 rounded-full border-[1.5px] border-muted-foreground/35" />
}

/**
 * 任务状态：一张总卡，里面每个任务各自一张小卡。
 */
export function TaskStatusRow({
  title = "任务进度",
  description,
  tasks,
  onToggleStatus,
  className,
}: TaskStatusRowProps) {
  const done = tasks.filter((task) => task.status === "done").length

  return (
    <Card className={cn("w-full gap-0 rounded-xl border-border/70 bg-card/95 py-0 shadow-none", className)}>
      <CardHeader className="flex-row items-center justify-between gap-2 p-2.5">
        <div className="min-w-0">
          <CardTitle className="text-xs font-semibold text-foreground">{title}</CardTitle>
          {description && (
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{description}</p>
          )}
        </div>
        <Badge variant="muted" className="h-5 shrink-0 font-mono text-[10.5px]">
          {done} / {tasks.length}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 p-2.5 pt-0">
        {tasks.map((task) => (
          <Card
            key={task.id}
            onClick={() => onToggleStatus?.(task.id)}
            className={cn(
              "rounded-[10px] border-border bg-background/80 shadow-none transition-colors",
              onToggleStatus && "cursor-pointer hover:bg-muted/55"
            )}
          >
            <CardContent className="flex items-center gap-2 px-2 py-1.5">
              <TaskMark status={task.status} />
              <span className="min-w-0 flex-1 truncate text-xs text-foreground">{task.title}</span>
              {task.chip && (
                <Badge variant="muted" className="h-5 shrink-0 font-mono text-[10.5px]">
                  {task.chip}
                </Badge>
              )}
              <span className="w-12 shrink-0 text-right text-[11px] text-muted-foreground">
                {STATUS_TEXT[task.status]}
              </span>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
