import { FIGS } from "./figures.jsx";

export default function Figure({ fig, color, size = 96, bg, ink }) {
	const draw = FIGS[fig];
	return (
		<svg
			viewBox="0 0 120 120"
			width={size}
			height={size}
			style={{ background: bg || "transparent", borderRadius: 12, flexShrink: 0 }}
		>
			<g fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
				{draw ? draw(color) : <circle cx="60" cy="60" r="30" stroke={color} strokeDasharray="6 6" />}
			</g>
		</svg>
	);
}
