import React from "react";
/**
 * Spinner
 * ---------------------------------------------------------------------------
 * 全站唯一的「正在处理」旋转图标。以前各处把 `.inline-spin` / `.ui-compaction-spin`
 * / `.chat-background-spinner` 挂到通用图标上，同一份 keyframes 写了三遍、三套时长。
 * 几何、旋转、reduced-motion 和取色都在这里，调用方只决定大小。
 *
 * 形状是一条圆头弧线，尾巴用同色渐变收细到近乎透明：转起来像一点点把光甩出去，
 * 比等粗的空心圈更能说明「还在动」。颜色一律走 `currentColor`——同一条状态行里它
 * 要读成中性灰，压在强调色条上又要读成强调色。
 */
export type SpinnerProps = {
  /** 图标边长（px），与图标栅格对齐（默认 14）。 */
  size?: number;
  strokeWidth?: number;
  /**
   * 读屏名。旁边已经有可见进度文字时不要传，此时它是装饰，自动 aria-hidden。
   */
  label?: string;
  className?: string;
};

/** 按 r=9 的周长（≈56.5）切：34 是可见的尾巴，23 是留白。 */
const ARC_DASH = "34 23";

export const Spinner: React.FC<SpinnerProps> = ({ size = 14, strokeWidth = 2.3, label, className }) => {
  // 渐变必须每个实例一个 id：一屏同时挂着十几颗，复用 id 时最先卸载的那颗会让其余
  // 的全部引用不到渐变（Chromium 直接按透明描边画，图标就「消失」了）。
  const gradientId = `ui-spinner-tail-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={["ui-spinner", className].filter(Boolean).join(" ")}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} x1="12" y1="22" x2="12" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0.02" stopColor="currentColor" stopOpacity="0.12" />
          <stop offset="0.55" stopColor="currentColor" stopOpacity="0.7" />
          <stop offset="1" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={ARC_DASH}
      />
    </svg>
  );
};

export default Spinner;
