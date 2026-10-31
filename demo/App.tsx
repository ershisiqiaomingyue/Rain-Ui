"use client"
import * as React from "react"
import {
  Sun, Moon, Terminal, Plus, Trash2, Check, Sparkles,
  Smartphone, AlertTriangle, Search, Info, Settings,
  Folder, Layers, ChevronRight, ArrowRight, ExternalLink,
  MoreHorizontal, Play, RefreshCw, X, Shield, Sliders, Menu,
  Home, Inbox, Calendar, User2, ChevronUp, ChevronsUpDown,
  CircleFadingArrowUp, ArrowUp, GitBranch, ArrowUpRight,
  Copy, RotateCw, PanelLeftClose, PanelLeft,
  Bold, Italic, Underline, CreditCard, User, Laptop, Bell,
  FileText, Mail, LogOut, CheckSquare, Clock
} from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ButtonGroupDemo } from "@/components/ui/button-group-demo"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Combobox } from "@/components/ui/combobox"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
  CommandDialog, CommandShortcut, CommandSeparator
} from "@/components/ui/command"
import {
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator, ContextMenuShortcut
} from "@/components/ui/context-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator as DropdownSeparator, DropdownMenuTrigger,
  DropdownMenuGroup, DropdownMenuShortcut, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import {
  Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger
} from "@/components/ui/menubar"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Slider } from "@/components/ui/slider"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ContextUsageRing,
  ComposerNoticeDock,
  ModelProviderPicker,
  TaskStatusRow,
  TerminalRangeSlider,
  CompactionProgress,
  UsageMetricsStrip,
  SegmentedControl,
  StatusBadge,
  type ComposerNoticeItem,
  type ReasoningLevel,
  type TaskItem,
} from "@/components/composed"
import { cn } from "@/lib/utils"
interface NavItem {
  id: string
  title: string
  label: string
  group: "composed" | "base"
}
const NAV_ITEMS: NavItem[] = [
  // 基础组件（先做基础，再拼组合）
  { id: "button", title: "Button", label: "按钮", group: "base" },
  { id: "button-group", title: "Button Group", label: "按钮组", group: "base" },
  { id: "input", title: "Input", label: "输入框", group: "base" },
  { id: "input-group", title: "Input Group", label: "输入框组", group: "base" },
  { id: "textarea", title: "Textarea", label: "多行文本", group: "base" },
  { id: "label", title: "Label", label: "标签", group: "base" },
  { id: "field", title: "Field", label: "表单字段", group: "base" },
  { id: "select", title: "Select", label: "选择器", group: "base" },
  { id: "combobox", title: "Combobox", label: "组合框", group: "base" },
  { id: "checkbox", title: "Checkbox", label: "复选框", group: "base" },
  { id: "radio-group", title: "Radio Group", label: "单选框组", group: "base" },
  { id: "switch", title: "Switch", label: "开关", group: "base" },
  { id: "slider", title: "Slider", label: "滑块", group: "base" },
  { id: "toggle", title: "Toggle", label: "切换按钮", group: "base" },
  { id: "tabs", title: "Tabs", label: "标签页", group: "base" },
  { id: "card", title: "Card", label: "卡片", group: "base" },
  { id: "item", title: "Item", label: "列表项", group: "base" },
  { id: "badge", title: "Badge", label: "徽章", group: "base" },
  { id: "avatar", title: "Avatar", label: "头像", group: "base" },
  { id: "progress", title: "Progress", label: "进度条", group: "base" },
  { id: "accordion", title: "Accordion", label: "折叠面板", group: "base" },
  { id: "hover-card", title: "Hover Card", label: "悬停卡片", group: "base" },
  { id: "alert", title: "Alert", label: "提示条", group: "base" },
  { id: "alert-dialog", title: "AlertDialog", label: "确认对话框", group: "base" },
  { id: "dialog", title: "Dialog", label: "模态对话框", group: "base" },
  { id: "popover", title: "Popover", label: "气泡浮层", group: "base" },
  { id: "tooltip", title: "Tooltip", label: "文字提示", group: "base" },
  { id: "dropdown-menu", title: "Dropdown Menu", label: "下拉菜单", group: "base" },
  { id: "context-menu", title: "Context Menu", label: "右键菜单", group: "base" },
  { id: "menubar", title: "Menubar", label: "菜单栏", group: "base" },
  { id: "command", title: "Command", label: "命令面板", group: "base" },
  { id: "sonner", title: "Sonner", label: "Toast 消息", group: "base" },
  { id: "table", title: "Tables", label: "表格", group: "base" },
  { id: "pagination", title: "Pagination", label: "分页", group: "base" },
  { id: "separator", title: "Separator", label: "分割线", group: "base" },
  { id: "skeleton", title: "Skeleton", label: "骨架屏", group: "base" },
  { id: "spinner", title: "Spinner", label: "加载指示器", group: "base" },
  { id: "empty", title: "Empty", label: "空状态", group: "base" },
  { id: "scroll-area", title: "Scroll Area", label: "滚动区域", group: "base" },
  { id: "resizable", title: "Resizable", label: "可调整面板", group: "base" },
  { id: "sidebar", title: "Sidebar", label: "侧边栏布局", group: "base" },
  // 组合组件
  { id: "context-usage-ring", title: "Context Ring", label: "上下文圆环", group: "composed" },
  { id: "model-provider-picker", title: "Model Picker", label: "模型选择器", group: "composed" },
  { id: "composer-notice-dock", title: "Notice Dock", label: "通知停靠区", group: "composed" },
  { id: "task-status-row", title: "Task Status", label: "任务进度", group: "composed" },
  { id: "terminal-range-slider", title: "Range Slider", label: "设置拖动条", group: "composed" },
  { id: "compaction-progress", title: "Compaction", label: "上下文压缩", group: "composed" },
  { id: "usage-metrics-strip", title: "Usage Metrics", label: "会话用量", group: "composed" },
  { id: "segmented-control", title: "Segmented", label: "分段切换", group: "composed" },
  { id: "status-badge", title: "Status Badge", label: "状态徽章", group: "composed" },
]
const PageContext = React.createContext<string | null>(null)

