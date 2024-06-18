import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutDetails from "../components/WorkoutDetails";
import { useWorkoutsContext } from "../context/WorkoutContext";

const Workout = () => {
	const { state, dispatch } = useWorkoutsContext();
	const { workouts } = state;
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		axios
			.get("/user", { withCredentials: true })
			.then((response) => {
				if (isMounted) {
					if (response.data.err) {
						navigate("/");
					} else {
						dispatch({ type: "SET_WORKOUTS", payload: response.data });
						toast.success("Here's your workout plan");
					}
				}
			})
			.catch(() => {
				if (isMounted) {
					toast.error("Error on fetching the data");
					navigate("/");
				}
			})
			.finally(() => {
				if (isMounted) {
					setLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [dispatch, navigate]);

	return (
		<div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex justify-center items-center py-10">
			<main className="flex flex-col md:flex-row w-full max-w-5xl p-4 space-y-10 md:space-y-0 md:space-x-10">
				<section className="bg-white shadow-md rounded-lg p-8 w-full md:w-1/2 h-[500px] overflow-hidden flex flex-col">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-2xl font-bold text-gray-800">Workout</h1>
						<Link
							to={"/dashboard"}
							className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 text-xs">
							Back to dashboard
						</Link>
					</div>
					{loading ? <p className="text-center">Loading...</p> : ""}
					{!loading && workouts?.length === 0 && (
						<div className="text-center">No workout plan</div>
					)}
					<div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
						{workouts &&
							workouts.length > 0 &&
							workouts.map((workout) => (
								<WorkoutDetails
									workout={workout}
									key={workout._id}
								/>
							))}
					</div>
				</section>
				<section className="bg-white shadow-md rounded-lg p-8 w-full md:w-1/2">
					<WorkoutForm />
				</section>
			</main>
		</div>
	);
};

export default Workout;
