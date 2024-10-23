import { UPDATE_TOKEN, UPDATE_USER, VIEW_USER } from '../constants/earnConstants';

const initialState = {
	user: {},
	level: {},
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
		case UPDATE_TOKEN:
			state.user['tokens'] = payload.data;
			return {
				...state,
			};
		default:
			return state;
	}
}

export default earnReducer;
