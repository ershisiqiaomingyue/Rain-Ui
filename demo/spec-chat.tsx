/* ══════════════════════════════════════════════════════════════════════════
   对话：UsageMetrics / CompactionProgress / TaskStepList / Attachment /
        NoticePanel / FileChangeCard / FileChangeNotice / FileDiffView /
        FilePreviewPanel / AccessModeMenu
   ══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import {
  Bot,
  Clock,
  FileText,
  FolderOpen,
  GitBranch,
  Image as ImageIcon,
  ShieldAlert,
  Sparkles,
  Terminal,
  Wrench,
} from "lucide-react";
import {
  AccessModeMenu,
  Attachment,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CompactionProgress,
  FileChangeCard,
  FileChangeNotice,
  FileDiffView,
  FilePreviewPanel,
  NoticePanel,
  TaskStepList,
  UsageMetrics,
  type FileChangeEntry,
  type FileDiffRow,
  type TaskStepStatus,
} from "rain-ui";
import { Cell, Group, Note, Row, Stack } from "./kit";

/* ── UsageMetrics ───────────────────────────────────────────────────────── */

export function SpecUsageMetrics() {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <Stack gap={20}>
      <Group
        title="完整一行"
        hint="样式来自对话输入框底部的用量条：12px 字号（--text-label），label + 加粗数值，各项之间一条 1px 竖分割线（--divider），最后一项不带分割线。"
      >
        <Card>
          <CardBody>
            <UsageMetrics
              metrics={[
                { id: "in", label: "会话输入", value: "36.3M" },
                { id: "out", label: "会话输出", value: "319.1K" },
                { id: "speed", label: "输出速度", value: "112 token/s" },
                { id: "cache", label: "缓存命中", value: "98.3%" },
              ]}
              balance={{ label: "余额", value: null, detail: "未配置计费账户", refreshing }}
              onRefreshBalance={() => {
                setRefreshing(true);
                window.setTimeout(() => setRefreshing(false), 1200);
              }}
              cost={{ label: "本轮消费", value: "0.231715" }}
            />
          </CardBody>
        </Card>
      </Group>

      <Group title="缺值 / 部分指标" hint="value 为 null 时渲染「—」，而不是隐藏该项；detail 走 title 属性做解释。">
        <Card>
          <CardBody>
            <UsageMetrics
              metrics={[
                { id: "in", label: "会话输入", value: null, detail: "上一轮尚未结束" },
                { id: "speed", label: "输出速度", value: null },
                { id: "cache", label: "缓存命中", value: "—" },
              ]}
              cost={{ label: "本轮消费", value: "0.000412" }}
            />
          </CardBody>
        </Card>
      </Group>

      <Group title="只有两项" hint="指标少的时候整行左对齐，不要拉伸到两端。">
        <Card>
          <CardBody>
            <UsageMetrics
              metrics={[
                { id: "speed", label: "输出速度", value: "86 token/s" },
                { id: "cache", label: "缓存命中", value: "94.1%" },
              ]}
            />
          </CardBody>
        </Card>
      </Group>
    </Stack>
  );
}

/* ── CompactionProgress ─────────────────────────────────────────────────── */

export function SpecCompaction() {
  return (
    <Stack gap={20}>
      <Group title="4 个状态（strip）" hint="运行→完成是同一条条子，只换图标与百分比，位置不跳。">
        <Stack gap={10}>
          <CompactionProgress status="running" progress={42} detail="已处理 4 / 9 条消息" />
          <CompactionProgress status="running" progress={null} detail="尚未上报百分比：轨道走扫描动画" />
          <CompactionProgress status="completed" detail="12,400 → 3,200 Token" />
          <CompactionProgress status="interrupted" detail="用户中止，已保留已压缩部分" />
          <CompactionProgress status="failed" detail="模型返回 429，稍后重试" />
        </Stack>
      </Group>
      <Group title="variant=&quot;row&quot;" hint="作为时间线里的一行时去掉外框和进度轨，只留图标 + 标签 + 明细 + 百分比。">
        <Card>
          <CardBody>
            <Stack gap={2}>
              <CompactionProgress variant="row" status="completed" detail="12,400 → 3,200 Token" />
              <CompactionProgress variant="row" status="running" progress={68} detail="已处理 6 / 9 条消息" />
            </Stack>
          </CardBody>
        </Card>
      </Group>
    </Stack>
  );
}

/* ── TaskStepList ───────────────────────────────────────────────────────── */

const STEPS: { content: string; status: TaskStepStatus; chip?: string }[] = [
  { content: "读取 AndroidManifest.xml", status: "done" },
  { content: "定位启动 Activity", status: "done", chip: "MainActivity" },
  { content: "编译 debug 变体", status: "running" },
  { content: "安装到 Pixel 8 Pro", status: "pending", chip: "R58M40ABCDE" },
  { content: "启动并抓取首帧", status: "error" },
  { content: "导出 Trace", status: "cancelled" },
];

