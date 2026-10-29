/**
 * 样式打包：把 assets/styles/index.css 及其 @import 链编译成单文件 CSS。
 *
 * 不交给 Vite：lib 模式下的多入口 CSS 合并会丢规则（@import 解析顺序不稳），
 * 这里用 esbuild 直接 bundle，规则一条不少。
 */
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from "node:fs";
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
  ".segmented-glass",
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
  ".rename-dialog-input",
  ".ui-list-item",
  ".ui-notice",
  ".ui-usage",
  ".ui-toast",
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
  "--bg-canvas",
  "--font-mono",
];
const missing = REQUIRED.filter((sel) => !css.includes(sel));
if (missing.length) {
  throw new Error(`产物缺少 ${missing.length} 个选择器：${missing.join(", ")}`);
}
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, css);
rmSync(resolve(root, ".css-build"), { recursive: true, force: true });
console.log(`dist/rain-ui.css  ${(css.length / 1024).toFixed(1)} kB`);
