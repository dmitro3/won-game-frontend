import { 
  VIEW_CHARACTERS, 
  UNLOCK_CHARACTER, 
} from '../constants/characterConstants';

import {
  serverUrl,
} from '../utils/constants';
import { api } from '../utils/api';

export const viewCharacters = () => async (dispatch, getState) => {
  let state = getState();
  try {
    const res = await api(`${serverUrl}/character/`, 'get', null, state.other.token);
    console.log("character data", res);
    dispatch({
      type: VIEW_CHARACTERS,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const unlockCharacter = ({telegramId, characterData}, callback) => async (dispatch, getState) => {
  let state = getState();
  console.log("charactor---", characterData);
  try {
    const res = await api(`${serverUrl}/character/${telegramId}`, 'put', {
      name: characterData.username,
      id: characterData.id,
    }, state.other.token);
    
    dispatch({
      type: UNLOCK_CHARACTER,
      payload: res.data
    });

    if (callback) callback();

  } catch (err) {
    console.log(err);
  }
};
