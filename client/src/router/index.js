import { createRouter, createWebHistory } from 'vue-router'
// 引入你的留言板组件
import Home from '../views/Home.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    // 你可以在这里加那个隐藏的路由，比如：
    // {
    //   path: '/admin-secret-888',
    //   component: () => import('../views/Secret.vue')
    // }
  ]
})

export default router