import React, { useEffect, useRef, useState } from "react";

/** 本实现上收自 Android-Toolkit：token 化的默认色（--primary 三档渐变）、
 *  动画帧率封顶、visibility 感知。库里的旧版写死蓝紫渐变，已由这份取代。 */

export interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  followPointer?: boolean;
  colors?: string[];
  backgroundColor?: string;
  /** 默认走库的浮层圆角；调用方要精确值时传 CSS 长度或数字。 */
  borderRadius?: number | string;
  borderWidth?: number;
}

// 默认值全部指向库的 token：以前这里是写死的 #6699ff / #8eb4ff / #6f8fbf 三段
// 蓝紫渐变 + 写死白底，暗色主题下整圈边缘泛白，换配色时也不跟着变。
const DEFAULT_COLORS = [
  "hsl(var(--primary) / 0.55)",
  "hsl(var(--primary) / 0.26)",
  "hsl(var(--primary) / 0.08)",
];

export const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className,
  animated = false,
  followPointer = true,
  colors = DEFAULT_COLORS,
  backgroundColor = "hsl(var(--card))",
  borderRadius = "var(--radius-overlay)",
  borderWidth = 2,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!animated) return;
    let frame = 0;
    let lastPaint = 0;
    let active = document.visibilityState === "visible";
    const started = performance.now();
    const tick = (now: number) => {
      if (!active) {
        frame = 0;
        return;
      }
      // The glow is decorative. Capping it at roughly 30fps avoids keeping a
      // hidden or stalled desktop WebView on a permanent 60fps render loop.
      if (now - lastPaint < 33) {
        frame = requestAnimationFrame(tick);
        return;
      }
      lastPaint = now;
      const progress = ((now - started) % 3600) / 3600;
      const angle = 110 + progress * 360;
      const radians = (angle * Math.PI) / 180;
      const layer = layerRef.current;
      if (layer) {
        layer.style.setProperty("--glow-point", `${(50 + Math.sin(radians) * 48).toFixed(2)}% ${(50 - Math.cos(radians) * 48).toFixed(2)}%`);
        layer.style.setProperty("--glow-opacity", `${0.72 + Math.sin(progress * Math.PI * 2) * 0.18}`);
      }
      frame = requestAnimationFrame(tick);
    };
    const onVisibilityChange = () => {
      active = document.visibilityState === "visible";
      if (active && frame === 0) frame = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    frame = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [animated]);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (animated || !followPointer) return;
    const card = cardRef.current;
    const layer = layerRef.current;
    if (!card || !layer) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = x - rect.width / 2;
    const dy = y - rect.height / 2;
    const degrees = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    const radians = (degrees * Math.PI) / 180;
    const horizontal = dx === 0 ? Infinity : (rect.width / 2) / Math.abs(dx);
    const vertical = dy === 0 ? Infinity : (rect.height / 2) / Math.abs(dy);
    const proximity = Math.min(Math.max(1 / Math.min(horizontal, vertical), 0), 1);
    layer.style.setProperty("--glow-point", `${(50 + Math.sin(radians) * 48).toFixed(2)}% ${(50 - Math.cos(radians) * 48).toFixed(2)}%`);
    layer.style.setProperty("--glow-opacity", `${Math.max(0, (proximity * 100 - 50) / 50)}`);
  };

  // 收尾用 transparent 而不是 rgba(255,255,255,0)：后者在暗色底上会把渐变的末端
  // 往白里推，边缘出现一圈脏灰。
  const gradient = `radial-gradient(180px 140px at var(--glow-point, 50% 0%), ${colors[0]} 0%, ${colors[0]} 12%, ${colors[1]} 28%, ${colors[2]} 46%, transparent 76%)`;

  return (
    <div
      ref={cardRef}
      className={`border-glow-card ${className || ""}`}
      style={{ borderRadius, background: backgroundColor }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerMove={move}
    >
      <div
        ref={layerRef}
        className="border-glow-layer"
        aria-hidden="true"
        style={{
          borderRadius,
          padding: borderWidth,
          background: gradient,
          opacity: animated || (followPointer && hovered) ? undefined : 0,
        }}
      />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
};
