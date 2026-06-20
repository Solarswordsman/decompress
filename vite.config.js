import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	// Served from the site root on Netlify/Vercel; no sub-path needed.
	base: "/",
	plugins: [react(), tailwindcss()],
	test: {
		environment: "jsdom",
		setupFiles: "./src/test/setup.js",
		css: true,
	},
});
