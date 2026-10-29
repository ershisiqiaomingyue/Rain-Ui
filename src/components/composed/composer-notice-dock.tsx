"use client"

import * as React from "react"
import { ArrowUp, Check, ChevronRight, ClipboardList, FolderOpen, GripVertical, ListPlus, MessageCircleQuestion, Pencil, ShieldCheck, Sparkles, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StepSpinner } from "@/components/ui/step-spinner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  /** 多行通知第一次出现时是否展开 */
  defaultExpanded?: boolean
}

export interface ComposerNoticeDockProps {
  items: ComposerNoticeItem[]
  className?: string
  onQueueGuide?: (item: ComposerNoticeItem, message: NoticeDetail) => void
  onQueueEdit?: (item: ComposerNoticeItem, message: NoticeDetail, content: string) => void
  onQueueRemove?: (item: ComposerNoticeItem, message: NoticeDetail) => void
  onQueueReorder?: (item: ComposerNoticeItem, messageIds: string[]) => void
  onFileOpen?: (item: ComposerNoticeItem, file: NoticeFileEntry) => void
}

const toneOf: Record<
  NoticeItemKind,
  { icon: React.ComponentType<{ className?: string }>; accent: string; text: string; edge: string }
> = {
  permission: { icon: ShieldCheck, accent: "text-primary", text: "text-foreground", edge: "border-primary/30" },
  question: { icon: MessageCircleQuestion, accent: "text-primary", text: "text-foreground", edge: "border-primary/25" },
  plan: { icon: ClipboardList, accent: "text-muted-foreground", text: "text-foreground", edge: "border-border" },
  background: { icon: Sparkles, accent: "text-primary", text: "text-foreground", edge: "border-border" },
  queue: { icon: ListPlus, accent: "text-muted-foreground", text: "text-foreground", edge: "border-border" },
  files: { icon: FolderOpen, accent: "text-muted-foreground", text: "text-foreground", edge: "border-border" },
  compaction: { icon: Sparkles, accent: "text-primary", text: "text-foreground", edge: "border-border" },
}

