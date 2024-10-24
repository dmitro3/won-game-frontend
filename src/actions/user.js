import { VIEW_USER, UPDATE_USER, UPDATE_TOKEN } from '../constants/userConstants';
import { serverUrl } from '../utils/constants';
import { api } from '../utils/api';

export const loadUser = ({telegramId, username}) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/user/${telegramId}`, 'post', {name: username}, state.other.token, dispatch);
  dispatch({
    type: VIEW_USER,
    payload: res.data
  });
};

export const updateUser = ({telegramId, data}) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/user/${telegramId}`, 'put', data, state.other.token);
  dispatch({
    type: UPDATE_USER,
    payload: res.data
  });
};

export const updateToken = ({telegramId, tokenToAdd}) => async (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    let state = getState();
      const res = await api(`${serverUrl}/user/token/${telegramId}`, 'put', {tokenToAdd}, state.other.token);
      dispatch({
        type: UPDATE_TOKEN,
        payload: res.data,
      });
      resolve(JSON.stringify(res.data));
  })
};
