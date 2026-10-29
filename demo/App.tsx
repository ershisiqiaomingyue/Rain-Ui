import * as React from "react"
import {
  Sun, Moon, Terminal, Plus, Trash2, Check, Sparkles,
  Smartphone, AlertTriangle, Search, Info, Settings,
  Folder, Layers, ChevronRight, ArrowRight, ExternalLink,
  MoreHorizontal, Play, RefreshCw, X, Shield, Sliders
} from "lucide-react"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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

function Section({ id, title, count, children }: { id: string; title: string; count: number; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 space-y-3 pb-8 border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-muted text-[11px] font-mono text-muted-foreground">
          {count}
        </span>
        <h2 className="text-base font-semibold text-foreground tracking-tight">{title}</h2>
      </div>
      <div className="rounded-lg border border-border/60 bg-card/60 p-5 shadow-2xs backdrop-blur-sm">
        {children}
      </div>
    </section>
  )
}

export function App() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light")
  const [comboboxVal, setComboboxVal] = React.useState("pixel-8")

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <TooltipProvider delayDuration={150}>
      <Toaster />
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
          <div className="flex h-12 items-center px-6 justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <span className="h-5 w-5 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                R
              </span>
              <span>rain-ui</span>
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-muted font-normal text-muted-foreground">
                33+ 原子组件一览表 (无业务嵌套)
              </span>
            </div>

            <ButtonGroup>
              <Button
                size="xs"
                variant={theme === "light" ? "secondary" : "ghost"}
                onClick={() => setTheme("light")}
              >
                <Sun className="h-3 w-3 mr-1" /> 明亮
              </Button>
              <Button
                size="xs"
                variant={theme === "dark" ? "secondary" : "ghost"}
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-3 w-3 mr-1" /> 暗色
              </Button>
            </ButtonGroup>
          </div>
        </header>

        {/* Catalog Body */}
        <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 space-y-6">

          {/* 1. Button */}
          <Section id="button" title="1. Button (精致桌面尺寸 24/28/32/36)" count={1}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
                <Button disabled>Disabled</Button>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                <span className="text-xs text-muted-foreground w-16">尺寸规格:</span>
                <Button size="xs">xs · 24px</Button>
                <Button size="sm">sm · 28px</Button>
                <Button size="default">default · 32px</Button>
                <Button size="lg">lg · 36px</Button>
                <Button size="icon"><Plus className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </Section>

          {/* 2. Button Group */}
          <Section id="button-group" title="2. Button Group (按钮组)" count={2}>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonGroup>
                <Button size="sm" variant="ghost">日</Button>
                <Button size="sm" variant="secondary">周</Button>
                <Button size="sm" variant="ghost">月</Button>
                <Button size="sm" variant="ghost">年</Button>
              </ButtonGroup>
              <ButtonGroup orientation="vertical">
                <Button size="xs" variant="ghost">顶部动作</Button>
                <Button size="xs" variant="ghost">底部动作</Button>
              </ButtonGroup>
            </div>
          </Section>

          {/* 3. Switch */}
          <Section id="switch" title="3. Switch (Apple 经典绿 20px 原生手感)" count={3}>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch id="s1" defaultChecked />
                <Label htmlFor="s1" className="text-xs">开启状态 (已选)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="s2" />
                <Label htmlFor="s2" className="text-xs">未激活</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="s3" disabled defaultChecked />
                <Label htmlFor="s3" className="text-xs text-muted-foreground">禁用</Label>
              </div>
            </div>
          </Section>

          {/* 4. Checkbox */}
          <Section id="checkbox" title="4. Checkbox (复选框)" count={4}>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="c1" defaultChecked />
                <Label htmlFor="c1" className="text-xs font-normal">记住选择</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="c2" />
                <Label htmlFor="c2" className="text-xs font-normal">未勾选</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="c3" disabled />
                <Label htmlFor="c3" className="text-xs text-muted-foreground font-normal">不可用</Label>
              </div>
            </div>
          </Section>

          {/* 5. Radio Group */}
          <Section id="radio-group" title="5. Radio Group (单选框组)" count={5}>
            <RadioGroup defaultValue="opt1" className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="opt1" id="opt1" />
                <Label htmlFor="opt1" className="text-xs font-normal">单选选项 A</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="opt2" id="opt2" />
                <Label htmlFor="opt2" className="text-xs font-normal">单选选项 B</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="opt3" id="opt3" disabled />
                <Label htmlFor="opt3" className="text-xs text-muted-foreground font-normal">禁用选项 C</Label>
              </div>
            </RadioGroup>
          </Section>

          {/* 6. Input & Input Group */}
          <Section id="input" title="6. Input & Input Group (输入框与复合组)" count={6}>
            <div className="grid gap-3 max-w-md">
              <Input placeholder="标准紧凑单行输入框 (h-8 · 32px)..." />
              <InputGroup lead={<Search className="h-3.5 w-3.5" />}>
                <Input placeholder="带前缀搜索图标的 InputGroup..." />
              </InputGroup>
              <InputGroup tail={<span className="text-[11px] text-muted-foreground">.com</span>}>
                <Input placeholder="自定义后缀域名..." />
              </InputGroup>
              <Input disabled placeholder="禁用输入状态..." />
            </div>
          </Section>

          {/* 7. Textarea */}
          <Section id="textarea" title="7. Textarea (多行文本域)" count={7}>
            <div className="max-w-md">
              <Textarea placeholder="输入多行配置描述或日志备注..." rows={3} />
            </div>
          </Section>

          {/* 8. Field & Label */}
          <Section id="field" title="8. Field & Label (表单域封装)" count={8}>
            <div className="grid gap-3 max-w-md">
              <Field label="设备标识名" description="局域网内唯一名称，不可重复" required>
                <Input placeholder="Pixel-8-Pro" />
              </Field>
              <Field label="IP 校验" error="输入的 IP 格式不合法">
                <Input defaultValue="999.999.999" className="border-destructive" />
              </Field>
            </div>
          </Section>

          {/* 9. Select */}
          <Section id="select" title="9. Select (下拉选择器)" count={9}>
            <div className="max-w-xs">
              <Select defaultValue="arm64">
                <SelectTrigger>
                  <SelectValue placeholder="选择目标架构" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arm64">arm64-v8a (64位原生)</SelectItem>
                  <SelectItem value="armeabi">armeabi-v7a (32位兼容)</SelectItem>
                  <SelectItem value="x86_64">x86_64 (模拟器镜像)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Section>

          {/* 10. Combobox */}
          <Section id="combobox" title="10. Combobox (可检索下拉输入)" count={10}>
            <div className="max-w-xs">
              <Combobox
                value={comboboxVal}
                onChange={setComboboxVal}
                options={[
                  { value: "pixel-8", label: "Google Pixel 8 Pro" },
                  { value: "s24", label: "Samsung Galaxy S24" },
                  { value: "mi-14", label: "Xiaomi 14 Ultra" },
                ]}
              />
            </div>
          </Section>

          {/* 11. Card */}
          <Section id="card" title="11. Card (卡片面板容器)" count={11}>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>标准卡片标题</CardTitle>
                  <CardDescription>副标题与说明性文字</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    这是 CardContent 区块，遵循发丝边框与精细内投影。
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="xs">取消</Button>
                  <Button size="xs">确定</Button>
                </CardFooter>
              </Card>
            </div>
          </Section>

          {/* 12. Alert */}
          <Section id="alert" title="12. Alert (提示横幅)" count={12}>
            <div className="grid gap-3 max-w-xl">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>标准提示信息</AlertTitle>
                <AlertDescription className="text-xs">已成功同步 12 条连接规则。</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>操作失败</AlertTitle>
                <AlertDescription className="text-xs">设备未授权 USB 调试协议。</AlertDescription>
              </Alert>
            </div>
          </Section>

          {/* 13. Alert Dialog */}
          <Section id="alert-dialog" title="13. Alert Dialog (破坏性二次确认框)" count={13}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">触发 AlertDialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除此环境配置？</AlertDialogTitle>
                  <AlertDialogDescription className="text-xs">
                    该操作为破坏性动作，无法被撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction>确认删除</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Section>

          {/* 14. Dialog */}
          <Section id="dialog" title="14. Dialog (标准模态弹窗)" count={14}>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">打开 Dialog 弹窗</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建设备连接</DialogTitle>
                  <DialogDescription className="text-xs">输入 ADB 连接参数。</DialogDescription>
                </DialogHeader>
                <div className="py-2 space-y-2">
                  <Input placeholder="IP 地址" />
                  <Input placeholder="端口 (默认 5555)" />
                </div>
                <DialogFooter>
                  <Button size="sm">立即连接</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Section>

          {/* 15. Popover */}
          <Section id="popover" title="15. Popover (浮层悬浮板)" count={15}>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">打开 Popover 浮层</Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 space-y-2">
                <h4 className="text-xs font-semibold">快速调整</h4>
                <p className="text-[11.5px] text-muted-foreground">Popover 浮层内容区展示</p>
                <Input placeholder="输入临时参数" />
              </PopoverContent>
            </Popover>
          </Section>

          {/* 16. Tooltip */}
          <Section id="tooltip" title="16. Tooltip (文字提示气泡)" count={16}>
            <div className="flex gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="sm">悬停查看 Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">轻量提示气泡已触发</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </Section>

          {/* 17. Context Menu */}
          <Section id="context-menu" title="17. Context Menu (右键菜单)" count={17}>
            <ContextMenu>
              <ContextMenuTrigger className="flex h-16 w-full max-w-sm items-center justify-center rounded-md border border-dashed border-border/80 text-xs text-muted-foreground bg-muted/20">
                在此卡片内点击鼠标右键触发 ContextMenu
              </ContextMenuTrigger>
              <ContextMenuContent className="w-44">
                <ContextMenuItem>查看属性</ContextMenuItem>
                <ContextMenuItem>复制 ID</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem className="text-destructive">删除条目</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </Section>

          {/* 18. Command */}
          <Section id="command" title="18. Command (命令行调色板)" count={18}>
            <div className="max-w-md rounded-lg border border-border/70 shadow-sm overflow-hidden">
              <Command>
                <CommandInput placeholder="搜索系统命令..." />
                <CommandList>
                  <CommandEmpty>未找到对应命令</CommandEmpty>
                  <CommandGroup heading="建议">
                    <CommandItem><Terminal className="mr-2 h-3.5 w-3.5" /> 启动 Shell 终端</CommandItem>
                    <CommandItem><RefreshCw className="mr-2 h-3.5 w-3.5" /> 重新扫描设备</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </Section>

          {/* 19. Item */}
          <Section id="item" title="19. Item (列表项通用组件)" count={19}>
            <div className="max-w-md border border-border/60 rounded-md divide-y divide-border/40">
              <Item
                icon={<Smartphone className="h-4 w-4" />}
                title="Pixel 8 Pro"
                subtitle="Android 14 · USB"
                action={<Button size="xs" variant="ghost">进入</Button>}
              />
              <Item
                icon={<Smartphone className="h-4 w-4" />}
                title="Xiaomi 14 Ultra"
                subtitle="HyperOS · Wi-Fi"
                action={<Button size="xs" variant="ghost">进入</Button>}
              />
            </div>
          </Section>

          {/* 20. Empty */}
          <Section id="empty" title="20. Empty (空状态占位)" count={20}>
            <Empty
              icon={<Smartphone className="h-5 w-5 text-primary" />}
              title="当前无在线设备"
              description="请使用 USB 数据线将 Android 手机连接至电脑。"
              action={<Button size="xs"><Plus className="h-3 w-3 mr-1" /> 重新扫描</Button>}
            />
          </Section>

          {/* 21. Table */}
          <Section id="table" title="21. Table (表格)" count={21}>
            <div className="border border-border/60 rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>进程名</TableHead>
                    <TableHead>PID</TableHead>
                    <TableHead>内存</TableHead>
                    <TableHead className="text-right">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs">com.android.systemui</TableCell>
                    <TableCell className="text-xs">1042</TableCell>
                    <TableCell className="text-xs">142 MB</TableCell>
                    <TableCell className="text-right text-xs text-emerald-500">正常</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">com.google.android.gms</TableCell>
                    <TableCell className="text-xs">2180</TableCell>
                    <TableCell className="text-xs">88 MB</TableCell>
                    <TableCell className="text-right text-xs text-emerald-500">正常</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* 22. Pagination */}
          <Section id="pagination" title="22. Pagination (分页器)" count={22}>
            <div className="flex justify-start">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" className="h-7 text-xs" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive className="h-7 w-7 text-xs">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" className="h-7 w-7 text-xs">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" className="h-7 text-xs" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </Section>

          {/* 23. Tabs */}
          <Section id="tabs" title="23. Tabs (标签页)" count={23}>
            <Tabs defaultValue="t1" className="w-full max-w-sm">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="t1" className="text-xs">账户设置</TabsTrigger>
                <TabsTrigger value="t2" className="text-xs">安全偏好</TabsTrigger>
              </TabsList>
              <TabsContent value="t1" className="p-2 text-xs text-muted-foreground">
                账户设置标签页内容区。
              </TabsContent>
              <TabsContent value="t2" className="p-2 text-xs text-muted-foreground">
                安全偏好标签页内容区。
              </TabsContent>
            </Tabs>
          </Section>

          {/* 24. Separator */}
          <Section id="separator" title="24. Separator (分割线)" count={24}>
            <div className="space-y-2 max-w-sm">
              <div className="text-xs">上方段落内容</div>
              <Separator />
              <div className="text-xs">下方段落内容</div>
            </div>
          </Section>

          {/* 25. Skeleton */}
          <Section id="skeleton" title="25. Skeleton (骨架屏)" count={25}>
            <div className="flex items-center space-x-4 max-w-sm">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          </Section>

          {/* 26. Spinner */}
          <Section id="spinner" title="26. Spinner (加载指示器)" count={26}>
            <div className="flex items-center gap-4">
              <Spinner size="sm" />
              <Spinner size="default" />
              <Spinner size="lg" />
            </div>
          </Section>

          {/* 27. Sonner */}
          <Section id="sonner" title="27. Sonner (Toast 气泡通知)" count={27}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("ADB 命令执行完成", { description: "已成功重启守护进程。" })}
            >
              弹出 Sonner Toast
            </Button>
          </Section>

          {/* 28. Menubar */}
          <Section id="menubar" title="28. Menubar (原生菜单栏)" count={28}>
            <Menubar className="w-fit">
              <MenubarMenu>
                <MenubarTrigger className="text-xs">文件</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>新建连接</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>退出</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className="text-xs">编辑</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>撤销</MenubarItem>
                  <MenubarItem>重做</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </Section>

          {/* 29. Resizable */}
          <Section id="resizable" title="29. Resizable (可拖拽调节分栏)" count={29}>
            <div className="h-28 rounded-md border border-border/70 overflow-hidden">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={40}>
                  <div className="flex h-full items-center justify-center p-3 text-xs text-muted-foreground">
                    左侧面板 (40%)
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={60}>
                  <div className="flex h-full items-center justify-center p-3 text-xs text-muted-foreground">
                    右侧面板 (拖拽手柄调节)
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </Section>

          {/* 30. Scroll Area */}
          <Section id="scroll-area" title="30. Scroll Area (精致滚动区)" count={30}>
            <ScrollArea className="h-24 max-w-sm rounded-md border border-border/70 p-3">
              <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
                {Array.from({ length: 8 }).map((_, i) => (
                  <p key={i}>[10:45:0{i}] ActivityManager: service updated #{i}</p>
                ))}
              </div>
            </ScrollArea>
          </Section>

          {/* 31. Sheet */}
          <Section id="sheet" title="31. Sheet (抽屉侧滑栏)" count={31}>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">打开 Sheet 抽屉</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>侧滑配置抽屉</SheetTitle>
                  <SheetDescription className="text-xs">
                    这是从边缘滑出的 Sheet 面板组件。
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-2">
                  <Input placeholder="抽屉内的输入测试..." />
                </div>
              </SheetContent>
            </Sheet>
          </Section>

        </main>
      </div>
    </TooltipProvider>
  )
}
