/* ══════════════════════════════════════════════════════════════════════════
   反馈：Spinner / StepSpinner / Portal / Modal / Tooltip / ContextMenu /
        ProgressRing / ToolEmptyState / ToolBackButton
   ══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import {
  Copy,
  ExternalLink,
  FolderOpen,
  Info,
  Pencil,
  RefreshCw,
  Settings,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  ContextMenu,
  Modal,
  ProgressRing,
  Spinner,
  StepSpinner,
  ToolBackButton,
  ToolEmptyState,
  ToolLoadingState,
  Tooltip,
  Portal,
  PortalProvider,
  usePortal,
} from "rain-ui";
import type { ContextMenuItem } from "rain-ui";
import { Cell, Group, Note, Row, Stack } from "./kit";

/* ── Spinner / StepSpinner ──────────────────────────────────────────────── */

export function SpecSpinner() {
  return (
    <Stack gap={20}>
      <Group title="尺寸（currentColor）" hint="14 是默认；颜色继承文字色，所以放在状态行里是中性色、放在压缩条里是强调色。">
        <Row>
          {[12, 14, 16, 20, 28].map((size) => (
            <Cell key={size} label={`${size}px`}>
              <Spinner size={size} />
            </Cell>
          ))}
        </Row>
      </Group>
      <Group title="上下文里的样子" hint="左边是正文旁的「正在加载」，右边是按钮加载态（按钮自带，不要另塞 spinner）。">
        <Row>
          <span className="kit-inline-status">
            <Spinner size={14} /> 正在读取设备信息…
          </span>
          <span className="kit-inline-status is-dim">
            <Spinner size={14} /> 已停止
          </span>
          <Button variant="secondary" loading>
            保存中
          </Button>
          <Button variant="primary" loading>
            执行
          </Button>
        </Row>
      </Group>
      <Group title="StepSpinner" hint="虚线弧 + 强调色圆环，用于「这一步正在跑」；比 Spinner 更有方向感，不要和它混用。">
        <Row>
          {[16, 20, 24].map((size) => (
            <Cell key={size} label={`${size}px`}>
              <StepSpinner size={size} />
            </Cell>
          ))}
          <Cell label="带标签">
            <span className="kit-inline-status">
              <StepSpinner size={20} /> 编译中
            </span>
          </Cell>
        </Row>
      </Group>
    </Stack>
  );
}

/* ── Portal ─────────────────────────────────────────────────────────────── */

function PortalTrigger() {
  const portal = usePortal();
  return (
    <Row>
      <Button variant="secondary" onClick={() => portal.success("已复制到剪贴板")}>
        success
      </Button>
      <Button variant="secondary" onClick={() => portal.error("设备已断开，命令未执行")}>
        error
      </Button>
      <Button variant="secondary" onClick={() => portal.warning("目标设备存储空间不足")}>
        warning
      </Button>
      <Button variant="secondary" onClick={() => portal.info("后台任务已开始采集")}>
        info
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          portal.push({
            message: "已写入 3 个文件",
            tone: "success",
            action: { label: "撤销", onClick: () => portal.info("已撤销") },
          })
        }
      >
        带动作
      </Button>
      <Button variant="secondary" onClick={() => portal.push({ message: "这条会停 8 秒", duration: 8000 })}>
        duration 8000
      </Button>
    </Row>
  );
}

export function SpecPortal() {
  return (
    <Stack gap={20}>
      <Group title="触发（真实堆栈，底部居中）" hint="最多同时 3 条，超出时最旧的一条先走；error 默认 4.8s，其余 3s。">
        <PortalProvider position="bottom-center" appearance="solid">
          <PortalTrigger />
        </PortalProvider>
      </Group>
      <Group title="静态样式（四态排开）" hint="胶囊圆角 + 色调底色；图标、文案和动作在同一行，成功绿、失败红、警告黄、信息强调色。">
        <Stack gap={8}>
          <div style={{ maxWidth: 420 }}>
            <Portal message="已复制到剪贴板" tone="success" appearance="solid" onClose={() => {}} />
          </div>
          <div style={{ maxWidth: 420 }}>
            <Portal message="设备已断开，命令未执行" tone="error" appearance="solid" onClose={() => {}} />
          </div>
          <div style={{ maxWidth: 420 }}>
            <Portal message="目标设备存储空间不足" tone="warning" appearance="solid" onClose={() => {}} />
          </div>
          <div style={{ maxWidth: 420 }}>
            <Portal message="后台任务已开始采集" tone="info" appearance="solid" onClose={() => {}} />
          </div>
          <div style={{ maxWidth: 420 }}>
            <Portal message="已写入 3 个文件" tone="success" appearance="solid" actionLabel="撤销" onClose={() => {}} />
          </div>
        </Stack>
      </Group>
    </Stack>
  );
}

