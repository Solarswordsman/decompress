/* eslint-disable react-refresh/only-export-components --
 * This module deliberately exports both <ThemeProvider> and the useTheme()
 * hook; they belong together. (Only affects React Fast Refresh granularity.)
 */
import { createContext, useContext, useState } from "react";
import { THEMES } from "./themes.js";
import { catOf } from "../data/categories.js";
import { KEY_THEME, loadStoredSync, saveStored } from "../lib/storage.js";

const ThemeContext = createContext(null);

// Choose the initial color scheme:
//   1. a previously saved preference always wins;
//   2. otherwise follow the browser / OS setting;
//   3. and default to dark when nothing is detectable.
// Read synchronously so the very first paint is already the right scheme.
function getInitialMode() {
	const saved = loadStoredSync(KEY_THEME);
	if (saved === "light" || saved === "dark") return saved;
	if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
		if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
	}
	return "dark";
}

export function ThemeProvider({ children }) {
	const [mode, setMode] = useState(getInitialMode);

	const applyMode = (next) => {
		setMode(next);
		// Persist only explicit choices (fire-and-forget). Auto-detected values
		// are intentionally NOT saved, so the app keeps tracking the OS until the
		// user picks a theme themselves.
		saveStored(KEY_THEME, next);
	};
	const toggleMode = () => applyMode(mode === "light" ? "dark" : "light");

	const value = {
		mode,
		T: THEMES[mode],
		accent: catOf("neck", mode).color,
		toggleMode,
	};

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
	return ctx;
}
