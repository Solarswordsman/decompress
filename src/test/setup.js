import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Extends Vitest's `expect` with DOM matchers (toBeInTheDocument, etc.).
import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement matchMedia; provide a stub that reports "no
// preference" so theme detection falls back to its default. Individual tests
// can override window.matchMedia to simulate a specific OS preference.
if (typeof window !== "undefined" && !window.matchMedia) {
	window.matchMedia = (query) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener() {},
		removeEventListener() {},
		addListener() {},
		removeListener() {},
		dispatchEvent() {
			return false;
		},
	});
}

// Unmount and clear the DOM between tests. (Auto-cleanup only registers
// itself when Vitest globals are enabled; we keep globals off and do it
// explicitly here.)
afterEach(() => cleanup());
