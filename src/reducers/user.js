import { UPDATE_TOKEN, UPDATE_USER, VIEW_USER } from '../constants/userConstants';

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
				user: payload.user,
				level: payload.level
			};
		case UPDATE_USER:
			return {
				...state,
				user: payload.user,
				level: payload.level
			};
		case UPDATE_TOKEN:
			state.user['tokens'] = payload.user;
			return {
				...state,
			};
		default:
			return state;
	}
}

export default earnReducer;
