import axios from 'axios';
import { 
  VIEW_CHARACTERS, 
  UNLOCK_CHARACTER, 
  SELECT_CHARACTER 
} from '../constants/characterConstants';

import {
  serverUrl,
  telegramId,
  username,
} from '../utils/constants';


export const viewCharacters = () => async dispatch => {
  try {
    const res = await axios.get(`${serverUrl}/character/`);
    dispatch({
      type: VIEW_CHARACTERS,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const unlockCharacter = (userData, callback) => async dispatch => {
  try {
    const res = await axios.put(`${serverUrl}/character/${telegramId}`, 
    {
      name: username,
      id: userData.id,
    });
    
    dispatch({
      type: UNLOCK_CHARACTER,
      payload: res.data
    });

    if (callback) callback();

  } catch (err) {
    console.log(err);
  }
};

export const selectCharacter = (userData) => async dispatch => {
  try {
    const res = await axios.put(`${serverUrl}/character/${telegramId}`, 
    {
      name: username,
      id: userData.id,
    });
    
    dispatch({
      type: SELECT_CHARACTER,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};
