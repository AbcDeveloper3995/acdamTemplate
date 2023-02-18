import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import './assets/main.css'
import axios from "axios";

const app = createApp(App)
app.use(VueSweetalert2)
app.use(router)
app.mount('#app')

axios.defaults.baseURL = "http://127.0.0.1:8000/"
let token = localStorage.getItem('token')
if(token){
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
