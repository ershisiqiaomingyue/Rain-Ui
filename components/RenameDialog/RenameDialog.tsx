import { useEffect, useRef, useState } from "react";
import { Button } from "../../src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../src/components/ui/dialog";
import { Input } from "../../src/components/ui/input";

export interface RenameDialogProps {
  open: boolean;
  title: string;
  description?: string;
  /** 输入框的无障碍标签。 */
  label: string;
  initialValue: string;
  confirmLabel: string;
  busy?: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: (value: string) => void;
}

/**
 * 重命名用的单输入弹窗。
 *
 * 本实现上收自 Android-Toolkit：旧的库版是 38px 手写输入框 + 聚焦 3px 紫环 +
 * 老的 `btn` 类按钮（圆角 7px），摆进现在的界面里比旁边所有控件都大一号。
 * 这里改用库里的 Dialog / Input / Button 原语重新拼，字段和交互照旧，只是
 * 尺寸、圆角、聚焦环跟着设计系统走。
 *
 * 没有做成行内改名：行一变输入框，行尾的时间、置顶、三个按钮就全得让位，整行会跳一下。
 */
export function RenameDialog({
  open,
  title,
  description,
  label,
  initialValue,
  confirmLabel,
  busy = false,
  error,
  onCancel,
  onConfirm,
}: RenameDialogProps) {
  const [draft, setDraft] = useState(initialValue);
  // 中文输入法敲回车是「选字」，不是「提交」——合成期间一律不响应回车。
  const composingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(initialValue);
    composingRef.current = false;
    // 全选要等草稿落进 DOM 再做：挂载时已经聚焦过输入框，值一写进去选区就被顶到末尾，
    // 「打开即全选」等于白做。
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, initialValue]);

  const trimmed = draft.trim();
  // 允许和原名一样：用户可能只是想点开确认一下，没必要拦着。
  const blocked = busy || trimmed === "";
  const submit = () => { if (!blocked) onConfirm(trimmed); };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onCancel(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {/* 没有说明时留一句只给读屏听的提示，Radix 也要求弹窗有个 description。 */}
          <DialogDescription className={description ? undefined : "sr-only"}>
            {description ?? `${label}改好后按回车即可保存。`}
          </DialogDescription>
        </DialogHeader>

        <Input
          ref={inputRef}
          value={draft}
          aria-label={label}
          disabled={busy}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => setDraft(event.target.value)}
          onCompositionStart={() => { composingRef.current = true; }}
          onCompositionEnd={() => { composingRef.current = false; }}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            if (composingRef.current) return;
            submit();
          }}
        />

        {error && <p className="text-label text-[color:var(--destructive-ink)]" role="alert">{error}</p>}

        <DialogFooter>
          <Button variant="subtle" size="sm" disabled={busy} onClick={onCancel}>取消</Button>
          <Button variant="primary" size="sm" disabled={blocked} loading={busy} onClick={submit}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RenameDialog;
