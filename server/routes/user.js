import express from "express";
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

export { router };
