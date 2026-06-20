import { Plus, Check } from "lucide-react";

export default function AddButton({ inRoutine, onClick, compact, T }) {
	return (
		<button
			onClick={onClick}
			className="inline-flex items-center gap-1 rounded-full font-medium transition-colors"
			style={{
				fontSize: 12,
				padding: compact ? "4px 10px" : "6px 12px",
				background: inRoutine ? T.okBg : T.card,
				color: inRoutine ? T.okText : T.text,
				border: `1.5px solid ${inRoutine ? T.okText : T.borderStrong}`,
				cursor: "pointer",
			}}
			title={inRoutine ? "Remove from routine" : "Add to routine"}
		>
			{inRoutine ? <Check size={13} /> : <Plus size={13} />}
			{inRoutine ? "In routine" : "Routine"}
		</button>
	);
}
