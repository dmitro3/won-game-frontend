import axios from 'axios';
import { VIEW_ITEMS, BUY_ITEM } from '../constants/shopConstants';

import {
  serverUrl,
  telegramId,
  username,
} from '../utils/constants';

export const viewItems = () => async dispatch => {
  try {
    const res = await axios.post(`${serverUrl}/shop`, {name: username});
    dispatch({
      type: VIEW_ITEMS,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const buyItem = (userData, callback) => async dispatch => {
  try {
    const res = await axios.put(`${serverUrl}/shop/${telegramId}`, 
      {
        name: username,
        id: userData.id,
      });
    
    dispatch({
      type: BUY_ITEM,
      payload: res.data
    });

    if (callback) callback();
  } catch (err) {
    console.log(err);
  }
};
