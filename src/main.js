import { createApp } from 'vue'
import App from './App.vue'
import router from './router'    // 追加：ルーターをインポート
import './style.css'

createApp(App).use(router).mount('#app')   // routerを使うように追加
