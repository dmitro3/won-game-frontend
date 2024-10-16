import { VIEW_ALL, VIEW_ITEM, WEAR_ITEM, GET_ITEM, VIEW_BY_TYPE } from '../constants/mineConstants';

const initialState = {
	items: [],
	item: [],
};

const mineReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case VIEW_ALL:
			return {
				...state,
				items: payload.data,
			};
		case VIEW_ITEM:
			return {
				...state,
				item: payload.data,
			}
		case GET_ITEM:
			return {
				...state,
				item: payload.data,
			}
		case VIEW_BY_TYPE:
			return {
				...state,
				items: payload.data,
			}
		case WEAR_ITEM:
			return {
				...state,
				items: payload.data,
			}
		default:
			return state;
	}
}

export default mineReducer;
