import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DecompressApp from "./App.jsx";
import { ThemeProvider } from "./theme/ThemeContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ThemeProvider>
			<DecompressApp />
		</ThemeProvider>
	</StrictMode>,
);
