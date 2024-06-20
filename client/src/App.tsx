import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Workout from "./pages/Workout";
import { Toaster } from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = "https://kyleback.vercel.app";
axios.defaults.withCredentials = true;

function App() {
	return (
		<BrowserRouter>
			<Toaster
				position="bottom-right"
				toastOptions={{ duration: 2000 }}
			/>
			<Routes>
				<Route
					path="/"
					element={<Login />}
				/>
				<Route
					path="/signup"
					element={<Signup />}
				/>
				<Route
					path="/dashboard"
					element={<Dashboard />}
				/>
				<Route
					path="/user"
					element={<Workout />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
