import { LOAD_MONSTERS, SET_RANKING, SET_TARGET_MONSTER, SHOW_PAYMENT } from '../constants/otherConstants';

const initialState = {
	ranking: [],
	monster: [],
	showPayment: false,
	fightMonster: null,
};

const otherReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case SET_RANKING:
			return {
				...state,
				ranking: payload.data,
			};
		case LOAD_MONSTERS:
			return {
				...state,
				monster: payload.data,
			};
		case SHOW_PAYMENT:
			return {
				...state,
				showPayment: payload,
			};
		case SET_TARGET_MONSTER:
			return {
				...state,
				fightMonster: payload,
			};	
		default:
			return state;
	}
}

export default otherReducer;