/* ── Modal ──────────────────────────────────────────────────────────────── */

export function SpecModal() {
  const [basic, setBasic] = useState(false);
  const [danger, setDanger] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <Stack gap={20}>
      <Group title="三种常用形态" hint="标题 + 描述 + 内容 + 底部按钮；Esc 关闭，点遮罩关闭（busy 时两者都禁用）。">
        <Row>
          <Button variant="secondary" onClick={() => setBasic(true)}>
            普通弹窗
          </Button>
          <Button variant="secondary" onClick={() => setDanger(true)}>
            危险确认
          </Button>
          <Button variant="secondary" onClick={() => setBusy(true)}>
            执行中（不可关闭）
          </Button>
        </Row>
      </Group>

      <Modal
        open={basic}
        title="重命名会话"
        description="标题只影响左侧列表，不会改动工作区。"
        icon={<Pencil size={16} />}
        onClose={() => setBasic(false)}
        footer={
          <>
            <Button variant="subtle" onClick={() => setBasic(false)}>
              取消
            </Button>
            <Button variant="primary" onClick={() => setBasic(false)}>
              保存
            </Button>
          </>
        }
      >
        <Stack gap={12}>
          <Note>这里是内容插槽：表单、说明、预览都可以放。</Note>
          <Card tone="muted">
            <CardBody>Card tone=&quot;muted&quot; 用来在弹窗里区分次级区块。</CardBody>
          </Card>
        </Stack>
      </Modal>

      <Modal
        open={danger}
        title="删除工作区？"
        description="工作区内的 12 个会话会一起删除，无法恢复。"
        icon={<Trash2 size={16} />}
        iconTone="danger"
        size="sm"
        onClose={() => setDanger(false)}
        footer={
          <>
            <Button variant="subtle" onClick={() => setDanger(false)}>
              取消
            </Button>
            <Button variant="danger" onClick={() => setDanger(false)}>
              删除
            </Button>
          </>
        }
      >
        <Note>危险操作：确认按钮用 danger 变体，并且文案写清楚后果。</Note>
      </Modal>

      <Modal
        open={busy}
        title="正在安装 APK"
        description="安装期间请勿断开设备。"
        busy
        onClose={() => setBusy(false)}
        footer={
          <Button variant="secondary" onClick={() => setBusy(false)} disabled>
            关闭
          </Button>
        }
      >
        <Row>
          <Spinner size={16} />
          <span className="kit-note">adb install -r release.apk</span>
        </Row>
      </Modal>
    </Stack>
  );
}

/* ── Tooltip ────────────────────────────────────────────────────────────── */

export function SpecTooltip() {
  return (
    <Stack gap={20}>
      <Group title="悬停 / 聚焦" hint="只在悬停或键盘聚焦时出现，四边自动翻转；内容一句话，不要放换行动作。">
        <Row>
          <Tooltip content="刷新设备列表">
            <Button variant="secondary" icon={<RefreshCw size={15} />} aria-label="刷新设备列表" />
          </Tooltip>
          <Tooltip content="打开文件所在目录">
            <Button variant="secondary" icon={<FolderOpen size={15} />} aria-label="打开文件所在目录" />
          </Tooltip>
          <Tooltip content="这段说明同样可以通过键盘 Tab 唤出">
            {/* subtle 的静止态是透明底：单独出现时会被读成一行说明文字，
                而不是「可以按的按钮」。演示里必须让它看起来像控件。 */}
            <Button variant="secondary">键盘聚焦试试</Button>
          </Tooltip>
        </Row>
      </Group>
      <Group title="图标按钮必须有 tooltip" hint="图标单独出现时，tooltip 就是它唯一的标签；不要用 title 属性代替。">
        <Row>
          {[
            { icon: Copy, label: "复制路径" },
            { icon: ExternalLink, label: "在编辑器中打开" },
            { icon: Terminal, label: "在终端中运行" },
            { icon: Settings, label: "工具设置" },
          ].map(({ icon: Icon, label }) => (
            <Tooltip key={label} content={label}>
              {/* bare / subtle 的静止态都是透明底，单独摆一行时四个图标会读成一行小字，
                  和上一组的有框按钮不是同一个控件。演示里统一用 secondary，
                  命中区 32px、有框，和工具条里的图标按钮一致。 */}
              <Button variant="secondary" icon={<Icon size={15} />} aria-label={label} />
            </Tooltip>
          ))}
        </Row>
      </Group>
    </Stack>
  );
}