export function SpecTaskSteps() {
  return (
    <Stack gap={20}>
      <Group title="5 种状态" hint="20px 圆：done 实心带勾、running 旋转虚弧、pending 空心环、error/cancelled 叉。">
        <div className="kit-grid-2">
          <Card>
            <CardBody>
              <TaskStepList steps={STEPS} />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <TaskStepList steps={STEPS.slice(0, 4)} compact />
            </CardBody>
          </Card>
        </div>
      </Group>
      <Group title="带 chip" hint="chip 跟在步骤文字后面，用来标注目标应用、设备、分支等对象。">
        <Card>
          <CardBody>
            <TaskStepList
              steps={[
                { content: "切到分支", status: "done", chip: "feature/logcat-v2" },
                { content: "执行单测", status: "done", chip: "128 passed" },
                { content: "等待设备空闲", status: "running" },
              ]}
            />
          </CardBody>
        </Card>
      </Group>
    </Stack>
  );
}

/* ── Attachment ─────────────────────────────────────────────────────────── */

export function SpecAttachment() {
  return (
    <Stack gap={20}>
      <Group title="row 形态（文件 / 目录）" hint="图标按扩展名分类；右侧 × 只在悬停出现。">
        <Stack gap={8}>
          <div style={{ width: 420 }}>
            <Attachment name="MainActivity.kt" kind="code" detail="12.4 KB" onRemove={() => {}} />
          </div>
          <div style={{ width: 420 }}>
            <Attachment name="app/src/main" kind="directory" onRemove={() => {}} />
          </div>
          <div style={{ width: 420 }}>
            <Attachment name="build-report.json" kind="json" detail="318 KB" onRemove={() => {}} />
          </div>
          <div style={{ width: 420 }}>
            <Attachment name="release.apk" kind="archive" detail="24.1 MB" onRemove={() => {}} />
          </div>
        </Stack>
      </Group>
      <Group title="状态" hint="preparing / error 都占用同一行列；错误提供「重试」而不是只变色。">
        <Stack gap={8}>
          <div style={{ width: 420 }}>
            <Attachment name="trace.perfetto" kind="text" preparing />
          </div>
          <div style={{ width: 420 }}>
            <Attachment name="huge-dump.hprof" kind="archive" error="文件超过 512 MB 上限" onRetry={() => {}} onRemove={() => {}} />
          </div>
          <div style={{ width: 420 }}>
            <Attachment name="无操作（只展示）" kind="text" detail="3.1 KB" />
          </div>
        </Stack>
      </Group>
      <Group title="tile 形态（图片）" hint="正方形缩略图，尺寸由 size 控制；没有 src 时回落到图片图标。">
        <Row>
          <Cell label="56">
            <Attachment key="a" name="screenshot.png" kind="image" shape="tile" onRemove={() => {}} />
          </Cell>
          <Cell label="56 · 无预览">
            <Attachment name="unknown.png" kind="image" shape="tile" onRemove={() => {}} />
          </Cell>
          <Cell label="40">
            <Attachment name="icon.png" kind="image" shape="tile" size={40} onRemove={() => {}} />
          </Cell>
          <Cell label="72">
            <Attachment name="big.png" kind="image" shape="tile" size={72} />
          </Cell>
        </Row>
      </Group>
    </Stack>
  );
}

/* ── NoticePanel ────────────────────────────────────────────────────────── */

