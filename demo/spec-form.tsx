/* ══════════════════════════════════════════════════════════════════════════
   表单：Button / Input / Select / Switch / Checkbox / Badge / SegmentedControl / 字体
   每一组都把「所有状态」摆出来：静止、禁用、加载、空值、尺寸、变体。
   ══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  FolderOpen,
  MoreHorizontal,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Square,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import {
  APP_FONT_OPTIONS,
  APP_MONO_FONT_OPTIONS,
  Badge,
  Button,
  Checkbox,
  Input,
  SegmentedControl,
  Select,
  Switch,
  getAppFontStack,
  getAppMonoFontStack,
  readAppFont,
  readAppMonoFont,
  setAppFont,
  setAppMonoFont,
  type AppFont,
  type AppMonoFont,
} from "rain-ui";
import { Cell, Group, Note, Row, Stack } from "./kit";

/* ── Button ─────────────────────────────────────────────────────────────── */

export function SpecButton() {
  return (
    <Stack gap={20}>
      <Group title="7 个变体" hint="primary 一屏只放一个；bare 是纯文字动作；surface 用于工具条。">
        <Row>
          <Button variant="primary">开始采集</Button>
          <Button variant="secondary">刷新设备</Button>
          <Button variant="surface">打开终端</Button>
          <Button variant="subtle">更多</Button>
          <Button variant="success" icon={<Check size={14} />}>
            已保存
          </Button>
          <Button variant="danger" icon={<Trash2 size={14} />}>
            删除
          </Button>
          <Button variant="bare">收起</Button>
        </Row>
      </Group>

      <Group title="4 个尺寸" hint="xs 24 / sm 28 / md 32 / lg 38。">
        <Row>
          <Button size="xs" variant="secondary">
            xs · 24
          </Button>
          <Button size="sm" variant="secondary">
            sm · 28
          </Button>
          <Button size="md" variant="secondary">
            md · 32
          </Button>
          <Button size="lg" variant="secondary">
            lg · 38
          </Button>
        </Row>
      </Group>

      <Group title="状态" hint="禁用统一 45% 透明；loading 期间默认不响应点击。">
        <Row>
          <Cell label="default">
            <Button variant="secondary">默认</Button>
          </Cell>
          <Cell label="disabled">
            <Button variant="secondary" disabled>
              禁用
            </Button>
          </Cell>
          <Cell label="loading · primary">
            <Button variant="primary" loading>
              保存中
            </Button>
          </Cell>
          <Cell label="loading · secondary">
            <Button variant="secondary" loading>
              刷新中
            </Button>
          </Cell>
          <Cell label="前置图标">
            <Button variant="secondary" icon={<Play size={14} />}>
              运行
            </Button>
          </Cell>
          <Cell label="后置图标">
            <Button variant="secondary">
              下一步 <ArrowRight size={14} />
            </Button>
          </Cell>
        </Row>
      </Group>

      <Group
        title="图标按钮"
        hint="只放图标时必须给 aria-label + Tooltip。尺寸随 size 档，图标 14–17px，形状是正方（aspect-ratio:1）。"
      >
        <Row>
          <Cell label="surface · md">
            <Button variant="surface" icon={<Settings size={15} />} aria-label="设置" />
          </Cell>
          <Cell label="surface · sm">
            <Button variant="surface" size="sm" icon={<Settings size={14} />} aria-label="设置" />
          </Cell>
          <Cell label="surface · xs">
            <Button variant="surface" size="xs" icon={<Settings size={13} />} aria-label="设置" />
          </Cell>
          <Cell label="secondary">
            <Button variant="secondary" icon={<RefreshCw size={14} />} aria-label="刷新" />
          </Cell>
          <Cell label="subtle">
            <Button variant="subtle" icon={<MoreHorizontal size={15} />} aria-label="更多" />
          </Cell>
          <Cell label="bare">
            <Button variant="bare" icon={<X size={14} />} aria-label="关闭" />
          </Cell>
          <Cell label="bare · danger">
            <Button variant="bare" className="btn-danger-hover" icon={<Trash2 size={14} />} aria-label="删除" />
          </Cell>
          <Cell label="tool-page-back-button">
            <Button
              className="tool-page-back-button"
              variant="secondary"
              size="sm"
              icon={<ArrowLeft size={17} />}
              aria-label="返回主页"
              title="返回主页"
            />
          </Cell>
        </Row>
      </Group>

      <Group
        title="工具栏组合（图标按钮的真实排法）"
        hint="图标按钮几乎总是成排出现：28px 方格、2–4px 间隙、组之间插一条 1px 竖线、末尾放一个 primary。"
      >
        <Stack gap={10}>
          <Row>
            <div className="kit-toolbar">
              <Button variant="subtle" size="sm" icon={<ArrowLeft size={14} />} aria-label="后退" />
              <Button variant="subtle" size="sm" icon={<ArrowRight size={14} />} aria-label="前进" />
              <span className="kit-toolbar-sep" />
              <Button variant="subtle" size="sm" icon={<RefreshCw size={14} />} aria-label="刷新" />
              <Button variant="subtle" size="sm" icon={<FolderOpen size={14} />} aria-label="打开文件夹" />
              <Button variant="subtle" size="sm" icon={<Copy size={14} />} aria-label="复制" />
              <span className="kit-toolbar-sep" />
              <Button variant="subtle" size="sm" icon={<Download size={14} />} aria-label="导出" />
              <Button variant="subtle" size="sm" icon={<Trash2 size={14} />} aria-label="清空" />
              <span className="kit-toolbar-sep" />
              <Button variant="surface" size="sm" icon={<Sparkles size={14} />} aria-label="AI 助手" />
              <Button variant="primary" size="sm">
                开始采集
              </Button>
            </div>
          </Row>
          <Row>
            <div className="kit-toolbar is-tight">
              <Button variant="surface" size="sm" icon={<Plus size={15} />} aria-label="新建" />
              <Button variant="surface" size="sm" icon={<ChevronDown size={15} />} aria-label="展开" />
              <Button variant="surface" size="sm" icon={<Square size={14} />} aria-label="停止" />
              <Button variant="surface" size="sm" icon={<Zap size={14} />} aria-label="性能" />
            </div>
          </Row>
          <Row>
            <div className="kit-toolbar is-railed">
              <Button variant="subtle" size="sm" icon={<ChevronDown size={15} />} aria-label="折叠" />
              <span className="kit-toolbar-label">终端 · 本地</span>
              <Button variant="subtle" size="sm" icon={<Plus size={15} />} aria-label="新建终端" />
              <Button variant="subtle" size="sm" icon={<MoreHorizontal size={15} />} aria-label="更多" />
            </div>
          </Row>
        </Stack>
      </Group>
    </Stack>
  );
}

