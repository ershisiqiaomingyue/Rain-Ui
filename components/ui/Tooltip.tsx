import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * 气泡提示。
 *
 * 旧写法把气泡宽度直接写成 `360px` 再居中：图标按钮只有 27px 宽，悬停时却弹出
 * 一条 320px 起跳的长条，把旁边的导航项整片盖住——看起来像「hover 区域很大」，
 * 其实是气泡本身太宽。现在气泡宽度由内容决定（上限 320px），位置在挂载后按
 * 实测尺寸摆放，并且真的会翻到下方。
 */
export function Tooltip({ content, children, className = "" }: {
  content: string;
  children: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const trigger = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  const [anchor, setAnchor] = useState<{ x: number; top: number; bottom: number }>();
  const [position, setPosition] = useState<React.CSSProperties>();

  const show = () => {
    const rect = trigger.current?.getBoundingClientRect();
    if (!rect) return;
    setAnchor({ x: rect.left + rect.width / 2, top: rect.top, bottom: rect.bottom });
  };
  const hide = () => {
    setAnchor(undefined);
    setPosition(undefined);
  };
  const hideRef = useRef(hide);
  hideRef.current = hide;

  useLayoutEffect(() => {
    const tip = bubble.current;
    if (!anchor || !tip) return;
    const { width, height } = tip.getBoundingClientRect();
    const margin = 8;
    const gap = 8;
    const left = Math.max(margin, Math.min(anchor.x - width / 2, window.innerWidth - width - margin));
    const top = anchor.top > height + gap + margin ? anchor.top - height - gap : anchor.bottom + gap;
    setPosition({ left, top });
  }, [anchor]);

  useEffect(() => {
    if (!anchor) return;
    const onResize = () => hideRef.current();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") hideRef.current(); };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [anchor]);

  return (
    <span
      ref={trigger}
      className={`ui-tooltip-trigger ${className}`}
      aria-describedby={anchor ? id : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {anchor && createPortal(
        <span
          ref={bubble}
          id={id}
          role="tooltip"
          className="ui-tooltip"
          style={{ ...position, visibility: position ? undefined : "hidden" }}
        >
          {content}
        </span>,
        document.body,
      )}
    </span>
  );
}
