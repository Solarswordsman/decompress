export const FIGS = {
	chinTuck: (c) => (
		<g>
			<circle cx="78" cy="32" r="13" stroke={c} opacity="0.4" strokeDasharray="4 4" />
			<circle cx="66" cy="32" r="13" />
			<path d="M62 45 L58 62 L56 96" />
			<path d="M56 78 L40 80" />
			<path d="M102 28 L80 28" stroke={c} />
			<path d="M86 23 L80 28 L86 33" stroke={c} />
		</g>
	),
	supineNod: (c) => (
		<g>
			<path d="M8 98 L112 98" opacity="0.4" />
			<path d="M40 90 L86 90 L100 72 L104 96" />
			<circle cx="28" cy="84" r="11" />
			<path d="M16 64 q-8 8 -2 18" stroke={c} />
			<path d="M11 76 L14 82 L19 78" stroke={c} />
		</g>
	),
	retractExt: (c) => (
		<g>
			<circle cx="62" cy="34" r="13" />
			<path d="M58 46 L54 64 L52 96" />
			<path d="M52 78 L36 80" />
			<path d="M98 30 L78 30" stroke={c} />
			<path d="M84 25 L78 30 L84 35" stroke={c} />
			<path d="M58 12 q16 2 22 14" stroke={c} strokeDasharray="4 4" />
			<path d="M78 19 L80 26 L72 26" stroke={c} />
		</g>
	),
	isometric: (c) => (
		<g>
			<circle cx="56" cy="36" r="15" />
			<path d="M34 60 L80 60" />
			<path d="M56 51 L56 60" />
			<path d="M92 64 L88 42 L82 36" />
			<circle cx="80" cy="34" r="5" />
			<path d="M76 24 L66 28" stroke={c} />
			<path d="M70 23 L66 28 L71 32" stroke={c} />
			<path d="M44 26 L52 30" stroke={c} opacity="0.5" />
		</g>
	),
	levator: (c) => (
		<g>
			<circle cx="64" cy="34" r="12" transform="rotate(20 64 34)" />
			<path d="M70 30 L74 26" />
			<path d="M56 44 L50 64 L48 96" />
			<path d="M48 70 L30 74" />
			<path d="M30 74 L26 50 L52 22" />
			<circle cx="54" cy="21" r="4" />
			<path d="M84 36 q4 12 -4 20" stroke={c} />
			<path d="M86 50 L80 56 L76 50" stroke={c} />
		</g>
	),
	trapStretch: (c) => (
		<g>
			<circle cx="58" cy="34" r="12" transform="rotate(-18 58 34)" />
			<path d="M54 46 L52 64 L50 96" />
			<path d="M30 60 L76 60" />
			<path d="M92 78 L88 52 L70 32" />
			<circle cx="68" cy="30" r="4" />
			<path d="M42 14 q14 -8 26 2" stroke={c} />
			<path d="M62 9 L68 16 L60 19" stroke={c} />
			<path d="M30 64 L30 76" stroke={c} />
			<path d="M25 71 L30 77 L35 71" stroke={c} />
		</g>
	),
	towelRest: (c) => (
		<g>
			<path d="M6 98 L114 98" opacity="0.4" />
			<path d="M42 90 L88 90 L102 74 L106 96" />
			<circle cx="28" cy="86" r="11" />
			<ellipse cx="41" cy="93" rx="8" ry="5" stroke={c} fill="none" />
			<path d="M38 93 q3 -4 6 0" stroke={c} />
		</g>
	),
	scapSqueeze: (c) => (
		<g>
			<circle cx="60" cy="22" r="10" />
			<path d="M36 44 L84 44" />
			<path d="M60 44 L60 94" />
			<path d="M46 52 q-7 9 0 18" />
			<path d="M74 52 q7 9 0 18" />
			<path d="M38 61 L50 61" stroke={c} />
			<path d="M45 56 L50 61 L45 66" stroke={c} />
			<path d="M82 61 L70 61" stroke={c} />
			<path d="M75 56 L70 61 L75 66" stroke={c} />
		</g>
	),
	wallAngel: (c) => (
		<g>
			<path d="M30 8 L30 104" opacity="0.4" />
			<circle cx="40" cy="24" r="10" />
			<path d="M40 34 L40 92" />
			<path d="M40 92 L52 104" />
			<path d="M40 46 L56 54 L60 38" />
			<path d="M64 34 q4 -12 -4 -20" stroke={c} strokeDasharray="4 4" />
			<path d="M57 18 L60 13 L65 18" stroke={c} />
		</g>
	),
	bandRow: (c) => (
		<g>
			<circle cx="40" cy="22" r="10" />
			<path d="M40 32 L40 70" />
			<path d="M40 70 L32 98 M40 70 L50 98" />
			<path d="M40 40 L58 50 L68 44" />
			<circle cx="70" cy="43" r="4" />
			<path d="M74 43 L104 43" stroke={c} strokeDasharray="5 4" />
			<path d="M104 33 L104 53" stroke={c} />
			<path d="M64 32 L48 32" stroke={c} />
			<path d="M54 27 L48 32 L54 37" stroke={c} />
		</g>
	),
	ytw: (c) => (
		<g>
			<circle cx="60" cy="26" r="10" />
			<path d="M60 36 L60 98" />
			<path d="M60 46 L38 26 M60 46 L82 26" />
			<path d="M34 30 L32 20" stroke={c} />
			<path d="M28 25 L32 19 L37 24" stroke={c} />
			<path d="M86 30 L88 20" stroke={c} />
			<path d="M83 24 L88 19 L92 25" stroke={c} />
		</g>
	),
	thoracicExt: (c) => (
		<g>
			<path d="M58 80 L88 80 M64 80 L64 102 M84 80 L84 102" opacity="0.5" />
			<path d="M70 78 L70 50" opacity="0.5" />
			<path d="M64 76 q0 -22 14 -34" />
			<circle cx="84" cy="36" r="10" />
			<path d="M64 76 L40 78 L40 102" />
			<path d="M96 22 q9 8 6 20" stroke={c} />
			<path d="M98 38 L102 43 L106 36" stroke={c} />
		</g>
	),
	doorway: (c) => (
		<g>
			<path d="M84 8 L84 104" opacity="0.4" />
			<circle cx="50" cy="26" r="10" />
			<path d="M50 36 L50 76" />
			<path d="M50 76 L64 100 M50 76 L40 100" />
			<path d="M50 44 L70 40 L82 26" />
			<path d="M82 32 L82 20" />
			<path d="M42 54 L26 54" stroke={c} />
			<path d="M32 49 L26 54 L32 59" stroke={c} />
		</g>
	),
	catCow: (c) => (
		<g>
			<path d="M10 100 L110 100" opacity="0.4" />
			<path d="M40 64 L40 100 M86 64 L86 100" />
			<path d="M40 64 q23 -22 46 0" />
			<path d="M40 64 q23 16 46 0" stroke={c} strokeDasharray="4 4" />
			<circle cx="31" cy="58" r="9" />
		</g>
	),
	medianGlide: (c) => (
		<g>
			<circle cx="36" cy="26" r="11" transform="rotate(-12 36 26)" />
			<path d="M36 37 L36 86" />
			<path d="M36 46 L66 46 L94 46" />
			<path d="M94 46 L100 34" />
			<path d="M100 34 L106 32 M100 34 L105 38" />
			<path d="M54 56 L82 56" stroke={c} />
			<path d="M76 51 L82 56 L76 61" stroke={c} />
			<path d="M26 12 q-8 4 -8 12" stroke={c} strokeDasharray="3 3" />
		</g>
	),
	ulnarGlide: (c) => (
		<g>
			<circle cx="58" cy="30" r="13" />
			<path d="M50 42 L46 64 L44 96" />
			<path d="M46 52 L70 56 L76 40" />
			<circle cx="73" cy="30" r="7" stroke={c} />
			<path d="M80 24 L88 18" stroke={c} strokeDasharray="3 3" />
			<path d="M96 60 q-4 -18 -16 -26" stroke={c} strokeDasharray="4 4" />
			<path d="M84 30 L78 33 L84 39" stroke={c} />
		</g>
	),
	radialGlide: (c) => (
		<g>
			<circle cx="56" cy="26" r="11" transform="rotate(14 56 26)" />
			<path d="M54 38 L54 80" />
			<path d="M54 80 L44 102 M54 80 L64 102" />
			<path d="M54 46 L72 64 L80 80" />
			<path d="M80 80 L72 86" />
			<path d="M64 54 L78 70" stroke={c} />
			<path d="M77 62 L79 71 L70 69" stroke={c} />
			<path d="M44 12 q-9 3 -10 12" stroke={c} strokeDasharray="3 3" />
		</g>
	),
	wristExt: (c) => (
		<g>
			<path d="M22 56 L74 56" />
			<path d="M74 56 L84 78" />
			<path d="M84 78 L82 86 M84 78 L89 84" />
			<path d="M94 56 q6 10 -2 20" stroke={c} />
			<path d="M95 70 L91 77 L86 71" stroke={c} />
			<circle cx="22" cy="56" r="5" />
		</g>
	),
	wristFlex: (c) => (
		<g>
			<path d="M22 64 L74 64" />
			<path d="M74 64 L84 42" />
			<path d="M84 42 L82 34 M84 42 L90 37" />
			<path d="M94 64 q6 -10 -2 -20" stroke={c} />
			<path d="M95 50 L91 43 L86 49" stroke={c} />
			<circle cx="22" cy="64" r="5" />
		</g>
	),
	eccentric: (c) => (
		<g>
			<path d="M16 70 L66 70 L66 104" opacity="0.5" />
			<path d="M26 66 L64 66" />
			<path d="M64 66 L76 76" />
			<circle cx="80" cy="82" r="7" />
			<path d="M96 58 L96 84" stroke={c} />
			<path d="M91 78 L96 85 L101 78" stroke={c} />
			<path d="M30 50 q4 -8 12 -8" stroke={c} strokeDasharray="3 3" opacity="0.6" />
		</g>
	),
	proSup: (c) => (
		<g>
			<path d="M60 96 L60 56" />
			<path d="M60 56 L60 28" />
			<path d="M48 26 L72 26 L72 34 L48 34 Z" />
			<path d="M40 44 q-8 14 4 24" stroke={c} />
			<path d="M38 62 L45 69 L48 61" stroke={c} />
			<path d="M80 44 q8 14 -4 24" stroke={c} />
			<path d="M82 62 L75 69 L72 61" stroke={c} />
		</g>
	),
	tendonGlides: (c) => (
		<g>
			<path d="M20 88 L20 56 M20 60 L12 42 M20 58 L19 38 M20 58 L26 40 M22 62 L32 48" />
			<path d="M58 88 L58 56 M58 56 q0 -14 12 -10 q8 4 0 10 L62 60" />
			<circle cx="98" cy="64" r="13" />
			<path d="M92 64 q6 -6 12 0" />
			<path d="M38 70 L48 70" stroke={c} />
			<path d="M44 66 L48 70 L44 74" stroke={c} />
			<path d="M74 70 L82 70" stroke={c} />
			<path d="M78 66 L82 70 L78 74" stroke={c} />
		</g>
	),
};
