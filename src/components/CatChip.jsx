import { catOf } from "../data/categories.js";

export default function CatChip({ cat, small, mode }) {
	const c = catOf(cat, mode);
	return (
		<span
			className="inline-flex items-center rounded-full font-semibold"
			style={{
				background: c.soft,
				color: c.color,
				fontSize: small ? 10 : 11,
				padding: small ? "2px 8px" : "3px 10px",
				letterSpacing: "0.04em",
				textTransform: "uppercase",
			}}
		>
			{c.short || c.label}
		</span>
	);
}
