import express from "express";
import {
	createWorkout,
	getWorkout,
	getWorkouts,
	deleteWorkout,
	updateWorkout,
} from "../controller/workoutController.js";

const router = express.Router();

// GET ALL workouts
router.get("/", getWorkouts);

// GET single workout
router.get("/:id", getWorkout);

// POST a new workout
router.post("/", createWorkout);

// DELETE a workout
router.delete("/:id", deleteWorkout);

// UPDATE a workout
router.patch("/:id", updateWorkout);

export default router;
