import { VIEW_CHARACTERS, UNLOCK_CHARACTER } from '../constants/characterConstants';

const initialState = {
	characters: [],
	character: {}
};

const characterReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case VIEW_CHARACTERS:
			return {
				...state,
				characters: payload.data,
			};
		case UNLOCK_CHARACTER:
			console.log("payload", payload.data);
			return {
				...state,
				characters: payload.data,
			};
		default:
			return state;
	}
}

export default characterReducer;
