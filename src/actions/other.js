import axios from 'axios';
import { LOAD_MONSTERS, SHOW_PAYMENT, SET_RANKING, SET_TARGET_MONSTER, SET_TELEGRAM_CONFIG, SET_API_TOKEN } from '../constants/otherConstants';
import {
  baseUrl,
  serverUrl
} from '../utils/constants';
import { api } from '../utils/api';

export const getRanking = () => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/user/ranking`, 'get', null, state.other.token);
    dispatch({
      type: SET_RANKING,
      payload: res.data
    });
  } catch (err) { 
    console.log(err);
  }
};

export const getMonsters = () => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/etc/monster`, 'get', null, state.other.token);
    dispatch({
      type: LOAD_MONSTERS,
      payload: res.data
    });
  } catch (err) { 
    console.log(err);
  }
};

export const getChallenge = (idx) => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/etc/challenge/${idx}`, 'get', null, state.other.token);
    dispatch({
      type: SET_TARGET_MONSTER,
      payload: res.data.data,
    });
  } catch (err) { 
    console.log(err);
  }
};

export const showPayment = (value) => dispatch => {
  dispatch({
    type: SHOW_PAYMENT,
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

  if (data && data.token) {
    console.log("TOken Get Result", data.token);
  } else {
    return;
  }

  dispatch({
    type: SET_API_TOKEN,
    payload: data.token,
  })
}
