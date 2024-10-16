import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import earnReducer from './reducers/earn';
import shopReducer from './reducers/shop';
import mineReducer from './reducers/mine';
import milestoneReducer from './reducers/milestone';
import characterReducer from './reducers/character';
import OtherReducer from './reducers/other';
import ActivityReducer from './reducers/activity';

const reducer = combineReducers({
	earn: earnReducer,
	shop: shopReducer,
	mine: mineReducer,
	milestone: milestoneReducer,
	character: characterReducer,
	other: OtherReducer,
	activity: ActivityReducer,
});

const initialState = {
};

const store = createStore(reducer, initialState, applyMiddleware(thunk));

export default store;
