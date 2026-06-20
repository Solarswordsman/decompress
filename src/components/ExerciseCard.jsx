import { ChevronUp, ChevronDown, Info, AlertTriangle } from "lucide-react";
import { catOf } from "../data/categories.js";
import Figure from "./Figure.jsx";
import CatChip from "./CatChip.jsx";
import AddButton from "./AddButton.jsx";

export default function ExerciseCard({ ex, level, inRoutine, onToggleRoutine, expanded, onToggleExpand, T, mode }) {
	const cat = catOf(ex.category, mode);

	if (level === "names" && !expanded) {
		return (
			<button
				onClick={onToggleExpand}
				className="flex items-center gap-2 rounded-xl text-left transition-shadow hover:shadow-md"
				style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `4px solid ${cat.color}`, padding: "10px 12px", cursor: "pointer" }}
			>
				<span className="font-semibold" style={{ fontSize: 13, color: T.text }}>{ex.name}</span>
				<ChevronDown size={14} style={{ color: T.faint, marginLeft: "auto", flexShrink: 0 }} />
			</button>
		);
	}

	if (level === "quick" && !expanded) {
		return (
			<div
				className="rounded-xl flex items-center gap-3"
				style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `4px solid ${cat.color}`, padding: "10px 14px" }}
			>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="font-semibold" style={{ fontSize: 14, color: T.text }}>{ex.name}</span>
						<CatChip cat={ex.category} small mode={mode} />
					</div>
					<div style={{ fontSize: 12.5, color: T.sub, marginTop: 2 }}>{ex.oneLiner}</div>
				</div>
				<AddButton inRoutine={inRoutine} onClick={onToggleRoutine} compact T={T} />
			</div>
		);
	}

	if (level === "standard" && !expanded) {
		return (
			<div
				className="rounded-2xl flex gap-3"
				style={{ background: T.card, border: `1px solid ${T.border}`, borderTop: `4px solid ${cat.color}`, padding: 14 }}
			>
				<Figure fig={ex.fig} color={cat.color} size={72} bg={cat.soft} ink={T.figInk} />
				<div className="min-w-0 flex-1">
					<div className="flex items-start gap-2 flex-wrap">
						<span className="font-semibold" style={{ fontSize: 15, color: T.text }}>{ex.name}</span>
						<CatChip cat={ex.category} small mode={mode} />
					</div>
					<p style={{ fontSize: 13, color: T.body, margin: "4px 0 6px", lineHeight: 1.45 }}>{ex.brief}</p>
					<div className="flex items-center gap-3 flex-wrap">
						<span style={{ fontSize: 12, color: cat.color, fontWeight: 600 }}>{ex.dose}</span>
						<AddButton inRoutine={inRoutine} onClick={onToggleRoutine} compact T={T} />
					</div>
				</div>
			</div>
		);
	}

	// FULL detail (also used when a names/quick/standard card is expanded)
	return (
		<div
			className="rounded-2xl"
			style={{ background: T.card, border: `1px solid ${T.border}`, borderTop: `5px solid ${cat.color}`, padding: 18 }}
		>
			<div className="flex gap-4 flex-wrap sm:flex-nowrap">
				<div className="flex flex-col items-center gap-1">
					<Figure fig={ex.fig} color={cat.color} size={104} bg={cat.soft} ink={T.figInk} />
					<span style={{ fontSize: 10, color: T.faint }}>schematic</span>
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2 flex-wrap">
						<h3 className="font-bold" style={{ fontSize: 18, color: T.text, margin: 0 }}>{ex.name}</h3>
						<CatChip cat={ex.category} mode={mode} />
						{expanded && (
							<button onClick={onToggleExpand} className="ml-auto" style={{ background: "none", border: "none", cursor: "pointer", color: T.faint }} title="Collapse">
								<ChevronUp size={18} />
							</button>
						)}
					</div>
					<div className="flex gap-1.5 flex-wrap" style={{ margin: "6px 0 8px" }}>
						{(ex.targets || []).map((t) => (
							<span key={t} style={{ fontSize: 11, color: T.sub, background: T.chipBg, borderRadius: 6, padding: "2px 8px" }}>{t}</span>
						))}
					</div>
					<div className="rounded-xl" style={{ background: cat.soft, padding: "10px 12px", marginBottom: 10 }}>
						<div className="flex items-center gap-1.5" style={{ color: cat.color, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>
							<Info size={12} /> Why this helps
						</div>
						<p style={{ fontSize: 13, color: T.body, margin: 0, lineHeight: 1.5 }}>{ex.purpose}</p>
					</div>
				</div>
			</div>

			<div style={{ marginTop: 6 }}>
				<div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: T.faint, marginBottom: 4 }}>How to do it</div>
				<ol style={{ margin: 0, paddingLeft: 20, color: T.body }}>
					{(ex.steps || []).map((s, i) => (
						<li key={i} style={{ fontSize: 13.5, color: T.body, lineHeight: 1.55, marginBottom: 3 }}>{s}</li>
					))}
				</ol>
			</div>

			<div className="flex items-center gap-3 flex-wrap" style={{ marginTop: 12 }}>
				<span className="rounded-lg font-semibold" style={{ fontSize: 12.5, color: T.badgeText, background: cat.color, padding: "5px 10px" }}>{ex.dose}</span>
				<AddButton inRoutine={inRoutine} onClick={onToggleRoutine} T={T} />
			</div>

			{ex.cautions && (
				<div className="flex gap-2 rounded-xl items-start" style={{ background: T.cautionBg, padding: "9px 12px", marginTop: 10 }}>
					<AlertTriangle size={15} style={{ color: T.cautionIcon, flexShrink: 0, marginTop: 1 }} />
					<span style={{ fontSize: 12.5, color: T.cautionText, lineHeight: 1.45 }}>{ex.cautions}</span>
				</div>
			)}
		</div>
	);
}
