/**
 * 样式打包：把 assets/styles/index.css 及其 @import 链编译成单文件 CSS。
 *
 * 不交给 Vite：lib 模式下的多入口 CSS 合并会丢规则（@import 解析顺序不稳），
 * 这里用 esbuild 直接 bundle，规则一条不少。
 */
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const out = resolve(root, "dist/rain-ui.css");

const result = await build({
  entryPoints: [resolve(root, "assets/styles/index.css")],
  bundle: true,
  write: false,
  minify: true,
  loader: { ".css": "css" },
  outdir: resolve(root, ".css-build"),
  logLevel: "warning",
});

const css = result.outputFiles.find((f) => f.path.endsWith(".css"))?.text ?? "";
if (!css) throw new Error("esbuild 没有产出 CSS");

/**
 * 完整性闸门：每个组件样式文件里「第一条类选择器」必须在产物中出现。
 * 少一个就构建失败——lib 模式静默丢规则的问题不能再靠肉眼发现。
 */
const REQUIRED = [
  ".btn",
  ".desk-input",
  ".modern-select",
  ".switch-wrapper",
  ".badge",
  // `.segmented-glass` 不在这里了：分段控件已经是 Tabs 的受控封装
  // （src/components/composed/segmented-control.tsx），库不再输出那套 class。
  ".card",
  ".card-header",
  ".desk-table",
  ".divider-h",
  ".property-grid",
  ".session-tab",
  ".tool-page-back-button",
  ".tool-empty-state",
  ".tool-icon",
  ".boot-screen",
  ".confirm-dialog-modal",
  ".ui-list-item",
  ".ui-notice",
  ".ui-usage",
  ".ui-modal",
  ".ui-tooltip",
  ".context-menu",
  ".ui-ring-control",
  ".ui-spinner",
  ".ui-compaction",
  ".ui-attachment",
  ".ui-file-change",
  ".ui-file-diff",
  ".ui-preview",
  ".task-step-list",
  ".ui-access-menu",
  ".ambient-blob",
  ".code-viewer-pane-resizer",
  ".pane-height-resizer",
  "--font-mono",
  "--background",
  "--primary-foreground",
  "--muted-foreground",
  "--destructive-foreground",
  "--ring",
  "--radius",
  "--terminal-red",
];
const missing = REQUIRED.filter((sel) => !css.includes(sel));
if (missing.length) {
  throw new Error(`产物缺少 ${missing.length} 个选择器：${missing.join(", ")}`);
}
mkdirSync(dirname(out), { recursive: true });

/* ── 库组件的 tailwind 工具类预编译 ───────────────────────────────────────
   shadcn 层的组件用 tailwind 类写样式，此前依赖消费方的 tailwind 扫描
   node_modules/rain-ui/dist 生成——但消费方的 dev JIT 可能编译不了任意变体
   （实测 3.4.19 某些安装下 dev 与 build 行为不一致），整批类静默丢失。
   独立跑 tailwind（CLI / postcss 编程接口）在同类安装下同样提取不到变体，
   只有 vite 的 demo 构建管线是完整的。所以 build 链先跑 build:demo，
   这里从 dist-demo 的产物里取编译好的工具类 CSS 追加到 rain-ui.css 末尾
   （token 定义在前，工具类引用 var() 顺序正确；demo 专属类是冗余但无害）。
   消费方 `import "rain-ui/styles.css"` 即得到完整样式，不依赖其 tailwind 扫描。 */
const demoAssets = resolve(root, "dist-demo/assets");
const demoCssFile = readdirSync(demoAssets).find((f) => f.endsWith(".css"));
if (!demoCssFile) throw new Error("dist-demo 里没有 CSS：先跑 npm run build:demo");
const utilities = readFileSync(resolve(demoAssets, demoCssFile), "utf8");

writeFileSync(out, css + "\n" + utilities);
rmSync(resolve(root, ".css-build"), { recursive: true, force: true });
console.log(`dist/rain-ui.css  ${(css.length / 1024).toFixed(1)} kB + 工具类 ${(utilities.length / 1024).toFixed(1)} kB`);

/* Tailwind 词表跟着进 dist：消费方（Android-Toolkit）通过 `rain-ui/tailwind-preset`
   引它，而 package.json 的 files 只有 dist，node_modules/rain-ui 里看不到仓库根目录。
   漏复制的话宿主那边报的是「找不到模块」，跟「值不对」完全是两回事，很难往这儿想。 */
cpSync(resolve(root, "tailwind-preset.cjs"), resolve(root, "dist/tailwind-preset.cjs"));
console.log("dist/tailwind-preset.cjs");
