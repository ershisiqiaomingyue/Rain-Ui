/* ══════════════════════════════════════════════════════════════════════════
   09 · NoticePanel 通知面板 —— 1:1 迁移件
   六种通知（权限 / 提问 / 计划 / 后台 / 队列 / 文件改动）共用一套外壳：
   卡片底 + 单行抬头（图标 · 标签 · 摘要 · 计数 · 元信息 · 箭头）+ 可展开正文。
   ══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import {
  Bot,
  Clock,
  FolderOpen,
  ListChecks,
  ShieldAlert,
  SquareTerminal,
  Trash2,
  Wrench,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Checkbox,
  NoticeBackgroundTask,
  NoticeFileList,
  NoticePanel,
  ChatQueuePanel,
  NoticePermissionContent,
  NoticeQuestionContent,
  NoticeQueueRow,
  type FileChangeEntry,
} from "rain-ui";
import { Group, Note, Row, Stack } from "./kit";

const FILE_SAMPLE: FileChangeEntry[] = [
  { path: "app/src/main/java/com/demo/MainActivity.kt", status: "modified", addedLines: 12, removedLines: 4 },
  { path: "app/src/main/java/com/demo/ui/LogcatPanel.kt", status: "created", addedLines: 86, removedLines: 0 },
  { path: "app/build.gradle.kts", status: "modified", addedLines: 2, removedLines: 1 },
];

/* ── 六种类型的外观（静态，一眼看全） ───────────────────────────────────── */

export function SpecNoticeTypes() {
  return (
    <Stack gap={20}>
      <Group
        title="六种类型，一套外壳"
        hint="图标决定「是哪一类」，颜色只表达「要不要立刻管」；标签固定 2 个汉字宽，摘要跟在后面，不会被挤成两行。"
      >
        <Stack gap={8}>
          <NoticePanel
            label="权限请求"
            summary="执行 adb shell pm clear com.demo"
            tone="neutral"
            icon={<ShieldAlert size={15} />}
            defaultExpanded
          >
            <Note>展开后正文是命令预览 + 允许一次 / 总是允许 / 拒绝。</Note>
          </NoticePanel>
          <NoticePanel
            label="提问"
            summary="选择要安装的设备"
            tone="neutral"
            icon={<Bot size={15} />}
            meta={<Badge variant="neutral">2 个候选</Badge>}
          >
            <Note>模型需要澄清时使用，正文是单选列表。</Note>
          </NoticePanel>
          <NoticePanel
            label="任务编排"
            summary="3 个步骤，预计 40 秒"
            tone="attention"
            icon={<ListChecks size={15} />}
            meta={<span className="kit-inline-status is-dim">进行中 0:18</span>}
          >
            <Note>attention 用于「需要你知道但不阻塞」的计划。</Note>
          </NoticePanel>
          <NoticePanel
            label="后台任务"
            summary="Perfetto 采集 · 剩余 12 秒"
            tone="warning"
            icon={<Clock size={15} />}
          >
            <Note>warning 是「自动流程被打断 / 有超时风险」。</Note>
          </NoticePanel>
          <ChatQueuePanel
            items={[
              { id: "q1", content: "再补一个 Logcat 过滤示例，只看 pid 2481 的日志" },
              { id: "q2", content: "顺便把 build 变体也列出来" },
            ]}
          />
          <NoticePanel
            label="文件改动"
            summary={<span className="kit-diff-count"><b>+14</b> <i>−4</i></span>}
            tone="neutral"
            icon={<FolderOpen size={15} />}
            count={3}
            countSuffix="个文件"
            compact
            defaultExpanded
          >
            <NoticeFileList files={FILE_SAMPLE} onOpen={() => {}} />
          </NoticePanel>
        </Stack>
      </Group>

      <Group title="tone 的边界" hint="danger 只给真实失败；success 只给结果。日常操作不要上色，否则一屏五条通知全是色块。">
        <Stack gap={8}>
          <NoticePanel label="失败" summary="设备已断开，命令未执行" tone="danger" icon={<SquareTerminal size={15} />} />
          <NoticePanel label="完成" summary="已写入 3 个文件" tone="success" icon={<Wrench size={15} />} />
          <NoticePanel
            label="危险操作"
            summary="将删除 12 个会话"
            tone="danger"
            icon={<Trash2 size={15} />}
            actions={
              <>
                <Button variant="subtle" size="xs">
                  取消
                </Button>
                <Button variant="danger" size="xs">
                  删除
                </Button>
              </>
            }
          />
        </Stack>
      </Group>

      <Group title="计数 / 动作 / 徽标三件套" hint="count 贴在摘要右侧（右对齐），meta 紧跟摘要，badge 在最右，actions 独立在抬头右侧——四者互不抢位。">
        <NoticePanel
          label="文件改动"
          summary={<span className="kit-diff-count"><b>+128</b> <i>−9</i></span>}
          icon={<FolderOpen size={15} />}
          count={12}
          countSuffix="个文件"
          meta={<span className="kit-inline-status is-dim">main</span>}
          badge={<Badge variant="warning">含删除</Badge>}
          actions={
            <>
              <Button variant="subtle" size="xs">
                撤销
              </Button>
              <Button variant="secondary" size="xs">
                查看变更
              </Button>
            </>
          }
        >
          <NoticeFileList files={FILE_SAMPLE} workspacePath="D:\\workspace\\demo" onOpen={() => {}} />
        </NoticePanel>
      </Group>
    </Stack>
  );
}

