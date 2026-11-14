// UI Components - shadcn / Apple HIG style
// Terminal 自有 kit（Card/Badge/Table/Checkbox/Spinner/Tooltip/Modal/Portal 等）。
// 注意：kit 的 Button/Input/Select/Switch 已由下方 shadcn 版本取代（default 尺寸 32px）。
export * from "../components/ui"
// shadcn Card 以别名导出：kit 的 Card（CSS 版）仍被旧视图使用，迁移完成后统一移除。
export { Card as UICard } from "./components/ui/card"
// shadcn Badge 顶掉 kit 的 CSS 版（原 StatusBadge 已并进来）：`export *` 的星号导出
// 会被上面这条显式导出遮住，所以 `Badge` 这个名字从此走 cva 版（带 dot / radius）。
export { Badge, badgeVariants, type BadgeProps } from "./components/ui/badge"

// shadcn 基础组件（与 kit 重名的 card/checkbox/context-menu/spinner/step-spinner/table/tooltip 不导出）
export * from "./components/ui/accordion"
export * from "./components/ui/alert-dialog"
export * from "./components/ui/alert"
export * from "./components/ui/avatar"
export * from "./components/ui/hover-card"
export * from "./components/ui/progress"
export * from "./components/ui/button-group"
export * from "./components/ui/button"
export * from "./components/ui/combobox"
export * from "./components/ui/command"
export * from "./components/ui/dialog"
export * from "./components/ui/dropdown-menu"
export * from "./components/ui/empty"
export * from "./components/ui/field"
export * from "./components/ui/input-group"
export * from "./components/ui/input"
export * from "./components/ui/item"
export * from "./components/ui/label"
export * from "./components/ui/menubar"
export * from "./components/ui/pagination"
export * from "./components/ui/popover"
export * from "./components/ui/radio-group"
export * from "./components/ui/resizable"
export * from "./components/ui/scroll-area"
export {
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/ui/select"
// options 式 Select（options/onChange/footer 等 API），trigger 默认 32px
export * from "./components/ui/select-menu"
// composed 组合件：模型/供应商选择器、上下文用量环、状态徽标、任务状态行、
// 权限请求条、输入框通知坞、终端范围滑块、用量指标条。
// 统计面板三件套（指标卡 / 排行行 / 数据表）与它们的配色接口（tone）。
export * from "./components/composed/stat-tile"
export * from "./components/composed/rank-bar"
export * from "./components/composed/data-table"
export * from "./components/composed/daily-heatmap"
export * from "./components/composed/tone-dot"
export * from "./components/composed/constellation"
export * from "./lib/tone"
export * from "./components/composed/model-provider-picker"
export * from "./components/composed/context-usage-ring"
export * from "./components/composed/radial-progress"
export * from "./components/composed/composer-notice-dock"
export * from "./components/composed/permission-request-bar"
export * from "./components/composed/task-status-row"
export * from "./components/composed/terminal-range-slider"
// 与 kit 的 UsageMetrics 同名类型（UsageMetric）冲突，显式导出让组合件这份胜出。
export {
  UsageMetricsStrip,
  type UsageMetric,
  type TokenUsageBreakdown,
  type UsageMetricsStripProps,
} from "./components/composed/usage-metrics-strip"
// 注意：composed/compaction-progress 不导出。它与 kit 的 CompactionProgress 同名，
// 而 kit 那份多了 `variant="row"`（时间线行内样式），demo 与 Android-Toolkit 都在用；
// 让 Tailwind 版把它顶掉会直接丢样式。组合件那份先留在库里当草稿。
export * from "./components/icons/AppIcon"
// ProviderLogo 的数据与类型（IMAGE_MARKS / ProviderMark / ProviderMarkId）
export * from "./components/icons/provider-marks"
// ButtonGroup 的官方组合演示块（demo 与宿主的「预设组合」都直接用它）
export * from "./components/ui/button-group-demo"
// 模型服务商品牌标：Android-Toolkit Settings→Agent 同源的十五枚资产 base64 内联
// （九家服务商 + WorkBuddy 六枚），单色品牌蒙版 + 墨色底跟随主题。
export * from "./components/icons/ProviderLogo"
export * from "./components/composed/segmented-control"
// 可展开条目：整行可点开合，收起态一行、展开态按用途换设计。
// 壳 + 四套展开形态（配置表单 / 只读信息 / 下载更新 / 单选切换）。
export * from "./components/composed/expandable-item"
export * from "./components/composed/tool-item"
export * from "./components/composed/tool-info-item"
export * from "./components/composed/tool-update-item"
export * from "./components/composed/tool-choice-item"
export * from "./components/ui/separator"
export * from "./components/ui/slider"
export * from "./components/ui/reasoning-effort"
export * from "./components/ui/sheet"
export * from "./components/ui/sidebar"
export * from "./components/ui/skeleton"
export * from "./components/ui/sonner"
export * from "./components/ui/switch"
export * from "./components/ui/tabs"
export * from "./components/ui/textarea"
export * from "./components/ui/toggle"
export * from "./lib/utils"
export {
  APP_FONT_OPTIONS,
  APP_MONO_FONT_OPTIONS,
  applyAppFont,
  applyAppMonoFont,
  getAppFontStack,
  getAppMonoFontStack,
  readAppFont,
  readAppMonoFont,
  setAppFont,
  setAppMonoFont,
  subscribeAppFont,
  subscribeAppMonoFont,
  type AppFont,
  type AppMonoFont,
} from "./lib/font"



