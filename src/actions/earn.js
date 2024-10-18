import axios from 'axios';
import { 
  VIEW_USER, 
  UPDATE_USER,
} from '../constants/earnConstants';

import {
  serverUrl,
  telegramId,
  username,
} from '../utils/constants';

export const viewUser = () => async dispatch => {
  try {
    const res = await axios.post(`${serverUrl}/user/${telegramId}`, {name: username});
    dispatch({
      type: VIEW_USER,
      payload: res.data
    });
  } catch (err) { 
    console.log(err);
  }
};

export const updateUser = (userData) => async dispatch => {
  console.log("userdata123", userData);
  try {
    const res = await axios.put(`${serverUrl}/user/${telegramId}`, userData);
    dispatch({
      type: UPDATE_USER,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};
