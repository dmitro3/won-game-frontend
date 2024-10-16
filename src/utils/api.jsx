const SERVER_URL = "http://localhost:5002/api";
// const SERVER_URL = "http://172.20.30.99:5002/api";

const doGet = (url, params) => {
    console.log("API Get Call");
    return doHTTP(url, "GET", params);
}

const doPut = () => {
    console.log("API Put Call");
    return doHTTP(url, "PUT", params);
}

const doPost = () => {
    console.log("API Post Call");
    return doHTTP(url, "POST", params);
}

const doDelete = () => {
    console.log("API Delete Call");
    return doHTTP(url, "DELETE", params);
}

const doHTTP = (url, method, params) => {
    return fetch(`${SERVER_URL}${url}`, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });
}

export default {
    doGet,
    doPost,
    doPut,
    doDelete,    
};