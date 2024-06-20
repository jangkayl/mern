import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);

	const loginUser = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const { email, password } = user;
		setLoading(true);
		try {
			const response = await axios.post(
				"/login",
				{
					email,
					password,
				},
				{
					withCredentials: true,
				}
			);
			const user = response.data;
			if (user.err) toast.error(user.err);
			else {
				setUser({
					email: "",
					password: "",
				});
				toast(`Hello ${user.name}`, {
					icon: "👏",
					style: {
						borderRadius: "10px",
						background: "#333",
						color: "#fff",
					},
				});
				navigate("/dashboard");
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
				<h1 className="text-blue-700 font-black text-2xl">Login Here</h1>
				<p className="text-sm">Welcome back you’ve been missed!</p>
				<form
					onSubmit={loginUser}
					className="flex flex-col gap-3 py-4 w-full">
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
					<button
						type="submit"
						disabled={loading}
						className="bg-[#1F41BB] text-white p-2 rounded-lg mt-5 hover:bg-[#3956bf] hover:ease-in-out hover:transition-opacity">
						{loading ? "Loading..." : "Login"}
					</button>
				</form>
				<Link
					className="text-xs hover:text-blue-600"
					to={"/signup"}>
					Create new account
				</Link>
			</main>
		</div>
	);
};

export default Login;
