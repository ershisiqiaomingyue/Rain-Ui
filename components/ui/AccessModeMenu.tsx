import { useEffect, useRef, type RefObject } from "react";
import { AppIcon } from "../../src/components/icons/AppIcon"

export type AccessMode = "ask" | "risk" | "full";

const modes = [
  // 描述一律压到一行：菜单是选档位用的，不是说明书，长了就没人读。
  { value: "ask", label: "请求批准", description: "执行命令、写入文件时始终询问" },
  { value: "risk", label: "替我审批", description: "只读操作自动执行，其余请求批准" },
  // G3-D：语义诚实——这是权限模式不是沙盒。full = 完全信任（无隔离）：
  // 模型生成的命令与你本人的权限完全相同，没有任何强制边界兜底。
  { value: "full", label: "完全信任（无隔离）", description: "以你的完整权限执行，无沙箱隔离" },
] as const;

/** Selection only: the caller retains approval and full-access confirmation. */
export function AccessModeMenu({ value, onChange, inline = false, onClose, triggerRef }: {
  value: AccessMode;
  onChange: (value: AccessMode) => void;
  inline?: boolean;
  onClose?: () => void;
  triggerRef?: RefObject<HTMLElement>;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (inline || !onClose) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!root.current?.contains(target) && !triggerRef?.current?.contains(target)) onClose();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onClose();
      triggerRef?.current?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", escape, true);
    return () => {
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", escape, true);
    };
  }, [inline, onClose, triggerRef]);
  return <div ref={root} className={`ui-access-menu${inline ? " is-inline" : ""}`} role="group" aria-label="Agent 操作审批方式">
    <div className="ui-access-menu-heading">应如何批准 Agent 操作？</div>
    {modes.map((mode) => <button key={mode.value} type="button" className={`ui-access-menu-row${value === mode.value ? " is-selected" : ""}${mode.value === "full" ? " is-full" : ""}`}
      aria-pressed={value === mode.value} onClick={() => onChange(mode.value)}>
      <span><b>{mode.label}</b><small>{mode.description}</small></span>
      <AppIcon name="check"
        size={14}
        aria-hidden="true"
        className={`ui-access-menu-check${value === mode.value ? "" : " is-placeholder"}`}
      />
    </button>)}
  </div>;
}
