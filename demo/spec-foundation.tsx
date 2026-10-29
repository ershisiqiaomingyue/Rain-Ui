/* ══════════════════════════════════════════════════════════════════════════
   基础：色彩 / 排版 / 圆角间距 / 动效与焦点
   ══════════════════════════════════════════════════════════════════════════ */

import { Button, Input, Tooltip } from "rain-ui";
import { Group, Note, Row, Stack } from "./kit";

const COLOR_GROUPS: { group: string; items: [string, string][] }[] = [
  {
    group: "背景层级（从下往上）",
    items: [
      ["--bg-ambient", "窗口最外层"],
      ["--bg-app", "外壳 / 侧栏"],
      ["--bg-canvas", "工作区画布"],
      ["--workspace-panel-bg", "面板"],
      ["--bg-surface", "浮起表面"],
      ["--bg-card", "卡片"],
      ["--bg-hover", "悬停"],
    ],
  },
  {
    group: "文字",
    items: [
      ["--text-primary", "正文"],
      ["--text-secondary", "次要"],
      ["--text-tertiary", "三级 · 小字下限"],
      ["--text-muted", "弱化 / 禁用区"],
    ],
  },
  {
    group: "强调与状态",
    items: [
      ["--accent-primary", "主强调"],
      ["--accent-hover", "强调悬停"],
      ["--success-text", "成功"],
      ["--warning-text", "警告"],
      ["--danger-text", "失败"],
    ],
  },
  {
    group: "线与控件",
    items: [
      ["--divider-color", "分割线"],
      ["--card-border", "卡片边框"],
      ["--input-bg", "输入底"],
      ["--chrome-selected", "选中底"],
      ["--chrome-ink", "选中字"],
    ],
  },
];

