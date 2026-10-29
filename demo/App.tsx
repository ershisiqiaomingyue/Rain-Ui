"use client"

import * as React from "react"
import {
  Sun, Moon, Terminal, Plus, Trash2, Check, Sparkles,
  Smartphone, AlertTriangle, Search, Info, Settings,
  Folder, Layers, ChevronRight, ArrowRight, ExternalLink,
  MoreHorizontal, Play, RefreshCw, X, Shield, Sliders, Menu,
  Home, Inbox, Calendar, Search as SearchIcon, User2, ChevronUp
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
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
} from "@/components/ui/command"
import {
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator
} from "@/components/ui/context-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator as DropdownSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Empty } from "@/components/ui/empty"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { Item } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import {
  Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger
} from "@/components/ui/menubar"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItem {
  id: string
  title: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { id: "alert", title: "Alert", label: "警告提示" },
  { id: "alert-dialog", title: "AlertDialog", label: "确认对话框" },
  { id: "button", title: "Button", label: "按钮 (sm 28px)" },
  { id: "button-group", title: "Button Group", label: "按钮组 (带下拉)" },
  { id: "card", title: "Card", label: "卡片" },
  { id: "checkbox", title: "Checkbox", label: "复选框" },
  { id: "combobox", title: "Combobox", label: "组合框" },
  { id: "command", title: "Command", label: "命令面板" },
  { id: "context-menu", title: "Context Menu", label: "右键菜单" },
  { id: "dialog", title: "Dialog", label: "模态弹窗" },
  { id: "dropdown-menu", title: "Dropdown Menu", label: "下拉菜单" },
  { id: "empty", title: "Empty", label: "空状态" },
  { id: "field", title: "Field", label: "表单字段" },
  { id: "input", title: "Input", label: "输入框 (32px)" },
  { id: "input-group", title: "Input Group", label: "输入框组" },
  { id: "item", title: "Item", label: "列表项" },
  { id: "label", title: "Label", label: "标签" },
  { id: "menubar", title: "Menubar", label: "菜单栏" },
  { id: "pagination", title: "Pagination", label: "分页" },
  { id: "popover", title: "Popover", label: "气泡浮层" },
  { id: "radio-group", title: "Radio Group", label: "单选框组" },
  { id: "resizable", title: "Resizable", label: "可调整面板" },
  { id: "scroll-area", title: "Scroll Area", label: "滚动区域" },
  { id: "select", title: "Select", label: "选择器" },
  { id: "separator", title: "Separator", label: "分割线" },
  { id: "sidebar", title: "Sidebar", label: "侧边栏组件" },
  { id: "skeleton", title: "Skeleton", label: "骨架屏" },
  { id: "sonner", title: "Sonner", label: "Toast 消息" },
  { id: "spinner", title: "Spinner", label: "加载中" },
  { id: "switch", title: "Switch", label: "开关 (20px Apple绿)" },
  { id: "table", title: "Tables", label: "表格" },
  { id: "tabs", title: "Tabs", label: "分段标签页" },
  { id: "textarea", title: "Textarea", label: "多行文本输入" },
  { id: "tooltip", title: "Tooltip", label: "文字提示" },
]

function Section({ id, title, label, count, children }: { id: string; title: string; label: string; count: number; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 space-y-3 pb-8 border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[11px] font-mono text-muted-foreground">
          {count}
        </span>
        <h2 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
          {title}
          <span className="text-xs font-normal text-muted-foreground">({label})</span>
        </h2>
      </div>
      <div className="p-4 rounded-lg border border-border/60 bg-card shadow-xs">
        {children}
      </div>
    </section>
  )
}

