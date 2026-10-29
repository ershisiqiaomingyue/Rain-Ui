import React, { useEffect, useMemo, useRef, useState } from "react";
import { NoticePanel } from "./NoticePanel";
import { NoticeQueueRow } from "./NoticeContent";

/**
 * ChatQueuePanel
 * ---------------------------------------------------------------------------
 * 「追加消息」排队面板。两种形态由消息条数决定：
 *
 *   单条 —— 抬头就是「一条追加消息等待中：<正文>」，三个动作按钮挂在行尾，
 *           不再有可折叠的汇总头（`.ui-notice-heading` 由 CSS 隐藏）。
 *   多条 —— 抬头报一句「N 条追加消息等待中」+ 展开箭头，展开后是 01/02 行列表。
 *
 * 删到只剩一条时自动退回单条形态。拖拽改顺序、键盘上/下移、引导/编辑/删除
 * 三个动作都保留。外层复用库里的 NoticePanel（inline + collapsible），因此
 * 外壳、圆角、描边、动效与其它通知完全同源，不引入第二套视觉。
 */

export type ChatQueueItem = {
  id: string;
  content: string;
  /** 行首选挂的附件预览（缩略图 / 文件名 chip），由调用方决定。 */
  preview?: React.ReactNode;
};

export type ChatQueueBusy = "guide" | "edit" | "remove" | "reorder";

export type ChatQueuePanelProps = {
  items: ChatQueueItem[];
  /** 每条消息正忙的动作，按钮据此显示 loading / 禁用。 */
  busy?: Record<string, ChatQueueBusy>;
  onGuide?: (queueId: string) => void;
  onEdit?: (item: ChatQueueItem) => void;
  onRemove?: (queueId: string) => void;
  /** 返回 false 表示重排被拒绝，内部会回滚顺序。 */
  onReorder?: (queueIds: string[]) => boolean | Promise<boolean>;
  className?: string;
};

export function ChatQueuePanel({
  items,
  busy = {},
  onGuide,
  onEdit,
  onRemove,
  onReorder,
  className,
}: ChatQueuePanelProps) {
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState("");
  const pointerDrag = useRef<{ id: string; pointerId: number; startX: number; startY: number; moved: boolean } | null>(null);

  // 显示顺序：先按用户拖拽过的 orderedIds，再把新到达的消息按原序补在后面。
  const displayItems = useMemo(() => {
    if (!orderedIds.length) return items;
    const byId = new Map(items.map((item) => [item.id, item]));
    return [
      ...orderedIds.map((id) => byId.get(id)).filter((item): item is ChatQueueItem => Boolean(item)),
      ...items.filter((item) => !orderedIds.includes(item.id)),
    ];
  }, [items, orderedIds]);

  // 源列表变了（增删）就清掉本地顺序，避免记录已不存在的 id。
  const sourceOrder = items.map((item) => item.id).join(" ");
  useEffect(() => setOrderedIds([]), [sourceOrder]);

  const moveItem = async (fromId: string, toId: string, after: boolean) => {
    const index = displayItems.findIndex((item) => item.id === fromId);
    const targetIndex = displayItems.findIndex((item) => item.id === toId);
    if (index < 0 || targetIndex < 0 || index === targetIndex) return;
    const next = [...displayItems];
    const [moved] = next.splice(index, 1);
    const adjustedTarget = next.findIndex((item) => item.id === toId);
    next.splice(adjustedTarget + (after ? 1 : 0), 0, moved);
    const ids = next.map((item) => item.id);
    setOrderedIds(ids);
    if (onReorder && !(await onReorder(ids))) setOrderedIds([]);
  };

  // 指针拖拽：4px 才算移动；松手时按落点行的上/下半区决定插到前还是后。
  useEffect(() => {
    const findTarget = (event: PointerEvent) =>
      document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>(".ui-notice-queue-row[data-queue-id]");
    const handleMove = (event: PointerEvent) => {
      const drag = pointerDrag.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) >= 4) drag.moved = true;
    };
    const handleUp = (event: PointerEvent) => {
      const drag = pointerDrag.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const target = findTarget(event);
      const targetId = target?.dataset.queueId;
      if (drag.moved && target && targetId && targetId !== drag.id) {
        const box = target.getBoundingClientRect();
        void moveItem(drag.id, targetId, event.clientY > box.top + box.height / 2);
      }
      pointerDrag.current = null;
      setDraggingId("");
    };
    const handleCancel = (event: PointerEvent) => {
      if (pointerDrag.current?.pointerId !== event.pointerId) return;
      pointerDrag.current = null;
      setDraggingId("");
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayItems]);

  if (!items.length) return null;

  const single = displayItems.length === 1;
  const headingSummary = single ? undefined : (
    <span className="ui-notice-queue-single-label">{displayItems.length} 条追加消息等待中</span>
  );

  return (
    <NoticePanel
      label=""
      summary=""
      summaryContent={headingSummary}
      inline
      collapsible={!single}
      defaultExpanded
      className={className}
    >
      <section
        className={`ui-notice-queue-list${single ? " is-single" : ""}`}
        aria-label="等待发送的追加消息"
        aria-live="polite"
      >
        {displayItems.map((item, index) => {
          const action = busy[item.id];
          return (
            <NoticeQueueRow
              key={item.id}
              queueId={item.id}
              content={item.content}
              busy={action}
              dragging={draggingId === item.id}
              index={index}
              single={single}
              preview={item.preview}
              onGuide={() => onGuide?.(item.id)}
              onEdit={() => onEdit?.(item)}
              onRemove={() => onRemove?.(item.id)}
              onMove={(direction) => {
                const target = displayItems[index + direction];
                if (target) void moveItem(item.id, target.id, direction > 0);
              }}
              onPointerDown={(event) => {
                if (event.button !== 0 || displayItems.length < 2 || action) return;
                event.preventDefault();
                pointerDrag.current = { id: item.id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
                setDraggingId(item.id);
              }}
            />
          );
        })}
      </section>
    </NoticePanel>
  );
}

export default ChatQueuePanel;
