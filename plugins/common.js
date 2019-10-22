import Vue from 'vue';
import api from '../api';

var common = {
    install(Vue){
        Vue.prototype.$api = api
    }
}

Vue.use(common);