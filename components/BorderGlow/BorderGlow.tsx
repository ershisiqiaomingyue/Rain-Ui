import React, { useEffect, useRef, useState } from "react";

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  followPointer?: boolean;
  colors?: string[];
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
}

export const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className,
  animated = false,
  followPointer = true,
  // 默认取主题强调色，跟着亮暗主题走；写死 #6699ff 会在浅色主题里发灰、深色主题里发脏。
  colors = ["var(--accent-primary)", "var(--accent-hover)", "color-mix(in srgb, var(--accent-primary) 55%, transparent)"],
  // 卡片底色必须来自 token。写死 #ffffff 时深色主题里是白底 + 近白文字（对比度 1.05:1，字直接看不见）。
  backgroundColor = "var(--bg-surface)",
  borderRadius = 14,
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

  // 调用方可能只给 1~2 个色；缺的档位回退到上一个，避免 undefined 让整条 gradient 失效。
  const [stop0, stop1 = stop0, stop2 = stop1] = colors;
  const gradient = `radial-gradient(180px 140px at var(--glow-point, 50% 0%), ${stop0} 0%, ${stop0} 12%, ${stop1} 28%, ${stop2} 46%, rgba(255,255,255,0) 76%)`;

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
