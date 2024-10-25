import { LOAD_MONSTERS, SHOW_PAYMENT, SET_RANKING, SET_TARGET_MONSTER, SET_TELEGRAM_CONFIG, SET_API_TOKEN, ADD_LEVEL, ADD_MONSTER, ADD_CHALLENGE, SHOW_LOADING } from '../constants/otherConstants';
import {
  baseUrl,
  serverUrl
} from '../utils/constants';
import { api } from '../utils/api';

export const getRanking = () => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/user/ranking`, 'get', null, state.other.token, dispatch);
  dispatch({
    type: SET_RANKING,
    payload: res.data
  });
};

export const getMonsters = () => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/etc/monster`, 'get', null, state.other.token, dispatch);
  dispatch({
    type: LOAD_MONSTERS,
    payload: res.data
  });
};

export const getChallenge = (idx) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/etc/challenge/${idx}`, 'get', null, state.other.token);
  console.log("getchallenge", res);
  dispatch({
    type: SET_TARGET_MONSTER,
    payload: res.data.data,
  });
};

export const addLevel = (itemData) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/etc/level/new`, 'post', itemData, state.other.token);
  dispatch({
    type: ADD_LEVEL,
    payload: res.data
  });
};

export const addMonster = (itemData) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/etc/monster/new`, 'post', itemData, state.other.token);
  dispatch({
    type: ADD_MONSTER,
    payload: res.data
  });
};

export const addChallenge = (itemData) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/etc/challenge/new`, 'post', itemData, state.other.token);
  dispatch({
    type: ADD_CHALLENGE,
    payload: res.data
  });
};

export const showPayment = (value) => dispatch => {
  dispatch({
    type: SHOW_PAYMENT,
    payload: value,
  });
};

export const showLoading = (value) => dispatch => {
  dispatch({
    type: SHOW_LOADING,
    payload: value,
  });
};

export const setFightMonster = (monster) => dispatch => {
  dispatch({
    type: SET_TARGET_MONSTER,
    payload: monster,
  });
};

export const setTelegramConfig = (teledata) => dispatch => {
  dispatch({
    type: SET_TELEGRAM_CONFIG,
    payload: teledata,
  })
}

export const getApiToken = () => async dispatch => {
  let result = await api(`${baseUrl}/api_token`, 'get');
  let { data } = result;

  if (!data || !data.token) return;

  dispatch({
    type: SET_API_TOKEN,
    payload: data.token,
  })
}
