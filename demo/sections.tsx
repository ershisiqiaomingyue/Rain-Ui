import type { DemoSection } from "./types";
import { SpecColor, SpecType, SpecRadius, SpecMotion } from "./spec-foundation";
import { SpecButton, SpecInput, SpecSelect, SpecSwitch, SpecBadge, SpecSegmented, SpecFonts } from "./spec-form";
import {
  SpecCard,
  SpecDivider,
  SpecTable,
  SpecPropertyGrid,
  SpecListItem,
  SpecSessionTabs,
  SpecResizable,
  SpecComposed,
} from "./spec-layout";
import {
  SpecSpinner,
  SpecToast,
  SpecModal,
  SpecTooltip,
  SpecContextMenu,
  SpecProgressRing,
  SpecEmptyStates,
  SpecIconButtons,
} from "./spec-feedback";
import { SpecNoticeTypes, SpecNoticeContents, SpecNoticeRules, SpecChatQueue } from "./spec-notice";
import {
  SpecUsageMetrics,
  SpecCompaction,
  SpecTaskSteps,
  SpecAttachment,
  SpecFileChanges,
  SpecAccessMode,
  SpecChatComposition,
} from "./spec-chat";
import { SpecToolIcon, SpecBorderGlow, SpecBoot, SpecFocus, SpecIconRail } from "./spec-app";

