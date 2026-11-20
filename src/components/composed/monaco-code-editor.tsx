"use client"

import * as React from "react"
import type * as Monaco from "monaco-editor/editor/editor.api"
import { cn } from "../../lib/utils"
import { appIconMask } from "../icons/AppIcon"

export interface MonacoCodeEditorHandle {
  focus(): void
  revealMatch(start: number, end: number): void
}

export interface MonacoCodeEditorProps {
  /** 由宿主加载 runtime 与 Worker；普通 rain-ui 消费方不会加载 Monaco。 */
  runtime: typeof Monaco
  /** 主题由宿主按自己的 token 定义并更新。 */
  theme?: string
  options?: Pick<Monaco.editor.IEditorOptions, "fontFamily" | "fontSize" | "lineHeight">
  value: string
  language: string
  modelKey: string
  retainedModelKeys?: readonly string[]
  readOnly?: boolean
  ariaLabel: string
  onChange(value: string): void
  onReady?(handle: MonacoCodeEditorHandle | null): void
  onCompositionChange?(composing: boolean): void
  onOpenFind?(): void
  onSave?(): void
  matches?: readonly { start: number; end: number }[]
  currentMatch?: number
  className?: string
  style?: React.CSSProperties
}

interface ModelEntry {
  model: Monaco.editor.ITextModel
  viewState: Monaco.editor.ICodeEditorViewState | null
  bom: boolean
}

interface EditorInstance {
  editor: Monaco.editor.IStandaloneCodeEditor
  models: Map<string, ModelEntry>
  key: string | null
  syncing: boolean
  decorations: Monaco.editor.IEditorDecorationsCollection
  handle: MonacoCodeEditorHandle
}

let nextInstance = 0

const suggestionIcons = Object.fromEntries(
  (["code", "file-code", "braces", "box", "folder", "file", "tag"] as const)
    .map(name => [`--rain-suggest-icon-${name}`, appIconMask(name)]),
) as React.CSSProperties

function positionAtSourceOffset(entry: ModelEntry, offset: number) {
  return entry.model.getPositionAt(Math.max(0, offset - (entry.bom ? 1 : 0)))
}

