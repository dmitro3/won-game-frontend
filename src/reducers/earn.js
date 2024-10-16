import { UPDATE_USER, VIEW_USER } from '../constants/earnConstants';

const initialState = {
	user: {},
	level: [],
};

const earnReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case VIEW_USER:
			return {
				...state,
				user: payload.data,
				level: payload.level
			};
		case UPDATE_USER:
			return {
				...state,
				user: payload.data,
				level: payload.level
			};
		default:
			return state;
	}
}

export default earnReducer;
