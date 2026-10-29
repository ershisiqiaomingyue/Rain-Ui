/* ══════════════════════════════════════════════════════════════════════════
   演示站专用排版原语
   只服务于「把组件的每个状态都摆出来」这件事，组件本身不依赖这里的任何东西。
   ══════════════════════════════════════════════════════════════════════════ */

import type { ReactNode } from "react";

/** 一组变体：标题 + 一排样本 */
export function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="kit-group">
      <header className="kit-group-head">
        <h3>{title}</h3>
        {hint ? <p>{hint}</p> : null}
      </header>
      <div className="kit-group-body">{children}</div>
    </section>
  );
}

/** 横向一排（自动换行） */
export function Row({ children, align = "center" }: { children: ReactNode; align?: "center" | "start" | "end" }) {
  return <div className={`kit-row is-${align}`}>{children}</div>;
}

/** 竖向一列 */
export function Stack({ children, gap = 12 }: { children: ReactNode; gap?: number }) {
  return (
    <div className="kit-stack" style={{ gap }}>
      {children}
    </div>
  );
}

/** 每一格带一个小注释，用来标注「这是 disabled / 这是空值」 */
export function Cell({ label, children, width }: { label?: string; children: ReactNode; width?: number | string }) {
  return (
    <div className="kit-cell" style={{ width }}>
      <div className="kit-cell-body">{children}</div>
      {label ? <span className="kit-cell-label">{label}</span> : null}
    </div>
  );
}

/** 代码块（展示 import 路径） */
export function Code({ children }: { children: ReactNode }) {
  return <pre className="kit-code">{children}</pre>;
}

/** 说明性小字 */
export function Note({ children }: { children: ReactNode }) {
  return <p className="kit-note">{children}</p>;
}
