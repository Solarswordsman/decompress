import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DecompressApp from "../App.jsx";

describe("DecompressApp", () => {
	beforeEach(() => localStorage.clear());

	it("renders the app title", () => {
		render(<DecompressApp />);
		expect(
			screen.getByRole("heading", { level: 1, name: /decompress/i }),
		).toBeInTheDocument();
	});

	it("shows the three primary tabs", () => {
		render(<DecompressApp />);
		expect(screen.getByRole("button", { name: /library/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /my routine/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /edit data/i })).toBeInTheDocument();
	});
});
