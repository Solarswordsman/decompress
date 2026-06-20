import { useTheme } from "../theme/ThemeContext.jsx";

export default function DetailLevelControl({ level, setLevel, setExpandedIds, LEVELS, tab, search, setSearch }) {
	const { T } = useTheme();
	return (
		<div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 12 }}>
			<span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: T.faint }}>Detail</span>
			<div className="flex rounded-lg overflow-hidden" style={{ border: `1.5px solid ${T.borderStrong}` }}>
				{LEVELS.map((l) => (
					<button
						key={l.id}
						onClick={() => { setLevel(l.id); setExpandedIds({}); }}
						style={{
							fontSize: 12,
							fontWeight: 600,
							padding: "6px 12px",
							border: "none",
							cursor: "pointer",
							background: level === l.id ? T.segActiveBg : T.card,
							color: level === l.id ? T.segActiveText : T.sub,
						}}
					>
						{l.label}
					</button>
				))}
			</div>
			{tab === "library" && (
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search exercises…"
					className="rounded-lg flex-1"
					style={{ fontSize: 13, padding: "7px 11px", border: `1.5px solid ${T.borderStrong}`, minWidth: 140, background: T.inputBg, color: T.text, outline: "none" }}
				/>
			)}
		</div>
	);
}
