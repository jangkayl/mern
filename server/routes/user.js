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
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		console.log(err);

		if (err) return res.sendStatus(403);

		req.user = user;

		next();
	});
};

// Get user info for Dashboard
router.get("/dashboard", verifyToken, dashboard);

// Edit Profile
router.put("/dashboard/:id", verifyToken, editUser);

// Logout user
router.post("/logout", (req, res) => {
	res
		.clearCookie("token", "", { expires: new Date(0) })
		.json({ err: "Logout successfully" });
});

export { router, verifyToken };