/* ── 四种正文内容（迁移自对话页） ───────────────────────────────────────── */

export function SpecNoticeContents() {
  const [instruction, setInstruction] = useState("");
  const [answer, setAnswer] = useState("Pixel 8 Pro");
  return (
    <Stack gap={20}>
      <Group title="权限请求正文" hint="命令等宽预览 + 一段可选的「补充指令」输入 + 三个判定的横排按钮；busy 时全部禁用。">
        <NoticePanel label="权限请求" summary="执行 adb shell pm clear com.demo" icon={<ShieldAlert size={15} />} defaultExpanded>
          <NoticePermissionContent
            command="adb shell pm clear com.demo"
            environment="本机 · PowerShell"
            instruction={instruction}
            onInstructionChange={setInstruction}
            onResolve={() => {}}
          />
        </NoticePanel>
      </Group>

      <Group title="提问正文" hint="建议答案是横排 xs 按钮（aria-pressed 标记选中），下面还有一个自由输入框；回答为主、跳过为次。">
        <NoticePanel label="提问" summary="选择要安装的设备" icon={<Bot size={15} />} defaultExpanded>
          <NoticeQuestionContent
            options={["Pixel 8 Pro", "Pixel_Tablet_API_35", "R58M40ABCDE"]}
            value={answer}
            onChange={setAnswer}
            onAnswer={() => {}}
            onSkip={() => {}}
          />
        </NoticePanel>
      </Group>

      <Group title="后台任务正文" hint="标题 + 可滚动的等宽日志 + 停止按钮；running 时停止按钮常驻。">
        <NoticePanel label="后台任务" summary="Perfetto 采集" tone="warning" icon={<Clock size={15} />} defaultExpanded>
          <NoticeBackgroundTask
            title="perfetto -c perfetto.cfg -o trace.perfetto-trace"
            running
            log={"[00:00] 配置已下发\n[00:04] 缓冲区 64 MB\n[00:11] 正在写入 trace…"}
            onStop={() => {}}
          />
        </NoticePanel>
      </Group>

      <Group title="队列行" hint="队列项是一行：序号 · 内容预览 · 引导/编辑/删除；拖拽时整行半透明。">
        <Card>
          <CardBody>
            <Stack gap={4}>
              <NoticeQueueRow
                queueId="q1"
                content="再补一个 Logcat 过滤示例，只看 pid 2481 的日志"
                index={0}
                single={false}
                onGuide={() => {}}
                onEdit={() => {}}
                onRemove={() => {}}
                onMove={() => {}}
              />
              <NoticeQueueRow
                queueId="q2"
                content="顺便把 build 变体也列出来"
                index={1}
                single={false}
                onGuide={() => {}}
                onEdit={() => {}}
                onRemove={() => {}}
                onMove={() => {}}
                dragging
              />
            </Stack>
          </CardBody>
        </Card>
      </Group>

      <Group title="文件改动正文" hint="相对路径 + 状态色 + 行数；点击行打开预览，右键走 ContextMenu。">
        <Card>
          <CardBody>
            <NoticeFileList files={FILE_SAMPLE} workspacePath="D:\\workspace\\demo" onOpen={() => {}} />
          </CardBody>
        </Card>
      </Group>
    </Stack>
  );
}

