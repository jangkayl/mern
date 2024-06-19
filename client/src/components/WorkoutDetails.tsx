import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { useWorkoutsContext } from "../context/WorkoutContext";
import { formatDistanceToNow } from "date-fns";

interface WorkoutProps {
	createdAt: string;
	_id: string;
	title: string;
	reps: number;
	load: number;
}

const WorkoutDetails: React.FC<{ workout: WorkoutProps }> = ({ workout }) => {
	const { dispatch } = useWorkoutsContext();

	const handleDelete = async () => {
		try {
			const response = await axios.delete(`/user/${workout._id}`);

			if (response.status === 200) {
				dispatch({ type: "DELETE_WORKOUT", payload: response.data });
			}
		} catch (error) {
			console.error("Failed to delete the workout", error);
		}
	};
	return (
		<div className="rounded-lg p-5 bg-white shadow-md text-sm space-y-1 relative my-2">
			<div>
				<p className="font-bold text-lg text-gray-700">{workout.title}</p>
				<p className="text-gray-600">
					<strong>Reps:</strong> {workout.reps}
				</p>
				<p className="text-gray-600">
					<strong>Load (kg):</strong> {workout.load}
				</p>
				<p className="text-gray-400 text-xs">
					{formatDistanceToNow(new Date(workout.createdAt), {
						addSuffix: true,
					})}
				</p>
			</div>
			<button
				onClick={handleDelete}
				className="absolute top-4 right-4 hover:text-red-500">
				<MdDeleteForever size={25} />
			</button>
		</div>
	);
};

export default WorkoutDetails;
