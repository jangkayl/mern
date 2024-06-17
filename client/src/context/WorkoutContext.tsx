import React, { createContext, useReducer, ReactNode, Dispatch } from "react";

interface Workout {
	createdAt: string;
	_id: string;
	title: string;
	reps: number;
	load: number;
}

type Action =
	| { type: "SET_WORKOUTS"; payload: Workout[] }
	| { type: "CREATE_WORKOUT"; payload: Workout }
	| { type: "DELETE_WORKOUT"; payload: Workout };

interface WorkoutsState {
	workouts: Workout[] | null;
}

const initialState: WorkoutsState = {
	workouts: null,
};

const workoutsReducer = (
	state: WorkoutsState,
	action: Action
): WorkoutsState => {
	switch (action.type) {
		case "SET_WORKOUTS":
			return {
				workouts: action.payload,
			};
		case "CREATE_WORKOUT":
			return {
				workouts: state.workouts
					? [action.payload, ...state.workouts]
					: [action.payload],
			};
		case "DELETE_WORKOUT":
			return {
				workouts: state.workouts
					? state.workouts.filter((w) => w._id !== action.payload._id)
					: null,
			};
		default:
			return state;
	}
};

interface WorkoutsContextProps {
	state: WorkoutsState;
	dispatch: Dispatch<Action>;
}

export const WorkoutsContext = createContext<WorkoutsContextProps>({
	state: initialState,
	dispatch: () => null,
});

export const WorkoutsContextProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(workoutsReducer, initialState);

	return (
		<WorkoutsContext.Provider value={{ state, dispatch }}>
			{children}
		</WorkoutsContext.Provider>
	);
};

export const useWorkoutsContext = () => React.useContext(WorkoutsContext);
