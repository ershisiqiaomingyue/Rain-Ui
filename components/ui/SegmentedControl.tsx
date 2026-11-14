/**
 * 兼容子路径：`rain-ui/components/ui/SegmentedControl`（package.json 里挂着的那个）。
 *
 * 真正的实现在 `src/components/composed/segmented-control.tsx`——Tabs 的受控封装。
 * 这里只转一手，不再自建一套 `.segmented-glass` / `.seg-btn` 的 DOM 和 CSS：
 * 那套样式已经删了（见 Switch/switch.css 的注释），留着这个文件是为了让
 * 老的子路径 import 仍然可用，且拿到的和根导出是同一个组件。
 *
 * 为什么不在 `components/ui/index.ts` 里也导出一份：根 barrel 已经
 * `export * from "./components/composed/segmented-control"`，两处同名导出会互相
 * 遮蔽（ESM 里等于谁都没有），所以只在这个子路径文件里转出。
 */
export { SegmentedControl } from "../../src/components/composed/segmented-control"
export type {
  SegmentedControlProps,
  SegmentedOption,
} from "../../src/components/composed/segmented-control"