export const SECTIONS: DemoSection[] = [
  /* ── 基础 ─────────────────────────────────────────────────────────── */
  {
    id: "tokens-color",
    title: "色彩令牌",
    note: "同一套 token 亮暗各一份值；组件只引用 token，不写死颜色。",
    group: "foundation",
    render: () => <SpecColor />,
  },
  {
    id: "tokens-type",
    title: "排版",
    note: "全库只有一档 display（20px 页面标题），正文 13px，下限 11px。",
    group: "foundation",
    render: () => <SpecType />,
  },
  {
    id: "tokens-radius",
    title: "圆角与间距",
    note: "四档圆角：控件 6 / 面板 10 / 浮层 14 / 胶囊 full。间距走 4px 基数。",
    group: "foundation",
    render: () => <SpecRadius />,
  },
  {
    id: "tokens-motion",
    title: "动效与焦点",
    note: "位移不超过 8px、时长 120–220ms、只做一次；键盘焦点必须有可见环。",
    group: "foundation",
    render: () => <SpecMotion />,
  },

  /* ── 表单 ─────────────────────────────────────────────────────────── */
  { id: "button", title: "Button 按钮", note: "7 变体 × 4 尺寸；一屏只放一个 primary。", group: "form", render: () => <SpecButton /> },
  { id: "input", title: "Input 输入", note: "sunken / surface 两种底；前缀图标、清空、尾随动作。", group: "form", render: () => <SpecInput /> },
  { id: "select", title: "Select 选择", note: "portal 菜单，可搜索，支持 header / footer 插槽。", group: "form", render: () => <SpecSelect /> },
  { id: "switch", title: "Switch / Checkbox 开关", note: "轨道 32×18；indeterminate 走 DOM 属性并同步 aria-checked。", group: "form", render: () => <SpecSwitch /> },
  { id: "badge", title: "Badge 状态", note: "variant 决定语义色；pulse 只给真实时变化的状态。", group: "form", render: () => <SpecBadge /> },
  { id: "segmented", title: "SegmentedControl 分段", note: "同一列表的不同排法，不留 URL；和 tab 不是一件事。", group: "form", render: () => <SpecSegmented /> },
  { id: "fonts", title: "字体选择", note: "15 个界面字体 + 10 个等宽字体，逐项预览，选中即生效。", group: "form", render: () => <SpecFonts /> },

  /* ── 布局 ─────────────────────────────────────────────────────────── */
  { id: "card", title: "Card 卡片", note: "tone 决定层级；只有 interactive 才允许悬停反馈。", group: "layout", render: () => <SpecCard /> },
  { id: "divider", title: "Divider 分割", group: "layout", render: () => <SpecDivider /> },
  { id: "table", title: "Table 表格", note: "表头 12px 常体 + 1px 行线 + 外框；数字列等宽右对齐。", group: "layout", render: () => <SpecTable /> },
  { id: "property-grid", title: "PropertyGrid 属性", note: "键值对网格；valueType 只标状态色，不上色整行。", group: "layout", render: () => <SpecPropertyGrid /> },
  { id: "list-item", title: "ListItem 列表行", note: "leading / title / meta / description / actions 五个插槽。", group: "layout", render: () => <SpecListItem /> },
  { id: "session-tabs", title: "SessionTabs 会话标签", group: "layout", render: () => <SpecSessionTabs /> },
  { id: "resizable", title: "ResizablePane 分栏", note: "拖拽分隔条、宽度持久化；双击复位。", group: "layout", render: () => <SpecResizable /> },
  { id: "composed", title: "组合示例", note: "用卡片 + 表格 + 属性网格拼一块真实面板。", group: "layout", render: () => <SpecComposed /> },

  /* ── 反馈 ─────────────────────────────────────────────────────────── */
  { id: "spinner", title: "Spinner 加载", note: "全库唯一的旋转图形，自带 reduced-motion 降级。", group: "feedback", render: () => <SpecSpinner /> },
  { id: "toast", title: "Toast 轻提示", note: "一个 Provider 管全站堆栈，最多同时 3 条。", group: "feedback", render: () => <SpecToast /> },
  { id: "modal", title: "Modal 弹窗", note: "普通 / 危险确认 / 执行中三种形态，Esc 关闭。", group: "feedback", render: () => <SpecModal /> },
  { id: "tooltip", title: "Tooltip 提示", note: "悬停或键盘聚焦才出现；图标按钮必须配一个。", group: "feedback", render: () => <SpecTooltip /> },
  { id: "context-menu", title: "ContextMenu 右键菜单", note: "方向键移动、Enter 选中、Esc 归还焦点。", group: "feedback", render: () => <SpecContextMenu /> },
  { id: "progress-ring", title: "ProgressRing 环形进度", note: "70% 转警告、90% 转危险；null 是未知不是 0。", group: "feedback", render: () => <SpecProgressRing /> },
  { id: "empty", title: "ToolEmptyState 空状态", note: "一句话说清为什么空 + 下一步；不画插画。", group: "feedback", render: () => <SpecEmptyStates /> },
  { id: "icon-buttons", title: "图标按钮", note: "同一行尺寸一致，只有一项可以是强调色。", group: "feedback", render: () => <SpecIconButtons /> },

  /* ── 对话（09 通知面板） ───────────────────────────────────────────── */
  { id: "notice-types", title: "NoticePanel 通知面板 · 六种类型", note: "权限 / 提问 / 计划 / 后台 / 队列 / 文件改动，共用一套外壳。", group: "chat", render: () => <SpecNoticeTypes /> },
  { id: "notice-contents", title: "NoticePanel · 四种正文", note: "权限命令预览、提问选项、后台日志、队列行、文件列表。", group: "chat", render: () => <SpecNoticeContents /> },
  { id: "notice-rules", title: "NoticePanel · 折叠与堆叠", note: "点同一行展开 / Esc 收起 / 点外侧不收起；越要动手越靠下。", group: "chat", render: () => <SpecNoticeRules /> },
  { id: "chat-queue", title: "ChatQueuePanel 追加消息", note: "单条=一行胶囊；多条=「N 条追加消息等待中」+ 可展开列表。可拖拽改顺序。", group: "chat", render: () => <SpecChatQueue /> },
  { id: "usage-metrics", title: "UsageMetrics 用量条", note: "对话输入框底部那一行：label + 加粗数值 + 竖分割线。", group: "chat", render: () => <SpecUsageMetrics /> },
  { id: "compaction", title: "CompactionProgress 压缩", note: "运行与完成是同一条，只换图标，位置不跳。", group: "chat", render: () => <SpecCompaction /> },
  { id: "task-step", title: "TaskStepList 步骤", note: "5 种状态，20px 圆；chip 标注目标对象。", group: "chat", render: () => <SpecTaskSteps /> },
  { id: "attachment", title: "Attachment 附件", note: "row / tile 两形态，按扩展名分类图标。", group: "chat", render: () => <SpecAttachment /> },
  { id: "file-change", title: "FileChangeCard / Diff / Preview", note: "回合结束的改动卡片、统一 diff 正文、文件预览面板。", group: "chat", render: () => <SpecFileChanges /> },
  { id: "access-mode", title: "AccessModeMenu 权限模式", note: "这是权限模式不是沙盒；full 必须写明「无隔离」。", group: "chat", render: () => <SpecAccessMode /> },
  { id: "chat-composition", title: "对话内组合", note: "步骤 → 压缩 → 改动卡片 → 用量条，垂直节奏 12px。", group: "chat", render: () => <SpecChatComposition /> },

  /* ── 应用级 ───────────────────────────────────────────────────────── */
  { id: "tool-icon", title: "ToolIcon 工具图标", note: "36px 方块 + 单色描边图标，不允许每个倒一种颜色。", group: "app", render: () => <SpecToolIcon /> },
  { id: "border-glow", title: "BorderGlow 边框光", note: "跟随指针的 1 处高光；只在可交互卡片上用。", group: "app", render: () => <SpecBorderGlow /> },
  { id: "boot", title: "BootScreen 启动屏", note: "纯 logo + 呼吸，不写「正在加载」文案。", group: "app", render: () => <SpecBoot /> },
  { id: "focus", title: "焦点与键盘", note: "全局焦点环 2px 强调色 + 2px 偏移；不用背景色冒充焦点。", group: "app", render: () => <SpecFocus /> },
  { id: "icon-rail", title: "图标导航栏", note: "56px 竖栏，图标 + tooltip；选中态是中性底不是彩色。", group: "app", render: () => <SpecIconRail /> },
];