/** 每个实例独立维护模型、撤销栈与光标，卸载/关闭标签时及时释放。 */
export function MonacoCodeEditor(props: MonacoCodeEditorProps) {
  const hostRef = React.useRef<HTMLDivElement>(null)
  const instanceRef = React.useRef<EditorInstance | null>(null)
  const latest = React.useRef(props)
  latest.current = props
  const [instanceId] = React.useState(() => ++nextInstance)

  React.useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return
    const { runtime } = latest.current
    const editor = runtime.editor.create(host, {
      model: null,
      automaticLayout: false,
      minimap: { enabled: false },
      // 与 ScrollArea 保持同档命中区；不要在 CSS 改宽度，让 Monaco 正确计算拖动位置。
      scrollbar: {
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
        verticalSliderSize: 6,
        horizontalSliderSize: 6,
        useShadows: false,
      },
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      scrollBeyondLastLine: false,
      wordWrap: "off",
      renderLineHighlight: "none",
      // WebView2 的原生 EditContext 在 Enter 后可能错位；textarea 输入通道更稳定。
      editContext: false,
      tabSize: 4,
      insertSpaces: true,
      detectIndentation: true,
      accessibilitySupport: "auto",
      fixedOverflowWidgets: true,
      padding: { top: 8, bottom: 8 },
    })
    const handle: MonacoCodeEditorHandle = {
      focus: () => editor.focus(),
      revealMatch: (start, end) => {
        const entry = instanceRef.current?.models.get(instanceRef.current.key ?? "")
        if (!entry) return
        const from = positionAtSourceOffset(entry, start)
        const to = positionAtSourceOffset(entry, end)
        const range = new runtime.Range(from.lineNumber, from.column, to.lineNumber, to.column)
        editor.setSelection(range)
        editor.revealRangeInCenterIfOutsideViewport(range)
      },
    }
    const instance: EditorInstance = {
      editor, models: new Map(), key: null, syncing: false,
      decorations: editor.createDecorationsCollection(),
      handle,
    }
    instanceRef.current = instance
    let composing = false
    const subscriptions: Monaco.IDisposable[] = [
      editor.onDidChangeModelContent(() => {
        if (!instance.syncing) {
          const entry = instance.models.get(instance.key ?? "")
          if (entry) latest.current.onChange((entry.bom ? "\uFEFF" : "") + entry.model.getValue(runtime.editor.EndOfLinePreference.TextDefined, false))
        }
      }),
      editor.onDidCompositionStart(() => { composing = true; latest.current.onCompositionChange?.(true) }),
      editor.onDidCompositionEnd(() => { composing = false; latest.current.onCompositionChange?.(false) }),
      editor.onKeyDown(event => {
        const modifier = event.ctrlKey || event.metaKey
        if (!modifier || event.altKey || event.shiftKey) return
        const callback = event.keyCode === runtime.KeyCode.KeyS ? latest.current.onSave
          : event.keyCode === runtime.KeyCode.KeyF ? latest.current.onOpenFind : undefined
        if (callback) {
          event.preventDefault()
          event.stopPropagation()
          // 两个宿主都不能把输入法尚未确认的组词内容保存到磁盘。
          if (event.keyCode === runtime.KeyCode.KeyS && (composing || event.browserEvent.isComposing)) return
          callback()
        }
      }),
    ]
    let frame = 0
    const layout = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const { width, height } = host.getBoundingClientRect()
        if (width > 0 && height > 0) editor.layout({ width, height })
      })
    }
    const resize = new ResizeObserver(layout)
    resize.observe(host)
    const updateFont = () => {
      const style = getComputedStyle(host)
      editor.updateOptions({
        fontFamily: style.getPropertyValue("--font-mono").trim() || "monospace",
        fontSize: parseFloat(style.getPropertyValue("--fs-label")) || parseFloat(style.fontSize),
        suggestFontSize: parseFloat(style.getPropertyValue("--fs-label")) || parseFloat(style.fontSize),
        // 交由 Monaco 计算行位置，不能只在 CSS 加行距导致点击区域错位。
        suggestLineHeight: parseFloat(style.getPropertyValue("--control-height-sm")),
        ...latest.current.options,
      })
    }
    const observer = new MutationObserver(updateFont)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-surface", "data-frosted", "data-custom-theme", "style", "class"] })
    updateFont()
    layout()
    return () => {
      latest.current.onReady?.(null)
      latest.current.onCompositionChange?.(false)
      resize.disconnect()
      observer.disconnect()
      cancelAnimationFrame(frame)
      subscriptions.forEach(subscription => subscription.dispose())
      instance.decorations.clear()
      editor.dispose()
      instance.models.forEach(entry => entry.model.dispose())
      instance.models.clear()
      if (instanceRef.current === instance) instanceRef.current = null
    }
  }, [props.runtime])

  React.useLayoutEffect(() => {
    const instance = instanceRef.current
    if (!instance) return
    const { runtime, modelKey, language, value } = props
    const { editor, models } = instance
    instance.syncing = true
    let modelChanged = false
    try {
      if (instance.key !== modelKey) {
        const previous = instance.key === null ? undefined : models.get(instance.key)
        if (previous) previous.viewState = editor.saveViewState()
        instance.decorations.clear()
        let entry = models.get(modelKey)
        if (!entry) {
          // 不使用真实路径 URI，避免两个窗口/组件共享同一个可编辑模型。
          const uri = runtime.Uri.from({ scheme: "rain-editor", authority: String(instanceId), path: `/${encodeURIComponent(modelKey)}` })
          entry = { model: runtime.editor.createModel(value.replace(/^\uFEFF/, ""), language, uri), viewState: null, bom: value.startsWith("\uFEFF") }
          models.set(modelKey, entry)
        }
        editor.setModel(entry.model)
        if (entry.viewState) editor.restoreViewState(entry.viewState)
        instance.key = modelKey
        modelChanged = true
      }
      const entry = models.get(modelKey)!
      const { model } = entry
      // BOM 单独保存：外部刷新增删 BOM 不能靠 executeEdits 修改模型的内部元数据。
      entry.bom = value.startsWith("\uFEFF")
      const text = entry.bom ? value.slice(1) : value
      if (model.getLanguageId() !== language) runtime.editor.setModelLanguage(model, language)
      if (model.getValue(runtime.editor.EndOfLinePreference.TextDefined, false) !== text) {
        // 不用 setValue：外部刷新也保留撤销记录；关闭标签才释放模型。
        editor.pushUndoStop()
        const firstNewline = value.match(/\r?\n/)
        if (firstNewline) model.pushEOL(firstNewline[0] === "\r\n" ? runtime.editor.EndOfLineSequence.CRLF : runtime.editor.EndOfLineSequence.LF)
        editor.executeEdits("rain-external-update", [{ range: model.getFullModelRange(), text, forceMoveMarkers: true }])
        editor.pushUndoStop()
      }
      editor.updateOptions({ readOnly: props.readOnly ?? false, ariaLabel: props.ariaLabel, theme: props.theme, ...props.options })
      const retained = new Set(props.retainedModelKeys ?? [modelKey])
      for (const [key, entry] of models) {
        if (key !== modelKey && !retained.has(key)) {
          entry.model.dispose()
          models.delete(key)
        }
      }
      instance.decorations.set((props.matches ?? []).map((match, index) => {
        const from = positionAtSourceOffset(entry, match.start)
        const to = positionAtSourceOffset(entry, match.end)
        return {
          range: new runtime.Range(from.lineNumber, from.column, to.lineNumber, to.column),
          options: {
            className: index === props.currentMatch ? "rain-monaco-match-current" : "rain-monaco-match",
            stickiness: runtime.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          },
        }
      }))
    } finally {
      instance.syncing = false
    }
    // 回调时模型已经挂载，宿主可立即恢复当前查找结果。
    if (modelChanged) {
      latest.current.onReady?.(instance.handle)
      const current = props.matches?.[props.currentMatch ?? -1]
      if (current) instance.handle.revealMatch(current.start, current.end)
    }
  }, [props.runtime, props.value, props.language, props.modelKey, props.retainedModelKeys, props.readOnly, props.ariaLabel, props.theme, props.options, props.matches, props.currentMatch, instanceId])

  return <div ref={hostRef} className={cn("rain-monaco-code-editor", props.className)} style={{ ...suggestionIcons, ...props.style }} />
}
