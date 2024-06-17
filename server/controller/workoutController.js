import mongoose from "mongoose";
import { Workout } from "../model/workoutModel.js";

const getWorkouts = async (req, res) => {
	const workouts = await Workout.find({}).sort({ createdAt: -1 });
	res.json(workouts);
};

const getWorkout = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id))
		return res.json({ err: "No such workout" });

	const workout = await Workout.findById(id);

	if (!workout) return res.json({ err: "No workout found" });

	return res.json(workout);
};

const createWorkout = async (req, res) => {
	try {
		const { title, reps, load } = req.body;
		if (!title && !reps && !load) {
			return res.json({
				err: "Please enter the fields",
			});
		}
		if (!title) {
			return res.json({
				err: "Please enter a title",
			});
		}
		if (!reps) {
			return res.json({
				err: "Please enter how many repititions",
			});
		}
		if (!load) {
			return res.json({
				err: "Please enter how many loads in kg",
			});
		}
		const workout = await Workout.create({ title, reps, load });
		res.json(workout);
	} catch (err) {
		res.json({ err: err.message });
	}
};

const deleteWorkout = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id))
		return res.json({ err: "No such workout" });

	const workout = await Workout.findOneAndDelete({ _id: id });

	if (!workout) return res.json({ err: "No workout found" });

	return res.json(workout);
};

const updateWorkout = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id))
		return res.json({ err: "No such workout" });

	const workout = await Workout.findOneAndUpdate({ _id: id }, { ...req.body });

	if (!workout) return res.json({ err: "No workout found" });

	return res.json(workout);
};

export { getWorkouts, getWorkout, createWorkout, deleteWorkout, updateWorkout };
