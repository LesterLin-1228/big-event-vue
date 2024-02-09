import { createRouter, createWebHistory } from "vue-router";

// 導入組件
import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';

// 定義路由關係
const routes = [
    { path: '/login', component: LoginVue },
    { path: '/', component: LayoutVue }
]

// 創建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

// 導出路由
export default router