/**
 * Barrel for the Tauri-free platform helpers.
 *
 * In the product these live in `src/platform/*` and several of them reach for
 * `@tauri-apps/api`. The library ships browser-safe equivalents only, so
 * components can be dropped into a plain web page.
 */

export { formatErrorText, formatErrorText as formatInvokeError } from "./errorText";
export {
  APP_FONT_OPTIONS,
  APP_MONO_FONT_OPTIONS,
  applyAppFont,
  applyAppMonoFont,
  getAppFontStack,
  getAppMonoFontStack,
  readAppFont,
  readAppMonoFont,
  setAppFont,
  setAppMonoFont,
  subscribeAppFont,
  subscribeAppMonoFont,
  type AppFont,
  type AppMonoFont,
} from "./font";
export {
  applyAppTheme,
  readAppTheme,
  setAppTheme,
  subscribeAppTheme,
  toggleAppTheme,
  type AppTheme,
} from "./theme";
export { groupThemeOptions, importedThemeName, remoteThemeFamily, type ThemeFamily } from "./themeNames";
export * from "./fonts-catalog";
