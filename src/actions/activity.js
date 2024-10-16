import axios from 'axios';
import { 
  VIEW_ACTIVITY, 
  UPDATE_ACTIVITY,
} from '../constants/activityConstants';

import {
  serverUrl,
  telegramId,
  username,
} from '../utils/constants';

export const viewActivity = () => async dispatch => {
  try {
    const res = await axios.post(`${serverUrl}/activity/${telegramId}`, {name: username});
    dispatch({
      type: VIEW_ACTIVITY,
      payload: res.data
    });
  } catch (err) { 
    console.log(err);
  }
};

export const updateActivity = (userData) => async dispatch => {
  try {
    const res = await axios.put(`${serverUrl}/activity/${telegramId}`, userData);
    dispatch({
      type: UPDATE_ACTIVITY,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};
