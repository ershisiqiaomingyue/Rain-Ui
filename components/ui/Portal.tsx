import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppIcon } from "../../src/components/icons/AppIcon"
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { formatInvokeError } from "../../src/lib/errorText";

/**
 * Portal
 * ---------------------------------------------------------------------------
 * A small, global feedback component. `PortalProvider` owns one stack for the
 * current surface, and `usePortal()` exposes a callable API:
 *
 *   const portal = usePortal();
 *   portal("设置已保存", "success");
 *   portal.error("连接失败");
 *
 * Callers can opt into the bottom-center, tinted capsule treatment used by
 * dense settings dialogs without reimplementing timers, queueing or a11y.
 */

export type PortalTone = "success" | "error" | "warning" | "info";
export type PortalPosition = "bottom-right" | "bottom-center";
export type PortalAppearance = "neutral" | "solid";

export type PortalAction = { label: string; onClick: () => void };

export type PortalOptions = {
  message: unknown;
  tone?: PortalTone;
  /** Milliseconds on screen. Defaults to 3000, or 4800 for errors. */
  duration?: number;
  /** Optional single action, e.g. undo. */
  action?: PortalAction;
};

export type PortalShortcutOptions = Omit<PortalOptions, "message" | "tone">;

type PortalEntry = Required<Pick<PortalOptions, "tone">> &
  Pick<PortalOptions, "action"> & { id: string; message: string };

export type PortalApi = {
  (message: unknown, tone?: PortalTone, options?: PortalShortcutOptions): string;
  push: (options: PortalOptions) => string;
  dismiss: (id: string) => void;
  success: (message: unknown, options?: PortalShortcutOptions) => string;
  error: (message: unknown, options?: PortalShortcutOptions) => string;
  warning: (message: unknown, options?: PortalShortcutOptions) => string;
  info: (message: unknown, options?: PortalShortcutOptions) => string;
};

type PortalProviderProps = {
  children: React.ReactNode;
  /** Defaults to bottom-right so existing app-wide feedback stays unchanged. */
  position?: PortalPosition;
  /** `neutral` keeps the surface quiet; `solid` adds a subtle tone wash. */
  appearance?: PortalAppearance;
};

export type PortalProps = {
  tone?: PortalTone;
  message: string;
  appearance?: PortalAppearance;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  className?: string;
};

const PortalContext = createContext<PortalApi | null>(null);

const TONE_ICON: Record<PortalTone, React.ReactNode> = {
  success: <AppIcon name="check-circle" size={15} />,
  error: <AppIcon name="alert" size={15} />,
  warning: <AppIcon name="alert-triangle" size={15} />,
  info: <AppIcon name="info" size={15} />,
};

/** Visible cards at once. Older ones are dropped, not queued forever. */
const MAX_VISIBLE = 3;

export const Portal: React.FC<PortalProps> = ({
  tone = "info",
  message,
  appearance = "neutral",
  actionLabel,
  onAction,
  onClose,
  className,
}) => (
  <div
    className={["ui-portal", `is-${tone}`, `is-${appearance}`, className].filter(Boolean).join(" ")}
    role={tone === "error" ? "alert" : "status"}
  >
    <span className="ui-portal-icon">{TONE_ICON[tone]}</span>
    <span className="ui-portal-text">{message}</span>
    {actionLabel && (
      <Button type="button" variant="secondary" size="xs" className="ui-portal-action" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
    {onClose && (
      <Button
        type="button"
        variant="subtle"
        size="xs"
        className="ui-portal-close"
        icon={<AppIcon name="close" size={13} />}
        aria-label="关闭提示"
        onClick={onClose}
      />
    )}
  </div>
);

export const PortalProvider: React.FC<PortalProviderProps> = ({
  children,
  position = "bottom-right",
  appearance = "neutral",
}) => {
  const [portals, setPortals] = useState<PortalEntry[]>([]);
  const timers = useRef<Record<string, number>>({});

  const dismiss = useCallback((id: string) => {
    const timer = timers.current[id];
    if (timer) {
      window.clearTimeout(timer);
      delete timers.current[id];
    }
    setPortals((previous) => previous.filter((portal) => portal.id !== id));
  }, []);

  const push = useCallback<PortalApi["push"]>(
    ({ message, tone = "info", duration, action }) => {
      const id = `portal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      // 后端结构化错误是普通对象，直接渲染会变成「[object Object]」，统一归一化。
      const text = typeof message === "string" ? message : formatInvokeError(message);
      setPortals((previous) => [...previous, { id, message: text, tone, action }].slice(-MAX_VISIBLE));
      timers.current[id] = window.setTimeout(
        () => dismiss(id),
        duration ?? (tone === "error" ? 4800 : 3000),
      );
      return id;
    },
    [dismiss],
  );

  useEffect(
    () => () => {
      Object.values(timers.current).forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const api = useMemo<PortalApi>(() => {
    const shortcut = (tone: PortalTone) => (message: unknown, options?: PortalShortcutOptions) =>
      push({ ...options, message, tone });
    const callable = ((message: unknown, tone: PortalTone = "info", options?: PortalShortcutOptions) =>
      push({ ...options, message, tone })) as PortalApi;
    callable.push = push;
    callable.dismiss = dismiss;
    callable.success = shortcut("success");
    callable.error = shortcut("error");
    callable.warning = shortcut("warning");
    callable.info = shortcut("info");
    return callable;
  }, [push, dismiss]);

  return (
    <PortalContext.Provider value={api}>
      {children}
      {/* SSR 时没有 document：门户只在浏览器里挂载。 */}
      {typeof document === "undefined"
        ? null
        : createPortal(
            <div
              className={`ui-portal-stack is-${position}`}
              aria-live="polite"
              aria-atomic="false"
            >
              {portals.map((item) => (
                <Portal
                  key={item.id}
                  tone={item.tone}
                  message={item.message}
                  appearance={appearance}
                  actionLabel={item.action?.label}
                  onAction={
                    item.action
                      ? () => {
                          item.action?.onClick();
                          dismiss(item.id);
                        }
                      : undefined
                  }
                  onClose={() => dismiss(item.id)}
                />
              ))}
            </div>,
            document.body,
          )}
    </PortalContext.Provider>
  );
};

/**
 * Reads the Portal API. Throws when no provider is mounted so a missing
 * provider surfaces at the call site instead of silently swallowing messages.
 */
export function usePortal(): PortalApi {
  const api = useContext(PortalContext);
  if (!api) throw new Error("usePortal must be used inside <PortalProvider>");
  return api;
}
