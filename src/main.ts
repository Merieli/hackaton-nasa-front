import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

// Pinia
import { createPinia } from 'pinia';

const pinia = createPinia();

// const google = require('google');

createApp(App).use(pinia).use(router).mount('#app');
