/**
 * 下载 / 安装进度 —— 五条管道统一成 `ToolUpdateItem` 之后长什么样。
 *
 * 宿主里真有的五条（环境工具 zip、宿主插件 npm、MCP 的 npx 包、模型连接插件、
 * 技能仓库压缩包）字段和阶段都不一样，但收起行是同一套：
 *   标题 + 版本   ｜   状态徽标（下载中 38%）   ｜   一颗按钮
 *   下面一行灰字：已下载 / 总量 · 速度 · 剩余
 *
 * 三条不撒谎的规则：
 *   1. 没有总量就不报百分比 —— npm 要等依赖解析完才知道多大，徽标只写「下载中」；
 *   2. 停不下来的不给按钮 —— 只有技能下载真有取消命令，其余四条只有 300 秒超时，
 *      摆一颗点了没反应的「取消下载」比不摆更糟；
 *   3. 完成后不再摆按钮，勾 +「已完成」已经把话说完了。
 */

import * as React from "react"

import { ToolUpdateItem, type ToolUpdateState } from "@/components/composed"
import { Button } from "@/components/ui/button"
import { Group, Note, Stack } from "./kit"

/** 模拟一条「有总量、能取消」的下载：技能仓库压缩包。 */
function useSimDownload(totalMB = 2.8, stepMB = 0.16) {
  const [state, setState] = React.useState<ToolUpdateState>("idle")
  const [doneMB, setDoneMB] = React.useState(0)

  React.useEffect(() => {
    if (state !== "downloading") return
    const id = window.setInterval(() => setDoneMB((mb) => mb + stepMB), 160)
    return () => window.clearInterval(id)
  }, [state, stepMB])

  React.useEffect(() => {
    if (state === "downloading" && doneMB >= totalMB) setState("done")
  }, [state, doneMB, totalMB])

  const progress = Math.min(100, (doneMB / totalMB) * 100)
  const left = Math.max(0, Math.ceil((totalMB - doneMB) / 1.1))
  const detail =
    state === "idle"
      ? "2.8 MB 压缩包 · 解压后约 6 MB · 148 个文件"
      : state === "done"
        ? "2.8 MB · 用时 2 秒"
        : `${doneMB.toFixed(1)} MB / ${totalMB} MB · 1.1 MB/s · 剩 ${left} 秒`

  return {
    state,
    progress,
    detail,
    start: () => {
      setDoneMB(0)
      setState("downloading")
    },
    // 技能下载没有断点续传，取消 = 回到未开始，重来一遍。
    stop: () => {
      setDoneMB(0)
      setState("idle")
    },
  }
}

