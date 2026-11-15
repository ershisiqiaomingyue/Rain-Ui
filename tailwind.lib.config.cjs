/**
 * 库组件工具类的预编译配置（只服务 scripts/build-css.mjs）。
 *
 * 为什么存在：消费方的 tailwind 管线不可控——有的 dev JIT 编译不了
 * `data-[state=active]:` 这类任意变体（实测 tailwindcss 3.4.19 某些安装下
 * dev 与 build 行为不一致），导致库组件在消费方 dev 里整批丢样式。
 * 所以库在构建时把自己的组件类（src/** + components/**）预编译成真实 CSS，
 * 追加进 dist/rain-ui.css —— 消费方 `import "rain-ui/styles.css"` 即得到
 * 完整样式，不依赖消费方的 tailwind 扫描。
 *
 * 不含 @tailwind base（preflight 归消费方）；demo 的类不进产物。
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("./tailwind-preset.cjs")],
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        headline: ["var(--fs-headline)", { lineHeight: "var(--lh-headline)", fontWeight: "var(--fw-headline)" }],
        title: ["var(--fs-title)", { lineHeight: "var(--lh-title)", fontWeight: "var(--fw-title)" }],
        body: ["var(--fs-body)", { lineHeight: "var(--lh-body)", fontWeight: "var(--fw-body)" }],
        label: ["var(--fs-label)", { lineHeight: "var(--lh-label)", fontWeight: "var(--fw-label)" }],
        meta: ["var(--fs-meta)", { lineHeight: "var(--lh-meta)", fontWeight: "var(--fw-meta)" }],
        micro: ["var(--fs-micro)", { lineHeight: "var(--lh-micro)", fontWeight: "var(--fw-micro)" }],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        popover: "var(--shadow-popover)",
        control: "var(--shadow-btn)",
        "control-hover": "var(--shadow-btn-hover)",
        "inset-highlight": "var(--shadow-inset-highlight)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
