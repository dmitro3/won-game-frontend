import { VIEW_ITEMS, BUY_ITEM, MAKE_ITEM } from '../constants/shopConstants';
import { serverUrl } from '../utils/constants';
import { api } from '../utils/api';

export const viewItems = () => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/shop`, 'post', {}, state.other.token, dispatch);
  dispatch({
    type: VIEW_ITEMS,
    payload: res.data
  });
};

export const makeItem = (itemData) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/shop/new`, 'post', itemData, state.other.token);
  dispatch({
    type: MAKE_ITEM,
    payload: res.data
  });
};

export const buyItem = ({telegramId, itemData}, callback) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/shop/${telegramId}`, 'put', {
    name: itemData.username,
    id: itemData.id,
  }, state.other.token);
  
  dispatch({
    type: BUY_ITEM,
    payload: res.data
  });

  if (callback) callback();
};
