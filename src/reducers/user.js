import { UPDATE_TOKEN, UPDATE_USER, VIEW_USER } from '../constants/userConstants';
import { UPDATE_ACTIVITY_WITH_USER, UPDATE_USER_WITH_LIFE, UPDATE_USER_WITH_ATTACK, UPDATE_USER_WITH_DEFENCE } from '../constants/activityConstants';

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
		case UPDATE_ACTIVITY_WITH_USER:
			state.user['currentEnergy'] = payload.energy;
			return {
				...state,
			}
		case UPDATE_USER_WITH_LIFE:
			state.user['lifeItems'] = payload.lifeItems;
			return {
				...state,
			}	
		case UPDATE_USER_WITH_ATTACK:
			state.user['defenceItems'] = payload.defenceItems;
			return {
				...state,
			}
		case UPDATE_USER_WITH_DEFENCE:
			state.user['attackItems'] = payload.attackItems;
			return {
				...state,
			}
		default:
			return state;
	}
}

export default earnReducer;
