import React from "react";
import { AppIcon } from "../../src/components/icons/AppIcon"
import { Spinner } from "./Spinner";

/**
 * CompactionProgress
 * ---------------------------------------------------------------------------
 * The context-compaction strip that sits above the composer. It is NOT a
 * NoticePanel: it has no header to click and no collapse. It is a single status
 * line plus a determinate track.
 *
 * Running and completed are one continuous strip, not two different widgets:
 * the same row, the same track and the same percent slot, so the moment the
 * compaction finishes the line does not jump, resize or re-order — the spinner
 * hands over to the neutral glyph and the track settles at 100%. `detail`
 * carries the sentence the caller builds, e.g. "12,400 → 3,200 Token" when
 * finished, or the message counts while running.
 *
 * In `row` mode the percent is only drawn while running: once it is finished the
 * detail already states the real numbers, and "Token 100%" on every past
 * compaction reads as a success badge that means nothing.
 */

export type CompactionStatus = "running" | "completed" | "interrupted" | "failed";

export type CompactionProgressProps = {
  status: CompactionStatus;
  /** 0-100. Omitted for states that cannot report progress. */
  progress?: number | null;
  /** Secondary sentence under the label. */
  detail?: React.ReactNode;
  className?: string;
  /**
   * `strip`（默认）= 独立状态条，带进度轨。
   * `row` = 作为时间线里的一行渲染：没有外框与进度轨，与「执行指令」那种
   * 工具组行同高、同缩进，只留图标 + 标签 + 明细 + 百分比文字。
   */
  variant?: "strip" | "row";
};

const LABEL: Record<CompactionStatus, string> = {
  running: "正在压缩上下文",
  completed: "上下文已压缩",
  interrupted: "上下文压缩已中断",
  failed: "上下文压缩失败",
};

const ICON: Record<CompactionStatus, React.ReactNode> = {
  running: <Spinner size={14} />,
  // 和工具行同一套：图标回答「做了什么」（把旧消息归档成检查点），状态交给颜色
  // 和文案。以前这里是「蓝底 + 白勾」的圆片，时间线上于是出现第二种图标家族，
  // 而且每个已完成行都在喊「成功」——压缩完成不是成功，是它发生了。
  completed: <AppIcon name="archive" size={14} strokeWidth={1.9} />,
  interrupted: <AppIcon name="circle-dashed" size={14} strokeWidth={1.9} />,
  failed: <AppIcon name="alert" size={14} strokeWidth={1.9} />,
};

export const CompactionProgress: React.FC<CompactionProgressProps> = ({
  status,
  progress,
  detail,
  className,
  variant = "strip",
}) => {
  const row = variant === "row";
  const showTrack = status === "running" || status === "completed";
  // A running compaction whose backend has not reported a percentage yet still
  // shows the track: it sweeps instead of jumping from nothing to a number.
  const indeterminate = status === "running" && progress == null;
  const value = status === "completed" ? 100 : Math.min(100, Math.max(0, progress ?? 0));
  const percentText = indeterminate ? "…" : `${Math.round(value)}%`;

  return (
    <div
      className={["ui-compaction", `is-${status}`, row ? "is-row" : "", className].filter(Boolean).join(" ")}
      data-status={status}
      role="status"
      aria-live="polite"
    >
      <div className="ui-compaction-copy">
        <span className="ui-compaction-icon" aria-hidden="true">{ICON[status]}</span>
        <span className="ui-compaction-label">{LABEL[status]}</span>
        {row && detail && <small className="ui-compaction-detail">{detail}</small>}
      </div>
      {!row && showTrack && (
        <>
          <div
            className={`ui-compaction-track${indeterminate ? " is-indeterminate" : ""}`}
            role="progressbar"
            aria-label={LABEL[status]}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={indeterminate ? undefined : Math.round(value)}
          >
            <span style={indeterminate ? undefined : { width: `${value}%` }} />
          </div>
          <span className="ui-compaction-percent">{percentText}</span>
        </>
      )}
      {row && status === "running" && (
        <span className="ui-compaction-percent">{percentText}</span>
      )}
      {!row && detail && <small className="ui-compaction-detail">{detail}</small>}
    </div>
  );
};

export default CompactionProgress;
