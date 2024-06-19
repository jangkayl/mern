import express from "express";
import cors from "cors";
import { verifyToken } from "./user.js";
import {
	createWorkout,
	getWorkout,
	getWorkouts,
	deleteWorkout,
	updateWorkout,
} from "../controller/workoutController.js";

const router = express.Router();

router.use(
	cors({
		origin: ["http://kylemern.vercel.app"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);

// GET ALL workouts
router.get("/", verifyToken, getWorkouts);

// GET single workout
router.get("/:id", verifyToken, getWorkout);

// POST a new workout
router.post("/", verifyToken, createWorkout);

// DELETE a workout
router.delete("/:id", verifyToken, deleteWorkout);

// UPDATE a workout
router.patch("/:id", verifyToken, updateWorkout);

export default router;
