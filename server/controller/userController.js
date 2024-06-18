import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";
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
		const hashedPassword = await new Promise((resolve, reject) => {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, (err, hash) => {
					resolve(hash);
				});
			});
		});

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
		if (match)
			jwt.sign(
				{ email: user.email, id: user._id, name: user.name },
				process.env.JWT_SECRET,
				{ expiresIn: "1h" },
				(err, token) => {
					if (err) throw token;
					res.cookie("token", token, { httpOnly: true }).json(user);
				}
			);
		else
			return res.json({
				err: "Incorrect password",
			});
	} catch (err) {
		console.log(err);
	}
};

const editUser = async (req, res) => {
	try {
		if (!req.body.name || !req.body.email) {
			return res.status(400).send({ err: "Send all required fields" });
		}

		const { id } = req.params;

		const user = await User.findByIdAndUpdate(id, req.body, { new: true });

		if (!user) {
			return res.status(404).json({ err: "User not found" });
		}

		return res.status(200).json({ userData: user });
	} catch (err) {
		console.log(err.message);
		res.status(500).send({ err: err.message });
	}
};

const dashboard = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

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
