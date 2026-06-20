export default function Tabs({ tab, setTab, routine, T }) {
	return (
		<div className="flex gap-1 rounded-xl" style={{ background: T.strip, padding: 4, marginBottom: 14 }}>
			{[
				{ id: "library", label: "Library" },
				{ id: "routine", label: `My routine${routine.length ? ` (${routine.length})` : ""}` },
				{ id: "data", label: "Edit data" },
			].map((t) => (
				<button
					key={t.id}
					onClick={() => setTab(t.id)}
					className="flex-1 rounded-lg font-semibold transition-colors"
					style={{
						fontSize: 13,
						padding: "8px 6px",
						border: "none",
						cursor: "pointer",
						background: tab === t.id ? T.card : "transparent",
						color: tab === t.id ? T.text : T.muted,
						boxShadow: tab === t.id ? T.shadow : "none",
					}}
				>
					{t.label}
				</button>
			))}
		</div>
	);
}
