import { useState, useEffect, useMemo } from "react";
import { Plus, Check, X, ChevronUp, ChevronDown, Trash2, RotateCcw, Save, AlertTriangle, Info, Sun, Moon } from "lucide-react";
import { KEY_DATA, KEY_ROUTINE, KEY_THEME, loadStored, saveStored, deleteStored } from "./lib/storage.js";

// ============================================================
// DECOMPRESS — a cervical spine & RSI exercise library
// ------------------------------------------------------------
// All exercise content lives in DEFAULT_EXERCISES below.
// The app lets you edit this as JSON in the "Edit data" tab,
// and persists your edits, routine, and theme via window.storage.
// ============================================================

// ------------------------------------------------------------
// THEME TOKENS — every color in the UI comes from here
// ------------------------------------------------------------
const THEMES = {
	light: {
		paper: "#F4F7F6",
		card: "#FFFFFF",
		text: "#27333E",
		body: "#37433F",
		sub: "#5A6764",
		muted: "#6B7875",
		faint: "#8A9794",
		border: "#DCE3E1",
		borderStrong: "#C9D2D0",
		disabled: "#D5DCDA",
		chipBg: "#EEF2F1",
		strip: "#E4EAE8",
		segActiveBg: "#27333E",
		segActiveText: "#FFFFFF",
		inputBg: "#FFFFFF",
		warnBg: "#FDF6EC",
		warnBorder: "#EBD9BC",
		warnText: "#7A5A28",
		warnIcon: "#A9742C",
		cautionBg: "#FBF0EC",
		cautionText: "#8C4631",
		cautionIcon: "#B4533A",
		okBg: "#E2F0EE",
		okText: "#1F7A72",
		dangerBorder: "#E3C7BC",
		dangerText: "#8C4631",
		badgeText: "#FFFFFF",
		figInk: "#27333E",
		shadow: "0 1px 3px rgba(0,0,0,0.08)",
	},
	dark: {
		paper: "#141B21",
		card: "#1E2830",
		text: "#E8EEEC",
		body: "#C6D0CC",
		sub: "#A7B4B0",
		muted: "#93A1A8",
		faint: "#7C8B94",
		border: "#33404A",
		borderStrong: "#46555F",
		disabled: "#3A4750",
		chipBg: "#2A3640",
		strip: "#1A232B",
		segActiveBg: "#E8EEEC",
		segActiveText: "#141B21",
		inputBg: "#1E2830",
		warnBg: "#2E2517",
		warnBorder: "#4E3F22",
		warnText: "#DFC089",
		warnIcon: "#D9A85A",
		cautionBg: "#372520",
		cautionText: "#E8A893",
		cautionIcon: "#D97D5F",
		okBg: "#1C3431",
		okText: "#4FC2B6",
		dangerBorder: "#5A3A30",
		dangerText: "#E8A893",
		badgeText: "#10181E",
		figInk: "#E6EDEA",
		shadow: "0 1px 3px rgba(0,0,0,0.45)",
	},
};

