import { describe, it, expect, beforeEach } from "vitest";
import {
	loadStored,
	saveStored,
	deleteStored,
	KEY_ROUTINE,
} from "../lib/storage.js";

describe("storage", () => {
	beforeEach(() => localStorage.clear());

	it("round-trips a JSON-serializable value", async () => {
		await saveStored(KEY_ROUTINE, ["a", "b", "c"]);
		expect(await loadStored(KEY_ROUTINE)).toEqual(["a", "b", "c"]);
	});

	it("returns null for a missing key", async () => {
		expect(await loadStored("decompress:does-not-exist")).toBeNull();
	});

	it("deletes a stored value", async () => {
		await saveStored(KEY_ROUTINE, [1, 2]);
		await deleteStored(KEY_ROUTINE);
		expect(await loadStored(KEY_ROUTINE)).toBeNull();
	});
});
