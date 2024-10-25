import { VIEW_ACTIVITY, UPDATE_ACTIVITY } from '../constants/activityConstants';
import { serverUrl } from '../utils/constants';
import { api } from '../utils/api';

export const viewActivity = ({telegramId, username}) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/activity/${telegramId}`, 'post', {name: username}, state.other.token);
  dispatch({
    type: VIEW_ACTIVITY,
    payload: res.data
  });
};

export const updateActivity = ({telegramId, data_activity}) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/activity/${telegramId}`, 'put', data_activity, state.other.token);
  dispatch({
    type: UPDATE_ACTIVITY,
    payload: res.data
  });
};

export const updateActivityWithUser = ({telegramId, data_activity}, callback) => async (dispatch, getState) => {
  let state = getState();
  const res = await api(`${serverUrl}/user/withActivity/${telegramId}`, 'put', data_activity, state.other.token);
  if (callback) callback(res);
};
