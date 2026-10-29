/* ══════════════════════════════════════════════════════════════════════════
   应用级：ToolIcon / BorderGlow / BootScreen / 焦点 / 图标导航栏
   ══════════════════════════════════════════════════════════════════════════ */

import {
  AppWindow,
  Boxes,
  Bug,
  Code2,
  Cpu,
  FileArchive,
  FolderTree,
  GitCompareArrows,
  Layers,
  Play,
  Radar,
  Smartphone,
  TerminalSquare,
  Wrench,
  Zap,
  Activity,
  Command,
  Settings as SettingsIcon,
  Sparkles,
  MessageSquare,
  Home,
  type LucideIcon,
} from "lucide-react";
import { BootScreen, BorderGlow, ToolIcon, Tooltip } from "rain-ui";
import { Group, Note, Row, Stack } from "./kit";

/* ── ToolIcon ───────────────────────────────────────────────────────────── */

const TOOLS: { name: string; icon: LucideIcon; state: "ready" | "device" | "planned" }[] = [
  { name: "设备管理", icon: Smartphone, state: "device" },
  { name: "包管理", icon: Boxes, state: "device" },
  { name: "设备文件", icon: FolderTree, state: "ready" },
  { name: "Logcat", icon: Bug, state: "device" },
  { name: "Perfetto", icon: Activity, state: "device" },
  { name: "Simpleperf", icon: Cpu, state: "device" },
  { name: "代码查看", icon: Code2, state: "ready" },
  { name: "APK 检查", icon: FileArchive, state: "ready" },
  { name: "AOSP 构建", icon: Layers, state: "ready" },
  { name: "符号解析", icon: GitCompareArrows, state: "device" },
  { name: "WinScope", icon: AppWindow, state: "planned" },
  { name: "性能雷达", icon: Radar, state: "planned" },
];

const STATE_LABEL = { ready: "可用", device: "需设备", planned: "未开放" } as const;

export function SpecToolIcon() {
  return (
    <Stack gap={20}>
      <Group title="36px 方块 · 单色" hint="图标一律 --text-secondary 描边，方块底是 --bg-muted。不要给每个工具一个色相——颜色留给状态。">
        <div className="kit-tool-grid">
          {TOOLS.map(({ name, icon: Icon, state }) => (
            <div key={name} className="kit-tool-cell">
              <ToolIcon size="md" tone="neutral"><Icon size={18} /></ToolIcon>
              <div className="kit-tool-meta">
                <span className="kit-tool-name">{name}</span>
                <span className={`kit-tool-state is-${state}`}>{STATE_LABEL[state]}</span>
              </div>
            </div>
          ))}
        </div>
      </Group>

      <Group title="三档尺寸" hint="md 36 用于卡片头；sm 24 用于表格与列表行；lg 44 只用在工具页的页头。">
        <Row>
          <ToolIcon size="sm" tone="neutral"><Wrench size={14} /></ToolIcon>
          <ToolIcon size="md" tone="neutral"><Play size={18} /></ToolIcon>
          <ToolIcon size="lg" tone="neutral"><TerminalSquare size={22} /></ToolIcon>
        </Row>
      </Group>

      <Group title="合法性" hint="一个图标方块 + 一句状态；若状态需要颜色，颜色在文字上，不在方块上。">
        <Note>错误示范已删除：12 个工具 5 种色相的图标墙，看起来像 5 个不同产品。</Note>
      </Group>
    </Stack>
  );
}

/* ── BorderGlow ─────────────────────────────────────────────────────────── */

export function SpecBorderGlow() {
  return (
    <Stack gap={20}>
      <Group title="指针跟随高光" hint="鼠标在卡片内移动时，边框上只有一处高光跟着走；离开即消失。">
        <Row>
          <BorderGlow className="kit-glow-card">
            <span className="kit-card-title">BorderGlow</span>
            <p className="kit-note">把指针移到这张卡片上——光沿着边框跑，但卡片底色不变。</p>
          </BorderGlow>
          <BorderGlow className="kit-glow-card" colors={["var(--accent-primary)", "var(--inference-fill)"]}>
            <span className="kit-card-title">自定义两色</span>
            <p className="kit-note">默认取 --accent-primary；第二个色可选，别超过两个。</p>
          </BorderGlow>
        </Row>
      </Group>

      <Group title="用在哪" hint="可点击的整块卡片（工具入口、设备卡）。静态信息卡片不要加，光会让人以为能点。">
        <Note>同屏只允许一处持续的动效——BorderGlow 和 Spinner 不要同时抢注意力。</Note>
      </Group>
    </Stack>
  );
}

