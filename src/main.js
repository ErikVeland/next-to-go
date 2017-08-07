import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.http.headers.common['Access-Control-Allow-Origin'] = '*';
Vue.http.headers.common['Access-Control-Allow-Credentials'] = 'true';

Vue.component('next-to-go', require('./components/NextToGo.vue'));

const app = new Vue({
    el: '#app',
});