/* ── Input ──────────────────────────────────────────────────────────────── */

export function SpecInput() {
  const [text, setText] = useState("app1whu@10.179.85.15");
  return (
    <Stack gap={20}>
      <Group title="3 个尺寸" hint="sm 28 / md 32 / lg 38；字号 12 / 12.5 / 13.5。">
        <Row>
          <Cell label="sm" width={180}>
            <Input size="sm" placeholder="sm 28px" />
          </Cell>
          <Cell label="md（默认）" width={180}>
            <Input placeholder="md 32px" />
          </Cell>
          <Cell label="lg" width={180}>
            <Input size="lg" placeholder="lg 38px" />
          </Cell>
        </Row>
      </Group>

      <Group title="两种底" hint="sunken 是默认内凹槽位；surface 给顶栏搜索这类贴合条面的位置，圆角仍是 6px 控件档，只是底更浅。">
        <Row>
          <Cell label="sunken" width={220}>
            <Input placeholder="内凹槽位" />
          </Cell>
          <Cell label="surface" width={220}>
            <Input variant="surface" placeholder="贴面条带" />
          </Cell>
          <Cell label="surface + 前缀图标" width={220}>
            <Input variant="surface" placeholder="搜索工具..." prefixIcon={<Search size={14} />} />
          </Cell>
        </Row>
      </Group>

      <Group title="前后装饰" hint="前缀图标 15px 绝对定位并让出 36px 内边距；clearable 只在有值时出现；suffixAction 放主操作。">
        <Row>
          <Cell label="prefixIcon" width={200}>
            <Input placeholder="搜索设备" prefixIcon={<Search size={14} />} />
          </Cell>
          <Cell label="clearable" width={220}>
            <Input value={text} onChange={(e) => setText(e.target.value)} clearable onClear={() => setText("")} />
          </Cell>
          <Cell label="suffixAction" width={240}>
            <Input placeholder="地址:端口" suffixAction={<Button size="sm" variant="primary">连接</Button>} />
          </Cell>
          <Cell label="prefix + clearable" width={220}>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              prefixIcon={<Search size={14} />}
              clearable
              onClear={() => setText("")}
            />
          </Cell>
        </Row>
      </Group>

      <Group title="状态" hint="hover 抬一步阴影、focus 加一圈强调色 halo、disabled 45% 透明、readonly 文字转次要色。">
        <Row>
          <Cell label="default" width={180}>
            <Input placeholder="默认" />
          </Cell>
          <Cell label="disabled" width={180}>
            <Input disabled placeholder="禁用" />
          </Cell>
          <Cell label="readonly" width={180}>
            <Input readOnly value="只读内容" />
          </Cell>
          <Cell label="aria-invalid" width={180}>
            <Input aria-invalid placeholder="读取失败" defaultValue="R58M40ABCDE" />
          </Cell>
        </Row>
      </Group>

      <Group title="宽度" hint="Input 默认 width:100%，宽度由外层容器决定，不在组件里写死。">
        <Stack gap={8}>
          <Input placeholder="整行宽度（跟随父容器）" />
          <div style={{ width: 260 }}>
            <Input placeholder="260px 容器" suffixAction={<Button size="sm" variant="secondary">检查</Button>} />
          </div>
          <div style={{ width: 160 }}>
            <Input size="sm" placeholder="160px" />
          </div>
        </Stack>
      </Group>
    </Stack>
  );
}

