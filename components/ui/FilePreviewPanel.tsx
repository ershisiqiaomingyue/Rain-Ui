import React, { useState } from "react";
import { AppIcon } from "../../src/components/icons/AppIcon"
import { Button } from "./Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../src/components/ui/dropdown-menu";

/**
 * FilePreviewPanel
 * ---------------------------------------------------------------------------
 * The shell around a read-only file preview: a header with the file name and
 * action buttons, an optional source/diff switch with +N −N counts, an optional
 * inline search bar, and a footer showing the full path.
 *
 * The body is a slot. The product's version reads bytes through a Tauri invoke
 * and syntax-highlights them; none of that belongs in the component library, so
 * the caller renders whatever it already has (plain <pre>, markdown, diff rows).
 */

export type PreviewMode = "source" | "diff";

export type FilePreviewPanelProps = {
  /** Full path; also the footer text. */
  path: string;
  /** Short name for the header. Derived from `path` when omitted. */
  name?: string;
  mode?: PreviewMode;
  onModeChange?: (mode: PreviewMode) => void;
  /** Shows the source/diff switch. Off when there is nothing to diff against. */
  showModes?: boolean;
  added?: number;
  removed?: number;
  /** Renders "部分差异" beside the counts. */
  partial?: boolean;
  searchable?: boolean;
  query?: string;
  onQueryChange?: (query: string) => void;
  /** 0-based index of the active match; rendered 1-based as "2/7" (index+1). */
  matchIndex?: number;
  matches?: number;
  onMoveMatch?: (offset: number) => void;
  onClose?: () => void;
  onCopy?: () => void;
  copied?: boolean;
  onRetry?: () => void;
  /** Opens the file in whatever the OS registered for it — a browser for .html/.md. */
  onOpenWithSystem?: () => void;
  /** Disables actions while the body is still loading. */
  loading?: boolean;
  children?: React.ReactNode;
  footerNote?: React.ReactNode;
  /** Extra header control, e.g. a metadata popover, before the tool buttons. */
  headerExtra?: React.ReactNode;
  /**
   * Small note under the file name. Defaults to "只读预览"; pass a shorter or
   * environment-aware text in narrow panes.
   */
  titleNote?: string;
  /**
   * Fills a pane flush with its container: no rounding, no border, no shadow.
   * The container's own corners own the outer edge.
   */
  docked?: boolean;
  className?: string;
};