/* ── BootScreen ─────────────────────────────────────────────────────────── */

export function SpecBoot() {
  return (
    <Stack gap={20}>
      <Group title="启动屏" hint="logo + 一圈呼吸，没有文案、没有进度条。下面这个框是 1:1 缩放的窗口区域。">
        <div className="kit-boot-frame">
          <BootScreen applyToDocument={false} />
        </div>
      </Group>

      <Group title="规则" hint="超过 1.5s 还没起来才显示它；起来后 160ms 淡出，不闪烁。">
        <Note>不写「正在加载资源」，因为用户既不知道也不关心加载了什么。</Note>
      </Group>
    </Stack>
  );
}

/* ── 焦点与键盘 ─────────────────────────────────────────────────────────── */

export function SpecFocus() {
  return (
    <Stack gap={20}>
      <Group title="键盘走一遍" hint="按 Tab 从「开始」走到「结束」，每一站都应有清晰可见的环，且不会让人误以为该项已被选中。">
        <div className="kit-focus-demo">
          <button className="kit-focus-btn" type="button">
            开始
          </button>
          <input className="kit-focus-input" placeholder="中间一个输入框" />
          <select className="kit-focus-select" defaultValue="b">
            <option value="a">全部等级</option>
            <option value="b">警告以上</option>
          </select>
          <button className="kit-focus-btn" type="button">
            结束
          </button>
        </div>
      </Group>

      <Group title="三项要求" hint="1) outline 不被全局 outline:none 抹掉；2) 焦点态与选中态视觉不同；3) 焦点不会被弹层抢走或丢失。">
        <Note>全库焦点环统一在 assets/styles/index.css 顶部定义，组件不再各写一遍，避免有的有环有的没有。</Note>
      </Group>
    </Stack>
  );
}

/* ── 图标导航栏 ─────────────────────────────────────────────────────────── */

const RAIL: { icon: LucideIcon; label: string }[] = [
  { icon: Home, label: "主页" },
  { icon: MessageSquare, label: "对话" },
  { icon: TerminalSquare, label: "终端" },
  { icon: Code2, label: "代码查看" },
  { icon: Sparkles, label: "AI 任务" },
];

export function SpecIconRail() {
  return (
    <Stack gap={20}>
      <Group title="56px 竖栏" hint="图标 18px + tooltip；选中态用 --chrome-selected 中性底和 --chrome-ink，不用强调色铺满。">
        <div className="kit-rail-demo">
          <div className="kit-rail">
            <div className="kit-rail-brand">
              <Command size={16} />
            </div>
            <div className="kit-rail-items">
              {RAIL.map(({ icon: Icon, label }, i) => (
                <Tooltip key={label} content={label}>
                  <button className={`kit-rail-btn${i === 0 ? " is-active" : ""}`} type="button" aria-label={label}>
                    <Icon size={18} />
                  </button>
                </Tooltip>
              ))}
            </div>
            <div className="kit-rail-foot">
              <Tooltip content="设置">
                <button className="kit-rail-btn" type="button" aria-label="设置">
                  <SettingsIcon size={18} />
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="kit-rail-body">
            <span className="kit-card-title">工作区</span>
            <p className="kit-note">竖栏只放全局导航；任何页面级操作都进页面自己的工具条，不要挤进竖栏。</p>
            <Zap size={14} className="kit-rail-hint-icon" />
          </div>
        </div>
      </Group>

      <Group title="数量上限" hint="全局导航 5–7 项。超过 7 项说明需要一层「工具」页来做索引。">
        <Note>图标按钮必须带 aria-label 与 tooltip；只有图标没有名字的按钮，新用户找不到。</Note>
      </Group>
    </Stack>
  );
}
