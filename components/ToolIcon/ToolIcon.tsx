import type { ReactNode } from "react";

interface ToolIconProps {
  children: ReactNode;
  /** md = 36px（默认），sm = 24px（列表行内），lg = 44px（工具页页头） */
  size?: "sm" | "md" | "lg";
  /** neutral：中性底 + 次要色描边；不传则用强调色（留给「当前工具」） */
  tone?: "accent" | "neutral";
  className?: string;
}

export function ToolIcon({ children, size = "md", tone = "accent", className = "" }: ToolIconProps) {
  const classes = ["tool-icon", size === "md" ? "" : `is-${size}`, tone === "neutral" ? "is-neutral" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={classes} aria-hidden="true">
      {children}
    </span>
  );
}
