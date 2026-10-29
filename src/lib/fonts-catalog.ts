/**
 * 字体目录：随包分发的 18 个 @font-face（assets/styles/fonts.css）对应的
 * 展示名、实际 font-family、以及是否真的随包带了字体文件。
 *
 * 组件库只是给演示站和引用方一个「能直接渲染」的数据源：真正的字体应用逻辑
 * 在 ./font.ts（applyAppFont / applyAppMonoFont）。
 */

export type FontFaceInfo = {
  /** 展示名，和 APP_FONT_OPTIONS 的 label 对应 */
  label: string;
  /** 实际写进 font-family 的名字 */
  family: string;
  /** 随包分发的字体文件名（没有就是纯系统字体，靠用户机器上已安装） */
  bundled: string | null;
};

/** 随包分发的界面字体（assets/fonts 下真实存在） */
export const BUNDLED_UI_FONTS: readonly FontFaceInfo[] = [
  { label: "思源黑体 Noto Sans SC", family: "Noto Sans SC", bundled: "NotoSansSC-Variable.woff2 · 7.4 MB" },
  { label: "思源宋体 Noto Serif SC", family: "Noto Serif SC", bundled: "NotoSerifSC-Variable.woff2 · 10.5 MB" },
  { label: "霞鹜文楷 LXGW WenKai", family: "LXGW WenKai", bundled: "LXGWWenKai-Regular.woff2 · 7.6 MB" },
  { label: "Inter", family: "Inter", bundled: "Inter-Variable.woff2 · 342 KB" },
  { label: "Lato", family: "Lato", bundled: "Lato-Regular / Bold.woff2 · 413 KB" },
  { label: "Noto Sans UI", family: "Noto Sans UI", bundled: "NotoSansSC-Latin.woff2 · 28 KB" },
  { label: "Ubuntu", family: "Ubuntu", bundled: "Ubuntu Regular / Medium / Bold.ttf · 777 KB" },
];

/** 随包分发的等宽字体 */
export const BUNDLED_MONO_FONTS: readonly FontFaceInfo[] = [
  { label: "JetBrains Mono", family: "JetBrains Mono", bundled: "Regular / Medium / Bold.ttf · 800 KB" },
  { label: "Fira Code", family: "Fira Code", bundled: "FiraCode-Variable.woff2 · 104 KB" },
  { label: "Source Code Pro", family: "Source Code Pro", bundled: "SourceCodePro-Variable.woff2 · 87 KB" },
  { label: "IBM Plex Mono", family: "IBM Plex Mono", bundled: "Regular / Bold.woff2 · 78 KB" },
  { label: "Inconsolata", family: "Inconsolata", bundled: "Inconsolata-Variable.woff2 · 148 KB" },
];

/** 只做系统栈兜底的字体（不随包） */
export const SYSTEM_ONLY_FONTS: readonly string[] = [
  "Segoe UI Variable / Segoe UI",
  "Microsoft YaHei UI / 微软雅黑",
  "等线 DengXian",
  "SimSun 宋体",
  "Cascadia Code / Consolas",
  "HarmonyOS Sans（需已安装）",
  "MiSans（需已安装）",
  "Sarasa Mono SC（需已安装）",
];
