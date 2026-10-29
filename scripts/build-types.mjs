/**
 * 类型打包：把 tsc 产出的 dist/types/**\/*.d.ts 原样平移到 dist/**\/*.d.ts。
 *
 * 为什么不直接把 tsc 输出到 dist：vite build 会 emptyOutDir，把先写进去的类型清掉。
 * 所以顺序固定为 vite build → 本脚本。必须最后执行，否则 package.json 的
 * "types": "./dist/index.d.ts" 会指向一个不存在的文件（消费端直接 red squiggle）。
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const tmp = resolve(root, "dist/types");
const out = resolve(root, "dist");

execFileSync(process.execPath, [resolve(root, "node_modules/typescript/bin/tsc"), "-p", "tsconfig.build.json"], {
  cwd: root,
  stdio: "inherit",
});

if (!existsSync(tmp)) throw new Error("tsc 没有产出 dist/types");

/** 递归复制 .d.ts，并把它所在目录的 import 路径保持不变（结构一致即可）。 */
cpSync(tmp, out, {
  recursive: true,
  filter: (src) => statSync(src).isDirectory() || src.endsWith(".d.ts"),
});

/** 把 dist/types 里每个 .d.ts 都搬一份到 dist 下的对应位置。 */
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!name.endsWith(".d.ts")) continue;
    const rel = full.slice(tmp.length + 1);
    const target = join(out, rel);
    cpSync(full, target);
  }
}
walk(tmp);

/** 消费端按 package.json 的 "types": "./dist/index.d.ts" 找，所以必须每次都重写。 */
const entry = join(out, "index.d.ts");
const fromSrc = join(tmp, "src/index.d.ts");
if (!existsSync(fromSrc)) throw new Error("找不到 dist/types/src/index.d.ts");
cpSync(fromSrc, entry);
/* 提升后相对路径少一层：../assets → ./assets, ../components → ./components, ./lib → ./types/src/lib */
const text = readFileSync(entry, "utf8")
  .replace(/from "\.\.\/assets\//g, 'from "./assets/')
  .replace(/from "\.\.\/components\//g, 'from "./components/')
  .replace(/from "\.\/lib"/g, 'from "./types/src/lib"');
writeFileSync(entry, text);

/** 声明文件里的 `import "x.css"` 只剩副作用语义，vite 已把样式抽到 rain-ui.css；
 *  留着会让消费端 tsc 去解析 .css 并报 Cannot find module。统一删掉。 */
function stripCss(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { stripCss(full); continue; }
    if (!name.endsWith(".d.ts")) continue;
    const before = readFileSync(full, "utf8");
    const after = before.replace(/^import\s+"[^"]+\.css";\r?\n/gm, "");
    if (after !== before) writeFileSync(full, after);
  }
}
stripCss(out);
console.log("dist/index.d.ts + dist/**/*.d.ts  已就位");