function Section({ id, title, label, count, children }: { id: string; title: string; label: string; count: number; children: React.ReactNode }) {
  const activePage = React.useContext(PageContext)
  if (activePage !== null && activePage !== id) return null
  return (
    <section id={id} className="space-y-3">
      {activePage === null && (
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[11px] font-mono text-muted-foreground">
            {count}
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            {title}
            <span className="text-xs font-normal text-muted-foreground">({label})</span>
          </h2>
        </div>
      )}
      <div className="p-4 rounded-lg border border-border/60 bg-card shadow-xs">
        {children}
      </div>
    </section>
  )
}
export function App() {
  const [dark, setDark] = React.useState(false)
  const [accentColor, setAccentColor] = React.useState<"emerald" | "indigo" | "amber" | "mint" | "violet" | "graphite">("indigo")
  const [activeId, setActiveId] = React.useState("button")
  const [filter, setFilter] = React.useState("")
  const [openCommand, setOpenCommand] = React.useState(false)
  const [dropdownCategory, setDropdownCategory] = React.useState("work")
  const [comboboxVal, setComboboxVal] = React.useState("react")
  const [toggleBold, setToggleBold] = React.useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [toggleItalic, setToggleItalic] = React.useState(false)
  const [toggleUnderline, setToggleUnderline] = React.useState(false)
  // 组合组件演示状态
  const [providerId, setProviderId] = React.useState("anthropic")
  const [modelId, setModelId] = React.useState("claude-sonnet-4")
  const [reasoningLevel, setReasoningLevel] = React.useState<ReasoningLevel>("medium")
  const [terminalFontSize, setTerminalFontSize] = React.useState(13)
  const [sliderValue, setSliderValue] = React.useState(13)
  const [tasks, setTasks] = React.useState<TaskItem[]>([
    { id: "t1", title: "Install app-release.apk", chip: "ARM64", status: "done" },
    { id: "t2", title: "Create channel /tool:adb-shell/", chip: "ADB", status: "done" },
    { id: "t3", title: "Invite users to channel", chip: "5 members", status: "running" },
    { id: "t4", title: "Sync framework-res.apk", chip: "12.4 MB", status: "pending" },
    { id: "t5", title: "Deploy to husky device", chip: "failed", status: "error" },
  ])
  const [balanceRefreshing, setBalanceRefreshing] = React.useState(false)
  const [segmentedView, setSegmentedView] = React.useState<"conversation" | "terminal" | "files">("conversation")
  const [segmentedRange, setSegmentedRange] = React.useState<"day" | "week" | "month" | "all">("week")
  const cycleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: t.status === "done" ? "running" : t.status === "running" ? "pending" : "done" } : t))
  }
  const noticeItems: ComposerNoticeItem[] = [
    {
      id: "plan",
      kind: "plan",
      label: "任务编排",
      summary: "构建并安装 debug APK",
      count: 4,
      details: [
        { id: "s1", title: "gradlew assembleDebug", meta: "done", state: "done" },
        { id: "s2", title: "adb install -r app-debug.apk", meta: "12.4 MB", state: "done" },
        { id: "s3", title: "adb shell am start 主 Activity", state: "running" },
        { id: "s4", title: "回传启动日志", state: "pending" },
      ],
    },
    {
      id: "background",
      kind: "background",
      label: "后台任务",
      summary: "下载 Android 15 system image",
      running: true,
      badge: "68%",
      details: [
        { id: "b1", title: "system-image-arm64.zip", description: "1.4 GB / 2.0 GB", meta: "68%", state: "running" },
        { id: "b2", title: "校验完整性", state: "pending" },
      ],
    },
    {
      id: "queue-single",
      kind: "queue",
      label: "追加消息",
      summary: "把刚才的日志再整理一下",
      details: [
        { id: "q1", title: "把刚才的日志再整理一下" },
      ],
    },
    {
      id: "queue-multi",
      kind: "queue",
      label: "追加消息",
      summary: "3 条消息等待发送",
      count: 3,
      details: [
        { id: "q2", title: "补一张深色模式截图" },
        { id: "q3", title: "检查压缩后的 CSS 有没有丢规则" },
        { id: "q4", title: "最后再跑一次类型检查" },
      ],
    },    {
      id: "files",
      kind: "files",
      label: "文件改动",
      summary: "3 个文件已修改",
      files: [
        { id: "f1", path: "src/views/Chat/ComposerInput.tsx", added: 24, removed: 8, state: "done" },
        { id: "f2", path: "src/platform/chatApi.ts", added: 6, removed: 1, state: "done" },
        { id: "f3", path: "src/styles/conversation.css", added: 12, removed: 0, state: "done" },
      ],
    },
    {
      id: "permission",
      kind: "permission",
      label: "权限请求",
      summary: "adb shell rm -rf /sdcard/tmp",
      attention: true,
      badge: "待审批",
      details: [
        { id: "p1", title: "删除设备临时目录", description: "/sdcard/tmp · 不可恢复", meta: "高", state: "error" },
      ],
    },
  ]
  React.useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add("dark")
      root.setAttribute("data-theme", "dark")
    } else {
      root.classList.remove("dark")
      root.removeAttribute("data-theme")
    }
    root.setAttribute("data-accent", accentColor)
  }, [dark, accentColor])
  // 每个组件一个页面，可用 URL hash 直达：/#button、/#dialog ...
  React.useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.replace(/^#/, "")
      if (hash && NAV_ITEMS.some((n) => n.id === hash)) setActiveId(hash)
    }
    fromHash()
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
  }, [])
  // 左右方向键翻页
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      // 组件内部的方向键交互（单选框/标签页/滑块/菜单等）优先
      if (
        target?.closest?.(
          'button,[role="button"],[role="radio"],[role="tab"],[role="slider"],[role="menuitem"],[role="menuitemradio"],[role="option"],[contenteditable="true"]'
        )
      ) return
      const idx = NAV_ITEMS.findIndex((n) => n.id === activeId)
      if (idx < 0) return
      if (e.key === "ArrowRight" && idx < NAV_ITEMS.length - 1) {
        e.preventDefault()
        goToPage(NAV_ITEMS[idx + 1].id)
      } else if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault()
        goToPage(NAV_ITEMS[idx - 1].id)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [activeId])
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenCommand((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  const filteredNav = NAV_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(filter.toLowerCase()) ||
      item.label.includes(filter)
  )
  const goToPage = (id: string) => {
    setActiveId(id)
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`)
    }
    window.scrollTo({ top: 0, behavior: "auto" })
  }
  const scrollTo = goToPage
  const activeIndex = NAV_ITEMS.findIndex((n) => n.id === activeId)
  const current = activeIndex >= 0 ? NAV_ITEMS[activeIndex] : undefined
  const prevItem = activeIndex > 0 ? NAV_ITEMS[activeIndex - 1] : undefined
  const nextItem = activeIndex >= 0 && activeIndex < NAV_ITEMS.length - 1 ? NAV_ITEMS[activeIndex + 1] : undefined
  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col">
      {/* 顶部 Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="flex h-12 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-xs">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight">rain-ui</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary border border-primary/20">
                  Apple HIG · shadcn/ui 1:1
                </span>
              </div>
            </div>
          </div>
                    <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenCommand(true)}
              className="gap-1.5 text-xs text-muted-foreground hidden sm:inline-flex"
            >
              <Search className="size-3.5" />
              <span>快速搜索...</span>
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </Button>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-border/60 bg-muted/30">
              <span className="text-[11px] text-muted-foreground mr-1 hidden sm:inline">主题色:</span>
              {[
                { id: "emerald", label: "Emerald Jade (极光松石绿 · 幽绿漫射)", bg: "bg-[#10B981]" },
                { id: "indigo", label: "Slate Indigo (雾霾靛青 · Raycast 冷靛)", bg: "bg-[#6366F1]" },
                { id: "amber", label: "Warm Bronze Amber (曜石琥珀金 · 钛金暖调)", bg: "bg-[#F59E0B]" },
                { id: "mint", label: "Glacier Mint (冰川薄荷青 · 清澈透光)", bg: "bg-[#06B6D4]" },
                { id: "violet", label: "Cosmic Violet (深空暗紫星霓 · 晶石暗紫)", bg: "bg-[#8B5CF6]" },
                { id: "graphite", label: "Graphite (原生桌面钛灰 · 中性石墨)", bg: "bg-[#4B5563]" },
              ].map((c) => (
                <button
                  key={c.id}
                  title={c.label}
                  onClick={() => setAccentColor(c.id as any)}
                  className={cn(
                    "size-4 rounded-full transition-transform",
                    c.bg,
                    accentColor === c.id ? "ring-2 ring-primary ring-offset-2 scale-110" : "opacity-70 hover:opacity-100"
                  )}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDark((prev) => !prev)}
              className="gap-1.5 text-xs"
            >
              {dark ? (
                <>
                  <Sun className="size-3.5 text-amber-500" />
                  <span>切换白天</span>
                </>
              ) : (
                <>
                  <Moon className="size-3.5 text-slate-700" />
                  <span>切换暗黑</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
      {/* 主体两栏布局：左侧导航 + 右侧一一陈列 */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* 左侧固钉导航栏 */}
        <aside className="w-64 shrink-0 border-r border-border/60 hidden md:flex flex-col sticky top-12 h-[calc(100vh-3rem)] bg-muted/10">
          <div className="p-3 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索组件..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full h-7 pl-8 pr-2.5 rounded-md text-xs bg-muted/60 border border-border/60 focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <ScrollArea className="flex-1 p-2">
              {(["base", "composed"] as const).map((group) => {
                const groupItems = filteredNav.filter((item) => item.group === group)
                if (!groupItems.length) return null
                return (
                  <div key={group} className="mb-3 last:mb-0">
                    <div className="px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                      <span>{group === "composed" ? "组合组件" : "基础组件"}</span>
                      <span className="text-[10px] font-mono text-muted-foreground/80">{groupItems.length}</span>
                    </div>
                    <nav className="space-y-0.5 text-xs">
                      {groupItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollTo(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
                            activeId === item.id
                              ? "bg-primary text-primary-foreground font-medium shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          <span className={`text-[10px] truncate ml-1 ${activeId === item.id ? "text-primary-foreground/80" : "text-muted-foreground/70"}`}>
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>
                )
              })}
          </ScrollArea>
          <div className="p-3 border-t border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>清单内全部 {NAV_ITEMS.length} 项</span>
            <span className="font-mono text-[10px]">100% 对应</span>
          </div>
        </aside>
        {/* 右侧：一个组件一页，上一页 / 下一页切换 */}
        <main className="flex-1 min-w-0 p-6 md:p-8 flex flex-col gap-6">
          {/* 当前页标题栏 */}
          <div className="rounded-xl border border-border/80 bg-gradient-to-r from-muted/40 via-muted/20 to-background p-4 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className={cn(
                  "mt-0.5 size-8 shrink-0 rounded-lg border flex items-center justify-center",
                  current?.group === "composed"
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-muted border-border text-muted-foreground"
                )}>
                  <Layers className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium border",
                      current?.group === "composed"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-border"
                    )}>
                      {current?.group === "composed" ? "组合组件" : "基础组件"}
                    </span>
                    <h1 className="text-base font-semibold tracking-tight text-foreground">{current?.title}</h1>
                    <span className="text-xs text-muted-foreground truncate">{current?.label}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                    第 {activeIndex + 1} / {NAV_ITEMS.length} 页
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!prevItem}
                  onClick={() => prevItem && goToPage(prevItem.id)}
                  className="gap-1 text-xs"
                >
                  <ChevronRight className="size-3.5 rotate-180" />
                  <span className="hidden sm:inline">上一页</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!nextItem}
                  onClick={() => nextItem && goToPage(nextItem.id)}
                  className="gap-1 text-xs"
                >
                  <span className="hidden sm:inline">下一页</span>
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
          <PageContext.Provider value={activeId}>
          {/* 组合组件 · 上下文圆环 */}
          <Section id="context-usage-ring" title="Context Ring" label="上下文用量圆环（70% 警告 / 90% 危险）" count={0}>
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                输入框右下角的上下文占用指示器。就绪态只画填充弧、绝不整圈旋转；读取中仅让填充弧呼吸。
              </p>
              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/70 bg-muted/20 p-3">
                <ContextUsageRing percent={28} tokens={84000} capacity={300000} systemTokens={9400} toolTokens={16200} />
                <ContextUsageRing percent={74} tokens={222000} capacity={300000} systemTokens={9400} toolTokens={16200} />
                <ContextUsageRing percent={93} tokens={279000} capacity={300000} systemTokens={9400} toolTokens={16200} />
                <ContextUsageRing percent={null} busy />
              </div>
              <div className="flex max-w-md flex-wrap items-center gap-4 rounded-xl border border-border/70 bg-card p-3">
                <span className="text-xs text-muted-foreground">带读数来源：</span>
                <ContextUsageRing percent={62} tokens={186000} capacity={300000} systemTokens={12400} toolTokens={23100} readingModelId="claude-sonnet-4" />
              </div>
            </div>
          </Section>

          {/* 组合组件 · 模型选择器 */}
          <Section id="model-provider-picker" title="Model Picker" label="模型选择器（含思考强度）" count={0}>
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                触发器与 Button default 完全同高（32px）、同圆角（10px）。只显示模型本身：模型图标 + 名称 + 200K + 思考强度，
                供应商与协议不出现在触发器上。模型弹层向上展开，思考强度使用独立的向上弹层，滑块与 Android-Tool 原版一致。
              </p>
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-muted/20 p-3">
                <ModelProviderPicker
                  providers={[
                    {
                      id: "anthropic",
                      name: "Anthropic",
                      models: [
                        { id: "claude-sonnet-4", name: "Claude Sonnet 4", contextWindow: 200000, supportsReasoning: true },
                        { id: "claude-opus-4", name: "Claude Opus 4", contextWindow: 200000, supportsReasoning: true },
                        { id: "claude-haiku-3-5", name: "Claude Haiku 3.5", contextWindow: 200000 },
                      ],
                    },
                    {
                      id: "openai",
                      name: "OpenAI",
                      models: [
                        { id: "gpt-5", name: "GPT-5", contextWindow: 400000, supportsReasoning: true },
                        { id: "gpt-5-mini", name: "GPT-5 mini", contextWindow: 128000 },
                      ],
                    },
                    {
                      id: "local",
                      name: "Ollama (本地)",
                      models: [{ id: "qwen3-coder", name: "Qwen3 Coder 30B", contextWindow: 262144 }],
                    },
                  ]}
                  selectedProviderId={providerId}
                  selectedModelId={modelId}
                  reasoningLevel={reasoningLevel}
                  onReasoningLevelChange={setReasoningLevel}
                  onSelect={(p, m) => { setProviderId(p); setModelId(m) }}
                  onOpenSettings={() => toast("打开模型设置")}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                当前：{providerId} / {modelId} · 思考强度 {reasoningLevel}
              </p>
            </div>
          </Section>

          {/* 组合组件 · 通知停靠区 */}
          <Section id="composer-notice-dock" title="Notice Dock" label="通知停靠区（可展开卡片组）" count={0}>
            <div className="max-w-xl space-y-3">
              <p className="text-xs text-muted-foreground">
                收起是一行胶囊，点击展开为卡片明细，同一时刻只展开一张。文件改动是独立卡：朝上浮层展开、悬浮不占位。
              </p>
              <ComposerNoticeDock items={noticeItems} />
            </div>
          </Section>

          {/* 组合组件 · 任务状态 */}
          <Section id="task-status-row" title="Task Status" label="任务进度（总卡 + 各自小卡）" count={0}>
            <div className="max-w-xl space-y-3">
              <p className="text-xs text-muted-foreground">一张总卡包住全部任务，每个任务各自一张小卡；点击可循环切换状态：</p>
              <TaskStatusRow
                title="构建并部署 debug 包"
                description="Android 15 · Pixel 8 Pro"
                tasks={tasks}
                onToggleStatus={cycleTask}
              />
            </div>
          </Section>

          {/* 组合组件 · 拖动条 */}
          <Section id="terminal-range-slider" title="Range Slider" label="设置项拖动条（终端字号）" count={0}>
            <div className="max-w-2xl space-y-3">
              <p className="text-xs text-muted-foreground">设置面板右侧的数值拖动条，圆形 thumb + 数值药丸：</p>
              <TerminalRangeSlider value={terminalFontSize} min={10} max={24} onChange={setTerminalFontSize} />
              <TerminalRangeSlider
                title="终端行高"
                desc="终端渲染时的行高倍数，影响阅读密度"
                value={14}
                min={10}
                max={22}
                unit=""
                onChange={() => {}}
              />
            </div>
          </Section>

          {/* 组合组件 · 上下文压缩 */}
          <Section id="compaction-progress" title="Compaction" label="上下文压缩状态（窄胶囊）" count={0}>
            <div className="max-w-2xl space-y-2.5">
              <p className="text-xs text-muted-foreground">宽度随内容收缩，不再拉满一整行：</p>
              <div className="flex flex-wrap items-center gap-2">
                <CompactionProgress status="running" progress={46} detail="62 / 134 条" />
                <CompactionProgress status="running" progress={null} />
                <CompactionProgress status="completed" detail="12,400 → 3,200" />
                <CompactionProgress status="interrupted" />
                <CompactionProgress status="failed" detail="429" />
              </div>
            </div>
          </Section>

          {/* 组合组件 · 会话用量 */}
          <Section id="usage-metrics-strip" title="Usage Metrics" label="会话用量条（可插槽 / 悬停展开）" count={0}>
            <div className="max-w-4xl space-y-4">
              <p className="text-xs text-muted-foreground">
                一行细字统计，条目用竖线分隔。带 detail 的条目 hover 用 Tooltip 展开；Token 用量点击展开明细浮层。
              </p>
              <div className="rounded-xl border border-border/70 bg-card p-3">
                <UsageMetricsStrip
                  tokenUsage={{
                    total: "5.1M tok",
                    rows: [
                      { id: "cache", label: "缓存命中", value: "97.3%" },
                      { id: "uncached", label: "未缓存输入", value: "159,549 tok" },
                      { id: "read", label: "缓存读取", value: "4,771,200 tok" },
                      { id: "output", label: "输出", value: "170,783 tok" },
                    ],
                  }}
                  metrics={[
                    { id: "in", label: "会话输入", value: "69.3M" },
                    { id: "out", label: "会话输出", value: "602.4K" },
                    { id: "speed", label: "输出速度", value: "124 token/s" },
                  ]}
                  balance={{ label: "余额", value: "—", refreshing: balanceRefreshing }}
                  onRefreshBalance={() => {
                    setBalanceRefreshing(true)
                    window.setTimeout(() => setBalanceRefreshing(false), 1200)
                  }}
                  cost={{ label: "本轮消费", value: "0.702403" }}
                />
              </div>
            </div>
          </Section>

          {/* 组合组件 · 分段切换 */}
          <Section id="segmented-control" title="Segmented" label="分段切换（Tabs 封装）" count={0}>
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">直接复用基础组件 Tabs，不再自建按钮：</p>
              <div className="flex flex-wrap items-center gap-4">
                <SegmentedControl
                  label="视图切换"
                  value={segmentedView}
                  onChange={setSegmentedView}
                  options={[
                    { value: "conversation", label: "对话" },
                    { value: "terminal", label: "终端" },
                    { value: "files", label: "文件" },
                  ]}
                />
                <SegmentedControl
                  label="时间范围"
                  value={segmentedRange}
                  onChange={setSegmentedRange}
                  options={[
                    { value: "day", label: "今天" },
                    { value: "week", label: "近 7 天" },
                    { value: "month", label: "近 30 天" },
                    { value: "all", label: "全部", disabled: true },
                  ]}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">当前：{segmentedView} / {segmentedRange}</p>
            </div>
          </Section>

          {/* 组合组件 · 状态徽章 */}
          <Section id="status-badge" title="Status Badge" label="状态徽章（24px 高）" count={0}>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge variant="primary" pulse>运行中</StatusBadge>
              <StatusBadge variant="success">已完成</StatusBadge>
              <StatusBadge variant="warning" pulse>等待审批</StatusBadge>
              <StatusBadge variant="danger">失败</StatusBadge>
              <StatusBadge variant="neutral">空闲</StatusBadge>
              <StatusBadge variant="primary" hideDot>v2.4.0</StatusBadge>
            </div>
          </Section>

          {/* Avatar */}
          <Section id="avatar" title="Avatar" label="头像" count={0}>
            <div className="flex flex-wrap items-center gap-3">
              <Avatar className="size-9">
                <AvatarImage src="https://github.com/shadcn.png" alt="用户头像" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar className="size-8">
                <AvatarFallback>RN</AvatarFallback>
              </Avatar>
              <Avatar className="size-6">
                <AvatarFallback>UI</AvatarFallback>
              </Avatar>
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">AP</AvatarFallback>
              </Avatar>
            </div>
          </Section>

          {/* Progress */}
          <Section id="progress" title="Progress" label="进度条" count={0}>
            <div className="max-w-md space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>上传中</span>
                  <span className="tabular-nums">62%</span>
                </div>
                <Progress value={62} />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>已满</span>
                  <span className="tabular-nums">100%</span>
                </div>
                <Progress value={100} />
              </div>
              <Progress value={18} className="h-1" />
            </div>
          </Section>

          {/* Accordion */}
          <Section id="accordion" title="Accordion" label="折叠面板" count={0}>
            <Accordion type="single" collapsible defaultValue="a" className="max-w-md">
              <AccordionItem value="a">
                <AccordionTrigger>什么是 rain-ui？</AccordionTrigger>
                <AccordionContent>
                  一套面向桌面工具类应用的组件库：统一 32px 控件度量、10px 圆角，暗色与亮色同步。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="b">
                <AccordionTrigger>可以和 shadcn 混用吗？</AccordionTrigger>
                <AccordionContent>可以，组件 API 与 shadcn/ui 保持一致，样式令牌独立。</AccordionContent>
              </AccordionItem>
              <AccordionItem value="c">
                <AccordionTrigger>默认主题是什么？</AccordionTrigger>
                <AccordionContent>Slate Indigo（#6366F1），另有 5 套桌面级强调色可选。</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          {/* Hover Card */}
          <Section id="hover-card" title="Hover Card" label="悬停卡片" count={0}>
            <HoverCard openDelay={80}>
              <HoverCardTrigger asChild>
                <Button variant="link" className="h-auto px-0">@rain-ui</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-72">
                <div className="flex items-start gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback>RN</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">rain-ui</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      桌面工具类应用的组件库。统一度量 · Apple HIG 质感 · 明暗双主题。
                    </p>
                    <p className="text-[11px] text-muted-foreground">加入于 2026 年 10 月</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </Section>

          {/* Badge */}
          <Section id="badge" title="Badge" label="徽章（与 Button 同族：24px 高 / 6px 圆角）" count={0}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>默认</Badge>
              <Badge variant="secondary">次要</Badge>
              <Badge variant="outline">描边</Badge>
              <Badge variant="muted">中性</Badge>
              <Badge variant="success">成功</Badge>
              <Badge variant="warning">警告</Badge>
              <Badge variant="destructive">危险</Badge>
              <Badge variant="outline">
                <Check className="size-3" /> 带图标
              </Badge>
            </div>
          </Section>

          <Section id="alert-dialog" title="AlertDialog" label="确认对话框" count={11}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Show Alert Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Section>
          {/* 3. Button */}
          <Section id="button" title="Button" label="Button (Radix-Nova 官方标准)" count={12}>
            <div className="space-y-5">
              {/* 官方文档首屏示例 (1:1 纯正对标图1) */}
              <div className="rounded-xl border border-border/80 bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">官方文档首屏示例 (图1 1:1 对齐 · 描边与图标按钮)：</p>
                <div className="flex items-center gap-3">
                  <Button variant="outline">Button</Button>
                  <Button variant="outline" size="icon" aria-label="Submit">
                    <ArrowUp className="size-4" />
                  </Button>
                </div>
              </div>

              {/* 样式变体 Variants */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">样式变体 (Variants)：</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              {/* 官方全尺寸阶梯 (绝对无虚构的 md) */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">尺寸阶梯 (Sizes · 官方规范)：</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="xs">xs (24px · h-6)</Button>
                  <Button size="sm">sm (28px · h-7)</Button>
                  <Button size="default">default (32px · h-8)</Button>
                  <Button size="lg">lg (36px · h-9)</Button>
                </div>
              </div>

              {/* 图标与扩展规范 */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">图标与状态 (圆形圆角、带前后图标、加载 Spinner)：</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="icon">
                    <CircleFadingArrowUp className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <GitBranch className="mr-1.5 size-3.5" /> New Branch
                  </Button>
                  <Button variant="default" size="sm">
                    Deploy <ArrowUpRight className="ml-1.5 size-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Spinner className="mr-1.5 size-3.5" /> Please wait...
                  </Button>
                </div>
              </div>

              {/* 常用纯图标快捷按钮 (Ghost / Transparent 无背景色) */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">纯图标按钮 (Ghost / Transparent · 桌面工具快捷操作)：</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button variant="ghost" size="icon" title="搜索">
                    <Search className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="复制">
                    <Copy className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="刷新">
                    <RotateCw className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="设置">
                    <Settings className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="更多">
                    <MoreHorizontal className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="关闭" className="hover:bg-destructive/10 hover:text-destructive">
                    <X className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="rounded-full" title="新建">
                    <Plus className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </Section>
          {/* 4. Button Group */}
          <Section id="button-group" title="Button Group" label="按钮组 (带下拉及复合状态)" count={13}>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">官方 1:1 ButtonGroup 交互实装（支持 Icon、分段组合与 DropdownMenu 下拉）：</p>
              <ButtonGroupDemo />
            </div>
          </Section>
          {/* 5. Card */}
          <Section id="card" title="Card" label="卡片" count={14}>
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Create project</CardTitle>
                <CardDescription>Deploy your new project in one-click.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Your project will be deployed immediately with global CDN edge routing.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Deploy</Button>
              </CardFooter>
            </Card>
          </Section>
          {/* 6. Checkbox */}
          <Section id="checkbox" title="Checkbox" label="复选框" count={15}>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" defaultChecked />
              <Label htmlFor="terms" className="text-xs cursor-pointer">
                Accept terms and conditions
              </Label>
            </div>
          </Section>
          {/* 7. Combobox */}
          <Section id="combobox" title="Combobox" label="组合框 (可点击展开与搜索选择)" count={16}>
            <div className="w-64">
              <Combobox
                value={comboboxVal}
                onChange={setComboboxVal}
                options={[
                  { label: "React (Next.js)", value: "react" },
                  { label: "Vue (Nuxt.js)", value: "vue" },
                  { label: "SvelteKit", value: "svelte" },
                  { label: "Astro", value: "astro" },
                  { label: "Angular", value: "angular" },
                ]}
                placeholder="Select framework..."
              />
            </div>
          </Section>
          {/* 8. Command */}
          <Section id="command" title="Command" label="命令面板 (支持点击按钮展开 & 快捷键 ⌘K)" count={17}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button onClick={() => setOpenCommand(true)} className="gap-2">
                  <Search className="size-3.5" />
                  <span>打开命令面板</span>
                  <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border bg-muted px-1 font-mono text-[9px] font-medium text-muted-foreground opacity-100">
                    ⌘K
                  </kbd>
                </Button>
                <span className="text-xs text-muted-foreground">点击按钮或按快捷键 ⌘K 随时弹出展开面板</span>
              </div>
              {/* 弹窗模式 */}
              <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
                <CommandInput placeholder="输入命令或搜索应用..." />
                <CommandList>
                  <CommandEmpty>未找到匹配项目。</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem onSelect={() => setOpenCommand(false)}>
                      <Calendar className="size-4" />
                      <span>Calendar</span>
                      <CommandShortcut>⌘C</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => setOpenCommand(false)}>
                      <Sparkles className="size-4" />
                      <span>Search Emoji</span>
                      <CommandShortcut>⌘E</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => setOpenCommand(false)}>
                      <CreditCard className="size-4" />
                      <span>Billing & Payments</span>
                      <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Settings">
                    <CommandItem onSelect={() => setOpenCommand(false)}>
                      <User className="size-4" />
                      <span>Profile</span>
                      <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => setOpenCommand(false)}>
                      <Settings className="size-4" />
                      <span>System Settings</span>
                      <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </CommandDialog>
              {/* 嵌入式面板 */}
              <div className="text-xs text-muted-foreground mb-1">内嵌面板展示：</div>
              <Command className="rounded-lg border border-border/70 shadow-xs max-w-sm">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <Calendar className="size-4 mr-1" /> Calendar
                    </CommandItem>
                    <CommandItem>
                      <Sparkles className="size-4 mr-1" /> Search Emoji
                    </CommandItem>
                    <CommandItem>
                      <Terminal className="size-4 mr-1" /> Terminal Shell
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </Section>
          {/* 9. Context Menu */}
          <Section id="context-menu" title="Context Menu" label="右键上下文菜单" count={18}>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-24 w-full max-w-sm items-center justify-center rounded-md border border-dashed border-border/80 text-xs text-muted-foreground select-none bg-muted/20">
                在此区域右键点击打开菜单
              </ContextMenuTrigger>
              <ContextMenuContent className="w-52">
                <ContextMenuItem>Back <ContextMenuShortcut>⌘[</ContextMenuShortcut></ContextMenuItem>
                <ContextMenuItem>Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut></ContextMenuItem>
                <ContextMenuItem>Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut></ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Save Page As... <ContextMenuShortcut>⌘S</ContextMenuShortcut></ContextMenuItem>
                <ContextMenuItem>Inspect Element <ContextMenuShortcut>⌥⌘I</ContextMenuShortcut></ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </Section>
          {/* 10. Dialog */}
          <Section id="dialog" title="Dialog" label="模态对话框" count={19}>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <Field label="Name">
                    <Input defaultValue="Apple HIG" />
                  </Field>
                  <Field label="Username">
                    <Input defaultValue="@rain-ui" />
                  </Field>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Section>
          {/* 11. Dropdown Menu */}
          <Section id="dropdown-menu" title="Dropdown Menu" label="下拉菜单 (丰富多级子菜单/单选/快捷键)" count={20}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  Open Options
                  <MoreHorizontal className="size-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="size-4" />
                    <span>Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="size-4" />
                    <span>Billing</span>
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="size-4" />
                    <span>Settings</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Folder className="size-4" />
                    <span>Workspace</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={dropdownCategory} onValueChange={setDropdownCategory}>
                      <DropdownMenuRadioItem value="personal">Personal</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="work">Work / Enterprise</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="developer">Developer Team</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut className="size-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Section>
          {/* 12. Empty */}
          <Section id="empty" title="Empty" label="空状态 (shadcn 1:1 复合结构)" count={21}>
            <div className="w-full max-w-xl mx-auto">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <IconFolderCode className="size-4 text-foreground/80" />
                  </EmptyMedia>
                  <EmptyTitle>No Projects Yet</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t created any projects yet. Get started by creating your first project.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button>Create Project</Button>
                    <Button variant="outline">Import Project</Button>
                  </div>
                  <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground text-xs gap-1 mt-1">
                    Learn More <ArrowUpRight className="size-3.5" />
                  </Button>
                </EmptyContent>
              </Empty>
            </div>
          </Section>
          {/* 13. Field */}
          <Section id="field" title="Field" label="表单字段" count={22}>
            <div className="max-w-sm space-y-3">
              <Field label="Email Address" hint="We will never share your email with third parties.">
                <Input placeholder="m@example.com" />
              </Field>
              <Field label="Password" required error="Password must be at least 8 characters.">
                <Input type="password" defaultValue="12345" />
              </Field>
            </div>
          </Section>
          {/* 14. Input */}
          <Section id="input" title="Input" label="输入框 (统一 h-8 · 32px)" count={23}>
            <div className="max-w-sm space-y-2">
              <Input placeholder="Default input (32px)" />
              <Input disabled placeholder="Disabled input" />
              <Input type="search" placeholder="Search..." />
            </div>
          </Section>
          {/* 15. Input Group */}
          {/* 15. Input Group */}
          <Section id="input-group" title="Input Group" label="输入框组 (严格对齐 shadcn skill 规范)" count={24}>
            <div className="max-w-sm space-y-3">
              <InputGroup>
                <InputGroupAddon align="start">
                  <Search className="size-3.5 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Search documents..." />
              </InputGroup>
              <InputGroup>
                <InputGroupInput placeholder="Quick action..." />
                <InputGroupAddon align="end">
                  <kbd className="pointer-events-none inline-flex h-4 select-none items-center rounded border border-border/60 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">⌘K</kbd>
                </InputGroupAddon>
              </InputGroup>
              <InputGroup>
                <InputGroupInput placeholder="Search with button..." />
                <InputGroupAddon align="end">
                  <Button size="icon" variant="ghost" className="size-6 text-muted-foreground hover:text-foreground">
                    <ArrowRight className="size-3.5" data-icon="inline-end" />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </Section>
          {/* 16. Item */}
          <Section id="item" title="Item" label="列表项 (复合组件规范 1:1)" count={25}>
            <div className="flex w-full max-w-xs flex-col gap-3">
              <Item variant="muted">
                <ItemMedia>
                  <Spinner size="sm" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="line-clamp-1">Processing payment...</ItemTitle>
                  <ItemDescription>Apple Pay Express Checkout</ItemDescription>
                </ItemContent>
                <ItemContent className="flex-none justify-end">
                  <span className="text-sm tabular-nums font-medium text-foreground">$100.00</span>
                </ItemContent>
              </Item>
              <Item variant="outline">
                <ItemMedia>
                  <Smartphone className="size-4 text-primary" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="line-clamp-1">iPhone 16 Pro Max</ItemTitle>
                  <ItemDescription>Connected via Wi-Fi · 98%</ItemDescription>
                </ItemContent>
                <ItemContent className="flex-none justify-end">
                  <Button variant="ghost" size="xs">Manage</Button>
                </ItemContent>
              </Item>
            </div>
          </Section>
          {/* 17. Label */}
          <Section id="label" title="Label" label="标签" count={26}>
            <div className="max-w-sm space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="label-demo" />
                <Label htmlFor="label-demo" className="text-xs cursor-pointer">
                  Accept terms and conditions
                </Label>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="username-input" className="text-xs flex items-center gap-1">
                  <span>Username</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input id="username-input" placeholder="@apple" />
              </div>
            </div>
          </Section>
          {/* 18. Menubar */}
          <Section id="menubar" title="Menubar" label="菜单栏" count={27}>
            <Menubar className="w-fit">
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
                  <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Print... <MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
                  <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Reload <MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </Section>
          {/* 19. Pagination */}
          <Section id="pagination" title="Pagination" label="分页 (含省略号规范)" count={28}>
            <Pagination className="justify-start">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Section>
          {/* 20. Popover */}
          <Section id="popover" title="Popover" label="气泡浮层" count={29}>
            <Popover>
              <PopoverTrigger asChild>
                <Button>Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3 text-xs space-y-2">
                <h4 className="font-semibold text-foreground">Dimensions</h4>
                <p className="text-muted-foreground">Set the width and height for your canvas.</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Input placeholder="Width" defaultValue="100%" />
                  <Input placeholder="Height" defaultValue="250px" />
                </div>
              </PopoverContent>
            </Popover>
          </Section>
          {/* 21. Radio Group */}
          <Section id="radio-group" title="Radio Group" label="单选框组" count={30}>
            <RadioGroup defaultValue="comfortable" className="gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" />
                <Label htmlFor="r1" className="text-xs cursor-pointer">Default spacing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label htmlFor="r2" className="text-xs cursor-pointer">Comfortable spacing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="r3" />
                <Label htmlFor="r3" className="text-xs cursor-pointer">Compact (HIG Desktop)</Label>
              </div>
            </RadioGroup>
          </Section>
          {/* 22. Resizable */}
          <Section id="resizable" title="Resizable" label="可调整尺寸面板" count={31}>
            <div className="h-40 rounded-lg border border-border/70 overflow-hidden">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={35} minSize={20}>
                  <div className="flex h-full items-center justify-center p-3 text-xs text-muted-foreground bg-muted/20">
                    Sidebar (35%)
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={65}>
                  <div className="flex h-full items-center justify-center p-3 text-xs text-foreground bg-card">
                    Content Panel (65%)
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </Section>
          {/* 23. Scroll Area */}
          <Section id="scroll-area" title="Scroll Area" label="定制轻量滚动条" count={32}>
            <ScrollArea className="h-32 w-64 rounded-md border border-border/60 p-3 text-xs">
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Apple HIG Guidelines</p>
                {Array.from({ length: 10 }).map((_, i) => (
                  <p key={i} className="text-muted-foreground text-[11px]">
                    Item {i + 1}: Clear hierarchy, responsive layout, refined typography and consistent touch targets.
                  </p>
                ))}
              </div>
            </ScrollArea>
          </Section>
          {/* 24. Select */}
          <Section id="select" title="Select" label="下拉选择框" count={33}>
            <div className="w-56">
              <Select defaultValue="apple">
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Apple macOS / iOS</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="windows">Windows</SelectItem>
                  <SelectItem value="linux">Linux</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Section>
          {/* 25. Separator */}
          <Section id="separator" title="Separator" label="分割线" count={34}>
            <div className="space-y-2">
              <div className="text-xs font-medium">Section Header</div>
              <Separator />
              <div className="flex h-4 items-center space-x-3 text-xs text-muted-foreground">
                <span>Blog</span>
                <Separator orientation="vertical" />
                <span>Docs</span>
                <Separator orientation="vertical" />
                <span>Source</span>
              </div>
            </div>
          </Section>
          {/* 26. Sidebar */}
          <Section id="sidebar" title="Sidebar" label="侧边栏视图组件 (支持折叠/展开收缩切换 · 1:1)" count={35}>
            <div className="border border-border/70 rounded-xl overflow-hidden h-72 flex bg-card shadow-xs transition-all">
              <div className={cn("border-r border-border/60 flex flex-col bg-muted/20 transition-all duration-300", sidebarCollapsed ? "w-14 items-center" : "w-60")}>
                <div className={cn("p-2.5 border-b border-border/50 flex items-center w-full", sidebarCollapsed ? "justify-center" : "justify-between")}>
                  {!sidebarCollapsed ? (
                    <>
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="size-6 shrink-0 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                          A
                        </div>
                        <div className="flex flex-col text-left overflow-hidden">
                          <span className="text-xs font-semibold leading-tight truncate">Acme Inc</span>
                          <span className="text-[10px] text-muted-foreground leading-tight truncate">Enterprise Plan</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="rounded-md shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={() => setSidebarCollapsed(true)}
                        title="收缩侧边栏"
                      >
                        <PanelLeftClose className="size-3.5" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-md text-muted-foreground hover:text-foreground"
                      onClick={() => setSidebarCollapsed(false)}
                      title="展开侧边栏"
                    >
                      <PanelLeft className="size-3.5" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 p-2 space-y-1 overflow-y-auto w-full">
                  {!sidebarCollapsed && (
                    <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">Platform</div>
                  )}
                  <button
                    className={cn(
                      "w-full flex items-center gap-2.5 rounded-md text-xs bg-primary text-primary-foreground font-medium text-left shadow-xs transition-colors",
                      sidebarCollapsed ? "justify-center p-2" : "px-2.5 py-1.5"
                    )}
                    title="Dashboard"
                  >
                    <Home className="size-3.5 shrink-0" />
                    {!sidebarCollapsed && <span>Dashboard</span>}
                  </button>
                  <button
                    className={cn(
                      "w-full flex items-center gap-2.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-left",
                      sidebarCollapsed ? "justify-center p-2" : "px-2.5 py-1.5"
                    )}
                    title="Inbox"
                  >
                    <Inbox className="size-3.5 shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span>Inbox</span>
                        <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-foreground font-medium">12</span>
                      </>
                    )}
                  </button>
                  <button
                    className={cn(
                      "w-full flex items-center gap-2.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-left",
                      sidebarCollapsed ? "justify-center p-2" : "px-2.5 py-1.5"
                    )}
                    title="Calendar"
                  >
                    <Calendar className="size-3.5 shrink-0" />
                    {!sidebarCollapsed && <span>Calendar</span>}
                  </button>
                  <button
                    className={cn(
                      "w-full flex items-center gap-2.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-left",
                      sidebarCollapsed ? "justify-center p-2" : "px-2.5 py-1.5"
                    )}
                    title="Settings"
                  >
                    <Settings className="size-3.5 shrink-0" />
                    {!sidebarCollapsed && <span>Settings</span>}
                  </button>
                </div>
                <div className={cn("p-2 border-t border-border/50 flex items-center w-full", sidebarCollapsed ? "justify-center" : "gap-2")}>
                  <div className="size-7 shrink-0 rounded-full bg-muted border flex items-center justify-center text-xs font-medium text-foreground">
                    JD
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex flex-col flex-1 min-w-0 text-left">
                      <span className="text-xs font-medium truncate">John Doe</span>
                      <span className="text-[10px] text-muted-foreground truncate">john@apple.com</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between text-xs text-muted-foreground bg-muted/5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {sidebarCollapsed && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs gap-1.5 rounded-md"
                        onClick={() => setSidebarCollapsed(false)}
                      >
                        <PanelLeft className="size-3.5" />
                        <span>展开侧边栏</span>
                      </Button>
                    )}
                    <span className="text-xs font-medium text-foreground">当前视图: Dashboard 仪表盘</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="h-20 border rounded-xl border-dashed bg-card/60 flex flex-col items-center justify-center text-xs text-muted-foreground gap-1">
                      <span className="font-medium text-foreground">总访问量</span>
                      <span className="text-lg font-bold text-foreground">128,430</span>
                    </div>
                    <div className="h-20 border rounded-xl border-dashed bg-card/60 flex flex-col items-center justify-center text-xs text-muted-foreground gap-1">
                      <span className="font-medium text-foreground">活跃任务</span>
                      <span className="text-lg font-bold text-foreground">99.8%</span>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-4 border-t border-border/30">
                  <span>点击左上角或快捷按钮可收缩/展开侧边栏（收缩为仅图标栏）。</span>
                  <span className="font-mono text-[10px] bg-muted/60 px-1.5 py-0.5 rounded">
                    state: {sidebarCollapsed ? "collapsed (56px)" : "expanded (240px)"}
                  </span>
                </div>
              </div>
            </div>
          </Section>
          {/* 27. Skeleton */}
          <Section id="skeleton" title="Skeleton" label="骨架屏" count={36}>
            <div className="flex items-center space-x-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-44" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </Section>
          {/* 28. Sonner */}
          <Section id="sonner" title="Sonner" label="Toast 消息 (顶部居中弹出 · 1:1)" count={37}>
            <Button
              onClick={() =>
                toast("Event created", {
                  description: "Sunday, December 03, 2026 at 9:00 AM",
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                  },
                })
              }
            >
              Trigger Sonner Toast
            </Button>
          </Section>
          {/* 29. Spinner */}
          <Section id="spinner" title="Spinner" label="加载指示器 (含 Item 官方实例)" count={38}>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">各尺寸加载微动效：</p>
                <div className="flex items-center gap-3">
                  <Spinner size="xs" />
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">官方 Item + Spinner 1:1 付款处理卡片：</p>
                <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
                  <Item variant="muted">
                    <ItemMedia>
                      <Spinner />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="line-clamp-1">Processing payment...</ItemTitle>
                    </ItemContent>
                    <ItemContent className="flex-none justify-end">
                      <span className="text-sm tabular-nums font-medium">$100.00</span>
                    </ItemContent>
                  </Item>
                </div>
              </div>
            </div>
          </Section>
          {/* 30. Switch */}
          <Section id="switch" title="Switch" label="开关 (20px Apple 绿胶囊)" count={39}>
            <div className="flex items-center space-x-3">
              <Switch id="airplane-mode" defaultChecked />
              <Label htmlFor="airplane-mode" className="text-xs cursor-pointer">
                Airplane Mode
              </Label>
            </div>
          </Section>
          {/* 31. Tables */}
          <Section id="table" title="Tables" label="表格" count={40}>
            <div className="rounded-md border border-border/70 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV-001</TableCell>
                    <TableCell className="text-emerald-500 font-medium">Paid</TableCell>
                    <TableCell>Apple Pay</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV-002</TableCell>
                    <TableCell className="text-amber-500 font-medium">Pending</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$150.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Section>
          {/* 32. Tabs */}
          {/* Slider */}
          <Section id="slider" title="Slider" label="滑块（基础组件）" count={0}>
            <div className="max-w-md space-y-5">
              <p className="text-xs text-muted-foreground">受控滑块：轨道 6px 全圆角，拇指 16px；命中区高 32px：</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">终端字号</span>
                  <span className="font-mono tabular-nums text-foreground">{sliderValue}px</span>
                </div>
                <Slider value={sliderValue} min={10} max={24} onValueChange={setSliderValue} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">禁用状态</span>
                  <span className="font-mono tabular-nums text-foreground">40</span>
                </div>
                <Slider value={40} disabled onValueChange={() => {}} />
              </div>
            </div>
          </Section>

          <Section id="tabs" title="Tabs" label="分段选项卡 (Apple 胶囊滑块与边框/内容层次)" count={41}>
            <div className="space-y-4 max-w-lg">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="account">账户信息</TabsTrigger>
                  <TabsTrigger value="password">安全密码</TabsTrigger>
                  <TabsTrigger value="notifications">通知推送</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="text-xs text-muted-foreground p-3.5 border border-border/60 rounded-[10px] bg-card shadow-xs mt-2.5">
                  <p className="font-medium text-foreground mb-1">个人账户管理</p>
                  <p className="leading-relaxed">支持随时更改您的公开显示名称、个人头像以及团队绑定的主电子邮箱。</p>
                </TabsContent>
                <TabsContent value="password" className="text-xs text-muted-foreground p-3.5 border border-border/60 rounded-[10px] bg-card shadow-xs mt-2.5">
                  <p className="font-medium text-foreground mb-1">修改密码与两步验证</p>
                  <p className="leading-relaxed">定期轮换您的密码，并开启 Apple Passkey 或硬件安全密钥保护。</p>
                </TabsContent>
                <TabsContent value="notifications" className="text-xs text-muted-foreground p-3.5 border border-border/60 rounded-[10px] bg-card shadow-xs mt-2.5">
                  <p className="font-medium text-foreground mb-1">通知接收偏好</p>
                  <p className="leading-relaxed">可设置是否接收每周项目汇总邮件，或仅在被 @ 提及时代发重要通知。</p>
                </TabsContent>
              </Tabs>
            </div>
          </Section>
          {/* 33. Textarea */}
          <Section id="textarea" title="Textarea" label="多行文本框" count={42}>
            <Textarea placeholder="Type your message here..." className="max-w-md h-20 text-xs" />
          </Section>
          {/* 34. Toggle */}
          <Section id="toggle" title="Toggle" label="切换状态按钮 (文本格式化切换)" count={43}>
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Toggle
                  size="sm"
                  aria-label="Toggle bold"
                  pressed={toggleBold}
                  onPressedChange={setToggleBold}
                >
                  <Bold className="size-3.5" />
                </Toggle>
                <Toggle
                  size="sm"
                  aria-label="Toggle italic"
                  pressed={toggleItalic}
                  onPressedChange={setToggleItalic}
                >
                  <Italic className="size-3.5" />
                </Toggle>
                <Toggle
                  size="sm"
                  aria-label="Toggle underline"
                  pressed={toggleUnderline}
                  onPressedChange={setToggleUnderline}
                >
                  <Underline className="size-3.5" />
                </Toggle>
              </div>
              <p className="text-xs text-muted-foreground">
                当前文本样式状态: {[toggleBold && "粗体", toggleItalic && "斜体", toggleUnderline && "下划线"].filter(Boolean).join(" + ") || "常规默认"}
              </p>
            </div>
          </Section>
          {/* 35. Tooltip */}
          <Section id="tooltip" title="Tooltip" label="文字提示浮层" count={44}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button>Hover over me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to library</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Section>
          </PageContext.Provider>
          {/* 底部翻页 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {prevItem ? (
              <button
                onClick={() => scrollTo(prevItem.id)}
                className="group flex items-center gap-3 rounded-lg border border-border/70 bg-card px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <ChevronRight className="size-4 rotate-180 text-muted-foreground" />
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">上一页 · {prevItem.group === "composed" ? "组合组件" : "基础组件"}</span>
                  <span className="block truncate text-xs font-medium text-foreground">{prevItem.title}</span>
                </span>
              </button>
            ) : <div className="hidden sm:block" />}
            {nextItem ? (
              <button
                onClick={() => scrollTo(nextItem.id)}
                className="group flex items-center justify-end gap-3 rounded-lg border border-border/70 bg-card px-4 py-3 text-right transition-colors hover:bg-muted/50"
              >
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">下一页 · {nextItem.group === "composed" ? "组合组件" : "基础组件"}</span>
                  <span className="block truncate text-xs font-medium text-foreground">{nextItem.title}</span>
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ) : <div className="hidden sm:block" />}
          </div>
        </main>
      </div>
      <Toaster position="top-center" />
    </div>
  )
}
function IconFolderCode({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="m10 10-2 2 2 2" />
      <path d="m14 14 2-2-2-2" />
    </svg>
  )
}
function LayoutGridIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}
