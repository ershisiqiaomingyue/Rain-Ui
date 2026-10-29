# rain-ui

Android Toolkit 沉淀出来的 React 组件库：一套 token、一批控件、一组对话/通知组件，
亮暗双主题，桌面工具类应用可以直接拿来搭界面。

- React 18 / 19，**只依赖** `react`、`react-dom`、`clsx`、`lucide-react`
- 不引用 Tauri、不读业务 store、不含路由 —— 纯展示层
- 样式是手写 CSS + 一层 token 变量，没有 Tailwind / CSS-in-JS / 组件框架
- 117 KB CSS（gzip 19.7 KB），字体走系统栈，不额外加载

## 看效果

| 方式 | 命令 | 地址 |
| --- | --- | --- |
| 开发预览（HMR，看源码改动） | `npm run dev` | <http://127.0.0.1:5280> |
| 构建后静态站（就是发布形态） | `npm run build:demo` → `npm run preview` | <http://127.0.0.1:5281> |

演示站有 42 个用例，左侧按分组列出可点目录，左下角切亮/暗。

## 安装

```bash
# 同一台机器上的兄弟项目
npm i ../rain-ui
# 或者 pnpm
pnpm add file:../rain-ui
```

`package.json` 里会写成：

```json
{
  "dependencies": {
    "rain-ui": "file:../rain-ui"
  }
}
```

改完库代码后重新 `npm run build`，引用方重新 `npm i` 即可（也可以先 `npm link`）。

## 使用

```tsx
import { Button, Input, Card, ToastProvider, useToast } from "rain-ui";
import "rain-ui/styles.css"; // 只需一次，通常在 main.tsx

export function App() {
  return (
    <ToastProvider>
      <Card>
        <Input placeholder="搜索设备" clearable />
        <Button variant="primary">开始采集</Button>
      </Card>
    </ToastProvider>
  );
}
```

主题挂在 `<html>` 上：

```ts
document.documentElement.setAttribute("data-theme", "dark"); // 或 "light"
```

也可以直接用库里的主题/字体工具：

```ts
import { readAppTheme, setAppTheme, toggleAppTheme, subscribeAppTheme } from "rain-ui";
```

## 组件清单

| 分组 | 组件 |
| --- | --- |
| 表单 | `Button` `Input` `Select` `Switch` `Checkbox` `SegmentedControl` `Badge` |
| 布局 | `Card`(`CardHeader/CardBody/CardFooter`) `Divider` `Table` `PropertyGrid` `ListItem` `SessionTabs` `ResizablePane` |
| 反馈 | `Spinner` `StepSpinner` `Toast` `Modal` `Tooltip` `ContextMenu` `ProgressRing` `TaskStepList` `NoticePanel`(含 `NoticeQueueRow` / `NoticeFileList`) `CompactionProgress` `ToolEmptyState` `ToolBackButton` |
| 对话 | `UsageMetrics` `Attachment` `FileChangeCard` `FileChangeNotice` `FileDiffView` `FilePreviewPanel` `AccessModeMenu` |
| 应用级 | `BootScreen` `BorderGlow` `ToolIcon` `ConfirmDialog` `RenameDialog` |

演示站的 42 个用例覆盖了上面全部组件与状态：tokens（色/字/圆角/间距/动效）、
表单的每个变体与禁用/加载/只读态、表格与属性网格、通知面板的 6 种类型 × 4 种正文 ×
折叠堆叠、用量条、压缩进度、步骤列表、附件、文件改动/差异/预览、权限模式、图标导航栏、
焦点与键盘、以及一个把卡片 + 表格 + 属性网格拼起来的真实面板。

本地跑 `npm run dev` 打开 <http://127.0.0.1:5280> 可以逐个看组件（亮/暗切换在左下角，左侧目录按分组列出 42 个用例，可搜索）。

## 目录

```
rain-ui/
├─ assets/styles/        # tokens.css / index.css / typography.css / ambient.css / fonts.css
├─ components/           # 组件源码（css 与 tsx 同目录）
├─ src/index.ts          # 库入口：汇总导出 + 全局样式顺序
├─ src/lib/              # 浏览器可用的适配层：主题、字体、错误文案
├─ demo/                 # 演示站（不进包）
├─ app-src/              # 从 Android Toolkit 拷来的应用级外壳，仅作参考，不导出
└─ dist/                 # npm run build 产物
```

## 两个构建产物

| 文件 | 说明 |
| --- | --- |
| `dist/rain-ui.js` / `.cjs` | ESM / CJS 两份代码，`react`、`lucide-react` 等留在外部 |
| `dist/rain-ui.css` | 合并后的全部样式（117 KB / gzip 20 KB） |
| `dist/index.d.ts` | 类型入口（109 个 .d.ts，指向 `dist/components` 与 `dist/types`） |
| `dist/components/**` | 46 个独立入口，可按需深层引入 |
| `dist-demo/**` | 演示站的静态产物（`npm run build:demo`），不进 npm 包 |

