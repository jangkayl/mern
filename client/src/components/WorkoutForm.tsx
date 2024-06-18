import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useWorkoutsContext } from "../context/WorkoutContext";

interface ErrorState {
	title: boolean;
	reps: boolean;
	load: boolean;
	[key: string]: boolean;
}

const WorkoutForm = () => {
	const { dispatch } = useWorkoutsContext();
	const [workout, setWorkout] = useState({
		title: "",
		reps: "",
		load: "",
	});
	const [error, setError] = useState<ErrorState>({
		title: false,
		reps: false,
		load: false,
	});
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const { title, reps, load } = workout;
		try {
			if (!title || !reps || !load) {
				setError({
					title: !title,
					reps: !reps,
					load: !load,
				});
			}

			const response = await axios.post(
				"/user",
				{ title, reps, load },
				{
					withCredentials: true,
				}
			);

			const workout = response.data;

			if (workout.err) {
				toast.error(workout.err);
			} else {
				dispatch({ type: "CREATE_WORKOUT", payload: response.data });
				toast.success("Workout added successfully");
				setWorkout({
					title: "",
					reps: "",
					load: "",
				});
				setError({
					title: false,
					reps: false,
					load: false,
				});
			}
		} catch (err) {
			console.error(err);
			toast.error("Error adding workout. Please try again.");
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setWorkout({
			...workout,
			[name]: value,
		});

		// Clear error when user starts typing in a field
		if (error[name]) {
			setError({
				...error,
				[name]: false,
			});
		}
	};

	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-2">
				<h1 className="text-xl font-bold text-gray-800 mb-4">
					Add New Workout
				</h1>
				<label className="text-gray-600">Exercise Title:</label>
				<input
					type="text"
					name="title"
					onChange={handleInputChange}
					value={workout.title}
					className={`p-2 border ${
						error.title ? "border-red-500" : "border-gray-300"
					} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
				/>
				{error.title && (
					<p className="text-red-500 text-sm mt-[-4px]">Please enter a title</p>
				)}
				<label className="text-gray-600">Reps:</label>
				<input
					type="number"
					name="reps"
					onChange={handleInputChange}
					value={workout.reps}
					className={`p-2 border ${
						error.reps ? "border-red-500" : "border-gray-300"
					} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
				/>
				{error.reps && (
					<p className="text-red-500 text-sm mt-[-4px]">Please enter reps</p>
				)}
				<label className="text-gray-600">Load (kg):</label>
				<input
					type="number"
					name="load"
					onChange={handleInputChange}
					value={workout.load}
					className={`p-2 border ${
						error.load ? "border-red-500" : "border-gray-300"
					} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
				/>
				{error.load && (
					<p className="text-red-500 text-sm mt-[-4px]">Please enter load</p>
				)}
				<button
					type="submit"
					className="bg-blue-500 mt-3 text-white p-2 rounded-md hover:bg-blue-700 transition">
					Add Workout
				</button>
			</form>
		</div>
	);
};

export default WorkoutForm;
