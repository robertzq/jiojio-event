import { createApp } from 'vue'
import './style.css' // 默认样式，如果你没删就留着，删了就去掉
import App from './App.vue'
import router from './router' // 引入上面的路由配置

const app = createApp(App)

app.use(router) // <--- 关键：告诉 Vue 使用路由
app.mount('#app')