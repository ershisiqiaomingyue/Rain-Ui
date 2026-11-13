/* ══════════════════════════════════════════════════════════════════════════
   基础：色彩 / 排版 / 圆角间距 / 动效与焦点
   ══════════════════════════════════════════════════════════════════════════ */

import { Button, Input, Tooltip } from "rain-ui";
import { Group, Note, Row, Stack } from "./kit";

/* 语义色只有 shadcn 这一套：19 个名字，一个都不许新增。
   之前那套 bg-app / bg-canvas / text-primary / accent-primary / success-text
   的自造词汇已经整体删除，别再照旧名字加回来。 */
const COLOR_GROUPS: { group: string; items: [string, string][] }[] = [
  {
    group: "表面（从下往上）",
    items: [
      ["--background", "窗口底 / 画布"],
      ["--card", "卡片"],
      ["--popover", "浮层 / 菜单"],
      ["--muted", "弱化底：轨道、表头"],
      ["--accent", "悬停底"],
      ["--secondary", "次级按钮底"],
    ],
  },
  {
    group: "文字",
    items: [
      ["--foreground", "正文"],
      ["--muted-foreground", "次要 / 说明"],
      ["--primary-foreground", "主色底上的字"],
      ["--secondary-foreground", "次级底上的字"],
      ["--accent-foreground", "悬停底上的字"],
    ],
  },
  {
    group: "线与强调",
    items: [
      ["--border", "描边 / 分割线"],
      ["--input", "输入框描边"],
      ["--ring", "焦点环"],
      ["--primary", "强调（按钮 / 选中）"],
      ["--destructive", "危险 / 删除"],
      ["--destructive-foreground", "危险底上的字"],
    ],
  },
];

export function SpecColor() {
  return (
    <Stack gap={20}>
      <Group title="令牌速查" hint="切亮暗时同一条令牌换值，组件不用改；下面每个色块都是 hsl(var(--token))——语义层的值存的是裸三元组，别忘了外面那层 hsl()。">
        <div className="kit-color-groups">
          {COLOR_GROUPS.map(({ group, items }) => (
            <div key={group} className="kit-color-group">
              <span className="kit-group-label">{group}</span>
              <div className="kit-color-grid">
                {items.map(([name, use]) => (
                  <div key={name} className="kit-color-item">
                    <span className="kit-color-chip" style={{ background: `hsl(var(${name}))` }} />
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

      <Group title="用法边界" hint="强调色只有一个 --primary；正文是 --foreground，说明文字是 --muted-foreground，危险是 --destructive。没有第二套「成功 / 警告」色，状态改用文案 + 圆点表达。">
        <Row>
          <span className="kit-swatch-line" style={{ color: "hsl(var(--primary))" }}>
            链接 / 强调
          </span>
          <span className="kit-swatch-line" style={{ color: "hsl(var(--foreground))" }}>
            正文
          </span>
          <span className="kit-swatch-line" style={{ color: "hsl(var(--muted-foreground))" }}>
            12px 元信息
          </span>
          <span className="kit-swatch-line" style={{ color: "hsl(var(--destructive))" }}>
            ！设备断开
          </span>
        </Row>
      </Group>

      <Group title="对比度下限" hint="正文 --foreground 在 --background 上要过 12:1；--muted-foreground 只用于 12px 以上的说明文字，不承载关键内容。">
        <Note>shadcn 默认值实测：亮色 --foreground ≈17.9:1、--muted-foreground ≈4.6:1；暗色 --foreground ≈17.4:1、--muted-foreground ≈7.6:1。暗色 --destructive 只有 ≈2.2:1，大面积文字不可读，所以危险态走图标 + 文案 + 描边，不靠红字。</Note>
      </Group>
    </Stack>
  );
}

/* ── 排版 ───────────────────────────────────────────────────────────────── */

const TYPE_ROWS: { size: string; px: string; use: string; weight: number }[] = [
  { size: "--fs-headline", px: "20px", use: "页面标题（一屏一个）", weight: 600 },
  { size: "--fs-title", px: "16px", use: "卡片 / 弹层标题、空状态主句", weight: 600 },
  { size: "--fs-body", px: "13px", use: "正文、按钮文字、表单值（body 默认）", weight: 400 },
  { size: "--fs-label", px: "12px", use: "表单标签、表头、分组小标题", weight: 500 },
  { size: "--fs-meta", px: "11px", use: "时间戳、计数、次级说明", weight: 400 },
  { size: "--fs-micro", px: "10px", use: "徽标、角标、键帽（字号下限）", weight: 500 },
];

export function SpecType() {
  return (
    <Stack gap={20}>
      <Group title="6 档字号" hint="全库只有 6 档；不允许 10.5px、11.5px、12.5px、13.5px 这类中间值——它们是「层级看起来差不多」的来源。每档都配 --lh-* / --fw-* 同名变量。">
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
  ["--radius", "8px", "shadcn 基准：rounded-lg / md / sm 由它算出来"],
  ["--radius-control", "7px", "按钮、输入框、选择器、菜单项"],
  ["--radius-panel", "11px", "卡片、表格、面板、提示条"],
  ["--radius-overlay", "14px", "弹窗、气泡、右键菜单"],
  ["--radius-full", "9999px", "胶囊、圆点、头像"],
];

export function SpecRadius() {
  return (
    <Stack gap={20}>
      <Group title="5 档圆角" hint="只有这几档：7 控件 / 11 面板 / 14 浮层 / full 胶囊，rounded-lg 走 shadcn 基准 --radius。别在组件里现写 rounded-[9px] 这种一次性值。">
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