/* ── ContextMenu ────────────────────────────────────────────────────────── */

const MENU: readonly ContextMenuItem[] = [
  { label: "复制路径", icon: <Copy size={14} />, onSelect: () => {} },
  { label: "在编辑器中打开", icon: <ExternalLink size={14} />, onSelect: () => {} },
  { label: "在终端中运行", icon: <Terminal size={14} />, onSelect: () => {}, disabled: true },
  { label: "固定到顶栏", icon: <Settings size={14} />, checked: true, onSelect: () => {} },
  { label: "删除文件", icon: <Trash2 size={14} />, danger: true, onSelect: () => {} },
];

export function SpecContextMenu() {
  const [anchor, setAnchor] = useState<{ x: number; y: number; trigger: HTMLElement } | null>(null);
  return (
    <Stack gap={20}>
      <Group title="右键唤出" hint="在下面的区域里右键；方向键移动，Enter 选中，Esc 关闭并把焦点还给触发元素。">
        <div
          className="kit-context-target"
          onContextMenu={(event) => {
            event.preventDefault();
            setAnchor({ x: event.clientX, y: event.clientY, trigger: event.currentTarget });
          }}
        >
          <Terminal size={18} />
          <span>在这里右键</span>
        </div>
      </Group>
      <Group title="菜单项规则" hint="checked 打勾、disabled 变灰但保留位置、danger 只用红字不铺红底。">
        <Note>
          当前菜单包含：普通项、disabled 项、checked 项、danger 项各一。
        </Note>
      </Group>
      {anchor && (
        <ContextMenu
          x={anchor.x}
          y={anchor.y}
          label="文件操作"
          items={MENU}
          trigger={anchor.trigger}
          onClose={() => setAnchor(null)}
        />
      )}
    </Stack>
  );
}

/* ── ProgressRing ───────────────────────────────────────────────────────── */

export function SpecProgressRing() {
  return (
    <Stack gap={20}>
      <Group title="阈值色" hint="<70 强调色，≥70 警告，≥90 危险；null 是「未知」灰环，不是 0。">
        <Row>
          <Cell label="6%">
            <ProgressRing percent={6} label="上下文" valueText="6%" />
          </Cell>
          <Cell label="72%（警告）">
            <ProgressRing percent={72} label="上下文" valueText="72%" />
          </Cell>
          <Cell label="94%（危险）">
            <ProgressRing percent={94} label="上下文" valueText="94%" />
          </Cell>
          <Cell label="null（未知）">
            <ProgressRing percent={null} label="上下文" valueText="—" />
          </Cell>
          <Cell label="busy">
            <ProgressRing percent={48} label="上下文" valueText="48%" busy />
          </Cell>
        </Row>
      </Group>
      <Group title="带分段的展开面板" hint="onOpen 存在时环本身是按钮；面板里每段一条，数值右对齐。">
        <div className="kit-ring-stage">
          <ProgressRing
            percent={64}
            label="上下文"
            valueText="64%"
            defaultOpen
            onOpen={() => {}}
            panelLabel="上下文构成"
            segments={[
              { id: "sys", label: "系统提示", percent: 12, valueText: "8.1K" },
              { id: "tools", label: "工具定义", percent: 18, valueText: "12.4K" },
              { id: "files", label: "附件", percent: 22, valueText: "15.0K" },
              { id: "history", label: "历史消息", percent: 48, valueText: "32.6K" },
            ]}
          />
        </div>
      </Group>
    </Stack>
  );
}

/* ── ToolEmptyState / ToolBackButton ────────────────────────────────────── */

