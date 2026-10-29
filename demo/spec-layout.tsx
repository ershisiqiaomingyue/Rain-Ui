/* ══════════════════════════════════════════════════════════════════════════
   布局：Card / Divider / Table / PropertyGrid / ListItem / SessionTabs / ResizablePane
   ══════════════════════════════════════════════════════════════════════════ */

import { useRef, useState } from "react";
import {
  Activity,
  ChevronRight,
  Cpu,
  FileText,
  FolderOpen,
  HardDrive,
  MoreHorizontal,
  Package,
  RefreshCw,
  Search,
  Smartphone,
  Trash2,
  Wifi,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  ListItem,
  PaneResizeHandle,
  PropertyGrid,
  SessionTabs,
  Table,
  Tooltip,
  usePaneWidth,
} from "rain-ui";
import { Cell, Group, Note, Row, Stack } from "./kit";

/* ── Card ───────────────────────────────────────────────────────────────── */

export function SpecCard() {
  return (
    <Stack gap={20}>
      <Group title="默认结构" hint="CardHeader / CardBody / CardFooter 三段；dividers 打开后每段之间一条很虚的分割线。">
        <div className="kit-card-grid">
          <Card>
            <CardHeader>
              <strong className="kit-card-title">默认卡片</strong>
            </CardHeader>
            <CardBody>
              <p className="kit-note">页面区块用。静止时不浮起，靠 10px 圆角和一层柔影分层。</p>
            </CardBody>
          </Card>

          <Card dividers>
            <CardHeader>
              <strong className="kit-card-title">divides</strong>
              <Button variant="bare" size="xs" icon={<MoreHorizontal size={14} />} aria-label="更多" />
            </CardHeader>
            <CardBody>
              <p className="kit-note">带分割线的三段结构：头部常放标题 + 一个图标动作。</p>
            </CardBody>
            <CardFooter>
              <Button variant="subtle" size="sm">
                取消
              </Button>
              <Button variant="primary" size="sm">
                保存
              </Button>
            </CardFooter>
          </Card>

          <Card tone="muted" variant="interactive">
            <CardHeader>
              <strong className="kit-card-title">muted · interactive</strong>
            </CardHeader>
            <CardBody>
              <p className="kit-note">可点击的卡片：悬停时叠一层中性底、描边提亮，指针变手型。</p>
            </CardBody>
          </Card>
        </div>
      </Group>

      <Group title="4 个 tone" hint="surface 最亮，往 muted / subtle / deep 逐级下沉，用来表达「这个块在背景里退多远」。">
        <div className="kit-grid-4">
          {(["surface", "muted", "subtle", "deep"] as const).map((tone) => (
            <Card key={tone} tone={tone}>
              <CardBody>
                <strong className="kit-card-title">tone=&quot;{tone}&quot;</strong>
                <p className="kit-note">{tone === "surface" ? "页面主面板" : tone === "deep" ? "最内层 / 代码底" : "嵌套块"}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Group>

      <Group title="variant=&quot;tool&quot;" hint="工具页面用的稍高密版本：内边距更紧，头部 12px 上下。">
        <div className="kit-grid-2">
          <Card variant="tool" dividers>
            <CardHeader>
              <strong className="kit-card-title">设备信息</strong>
              <Badge variant="success">已连接</Badge>
            </CardHeader>
            <CardBody>
              <PropertyGrid
                items={[
                  { label: "序列号", value: "R58M40ABCDE" },
                  { label: "型号", value: "Pixel 8 Pro" },
                  { label: "系统版本", value: "Android 15" },
                  { label: "ADB 端口", value: "5037" },
                ]}
              />
            </CardBody>
            <CardFooter>
              <span className="kit-note">USB 连接 · 无线调试未开启</span>
            </CardFooter>
          </Card>
          <Card variant="tool" dividers>
            <CardHeader>
              <strong className="kit-card-title">构建输出</strong>
              <Button variant="subtle" size="xs">停止</Button>
            </CardHeader>
            <CardBody>
              <PropertyGrid
                items={[
                  { label: "任务", value: "assembleDebug" },
                  { label: "耗时", value: "1m 42s", valueType: "green" },
                  { label: "产物", value: "app-debug.apk" },
                  { label: "体积", value: "18.4 MB" },
                ]}
                columns={1}
              />
            </CardBody>
            <CardFooter>
              <span className="kit-note">variant=&quot;tool&quot; 只调密度，不改颜色。</span>
            </CardFooter>
          </Card>
        </div>
      </Group>

      <Group title="嵌套" hint="卡片里再放卡片会自动降级成内嵌底色（无第二层浮影、圆角收到 10px）。">
        <Card>
          <CardHeader>
            <strong className="kit-card-title">外层卡片</strong>
          </CardHeader>
          <CardBody>
            <Stack gap={10}>
              <Card>
                <CardBody>
                  <p className="kit-note">内层卡片：background 走 --surface-inset-bg，box-shadow: none。</p>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <p className="kit-note">第二块内层，证明降级是自动的。</p>
                </CardBody>
              </Card>
            </Stack>
          </CardBody>
        </Card>
      </Group>
    </Stack>
  );
}

/* ── Divider ────────────────────────────────────────────────────────────── */

export function SpecDivider() {
  return (
    <Stack gap={20}>
      <Group title="水平" hint="1px，颜色 1.1–1.3:1 对比；dense 只压上下外边距。">
        <Stack gap={6}>
          <span className="kit-note">默认（上下 12px）</span>
          <Divider />
          <span className="kit-note">dense（上下 6px）</span>
          <Divider dense />
          <span className="kit-note">dashed</span>
          <Divider dashed />
        </Stack>
      </Group>
      <Group title="垂直" hint="用在并排的两块之间，高度撑满父容器。">
        <div className="kit-hrow">
          <span className="kit-note">左栏</span>
          <Divider orientation="vertical" />
          <span className="kit-note">中栏</span>
          <Divider orientation="vertical" />
          <span className="kit-note">右栏</span>
        </div>
      </Group>
    </Stack>
  );
}

/* ── Table ──────────────────────────────────────────────────────────────── */

const PROCESSES = [
  ["com.android.systemui", "1842", "12.4%", "182 MB", "前台"],
  ["com.tencent.mm", "9012", "8.1%", "1.2 GB", "后台"],
  ["surfaceflinger", "512", "4.6%", "64 MB", "系统"],
  ["com.android.launcher3", "2210", "2.2%", "148 MB", "前台"],
  ["logd", "318", "0.8%", "12 MB", "系统"],
];

export function SpecTable() {
  return (
    <Stack gap={20}>
      <Group title="基础表格" hint="表头 12px（--text-label）常体、行 13px（--text-body）；悬停整行换底，外框三面都可见。">
        <Table>
          <thead>
            <tr>
              <th>进程</th>
              <th className="table-cell-num">PID</th>
              <th className="table-cell-num">CPU</th>
              <th className="table-cell-num">内存</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {PROCESSES.map(([name, pid, cpu, mem, state]) => (
              <tr key={pid}>
                <td>
                  <code className="table-cell-mono">{name}</code>
                </td>
                <td className="table-cell-mono table-cell-num">{pid}</td>
                <td className="table-cell-mono table-cell-num">{cpu}</td>
                <td className="table-cell-mono table-cell-num">{mem}</td>
                <td>
                  {state === "前台" ? (
                    <Badge variant="success">前台</Badge>
                  ) : (
                    <span className="table-cell-state">{state}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Group>

      <Group title="带工具条的表格" hint="真实工具页的排法：左上标题 + 右侧一排图标按钮，表格吃掉剩余高度。">
        <Card variant="tool">
          <CardHeader>
            <strong className="kit-card-title">CPU TOP 5</strong>
            <div className="kit-toolbar is-tight">
              <Tooltip content="刷新">
                <Button variant="subtle" size="sm" icon={<RefreshCw size={14} />} aria-label="刷新" />
              </Tooltip>
              <Tooltip content="导出 CSV">
                <Button variant="subtle" size="sm" icon={<FileText size={14} />} aria-label="导出" />
              </Tooltip>
              <Tooltip content="更多">
                <Button variant="subtle" size="sm" icon={<MoreHorizontal size={14} />} aria-label="更多" />
              </Tooltip>
            </div>
          </CardHeader>
          <Table>
            <thead>
              <tr>
                <th>进程</th>
                <th className="table-cell-num">PID</th>
                <th className="table-cell-num">CPU</th>
                <th className="table-cell-num">内存</th>
              </tr>
            </thead>
            <tbody>
              {PROCESSES.slice(0, 3).map(([name, pid, cpu, mem]) => (
                <tr key={pid}>
                  <td>
                    <code className="table-cell-mono">{name}</code>
                  </td>
                  <td className="table-cell-mono table-cell-num">{pid}</td>
                  <td className="table-cell-mono table-cell-num">{cpu}</td>
                  <td className="table-cell-mono table-cell-num">{mem}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Group>
    </Stack>
  );
}

/* ── PropertyGrid ───────────────────────────────────────────────────────── */

export function SpecPropertyGrid() {
  return (
    <Stack gap={20}>
      <Group title="键值对" hint="两列网格；valueType 只给状态上色（green 正常 / orange 注意 / danger 异常 / unknown 缺失）。">
        <div className="kit-grid-2">
          <PropertyGrid
            items={[
              { label: "序列号", value: "R58M40ABCDE" },
              { label: "型号", value: "Pixel 8 Pro" },
              { label: "Android", value: "15 (API 35)", valueType: "green" },
              { label: "ABI", value: "arm64-v8a", valueType: "accent" },
              { label: "电量", value: "18%", valueType: "orange" },
              { label: "温度", value: "—", valueType: "unknown" },
            ]}
          />
          <PropertyGrid
            items={[
              { icon: <Smartphone size={14} />, label: "设备", value: "Pixel 8 Pro" },
              { icon: <Wifi size={14} />, label: "连接", value: "USB · 480 Mbps", valueType: "green" },
              { icon: <Cpu size={14} />, label: "ABI", value: "arm64-v8a" },
              { icon: <HardDrive size={14} />, label: "存储", value: "11 TB / 15 TB" },
              { icon: <Activity size={14} />, label: "负载", value: "0.2 / 0.2 / 0.1" },
              { icon: <Package size={14} />, label: "包数", value: "126", valueType: "accent" },
            ]}
          />
        </div>
      </Group>
      <Group title="缺值" hint="没有数据时给 valueType=&quot;unknown&quot; 并显示「—」，不要留空。">
        <PropertyGrid
          items={[
            { label: "IP 地址", value: "—", valueType: "unknown" },
            { label: "MAC", value: "—", valueType: "unknown" },
            { label: "上次采集", value: "从未", valueType: "unknown" },
          ]}
        />
      </Group>
    </Stack>
  );
}

/* ── ListItem ───────────────────────────────────────────────────────────── */

export function SpecListItem() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Stack gap={20}>
      <Group title="五种载荷" hint="leading / title / meta / description / actions 五个插槽，按需取用。">
        <Card>
          <ListItem title="com.android.systemui" meta="PID 1842 · 12.4% CPU" divider />
          <ListItem
            leading={<Smartphone size={16} />}
            title="Pixel 8 Pro"
            meta="R58M40ABCDE"
            description="Android 15 · arm64-v8a · 已连接 4 小时"
            actions={
              <Button variant="subtle" size="sm" icon={<MoreHorizontal size={14} />} aria-label="更多" />
            }
            divider
          />
          <ListItem
            leading={<FolderOpen size={16} />}
            title="app/src/main/java/com/demo"
            meta="12 个文件"
            actions={
              <Button variant="bare" size="xs" icon={<ChevronRight size={14} />} aria-label="进入" />
            }
            interactive
            divider
          />
          <ListItem
            leading={<FileText size={16} />}
            title="MainActivity.kt"
            meta="12.4 KB"
            description="修改于 2 小时前"
            actions={
              <Button variant="bare" size="xs" icon={<Trash2 size={14} />} aria-label="删除" className="btn-danger-hover" />
            }
          />
        </Card>
      </Group>
      <Group title="可展开 / 紧凑" hint="expandable 时行尾出现直角箭头；compact 压到 32px 行高。">
        <Card>
          <ListItem
            title="构建日志"
            meta="最后 42 行"
            expandable
            expanded={expanded}
            onExpandedChange={setExpanded}
            description="点击展开查看末尾输出"
            divider
          />
          {expanded ? (
            <div className="kit-indent">
              <pre className="kit-code">{"> Task :app:compileDebugKotlin\n> Task :app:assembleDebug\nBUILD SUCCESSFUL in 12s"}</pre>
            </div>
          ) : null}
          <ListItem compact leading={<Activity size={14} />} title="紧凑行" meta="28px" divider />
          <ListItem compact leading={<Activity size={14} />} title="紧凑行（无分割线）" meta="28px" />
        </Card>
      </Group>
    </Stack>
  );
}

/* ── SessionTabs ────────────────────────────────────────────────────────── */

export function SpecSessionTabs() {
  const [tabs, setTabs] = useState([
    { id: "a", label: "对话 · CarAdapter" },
    { id: "b", label: "终端 · 本地" },
    { id: "c", label: "Logcat" },
    { id: "d", label: "AOSP 构建" },
  ]);
  const [active, setActive] = useState("a");
  return (
    <Stack gap={20}>
      <Group title="会话标签" hint="选中态和关闭键是两个独立可聚焦元素；关闭键只在悬停/选中时出现。">
        <SessionTabs
          label="打开的会话"
          tabs={tabs}
          activeId={active}
          onSelect={setActive}
          onClose={(id) => setTabs((prev) => prev.filter((tab) => tab.id !== id))}
        />
      </Group>
      <Group title="溢出" hint="超出容器时横向滚动，滚动条隐藏，不换行。">
        <div style={{ width: 380 }}>
          <SessionTabs
            label="窄容器"
            tabs={tabs}
            activeId={active}
            onSelect={setActive}
            onClose={(id) => setTabs((prev) => prev.filter((tab) => tab.id !== id))}
          />
        </div>
      </Group>
    </Stack>
  );
}

/* ── ResizablePane ──────────────────────────────────────────────────────── */

export function SpecResizable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pane = usePaneWidth(containerRef, true, "rain-ui.demo.pane", {
    initial: 260,
    min: 180,
    max: 420,
    contentMin: 240,
  });
  return (
    <Stack gap={20}>
      <Group
        title="拖拽分栏"
        hint="usePaneWidth 管宽度、min/max 夹取与 localStorage 持久化；PaneResizeHandle 是 6px 命中区，支持拖拽、方向键 ±10px、Home/End 到极限、双击复位。"
      >
        <div className="kit-panes" ref={containerRef} style={{ height: 180 }}>
          <div className="kit-pane" style={{ width: pane.width }}>
            <span className="kit-note">左栏 · {Math.round(pane.width)}px</span>
          </div>
          <PaneResizeHandle
            label="调整左栏宽度"
            controls="kit-pane-main"
            width={pane.width}
            min={pane.bounds.min}
            max={pane.bounds.max}
            initial={260}
            side="left"
            className="kit-pane-handle"
            onResize={pane.resize}
            onCommit={pane.commit}
          />
          <div className="kit-pane is-grow" id="kit-pane-main">
            <span className="kit-note">主区 · flex:1 —— 拖中间的把手，或让它获得焦点后按 ← →</span>
          </div>
        </div>
      </Group>
    </Stack>
  );
}

/* ── 组合示例 ───────────────────────────────────────────────────────────── */

const CHANGE_FILES = [
  { path: "app/src/main/java/com/demo/MainActivity.kt", added: 12, removed: 4 },
  { path: "app/build.gradle.kts", added: 2, removed: 0 },
];

export function SpecComposed() {
  const [query, setQuery] = useState("");
  return (
    <Stack gap={20}>
      <Group title="工具页骨架" hint="真实界面的组合方式：工具条（标题 + 搜索 + 一排图标动作）→ 内容区。">
        <Card>
          <CardHeader>
            <div className="kit-head-inline">
              <strong className="kit-card-title">文件浏览</strong>
              <Badge variant="neutral">只读</Badge>
            </div>
            <div className="kit-toolbar is-tight">
              <Input
                size="sm"
                variant="surface"
                placeholder="筛选文件"
                prefixIcon={<Search size={13} />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button variant="subtle" size="sm" icon={<RefreshCw size={14} />} aria-label="刷新" />
              <Button variant="subtle" size="sm" icon={<MoreHorizontal size={14} />} aria-label="更多" />
            </div>
          </CardHeader>
          <CardBody>
            <ListItem
              leading={<FolderOpen size={16} />}
              title="app"
              meta="2 个改动"
              actions={<Button variant="bare" size="xs" icon={<ChevronRight size={14} />} aria-label="进入" />}
              interactive
              divider
            />
            {CHANGE_FILES.map((file) => (
              <ListItem
                key={file.path}
                leading={<FileText size={16} />}
                title={file.path.split("/").pop()}
                meta={`+${file.added} −${file.removed}`}
                description={file.path}
                divider
              />
            ))}
          </CardBody>
          <CardFooter>
            <Note>底部动作区：只在真的需要提交时放 primary。</Note>
            <Button variant="primary" size="sm">
              应用改动
            </Button>
          </CardFooter>
        </Card>
      </Group>
    </Stack>
  );
}
