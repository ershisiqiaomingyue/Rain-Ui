import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/* ---- tokens are read-only here; this file is only the demo chrome ------- */

export type Specimen = { id: string; title: string; note?: string; render: () => JSX.Element };

export function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="demo-section">
      <header className="demo-section-head">
        <h2>{title}</h2>
        {note ? <p>{note}</p> : null}
      </header>
      <div className="demo-section-body">{children}</div>
    </section>
  );
}

export function Row({ label, children, wide }: { label?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "demo-row demo-row-wide" : "demo-row"}>
      {label ? <span className="demo-row-label">{label}</span> : null}
      <div className="demo-row-controls">{children}</div>
    </div>
  );
}

export function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="demo-swatch">
      <span className="demo-swatch-chip" style={{ background: `var(${name})` }} />
      <code>{name}</code>
      <span className="demo-swatch-value">{value}</span>
    </div>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return <pre className="demo-code">{children}</pre>;
}

/** Simple number/state hook used by the interactive specimens. */
export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  return [on, () => setOn((v) => !v), setOn] as const;
}
