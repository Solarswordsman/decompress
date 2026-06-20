import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import ExerciseCard from "../ExerciseCard.jsx";

export default function RoutineTab({ routine, setRoutine, byId, moveRoutine, toggleRoutine, toggleExpand, expandedIds, level, mode, T }) {
	return (
		<>
			{routine.length === 0 ? (
				<div className="rounded-2xl text-center" style={{ background: T.card, border: `1px dashed ${T.borderStrong}`, padding: 36 }}>
					<p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 6px", color: T.text }}>No routine yet</p>
					<p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
						Browse the library and tap <b>Routine</b> on any exercise to build an ordered session. A balanced starter: 1–2 neck, 2 upper back, 1 nerve glide, 1–2 forearm.
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between flex-wrap gap-2">
						<span style={{ fontSize: 13, color: T.muted }}>{routine.length} exercises, in order. Reorder with the arrows.</span>
						<button
							onClick={() => setRoutine([])}
							className="inline-flex items-center gap-1 rounded-full"
							style={{ fontSize: 12, padding: "5px 11px", border: `1.5px solid ${T.dangerBorder}`, background: T.card, color: T.dangerText, cursor: "pointer" }}
						>
							<Trash2 size={12} /> Clear routine
						</button>
					</div>
					{routine.map((id, idx) => {
						const ex = byId[id];
						if (!ex) return null;
						return (
							<div key={id} className="flex gap-2 items-stretch">
								<div className="flex flex-col items-center justify-center gap-1 rounded-xl" style={{ background: T.card, border: `1px solid ${T.border}`, padding: "6px 4px", width: 36, flexShrink: 0 }}>
									<button onClick={() => moveRoutine(idx, -1)} disabled={idx === 0} style={{ background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? T.disabled : T.sub, padding: 2 }}>
										<ChevronUp size={16} />
									</button>
									<span style={{ fontSize: 12, fontWeight: 700, color: T.faint }}>{idx + 1}</span>
									<button onClick={() => moveRoutine(idx, 1)} disabled={idx === routine.length - 1} style={{ background: "none", border: "none", cursor: idx === routine.length - 1 ? "default" : "pointer", color: idx === routine.length - 1 ? T.disabled : T.sub, padding: 2 }}>
										<ChevronDown size={16} />
									</button>
								</div>
								<div className="flex-1 min-w-0">
									<ExerciseCard
										ex={ex}
										level={level}
										expanded={!!expandedIds[ex.id]}
										inRoutine={true}
										onToggleRoutine={() => toggleRoutine(ex.id)}
										onToggleExpand={() => toggleExpand(ex.id)}
										T={T}
										mode={mode}
									/>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}