## 字体

默认走系统字体栈（`-apple-system` / `Segoe UI Variable` / `Microsoft YaHei UI` …），
产品界面用这一档就够，安装包轻。

`assets/fonts/` 里另有 18 个 woff2（思源黑体 / 思源宋体 / 霞鹜文楷 / Inter / Lato / JetBrains Mono …，
约 28 MB），对应 `assets/styles/fonts.css` 的 `@font-face` 声明。它们**不进 npm 包**
（`files` 只含 `dist`，28 MB 字体重打包不划算），需要用自带字体时从仓库里拷走
`assets/fonts/` 与 `assets/styles/fonts.css` 两处，自己引一次即可。
字体选择器的选项表本身在库里：`APP_FONT_OPTIONS` / `APP_MONO_FONT_OPTIONS`，
选中后由 `setAppFont` / `setAppMonoFont` 写进 CSS 变量。

## 设计约束（改样式前先看这段）

层级之所以会"乱"，通常不是某一个组件丑，而是同一种东西有很多个差不多的取值。
所以这里只允许三套阶梯，新样式一律引用 token，不写裸数字：

| 阶梯 | 档位 | 说明 |
| --- | --- | --- |
| 字号 | `--text-display` 20 · `--text-title` 16 · `--text-body` 13 · `--text-label` 12 · `--text-meta` 11 | 全库 5 档，最低 11px。不要再用 10 / 10.5 / 11.5 / 12.5 / 13.5 这类中间值 |
| 圆角 | `--radius-control` 6 · `--radius-panel` 10 · `--radius-overlay` 14 · `--radius-full` 9999 | 控件 / 面板 / 浮层 / 胶囊四档。7、8、9、12、16、18 一律不用 |
| 层级 | `--z-raised` 10 · `--z-sticky` 40 · `--z-menu` 60 · `--z-overlay` 70 · `--z-popover` 80 · `--z-toast` 90 | 浮层不许再写裸 z-index，否则同层级的两个浮层谁盖谁全靠运气 |

一屏只放**一个** primary 按钮；强调色只用于当前项、链接、焦点环，不用来铺底。

## 开发

```bash
npm run dev         # 演示站（HMR）http://127.0.0.1:5280
npm run typecheck   # tsc --noEmit
npm run build       # 库产物 → dist/
npm run build:demo  # 演示站静态产物 → dist-demo/（npm run preview 可预览）
node scripts/sync-monolith.mjs  # 校验 index.css 的 @import 是否覆盖所有组件 css
```

### 样式改动要注意

`assets/styles/index.css` 是**样式总入口**，里面是一串真正的 `@import`：

```css
/* ---- 全局 ---- */
@import "./tokens.css";
@import "./typography.css";
@import "./ambient.css";
@import "./base.css";
/* ---- 组件 ---- */
@import "../../components/Button/button.css";
@import "../../components/ui/notice-panel.css";
/* …每个组件一条… */
```

所以**直接改 `components/**/*.css` 就会热更新**，不需要再跑任何同步脚本——每个组件 css
都是独立文件，Vite 原生 watch 并热替换。这正是之前「改样式不热更新 / 页面灰蒙蒙」的根治：
以前 index.css 是各组件 css 的**内联副本**，改源文件它不变，且反复整表重写会让 Vite 的
CSS HMR 打补丁失败。

- **组件不再各自 `import "xxx.css"`**，`src/index.ts` 也不再单独 import 全局 css ——
  样式统一由 `import "rain-ui/styles.css"` 提供一次，避免同一份 css 被重复加载。
- 新增组件 css 时，记得在 `index.css` 里补一条 `@import`；`npm run dev` / `npm run build`
  前会自动跑 `scripts/sync-monolith.mjs` 校验，漏了会直接报错。
- `scripts/build-css.mjs` 里有选择器完整性闸门，漏了会直接构建失败。

## 已知取舍

- 组件样式依赖 `html[data-theme]`，宿主必须设置这个属性，否则只有深色变量生效。
- `demo/` 与 `app-src/` 不进 npm 包（`files` 只含 `dist`）。
- 焦点环统一用 `outline: 2px solid var(--accent-primary)`，覆盖了原应用"焦点=选中态"的做法。
- `app-src/` 里的设置面板、侧栏、顶栏依赖 Tauri 命令与业务 store，只作迁移参考，不导出。
- `tokens.css` 里仍保留了上游的渐变卡片底、静止态重投影等写法，尚未按上面的阶梯清理；
  换皮时优先改 token，不要去逐个组件打补丁。
