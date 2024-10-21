import axios from 'axios';

export const api = async (url, method, data, token) => {
    method = method.toLowerCase();
    let headers = {
        'Content-Type': 'application/json',
        'TOKEN': `${token}`,  // Add the token here
    };

    if (method == 'get') {
        return axios.get(url, {headers});
    } else if (method == 'post') {
        return axios.post(url, data, {headers});
    } else if (method == 'put') {
        return axios.put(url, data, {headers});
    } else if (method == 'delete') {
        return axios.delete(url, {headers});
    }
}