/* ── 折叠规则 ───────────────────────────────────────────────────────────── */

export function SpecNoticeRules() {
  const [plan, setPlan] = useState(false);
  return (
    <Stack gap={20}>
      <Group title="折叠规则（受控）" hint="点同一行展开/收起，Esc 收起；点卡片外侧不收起——这些是用户主动打开的常驻行，不是浮层。">
        <Stack gap={8}>
          <NoticePanel
            label="任务编排"
            summary="4 个步骤"
            tone="attention"
            icon={<ListChecks size={15} />}
            expanded={plan}
            onExpandedChange={setPlan}
          >
            <Note>受控展开：expanded + onExpandedChange 由调用方持有状态。</Note>
          </NoticePanel>
          <Row>
            <Button variant="secondary" size="sm" onClick={() => setPlan(!plan)}>
              {plan ? "外部收起" : "外部展开"}
            </Button>
            <Checkbox label="当前展开" checked={plan} onChange={setPlan} />
          </Row>
        </Stack>
      </Group>

      <Group title="尺寸" hint="默认 36px 高；compact 28px（贴输入框）；inline 没有箭头、正文常显。">
        <Stack gap={8}>
          <NoticePanel label="默认" summary="36px 折叠态" icon={<Wrench size={15} />} />
          <NoticePanel label="compact" summary="28px 折叠态" icon={<Wrench size={15} />} compact />
        </Stack>
      </Group>

      <Group title="堆叠顺序" hint="多条通知同时存在时，越「要你动手」的越靠下（离输入框最近）：后台 < 计划 < 权限。">
        <Card>
          <CardBody>
            <Stack gap={6}>
              <NoticePanel label="后台任务" summary="Perfetto 采集 · 12s" tone="warning" icon={<Clock size={15} />} compact />
              <NoticePanel label="任务编排" summary="4 个步骤" tone="attention" icon={<ListChecks size={15} />} compact />
              <NoticePanel label="权限请求" summary="adb shell pm clear com.demo" icon={<ShieldAlert size={15} />} compact />
            </Stack>
          </CardBody>
        </Card>
      </Group>
    </Stack>
  );
}

/* ── 追加消息（ChatQueuePanel）─────────────────────────────────────────────
   对照 Android-Tool 会话页的两种形态：只有一条时是「一行胶囊」，抬头直接
   就是那条消息；多条时抬头换成「N 条追加消息等待中」+ 展开箭头，展开后是
   01/02 行列表。拖拽改顺序、引导/编辑/删除三个动作两种形态都在。 */
export function SpecChatQueue() {
  const [single, setSingle] = useState([
    { id: "s1", content: "再补一个 Logcat 过滤示例，只看 pid 2481 的日志" },
  ]);
  const [multi, setMulti] = useState([
    { id: "m1", content: "再补一个 Logcat 过滤示例，只看 pid 2481 的日志" },
    { id: "m2", content: "顺便把 build 变体也列出来，只要 release 和 debug" },
    { id: "m3", content: "最后跑一次全量测试再收尾" },
  ]);
  return (
    <Stack gap={20}>
      <Group title="单条" hint="只有一条排队消息：抬头就是那条消息本身，行尾是引导 / 编辑 / 删除。">
        <ChatQueuePanel
          items={single}
          onRemove={(id) => setSingle((list) => list.filter((item) => item.id !== id))}
        />
      </Group>
      <Group title="多条" hint="多条时抬头报「N 条追加消息等待中」+ 展开箭头；展开是 01/02 行列表，可拖拽改顺序。">
        <ChatQueuePanel
          items={multi}
          onRemove={(id) => setMulti((list) => list.filter((item) => item.id !== id))}
        />
      </Group>
    </Stack>
  );
}