export function SpecEmptyStates() {
  return (
    <Stack gap={20}>
      <Group title="整块空状态" hint="一句话说清为什么空，可选的第二句说下一步；不要画插画、不要放装饰图形。">
        <Card>
          <CardBody>
            <ToolEmptyState
              title="还没有选择设备"
              description="连接一台设备，或在左上角切换到无线调试。"
              action={<Button size="sm" variant="secondary">无线调试</Button>}
            />
          </CardBody>
        </Card>
      </Group>
      <Group title="compact（贴在工具栏下）" hint="10px 上下留白，左对齐；用于列表区自身为空且上方已有工具栏的情况。">
        <Card>
          <CardBody>
            <ToolEmptyState compact title="未匹配到日志" description="试着放宽时间范围，或清空关键字筛选。" />
          </CardBody>
        </Card>
      </Group>
      <Group title="ToolBackButton" hint="28×32 图标按钮，必须带 label；它只出现在工具页左上角，不要放在工具栏中间。">
        <Row>
          <ToolBackButton onBack={() => {}} />
          <span className="kit-note">← 返回主页</span>
        </Row>
      </Group>
      <Group title="和真实数据的对比" hint="空状态应该出现在它将要被填充的位置，而不是替换整个页面。">
        <Card>
          <CardHeader>
            <div className="kit-head-inline">
              <strong className="kit-card-title">已连接设备</strong>
              <Badge variant="neutral">0</Badge>
            </div>
            <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />}>
              刷新
            </Button>
          </CardHeader>
          <CardBody>
            <ToolEmptyState compact title="没有检测到设备" description="插上 USB 后会自动出现，也可以点右上角「无线调试」。" />
          </CardBody>
        </Card>
      </Group>
      <Group title="信息条（不是空状态）" hint="Info 图标 + 一行说明，用来解释限制条件，例如「仅在桌面应用内可读取」。">
        <div className="kit-infobar">
          <Info size={14} />
          <span>主机状态仅在桌面应用内可读取。</span>
        </div>
      </Group>
      <Group title="请勿这样用" hint="空状态不是错误提示：不要说「失败」「异常」，那是 NoticePanel / Portal 的职责。">
        <Note>
          错误 → NoticePanel tone=&quot;danger&quot; 或 Portal；空 → ToolEmptyState；
          加载中 → ToolLoadingState（整块）或 Spinner + 真实尺寸骨架（形状已知）。
        </Note>
      </Group>
    </Stack>
  );
}

/* ── ToolLoadingState / 等待态 ──────────────────────────────────────────── */

export function SpecLoadingStates() {
  return (
    <Stack gap={20}>
      <Group title="整块等待" hint="一颗居中 Spinner + 一句在等什么，占住它马上要被填满的那块区域；不要写成左上角的一行文本。">
        <Card>
          <CardBody>
            <ToolLoadingState title="正在读取插件…" description="第一次启动还要校验本地包完整性。" />
          </CardBody>
        </Card>
      </Group>
      <Group title="fill：占满区域并垂直居中" hint="整页 / 整面板的首次渲染用；父级要有确定高度（flex:1 面板、min-h-full 内容列）。">
        <Card>
          <CardBody style={{ height: 220, display: "flex" }}>
            <ToolLoadingState fill title="正在读取当前设置…" description="从本机读取模型与工具配置。" />
          </CardBody>
        </Card>
      </Group>
      <Group title="compact：贴在工具栏下" hint="区域上方已有工具栏或标题时用它；10px 上下留白、左对齐，不抢高度。">
        <Card>
          <CardBody>
            <ToolLoadingState compact title="正在检查插件更新…" />
          </CardBody>
        </Card>
      </Group>
      <Group title="什么时候不用它" hint="骨架屏负责形状已知的首屏；按钮、列表行、状态栏里的等待仍然只用 Spinner。">
        <Note>
          对着真实卡片画骨架（HomePanel 那种）比一句话更准，别用等待态糊过去；反过来，
          形状未知、只剩一句话可说时也别硬凑骨架。两者都居中在本区域内，别贴着左上角。
        </Note>
      </Group>
    </Stack>
  );
}

/* ── 关闭态按钮（模态右上角）示意 ───────────────────────────────────────── */

export function SpecIconButtons() {
  return (
    <Stack gap={20}>
      <Group title="关 / 开 / 更多" hint="同一行里图标按钮尺寸一致（32），只有一项可以是强调色。">
        <Row>
          {/* bare 没有自己的盒子（几何留给宿主），当图标按钮用只剩 17×19 的命中区，
              和同排的 32px 方块不成行。安静的那一档用 subtle。 */}
          <Button variant="subtle" icon={<X size={15} />} aria-label="关闭" />
          <Button variant="surface" icon={<X size={15} />} aria-label="关闭" />
          <Button variant="secondary" icon={<Settings size={15} />} aria-label="设置" />
          <Button variant="primary" icon={<Terminal size={15} />} aria-label="运行" />
        </Row>
      </Group>
    </Stack>
  );
}
