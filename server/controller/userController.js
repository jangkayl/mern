import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signupUser = async (req, res) => {
	try {
		const { name, email, password, conPassword } = req.body;
		if (!name && !email && !password && !conPassword)
			return res.json({
				err: "Please input all the fields",
			});
		if (!name)
			return res.json({
				err: "Name is required",
			});
		if (!email)
			return res.json({
				err: "Please enter an email",
			});
		const exist = await User.findOne({ email });
		if (exist)
			return res.json({
				err: "Email already exists, please enter another email",
			});
		if (!password)
			return res.json({
				err: "Please enter a password",
			});
		if (!conPassword)
			return res.json({
				err: "Please confirm your password",
			});
		if (password !== conPassword)
			return res.json({ err: "Passwords do not match" });

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		return res.json(user);
	} catch (err) {
		console.log(err);
		res.json({
			err: "Server error",
		});
	}
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email && !password)
			return res.json({
				err: "Please input all fields",
			});
		if (!email)
			return res.json({
				err: "Please enter an email",
			});
		if (!password)
			return res.json({
				err: "Please enter a password",
			});

		const user = await User.findOne({ email });
		if (!user)
			return res.json({
				err: "No user found",
			});
		const match = await bcrypt.compare(password, user.password);
		if (match) {
			jwt.sign(
				{ email: user.email, id: user._id, name: user.name },
				process.env.JWT_SECRET,
				{ expiresIn: "1h" },
				(err, token) => {
					if (err) {
						return res.status(500).json({ err: "Error generating token" });
					}
					res.status(200).json({ token, name: user.name });
				}
			);
		} else
			return res.json({
				err: "Incorrect password",
			});
	} catch (err) {
		console.log(err);
	}
};

const editUser = async (req, res) => {
	try {
		const { name, email } = req.body;

		if (!name || !email) {
			return res.json({ err: "Please fill all the fields" });
		}

		const { id } = req.params;

		// Find the current user data
		const currentUser = await User.findById(id);
		if (!currentUser) {
			return res.json({ err: "User not found" });
		}

		// Check if the new email is already in use by another user
		const emailExists = await User.findOne({ email });
		if (emailExists && emailExists._id.toString() !== id) {
			return res.json({ err: "Email already in use by another user" });
		}

		// Check if the new data is the same as the current data
		if (currentUser.name === name && currentUser.email === email) {
			return res.json({ err: "Need to change something" });
		}

		// Update the user data
		const user = await User.findByIdAndUpdate(
			id,
			{ name, email },
			{ new: true }
		);

		return res.json({ userData: user });
	} catch (err) {
		console.log(err.message);
		res.send({ err: err.message });
	}
};

const dashboard = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (!user) return res.json({ err: "User not found" });

		return res.json({
			userData: user,
		});
	} catch (err) {
		console.log(err);
		res.json({
			err: "Server error",
		});
	}
};

export { signupUser, loginUser, dashboard, editUser };
