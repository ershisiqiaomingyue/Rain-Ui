import * as React from "react"
import { AppIcon } from "../icons/AppIcon"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { cn } from "../../lib/utils"

export interface ComposerHumanGateProps {
  mode: "permission" | "question"
  title: string
  description?: string
  details?: string
  options?: string[]
  value: string
  busy?: boolean
  countdown?: React.ReactNode
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  onAllowOnce?: () => void
  onAllowSession?: () => void
  onDeny?: () => void
  onSkip?: () => void
  className?: string
}

/** 输入框接管态：透明排版，不叠卡片；授权与追问共用同一套输入表面。 */
export function ComposerHumanGate({ mode, title, description, details, options = [], value, busy = false, countdown, onChange, onSubmit, onAllowOnce, onAllowSession, onDeny, onSkip, className }: ComposerHumanGateProps) {
  const [showDetails, setShowDetails] = React.useState(false)
  const isQuestion = mode === "question"
  const submit = (answer = value) => { if (!busy && answer.trim()) onSubmit(answer.trim()) }
  return <section className={cn("flex h-full min-h-0 flex-col gap-3 text-foreground", className)} aria-busy={busy}>
    <header className="flex min-w-0 items-start gap-2">
      <AppIcon name={isQuestion ? "message-question" : "shield-check"} className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-label font-semibold">{isQuestion ? "AI 需要你的回答" : "需要你确认权限"}</span>
          <span className="truncate text-label text-muted-foreground">{title}</span>
          {countdown}
        </div>
        {description && <p className="mt-1 text-label leading-relaxed text-muted-foreground">{description}</p>}
      </div>
    </header>
    {details && <div className="min-h-0">
      <button type="button" className="inline-flex items-center gap-1 text-meta text-muted-foreground hover:text-foreground" aria-expanded={showDetails} onClick={() => setShowDetails(v => !v)}>
        <AppIcon name={showDetails ? "chevron-down" : "chevron-right"} className="size-3" />{showDetails ? "收起调用详情" : "查看调用详情"}
      </button>
      {showDetails && <pre className="mt-1 max-h-28 overflow-auto whitespace-pre-wrap break-all rounded-control border border-border/70 bg-background/40 px-2 py-1.5 font-mono text-meta text-muted-foreground">{details}</pre>}
    </div>}
    {isQuestion && options.length > 0 && <div className="flex flex-wrap gap-1.5">
      {options.map(option => <Button key={option} variant="secondary" size="sm" disabled={busy} onClick={() => submit(option)}>{option}</Button>)}
    </div>}
    <div className="flex min-h-0 flex-1 flex-col rounded-control border border-border/70 bg-background/35 focus-within:border-ring/60">
      <Textarea value={value} disabled={busy} maxLength={8000} onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit() } }}
        placeholder={isQuestion ? "输入你的回答…" : "可补充限制或调整要求…"}
        aria-label={isQuestion ? "回答 AI" : "补充权限要求"}
        className="min-h-0 flex-1 resize-none border-0 bg-transparent px-3 py-2 shadow-none focus-visible:shadow-none" />
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {isQuestion ? <Button variant="ghost" size="sm" disabled={busy} onClick={onSkip}>跳过</Button> : <>
            <Button variant="ghost" size="sm" disabled={busy} onClick={onDeny}>拒绝</Button>
            {onAllowSession && <Button variant="secondary" size="sm" disabled={busy} onClick={onAllowSession}>本会话允许</Button>}
            <Button variant="secondary" size="sm" disabled={busy} onClick={onAllowOnce}>允许一次</Button>
          </>}
        </div>
        <Button variant="default" size="sm" disabled={busy || !value.trim()} onClick={() => submit()}>{isQuestion ? "回答" : "按说明继续"}</Button>
      </footer>
    </div>
  </section>
}
