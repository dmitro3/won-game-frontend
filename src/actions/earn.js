import { 
  VIEW_USER, 
  UPDATE_USER,
  UPDATE_TOKEN,
} from '../constants/earnConstants';

import {
  serverUrl,
} from '../utils/constants';
import { api } from '../utils/api';

export const viewUser = ({telegramId, username}) => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/user/${telegramId}`, 'post', {name: username}, state.other.token);
    dispatch({
      type: VIEW_USER,
      payload: res.data
    });
  } catch (err) { 
    console.log(err);
  }
};

export const updateUser = ({telegramId, data}) => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/user/${telegramId}`, 'put', data, state.other.token);
    dispatch({
      type: UPDATE_USER,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateToken = ({telegramId, tokenToAdd}) => async (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    let state = getState();
    try {
      const res = await api(`${serverUrl}/user/token/${telegramId}`, 'put', {tokenToAdd}, state.other.token);
      dispatch({
        type: UPDATE_TOKEN,
        payload: res.data,
      });
      resolve(JSON.stringify(res.data));
    } catch (err) {
      reject(err);
    }
  })
  
};