export function SpecNoticePanel() {
  return (
    <Stack gap={20}>
      <Group title="5 个 tone" hint="neutral / attention / warning / danger / success，颜色只表达「要不要管」。">
        <Stack gap={10}>
          <NoticePanel label="权限请求" summary="即将执行 adb shell pm clear com.demo" tone="neutral" icon={<ShieldAlert size={15} />}>
            <Note>点击整行展开；再点一次或按 Esc 收起。</Note>
          </NoticePanel>
          <NoticePanel label="任务编排" summary="3 个步骤，预计 40 秒" tone="attention" icon={<Sparkles size={15} />} meta={<Badge variant="neutral">40s</Badge>}>
            <Note>attention 用于需要留意但不阻塞的事。</Note>
          </NoticePanel>
          <NoticePanel label="后台任务" summary="Perfetto 正在采集，剩余 12s" tone="warning" icon={<Clock size={15} />}>
            <Note>warning 给「自动流程被打断」。</Note>
          </NoticePanel>
          <NoticePanel label="错误" summary="设备已断开，命令未执行" tone="danger" icon={<Terminal size={15} />}>
            <Note>danger 只给真实失败，不要用来强调。</Note>
          </NoticePanel>
          <NoticePanel label="完成" summary="已写入 3 个文件" tone="success" icon={<Wrench size={15} />}>
            <Note>success 是结果，不是装饰。</Note>
          </NoticePanel>
        </Stack>
      </Group>

      <Group title="带计数 / 带动作" hint="count 右对齐；actions 留在头部右侧，和展开按钮分开，避免误触。">
        <NoticePanel
          label="文件改动"
          summary="本轮改动"
          count={3}
          countSuffix="个文件"
          icon={<FolderOpen size={15} />}
          actions={
            <>
              <Button variant="subtle" size="xs">
                撤销
              </Button>
              <Button variant="secondary" size="xs">
                查看
              </Button>
            </>
          }
        >
          <Note>头部右侧的动作与展开箭头分离。</Note>
        </NoticePanel>
      </Group>

      <Group title="compact / inline / 默认展开" hint="compact 用于对话里贴着输入框的一条；inline 无折叠头，内容常显。">
        <Stack gap={10}>
          <NoticePanel compact label="文件改动" summary="+14 −4" icon={<FolderOpen size={15} />} defaultExpanded>
            <Note>compact：28px 高，贴着输入框上方。</Note>
          </NoticePanel>
          <NoticePanel inline label="" summary="追加消息：这条不会折叠" tone="neutral" icon={<Bot size={15} />}>
            <Note>inline：抬头与其它通知一致，但没有折叠箭头。</Note>
          </NoticePanel>
          <NoticePanel inline collapsible label="追加消息" summary="2 条排队中" icon={<Clock size={15} />}>
            <Note>inline + collapsible：多条时才允许收起。</Note>
          </NoticePanel>
        </Stack>
      </Group>
    </Stack>
  );
}

/* ── FileChangeCard / Notice / Diff / Preview ───────────────────────────── */

const FILES: FileChangeEntry[] = [
  { path: "app/src/main/java/com/demo/MainActivity.kt", status: "modified", addedLines: 12, removedLines: 4 },
  { path: "app/src/main/java/com/demo/ui/LogcatPanel.kt", status: "created", addedLines: 86, removedLines: 0 },
  { path: "app/build.gradle.kts", status: "modified", addedLines: 2, removedLines: 1 },
  { path: "app/src/main/java/com/demo/legacy/OldAdapter.kt", status: "deleted", addedLines: 0, removedLines: 42 },
  { path: "docs/logcat.md", status: "modified", addedLines: 6, removedLines: 2 },
];

const DIFF: FileDiffRow[] = [
  { kind: "meta", text: "@@ -14,7 +14,9 @@ class MainActivity : AppCompatActivity() {" },
  { kind: "context", text: "    override fun onCreate(savedInstanceState: Bundle?) {", oldLine: 14, newLine: 14 },
  { kind: "context", text: "        super.onCreate(savedInstanceState)", oldLine: 15, newLine: 15 },
  { kind: "removed", text: "        setContentView(R.layout.activity_main)", oldLine: 16 },
  { kind: "added", text: "        setContentView(binding.root)", newLine: 16 },
  { kind: "added", text: "        LogcatPanel.attach(binding.logcatHost)", newLine: 17 },
  { kind: "context", text: "    }", oldLine: 17, newLine: 18 },
];

export function SpecFileChanges() {
  const [noticeOpen, setNoticeOpen] = useState(true);
  const [mode, setMode] = useState<"source" | "diff">("diff");
  return (
    <Stack gap={20}>
      <Group title="FileChangeCard（回合结束后）" hint="默认只展开 3 行，「再显示 N 个文件」展开全部；删除的文件名带删除线。">
        <FileChangeCard
          files={FILES}
          workspacePath="D:\\workspace\\demo"
          onReview={() => {}}
          onOpenFile={() => {}}
        />
      </Group>

      <Group title="FileChangeNotice（输入框上方，进行中）" hint="折叠态是一条胶囊；展开时向上铺开（停靠在输入框正上方），胶囊行停在原处不动，底色不透明。">
        <div style={{ width: 760, maxWidth: "100%", marginInline: "auto" }}>
          <FileChangeNotice files={FILES} expanded={noticeOpen} onExpandedChange={setNoticeOpen} onOpenFile={() => {}} />
        </div>
      </Group>

      <Group title="FileDiffView（统一 diff 正文）" hint="两列行号 + 标记列 + 代码；truncated 时底部追加一行提示。">
        <Card>
          <CardBody>
            <FileDiffView rows={DIFF} truncated />
          </CardBody>
        </Card>
      </Group>

      <Group title="FilePreviewPanel" hint="头部工具按钮（搜索 / 复制 / 重试 / 关闭）+ 源码·差异切换 + 底部完整路径；正文是插槽。">
        <div style={{ height: 320 }}>
          <FilePreviewPanel
            path="D:\\workspace\\demo\\app\\src\\main\\java\\com\\demo\\MainActivity.kt"
            mode={mode}
            onModeChange={setMode}
            showModes
            added={14}
            removed={4}
            searchable
            matches={2}
            matchIndex={0}
            onClose={() => {}}
            onCopy={() => {}}
          >
            <FileDiffView rows={DIFF} />
          </FilePreviewPanel>
        </div>
      </Group>

      <Group title="docked 形态" hint="贴着面板边时去掉圆角、边框与阴影，由父容器负责外轮廓。">
        <div className="kit-docked">
          <FilePreviewPanel path="app/build.gradle.kts" docked onClose={() => {}} titleNote="只读">
            <pre className="kit-code">{`android {\n    compileSdk = 35\n    defaultConfig {\n        minSdk = 26\n    }\n}`}</pre>
          </FilePreviewPanel>
        </div>
      </Group>
    </Stack>
  );
}

