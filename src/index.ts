// UI Components - shadcn / Apple HIG style
// Terminal 自有 kit（Card/Badge/Table/Checkbox/Spinner/Tooltip/Modal/Toast 等）。
// 注意：kit 的 Button/Input/Select/Switch 已由下方 shadcn 版本取代（default 尺寸 32px）。
export * from "../components/ui"

// shadcn 基础组件（与 kit 重名的 badge/card/checkbox/context-menu/spinner/step-spinner/table/tooltip 不导出）
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
export * from "./components/composed/segmented-control"
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


