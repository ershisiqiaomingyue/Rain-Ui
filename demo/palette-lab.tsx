import * as React from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/**
 * Palette Lab（demo 专用，不属于库）
 * -----------------------------------------------------------------------------
 * 现场选型实验台，选完把数值抄进 palettes.css / tokens.css 固化：
 *
 *   1. 10 套 primary 候选 —— 每张预览卡用 CSS 变量局部覆盖 --primary /
 *      --primary-foreground / --ring，卡里的实心按钮、进度、色点自动跟色；
 *      点整张卡 = 全站预览（注入一条 <style>，暗亮两主题一起换），再点一次取消。
 *   2. 卡片阶梯 —— 「当前」+ 白→淡白灰 4 档（白色内高光 + 墨灰低透明外影），
 *      画布底色可切：卡片要浮起来，画布就不能是纯白 —— 白卡叠白底只剩描边，
 *      这就是「看着淡」的根源。点某档 = 覆盖亮色主题 --shadow-card 全站预览。
 *
 * 只动 CSS 变量，不引新色相：候选值全部来自 Tailwind 调色板的同一支色相。
 */

/* ─── primary 候选 ×3（第一轮 18 支筛剩的）──────────────────────────────
   钴蓝/靛夜取自 design-taste skill 调色板库的低饱和系（tailwind-500 全饱和的
   都读成状态色，被毙）；靛蓝是 V1 里唯一留存的。规律不变：暗色亮档配深墨字，
   亮色压深档配白字（≥4.5:1），ring 跟 primary。 */
interface PrimarySet {
  h: string
  ink: string
}
interface PrimaryCandidate {
  id: string
  name: string
  en: string
  note: string
  dark: PrimarySet
  light: PrimarySet
}

const CANDIDATES: PrimaryCandidate[] = [
  {
    id: "v2-cobalt", name: "钴蓝", en: "Cobalt", note: "「蓝图」系：比经典蓝深半档的皇家蓝，最有正经工具相",
    dark: { h: "226 82% 72%", ink: "222 60% 12%" }, light: { h: "223 71% 49%", ink: "0 0% 100%" },
  },
  {
    id: "v2-midnight", name: "靛夜", en: "Midnight", note: "Linear 同族的低饱和靛，蓝里带一点暮色，不刺眼",
    dark: { h: "233 69% 76%", ink: "230 55% 13%" }, light: { h: "235 50% 53%", ink: "0 0% 100%" },
  },
  {
    id: "indigo", name: "靛蓝", en: "Indigo", note: "V1 留存：饱和度更高的传统靛，和靛夜对比着看",
    dark: { h: "234 89% 74%", ink: "226 71% 13%" }, light: { h: "243 75% 56%", ink: "0 0% 100%" },
  },
]

/* ─── V3 · 大厂同源 ×8 ─────────────────────────────────────────────────
   skill 池子翻完之后的另一条路：直接锚定被亿级用户验证过的产品主色
   （GitHub / Ant / Bootstrap / Stripe / Linear / Notion / Teal / Supabase），
   按「亮色白字 ≥4.5:1、暗色墨字 ≥6:1」重新调档 —— 饱和度压到 50–92% 的
   中段，不 neon 也不发灰。名字对着品牌，选中哪个 = 想要哪种产品气质。 */
