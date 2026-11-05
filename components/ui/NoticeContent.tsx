import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { ArrowUp, ChevronRight, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Input } from "./Input";
import type { FileChangeEntry, FileChangeStatus } from "./FileChangeCard";

export function NoticePermissionContent({ command, environment, instruction, busy, onInstructionChange, onResolve }: {
  command?: string; environment?: string; instruction?: string; busy?: boolean;
  onInstructionChange?: (value: string) => void;
  onResolve?: (decision: "once" | "session" | "deny" | "other") => void;
}) {
  return <div className="ui-notice-body-stack" aria-busy={busy}>
    {environment && <small className="ui-notice-detail">{environment}</small>}
    {command && <pre className="ui-notice-code" aria-label="待批准的调用参数"><code>{command}</code></pre>}
    <div className="ui-notice-body-actions">
      <Button variant="primary" size="xs" disabled={busy} onClick={() => onResolve?.("once")}>允许一次</Button>
      <Button variant="secondary" size="xs" disabled={busy} onClick={() => onResolve?.("session")}>本会话允许</Button>
      <Button variant="danger" size="xs" disabled={busy} onClick={() => onResolve?.("deny")}>拒绝</Button>
    </div>
    {onInstructionChange && <div className="ui-notice-reply">
      <Input size="sm" variant="surface" value={instruction ?? ""} disabled={busy} maxLength={8000} aria-label="回复执行说明"
        placeholder="输入调整要求或限制，交给 AI 重新处理"
        onChange={(event) => onInstructionChange(event.target.value)} onKeyDown={(event) => {
          if (event.key === "Enter" && !event.nativeEvent.isComposing && instruction?.trim() && !busy) {
            event.preventDefault(); onResolve?.("other");
          }
        }} />
      <Button variant="primary" size="xs" loading={busy} disabled={busy || !instruction?.trim()} onClick={() => onResolve?.("other")}>回复说明</Button>
    </div>}
  </div>;
}

/** 追加消息的蓝点：8px 实心点 + 呼吸环。环靠 `inset: -3px` 定位，放大到 2.4 倍
 *  时仍与点同心；用负 margin 定位的旧写法一放大就会偏心，是这个图标的病根。 */
export function NoticeQueueDot({ className }: { className?: string }) {
  return <span aria-hidden="true" className={clsx("ui-notice-queue-dot", className)} />;
}

/**
 * AI 询问的回答区。
 * 建议答案排成一行（放不下才换行），点它就是直接交付这条回答，不需要再按一次「回答」。
 * 末行是自由输入的输入框，右侧跟着「回答 / 跳过」——两个动作都在输入框右边，
 * 所以「跳过」必须是实心控件（`subtle` 是透明变体，落在这里会看不见）。
 */
export function NoticeQuestionContent({ options, value, busy, onChange, onAnswer, onSkip }: {
  options: string[]; value: string; busy?: boolean; onChange: (value: string) => void;
  onAnswer?: (value: string) => void; onSkip?: () => void;
}) {
  const submit = (answer: string) => {
    const text = answer.trim();
    if (busy || !text) return;
    onAnswer?.(text);
  };
  return <div className="ui-notice-body-stack" aria-busy={busy}>
    {options.length > 0 && <div className="ui-notice-answer-list" aria-label="建议答案">
      {options.map((option) => <Button key={option} variant="secondary" size="xs" className="ui-notice-answer-option"
        disabled={busy} title={`回答：${option}`} onClick={() => submit(option)}>
        <span className="ui-notice-answer-text">{option}</span>
      </Button>)}
    </div>}
    <div className="ui-notice-reply">
      <Input size="md" variant="surface" placeholder="或输入自己的回答" value={value} disabled={busy} maxLength={8000} aria-label="回答 AI"
        onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => {
          if (event.key === "Enter" && !event.nativeEvent.isComposing) {
            event.preventDefault(); submit(value);
          }
        }} />
      <Button variant="primary" size="md" loading={busy} disabled={busy || !value.trim()} onClick={() => submit(value)}>回答</Button>
      <Button variant="secondary" size="md" className="btn-danger-hover" disabled={busy} onClick={onSkip}>跳过</Button>
    </div>
  </div>;
}

export function NoticeQueueRow({ queueId, content, preview, busy, onGuide, onEdit, onRemove, onMove, onPointerDown, dragging, index, single }: {
  queueId: string; content: string; preview?: ReactNode; busy?: "guide" | "edit" | "remove" | "reorder";
  onGuide?: () => void; onEdit?: () => void; onRemove?: () => void; onMove?: (direction: -1 | 1) => void;
  onPointerDown?: (event: React.PointerEvent<HTMLButtonElement>) => void;
  dragging?: boolean; index?: number; single?: boolean;
}) {
  // 单条和多条只差「行首怎么起头」：单条不提行号、不提拖拽柄、也不再写一遍「等待中」——
  // 卡头已经写着「一条追加消息等待中：」，行里再说一次就是同一句话出现两遍。多条保持
  // 01/02/… 行号 + 拖拽柄的列表形态，抬头那句「N 条追加消息等待中」由卡片汇总头负责。
  // 附件缩略图统一排在最前面（缩略图 → 正文 → 按钮），正文只吃到按钮左侧为止。
  return <div className={`ui-notice-queue-row${dragging ? " is-dragging" : ""}${single ? " is-single" : ""}`} data-queue-id={queueId} aria-busy={Boolean(busy)}>
      {single ? <span className="ui-notice-queue-dot" aria-hidden="true" /> : index != null && <span className="ui-notice-queue-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
      {!single && <Button variant="bare" className="ui-notice-queue-drag" title="按住拖动调整顺序" aria-label={`拖动调整消息顺序：${content}`} onPointerDown={onPointerDown} onKeyDown={event => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); onMove?.(event.key === "ArrowUp" ? -1 : 1); }
      }} disabled={Boolean(busy)} icon={<GripVertical size={16} />} />}
      {single && <span className="ui-notice-queue-single-label">一条追加消息等待中：</span>}
      {preview}
      <span className={`ui-notice-queue-text${single ? " is-single-text" : ""}`} title={content}>{content}</span>
      <NoticeQueueActions content={content} busy={busy} onGuide={onGuide} onEdit={onEdit} onRemove={onRemove} />
  </div>;
}

