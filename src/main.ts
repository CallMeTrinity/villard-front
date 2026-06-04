import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/tokens.css'
import './assets/css/modules.css'

createApp(App).use(createPinia()).use(router).mount('#app')