export function DownloadProgressSpec() {
  const sim = useSimDownload()

  return (
    <Stack gap={36}>
      <Group
        title="按下下载 / 安装"
        hint="按一下就开始：按钮当场变成取消下载，进度写在同一行的徽标里；下面那行灰字报字节和速度。"
      >
        <ToolUpdateItem
          icon="box"
          title="技能仓库 anthropics/skills"
          detail={sim.detail}
          state={sim.state}
          progress={sim.state === "idle" ? undefined : sim.progress}
          description="解压到 ~/.android-toolkit/skills/anthropics-skills，148 个文件。"
          onStart={sim.start}
          onCancel={sim.stop}
          actionLabel="下载"
          /* 完成时组件自己不给按钮（勾已经说完了），演示站得留一条重来的路。 */
          actions={
            sim.state === "done" ? (
              <Button size="sm" variant="ghost" onClick={sim.start}>
                再下一次
              </Button>
            ) : undefined
          }
        />
      </Group>

      <Group title="六个状态" hint="徽标说话、按钮跟着换，进度只出现在传输 / 安装这几档。">
        <ToolUpdateItem
          icon="box"
          title="platform-tools"
          meta="35.0.2"
          detail="21.4 MB · dl.google.com"
          state="idle"
          onStart={() => {}}
        />
        <ToolUpdateItem
          icon="box"
          title="Node.js"
          meta="24.14.1"
          detail="28.3 MB / 45.6 MB · 4.1 MB/s · 剩 4 秒"
          state="downloading"
          progress={62}
          onCancel={() => {}}
        />
        <ToolUpdateItem
          icon="folder-open"
          title="技能仓库 anthropics/skills"
          detail="解开 148 个文件…"
          state="installing"
          progress={null}
          description="取消命令只到下载那一段：已经在解压时按取消，压缩包照解完。所以这格没有按钮。"
        />
        <ToolUpdateItem
          icon="box"
          title="platform-tools"
          meta="35.0.2"
          detail="12.8 MB · 用时 6 秒"
          state="done"
        />
      </Group>

      <Group
        title="宿主里真有的五条"
        hint="阶段和字段都不一样，收起行长得一模一样 —— 这就是「统一」的意思。"
      >
        <ToolUpdateItem
          icon="box"
          title="Node.js"
          meta="24.14.1"
          detail="28.3 MB / 45.6 MB · 4.1 MB/s · 剩 4 秒"
          state="downloading"
          progress={62}
          description="环境工具 zip：event 里带 downloadedBytes / totalBytes，120ms 一帧，断点可续传；没有取消命令。"
        />
        <ToolUpdateItem
          icon="box"
          title="MCP 依赖 filesystem / git"
          detail="已收到 6.2 MB · 2.4 MB/s"
          state="downloading"
          description="npx 拉包：跟 npm 同一套 DTO，requestId 换成 MCP 服务 id；同样没有取消。"
        />
        <ToolUpdateItem
          icon="folder-open"
          title="技能仓库 anthropics/skills"
          detail="1.3 MB / 2.8 MB · 45%"
          state="downloading"
          progress={45}
          description="唯一真能取消的一条：cancel_skill_download（但取消到不了解压阶段，也没有续传）。"
          onCancel={() => {}}
        />
      </Group>

      <Note>
        四条「停不了」不是 UI 偷懒：宿主里根本没有取消命令 —— npm / npx 只有 300 秒超时兜底，
        环境工具和模型插件只能等它自己走完。所以 <code>onCancel / onStop</code> 都不传时，
        传输中那格就是空的；摆一颗点了没反应的「取消下载」比不摆更难解释。真要做到都能停，
        得先给插件那条 <code>run()</code> 接一个 kill 位，那是 Rust 侧的活。
      </Note>

      <Group title="可调项" hint="组件只摆样式、切按钮；字节换算和文案都归调用方。">
        <ToolUpdateItem
          icon="download"
          title="按钮文案"
          meta="actionLabel"
          detail="默认「下载 / 更新 / 重试」，技能、插件各自有自己的说法就传进来。"
          state="idle"
          actionLabel="安装"
          onStart={() => {}}
        />
        <ToolUpdateItem
          icon="stop"
          title="传输中的那颗"
          meta="cancelLabel"
          detail="默认「取消下载 / 取消安装」；宿主真支持暂停续传的那天，这里换成「暂停」。"
          state="downloading"
          progress={38}
          cancelLabel="停止"
          onCancel={() => {}}
        />
        <ToolUpdateItem
          icon="alert"
          title="展开区"
          meta="description · errorText"
          detail="版本对比、出错原因收在展开里，收起行只留一眼要看到的东西。"
          state="error"
          errorText="宿主返回的具体错误原样贴在这里，不翻译、不归纳。"
          onStart={() => {}}
        />
      </Group>

      <Note>
        一点进度都没有的地方（下一步再补）：随包运行时解压 176 MB、插件宿主的 npm 依赖
        （observe: false）、环境工具的安装阶段（字节已经在算，只是没往外发）、本地归档解压
        （传了 None）、2.0 数据迁移。前三处都是「接一个回调」的量级。
      </Note>
    </Stack>
  )
}
