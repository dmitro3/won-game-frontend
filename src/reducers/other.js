import { LOAD_MONSTERS, SET_RANKING, SET_TARGET_MONSTER, SHOW_PAYMENT, SET_TELEGRAM_CONFIG, SET_API_TOKEN, ADD_LEVEL, ADD_MONSTER, ADD_CHALLENGE } from '../constants/otherConstants';
import { telegramId, username } from '../utils/constants';
const initialState = {
	ranking: [],
	monster: [],
	showPayment: false,
	fightMonster: null,
	telegramId: telegramId,
	username: username,
	token: '',
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
		case ADD_LEVEL:
			return {
				...state,
			};
		case ADD_MONSTER:
			return {
				...state,
			};
		case ADD_CHALLENGE:
			return {
				...state,
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
		case SET_TELEGRAM_CONFIG:
			return {
				...state,
				telegramId: payload.telegramId ? payload.telegramId : state.telegramId,
				username: payload.username ? payload.username: state.username
			}
		case SET_API_TOKEN:
			return {
				...state,
				token: payload,
			}
		default:
			return state;
	}
}

export default otherReducer;
