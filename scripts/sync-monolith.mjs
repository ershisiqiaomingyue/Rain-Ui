/**
 * 样式入口完整性检查（原 sync-monolith 已退役）。
 *
 * 历史：assets/styles/index.css 曾经是「单体文件」——每个组件的 css 都被整段
 * 内联复制进去，两个 `/* ---- xxx.css ---- *\/` 标记之间。改组件 css 之后必须再跑
 * 本脚本把副本重写回去，否则 dev/产物里还是旧样式;而反复整表重写又会让 Vite 的
 * CSS HMR 打补丁失败、页面卡在坏状态 —— 这就是「改样式不热更新 / 灰蒙蒙」的根。
 *
 * 现在 index.css 改成真正的 `@import`，每个组件 css 都是独立文件，Vite 原生
 * 监听并热更新。本脚本于是只剩一个职责：**检查 @import 是否覆盖了所有组件 css**，
 * 漏一个就直接报错（防止新加组件忘了登记）。
 *
 * 用法：node scripts/sync-monolith.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, relative, join } from "node:path";

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const indexPath = resolve(root, "assets/styles/index.css");
const index = readFileSync(indexPath, "utf8");

const imported = new Set();
for (const m of index.matchAll(/@import\s+"([^"]+)"/g)) {
  imported.add(resolve(root, "assets/styles", m[1]));
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (full.endsWith(".css")) acc.push(full);
  }
  return acc;
}
const componentCss = walk(resolve(root, "components"));

const missing = componentCss.filter((f) => !imported.has(f));
if (missing.length) {
  console.error(`index.css 缺少 ${missing.length} 个组件样式的 @import：`);
  for (const f of missing) console.error("  " + relative(root, f).replace(/\\/g, "/"));
  process.exit(1);
}
console.log(`@import 完整性检查通过：${imported.size} 条 @import 覆盖全部 ${componentCss.length} 个组件 css。`);
