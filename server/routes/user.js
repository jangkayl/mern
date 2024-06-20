import express from "express";
import jwt from "jsonwebtoken";
import {
	signupUser,
	loginUser,
	dashboard,
	editUser,
} from "../controller/userController.js";

const router = express.Router();

// Test
router.get("/", (req, res) => {
	res.json({
		err: "Test is working",
	});
});

// Signup
router.post("/signup", signupUser);

// Login
router.post("/login", loginUser);

// Verify JWT token
const verifyToken = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) return res.json({ err: "Access denied" }, token);
	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	} catch (err) {
		res.json({ err: "Invalid token" });
	}
};

// Get user info for Dashboard
router.get("/dashboard", dashboard);

// Edit Profile
router.put("/dashboard/:id", editUser);

// Logout user
router.post("/logout", (req, res) => {
	res
		.clearCookie("token", "", { expires: new Date(0) })
		.json({ err: "Logout successfully" });
});

export { router, verifyToken };
