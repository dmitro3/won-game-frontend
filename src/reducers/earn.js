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
			console.log("updated---", payload.level);
			return {
				...state,
				user: payload.data,
				level: payload.level
			};
		case UPDATE_TOKEN:
			console.log(state);
			state.user['tokens'] = payload;
			return {
				...state,
			};
		default:
			return state;
	}
}

export default earnReducer;
