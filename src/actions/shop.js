import axios from 'axios';
import { VIEW_ITEMS, BUY_ITEM } from '../constants/shopConstants';
import {
  serverUrl,
  telegramId,
  username,
} from '../utils/constants';
import { api } from '../utils/api';

export const viewItems = () => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/shop`, 'post', {name: username}, state.other.token);
    dispatch({
      type: VIEW_ITEMS,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const buyItem = (userData, callback) => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/shop/${telegramId}`, 'put', {
      name: username,
      id: userData.id,
    }, state.other.token);
    
    dispatch({
      type: BUY_ITEM,
      payload: res.data
    });

    if (callback) callback();
  } catch (err) {
    console.log(err);
  }
};
