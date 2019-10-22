import axios from '@/http/index.js';
const prefix = '/users'
const userApi = {
    verify(param){
        return axios.post(`${prefix}/verify`, param)
    },
    register(param){
        return axios.post(`${prefix}/signup`, param)
    },
    login(param){
        return axios.post(`${prefix}/signin`, param)
    }
}

export default userApi;