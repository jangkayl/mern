import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

interface User {
	name: string;
	email: string;
	id: string;
}

const Dashboard = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState<User>();

	useEffect(() => {
		let isMounted = true;
		const userData = async () => {
			try {
				const response = await axios.get("/dashboard", {
					withCredentials: true,
				});
				if (response.data.err) {
					if (isMounted) {
						navigate("/login");
					}
				} else {
					if (isMounted) setUser(response.data.userData);
				}
			} catch (err) {
				if (isMounted) {
					console.log(err);
					toast.error("Failed to fetch user data");
					navigate("/login");
				}
			}
		};

		userData();
		return () => {
			isMounted = false;
		};
	}, [navigate]);

	const logoutUser = async () => {
		try {
			await axios.post("/logout", {}, { withCredentials: true });
			toast.success("Logged out successfully");
			navigate("/login");
		} catch (err) {
			console.log(err);
			toast.error("Failed to logout");
		}
	};

	if (!user)
		return (
			<div className="h-screen flex items-center justify-center bg-[#c3ddfe]">
				Loading...
			</div>
		);
	return (
		<div className="h-screen flex items-center justify-center bg-[#c3ddfe]">
			<main className="flex flex-col gap-2">
				<h2>Welcome, {user.name}</h2>
				<button
					className="bg-red-500 text-white p-2 rounded-lg hover:bg-[#e15d5d] hover:ease-in-out hover:transition-opacity"
					onClick={logoutUser}>
					Logout
				</button>
				<Link
					className="bg-blue-500 text-white p-2 rounded-lg hover:bg-[#3956bf] hover:ease-in-out hover:transition-opacity"
					to={"/user"}>
					Check workout
				</Link>
			</main>
		</div>
	);
};

export default Dashboard;
