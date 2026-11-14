/* ══════════════════════════════════════════════════════════════════════════
   工具 / 环境 / 语言服务器条目：整行点击开合的五套展开形态。
   演示站只负责把状态摆全 —— 组件本身不依赖这里的任何东西。

   这里每一条都是「自己的卡片」：收起时一行，展开时还是同一张卡片变高。
   分组外面那层 bg-muted/40 的浅底是为了模拟宿主面板的底：白卡片得落在浅底上，
   层级才看得出来（面板底 → 条目卡片 → 展开区里的分项卡片 → 分项里的输入框）。
   ══════════════════════════════════════════════════════════════════════════ */

import * as React from "react"

import { AppIcon } from "@/components/icons/AppIcon"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select-menu"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  ExpandableItem,
  ExpandableItemSection,
  ToolChoiceItem,
  ToolInfoItem,
  ToolItem,
  ToolUpdateItem,
} from "@/components/composed"

/** 一行小标题 + 说明 */
function Head({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
      {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
    </div>
  )
}

/** 条目之间的间距容器 */
function Stack({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>
}

/** 模拟面板底：白卡片落在这层浅底上，堆叠关系才立得住 */
function Panel({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 rounded-xl bg-muted/60 p-3">{children}</div>
}

const CHANNELS = [
  { label: "稳定版", value: "stable" },
  { label: "预览版", value: "preview" },
]

const GRADLE_SOURCES = [
  { id: "project", label: "项目内 gradlew", description: "跟着项目走，版本由项目自己决定", meta: "优先" },
  { id: "bundled", label: "应用内置", description: "装在应用管理的工具目录里", meta: "8.10.2" },
  { id: "path", label: "系统 PATH", description: "用系统里已经装好的那份", meta: "8.7" },
]

const NODE_SIZE_MB = 45.6
const NODE_SPEED_MB = 12.3

/** 演示用的假下载：真下载在宿主里走 Tauri 事件，这里只推进进度。 */
function useFakeDownload() {
  const [state, setState] = React.useState<"idle" | "downloading" | "paused" | "done">("idle")
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    if (state !== "downloading") return
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(timer)
          return 100
        }
        return Math.min(100, prev + 4)
      })
    }, 240)
    return () => window.clearInterval(timer)
  }, [state])

  React.useEffect(() => {
    if (state === "downloading" && progress >= 100) setState("done")
  }, [state, progress])

  return {
    state,
    progress,
    start: () => {
      setProgress(0)
      setState("downloading")
    },
    stop: () => setState("paused"),
    resume: () => setState("downloading"),
    cancel: () => {
      setProgress(0)
      setState("idle")
    },
  }
}

