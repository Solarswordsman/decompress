import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import stylistic from "@stylistic/eslint-plugin";

export default [
	{ ignores: ["dist", "coverage"] },
	{
		files: ["**/*.{js,jsx}"],
		languageOptions: {
			ecmaVersion: 2022,
			globals: { ...globals.browser },
			parserOptions: {
				ecmaVersion: "latest",
				ecmaFeatures: { jsx: true },
				sourceType: "module",
			},
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			"@stylistic": stylistic,
		},
		rules: {
			...js.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			// House style: tabs for indentation (see .editorconfig).
			"@stylistic/indent": ["error", "tab"],
			"no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
		},
	},
	{
		// Config files run in Node.
		files: ["*.config.js", "vite.config.js", "eslint.config.js"],
		languageOptions: { globals: { ...globals.node } },
	},
	{
		// Tests run in Node + jsdom; Vitest APIs are imported explicitly.
		files: ["src/test/**", "**/*.test.{js,jsx}"],
		languageOptions: { globals: { ...globals.node } },
		rules: { "react-refresh/only-export-components": "off" },
	},
];
