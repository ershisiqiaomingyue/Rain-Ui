"use client"

import * as React from "react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export type TaskStatus = "done" | "running" | "pending" | "error"

export interface TaskItem {
  id: string
  title: string
  chip?: string
  status: TaskStatus
}

export interface TaskStatusRowProps {
  tasks: TaskItem[]
  onToggleStatus?: (id: string) => void
  className?: string
}

export function TaskStatusRow({
  tasks,
  onToggleStatus,
  className,
}: TaskStatusRowProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onToggleStatus?.(task.id)}
          className={cn(
            "flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-border/70 bg-card hover:bg-muted/40 transition-all select-none",
            onToggleStatus && "cursor-pointer"
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* 状态指示徽章：1:1 提取自 card-showcase.html */}
            {task.status === "done" && (
              <span className="size-4.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
            )}
            {task.status === "running" && (
              <span className="size-4.5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Spinner size="xs" className="size-3 text-primary" />
              </span>
            )}
            {task.status === "pending" && (
              <span className="size-4.5 rounded-full border-[1.5px] border-muted-foreground/35 shrink-0" />
            )}
            {task.status === "error" && (
              <span className="size-4.5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold">!</span>
              </span>
            )}

            <span className="text-xs text-foreground font-medium truncate">
              {task.title}
            </span>
          </div>

          {task.chip && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50 shrink-0">
              {task.chip}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
