import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
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

	it("renders the seeded exercise library", () => {
		render(<DecompressApp />);
		// "All (22)" filter reflects the full seeded set.
		expect(screen.getByRole("button", { name: /^all \(22\)/i })).toBeInTheDocument();
		expect(screen.getByText("Seated chin tucks")).toBeInTheDocument();
	});

	it("filters the library by category", () => {
		render(<DecompressApp />);
		fireEvent.click(screen.getByRole("button", { name: /neck & cervical/i }));
		// The category blurb appears...
		expect(screen.getByText(/Deep neck flexor work/i)).toBeInTheDocument();
		// ...a neck exercise stays, an upper-back exercise is filtered out.
		expect(screen.getByText("Seated chin tucks")).toBeInTheDocument();
		expect(screen.queryByText("Wall angels")).not.toBeInTheDocument();
	});

	it("syncs the JSON editor with the exercise data", () => {
		render(<DecompressApp />);
		fireEvent.click(screen.getByRole("button", { name: /edit data/i }));
		const editor = screen.getByRole("textbox");
		expect(editor.value).toContain("chin-tuck-seated");
	});

	it("adds an exercise to the routine", () => {
		render(<DecompressApp />);
		const card = screen.getByText("Seated chin tucks").closest(".rounded-2xl");
		fireEvent.click(within(card).getByRole("button", { name: /^routine$/i }));
		expect(screen.getByRole("button", { name: /my routine \(1\)/i })).toBeInTheDocument();
	});
});
