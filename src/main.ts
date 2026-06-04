import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/tokens.css'
import './assets/css/modules.css'
import {useAuthStore} from "@/stores/auth.ts";

const app = createApp(App)
app.use(createPinia())

const authStore = useAuthStore()
if(authStore.token) {
    await authStore.fetchCurrentUser().catch(() => authStore.logout())
}

app.use(router).mount('#app')