const CANDIDATES_V3: PrimaryCandidate[] = [
  {
    id: "v3-github", name: "极客蓝", en: "GitHub", note: "GitHub 主色。工具感的基准答案， developer 工具里最不会错的一支",
    dark: { h: "213 89% 64%", ink: "216 30% 8%" }, light: { h: "212 92% 45%", ink: "0 0% 100%" },
  },
  {
    id: "v3-ant", name: "明快蓝", en: "Ant", note: "Ant Design v5 主色。中后台产品的事实标准，明快但不刺眼",
    dark: { h: "214 92% 67%", ink: "216 60% 10%" }, light: { h: "214 90% 49%", ink: "0 0% 100%" },
  },
  {
    id: "v3-bootstrap", name: "皇家蓝", en: "Bootstrap", note: "Bootstrap 蓝。比明快蓝深一档，更稳重",
    dark: { h: "216 99% 71%", ink: "222 60% 10%" }, light: { h: "216 89% 45%", ink: "0 0% 100%" },
  },
  {
    id: "v3-stripe", name: "电光靛", en: "Stripe", note: "Stripe blurple。支付级的高级感，蓝里带一点紫光",
    dark: { h: "243 100% 77%", ink: "243 60% 12%" }, light: { h: "243 84% 63%", ink: "0 0% 100%" },
  },
  {
    id: "v3-linear", name: "靛灰蓝", en: "Linear", note: "Linear 主色。Issue 追踪器的冷静，工程师审美的最大公约数",
    dark: { h: "234 71% 77%", ink: "234 45% 12%" }, light: { h: "235 56% 56%", ink: "0 0% 100%" },
  },
  {
    id: "v3-notion", name: "纸墨蓝", en: "Notion", note: "Notion 蓝。文档工具的干净，冷一点、白底上很挺",
    dark: { h: "206 74% 66%", ink: "208 60% 10%" }, light: { h: "204 92% 40%", ink: "0 0% 100%" },
  },
  {
    id: "v3-teal", name: "水鸭青", en: "Teal", note: "tailwind teal-700 档。青绿之间，工具里少见的清爽",
    dark: { h: "172 48% 50%", ink: "174 50% 11%" }, light: { h: "175 77% 26%", ink: "0 0% 100%" },
  },
  {
    id: "v3-supabase", name: "开源绿", en: "Supabase", note: "Supabase 绿。带开发者的生长感，比翠绿沉稳",
    dark: { h: "151 50% 53%", ink: "152 50% 10%" }, light: { h: "150 70% 30%", ink: "0 0% 100%" },
  },
]

/* ─── 卡片阶梯：白色内高光（「纯白」的部分）+ 墨灰低透明外影（淡白灰递增） ───
   阴影墨色固定 slate-900：阴影只承担「离页面多远」，不承担色相。 */
const SHADOW_INK = "222 47% 11%"
interface Elevation {
  id: string
  name: string
  desc: string
  shadow: string
}
const ELEVATIONS: Elevation[] = [
  {
    id: "e1", name: "L1 静置", desc: "列表行 / 卡里嵌套块，几乎贴住画布",
    shadow: `0 1px 2px hsl(${SHADOW_INK} / 0.04)`,
  },
  {
    id: "e2", name: "L2 卡片", desc: "标准卡片。白高光收边 + 浅灰两层",
    shadow: `inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px hsl(${SHADOW_INK} / 0.04), 0 4px 12px -2px hsl(${SHADOW_INK} / 0.07)`,
  },
  {
    id: "e3", name: "L3 悬浮", desc: "hover 抬起 / 下拉菜单",
    shadow: `inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px hsl(${SHADOW_INK} / 0.05), 0 8px 24px -4px hsl(${SHADOW_INK} / 0.11)`,
  },
  {
    id: "e4", name: "L4 浮层", desc: "模态 / 全局通知",
    shadow: `inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 4px hsl(${SHADOW_INK} / 0.06), 0 16px 40px -8px hsl(${SHADOW_INK} / 0.15)`,
  },
]

const CANVASES = [
  { id: "white", name: "纯白", value: "#ffffff" },
  { id: "mist", name: "雾白", value: "#f8fafc" },
  { id: "gray", name: "浅灰", value: "#eef2f6" },
]

const LS_PRIMARY = "rain-lab-primary"
const LS_SHADOW = "rain-lab-shadow"
const LS_CANVAS = "rain-lab-canvas"

function setOverrideStyle(tagId: string, css: string) {
  let tag = document.getElementById(tagId) as HTMLStyleElement | null
  if (!tag) {
    tag = document.createElement("style")
    tag.id = tagId
    document.head.appendChild(tag)
  }
  tag.textContent = css
}

function vars(cs: React.CSSProperties & Record<string, string | number>) {
  return cs as React.CSSProperties
}

/* 一张 primary 预览卡：卡上覆盖 --primary / --primary-foreground / --ring，
   卡内所有用语义色的组件自动跟色 —— 这正是「换 primary 整站跟着换」的活演示。 */
