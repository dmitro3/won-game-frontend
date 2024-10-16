import axios from 'axios';
import { VIEW_MILESTONES, UPDATE_MILESTONE } from '../constants/milestoneConstants';

import {
  serverUrl,
  telegramId,
  username,
} from '../utils/constants';

export const viewMilestones = () => async dispatch => {
  try {
    const res = await axios.post(`${serverUrl}/milestone/${telegramId}`, {name: username});
    dispatch({
      type: VIEW_MILESTONES,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateMilestone = (userData) => async dispatch => {
  try {
    const res = await axios.put(`${serverUrl}/milestone/${telegramId}`, 
      {
        name: username,
        id: userData.id,
      });
    
    dispatch({
      type: UPDATE_MILESTONE,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};
