/**
 * Theme runtime for the standalone component library.
 *
 * The original app drives theming through Tauri (theme import, plugin payloads,
 * cross-window broadcast). None of that belongs in a reusable UI package, so
 * this module keeps only what the components actually need:
 *
 *   - read / write the active theme (`light` | `dark` | `custom`)
 *   - reflect it on `<html data-theme>`
 *   - notify subscribers (TopbarTabs re-measures tab widths on theme change)
 *
 * Storage is `localStorage` under the same key the app uses, so a page that
 * adopts the library keeps the user's choice without extra wiring.
 */

export type AppTheme = "light" | "dark" | "custom";

const THEME_KEY = "rain-ui.theme";

const listeners = new Set<(theme: AppTheme) => void>();

function isAppTheme(value: string | null): value is AppTheme {
  return value === "light" || value === "dark" || value === "custom";
}

export function readAppTheme(): AppTheme {
  const fallback: AppTheme = "dark";
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (isAppTheme(stored)) return stored;
  } catch {
    // Private mode / disabled storage keeps the default.
  }
  return fallback;
}

export function applyAppTheme(theme: AppTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function setAppTheme(theme: AppTheme) {
  applyAppTheme(theme);
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // The active page still uses the new theme.
  }
  listeners.forEach((listener) => listener(theme));
}

export function subscribeAppTheme(listener: (theme: AppTheme) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Flip between the two base themes. `custom` resolves to dark. */
export function toggleAppTheme(): AppTheme {
  const next: AppTheme = readAppTheme() === "dark" ? "light" : "dark";
  setAppTheme(next);
  return next;
}

applyAppTheme(readAppTheme());
