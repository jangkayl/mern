import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useWorkoutsContext } from "../context/WorkoutContext";

interface User {
	name: string;
	email: string;
	_id: string;
}

const Dashboard = () => {
	const { dispatch } = useWorkoutsContext();
	const navigate = useNavigate();
	const [user, setUser] = useState<User>();
	const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		let isMounted = true;
		const fetchUserData = async () => {
			try {
				const response = await axios.get("/dashboard", {
					withCredentials: false,
				});
				if (response.data.err && isMounted) {
					navigate("/");
				} else if (isMounted) {
					setUser(response.data.userData);
					setName(response.data.userData.name);
					setEmail(response.data.userData.email);
				}
			} catch (err) {
				if (isMounted) {
					console.error(err);
					toast.error("Failed to fetch user data");
					navigate("/");
				}
			}
		};

		fetchUserData();
		return () => {
			isMounted = false;
		};
	}, [navigate]);

	const logoutUser = async () => {
		try {
			await axios.post("/logout", {}, { withCredentials: false });
			toast.success("Logged out successfully");
			dispatch({ type: "SET_WORKOUTS", payload: null });
			navigate("/");
		} catch (err) {
			console.error(err);
			toast.error("Failed to logout");
		}
	};

	const handleEditProfile = async () => {
		if (!user) return;

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Please enter a valid email address");
			return;
		}

		const data = { name, email };

		try {
			const response = await axios.put(`/dashboard/${user._id}`, data, {
				withCredentials: false,
			});

			if (response.data.err) {
				toast.error(response.data.err);
			} else {
				setUser(response.data.userData);
				toast.success("Profile updated successfully");
				setIsEditProfileOpen(false);
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to update profile");
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
				<button
					className="bg-green-500 text-white p-2 rounded-lg hover:bg-[#4caf50] hover:ease-in-out hover:transition-opacity"
					onClick={() => setIsEditProfileOpen(true)}>
					Edit Profile
				</button>
				<Link
					className="bg-blue-500 text-white p-2 rounded-lg hover:bg-[#3956bf] hover:ease-in-out hover:transition-opacity"
					to={"/user"}>
					Check workout
				</Link>
			</main>
			{isEditProfileOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-8 rounded-lg shadow-lg">
						<h3 className="text-xl mb-4">Edit Profile</h3>
						<div className="mb-4">
							<label className="block text-gray-700">Name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-gray-700">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full p-2 border border-gray-300 rounded"
							/>
						</div>
						<div className="flex justify-end gap-2">
							<button
								onClick={() => setIsEditProfileOpen(false)}
								className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-700">
								Cancel
							</button>
							<button
								onClick={handleEditProfile}
								className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700">
								Save
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
