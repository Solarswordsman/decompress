import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Extends Vitest's `expect` with DOM matchers (toBeInTheDocument, etc.).
import "@testing-library/jest-dom/vitest";

// Unmount and clear the DOM between tests. (Auto-cleanup only registers
// itself when Vitest globals are enabled; we keep globals off and do it
// explicitly here.)
afterEach(() => cleanup());
