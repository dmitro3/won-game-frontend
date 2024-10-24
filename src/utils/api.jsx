import axios from 'axios';
import { SHOW_LOADING } from '../constants/otherConstants';
import showToast from '../utils/toast';
export const api = async (url, method, data, token, dispatch) => {
    if (dispatch) {
        dispatch({
            type: SHOW_LOADING,
            payload: true
        });
    }

    method = method.toLowerCase();
    let headers = {
        'Content-Type': 'application/json',
        'TOKEN': `${token}`,
    };
    let result;
    try {
        if (method == 'get') {
            result = await axios.get(url, {headers});
        } else if (method == 'post') {
            result = await axios.post(url, data, {headers});
        } else if (method == 'put') {
            result = await axios.put(url, data, {headers});
        } else if (method == 'delete') {
            result = await axios.delete(url, {headers});
        }
        if (dispatch) {
            dispatch({
                type: SHOW_LOADING,
                payload: false
            });
        }
    }
    catch (err) {
        showToast("error", err.response.data);
        result = {};
    }

    return result;
}
