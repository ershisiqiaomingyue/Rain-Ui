/**
 * 库自己的 Tailwind 配置（只服务 demo / 文档站的构建）。
 *
 * 颜色、字号、圆角、阴影的词表全在 ./tailwind-preset.cjs —— 那一份同样会被
 * 宿主（Android-Toolkit）通过 `rain-ui/tailwind-preset` 引走。这里只放
 * 「谁能用这些类名」（content）、暗色怎么判定（darkMode）和插件。
 *
 * 也别在这里加颜色：加在主题词表里，否则宿主的构建看不到。
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("./tailwind-preset.cjs")],
  /* 暗色走 class：demo 与消费方都是给 <html> 挂 data-theme，
     变量选择器（palettes.css）也认 html[data-theme]，两边口径一致。 */
  darkMode: ["class"],
  content: ["./demo/**/*.{ts,tsx,html}", "./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
