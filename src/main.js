import {createApp} from 'vue';
import router from './router/index';
import App from './App.vue'
import axios from 'axios'
import store from './store/storage'


axios.defaults.baseURL = 'http://localhost:3000'

const app = createApp(App)
app.config.globalProperties.axios = axios;
app.use(store)
app.use(router)
app.mount('#app')