/* ── Select ─────────────────────────────────────────────────────────────── */

const MODELS = [
  { value: "deepseek-flash", label: "deepseek-flash", description: "1M 上下文 · 快" },
  { value: "deepseek-pro", label: "deepseek-pro", description: "256K · 推理" },
  { value: "glm-4.6", label: "glm-4.6", description: "128K · 通用" },
  { value: "qwen-max", label: "qwen-max", description: "32K · 中文强" },
  { value: "kimi-k2", label: "kimi-k2", description: "256K · 长文" },
  { value: "claude-sonnet", label: "claude-sonnet", description: "200K · 需要代理" },
];

export function SpecSelect() {
  const [model, setModel] = useState("deepseek-flash");
  const [empty, setEmpty] = useState<string>();
  return (
    <Stack gap={20}>
      <Group title="基础" hint="触发器 32px，与 Input 同高；空值显示 placeholder；菜单 portal 到 body。">
        <Row>
          <Cell label="有值" width={230}>
            <Select aria-label="模型" value={model} onChange={setModel} options={MODELS} />
          </Cell>
          <Cell label="空值（placeholder）" width={200}>
            <Select aria-label="设备" placeholder="选择设备" value={empty} onChange={setEmpty} options={MODELS} />
          </Cell>
          <Cell label="sm" width={200}>
            <Select aria-label="尺寸" size="sm" value={model} onChange={setModel} options={MODELS} />
          </Cell>
          <Cell label="disabled" width={200}>
            <Select aria-label="禁用" disabled value={model} onChange={setModel} options={MODELS} />
          </Cell>
        </Row>
      </Group>

      <Group title="可搜索 + 头尾插槽" hint="searchable 在菜单内带搜索框；header / footer 放分组说明与底部动作。">
        <Row>
          <Cell label="searchable" width={260}>
            <Select
              aria-label="搜索模型"
              value={model}
              onChange={setModel}
              searchable
              searchPlaceholder="搜索模型"
              options={MODELS}
              footer={<span className="kit-note">↑↓ 选择 · Enter 确认</span>}
            />
          </Cell>
          <Cell label="header + footer" width={260}>
            <Select
              aria-label="模型来源"
              value={model}
              onChange={setModel}
              options={MODELS}
              header={<span className="kit-note">已发现 6 个模型</span>}
              footer={
                <Button variant="bare" size="xs" icon={<RefreshCw size={12} />}>
                  重新发现
                </Button>
              }
            />
          </Cell>
        </Row>
        <Note>菜单是 portal 渲染，静态截图看不到；点开「有值」那个就能看到 6 行带描述的选项。</Note>
      </Group>
    </Stack>
  );
}

