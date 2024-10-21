import { VIEW_ALL, VIEW_ITEM, WEAR_ITEM, GET_ITEM, VIEW_BY_TYPE } from '../constants/mineConstants';
import {
  serverUrl,
} from '../utils/constants';
import { api } from '../utils/api';

export const viewAll = ({telegramId, username}) => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/mine/${telegramId}`, 'get', null, state.other.token);
    console.log("minedata", res.data);
    dispatch({
      type: VIEW_ALL,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const viewItem = ({telegramId, data}) => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/mine/${telegramId}`, 'post', {
      name: data.username,
      id: data.id,
    }, state.other.token);
    
    dispatch({
      type: VIEW_ITEM,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

// Get item by ID
export const getItem = () => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/mine/}`, 'get', state.other.token);
    dispatch({
      type: GET_ITEM,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const wearItem = ({telegramId, itemData}) => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/mine/${telegramId}`, 'put', {
      name: itemData.username,
      id: itemData.id,
      type: itemData.type
    }, state.other.token);
    
    dispatch({
      type: WEAR_ITEM,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};
