import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initializeApp } from "firebase/app"
import { firebaseConfig } from '@/components/firebase/index.ts'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)
// Initialize Firebase
const firebaseApp= initializeApp(firebaseConfig);
export { firebaseApp }
//const analytics = getAnalytics(firebaseApp);
const app = createApp(App).use(router).use(store).component('font-awesome-icon', FontAwesomeIcon )
router.isReady().then(() => {
  app.mount('#app');
}) 
