import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

function componentEntries() {
  const root = resolve(__dirname, "components");
  const entries: Record<string, string> = {};
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = resolve(dir, name);
      if (statSync(full).isDirectory()) { walk(full); continue; }
      if (!/\.tsx?$/.test(name) || /\.d\.ts$/.test(name) || /\.test\./.test(name)) continue;
      const rel = full.slice(root.length + 1).replace(/\\/g, "/").replace(/\.tsx?$/, "");
      entries[`components/${rel}`] = full;
    }
  };
  walk(root);
  return entries;
}

const ALIAS = [
  { find: /^@\//, replacement: resolve(__dirname, "src/") + "/" },
  { find: /^rain-ui$/, replacement: resolve(__dirname, "src/index.ts") },
  { find: /^rain-ui\/styles\.css$/, replacement: resolve(__dirname, "assets/styles/index.css") },
  { find: /^rain-ui\/fonts\.css$/, replacement: resolve(__dirname, "assets/styles/fonts.css") },
];

export default defineConfig(({ command, mode }) => {
  /* 演示站的静态产物：npm run build:demo。
     Vite 的 dev 命令同时也是 "build"，所以用 --mode vitedemo 区分，而不是靠 command。 */
  const demoBuild = command === "build" && mode === "vitedemo";
  if (command !== "build" || demoBuild) {
    return {
      root: resolve(__dirname, "demo"),
      base: "./",
      plugins: [react()],
      server: {
        port: 5280,
        host: "127.0.0.1",
        open: false,
        /* 样式入口 assets/styles/index.css 用 @import 引用 root 之外的
           assets/ 与 components/ 下的 css。Vite 默认只 watch dev root（demo/），
           root 外的 @import 文件改动不会触发 HMR —— 这正是「改 css 不热更新」的根。
           这里 (1) 放开文件服务范围到整个项目，(2) 显式 watch 整个项目，
           让任何组件 css 的改动都能立刻热替换。 */
        fs: { allow: [resolve(__dirname)] },
        watch: { ignored: ["**/node_modules/**", "**/dist/**", "**/dist-demo/**", "**/.git/**"] },
      },
      preview: { port: 5281, host: "127.0.0.1", open: false },
      build: { outDir: resolve(__dirname, "dist-demo"), emptyOutDir: true },
      resolve: { alias: ALIAS },
    };
  }
  return {
    /* 插件：react + 构建结束后用 esbuild 产物覆盖 Vite 写出的 CSS，防止两边打架。 */
    plugins: [react(), {
      name: "rain-ui:css-from-esbuild",
      apply: "build" as const,
      closeBundle() {
        execFileSync(process.execPath, [resolve(__dirname, "scripts/build-css.mjs")], { stdio: "inherit" });
      },
    }],
    resolve: { alias: ALIAS },
    build: {
      lib: {
        entry: { "rain-ui": resolve(__dirname, "src/index.ts"), ...componentEntries() },
        formats: ["es", "cjs"],
        fileName: (format, entryName) => (format === "es" ? `${entryName}.js` : `${entryName}.cjs`),
        cssFileName: "rain-ui",
      },
      rollupOptions: { external: ["react", "react-dom", "react/jsx-runtime", "clsx", "lucide-react"] },
      sourcemap: true,
      reportCompressedSize: true,
      /* JS 侧不产出 CSS：样式统一由 scripts/build-css.mjs 用 esbuild bundle。
         Vite 的多入口 CSS 合并会丢规则（input/button/card 整段消失过），
         这里把 CSS 从 JS 图里摘掉，只依赖 esbuild 那一份。 */
      cssCodeSplit: false,
      emptyOutDir: false,
    },
  };
});
