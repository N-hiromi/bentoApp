import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initializeApp } from "firebase/app"
import { firebaseConfig } from '@/components/firebase/index.ts'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Initialize Firebase
const firebaseApp= initializeApp(firebaseConfig);
export { firebaseApp }
//const analytics = getAnalytics(firebaseApp);
const app = createApp(App).use(router).use(store)
router.isReady().then(() => {
  app.mount('#app');
}) 