/* ── Switch / Checkbox ──────────────────────────────────────────────────── */

export function SpecSwitch() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <Stack gap={20}>
      <Group title="Switch" hint="轨道 32×18；带 label 时整行可点；disabled 时 cursor 变 not-allowed。">
        <Row>
          <Cell label="on">
            <Switch checked={a} onChange={setA} label="自动保存" />
          </Cell>
          <Cell label="off">
            <Switch checked={b} onChange={setB} label="开机自启" />
          </Cell>
          <Cell label="disabled · on">
            <Switch checked disabled label="受策略控制" />
          </Cell>
          <Cell label="disabled · off">
            <Switch checked={false} disabled label="不可用" />
          </Cell>
          <Cell label="无 label（需 aria-label）">
            <Switch checked={a} onChange={setA} aria-label="无标签开关" />
          </Cell>
        </Row>
      </Group>

      <Group title="Checkbox" hint="indeterminate 走 ref 设置 DOM 属性，aria-checked 同步为 mixed。">
        <Row>
          <Cell label="off">
            <Checkbox label="显示已隐藏的工具" />
          </Cell>
          <Cell label="on">
            <Checkbox label="跟随系统主题" checked readOnly />
          </Cell>
          <Cell label="indeterminate">
            <Checkbox label="全选（部分）" indeterminate />
          </Cell>
          <Cell label="disabled">
            <Checkbox label="锁定项" disabled checked readOnly />
          </Cell>
          <Cell label="无 label">
            <Checkbox aria-label="无标签复选框" />
          </Cell>
        </Row>
      </Group>
    </Stack>
  );
}

/* ── Badge ──────────────────────────────────────────────────────────────── */

export function SpecBadge() {
  return (
    <Stack gap={20}>
      <Group title="5 个语义" hint="颜色只表达状态，不做装饰。">
        <Row>
          <Badge variant="primary">已集成</Badge>
          <Badge variant="success">运行中</Badge>
          <Badge variant="warning">需授权</Badge>
          <Badge variant="danger">失败</Badge>
          <Badge variant="neutral">未开放</Badge>
        </Row>
      </Group>
      <Group title="pulse" hint="只给实时变化的状态；静态状态加脉冲等于说谎。">
        <Row>
          <Badge variant="success" pulse>
            采集中
          </Badge>
          <Badge variant="warning" pulse>
            等待设备
          </Badge>
          <Badge variant="danger" pulse>
            连接断开
          </Badge>
        </Row>
      </Group>
      <Group title="行内用法" hint="在列表行里紧跟标题，11px 胶囊，不单独成行。">
        <Row>
          <span className="kit-line">
            Logcat <Badge variant="success">可用</Badge>
          </span>
          <span className="kit-line">
            WinScope <Badge variant="neutral">未开放</Badge>
          </span>
          <span className="kit-line">
            Perfetto <Badge variant="warning">需设备</Badge>
          </span>
        </Row>
      </Group>
    </Stack>
  );
}

/* ── SegmentedControl ───────────────────────────────────────────────────── */

export function SpecSegmented() {
  const [view, setView] = useState("list");
  const [density, setDensity] = useState("舒适");
  const [range, setRange] = useState("1h");
  return (
    <Stack gap={20}>
      <Group title="分段切换" hint="和 tab 不同：分段控件是同一个列表的不同排法，不留 URL。">
        <Row>
          <SegmentedControl
            label="视图"
            value={view}
            onChange={setView}
            options={[
              { value: "list", label: "列表" },
              { value: "grid", label: "网格" },
              { value: "tree", label: "树形" },
            ]}
          />
          <SegmentedControl
            label="时间范围"
            value={range}
            onChange={setRange}
            options={[
              { value: "5m", label: "5 分钟" },
              { value: "1h", label: "1 小时" },
              { value: "1d", label: "1 天" },
              { value: "7d", label: "7 天" },
            ]}
          />
        </Row>
      </Group>
      <Group title="尺寸" hint="默认 28px；用 buttonClassName 可以压到 24px。">
        <Row>
          <SegmentedControl
            label="密度"
            value={density}
            onChange={setDensity}
            options={[
              { value: "舒适", label: "舒适" },
              { value: "紧凑", label: "紧凑" },
            ]}
          />
          <SegmentedControl
            label="密度小"
            value={density}
            onChange={setDensity}
            buttonClassName="kit-seg-xs"
            options={[
              { value: "舒适", label: "舒适" },
              { value: "紧凑", label: "紧凑" },
            ]}
          />
          <SegmentedControl
            label="禁用项"
            value={range}
            onChange={setRange}
            options={[
              { value: "5m", label: "5 分钟" },
              { value: "1h", label: "1 小时" },
              { value: "7d", label: "7 天", disabled: true },
            ]}
          />
        </Row>
      </Group>
    </Stack>
  );
}