const CATS = {
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

function catOf(key, mode) {
	const c = CATS[key] || { label: key, short: key, color: "#888", soft: "#eee", darkColor: "#aaa", darkSoft: "#2a2f33", blurb: "" };
	return {
		...c,
		color: mode === "dark" ? c.darkColor : c.color,
		soft: mode === "dark" ? c.darkSoft : c.soft,
	};
}

// ------------------------------------------------------------
// SEEDED EXERCISES
// ------------------------------------------------------------
const DEFAULT_EXERCISES = [
	// ---------------- NECK ----------------
	{
		id: "chin-tuck-seated",
		name: "Seated chin tucks",
		category: "neck",
		fig: "chinTuck",
		targets: ["Deep neck flexors", "Forward head posture"],
		oneLiner: "Glide your chin straight back, hold 5s.",
		brief: "Sit tall, glide the chin straight back (make a double chin) without tilting the head. Hold 5 seconds, relax.",
		steps: [
			"Sit tall with shoulders relaxed, eyes level.",
			"Glide your chin straight backward, as if making a gentle double chin. Don't tilt the head up or down.",
			"You should feel a stretch at the base of the skull and gentle work at the front of the neck.",
			"Hold 5 seconds, then relax. That's one rep.",
		],
		purpose:
			"The foundational exercise for forward head posture and a straightened cervical spine. Activates the deep neck flexors that hold the head over the spine instead of in front of it, reducing compressive load at C5–C6.",
		dose: "10 reps × 5s hold, 2–3 sessions/day. Great as an hourly desk break.",
		cautions: "Movement should be small and pain-free. Stop if it increases arm tingling.",
	},
	{
		id: "supine-nod",
		name: "Supine chin nods",
		category: "neck",
		fig: "supineNod",
		targets: ["Deep neck flexors", "Cervical endurance"],
		oneLiner: "Lying down, nod 'yes' tiny and slow, hold 10s.",
		brief: "Lie on your back, gently nod the chin toward the throat without lifting the head. Hold up to 10 seconds.",
		steps: [
			"Lie on your back, knees bent, a thin folded towel under the head if needed.",
			"Slowly nod the chin down toward the throat — a tiny 'yes' motion. The back of your head stays on the floor.",
			"Keep the big surface muscles (sternocleidomastoid) soft; this should feel subtle, not strained.",
			"Hold 5–10 seconds, breathing normally, then relax.",
		],
		purpose:
			"Trains endurance of the deep neck flexors with gravity minimized — the gold-standard starting point in cervical rehab. Weakness here is strongly associated with neck pain and forward head posture.",
		dose: "10 reps × 10s hold, 1–2 sessions/day.",
		cautions: "If you feel the front strap muscles bulging or shaking hard, shorten the hold.",
	},
	{
		id: "retraction-extension",
		name: "Retraction + gentle extension",
		category: "neck",
		fig: "retractExt",
		targets: ["Cervical lordosis", "Disc/nerve decompression"],
		oneLiner: "Chin tuck, then slowly look up a little. Watch arm symptoms.",
		brief: "Do a full chin tuck, then keep it and slowly tilt the head back a small amount. Return. Symptoms should centralize, not spread down the arm.",
		steps: [
			"Sit tall. Perform a full chin tuck (retraction) first.",
			"Holding the retraction, slowly tilt your head back to look toward the ceiling — only as far as is comfortable.",
			"Pause 1–2 seconds, return to neutral, release the tuck.",
			"Track your arm symptoms: improving/centralizing toward the neck = good; spreading further down the arm = stop.",
		],
		purpose:
			"A McKenzie-style movement that encourages restoration of the cervical curve (lordosis) — directly addressing the straightening that may be driving your C5–C6 compression. Many radiculopathy programs are built around retraction-based movements.",
		dose: "5–10 reps, 2–3 sessions/day, only within the symptom-free range.",
		cautions:
			"IMPORTANT with active radiculopathy: stop immediately if extension increases arm pain, numbness, or tingling (peripheralization). Confirm with your PT before progressing range.",
	},
	{
		id: "neck-isometrics",
		name: "4-way neck isometrics",
		category: "neck",
		fig: "isometric",
		targets: ["Neck strength", "Stability without motion"],
		oneLiner: "Press head into your hand in 4 directions — no movement.",
		brief: "Place a palm against your forehead, then each side, then the back of the head. Press gently into the hand without moving. Hold 5–10s each direction.",
		steps: [
			"Sit tall. Place your palm on your forehead.",
			"Press your head into your palm at ~25–50% effort. The head should not actually move.",
			"Hold 5–10 seconds, breathing normally. Relax.",
			"Repeat with the hand on the right side, left side, and back of the head.",
		],
		purpose:
			"Builds neck strength with zero joint movement — the safest way to strengthen when motion is irritable. Stronger cervical musculature shares load that's currently going through irritated joints and nerve roots.",
		dose: "2–3 holds per direction × 5–10s, once daily.",
		cautions: "Keep effort gentle. No breath holding. Skip any direction that provokes arm symptoms.",
	},
	{
		id: "levator-stretch",
		name: "Levator scapulae stretch",
		category: "neck",
		fig: "levator",
		targets: ["Levator scapulae", "Neck-to-shoulder-blade tension"],
		oneLiner: "Look down toward your armpit, gentle hand assist, 30s.",
		brief: "Turn your head 45° and look down toward that armpit; gently assist with the same-side hand. Hold 30s per side.",
		steps: [
			"Sit tall, anchor one hand under your thigh or behind your back (this drops the shoulder blade).",
			"Turn your head ~45° away from the anchored side, then look down toward your opposite armpit.",
			"Rest the free hand lightly on the back of your head for gentle overpressure — ounces, not pounds.",
			"Hold 20–30 seconds. You should feel it along the back/side of the neck into the top of the shoulder blade.",
		],
		purpose:
			"The levator scapulae runs from the upper neck to the top of the shoulder blade — exactly your posterior-neck and behind-the-shoulder-blade pain region. It's almost always overworked in forward-head desk posture.",
		dose: "2–3 holds × 30s per side, 1–2 sessions/day.",
		cautions: "Stretch sensation only — never pull into pain or arm tingling.",
	},
	{
		id: "trap-stretch",
		name: "Upper trapezius stretch",
		category: "neck",
		fig: "trapStretch",
		targets: ["Upper trapezius", "Side-of-neck tension"],
		oneLiner: "Ear toward shoulder, gentle hand assist, 30s.",
		brief: "Tilt your ear toward one shoulder while the other shoulder stays down. Gently assist with your hand. Hold 30s per side.",
		steps: [
			"Sit tall and anchor one hand under your thigh to keep that shoulder down.",
			"Tilt your ear directly toward the opposite shoulder, keeping your nose pointing forward.",
			"Add light overpressure with the free hand on the side of the head.",
			"Hold 20–30 seconds, feeling the stretch along the top of the shoulder and side of the neck.",
		],
		purpose:
			"Releases the upper trapezius, which gets chronically tense with desk work and guarding from pain, contributing to compression posture and posterior neck soreness.",
		dose: "2–3 holds × 30s per side, 1–2 sessions/day.",
		cautions: "Light assistance only; back off if symptoms travel down the arm.",
	},
	{
		id: "towel-lordosis",
		name: "Towel roll neck rest",
		category: "neck",
		fig: "towelRest",
		targets: ["Cervical lordosis", "Passive decompression"],
		oneLiner: "Lie with a small towel roll under the neck curve, 5–10 min.",
		brief: "Lie on your back with a rolled towel (3–4\" diameter) under the curve of the neck — not the head. Relax 5–10 minutes.",
		steps: [
			"Roll a hand towel to about 3–4 inches in diameter.",
			"Lie on your back on a firm surface and place the roll under the natural curve of your neck. The back of your head should still rest on the floor.",
			"Let the neck relax over the roll. Arms at your sides, knees bent if more comfortable.",
			"Rest 5–10 minutes. A good wind-down before bed.",
		],
		purpose:
			"A passive way to encourage the cervical curve to return. With a straightened cervical spine, the neck rarely gets to rest in its natural lordosis — this gives it time in that shape with zero effort.",
		dose: "5–10 minutes, once daily.",
		cautions: "Should feel relieving. If arm symptoms appear, use a smaller roll or stop.",
	},

	// ---------------- UPPER BACK ----------------
	{
		id: "scap-squeeze",
		name: "Scapular squeezes",
		category: "back",
		fig: "scapSqueeze",
		targets: ["Rhomboids", "Mid trapezius"],
		oneLiner: "Squeeze shoulder blades together, hold 5s.",
		brief: "Sit or stand tall, draw the shoulder blades back and slightly down toward each other. Hold 5s without shrugging.",
		steps: [
			"Sit or stand tall, arms relaxed at your sides.",
			"Draw your shoulder blades back and slightly down, as if pinching a pencil between them.",
			"Keep the shoulders away from the ears — no shrugging.",
			"Hold 5 seconds, then slowly release.",
		],
		purpose:
			"Wakes up the rhomboids and middle trapezius — the muscles behind the shoulder blade where you feel pain. Strengthening them counters the rounded posture that drags the head forward.",
		dose: "10–15 reps × 5s, 2–3 sessions/day. Another great desk-break move.",
		cautions: "Keep it pain-free and unshrugged.",
	},
	{
		id: "wall-angels",
		name: "Wall angels",
		category: "back",
		fig: "wallAngel",
		targets: ["Scapular control", "Thoracic mobility", "Posture"],
		oneLiner: "Back to wall, slide arms from W to Y, stay in contact.",
		brief: "Stand with back, head, and arms against a wall in a 'W'. Slide arms up toward a 'Y' keeping contact, then back down.",
		steps: [
			"Stand with your back against a wall, feet a few inches out, low back gently flattened.",
			"Press the back of your head (chin tucked), shoulders, and arms against the wall in a 'W' position.",
			"Slowly slide the arms up the wall toward a 'Y', keeping wrists and elbows in contact as much as possible.",
			"Slide back down to the 'W'. Quality over range — only go as high as you can keep contact.",
		],
		purpose:
			"A complete posture exercise: trains chin tuck, scapular control, and thoracic extension all at once, directly opposing the all-day desk position.",
		dose: "8–10 slow reps, once daily.",
		cautions: "It's normal for this to be hard. Reduce range rather than letting the head poke forward.",
	},
	{
		id: "band-row",
		name: "Resistance band rows",
		category: "back",
		fig: "bandRow",
		targets: ["Rhomboids", "Mid/lower traps", "Posture strength"],
		oneLiner: "Pull band to ribs, squeeze blades, slow return.",
		brief: "Anchor a band at chest height. Pull elbows back along the ribs, squeezing shoulder blades, then return slowly.",
		steps: [
			"Anchor a resistance band at chest height (door anchor or sturdy fixture). Hold one end in each hand.",
			"Stand tall, chin gently tucked, arms extended forward.",
			"Pull the elbows straight back along your ribs, finishing with a shoulder-blade squeeze.",
			"Pause 1–2 seconds, then return slowly (3 seconds out).",
		],
		purpose:
			"Progressive strengthening for the entire posterior shoulder girdle. Rows are the workhorse exercise for building the strength that keeps your shoulders and head stacked over your spine.",
		dose: "2–3 sets × 10–15 reps, every other day. Choose a band you could do ~20 reps with.",
		cautions: "Keep the neck relaxed — drive from the shoulder blades, not the upper traps.",
	},
	{
		id: "prone-ytw",
		name: "Prone Y-T-W raises",
		category: "back",
		fig: "ytw",
		targets: ["Lower trapezius", "Mid trapezius", "Posterior shoulder"],
		oneLiner: "Face down, lift arms in Y, then T, then W.",
		brief: "Lying face down, lift the arms slightly off the floor in a Y, then T, then W shape, thumbs up, 5 reps each.",
		steps: [
			"Lie face down, forehead on a folded towel, neck neutral.",
			"Y: arms overhead at ~45°, thumbs up. Lift them an inch or two off the floor, hold 3s, lower.",
			"T: arms straight out to the sides, thumbs up. Lift, hold 3s, lower.",
			"W: elbows bent at your sides, squeeze blades and lift, hold 3s, lower.",
		],
		purpose:
			"Targets the lower and middle trapezius from three angles — the most commonly weak muscles in desk workers, and the ones that hold the shoulder blades down and back against gravity.",
		dose: "5–8 reps each position, once daily or every other day.",
		cautions: "Keep the neck neutral (don't lift the head to look forward). No weight needed at first.",
	},
	{
		id: "thoracic-ext",
		name: "Thoracic extension over chair",
		category: "back",
		fig: "thoracicExt",
		targets: ["Thoracic mobility", "Mid-back stiffness"],
		oneLiner: "Arch your upper back over the chair's backrest.",
		brief: "Sitting, hands behind head, lean back so your mid-back arches over the top of the chair's backrest. 10 slow reps.",
		steps: [
			"Sit in a chair whose backrest top hits your mid-back. Support your head with hands laced behind it.",
			"Gently arch backward over the top edge of the backrest, letting the mid-back extend.",
			"Pause 2–3 seconds at a comfortable end range, then return.",
			"Shift slightly up or down to mobilize different segments.",
		],
		purpose:
			"A stiff thoracic spine forces the neck to do extra work and locks in the slumped posture. Restoring extension here lets the head and neck stack properly — supporting the lordosis work.",
		dose: "10 slow reps, 1–2 sessions/day. A foam roller works too.",
		cautions: "Extend through the mid-back, not by craning the neck. Keep it comfortable.",
	},
	{
		id: "doorway-pec",
		name: "Doorway pec stretch",
		category: "back",
		fig: "doorway",
		targets: ["Pectorals", "Anterior shoulder"],
		oneLiner: "Forearm on door frame, step through, 30s per side.",
		brief: "Forearm vertical on a door frame, elbow at shoulder height. Step gently through the doorway until you feel a chest stretch. Hold 30s.",
		steps: [
			"Stand in a doorway. Place one forearm vertically against the frame, elbow at about shoulder height.",
			"Step forward with the same-side leg and rotate your body slightly away until you feel a stretch across the chest and front of the shoulder.",
			"Keep ribs down and chin gently tucked — don't let the low back arch.",
			"Hold 20–30 seconds per side.",
		],
		purpose:
			"Tight pecs pull the shoulders forward and round the upper back, feeding the whole forward-head chain. Lengthening the front lets the strengthening work in back actually change your posture.",
		dose: "2–3 holds × 30s per side, 1–2 sessions/day.",
		cautions: "If you get arm tingling in this position, lower the elbow or reduce the stretch — it can tension the brachial plexus.",
	},
	{
		id: "cat-cow",
		name: "Cat-cow",
		category: "back",
		fig: "catCow",
		targets: ["Whole-spine mobility", "Movement variety"],
		oneLiner: "On all fours, alternate arching and rounding the spine.",
		brief: "On hands and knees, slowly alternate between arching the spine down (cow) and rounding it up (cat), moving segment by segment.",
		steps: [
			"Start on hands and knees, wrists under shoulders, knees under hips.",
			"Cow: let the belly drop, lift the chest and tailbone, gaze slightly forward.",
			"Cat: press the floor away, round the spine toward the ceiling, let the head hang.",
			"Move slowly with your breath — inhale to cow, exhale to cat.",
		],
		purpose:
			"Gentle, rhythmic motion for the entire spine. Movement nourishes discs and calms a sensitized system — a great warm-up before the other exercises and an antidote to hours of stillness.",
		dose: "8–10 slow cycles, anytime — especially as a warm-up.",
		cautions: "Keep neck motion gentle in the cow position; a small range is fine.",
	},

	// ---------------- NERVE GLIDES ----------------
	{
		id: "median-glide",
		name: "Median nerve glide",
		category: "nerve",
		fig: "medianGlide",
		targets: ["Median nerve (C5–C6 → thumb/index)"],
		oneLiner: "Arm out, palm up, gently tip wrist & head — floss, don't stretch.",
		brief: "Arm out to the side, palm up. Gently extend the wrist while tilting the head away, then release both. Slow and rhythmic, 10 reps.",
		steps: [
			"Stand or sit tall. Raise your arm out to the side at shoulder height, elbow straight, palm facing up.",
			"Gently extend the wrist (fingers point down/back) while tilting your head away from that arm.",
			"Then release: let the wrist relax as you tilt the head back toward the arm.",
			"Alternate slowly and rhythmically — this is flossing the nerve, not stretching it. Mild tension is fine; pain or tingling means back off.",
		],
		purpose:
			"The median nerve carries C6 fibers to your thumb and index finger — exactly where your symptoms are. Glides help the nerve move freely through tight tissue and can reduce sensitivity over time.",
		dose: "10 slow reps, 1–2 sessions/day. Start with a small range.",
		cautions:
			"Nerves are grumpy tissue: do LESS than feels necessary. Stop if symptoms increase during or up to a few hours after. Clear with your PT given active radiculopathy.",
	},
	{
		id: "ulnar-glide",
		name: "Ulnar nerve glide",
		category: "nerve",
		fig: "ulnarGlide",
		targets: ["Ulnar nerve (pinky/ring fingers, inner forearm)"],
		oneLiner: "Make an 'OK' sign and bring it to your eye like a mask.",
		brief: "Make an OK sign with thumb and index, then bend the elbow to bring it up to your eye like an upside-down mask. Return slowly. 10 reps.",
		steps: [
			"Make an 'OK' sign with your thumb and index finger, other fingers extended.",
			"Start with the arm out to the side, palm forward.",
			"Bend the elbow and rotate the forearm to bring the OK sign up over your eye, like putting on a mask (fingers pointing along your jaw).",
			"Return slowly to the start. Smooth and gentle, no end-range forcing.",
		],
		purpose:
			"Directly targets the ulnar nerve serving your pinky, ring finger, and inner forearm — the RSI distribution. Mobilizing it through the elbow (its most common entrapment site) can reduce irritation.",
		dose: "8–10 slow reps per session, 1–2 sessions/day.",
		cautions:
			"The ulnar nerve flares easily. Begin with half range. Avoid prolonged elbow flexion otherwise (phone holding, sleeping with bent elbows).",
	},
	{
		id: "radial-glide",
		name: "Radial nerve glide",
		category: "nerve",
		fig: "radialGlide",
		targets: ["Radial nerve (back of arm/forearm)"],
		oneLiner: "Arm down & back, wrist flexed, gently tilt head away.",
		brief: "Arm at your side reaching down and slightly back, palm facing back, wrist flexed. Gently tilt head away, then release. 10 reps.",
		steps: [
			"Stand tall, arm at your side. Rotate the arm so the palm faces backward, then flex the wrist (palm toward forearm).",
			"Reach the arm slightly down and behind you.",
			"Gently tilt your head away from the arm to add tension, then tilt back to release.",
			"Keep it oscillating and gentle — 1–2 seconds each way.",
		],
		purpose:
			"Completes the set of three major arm nerves. The radial nerve serves the back of the arm and forearm; gliding it helps if forearm pain has a radial component and keeps all neural tissue mobile.",
		dose: "8–10 slow reps, once daily.",
		cautions: "Same nerve rules: gentle, no symptom provocation, less is more.",
	},

	// ---------------- FOREARM / RSI ----------------
	{
		id: "wrist-ext-stretch",
		name: "Wrist extensor stretch",
		category: "rsi",
		fig: "wristExt",
		targets: ["Forearm extensors (top of forearm)"],
		oneLiner: "Arm straight, palm down, gently pull hand downward, 30s.",
		brief: "Arm straight, palm down. Use the other hand to gently bend the wrist down until you feel a stretch on top of the forearm. Hold 30s.",
		steps: [
			"Extend one arm in front of you, elbow straight, palm facing down.",
			"With the other hand, gently bend the wrist downward (fingers toward the floor).",
			"Feel a stretch along the top of the forearm. Keep it gentle.",
			"Hold 20–30 seconds per side.",
		],
		purpose:
			"The wrist extensors work constantly during mouse and keyboard use and are a primary driver of desk-related forearm pain. Regular stretching reduces resting tension.",
		dose: "2–3 holds × 30s, 2–3 sessions/day (especially during work breaks).",
		cautions: "Mild stretch only. If it reproduces nerve tingling, ease off the elbow extension.",
	},
	{
		id: "wrist-flex-stretch",
		name: "Wrist flexor stretch",
		category: "rsi",
		fig: "wristFlex",
		targets: ["Forearm flexors (palm side)"],
		oneLiner: "Arm straight, palm up, gently pull fingers back, 30s.",
		brief: "Arm straight, palm up. Gently pull the fingers back toward you until you feel a stretch on the palm side of the forearm. Hold 30s.",
		steps: [
			"Extend one arm in front of you, elbow straight, palm facing up.",
			"With the other hand, gently pull the fingers back and down toward the floor.",
			"Feel a stretch along the underside of the forearm into the palm.",
			"Hold 20–30 seconds per side.",
		],
		purpose:
			"Balances the extensor stretch — the flexors (gripping muscles) get tight from typing, mousing, and game controllers, and tightness here can irritate both median and ulnar nerves as they pass through.",
		dose: "2–3 holds × 30s, 2–3 sessions/day.",
		cautions: "Gentle — this position also tensions the median nerve.",
	},
	{
		id: "eccentric-wrist",
		name: "Eccentric wrist extensions",
		category: "rsi",
		fig: "eccentric",
		targets: ["Extensor tendons", "Tendon load tolerance"],
		oneLiner: "Lower a light weight slowly (3s) with the wrist, assist it back up.",
		brief: "Forearm on a table, hand over the edge, palm down, light weight. Lower the hand slowly over 3 seconds; help it back up with the other hand.",
		steps: [
			"Rest your forearm on a table, hand hanging off the edge, palm down, holding a light weight (a soup can works).",
			"Use your free hand to help lift the weight up (wrist extended).",
			"Remove the helping hand and lower the weight slowly — count 3 full seconds down.",
			"Reset with the helping hand each rep. The slow lowering is the exercise.",
		],
		purpose:
			"Eccentric (slow-lowering) loading is the best-evidenced approach for rebuilding tendon capacity in overuse injuries. This is what turns 'rest and stretch' into actual durability for typing and gaming.",
		dose: "3 sets × 10–15 reps, once daily. Mild discomfort (≤3/10) during is OK; it should settle within 24h.",
		cautions: "Start lighter than you think. Increase weight only when 15 reps feel easy.",
	},
	{
		id: "pro-sup",
		name: "Pronation/supination rotations",
		category: "rsi",
		fig: "proSup",
		targets: ["Forearm rotators", "Elbow/forearm mobility"],
		oneLiner: "Elbow at side, rotate a light hammer palm-up / palm-down.",
		brief: "Elbow bent 90° at your side holding a hammer or light weight vertically. Slowly rotate palm up, then palm down, with control.",
		steps: [
			"Sit with your elbow bent 90° and tucked at your side, holding a hammer (grip near the head) or light dumbbell held at one end.",
			"Slowly rotate the forearm so the palm faces up (supination). Control the end range.",
			"Rotate back the other way until the palm faces down (pronation).",
			"Keep the elbow pinned at your side throughout — motion comes only from forearm rotation.",
		],
		purpose:
			"Strengthens forearm rotation through full range, loading muscles and tissue around both ulnar and radial sides. Rotation strength is heavily used in mouse work and gaming but rarely trained.",
		dose: "2 sets × 10 each direction, once daily. Adjust leverage by choking up/down on the handle.",
		cautions: "Slow and controlled — momentum at end range is what irritates.",
	},
	{
		id: "tendon-glides",
		name: "Finger tendon glides",
		category: "rsi",
		fig: "tendonGlides",
		targets: ["Finger flexor tendons", "Hand mobility"],
		oneLiner: "Cycle: fingers straight → hook fist → full fist.",
		brief: "Move slowly through three hand positions: fingers fully straight, hook fist (bend only the top two knuckles), then full fist. Repeat 10 times.",
		steps: [
			"Start with the hand open, fingers fully straight.",
			"Hook fist: bend the top two joints of the fingers so fingertips touch the top of the palm, big knuckles stay straight (like a claw).",
			"Full fist: curl everything into a gentle complete fist.",
			"Return to fully straight. Move slowly through the cycle.",
		],
		purpose:
			"Glides the finger flexor tendons through their sheaths in different combinations, keeping them moving freely — useful for hand/finger symptoms and as a low-effort break activity during work or gaming sessions.",
		dose: "10 slow cycles, several times/day. Perfect between matches or meetings.",
		cautions: "Gentle squeeze on the fist — no white knuckles.",
	},
];

// ------------------------------------------------------------
// SVG FIGURES — schematic line drawings, one per exercise
// ------------------------------------------------------------
const FIGS = {
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

function Figure({ fig, color, size = 96, bg, ink }) {
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

// Persistent storage helpers + keys now live in ./lib/storage.js

// ------------------------------------------------------------
// Small UI atoms
// ------------------------------------------------------------
function CatChip({ cat, small, mode }) {
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

function AddButton({ inRoutine, onClick, compact, T }) {
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

// ------------------------------------------------------------
// Exercise card — renders at the chosen detail level
// ------------------------------------------------------------
function ExerciseCard({ ex, level, inRoutine, onToggleRoutine, expanded, onToggleExpand, T, mode }) {
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

// ------------------------------------------------------------
// Main app
// ------------------------------------------------------------
export default function DecompressApp() {
	const [exercises, setExercises] = useState(DEFAULT_EXERCISES);
	const [routine, setRoutine] = useState([]); // array of exercise ids
	const [tab, setTab] = useState("library"); // library | routine | data
	const [level, setLevel] = useState("standard"); // full | standard | quick | names
	const [filter, setFilter] = useState("all");
	const [search, setSearch] = useState("");
	const [expandedIds, setExpandedIds] = useState({});
	const [jsonDraft, setJsonDraft] = useState("");
	const [jsonMsg, setJsonMsg] = useState(null); // {ok, text}
	const [usingCustom, setUsingCustom] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [mode, setMode] = useState("light"); // light | dark

	const T = THEMES[mode];

	// Load persisted data on mount
	useEffect(() => {
		(async () => {
			const storedEx = await loadStored(KEY_DATA);
			if (Array.isArray(storedEx) && storedEx.length) {
				setExercises(storedEx);
				setUsingCustom(true);
			}
			const storedRoutine = await loadStored(KEY_ROUTINE);
			if (Array.isArray(storedRoutine)) setRoutine(storedRoutine);
			const storedTheme = await loadStored(KEY_THEME);
			if (storedTheme === "dark" || storedTheme === "light") setMode(storedTheme);
			setLoaded(true);
		})();
	}, []);

	// Persist routine on change (after initial load)
	useEffect(() => {
		if (loaded) saveStored(KEY_ROUTINE, routine);
	}, [routine, loaded]);

	useEffect(() => {
		setJsonDraft(JSON.stringify(exercises, null, 2));
	}, [exercises]);

	const toggleMode = () => {
		const next = mode === "light" ? "dark" : "light";
		setMode(next);
		saveStored(KEY_THEME, next);
	};

	const byId = useMemo(() => Object.fromEntries(exercises.map((e) => [e.id, e])), [exercises]);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		return exercises.filter((e) => {
			if (filter !== "all" && e.category !== filter) return false;
			if (!q) return true;
			return (
				e.name.toLowerCase().includes(q) ||
				(e.oneLiner || "").toLowerCase().includes(q) ||
				(e.targets || []).join(" ").toLowerCase().includes(q)
			);
		});
	}, [exercises, filter, search]);

	const toggleRoutine = (id) =>
		setRoutine((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));

	const toggleExpand = (id) => setExpandedIds((m) => ({ ...m, [id]: !m[id] }));

	const moveRoutine = (idx, dir) => {
		setRoutine((r) => {
			const next = [...r];
			const j = idx + dir;
			if (j < 0 || j >= next.length) return r;
			[next[idx], next[j]] = [next[j], next[idx]];
			return next;
		});
	};

	const saveJson = async () => {
		try {
			const parsed = JSON.parse(jsonDraft);
			if (!Array.isArray(parsed)) throw new Error("Top level must be an array of exercises.");
			for (const e of parsed) {
				if (!e.id || !e.name || !e.category) throw new Error(`Each exercise needs id, name, and category (problem near "${e.name || e.id || "?"}").`);
			}
			setExercises(parsed);
			setUsingCustom(true);
			const ok = await saveStored(KEY_DATA, parsed);
			setJsonMsg({ ok: true, text: ok ? "Saved — your edits will persist across sessions." : "Applied for this session (persistent storage unavailable here)." });
		} catch (err) {
			setJsonMsg({ ok: false, text: `Couldn't save: ${err.message}` });
		}
	};

	const resetDefaults = async () => {
		setExercises(DEFAULT_EXERCISES);
		setUsingCustom(false);
		await deleteStored(KEY_DATA);
		setJsonMsg({ ok: true, text: "Reset to the built-in exercise set." });
	};

	const LEVELS = [
		{ id: "full", label: "Full" },
		{ id: "standard", label: "Standard" },
		{ id: "quick", label: "Quick" },
		{ id: "names", label: "Names" },
	];

	const gridClass =
		level === "names"
			? "grid grid-cols-2 sm:grid-cols-3 gap-2"
			: level === "quick"
				? "flex flex-col gap-2"
				: level === "standard"
					? "grid grid-cols-1 md:grid-cols-2 gap-3"
					: "flex flex-col gap-4";

	const renderCard = (ex) => {
		const isExpanded = !!expandedIds[ex.id];
		const card = (
			<ExerciseCard
				key={ex.id}
				ex={ex}
				level={level}
				expanded={isExpanded}
				inRoutine={routine.includes(ex.id)}
				onToggleRoutine={() => toggleRoutine(ex.id)}
				onToggleExpand={() => toggleExpand(ex.id)}
				T={T}
				mode={mode}
			/>
		);
		// Expanded cards in compact grids should span the full row
		if (isExpanded && (level === "names" || level === "standard")) {
			return (
				<div key={ex.id} className="col-span-2 sm:col-span-3 md:col-span-2">{card}</div>
			);
		}
		return card;
	};

	const accent = catOf("neck", mode).color;

	return (
		<div style={{ minHeight: "100vh", background: T.paper, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", color: T.text, transition: "background 0.25s ease, color 0.25s ease" }}>
			<div className="mx-auto" style={{ maxWidth: 880, padding: "20px 16px 64px" }}>
				{/* Header */}
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

				{/* Tabs */}
				<div className="flex gap-1 rounded-xl" style={{ background: T.strip, padding: 4, marginBottom: 14 }}>
					{[
						{ id: "library", label: "Library" },
						{ id: "routine", label: `My routine${routine.length ? ` (${routine.length})` : ""}` },
						{ id: "data", label: "Edit data" },
					].map((t) => (
						<button
							key={t.id}
							onClick={() => setTab(t.id)}
							className="flex-1 rounded-lg font-semibold transition-colors"
							style={{
								fontSize: 13,
								padding: "8px 6px",
								border: "none",
								cursor: "pointer",
								background: tab === t.id ? T.card : "transparent",
								color: tab === t.id ? T.text : T.muted,
								boxShadow: tab === t.id ? T.shadow : "none",
							}}
						>
							{t.label}
						</button>
					))}
				</div>

				{/* Detail level control (library + routine) */}
				{tab !== "data" && (
					<div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 12 }}>
						<span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: T.faint }}>Detail</span>
						<div className="flex rounded-lg overflow-hidden" style={{ border: `1.5px solid ${T.borderStrong}` }}>
							{LEVELS.map((l) => (
								<button
									key={l.id}
									onClick={() => { setLevel(l.id); setExpandedIds({}); }}
									style={{
										fontSize: 12,
										fontWeight: 600,
										padding: "6px 12px",
										border: "none",
										cursor: "pointer",
										background: level === l.id ? T.segActiveBg : T.card,
										color: level === l.id ? T.segActiveText : T.sub,
									}}
								>
									{l.label}
								</button>
							))}
						</div>
						{tab === "library" && (
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search exercises…"
								className="rounded-lg flex-1"
								style={{ fontSize: 13, padding: "7px 11px", border: `1.5px solid ${T.borderStrong}`, minWidth: 140, background: T.inputBg, color: T.text, outline: "none" }}
							/>
						)}
					</div>
				)}

				{/* ---------------- LIBRARY ---------------- */}
				{tab === "library" && (
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
				)}

				{/* ---------------- ROUTINE ---------------- */}
				{tab === "routine" && (
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
				)}

				{/* ---------------- EDIT DATA ---------------- */}
				{tab === "data" && (
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
				)}
			</div>
		</div>
	);
}