export const FilePreviewPanel = React.forwardRef<HTMLElement, FilePreviewPanelProps>(({
  path,
  name,
  mode = "source",
  onModeChange,
  showModes = false,
  added = 0,
  removed = 0,
  partial = false,
  searchable = false,
  query: controlledQuery,
  onQueryChange,
  matchIndex = 0,
  matches = 0,
  onMoveMatch,
  onClose,
  onCopy,
  copied = false,
  onRetry,
  onOpenWithSystem,
  loading = false,
  children,
  footerNote,
  headerExtra,
  titleNote = "只读预览",
  docked = false,
  className,
}, ref) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");
  const query = controlledQuery ?? internalQuery;
  const setQuery = onQueryChange ?? setInternalQuery;
  const shortName = name ?? path.split(/[\\/]/).filter(Boolean).pop() ?? path;

  const toggleSearch = () => {
    setSearchOpen((open) => !open);
    setQuery("");
  };

  // 次级动作只有这一份清单：够宽时排成图标按钮，窄了整体收进「更多」，
  // 两边的文案、图标、禁用状态因此不会走样。
  const secondary: Array<{
    key: string;
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
    expanded?: boolean;
    onClick: () => void;
  }> = [];
  if (searchable) {
    secondary.push({
      key: "search",
      label: searchOpen ? "收起搜索" : "搜索文件内容",
      icon: <AppIcon name="search" size={14} />,
      disabled: loading,
      expanded: searchOpen,
      onClick: toggleSearch,
    });
  }
  if (onCopy) {
    secondary.push({
      key: "copy",
      label: copied ? "已复制" : "复制文件内容",
      icon: copied ? <AppIcon name="check" size={14} /> : <AppIcon name="copy" size={14} />,
      disabled: loading,
      onClick: onCopy,
    });
  }
  if (onRetry) {
    secondary.push({
      key: "retry",
      label: "重新读取文件",
      icon: <AppIcon name="refresh" size={14} />,
      onClick: onRetry,
    });
  }
  if (onOpenWithSystem) {
    secondary.push({
      key: "open",
      label: "用默认程序打开",
      // 「交给系统程序打开」不是把东西分享出去：外链图标是方框加一支指到框外的箭头，
      // 各个 App 都拿它当分享/外链，用户第一眼读到的就是「分享」。应用窗口图标直说
      // 「一个程序」，和斜杠菜单里用 app-window 表示「应用工具」也是同一套语义。
      icon: <AppIcon name="app-window" size={14} />,
      onClick: onOpenWithSystem,
    });
  }

  return (
    <aside
      ref={ref}
      className={["ui-preview", docked && "is-docked", className].filter(Boolean).join(" ")}
      aria-label={`文件预览：${shortName}`}
      onKeyDown={(event) => {
        if (searchable && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
          event.preventDefault();
          event.stopPropagation();
          setSearchOpen(true);
          event.currentTarget.querySelector<HTMLInputElement>(".ui-preview-search-input")?.focus();
        }
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          if (searchOpen) { setSearchOpen(false); setQuery(""); }
          else onClose?.();
        }
      }}
    >
      <header className="ui-preview-header">
        {/* 改动量贴在面板最左：一眼看到这文件改了多少，不用先去数正文。
            跟着「有没有 diff 数据」出现，不跟模式走——切源码/差异时它不会忽隐忽现。 */}
        {showModes && (added > 0 || removed > 0) && (
          <span className="ui-preview-counts" title="与当前磁盘文件相比的增删行数">
            <b>+{added}</b>
            <i>−{removed}</i>
            {partial && <small>部分差异</small>}
          </span>
        )}
        <div className="ui-preview-title">
          <strong title={path || shortName}>{shortName}</strong>
          {titleNote ? <small title={titleNote}>{titleNote}</small> : null}
        </div>
        <div className="ui-preview-tools">
          {/* 源码/差异 贴在标题这一行、放在调用方的 headerExtra（比如预览环境下拉）左边，
              省掉单独一条模式栏。 */}
          {showModes && (
            <div className="ui-preview-modes">
              <div role="group" aria-label="文件显示模式">
                {(["source", "diff"] as const).map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="subtle"
                    size="xs"
                    className={`ui-preview-mode${mode === value ? " is-active" : ""}`}
                    aria-pressed={mode === value}
                    onClick={() => onModeChange?.(value)}
                  >
                    {value === "source" ? "源码" : "差异"}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {headerExtra ? <div className="ui-preview-extra">{headerExtra}</div> : null}
          {/* 次级动作：够宽时逐个露出来，窄了整体退进「更多」。关闭按钮不参与收起，
              永远在最右——面板窄的时候先丢别的，别让人关不掉预览。 */}
          {secondary.length > 0 && (
            <div className="ui-preview-actions">
              {secondary.map((action) => (
                <Button
                  key={action.key}
                  type="button"
                  variant="subtle"
                  size="xs"
                  className="ui-preview-tool"
                  icon={action.icon}
                  title={action.label}
                  aria-label={action.label}
                  aria-expanded={action.expanded}
                  disabled={action.disabled}
                  onClick={action.onClick}
                />
              ))}
            </div>
          )}
          {secondary.length > 0 && (
            <span className="ui-preview-more">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="subtle"
                    size="xs"
                    className="ui-preview-tool"
                    icon={<AppIcon name="more" size={16} />}
                    title="更多操作"
                    aria-label="更多操作"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {secondary.map((action) => (
                    <DropdownMenuItem
                      key={action.key}
                      disabled={action.disabled}
                      onSelect={action.onClick}
                    >
                      <span className="ui-preview-menu-icon">{action.icon}</span>
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          )}
          {onClose && (
            <Button
              type="button"
              variant="subtle"
              size="xs"
              className="ui-preview-tool ui-preview-close"
              icon={<AppIcon name="close" size={16} />}
              title="关闭文件预览"
              aria-label="关闭文件预览"
              onClick={onClose}
            />
          )}
        </div>
      </header>

      {searchOpen && (
        <div className="ui-preview-search" role="search">
          <input
            autoFocus
            type="text"
            className="ui-preview-search-input"
            aria-label="文件内查找"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onMoveMatch?.(event.shiftKey ? -1 : 1);
              }
            }}
          />
          <span aria-live="polite">
            {matches ? `${matchIndex + 1}/${matches}` : query ? "无匹配" : "0/0"}
          </span>
          <Button
            type="button"
            variant="subtle"
            size="xs"
            className="ui-preview-tool"
            icon={<AppIcon name="arrow-up" size={13} />}
            title="上一个匹配"
            aria-label="上一个匹配"
            disabled={!matches}
            onClick={() => onMoveMatch?.(-1)}
          />
          <Button
            type="button"
            variant="subtle"
            size="xs"
            className="ui-preview-tool"
            icon={<AppIcon name="arrow-down" size={13} />}
            title="下一个匹配"
            aria-label="下一个匹配"
            disabled={!matches}
            onClick={() => onMoveMatch?.(1)}
          />
        </div>
      )}

      <div className="ui-preview-content">{children}</div>

      {footerNote}

      <footer className="ui-preview-path" title={path}>
        {path}
      </footer>
    </aside>
  );
});
