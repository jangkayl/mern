import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WorkoutsContextProvider } from "./context/WorkoutContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<WorkoutsContextProvider>
			<App />
		</WorkoutsContextProvider>
	</React.StrictMode>
);
