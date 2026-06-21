import { CATS, catOf } from "../../data/categories.js";
import { useTheme } from "../../theme/ThemeContext.jsx";

export default function LibraryTab({ exercises, filter, setFilter, visible, gridClass, renderCard }) {
	const { T, mode } = useTheme();
	return (
		<>
			<div className="flex gap-1.5 flex-wrap" style={{ marginBottom: 14 }}>
				<button
					onClick={() => setFilter("all")}
					className="rounded-full font-semibold"
					style={{
						fontSize: 12, padding: "5px 13px", cursor: "pointer",
						border: `1.5px solid ${filter === "all" ? T.segActiveBg : T.borderStrong}`,
						background: filter === "all" ? T.segActiveBg : T.card,
						color: filter === "all" ? T.segActiveText : T.sub,
					}}
				>
					All ({exercises.length})
				</button>
				{Object.keys(CATS).map((k) => {
					const c = catOf(k, mode);
					const n = exercises.filter((e) => e.category === k).length;
					const active = filter === k;
					return (
						<button
							key={k}
							onClick={() => setFilter(k)}
							className="rounded-full font-semibold"
							style={{
								fontSize: 12, padding: "5px 13px", cursor: "pointer",
								border: `1.5px solid ${active ? c.color : T.borderStrong}`,
								background: active ? c.color : T.card,
								color: active ? T.badgeText : c.color,
							}}
						>
							{c.label} ({n})
						</button>
					);
				})}
			</div>

			{filter !== "all" && (
				<p style={{ fontSize: 12.5, color: T.muted, margin: "0 0 12px", fontStyle: "italic" }}>{catOf(filter, mode).blurb}</p>
			)}

			{visible.length === 0 ? (
				<div className="rounded-2xl text-center" style={{ background: T.card, border: `1px dashed ${T.borderStrong}`, padding: 32, color: T.faint, fontSize: 14 }}>
					No exercises match. Clear the search or pick another category.
				</div>
			) : (
				<div className={gridClass}>{visible.map(renderCard)}</div>
			)}
		</>
	);
}
