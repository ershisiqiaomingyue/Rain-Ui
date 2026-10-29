/**
 * rain-ui — Android Toolkit 的 UI 组件库。
 *
 * 组件只依赖 react、react-dom、clsx、lucide-react，不引用 Tauri、不读业务 store。
 * 样式全部收在 `rain-ui/styles.css`（dist/rain-ui.css，源头是 assets/styles/index.css
 * 的 @import 链）：使用方引这一次即可，组件本身不各自 import css。
 *
 * 主题：`<html data-theme="light">` / `"dark"`（默认 dark，见 tokens.css）。
 */

/* ── 全局样式 ──────────────────────────────────────────────────────────────
   样式统一由 `import "rain-ui/styles.css"` 引入（构建产物 dist/rain-ui.css，
   见 scripts/build-css.mjs）。这里不再单独 import 各个全局 css —— 否则和
   styles.css 的 @import 链重复加载，dev 下同一样式注入两遍、HMR 也变得不可靠。
   README「使用」一节即此契约：styles.css 只需引一次。 */
/* ── 设计系统原语 ────────────────────────────────────────────────────────── */
export * from "../components/ui";

/* ── 独立功能组件 ────────────────────────────────────────────────────────── */
export * from "../components/ConfirmDialog/ConfirmDialog";
export * from "../components/ConfirmDialog/useConfirmAction";
export * from "../components/RenameDialog/RenameDialog";
export * from "../components/ToolIcon/ToolIcon";
export * from "../components/BorderGlow/BorderGlow";
export * from "../components/BootScreen/BootScreen";

/* ── 可调分栏 ────────────────────────────────────────────────────────────── */
export * from "../components/ResizablePane/PaneResizeHandle";
export * from "../components/ResizablePane/PaneHeightResizeHandle";
export * from "../components/ResizablePane/usePaneWidth";
export * from "../components/ResizablePane/usePaneHeight";
export * from "../components/ResizablePane/paneWidth";

/* ── 浏览器可用的平台适配层（字体、主题、错误文案） ───────────────────────── */
export * from "./lib";