export function SpecColor() {
  return (
    <Stack gap={20}>
      <Group title="令牌速查" hint="切亮暗时同一条令牌换值，组件不用改；下面每个色块都直接 background: var(--token)。">
        <div className="kit-color-groups">
          {COLOR_GROUPS.map(({ group, items }) => (
            <div key={group} className="kit-color-group">
              <span className="kit-group-label">{group}</span>
              <div className="kit-color-grid">
                {items.map(([name, use]) => (
                  <div key={name} className="kit-color-item">
                    <span className="kit-color-chip" style={{ background: `var(${name})` }} />
                    <div>
                      <code>{name}</code>
                      <small>{use}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Group>

      <Group title="用法边界" hint="语义色只表达语义：成功用 --success-text，不要用 --accent-primary 冒充「好了」。">
        <Row>
          <span className="kit-swatch-line" style={{ color: "var(--success-text)" }}>
            编译成功
          </span>
          <span className="kit-swatch-line" style={{ color: "var(--warning-text)" }}>
            需要授权
          </span>
          <span className="kit-swatch-line" style={{ color: "var(--danger-text)" }}>
            ！设备断开
          </span>
          <span className="kit-swatch-line" style={{ color: "var(--accent-ink)" }}>
            链接 / 强调
          </span>
          <span className="kit-swatch-line" style={{ color: "var(--text-tertiary)" }}>
            12px 元信息
          </span>
        </Row>
      </Group>

      <Group title="对比度下限" hint="正文 --text-primary 在 --bg-canvas 上 ≥ 12:1；--text-secondary ≥ 7:1；--text-tertiary 只用于 12px 以上的次要信息，不承载关键内容。">
        <Note>实测：亮色 --text-tertiary #5b6b80 在白底 5.44:1、在 #f2f5f9 上 4.98:1，满足 AA；深色 #7c8ba1 在 #0b0e13 上 5.58:1。仍不要用它写正文。</Note>
      </Group>
    </Stack>
  );
}

/* ── 排版 ───────────────────────────────────────────────────────────────── */

const TYPE_ROWS: { size: string; px: string; use: string; weight: number }[] = [
  { size: "--text-display", px: "20px", use: "页面标题（一屏一个）", weight: 600 },
  { size: "--text-title", px: "16px", use: "卡片 / 弹层标题、空状态主句", weight: 600 },
  { size: "--text-body", px: "13px", use: "正文、按钮文字、表单值（body 默认）", weight: 400 },
  { size: "--text-label", px: "12px", use: "表单标签、表头、次要说明", weight: 400 },
  { size: "--text-meta", px: "11px", use: "时间戳、计数、脚注（字号下限）", weight: 400 },
];

export function SpecType() {
  return (
    <Stack gap={20}>
      <Group title="5 档字号" hint="全库只有 5 档；不允许 10px、10.5px、11.5px、12.5px、13.5px 这类中间值——它们是「层级看起来差不多」的来源。">
        <div className="kit-type-table">
          {TYPE_ROWS.map(({ size, px, use, weight }) => (
            <div key={size} className="kit-type-row">
              <span className="kit-type-sample" style={{ fontSize: px, fontWeight: weight }}>
                Android Toolkit 设备工作台
              </span>
              <code>{size}</code>
              <span className="kit-type-px">{px}</span>
              <span className="kit-note">{use}</span>
            </div>
          ))}
        </div>
      </Group>

      <Group title="等宽（只给代码）" hint="路径、命令、日志、堆栈用 --font-mono；界面文案一律不用等宽。">
        <div className="kit-code-inline">
          <code>adb shell am force-stop com.demo</code>
          <code>D:\workspace\demo\app\src\main</code>
          <code>0x00007ff6 · libart.so</code>
        </div>
      </Group>

      <Group title="数字对齐" hint="表格数值、用量条、耗时统一 font-variant-numeric: tabular-nums，列才对得齐。">
        <Row>
          <span className="kit-num">12.4 ms</span>
          <span className="kit-num">9.35 ms</span>
          <span className="kit-num">1,204 ms</span>
          <span className="kit-num">0.2317</span>
        </Row>
      </Group>
    </Stack>
  );
}

/* ── 圆角与间距 ─────────────────────────────────────────────────────────── */

const RADII: [string, string, string][] = [
  ["--radius-control", "6px", "按钮、输入框、选择器、菜单项"],
  ["--radius-panel", "10px", "卡片、表格、面板、提示条"],
  ["--radius-overlay", "14px", "弹窗、气泡、右键菜单"],
  ["--radius-full", "9999px", "胶囊、圆点、头像"],
];

export function SpecRadius() {
  return (
    <Stack gap={20}>
      <Group title="4 档圆角" hint="只有这四档：6 控件 / 10 面板 / 14 浮层 / full 胶囊。7、8、9、11、12、16、18 这些值一律不再使用。">
        <Row>
          {RADII.map(([token, px, use]) => (
            <div key={token} className="kit-radius-item">
              <span className="kit-radius-box" style={{ borderRadius: `var(${token})` }} />
              <code>{token}</code>
              <span className="kit-note">
                {px} · {use}
              </span>
            </div>
          ))}
        </Row>
      </Group>

      <Group title="间距（4px 基数）" hint="组件内部 padding 用 8/10/12/14；区块之间 20/24/32；页面外边距 24–48。">
        <Row>
          {[4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48].map((n) => (
            <div key={n} className="kit-space-item">
              <span className="kit-space-box" style={{ width: n, height: n }} />
              <code>{n}</code>
            </div>
          ))}
        </Row>
      </Group>

      <Group title="一行公式" hint="卡片 = padding 14px + 边框 1px + 行高 20px；列表行高 36px；控件高 32px。">
        <Note>控件 32 高，行 36 高，卡片头 40 高——三档差值 4，视觉上是一个节奏。</Note>
      </Group>
    </Stack>
  );
}

/* ── 动效与焦点 ─────────────────────────────────────────────────────────── */

export function SpecMotion() {
  return (
    <Stack gap={20}>
      <Group title="三档时长" hint="hover 120ms / 展开 160ms / 弹窗 200ms；超出 240ms 的操作会觉得卡。">
        <Row>
          <span className="kit-motion-chip is-fast">120ms · 悬停</span>
          <span className="kit-motion-chip is-mid">160ms · 展开</span>
          <span className="kit-motion-chip is-slow">200ms · 弹窗</span>
        </Row>
      </Group>

      <Group title="焦点环（键盘 Tab 试一下）" hint="2px 强调色 + 2px 偏移；它是「你在这里」，不是「这项被选中」。">
        <Row>
          <Button variant="secondary">Tab 到我</Button>
          <Button variant="primary">再 Tab</Button>
          <Input placeholder="输入框也有环" />
          <Tooltip content="焦点环同样出现在图标按钮上">
            <Button variant="bare" aria-label="更多操作">
              ⋯
            </Button>
          </Tooltip>
        </Row>
      </Group>

      <Group title="允许 / 不允许" hint="允许：透明度、位移 ≤8px、颜色过渡。不允许：缩放弹跳、旋转装饰、无限循环（除了真实的加载指示）。">
        <Note>所有动画都响应 prefers-reduced-motion: reduce → 时长归零，只保留最终状态。</Note>
      </Group>
    </Stack>
  );
}
