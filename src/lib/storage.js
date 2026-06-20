// ------------------------------------------------------------
// Persistent storage helpers.
//
// Backed by localStorage, with a graceful fallback to an in-memory
// map when storage is unavailable (SSR, private mode, sandboxes).
// The async signatures are kept so call sites can `await` uniformly
// regardless of which backend is active.
//
// (Replaces the Claude.ai artifact `window.storage` API the app
// originally used.)
// ------------------------------------------------------------

export const KEY_DATA = "decompress:exercises:v1";
export const KEY_ROUTINE = "decompress:routine:v1";
export const KEY_THEME = "decompress:theme:v1";

const memory = new Map();

function backend() {
	try {
		if (typeof window !== "undefined" && window.localStorage) {
			return window.localStorage;
		}
	} catch {
		// Touching localStorage can throw in some sandboxed contexts.
	}
	return null;
}

export async function loadStored(key) {
	const store = backend();
	try {
		const raw = store ? store.getItem(key) : memory.get(key);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export async function saveStored(key, val) {
	const serialized = JSON.stringify(val);
	const store = backend();
	try {
		if (store) store.setItem(key, serialized);
		else memory.set(key, serialized);
		return true;
	} catch {
		return false;
	}
}

export async function deleteStored(key) {
	const store = backend();
	try {
		if (store) store.removeItem(key);
		else memory.delete(key);
	} catch {
		// Ignore: deleting a missing key is a no-op anyway.
	}
}