function PrimaryTile({
  c,
  dark,
  active,
  onPick,
}: {
  c: PrimaryCandidate
  dark: boolean
  active: boolean
  onPick: () => void
}) {
  const set = dark ? c.dark : c.light
  const ring = set.h
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "group relative w-full rounded-xl border bg-card p-3 text-left transition-transform duration-100",
        "hover:-translate-y-0.5",
        active ? "border-transparent" : "border-border/70"
      )}
      style={vars({
        "--primary": set.h,
        "--primary-foreground": set.ink,
        "--ring": ring,
        ...(active ? { outline: "2px solid hsl(var(--ring))", outlineOffset: "2px" } : {}),
      })}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">
          {c.name} <span className="font-mono text-[10px] font-normal text-muted-foreground">{c.en}</span>
        </span>
        {active && (
          <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: "hsl(var(--primary) / 0.14)", color: "hsl(var(--primary))" }}>
            预览中
          </span>
        )}
      </div>
      <p className="mt-1 min-h-8 text-[11px] leading-4 text-muted-foreground">{c.note}</p>
      {/* 实心 / 淡底 / 描边 三种强度，再加进度与四档色点 —— 一屏看全 primary 的用法 */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium" style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
          主要操作
        </span>
        <span className="inline-flex h-6 items-center rounded-md px-2 text-[11px]" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
          淡底标签
        </span>
        <span className="inline-flex h-6 items-center rounded-md border px-2 text-[11px]" style={{ borderColor: "hsl(var(--primary) / 0.3)", color: "hsl(var(--primary))" }}>
          描边
        </span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full" style={{ background: "hsl(var(--muted))" }}>
        <div className="h-full w-[62%] rounded-full" style={{ background: "hsl(var(--primary))" }} />
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        {[0.25, 0.5, 0.75, 1].map((a) => (
          <span key={a} className="size-3 rounded-full" style={{ background: `hsl(var(--primary) / ${a})` }} />
        ))}
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">{dark ? "暗" : "亮"} {set.h}</span>
      </div>
    </button>
  )
}

/* 阶梯样本卡：同样的内容，只有影子不同，影子差异才看得准 */
function LadderCard({ shadow, name, desc, active, onPick }: { shadow: string; name: string; desc: string; active: boolean; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "w-full rounded-[14px] border p-3 text-left transition-transform duration-100 hover:-translate-y-0.5",
        active ? "border-primary" : "border-border/60"
      )}
      style={{ background: "hsl(var(--card))", boxShadow: shadow }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">{name}</span>
        {active && <span className="text-[10px] font-medium text-primary">使用中</span>}
      </div>
      <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{desc}</p>
      <div className="mt-2.5 flex items-center gap-2">
        <span className="inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium" style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
          操作
        </span>
        <Switch checked onCheckedChange={() => {}} aria-label={`${name} 开关`} />
        <code className="ml-auto hidden max-w-40 truncate text-[9px] text-muted-foreground lg:block">{shadow}</code>
      </div>
    </button>
  )
}

