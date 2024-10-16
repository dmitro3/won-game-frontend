import { UPDATE_ACTIVITY, VIEW_ACTIVITY } from '../constants/activityConstants';

const initialState = {
	activity: {},
};

const activityReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case VIEW_ACTIVITY:
			return {
				...state,
				activity: payload.data,
			};
		case UPDATE_ACTIVITY:
			return {
				...state,
				activity: payload.data,
			};
		default:
			return state;
	}
}

export default activityReducer;
