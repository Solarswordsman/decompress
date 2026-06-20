import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DecompressApp from "../App.jsx";
import { ThemeProvider } from "../theme/ThemeContext.jsx";
import { KEY_THEME, loadStoredSync } from "../lib/storage.js";

const renderApp = () => render(
	<ThemeProvider>
		<DecompressApp />
	</ThemeProvider>,
);

// The header's toggle button label reflects the *active* scheme:
//   dark active  -> "Switch to light mode"
//   light active -> "Switch to dark mode"
const isDark = () => !!screen.queryByRole("button", { name: /switch to light mode/i });
const isLight = () => !!screen.queryByRole("button", { name: /switch to dark mode/i });

describe("theme", () => {
	const realMatchMedia = window.matchMedia;
	beforeEach(() => localStorage.clear());
	afterEach(() => {
		window.matchMedia = realMatchMedia;
	});

	it("defaults to dark when nothing is saved or detectable", () => {
		renderApp();
		expect(isDark()).toBe(true);
	});

	it("honors a saved preference over everything else", () => {
		localStorage.setItem(KEY_THEME, JSON.stringify("light"));
		renderApp();
		expect(isLight()).toBe(true);
	});

	it("follows the browser preference when nothing is saved", () => {
		window.matchMedia = (query) => ({
			matches: query.includes("light"),
			media: query,
			addEventListener() {},
			removeEventListener() {},
		});
		renderApp();
		expect(isLight()).toBe(true);
	});

	it("persists an explicit toggle", () => {
		renderApp();
		expect(isDark()).toBe(true);
		fireEvent.click(screen.getByRole("button", { name: /switch to light mode/i }));
		expect(isLight()).toBe(true);
		expect(loadStoredSync(KEY_THEME)).toBe("light");
	});
});
