import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";

export interface ContextMenuItem {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  checked?: boolean;
  /** 破坏性动作（删除/移除）：文字与图标走危险色，和普通项区分开。 */
  danger?: boolean;
  onSelect: () => void;
}

export function ContextMenu({ x, y, label, items, trigger, onClose, placement = "bottom-start" }: {
  x: number;
  y: number;
  label: string;
  items: readonly ContextMenuItem[];
  trigger: HTMLElement;
  onClose: () => void;
  /**
   * 相对鼠标的位置：bottom-start 左下（默认）/ bottom-end 右下 / top-start 左上 / top-end 右上。
   * 贴边放不下时自动朝反方向翻，不会跑出视口。
   */
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: x, top: y });
  useLayoutEffect(() => {
    const menu = ref.current;
    if (!menu) return;
    const { width, height } = menu.getBoundingClientRect();
    const gap = 2;
    const margin = 8;
    const [vSide, hSide] = placement.split("-") as ["bottom" | "top", "start" | "end"];

    // 水平：start = 菜单左边贴指针（往右下展开），end = 菜单右边贴指针（往左下展开）
    let left = hSide === "start" ? x : x - width;
    if (left + width > window.innerWidth - margin) left = x - width;
    if (left < margin) left = x;
    left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));

    // 垂直：优先按 placement 走，但以「哪边放得下」为准。
    // 旧写法先算 bottom，再在放不下时翻到 top，最后又用
    // `if (top < margin) top = y + gap` 无条件翻回去——所以贴近底部的触发点
    // （比如列表最后一行、输入框上方的文件改动入口）永远只能向下展开，
    // 于是撑出视口或被裁掉。现在先量两侧空间，挑得下且更大的一侧，只有当
    // 两侧都放不下时才夹到视口内。
    const spaceBelow = window.innerHeight - y - gap - margin;
    const spaceAbove = y - gap - margin;
    const preferBottom = vSide === "bottom";
    const fits = (space: number) => space >= height;
    const openDown = fits(spaceBelow) && fits(spaceAbove)
      ? preferBottom
      : fits(spaceBelow)
        ? true
        : fits(spaceAbove)
          ? false
          : spaceBelow >= spaceAbove;
    const top = openDown ? y + gap : y - height - gap;
    setPosition({ left, top: Math.max(margin, Math.min(top, window.innerHeight - height - margin)) });
    menu.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus({ preventScroll: true });
  }, [x, y, placement]);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    // 打开时的锚点位置。滚动事件会从任何滚动容器冒到 window（捕获阶段也能收到），
    // 包括侧栏标题的悬停滚动——那种位移不改变锚点，菜单必须留着。只有锚点真的
    // 被滚走（或随列表消失）时才关。
    const anchor = trigger.getBoundingClientRect();
    const anchorMoved = () => {
      if (!trigger.isConnected) return true;
      const rect = trigger.getBoundingClientRect();
      return Math.abs(rect.top - anchor.top) > 1 || Math.abs(rect.left - anchor.left) > 1;
    };
    const close = () => closeRef.current();
    const outside = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node)) close(); };
    const scrolled = () => { if (anchorMoved()) close(); };
    window.addEventListener("pointerdown", outside, true);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", scrolled, true);
    window.addEventListener("blur", close);
    return () => {
      window.removeEventListener("pointerdown", outside, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", scrolled, true);
      window.removeEventListener("blur", close);
    };
  }, [trigger]);

  return createPortal(<div ref={ref} className="context-menu" role="menu" aria-label={label} style={position} onContextMenu={(event) => event.preventDefault()} onKeyDown={(event) => {
    if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") { event.preventDefault(); trigger.focus({ preventScroll: true }); }
      event.stopPropagation(); onClose(); return;
    }
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : event.key === "ArrowDown" ? (current + 1) % buttons.length : event.key === "ArrowUp" ? (current - 1 + buttons.length) % buttons.length : undefined;
    if (next !== undefined) { event.preventDefault(); buttons[next]?.focus(); }
  }}>
    {items.map((item, index) => <button key={index} type="button" role="menuitem" disabled={item.disabled} className={item.danger ? "is-danger" : undefined} onClick={() => {
      onClose(); trigger.focus({ preventScroll: true }); item.onSelect();
    }}>{item.icon}<span>{item.label}</span>{item.checked && <Check className="context-menu-check" aria-hidden="true" size={14} />}</button>)}
  </div>, document.body);
}
