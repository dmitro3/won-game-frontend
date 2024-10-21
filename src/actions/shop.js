import { VIEW_ITEMS, BUY_ITEM, MAKE_ITEM } from '../constants/shopConstants';
import {
  serverUrl,
} from '../utils/constants';
import { api } from '../utils/api';

export const viewItems = () => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/shop`, 'post', {}, state.other.token);
    dispatch({
      type: VIEW_ITEMS,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const makeItem = (itemData) => async (dispatch, getState) => {
  console.log("itemData", itemData);
  let state = getState();
  try {
    const res = await api(`${serverUrl}/shop/new`, 'post', itemData, state.other.token);
    dispatch({
      type: MAKE_ITEM,
      payload: res.data
    });
    console.log("new item", res.data);
  } catch (err) {
    console.log(err);
  }
};

export const buyItem = ({telegramId, itemData}, callback) => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/shop/${telegramId}`, 'put', {
      name: itemData.username,
      id: itemData.id,
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
