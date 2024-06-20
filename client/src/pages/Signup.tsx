import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState({
		name: "",
		email: "",
		password: "",
		conPassword: "",
	});

	const signupUser = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const { name, email, password, conPassword } = user;
		setLoading(true);
		try {
			const response = await axios.post(
				"/signup",
				{
					name,
					email,
					password,
					conPassword,
				},
				{
					withCredentials: false,
				}
			);

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				toast.error("Please enter a valid email address");
				setLoading(false);
				return;
			}

			const user = response.data;
			if (user.err) toast.error(user.err);
			else {
				setUser({
					name: "",
					email: "",
					password: "",
					conPassword: "",
				});
				toast.success("User successfully added");
				navigate("/");
			}
		} catch (err) {
			console.log(err);
			toast.error("Server error. Please try again later.");
		}
		setLoading(false);
	};

	return (
		<div className="flex justify-center h-screen items-center bg-[#c4d8e1]">
			<main className="bg-white flex flex-col items-center p-10 gap-3 text-center w-[350px] rounded-2xl">
				<h1 className="text-blue-700 font-black text-2xl">Create Account</h1>
				<p className="text-sm">
					Create an account so you can explore all the best books
				</p>
				<form
					onSubmit={signupUser}
					className="flex flex-col gap-3 py-4 w-full">
					<input
						type="text"
						name="name"
						placeholder="Full Name"
						className="input"
						value={user.name}
						onChange={(e) => setUser({ ...user, name: e.target.value })}
					/>
					<input
						type="text"
						name="email"
						placeholder="Email"
						className="input"
						value={user.email}
						onChange={(e) => setUser({ ...user, email: e.target.value })}
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						className="input"
						value={user.password}
						onChange={(e) => setUser({ ...user, password: e.target.value })}
					/>
					<input
						type="password"
						name="conPassword"
						placeholder="Confirm Password"
						className="input"
						value={user.conPassword}
						onChange={(e) => setUser({ ...user, conPassword: e.target.value })}
					/>
					<button
						type="submit"
						disabled={loading}
						className="bg-[#1F41BB] text-white p-2 rounded-lg mt-5 hover:bg-[#3956bf] hover:ease-in-out hover:transition-opacity">
						{loading ? "Loading..." : "Sign up"}
					</button>
				</form>
				<Link
					className="text-xs hover:text-blue-600"
					to={"/"}>
					Already have an account?
				</Link>
			</main>
		</div>
	);
};

export default Signup;