export function ToolItemsSpec() {
  const download = useFakeDownload()
  const [autoCheck, setAutoCheck] = React.useState(true)
  const [channel, setChannel] = React.useState("stable")
  const [gradleSource, setGradleSource] = React.useState("bundled")
  const [lspCommand, setLspCommand] = React.useState("rust-analyzer")
  const [lspArgs, setLspArgs] = React.useState("--stdio")
  const [kotlinPath, setKotlinPath] = React.useState("")
  // 安装中 → 取消 → 退回「安装」，用来演示忙时那颗按钮的来回。
  const [ndkState, setNdkState] = React.useState<"installing" | "idle">("installing")

  const running = download.state === "downloading" || download.state === "paused"
  const doneMB = (NODE_SIZE_MB * download.progress) / 100

  return (
    <div className="flex flex-col gap-6">
      {/* ── 一、并列成组：特性和布局都在同一条里混排 ───────────────────────── */}
      <div className="flex flex-col gap-2">
        <Head title="工具链与运行时" hint="点整行开合；右端的开关 / 下拉不会被误触" />
        <Panel>
          <ToolUpdateItem
            title="Node.js"
            currentVersion="22.11.0"
            targetVersion="22.12.0"
            state={download.state}
            progress={download.state === "idle" ? null : download.progress}
            detail={
              running
                ? `${doneMB.toFixed(1)} MB / ${NODE_SIZE_MB} MB · ${NODE_SPEED_MB} MB/s · 剩余 ${Math.max(0, Math.ceil((NODE_SIZE_MB - doneMB) / NODE_SPEED_MB))} 秒`
                : `安装包 ${NODE_SIZE_MB} MB · nodejs.org`
            }
            onStart={download.start}
            onStop={download.stop}
            onResume={download.resume}
            onCancel={download.cancel}
            description="装在应用自己管理的工具目录里，不会被系统里的同名工具顶掉。"
            footerLeft={
              <span className="truncate font-mono">%USERPROFILE%\.android-toolkit\tools\node</span>
            }
          />

          <ToolItem
            title="rust-analyzer"
            meta="0.3.2192"
            defaultExpanded
            status={<Badge variant="muted" dot>可用</Badge>}
            description="可执行文件与启动参数存在配置里，改完保存才生效。"
            fields={[
              {
                id: "lsp-command",
                label: "启动命令",
                value: lspCommand,
                placeholder: "例如 rust-analyzer",
                hint: "可填命令名或绝对路径",
                mono: true,
                onChange: setLspCommand,
                action: (
                  <Button
                    size="icon-sm"
                    variant="secondary"
                    icon={<AppIcon name="folder-open" />}
                    title="选择本地可执行文件"
                    aria-label="选择本地可执行文件"
                  />
                ),
              },
              {
                id: "lsp-args",
                label: "启动参数",
                value: lspArgs,
                placeholder: "例如 --stdio",
                mono: true,
                onChange: setLspArgs,
              },
            ]}
            footerLeft={
              <span className="truncate font-mono">
                %USERPROFILE%\.android-toolkit\tools\rust-analyzer.exe
              </span>
            }
            footer={
              <>
                <Button size="sm" variant="secondary" className="border border-primary/25" icon={<AppIcon name="undo" />}>
                  还原
                </Button>
                <Button size="sm" variant="primary" icon={<AppIcon name="save" />}>
                  保存
                </Button>
              </>
            }
          />

          <ToolInfoItem
            title="JDK"
            meta="21.0.5+11"
            defaultExpanded
            status={<Badge variant="muted" dot>可用</Badge>}
            sectionLabel="版本与安装位置"
            description="只读信息：要换版本就卸载后重新下载。"
            items={[
              { label: "版本", value: "21.0.5+11-LTS", mono: true },
              { label: "发行版", value: "Eclipse Temurin" },
              { label: "来源", value: "adoptium.net" },
              { label: "更新时间", value: "2026-10-28 14:02", mono: true },
              {
                label: "安装路径",
                value: "…\\tools\\jdk-21.0.5+11",
                mono: true,
                title: "%USERPROFILE%\\.android-toolkit\\tools\\jdk-21.0.5+11",
              },
              { label: "许可", value: "GPLv2 + Classpath" },
            ]}
            footerLeft={<span className="font-mono">首次检测于 2026-10-28</span>}
            footer={
              <Button size="sm" variant="secondary" className="border border-primary/25" icon={<AppIcon name="refresh" />}>
                重新检测
              </Button>
            }
          />

          <ToolChoiceItem
            title="Gradle"
            defaultExpanded
            status={<Badge variant="muted">{GRADLE_SOURCES.find((item) => item.id === gradleSource)?.label}</Badge>}
            value={gradleSource}
            options={GRADLE_SOURCES}
            onChange={setGradleSource}
            sectionLabel="兜底来源"
            description="构建优先用项目内 gradlew，这里决定兜底用哪一份。"
          />

          {/* 裸壳：右侧放开关，行本身没有展开内容 —— 点它就是切换，不摊任何东西 */}
          <ExpandableItem
            title="启动时检查工具更新"
            meta="每天一次"
            actions={
              <Switch
                checked={autoCheck}
                onCheckedChange={setAutoCheck}
                aria-label="启动时检查工具更新"
              />
            }
          />

          {/* 裸壳：右侧放下拉，展开区自己拼分项卡片 */}
          <ExpandableItem
            title="Kotlin 语言服务器"
            meta="0.3.7"
            defaultExpanded
            status={
              <Badge variant="warning" dot pulse>
                未找到
              </Badge>
            }
            actions={
              <Select
                size="sm"
                options={CHANNELS}
                value={channel}
                onChange={setChannel}
                aria-label="语言服务器通道"
              />
            }
          >
            <div className="flex flex-col gap-2">
              <p className="m-0 px-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
                还没探测到可执行文件。先用内置通道跑；有自备的那份就填下面这个路径。
              </p>

              <ExpandableItemSection
                label="检测结果"
                hint="自动探测 · 3 秒前"
              >
                <dl className="m-0 flex flex-col gap-2">
                  <div className="flex min-w-0 items-baseline gap-2">
                    <dt className="w-[62px] shrink-0 text-[11px] text-muted-foreground">搜索范围</dt>
                    <dd className="m-0 min-w-0 flex-1 truncate font-mono text-[11px] text-foreground">
                      %USERPROFILE%\.android-toolkit\tools\kotlin-lsp
                    </dd>
                  </div>
                  <div className="flex min-w-0 items-baseline gap-2">
                    <dt className="w-[62px] shrink-0 text-[11px] text-muted-foreground">预期版本</dt>
                    <dd className="m-0 min-w-0 flex-1 font-mono text-[11px] text-foreground">
                      0.3.7
                    </dd>
                  </div>
                </dl>
              </ExpandableItemSection>

              <ExpandableItemSection label="手动指定可执行文件" hint="留空则用内置通道">
                <Input
                  size="sm"
                  variant="surface"
                  value={kotlinPath}
                  placeholder="例如 D:\tools\kotlin-lsp.bat"
                  onChange={(event) => setKotlinPath(event.target.value)}
                  className="min-w-0 font-mono text-[11px]"
                />
              </ExpandableItemSection>
            </div>
          </ExpandableItem>
        </Panel>
      </div>

      {/* ── 二、单条卡片：不套分组，自己就是一张卡 ─────────────────────────── */}
      <div className="flex flex-col gap-2">
        <Head title="单条卡片" hint="脱离分组也能独立成卡；展开后往卡片里叠分项" />
        <Stack>
          <ToolItem
            title="Gradle Wrapper"
            meta="8.10.2"
            defaultExpanded
            status={<Badge variant="muted" dot>可用</Badge>}
            description="项目里有 gradlew 时优先用它，构建脚本改版本不会影响应用内置那份。"
            fields={[
              {
                id: "wrapper-path",
                label: "gradlew 路径",
                value: "gradlew.bat",
                hint: "相对项目根目录",
                mono: true,
              },
            ]}
            footer={
              <Button size="sm" variant="secondary" className="border border-primary/25">
                打开所在目录
              </Button>
            }
          />

          <ToolUpdateItem
            title="Android SDK Platform-Tools"
            currentVersion="35.0.1"
            targetVersion="35.0.2"
            state="paused"
            progress={64}
            defaultExpanded
            detail="走的是公司镜像，暂停后不会自己续上"
            description="adb / fastboot 用这一份；暂停后保留已下载的分片。"
            onResume={() => undefined}
            onCancel={() => undefined}
          />
        </Stack>
      </div>

      {/* ── 三、更新状态一览：同一个组件摆出全部状态 ───────────────────────── */}
      <div className="flex flex-col gap-2">
        <Head title="更新状态一览" hint="收起态就要能看出要不要动手" />
        <Panel>
          <ToolUpdateItem
            title="Python"
            currentVersion="3.12.4"
            targetVersion="3.13.1"
            state="idle"
            detail="安装包 28.4 MB · python.org"
            description="下载完自动装进应用工具目录，不碰系统里的 Python。"
            onStart={() => undefined}
          />
          <ToolUpdateItem
            title="CMake"
            currentVersion="3.30.4"
            targetVersion="3.30.4"
            state="idle"
            detail="已安装 2026-10-28 · 82.1 MB"
            description="当前版本与目标版本一致，不需要动作。"
          />
          <ToolUpdateItem
            title="Ninja"
            currentVersion="1.12.0"
            targetVersion="1.13.0"
            state="downloading"
            progress={38}
            defaultExpanded
            detail="0.9 MB / 2.4 MB · 1.1 MB/s · 剩余 2 秒"
            description="增量更新，只替换可执行文件。"
            onStop={() => undefined}
          />
          <ToolUpdateItem
            title="Swift"
            currentVersion="5.10"
            targetVersion="5.10.1"
            state="paused"
            progress={71}
            detail="1.4 GB / 2.0 GB · 已暂停 2 分钟"
            description="暂停后保留分片，继续时从断点接着下。"
            onResume={() => undefined}
            onCancel={() => undefined}
          />
          <ToolUpdateItem
            title="Android NDK"
            currentVersion="26.1.10909125"
            targetVersion="27.0.12077973"
            state={ndkState}
            progress={ndkState === "installing" ? 100 : null}
            actionLabel="安装"
            onStart={() => setNdkState("installing")}
            onCancel={() => setNdkState("idle")}
            detail="正在解压 · 6,412 个文件"
            description="压缩包已下完，正在解压并写配置；取消就退回「安装」，随时再点。"
          />
          <ToolUpdateItem
            title="Kotlin Compiler"
            currentVersion="2.0.21"
            targetVersion="2.0.21"
            state="done"
            progress={100}
            detail="共 68 个文件，用时 42 秒"
            description="更新完成，下次编译就用新版本。"
          />
          <ToolUpdateItem
            title="Docker CLI"
            currentVersion="27.2.0"
            targetVersion="27.3.1"
            state="error"
            progress={12}
            defaultExpanded
            detail="1.2 MB / 10.4 MB"
            description="从官方域名拉包失败，换镜像源后重试。"
            errorText="连接被重置：download.docker.com 探测不到。换个镜像源再试。"
            onStart={() => undefined}
          />
        </Panel>
      </div>
    </div>
  )
}