/** 状态圆点：运行态复用组件库 StepSpinner，完成态使用主题色对勾。 */
function StateMark({ state }: { state?: NoticeState }) {
  if (state === "running") {
    return <StepSpinner size={20} />
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
  return <span className="size-4 shrink-0 rounded-full border-[1.5px] border-muted-foreground/35" />
}

/** 展开后的明细：每一行都是完整 Item，整行 hover 与圆角一致。 */
function NoticeDetailList({ details }: { details: NoticeDetail[] }) {
  return (
    <div className="flex w-full flex-col gap-1">
      {details.map((detail) => (
        <Item
          key={detail.id}
          variant="outline"
          size="sm"
          className="min-h-9 w-full gap-2 rounded-[8px] bg-background/65 px-2 py-1.5 shadow-none hover:bg-muted/55"
        >
          <ItemMedia>
            <StateMark state={detail.state} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="truncate text-xs font-medium">{detail.title}</ItemTitle>
            {detail.description && (
              <ItemDescription className="truncate text-[11px]">{detail.description}</ItemDescription>
            )}
          </ItemContent>
          {detail.meta && (
            <Badge variant="muted" className="h-5 shrink-0 px-1.5 text-[10.5px]">
              {detail.meta}
            </Badge>
          )}
        </Item>
      ))}
    </div>
  )
}

/** 文件路径优先展示文件名，目录过长时从左侧省略。 */
function FilePath({ path }: { path: string }) {
  const lastSeparator = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"))
  const directory = lastSeparator >= 0 ? path.slice(0, lastSeparator + 1) : ""
  const filename = lastSeparator >= 0 ? path.slice(lastSeparator + 1) : path

  return (
    <span className="flex min-w-0 flex-1 items-center overflow-hidden whitespace-nowrap" title={path}>
      {directory && (
        <span className="min-w-0 flex-1 truncate text-left text-muted-foreground/65">{directory}</span>
      )}
      <span className="max-w-[70%] shrink-0 truncate text-left text-muted-foreground">{filename}</span>
    </span>
  )
}

function FilesNotice({
  item,
  onFileOpen,
}: {
  item: ComposerNoticeItem
  onFileOpen?: (file: NoticeFileEntry) => void
}) {
  const files = item.files ?? []
  const added = item.addedLines ?? files.reduce((sum, file) => sum + (file.added ?? 0), 0)
  const removed = item.removedLines ?? files.reduce((sum, file) => sum + (file.removed ?? 0), 0)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={`文件改动：${files.length} 个文件，新增 ${added} 行，删除 ${removed} 行`}
          className="group/file-change h-8 w-[280px] max-w-full justify-start gap-2 px-2.5 text-xs font-normal shadow-none max-[720px]:w-full"
        >
          <FolderOpen className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="shrink-0 font-medium">文件改动</span>
          <span className="inline-flex shrink-0 gap-1.5 font-mono text-[11px] tabular-nums">
            <em className="not-italic text-emerald-600 dark:text-emerald-400">+{added}</em>
            <i className="not-italic text-destructive">-{removed}</i>
          </span>
          <span className="ml-auto shrink-0 text-[11px] tabular-nums text-muted-foreground">
            {files.length} 个文件
          </span>
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 group-data-[state=open]/file-change:rotate-90" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={6}
        className="w-[280px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[10px] border-border bg-card p-0 shadow-md"
      >
        <div className="max-h-56 w-full min-w-0 overflow-y-auto overscroll-contain p-1.5" aria-label="文件改动列表">
          <div className="flex w-full min-w-0 flex-col gap-0.5">
            {files.map((file) => (
              <Button
                key={file.id}
                type="button"
                variant="bare"
                className="h-auto min-h-8 w-full min-w-0 justify-start gap-2 rounded-[8px] px-2 py-1 text-left font-mono text-[11.5px] font-normal leading-normal"
                title={file.path}
                onClick={() => onFileOpen?.(file)}
              >
                <FilePath path={file.path} />
                <span className="ml-1 inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] tabular-nums">
                  <em className="not-italic text-emerald-600 dark:text-emerald-400">+{file.added ?? 0}</em>
                  <i className="not-italic text-destructive">-{file.removed ?? 0}</i>
                </span>
              </Button>
            ))}
            {files.length === 0 && (
              <p className="px-1.5 py-2 text-center text-[11px] text-muted-foreground">没有文件改动</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function QueueIconButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="bare"
      size="icon"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

function QueueActions({
  content,
  onGuide,
  onEdit,
  onRemove,
}: {
  content: string
  onGuide?: () => void
  onEdit?: () => void
  onRemove?: () => void
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <QueueIconButton title="立即追加这条消息" aria-label={`追加到当前任务：${content}`} onClick={onGuide}>
        <ArrowUp />
      </QueueIconButton>
      <QueueIconButton title="编辑消息" aria-label={`编辑排队消息：${content}`} onClick={onEdit}>
        <Pencil />
      </QueueIconButton>
      <QueueIconButton
        title="删除"
        aria-label={`删除排队消息：${content}`}
        className="hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/15"
        onClick={onRemove}
      >
        <Trash2 />
      </QueueIconButton>
    </div>
  )
}

/** 与 Android-Tool 排队提示一致：8px 主色圆点 + 外扩呼吸环。 */
function QueueDot() {
  return (
    <span
      aria-hidden="true"
      className="relative mx-0.5 size-2 shrink-0 rounded-full bg-primary before:absolute before:-inset-[3px] before:animate-ping before:rounded-full before:border-[1.5px] before:border-primary before:[animation-duration:1.8s] before:[animation-iteration-count:3] motion-reduce:before:animate-none"
    />
  )
}

function QueueRow({
  message,
  index,
  single,
  dragging,
  editing,
  editingValue,
  onEditingValueChange,
  onBeginEdit,
  onSaveEdit,
  onCancelEdit,
  onGuide,
  onRemove,
  onPointerDown,
  onMove,
}: {
  message: NoticeDetail
  index: number
  single: boolean
  dragging: boolean
  editing: boolean
  editingValue: string
  onEditingValueChange: (value: string) => void
  onBeginEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onGuide?: () => void
  onRemove?: () => void
  onPointerDown?: (event: React.PointerEvent<HTMLButtonElement>) => void
  onMove?: (direction: -1 | 1) => void
}) {
  return (
    <div
      data-queue-id={message.id}
      className={cn(
        "flex min-w-0 items-center",
        single ? "min-h-10 gap-2 px-3 py-1" : "min-h-9 gap-2 px-2.5 py-1",
        !single && index > 0 && "border-t border-border/55",
        dragging && "opacity-50"
      )}
    >
      {single ? (
        <QueueDot />
      ) : (
        <span className="w-[18px] shrink-0 text-center font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}

      {!single && (
        <QueueIconButton
          className="cursor-grab active:cursor-grabbing"
          title="按住拖动调整顺序"
          aria-label={`拖动调整消息顺序：${message.title}`}
          onPointerDown={onPointerDown}
          onKeyDown={(event) => {
            if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
            event.preventDefault()
            onMove?.(event.key === "ArrowUp" ? -1 : 1)
          }}
        >
          <GripVertical />
        </QueueIconButton>
      )}

      {single && (
        <span className="shrink-0 text-xs font-semibold text-foreground">一条追加消息等待中</span>
      )}

      {editing ? (
        <Input
          autoFocus
          value={editingValue}
          aria-label="编辑排队消息"
          className="min-w-0 flex-1"
          onChange={(event) => onEditingValueChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) onSaveEdit()
            if (event.key === "Escape") onCancelEdit()
          }}
          onBlur={onSaveEdit}
        />
      ) : (
        <span className="min-w-0 flex-1 truncate text-xs font-normal text-muted-foreground" title={message.title}>
          {message.title}
        </span>
      )}

      <QueueActions content={message.title} onGuide={onGuide} onEdit={onBeginEdit} onRemove={onRemove} />
    </div>
  )
}

function QueueNotice({
  item,
  expanded,
  onToggle,
  onGuide,
  onEdit,
  onRemove,
  onReorder,
}: {
  item: ComposerNoticeItem
  expanded: boolean
  onToggle: () => void
  onGuide?: (message: NoticeDetail) => void
  onEdit?: (message: NoticeDetail, content: string) => void
  onRemove?: (message: NoticeDetail) => void
  onReorder?: (messageIds: string[]) => void
}) {
  const source = item.details ?? []
  const sourceSignature = source.map((message) => `${message.id}\u0000${message.title}`).join("\u0001")
  const [messages, setMessages] = React.useState(source)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingValue, setEditingValue] = React.useState("")
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const dragRef = React.useRef<{ id: string; pointerId: number; startX: number; startY: number; moved: boolean } | null>(null)

  React.useEffect(() => {
    setMessages(source)
    setEditingId(null)
  }, [sourceSignature])

  const moveById = React.useCallback((fromId: string, toId: string, after: boolean) => {
    setMessages((current) => {
      const fromIndex = current.findIndex((message) => message.id === fromId)
      const toIndex = current.findIndex((message) => message.id === toId)
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return current
      const next = [...current]
      const [moved] = next.splice(fromIndex, 1)
      const targetIndex = next.findIndex((message) => message.id === toId)
      next.splice(targetIndex + (after ? 1 : 0), 0, moved)
      onReorder?.(next.map((message) => message.id))
      return next
    })
  }, [onReorder])

  const moveByOffset = (id: string, offset: -1 | 1) => {
    const index = messages.findIndex((message) => message.id === id)
    const target = messages[index + offset]
    if (target) moveById(id, target.id, offset > 0)
  }

  React.useEffect(() => {
    const findTarget = (event: PointerEvent) =>
      document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-queue-id]")
    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) >= 4) drag.moved = true
    }
    const onPointerUp = (event: PointerEvent) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      const target = findTarget(event)
      const targetId = target?.dataset.queueId
      if (drag.moved && target && targetId && targetId !== drag.id) {
        const rect = target.getBoundingClientRect()
        moveById(drag.id, targetId, event.clientY > rect.top + rect.height / 2)
      }
      dragRef.current = null
      setDraggingId(null)
    }
    const onPointerCancel = () => {
      dragRef.current = null
      setDraggingId(null)
    }
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerCancel)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerCancel)
    }
  }, [moveById])

  const beginEdit = (message: NoticeDetail) => {
    setEditingId(message.id)
    setEditingValue(message.title)
  }
  const saveEdit = (message: NoticeDetail) => {
    const title = editingValue.trim()
    if (title) {
      setMessages((current) => current.map((entry) => entry.id === message.id ? { ...entry, title } : entry))
      onEdit?.(message, title)
    }
    setEditingId(null)
  }
  const removeMessage = (message: NoticeDetail) => {
    setMessages((current) => current.filter((entry) => entry.id !== message.id))
    onRemove?.(message)
  }

  if (messages.length === 0) return null

  const single = messages.length === 1

  return (
    <Card className="w-full gap-0 overflow-hidden rounded-[14px] border-border/70 bg-card/95 py-0 shadow-none">
      {!single && (
        <>
          <Button
            type="button"
            variant="bare"
            aria-expanded={expanded}
            onClick={onToggle}
            className="h-auto min-h-9 w-full justify-start gap-2 rounded-none px-3 py-2 text-left hover:bg-muted/45"
          >
            <QueueDot />
            <span className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">
              {messages.length} 条追加消息等待中
            </span>
            <ChevronRight
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
                expanded && "rotate-90"
              )}
            />
          </Button>
          {expanded && <Separator className="bg-border/55" />}
        </>
      )}

      {!single && expanded && (
        <ScrollArea className="max-h-[190px]" aria-label="等待发送的追加消息" aria-live="polite">
          {messages.map((message, index) => (
            <QueueRow
              key={message.id}
              message={message}
              index={index}
              single={false}
              dragging={draggingId === message.id}
              editing={editingId === message.id}
              editingValue={editingValue}
              onEditingValueChange={setEditingValue}
              onBeginEdit={() => beginEdit(message)}
              onSaveEdit={() => saveEdit(message)}
              onCancelEdit={() => setEditingId(null)}
              onGuide={() => onGuide?.(message)}
              onRemove={() => removeMessage(message)}
              onMove={(direction) => moveByOffset(message.id, direction)}
              onPointerDown={(event) => {
                if (event.button !== 0) return
                dragRef.current = {
                  id: message.id,
                  pointerId: event.pointerId,
                  startX: event.clientX,
                  startY: event.clientY,
                  moved: false,
                }
                setDraggingId(message.id)
              }}
            />
          ))}
        </ScrollArea>
      )}

      {single && (
        <div aria-label="等待发送的追加消息" aria-live="polite">
          <QueueRow
            message={messages[0]}
            index={0}
            single
            dragging={false}
            editing={editingId === messages[0].id}
            editingValue={editingValue}
            onEditingValueChange={setEditingValue}
            onBeginEdit={() => beginEdit(messages[0])}
            onSaveEdit={() => saveEdit(messages[0])}
            onCancelEdit={() => setEditingId(null)}
            onGuide={() => onGuide?.(messages[0])}
            onRemove={() => removeMessage(messages[0])}
          />
        </div>
      )}
    </Card>
  )
}

