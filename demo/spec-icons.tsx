"use client"
/**
 * 图标集演示页（/#icons）。
 *
 * 数据源就是库里的 APP_ICON_NAMES —— 页面上列出来的一定是 AppIcon 真能解析的名字，
 * 不另抄一份清单，新增图标后这里自动跟着长。点任意一格复制 name，直接粘到 JSX 里用。
 */
import * as React from "react"
import { AppIcon, APP_ICON_NAMES, Input, SegmentedControl, type AppIconName } from "rain-ui"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SIZES = [14, 16, 20, 24, 32]
const STROKES = [1.5, 1.7, 2]

/** 剪贴板 API 在非安全上下文下拿不到，回退到 execCommand。 */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const el = document.createElement("textarea")
      el.value = text
      el.setAttribute("readonly", "")
      el.style.position = "fixed"
      el.style.top = "-1000px"
      document.body.appendChild(el)
      el.select()
      const ok = document.execCommand("copy")
      document.body.removeChild(el)
      return ok
    } catch {
      return false
    }
  }
}

export function SpecIcons() {
  const [query, setQuery] = React.useState("")
  const [size, setSize] = React.useState(24)
  const [stroke, setStroke] = React.useState(1.7)
  const [copied, setCopied] = React.useState<string | null>(null)

  const names = React.useMemo(
    () => [...APP_ICON_NAMES].sort((a, b) => a.localeCompare(b)),
    []
  )
  const matched = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? names.filter((name) => name.includes(q)) : names
  }, [names, query])

  const onCopy = async (name: AppIconName) => {
    const ok = await copyText(name)
    setCopied(name)
    window.setTimeout(() => setCopied((cur) => (cur === name ? null : cur)), 1200)
    if (ok) toast.success(`已复制 AppIcon name="${name}"`)
    else toast.error("复制失败，请手动选中名称")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">
          应用唯一图标来源：Hugeicons 4.4.0（MIT）为基底，24 网格、1.7 描边、圆头圆角，按语义重命名
          —— 调用处只说「这颗图标表示什么」，不关心它来自哪套图标；<code className="font-mono text-[11px]">branch</code>、
          <code className="font-mono text-[11px]">pin-fill</code> 按产品要求改取自 Tabler Icons。
          共 <span className="font-medium text-foreground">{APP_ICON_NAMES.length}</span> 颗，Android-Toolkit 应用侧已无第二套图标库。
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">{`<AppIcon name="branch" size={16} />`}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <AppIcon name="search" size={14} />
          </span>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索图标名…"
            className="h-8 w-52 pl-8 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">尺寸</span>
          <SegmentedControl
            label="预览尺寸"
            className="h-8"
            buttonClassName="px-2.5 text-[11px] font-mono"
            value={String(size)}
            onChange={(next) => setSize(Number(next))}
            options={SIZES.map((value) => ({ value: String(value), label: String(value) }))}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">描边</span>
          <SegmentedControl
            label="描边粗细"
          className="h-8"
          buttonClassName="px-2.5 text-[11px] font-mono"
          value={String(stroke)}
          onChange={(next) => setStroke(Number(next))}
            options={STROKES.map((value) => ({ value: String(value), label: String(value) }))}
          />
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          {matched.length} / {APP_ICON_NAMES.length}
        </span>
        <span className="text-[11px] text-muted-foreground">点击任意图标复制 name</span>
      </div>

      {matched.length ? (
        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(104px,1fr))] gap-1 rounded-lg border border-border/60 bg-muted/20 p-1.5">
          {matched.map((name) => {
            const isCopied = copied === name
            return (
              <button
                key={name}
                type="button"
                title={`AppIcon name="${name}"`}
                onClick={() => onCopy(name)}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-md border border-transparent px-1.5 py-2.5 transition-colors",
                  isCopied
                    ? "border-primary/40 bg-primary/10"
                    : "hover:border-border hover:bg-background"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 items-center justify-center text-foreground/80",
                    isCopied ? "text-primary" : "group-hover:text-foreground"
                  )}
                >
                  <AppIcon name={name} size={size} strokeWidth={stroke} />
                </span>
                <span
                  className={cn(
                    "w-full truncate text-center font-mono text-[10px] leading-none",
                    isCopied ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {name}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-12 text-center">
          <span className="text-muted-foreground">
            <AppIcon name="search" size={20} />
          </span>
          <p className="text-xs text-muted-foreground">
            没有匹配 “{query.trim()}” 的图标，图标名只用小写字母和连字符。
          </p>
        </div>
      )}
    </div>
  )
}
