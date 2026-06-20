import { AlertTriangle, Sun, Moon } from "lucide-react";

export default function Header({ accent, mode, toggleMode, T }) {
	return (
		<header style={{ marginBottom: 14 }}>
			<div className="flex items-end gap-3 flex-wrap">
				<h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
					De<span style={{ color: accent }}>com</span>press
				</h1>
				<span style={{ fontSize: 13, color: T.muted, paddingBottom: 4 }}>
					cervical spine & RSI exercise library
				</span>
				<button
					onClick={toggleMode}
					aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
					title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
					className="inline-flex items-center justify-center rounded-full ml-auto"
					style={{
						width: 36,
						height: 36,
						border: `1.5px solid ${T.borderStrong}`,
						background: T.card,
						color: T.text,
						cursor: "pointer",
						flexShrink: 0,
					}}
				>
					{mode === "light" ? <Moon size={16} /> : <Sun size={16} />}
				</button>
			</div>
			<div className="rounded-xl flex gap-2 items-start" style={{ background: T.warnBg, border: `1px solid ${T.warnBorder}`, padding: "8px 12px", marginTop: 10 }}>
				<AlertTriangle size={14} style={{ color: T.warnIcon, flexShrink: 0, marginTop: 2 }} />
				<p style={{ fontSize: 12, color: T.warnText, margin: 0, lineHeight: 1.5 }}>
					Educational reference, not medical advice — review these with your physical therapist, especially the nerve glides and extension work.
					<b> Stop any exercise that sends symptoms further down the arm</b> (peripheralization); symptoms moving toward the neck (centralization) is the good direction.
				</p>
			</div>
		</header>
	);
}
