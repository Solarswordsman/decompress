import { Save, RotateCcw, Check, X } from "lucide-react";

export default function EditDataTab({ jsonDraft, setJsonDraft, jsonMsg, setJsonMsg, saveJson, resetDefaults, usingCustom, exercises, accent, T }) {
	return (
		<div className="flex flex-col gap-3">
			<div className="rounded-2xl" style={{ background: T.card, border: `1px solid ${T.border}`, padding: 16 }}>
				<h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", color: T.text }}>Exercise data (JSON)</h2>
				<p style={{ fontSize: 13, color: T.sub, margin: 0, lineHeight: 1.55 }}>
					Every exercise is a JSON object with: <code style={{ background: T.chipBg, padding: "1px 5px", borderRadius: 4, fontSize: 12, color: T.text }}>id, name, category, fig, targets, oneLiner, brief, steps, purpose, dose, cautions</code>.
					Categories: <b>neck</b>, <b>back</b>, <b>nerve</b>, <b>rsi</b>. The <b>fig</b> field picks a built-in drawing — reuse any existing one for new exercises (e.g. your PT's). You can also copy this JSON into a chat with Claude, describe the changes you want, and paste the result back here.
				</p>
				{usingCustom && (
					<p style={{ fontSize: 12, color: T.okText, fontWeight: 600, margin: "8px 0 0" }}>Currently showing your customized set.</p>
				)}
			</div>
			<textarea
				value={jsonDraft}
				onChange={(e) => { setJsonDraft(e.target.value); setJsonMsg(null); }}
				spellCheck={false}
				className="rounded-2xl w-full"
				style={{
					fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
					fontSize: 12, lineHeight: 1.5, padding: 14, minHeight: 380,
					border: `1.5px solid ${T.borderStrong}`, background: T.inputBg, color: T.text, outline: "none", resize: "vertical",
				}}
			/>
			{jsonMsg && (
				<div className="rounded-xl flex items-center gap-2" style={{ background: jsonMsg.ok ? T.okBg : T.cautionBg, color: jsonMsg.ok ? T.okText : T.cautionText, padding: "9px 13px", fontSize: 13 }}>
					{jsonMsg.ok ? <Check size={15} /> : <X size={15} />} {jsonMsg.text}
				</div>
			)}
			<div className="flex gap-2 flex-wrap">
				<button onClick={saveJson} className="inline-flex items-center gap-1.5 rounded-xl font-semibold" style={{ fontSize: 13, padding: "9px 16px", background: accent, color: T.badgeText, border: "none", cursor: "pointer" }}>
					<Save size={14} /> Validate & save
				</button>
				<button onClick={() => { setJsonDraft(JSON.stringify(exercises, null, 2)); setJsonMsg(null); }} className="inline-flex items-center gap-1.5 rounded-xl font-semibold" style={{ fontSize: 13, padding: "9px 16px", background: T.card, color: T.text, border: `1.5px solid ${T.borderStrong}`, cursor: "pointer" }}>
					Revert edits
				</button>
				<button onClick={resetDefaults} className="inline-flex items-center gap-1.5 rounded-xl font-semibold" style={{ fontSize: 13, padding: "9px 16px", background: T.card, color: T.dangerText, border: `1.5px solid ${T.dangerBorder}`, cursor: "pointer" }}>
					<RotateCcw size={14} /> Reset to defaults
				</button>
			</div>
		</div>
	);
}
