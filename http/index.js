import axios from 'axios';

const instance = axios.create({
    timeout: 10000
})

instance.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.error(error);
})

instance.interceptors.response.use(res => {
    const status = res.status;
    return status === 200 ? Promise.resolve(res.data) : Promise.reject(res);
}, error => {
    const { response } = error;
    if(response){
        // errorHandler(response.status, response.data.message);
        return Promise.reject(response);
    }
})


export default instance;