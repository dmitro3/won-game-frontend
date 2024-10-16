import axios from 'axios';
import { LOAD_MONSTERS, SHOW_PAYMENT, SET_RANKING, SET_TARGET_MONSTER } from '../constants/otherConstants';
import {
  serverUrl
} from '../utils/constants';

export const getRanking = () => async dispatch => {
  try {
    const res = await axios.get(`${serverUrl}/user/ranking`);
    dispatch({
      type: SET_RANKING,
      payload: res.data
    });
  } catch (err) { 
    console.log(err);
  }
};

export const getMonsters = () => async dispatch => {
  try {
    const res = await axios.get(`${serverUrl}/etc/monster`);
    dispatch({
      type: LOAD_MONSTERS,
      payload: res.data
    });
  } catch (err) { 
    console.log(err);
  }
};

export const getChallenge = (idx) => async dispatch => {
  try {
    const res = await axios.get(`${serverUrl}/etc/challenge/${idx}`);
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
