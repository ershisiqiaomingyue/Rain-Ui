import * as React from "react"
import type * as Monaco from "monaco-editor/editor/editor.api"
import { MonacoCodeEditor } from "@/components/composed/monaco-code-editor"
import { Button } from "@/components/ui/button"

export function MonacoEditorSpec() {
  const [runtime, setRuntime] = React.useState<typeof Monaco>()
  const [error, setError] = React.useState("")
  const [active, setActive] = React.useState("one.ts")
  const [files, setFiles] = React.useState<Record<string, string>>({
    "one.ts": "// 切换标签后，光标和撤销栈仍保留\nexport const toolkit = { enabled: true };\n",
    "two.ts": "// 输入、折叠、撤销、查找均由 Monaco 提供\nexport function greet(name: string) {\n    return `你好，${name}`;\n}\n",
  })
  const [saved, setSaved] = React.useState(false)
  React.useEffect(() => {
    let mounted = true
    import("./monaco-demo-runtime").then(module => {
      if (mounted) setRuntime(module.runtime)
    }).catch(reason => { if (mounted) setError(String(reason)) })
    return () => { mounted = false }
  }, [])
  const [theme, setTheme] = React.useState(document.documentElement.dataset.theme === "light" ? "vs" : "vs-dark")
  React.useEffect(() => {
    const observer = new MutationObserver(() => setTheme(document.documentElement.dataset.theme === "light" ? "vs" : "vs-dark"))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
    return () => observer.disconnect()
  }, [])
  return <div className="space-y-3">
    <div className="flex items-center gap-2">
      {Object.keys(files).map(key => <Button key={key} variant={active === key ? "secondary" : "ghost"} onClick={() => setActive(key)}>{key}</Button>)}
      <span className="text-label text-muted-foreground">{saved ? "已触发保存回调" : "Ctrl/Cmd+S 保存；Ctrl/Cmd+F 查找"}</span>
    </div>
    <div className="h-80 overflow-hidden rounded-lg border border-border">
      {runtime ? <MonacoCodeEditor
        runtime={runtime} theme={theme} value={files[active]} language="typescript"
        modelKey={active} retainedModelKeys={Object.keys(files)} ariaLabel="代码编辑器演示"
        onChange={value => { setSaved(false); setFiles(previous => ({ ...previous, [active]: value })) }}
        onSave={() => setSaved(true)}
      /> : <p className="p-4 text-label text-muted-foreground">{error || "正在按需加载编辑器…"}</p>}
    </div>
    <p className="text-label text-muted-foreground">编辑器按需加载，Worker 由宿主配置；基础折叠、多光标、撤销与标签位置由模型维护。语言服务和项目索引由宿主接入。</p>
  </div>
}
