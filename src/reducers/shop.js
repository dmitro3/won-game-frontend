import { BUY_ITEM, VIEW_ITEMS, MAKE_ITEM } from '../constants/shopConstants';

const initialState = {
	items: [],
};

const shopReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case VIEW_ITEMS:
			return {
				...state,
				items: payload.data,
			};
		case BUY_ITEM:
			return {
				...state,
				items: payload.data,
			};
		case MAKE_ITEM:
			return {
				...state,
			};
		default:
			return state;
	}
}

export default shopReducer;
