export const CATS = {
	neck: {
		label: "Neck & cervical",
		short: "Neck",
		color: "#1F7A72",
		soft: "#E2F0EE",
		darkColor: "#41BCB0",
		darkSoft: "#1B332F",
		blurb: "Deep neck flexor work, retraction, and stretches for C5–C6 compression and loss of cervical lordosis.",
	},
	back: {
		label: "Upper back & scapula",
		short: "Upper back",
		color: "#3D6B9E",
		soft: "#E4EBF4",
		darkColor: "#74A6DC",
		darkSoft: "#1F2C3B",
		blurb: "Postural strength behind the shoulder blades and thoracic mobility to take load off the neck.",
	},
	nerve: {
		label: "Nerve glides",
		short: "Nerves",
		color: "#7A5BA6",
		soft: "#ECE6F4",
		darkColor: "#AE90DB",
		darkSoft: "#2C2740",
		blurb: "Gentle nerve mobilization for arm, thumb, and finger symptoms. Go easy — these should never flare you up.",
	},
	rsi: {
		label: "Forearm & RSI",
		short: "Forearm",
		color: "#B5762B",
		soft: "#F5ECDE",
		darkColor: "#DCA452",
		darkSoft: "#382E1B",
		blurb: "Stretching, eccentric loading, and tendon mobility for forearm pain and ulnar-side hand symptoms.",
	},
};

export function catOf(key, mode) {
	const c = CATS[key] || { label: key, short: key, color: "#888", soft: "#eee", darkColor: "#aaa", darkSoft: "#2a2f33", blurb: "" };
	return {
		...c,
		color: mode === "dark" ? c.darkColor : c.color,
		soft: mode === "dark" ? c.darkSoft : c.soft,
	};
}
