import { UPDATE_ACTIVITY, VIEW_ACTIVITY, UPDATE_ACTIVITY_WITH_USER } from '../constants/activityConstants';

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
		case UPDATE_ACTIVITY_WITH_USER:
			state.activity['tapLimit'] = payload.limit;
			return {
				...state,
			}
		default:
			return state;
	}
}

export default activityReducer;