export function App() {
  const [dark, setDark] = React.useState(false)
  const [activeId, setActiveId] = React.useState("button")
  const [filter, setFilter] = React.useState("")

  React.useEffect(() => {
    // 确保 html 上的 class 和 data-theme 正确同步
    const root = document.documentElement
    if (dark) {
      root.classList.add("dark")
      root.setAttribute("data-theme", "dark")
    } else {
      root.classList.remove("dark")
      root.removeAttribute("data-theme")
    }
  }, [dark])

  const filteredNav = NAV_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(filter.toLowerCase()) ||
      item.label.includes(filter)
  )

  const scrollTo = (id: string) => {
    setActiveId(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

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
                  Apple HIG · shadcn/ui
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              模式: <strong className="font-medium text-foreground">{dark ? "🌙 黑夜暗黑" : "☀️ 白天明亮"}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDark(!dark)}
              className="gap-1.5"
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
            <nav className="space-y-0.5 text-xs">
              {filteredNav.map((item) => (
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
          </ScrollArea>
          <div className="p-3 border-t border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>清单内全部 {NAV_ITEMS.length} 项</span>
            <span className="font-mono text-[10px]">100% 对应</span>
          </div>
        </aside>

        {/* 右侧组件逐项平铺 */}
        <main className="flex-1 min-w-0 p-6 md:p-8 space-y-10">
          {/* 1. Alert */}
          <Section id="alert" title="Alert" label="警告提示" count={1}>
            <div className="space-y-3">
              <Alert>
                <Terminal className="size-3.5" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app using the shadcn cli.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTriangle className="size-3.5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again.
                </AlertDescription>
              </Alert>
            </div>
          </Section>

          {/* 2. AlertDialog */}
          <Section id="alert-dialog" title="AlertDialog" label="确认对话框" count={2}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Show Alert Dialog</Button>
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
          <Section id="button" title="Button" label="按钮 (默认 sm 28px)" count={3}>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">默认样式变体 (默认尺寸 sm · 28px)：</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="default">Default (sm: 28px)</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">全尺寸阶梯：</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="xs">xs (24px)</Button>
                  <Button size="sm">sm / default (28px)</Button>
                  <Button size="md">md (32px)</Button>
                  <Button size="lg">lg (36px)</Button>
                  <Button size="icon" variant="outline"><Plus className="size-3.5" /></Button>
                </div>
              </div>
            </div>
          </Section>

          {/* 4. Button Group */}
          <Section id="button-group" title="Button Group" label="按钮组 (带下拉及复合状态)" count={4}>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">官方 1:1 ButtonGroup 交互实装（支持 Icon、分段组合与 DropdownMenu 下拉）：</p>
              <ButtonGroupDemo />
            </div>
          </Section>

          {/* 5. Card */}
          <Section id="card" title="Card" label="卡片" count={5}>
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
          <Section id="checkbox" title="Checkbox" label="复选框" count={6}>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" defaultChecked />
              <Label htmlFor="terms" className="text-xs cursor-pointer">
                Accept terms and conditions
              </Label>
            </div>
          </Section>

          {/* 7. Combobox */}
          <Section id="combobox" title="Combobox" label="组合框" count={7}>
            <div className="w-64">
              <Combobox
                options={[
                  { label: "React", value: "react" },
                  { label: "Vue", value: "vue" },
                  { label: "Svelte", value: "svelte" },
                  { label: "Next.js", value: "next" },
                ]}
                placeholder="Select framework..."
              />
            </div>
          </Section>

          {/* 8. Command */}
          <Section id="command" title="Command" label="命令面板" count={8}>
            <Command className="rounded-lg border border-border/70 shadow-xs max-w-sm">
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>Calendar</CommandItem>
                  <CommandItem>Search Emoji</CommandItem>
                  <CommandItem>Calculator</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </Section>

          {/* 9. Context Menu */}
          <Section id="context-menu" title="Context Menu" label="右键上下文菜单" count={9}>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-24 w-full max-w-sm items-center justify-center rounded-md border border-dashed border-border/80 text-xs text-muted-foreground select-none bg-muted/20">
                在此区域右键点击
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48">
                <ContextMenuItem>Back</ContextMenuItem>
                <ContextMenuItem>Forward</ContextMenuItem>
                <ContextMenuItem>Reload</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Inspect</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </Section>

          {/* 10. Dialog */}
          <Section id="dialog" title="Dialog" label="模态对话框" count={10}>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
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
          <Section id="dropdown-menu" title="Dropdown Menu" label="下拉菜单" count={11}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Open Options
                  <MoreHorizontal className="size-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownSeparator />
                <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Section>

          {/* 12. Empty */}
          <Section id="empty" title="Empty" label="空状态" count={12}>
            <Empty
              icon={<Folder className="size-8 text-muted-foreground/60" />}
              title="No files yet"
              description="Get started by uploading your first document."
              action={<Button size="sm"><Plus className="size-3.5 mr-1" />New File</Button>}
            />
          </Section>

          {/* 13. Field */}
          <Section id="field" title="Field" label="表单字段" count={13}>
            <div className="max-w-sm space-y-3">
              <Field label="Email Address" hint="We will never share your email.">
                <Input placeholder="m@example.com" />
              </Field>
              <Field label="Password" error="Password must be at least 8 characters.">
                <Input type="password" defaultValue="12345" />
              </Field>
            </div>
          </Section>

          {/* 14. Input */}
          <Section id="input" title="Input" label="输入框 (统一 h-8 · 32px)" count={14}>
            <div className="max-w-sm space-y-2">
              <Input placeholder="Default input (32px)" />
              <Input disabled placeholder="Disabled input" />
              <Input type="search" placeholder="Search..." />
            </div>
          </Section>

          {/* 15. Input Group */}
          <Section id="input-group" title="Input Group" label="输入框组" count={15}>
            <div className="max-w-sm space-y-2">
              <InputGroup prefix={<Search className="size-3.5" />}>
                <Input placeholder="Search documents..." className="border-0 shadow-none focus-visible:ring-0" />
              </InputGroup>
              <InputGroup suffix={<span className="text-[10px] font-mono text-muted-foreground">⌘K</span>}>
                <Input placeholder="Quick action..." className="border-0 shadow-none focus-visible:ring-0" />
              </InputGroup>
            </div>
          </Section>

          {/* 16. Item */}
          <Section id="item" title="Item" label="列表项" count={16}>
            <div className="max-w-md divide-y divide-border/50 rounded-lg border border-border/60 bg-card">
              <Item
                icon={<Smartphone className="size-4 text-primary" />}
                title="iPhone 16 Pro"
                description="Connected via Wi-Fi · 98% Battery"
                action={<Button variant="ghost" size="xs">Manage</Button>}
              />
              <Item
                icon={<Settings className="size-4 text-muted-foreground" />}
                title="System Settings"
                description="Preferences & configuration"
                action={<ChevronRight className="size-3.5 text-muted-foreground" />}
              />
            </div>
          </Section>

          {/* 17. Label */}
          <Section id="label" title="Label" label="标签" count={17}>
            <Label className="text-xs">This is a standard Accessible Label</Label>
          </Section>

          {/* 18. Menubar */}
          <Section id="menubar" title="Menubar" label="菜单栏" count={18}>
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
          <Section id="pagination" title="Pagination" label="分页" count={19}>
            <Pagination className="justify-start">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" size="sm" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive size="sm">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" size="sm">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" size="sm">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" size="sm" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Section>

          {/* 20. Popover */}
          <Section id="popover" title="Popover" label="气泡浮层" count={20}>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
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
          <Section id="radio-group" title="Radio Group" label="单选框组" count={21}>
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
          <Section id="resizable" title="Resizable" label="可调整尺寸面板" count={22}>
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
          <Section id="scroll-area" title="Scroll Area" label="定制轻量滚动条" count={23}>
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
          <Section id="select" title="Select" label="下拉选择框" count={24}>
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
          <Section id="separator" title="Separator" label="分割线" count={25}>
            <div className="space-y-2">
              <div className="text-xs">Section Header</div>
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
          <Section id="sidebar" title="Sidebar" label="侧边栏标准组件 (shadcn 1:1)" count={26}>
            <div className="border border-border/70 rounded-lg overflow-hidden h-72">
              <SidebarProvider defaultOpen={true}>
                <div className="flex h-full w-full">
                  <Sidebar collapsible="icon" className="border-r border-border/60">
                    <SidebarHeader className="p-2 border-b border-border/40">
                      <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold">
                        <Terminal className="size-4" />
                        <span>Acme Inc</span>
                      </div>
                    </SidebarHeader>
                    <SidebarContent className="p-2">
                      <SidebarGroup>
                        <SidebarGroupLabel className="text-[10px]">Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            <SidebarMenuItem>
                              <SidebarMenuButton isActive size="sm">
                                <Home className="size-3.5" />
                                <span>Dashboard</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton size="sm">
                                <Inbox className="size-3.5" />
                                <span>Inbox</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton size="sm">
                                <Calendar className="size-3.5" />
                                <span>Calendar</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter className="p-2 border-t border-border/40">
                      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
                        <span className="text-[11px]">user@apple.com</span>
                        <SidebarTrigger />
                      </div>
                    </SidebarFooter>
                  </Sidebar>
                  <div className="flex-1 p-4 bg-muted/20 flex flex-col justify-center items-center text-xs text-muted-foreground">
                    <p>Sidebar 内置 Content 区域</p>
                    <p className="text-[11px] mt-1 text-muted-foreground/70">（支持折叠、展开与响应式状态）</p>
                  </div>
                </div>
              </SidebarProvider>
            </div>
          </Section>

          {/* 27. Skeleton */}
          <Section id="skeleton" title="Skeleton" label="骨架屏" count={27}>
            <div className="flex items-center space-x-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-44" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </Section>

          {/* 28. Sonner */}
          <Section id="sonner" title="Sonner" label="Toast 消息提示" count={28}>
            <Button
              variant="outline"
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
          <Section id="spinner" title="Spinner" label="加载中微动效" count={29}>
            <div className="flex items-center gap-3">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </Section>

          {/* 30. Switch */}
          <Section id="switch" title="Switch" label="开关 (20px Apple 绿胶囊)" count={30}>
            <div className="flex items-center space-x-3">
              <Switch id="airplane-mode" defaultChecked />
              <Label htmlFor="airplane-mode" className="text-xs cursor-pointer">
                Airplane Mode
              </Label>
            </div>
          </Section>

          {/* 31. Tables */}
          <Section id="table" title="Tables" label="表格" count={31}>
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
          <Section id="tabs" title="Tabs" label="分段选项卡" count={32}>
            <Tabs defaultValue="account" className="w-80">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="text-xs text-muted-foreground p-3 border rounded-md mt-2">
                Manage your account credentials and email addresses.
              </TabsContent>
              <TabsContent value="password" className="text-xs text-muted-foreground p-3 border rounded-md mt-2">
                Change and rotate your account passwords.
              </TabsContent>
            </Tabs>
          </Section>

          {/* 33. Textarea */}
          <Section id="textarea" title="Textarea" label="多行文本框" count={33}>
            <Textarea placeholder="Type your message here..." className="max-w-md h-20 text-xs" />
          </Section>

          {/* 34. Tooltip */}
          <Section id="tooltip" title="Tooltip" label="文字提示浮层" count={34}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover over me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to library</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Section>
        </main>
      </div>

      <Toaster />
    </div>
  )
}