/* ── 字体 ───────────────────────────────────────────────────────────────── */

const UI_PREVIEW = "Aa 中文界面，清晰易读 0123456789";
const MONO_PREVIEW = "const adb = await shell.exec();  // → 0x1f600";

export function SpecFonts() {
  const [font, setFont] = useState<AppFont>(() => readAppFont());
  const [mono, setMono] = useState<AppMonoFont>(() => readAppMonoFont());
  const applyFont = (next: AppFont) => {
    setFont(next);
    setAppFont(next);
  };
  const applyMono = (next: AppMonoFont) => {
    setMono(next);
    setAppMonoFont(next);
  };
  return (
    <Stack gap={20}>
      <Group
        title="界面字体"
        hint={`${APP_FONT_OPTIONS.length} 个选项；选中即刻生效并写入 localStorage。字体栈的第一顺位如果是随包 woff2，浏览器会按需 lazy load。`}
      >
        <Row align="start">
          <Cell label="选择器" width={280}>
            <Select
              aria-label="界面字体"
              value={font}
              onChange={(v) => applyFont(v as AppFont)}
              searchable
              searchPlaceholder="搜索界面字体"
              options={APP_FONT_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
            />
          </Cell>
          <Cell label="实时预览 · 中英混排 + 数字">
            <div className="kit-font-preview" style={{ fontFamily: getAppFontStack(font) }}>
              <strong>{UI_PREVIEW}</strong>
              <span>设备工作台 · 日志与性能 · Android Toolkit 1.0.41</span>
            </div>
          </Cell>
        </Row>
      </Group>

      <Group title="15 个选项逐个预览" hint="设置弹窗的下拉里没有逐项预览，所以这里一次排开；点任意一项会切整页字体。">
        <div className="kit-font-grid">
          {APP_FONT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={option.value === font ? "kit-font-item is-active" : "kit-font-item"}
              onClick={() => applyFont(option.value)}
            >
              <span className="kit-font-name">{option.label}</span>
              <span className="kit-font-sample" style={{ fontFamily: getAppFontStack(option.value) }}>
                {UI_PREVIEW}
              </span>
            </button>
          ))}
        </div>
      </Group>

      <Group
        title="等宽字体"
        hint={`${APP_MONO_FONT_OPTIONS.length} 个选项，统一写到 var(--font-mono)。等宽字体普遍缺中文字形，栈尾带 CJK 回退。`}
      >
        <Row align="start">
          <Cell label="选择器" width={280}>
            <Select
              aria-label="代码与终端字体"
              value={mono}
              onChange={(v) => applyMono(v as AppMonoFont)}
              options={APP_MONO_FONT_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
            />
          </Cell>
          <Cell label="预览">
            <div className="kit-font-preview is-mono" style={{ fontFamily: getAppMonoFontStack(mono) }}>
              <strong>{MONO_PREVIEW}</strong>
              <span>com.android.systemui  1842  12.4%  182 MB</span>
            </div>
          </Cell>
        </Row>
        <div className="kit-font-grid is-mono">
          {APP_MONO_FONT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={option.value === mono ? "kit-font-item is-active" : "kit-font-item"}
              onClick={() => applyMono(option.value)}
            >
              <span className="kit-font-name">{option.label}</span>
              <span className="kit-font-sample" style={{ fontFamily: getAppMonoFontStack(option.value) }}>
                {MONO_PREVIEW}
              </span>
            </button>
          ))}
        </div>
      </Group>
    </Stack>
  );
}