/* ── AccessModeMenu ─────────────────────────────────────────────────────── */

export function SpecAccessMode() {
  const [mode, setMode] = useState<"ask" | "risk" | "full">("risk");
  return (
    <Stack gap={20}>
      <Group title="三种审批方式（inline）" hint="这是权限模式不是沙盒；full 用危险色 + 「无隔离」字样说清楚。">
        <div style={{ maxWidth: 420 }}>
          <AccessModeMenu value={mode} onChange={setMode} inline />
        </div>
      </Group>
      <Group title="当前选择" hint="调用方保留最终确认逻辑，组件只负责选择。">
        <Row>
          <Badge variant={mode === "full" ? "danger" : mode === "risk" ? "warning" : "neutral"}>
            {mode === "ask" ? "请求批准" : mode === "risk" ? "替我审批" : "完全信任（无隔离）"}
          </Badge>
          <Button variant="secondary" onClick={() => setMode("ask")}>
            切回请求批准
          </Button>
        </Row>
      </Group>
    </Stack>
  );
}

/* ── 对话内联示例（把上面几件拼成一条真实回答） ─────────────────────────── */

export function SpecChatComposition() {
  return (
    <Stack gap={20}>
      <Group title="一条回答里的组合" hint="任务步骤 → 压缩提示 → 文件改动卡片，垂直节奏 12px；这是组件真实出现的样子。">
        <Card className="kit-msg-card">
          <CardHeader>
            <div className="kit-head-inline">
              <Bot size={15} />
              <strong className="kit-card-title">助手回复</strong>
              <Badge variant="success">已完成</Badge>
            </div>
            <span className="kit-note">12 秒</span>
          </CardHeader>
          <CardBody>
            {/* The reading column of a conversation is 760px; constraining it here
                keeps the task steps, the file card and the metric strip on ONE
                left edge (otherwise the card centres itself and drifts 70px in). */}
            <div className="kit-reading-col">
            <Stack gap={12}>
              <TaskStepList steps={STEPS.slice(0, 4)} compact />
              <CompactionProgress variant="row" status="completed" detail="12,400 → 3,200 Token" />
              <FileChangeCard files={FILES.slice(0, 3)} workspacePath="D:\\workspace\\demo" onReview={() => {}} />
              <UsageMetrics
                metrics={[
                  { id: "in", label: "会话输入", value: "36.3M" },
                  { id: "out", label: "会话输出", value: "319.1K" },
                  { id: "speed", label: "输出速度", value: "112 token/s" },
                  { id: "cache", label: "缓存命中", value: "98.3%" },
                ]}
                cost={{ label: "本轮消费", value: "0.231715" }}
              />
            </Stack>
            </div>
          </CardBody>
        </Card>
      </Group>
      <Group title="输入框上方的通知栈" hint="权限 / 任务 / 文件改动 / 追加消息，从上到下按「越需要你动手越靠下」排。">
        <Stack gap={8}>
          <FileChangeNotice files={FILES.slice(0, 3)} />
          <NoticePanel compact label="后台任务" summary="Perfetto 采集剩余 12s" tone="warning" icon={<Clock size={15} />} />
          <NoticePanel compact label="权限请求" summary="adb shell pm clear com.demo" tone="attention" icon={<ShieldAlert size={15} />} />
        </Stack>
      </Group>
      <Group title="图标参考" hint="对话区常用的 lucide 图标（同一描边 1.6，14–18px）。">
        <Row>
          {[Bot, Sparkles, Wrench, Terminal, GitBranch, FileText, FolderOpen, ImageIcon, Clock].map((Icon, index) => (
            <Cell key={index}>
              <Icon size={16} className="kit-dim" />
            </Cell>
          ))}
        </Row>
      </Group>
    </Stack>
  );
}