export function PaletteLab({ dark }: { dark: boolean }) {
  const [picked, setPicked] = React.useState<string | null>(() => localStorage.getItem(LS_PRIMARY))
  const [shadow, setShadow] = React.useState<string | null>(() => localStorage.getItem(LS_SHADOW))
  const [canvas, setCanvas] = React.useState(() => localStorage.getItem(LS_CANVAS) ?? "mist")
  const canvasBg = CANVASES.find((x) => x.id === canvas)?.value ?? CANVASES[1].value

  const applyPrimary = (c: PrimaryCandidate) => {
    localStorage.setItem(LS_PRIMARY, c.id)
    setOverrideStyle(
      "rain-lab-primary-override",
      `:root{--primary:${c.dark.h};--primary-foreground:${c.dark.ink};--ring:${c.dark.h};}\n` +
        `html[data-theme="light"]{--primary:${c.light.h};--primary-foreground:${c.light.ink};--ring:${c.light.h};}`
    )
  }
  const pickPrimary = (c: PrimaryCandidate | null) => {
    setPicked(c?.id ?? null)
    if (!c) {
      setOverrideStyle("rain-lab-primary-override", "")
      localStorage.removeItem(LS_PRIMARY)
      return
    }
    applyPrimary(c)
  }
  // 刷新后把上次选中的那套真正注入（picked 只负责卡片上的高亮标记）
  React.useEffect(() => {
    const saved = localStorage.getItem(LS_PRIMARY)
    const c = [...CANDIDATES, ...CANDIDATES_V3].find((x) => x.id === saved)
    if (c) {
      setPicked(c.id)
      applyPrimary(c)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const pickShadow = (e: Elevation | null) => {
    setShadow(e?.id ?? null)
    if (!e) {
      setOverrideStyle("rain-lab-shadow-override", "")
      localStorage.removeItem(LS_SHADOW)
      return
    }
    localStorage.setItem(LS_SHADOW, e.id)
    setOverrideStyle(
      "rain-lab-shadow-override",
      `html[data-theme="light"]{--shadow-card:${e.shadow};--shadow-popover:${e.shadow};}`
    )
  }

  return (
    <div className="space-y-6">
      {/* ── 1. primary 候选 ── */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-foreground">Primary 候选 ×3（点卡片 = 全站预览，含暗色）</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              18 支筛剩的三支。每套只动 --primary / --primary-foreground / --ring × 暗亮两主题；选中全站换色，localStorage 记住选择。
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => pickPrimary(null)}>
            重置为 slate
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {CANDIDATES.map((c) => (
            <PrimaryTile key={c.id} c={c} dark={dark} active={picked === c.id} onPick={() => pickPrimary(picked === c.id ? null : c)} />
          ))}
        </div>

        <h3 className="mt-6 text-xs font-semibold text-foreground">V3 · 大厂同源 ×8（GitHub / Ant / Stripe / Linear…，点卡片全站预览）</h3>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          skill 调色板池子之外的第二条路：锚定成熟产品的主色，按白字 ≥4.5:1 重新调档 —— 想要哪种产品的气质，就点哪张卡。
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {CANDIDATES_V3.map((c) => (
            <PrimaryTile key={c.id} c={c} dark={dark} active={picked === c.id} onPick={() => pickPrimary(picked === c.id ? null : c)} />
          ))}
        </div>
      </div>

      {/* ── 2. 卡片阶梯 ── */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-foreground">卡片阶梯：当前 vs 白→淡白灰 4 档（点卡片 = 全站预览，仅亮色主题）</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              配方 = 白色内高光（「纯白」的成分，收出锐边）+ 墨灰低透明外影（淡白灰递进）。卡片要「浮」起来，画布就不能是纯白 —— 白卡叠白底只剩描边，这就是觉得淡的根源。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border/60 p-0.5">
              {CANVASES.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => {
                    setCanvas(x.id)
                    localStorage.setItem(LS_CANVAS, x.id)
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px]",
                    canvas === x.id ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span className="size-2.5 rounded-full border border-black/10" style={{ background: x.value }} />
                  {x.name}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => pickShadow(null)}>
              重置阴影
            </Button>
          </div>
        </div>

        {/* 画布：底色可切，阶梯和语境条都放在这张画布上判断 */}
        <div className="mt-3 rounded-xl border border-border/40 p-4 transition-colors" style={{ background: canvasBg }}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div
              className="rounded-[14px] border border-border/60 p-3"
              style={{ background: "hsl(var(--card))", boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">当前</span>
                <span className="text-[10px] text-muted-foreground">shadow-card</span>
              </div>
              <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">现在线上的卡片阴影，作对照。</p>
              <div className="mt-2.5 h-6 rounded-md border border-dashed border-border/70" />
            </div>
            {ELEVATIONS.map((e) => (
              <LadderCard
                key={e.id}
                shadow={e.shadow}
                name={e.name}
                desc={e.desc}
                active={shadow === e.id}
                onPick={() => pickShadow(shadow === e.id ? null : e)}
              />
            ))}
          </div>

          {/* 语境条：一段宿主里最常见的「侧栏 + 工具卡」布局，放在同一张画布上感受 */}
          <div className="mt-4 flex gap-3">
            <div className="w-40 shrink-0 rounded-[10px] border border-border/50 p-2.5" style={{ background: "hsl(var(--card))", boxShadow: "var(--shadow-card)" }}>
              <div className="space-y-1.5">
                {["设备列表", "文件管理", "终端", "日志"].map((t, i) => (
                  <div key={t} className={cn("rounded-md px-2 py-1 text-[11px]", i === 0 ? "font-medium text-foreground" : "text-muted-foreground")} style={i === 0 ? { background: "hsl(var(--accent))" } : undefined}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-3">
              {[0, 1].map((i) => (
                <div key={i} className="rounded-[10px] border border-border/50 p-3" style={{ background: "hsl(var(--card))", boxShadow: "var(--shadow-card)" }}>
                  <div className="flex items-center gap-2">
                    <span className="size-5 rounded-md" style={{ background: "hsl(var(--primary) / 0.14)" }} />
                    <span className="text-[11px] font-medium text-foreground">{i === 0 ? "一键刷机" : "备份与恢复"}</span>
                    <span className="ml-auto inline-flex h-5 items-center rounded px-1.5 text-[10px]" style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}>
                      {i === 0 ? "开始" : "打开"}
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-1.5">
                    <div className="h-1.5 w-[86%] rounded-full" style={{ background: "hsl(var(--muted))" }} />
                    <div className="h-1.5 w-[64%] rounded-full" style={{ background: "hsl(var(--muted))" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