/**
 * ComposerNoticeDock
 * -----------------------------------------------------------------------------
 * 每一项都是一张 Card；展开内容在同一卡内呈现。文件改动向上悬浮展开，不占位。 */
export function ComposerNoticeDock({
  items,
  className,
  onQueueGuide,
  onQueueEdit,
  onQueueRemove,
  onQueueReorder,
  onFileOpen,
}: ComposerNoticeDockProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(
    items.find((item) => item.defaultExpanded)?.id ?? null
  )

  if (!items || items.length === 0) return null

  return (
    <div className={cn("flex w-full flex-col items-start gap-1.5", className)}>
      {items.map((item) => {
        if (item.kind === "files") {
          return <FilesNotice key={item.id} item={item} onFileOpen={(file) => onFileOpen?.(item, file)} />
        }
        if (item.kind === "queue") {
          return (
            <QueueNotice
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
              onGuide={(message) => onQueueGuide?.(item, message)}
              onEdit={(message, content) => onQueueEdit?.(item, message, content)}
              onRemove={(message) => onQueueRemove?.(item, message)}
              onReorder={(ids) => onQueueReorder?.(item, ids)}
            />
          )
        }

        const tone = toneOf[item.kind]
        const Icon = tone.icon
        const expanded = expandedId === item.id
        const contentId = `${item.id}-content`

        return (
          <section
            key={item.id}
            className={cn("w-full min-w-0 overflow-hidden rounded-[14px] border bg-card shadow-sm", tone.edge)}
            aria-label={item.label}
          >
            <Button
              type="button"
              variant="bare"
              aria-expanded={expanded}
              aria-controls={expanded ? contentId : undefined}
              onClick={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
              className="h-auto min-h-9 w-full justify-start gap-2 rounded-none border-0 px-3 py-1 text-left text-foreground hover:bg-muted/45"
            >
              <span className={cn("flex shrink-0 items-center justify-center", item.running ? "size-5" : "size-[15px]", tone.accent)}>
                {item.running ? <StepSpinner size={20} /> : <Icon className="size-[15px]" />}
              </span>
              <span className={cn("shrink-0 text-xs font-medium", tone.text)}>{item.label}</span>
              <span className="min-w-0 flex-1 truncate text-xs font-normal text-muted-foreground">{item.summary}</span>
              <span className="ml-1 flex shrink-0 items-center gap-1.5">
                {item.count != null && <span className="text-[11px] tabular-nums text-muted-foreground">{item.count}</span>}
                {item.badge && (
                  <Badge variant={item.attention ? "secondary" : "muted"} className="h-5 px-1.5 text-[10.5px]">
                    {item.badge}
                  </Badge>
                )}
                <ChevronRight
                  className={cn(
                    "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
                    expanded && "rotate-90"
                  )}
                />
              </span>
            </Button>

            {expanded && (
              <div id={contentId} className="min-w-0 border-t border-border/60 px-3 py-2.5 text-xs text-foreground">
                {item.actions && <div className="mb-2 flex flex-wrap items-center justify-end gap-2">{item.actions}</div>}
                {item.content ?? (item.details ? <NoticeDetailList details={item.details} /> : null)}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
