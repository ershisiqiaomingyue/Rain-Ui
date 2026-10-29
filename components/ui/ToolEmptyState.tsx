import React from "react";

/**
 * ToolEmptyState
 * ---------------------------------------------------------------------------
 * An empty region, not an illustration. Two lines of text plus the action that
 * fills it. The dashed circle that used to sit here read as a loading spinner,
 * so it is gone: an empty state must never look like work in progress.
 */
export const ToolEmptyState: React.FC<{
  title: string;
  description?: string;
  compact?: boolean;
  /** The thing the user can do right now, e.g. <Button size="sm">连接设备</Button>. */
  action?: React.ReactNode;
}> = ({ title, description, compact, action }) => (
  <div className={`tool-empty-state${compact ? " compact" : ""}`} role="status">
    <div className="tool-empty-copy">
      <span className="tool-empty-title">{title}</span>
      {description && <p>{description}</p>}
    </div>
    {action && <div className="tool-empty-action">{action}</div>}
  </div>
);
