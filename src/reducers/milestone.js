import { VIEW_MILESTONES, UPDATE_MILESTONE } from '../constants/milestoneConstants';

const initialState = {
	milestones: [],
};

const milestoneReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case VIEW_MILESTONES:
			return {
				...state,
				milestones: payload.data,
			};
		case UPDATE_MILESTONE:
			return {
				...state,
				milestones: payload.data,
			};
		default:
			return state;
	}
}

export default milestoneReducer;
