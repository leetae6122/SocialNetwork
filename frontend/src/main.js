import { createApp } from 'vue';
import App from './App.vue';
import router from "./router";
import { createPinia } from 'pinia';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap'
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/main.css";

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(router).use(pinia).mount("#app");