/** 排队消息的三个动作按钮。单条形态不渲染行列表，抬头就是那一条消息，所以这组按钮
    会被 `ChatQueuePanel` 直接挂到卡片抬头（`actions`）上——组件只有一份，两处都用它。 */
export function NoticeQueueActions({ content, busy, onGuide, onEdit, onRemove }: {
  content: string; busy?: "guide" | "edit" | "remove" | "reorder";
  onGuide?: () => void; onEdit?: () => void; onRemove?: () => void;
}) {
  return <div className="ui-notice-queue-actions">
    <Button variant="bare" className="ui-notice-queue-send" title="追加到当前任务（立即发出这条消息）" aria-label={`追加到当前任务：${content}`} icon={<ArrowUp size={15} />} loading={busy === "guide"} disabled={Boolean(busy)} onClick={onGuide} />
    <Button variant="bare" title="编辑消息" aria-label={`编辑排队消息：${content}`} icon={<Pencil size={15} />} disabled={Boolean(busy)} onClick={onEdit} />
    <Button variant="bare" className="btn-danger-hover" title="删除" aria-label={`删除排队消息：${content}`} icon={<Trash2 size={15} />} loading={busy === "remove"} disabled={Boolean(busy)} onClick={onRemove} />
  </div>;
}

export function NoticeFileList({ files, workspacePath, onOpen, onRowContextMenu }: {
  files: FileChangeEntry[]; workspacePath?: string; onOpen?: (path: string) => void;
  onRowContextMenu?: (path: string, status: FileChangeStatus, position: { x: number; y: number }, trigger: HTMLElement) => void;
}) {
  const root = workspacePath?.replace(/\\/g, "/").replace(/\/+$/, "");
  return <div className="ui-notice-file-list">{files.map((file) => {
    const normalized = file.path.replace(/\\/g, "/");
    const path = root && normalized.toLowerCase().startsWith(`${root.toLowerCase()}/`) ? normalized.slice(root.length + 1) : normalized;
    return <Button key={`${file.status}-${file.path}`} variant="bare" className={`ui-notice-file-row is-${file.status}`} title={file.path}
      onClick={() => onOpen?.(file.path)} onContextMenu={(event) => {
        if (!onRowContextMenu) return;
        event.preventDefault(); onRowContextMenu(file.path, file.status, { x: event.clientX, y: event.clientY }, event.currentTarget);
      }} onKeyDown={(event) => {
        if (!onRowContextMenu || !(event.key === "ContextMenu" || (event.shiftKey && event.key === "F10"))) return;
        event.preventDefault(); const rect = event.currentTarget.getBoundingClientRect();
        onRowContextMenu(file.path, file.status, { x: rect.left, y: rect.bottom }, event.currentTarget);
      }}>
      <span>{path}</span>
      {file.addedLines != null && <em>+{file.addedLines}</em>}
      {file.removedLines != null && <i>−{file.removedLines}</i>}
    </Button>;
  })}</div>;
}

export function NoticeBackgroundTask({ title, log, running, stopping, onStop, meta, children, error, defaultExpanded = true }: {
  title: string; log: string; running?: boolean; stopping?: boolean; onStop?: () => void;
  meta?: ReactNode; children?: ReactNode; error?: string | null; defaultExpanded?: boolean;
}) {
  const logRef = useRef<HTMLPreElement>(null);
  const follow = useRef(true);
  const contentId = useId();
  // 每个子任务自己一层折叠：任务多的时候只剩一排标题行，展开哪一个看哪一个。
  const [expanded, setExpanded] = useState(defaultExpanded);
  useEffect(() => {
    if (expanded && logRef.current && follow.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log, expanded]);
  return <div className={`ui-notice-background-task${expanded ? " is-expanded" : " is-collapsed"}`}>
    <div className="ui-notice-background-heading">
      <Button variant="bare" className="ui-notice-background-toggle" aria-expanded={expanded} aria-controls={contentId}
        title={expanded ? "收起这个任务" : "展开这个任务"} onClick={() => setExpanded((current) => !current)}>
        <ChevronRight size={13} className="ui-notice-background-chevron" />
        <span>{title}</span>
      </Button>
      {meta}
      {running && <Button variant="secondary" size="xs" disabled={stopping} onClick={onStop}>{stopping ? "正在停止" : "停止"}</Button>}
    </div>
    {/* 报错不受折叠影响：失败的提示永远要看得见。 */}
    {error && <p className="ui-notice-error" role="alert">{error}</p>}
    <div id={contentId} className="ui-notice-background-body" hidden={!expanded}>
      <pre className="ui-notice-code ui-notice-background-log" aria-label="后台任务实时日志" tabIndex={0} ref={logRef} onScroll={(event) => {
        const element = event.currentTarget; follow.current = element.scrollHeight - element.clientHeight - element.scrollTop < 28;
      }}><code>{log || "等待命令输出…"}</code></pre>
      {/* 任务详情 is a block of its own: the title row and the log surface above
          it are already separate filled panels, so the details list must not sit
          bare on the notice background — it gets the library Card shell. */}
      {children && <Card className="ui-notice-background-detail">{children}</Card>}
    </div>
  </div>;
}
