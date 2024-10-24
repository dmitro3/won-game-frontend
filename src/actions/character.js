import { VIEW_CHARACTERS, UNLOCK_CHARACTER, ADD_CHARACTER } from '../constants/characterConstants';
import { serverUrl } from '../utils/constants';
import { api } from '../utils/api';

export const viewCharacters = () => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/character/`, 'get', null, state.other.token);
  dispatch({
    type: VIEW_CHARACTERS,
    payload: res.data
  });
};

export const addCharacter = (newCharacter) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/character/new`, 'post', newCharacter, state.other.token);
  dispatch({
    type: ADD_CHARACTER,
    payload: res.data
  });
};

export const unlockCharacter = ({telegramId, characterData}, callback) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/character/${telegramId}`, 'put', {
    name: characterData.username,
    id: characterData.id,
  }, state.other.token);
  
  dispatch({
    type: UNLOCK_CHARACTER,
    payload: res.data
  });

  if (callback) callback();
};
