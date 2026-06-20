import { useState, useEffect, useMemo } from "react";
import { THEMES } from "./theme/themes.js";
import { catOf } from "./data/categories.js";
import DEFAULT_EXERCISES from "./data/exercises.json";
import { KEY_DATA, KEY_ROUTINE, KEY_THEME, loadStored, saveStored, deleteStored } from "./lib/storage.js";
import ExerciseCard from "./components/ExerciseCard.jsx";
import Header from "./components/Header.jsx";
import Tabs from "./components/Tabs.jsx";
import DetailLevelControl from "./components/DetailLevelControl.jsx";
import LibraryTab from "./components/tabs/LibraryTab.jsx";
import RoutineTab from "./components/tabs/RoutineTab.jsx";
import EditDataTab from "./components/tabs/EditDataTab.jsx";

export default function DecompressApp() {
	const [exercises, setExercises] = useState(DEFAULT_EXERCISES);
	const [routine, setRoutine] = useState([]); // array of exercise ids
	const [tab, setTab] = useState("library"); // library | routine | data
	const [level, setLevel] = useState("standard"); // full | standard | quick | names
	const [filter, setFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [expandedIds, setExpandedIds] = useState({});
	const [jsonDraft, setJsonDraft] = useState("");
	const [jsonMsg, setJsonMsg] = useState(null); // {ok, text}
	const [usingCustom, setUsingCustom] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [mode, setMode] = useState("light"); // light | dark

	const T = THEMES[mode];

	// Load persisted data on mount
	useEffect(() => {
		(async () => {
			const storedEx = await loadStored(KEY_DATA);
			if (Array.isArray(storedEx) && storedEx.length) {
				setExercises(storedEx);
				setUsingCustom(true);
			}
			const storedRoutine = await loadStored(KEY_ROUTINE);
			if (Array.isArray(storedRoutine)) setRoutine(storedRoutine);
			const storedTheme = await loadStored(KEY_THEME);
			if (storedTheme === "dark" || storedTheme === "light") setMode(storedTheme);
			setLoaded(true);
		})();
	}, []);

	// Persist routine on change (after initial load)
	useEffect(() => {
		if (loaded) saveStored(KEY_ROUTINE, routine);
	}, [routine, loaded]);

	// Keep the JSON-editor draft in sync whenever the exercise data changes
	// (initial load, save, reset, revert). Render-time state adjustment is the
	// recommended alternative to a setState-in-effect for this derived state.
	const [syncedExercises, setSyncedExercises] = useState(null);
	if (syncedExercises !== exercises) {
		setSyncedExercises(exercises);
		setJsonDraft(JSON.stringify(exercises, null, 2));
	}

	const toggleMode = () => {
		const next = mode === "light" ? "dark" : "light";
		setMode(next);
		saveStored(KEY_THEME, next);
	};

	const byId = useMemo(() => Object.fromEntries(exercises.map((e) => [e.id, e])), [exercises]);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		return exercises.filter((e) => {
			if (filter !== "all" && e.category !== filter) return false;
			if (!q) return true;
			return (
				e.name.toLowerCase().includes(q) ||
				(e.oneLiner || "").toLowerCase().includes(q) ||
				(e.targets || []).join(" ").toLowerCase().includes(q)
			);
		});
	}, [exercises, filter, search]);

	const toggleRoutine = (id) =>
		setRoutine((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));

	const toggleExpand = (id) => setExpandedIds((m) => ({ ...m, [id]: !m[id] }));

	const moveRoutine = (idx, dir) => {
		setRoutine((r) => {
			const next = [...r];
			const j = idx + dir;
			if (j < 0 || j >= next.length) return r;
			[next[idx], next[j]] = [next[j], next[idx]];
			return next;
		});
	};

	const saveJson = async () => {
		try {
			const parsed = JSON.parse(jsonDraft);
			if (!Array.isArray(parsed)) throw new Error("Top level must be an array of exercises.");
			for (const e of parsed) {
				if (!e.id || !e.name || !e.category) throw new Error(`Each exercise needs id, name, and category (problem near "${e.name || e.id || "?"}").`);
			}
			setExercises(parsed);
			setUsingCustom(true);
			const ok = await saveStored(KEY_DATA, parsed);
			setJsonMsg({ ok: true, text: ok ? "Saved — your edits will persist across sessions." : "Applied for this session (persistent storage unavailable here)." });
		} catch (err) {
			setJsonMsg({ ok: false, text: `Couldn't save: ${err.message}` });
		}
	};

	const resetDefaults = async () => {
		setExercises(DEFAULT_EXERCISES);
		setUsingCustom(false);
		await deleteStored(KEY_DATA);
		setJsonMsg({ ok: true, text: "Reset to the built-in exercise set." });
	};

	const LEVELS = [
		{ id: "full", label: "Full" },
		{ id: "standard", label: "Standard" },
		{ id: "quick", label: "Quick" },
		{ id: "names", label: "Names" },
	];

	const gridClass =
		level === "names"
			? "grid grid-cols-2 sm:grid-cols-3 gap-2"
			: level === "quick"
				? "flex flex-col gap-2"
				: level === "standard"
					? "grid grid-cols-1 md:grid-cols-2 gap-3"
					: "flex flex-col gap-4";

	const renderCard = (ex) => {
		const isExpanded = !!expandedIds[ex.id];
		const card = (
			<ExerciseCard
				key={ex.id}
				ex={ex}
				level={level}
				expanded={isExpanded}
				inRoutine={routine.includes(ex.id)}
				onToggleRoutine={() => toggleRoutine(ex.id)}
				onToggleExpand={() => toggleExpand(ex.id)}
				T={T}
				mode={mode}
			/>
		);
		// Expanded cards in compact grids should span the full row
		if (isExpanded && (level === "names" || level === "standard")) {
			return (
				<div key={ex.id} className="col-span-2 sm:col-span-3 md:col-span-2">{card}</div>
			);
		}
		return card;
	};

	const accent = catOf("neck", mode).color;

	return (
		<div style={{ minHeight: "100vh", background: T.paper, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", color: T.text, transition: "background 0.25s ease, color 0.25s ease" }}>
			<div className="mx-auto" style={{ maxWidth: 880, padding: "20px 16px 64px" }}>
				<Header accent={accent} mode={mode} toggleMode={toggleMode} T={T} />

				<Tabs tab={tab} setTab={setTab} routine={routine} T={T} />

				{tab !== "data" && (
					<DetailLevelControl
						level={level}
						setLevel={setLevel}
						setExpandedIds={setExpandedIds}
						LEVELS={LEVELS}
						tab={tab}
						search={search}
						setSearch={setSearch}
						T={T}
					/>
				)}

				{tab === "library" && (
					<LibraryTab
						exercises={exercises}
						filter={filter}
						setFilter={setFilter}
						visible={visible}
						gridClass={gridClass}
						renderCard={renderCard}
						mode={mode}
						T={T}
					/>
				)}

				{tab === "routine" && (
					<RoutineTab
						routine={routine}
						setRoutine={setRoutine}
						byId={byId}
						moveRoutine={moveRoutine}
						toggleRoutine={toggleRoutine}
						toggleExpand={toggleExpand}
						expandedIds={expandedIds}
						level={level}
						mode={mode}
						T={T}
					/>
				)}

				{tab === "data" && (
					<EditDataTab
						jsonDraft={jsonDraft}
						setJsonDraft={setJsonDraft}
						jsonMsg={jsonMsg}
						setJsonMsg={setJsonMsg}
						saveJson={saveJson}
						resetDefaults={resetDefaults}
						usingCustom={usingCustom}
						exercises={exercises}
						accent={accent}
						T={T}
					/>
				)}
			</div>
		</div>
	);
}
