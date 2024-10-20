import axios from 'axios';
import { VIEW_ALL, VIEW_ITEM, WEAR_ITEM, GET_ITEM, VIEW_BY_TYPE } from '../constants/mineConstants';

import {
  serverUrl,
  telegramId,
  username,
} from '../utils/constants';

export const viewAll = () => async dispatch => {
  try {
    const res = await axios.get(`${serverUrl}/mine/${telegramId}`);
    console.log("Mine Data", res);
    dispatch({
      type: VIEW_ALL,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const viewByType = (userData) => async dispatch => {
  try {
    const res = await axios.post(`${serverUrl}/mine/`, {type: userData.type});
    console.log("Mine Data By Type", res);
    dispatch({
      type: VIEW_BY_TYPE,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const viewItem = (userData) => async dispatch => {
  try {
    const res = await axios.post(`${serverUrl}/mine/${telegramId}`, 
    {
      name: username,
      id: userData.id,
    });
    console.log("Mine Data View By ID", res);
    
    dispatch({
      type: VIEW_ITEM,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

// Get item by ID
export const getItem = () => async dispatch => {
  try {
    const res = await axios.get(`${serverUrl}/mine/`);
    console.log("Mine Data Get Item", res);    
    dispatch({
      type: GET_ITEM,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const wearItem = (userData) => async dispatch => {
  try {
    const res = await axios.put(`${serverUrl}/mine/${telegramId}`, 
    {
      name: username,
      id: userData.id,
      type: userData.type
    });
    console.log("Mine Data Wear Item", res);
    
    dispatch({
      type: WEAR_ITEM,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};
