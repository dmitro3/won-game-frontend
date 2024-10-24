import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import userReducer from './reducers/user';
import shopReducer from './reducers/shop';
import mineReducer from './reducers/mine';
import characterReducer from './reducers/character';
import OtherReducer from './reducers/other';
import ActivityReducer from './reducers/activity';

const reducer = combineReducers({
	user: userReducer,
	shop: shopReducer,
	mine: mineReducer,
	character: characterReducer,
	other: OtherReducer,
	activity: ActivityReducer,
});

const initialState = {
};

const store = createStore(reducer, initialState, applyMiddleware(thunk));

export default store;
