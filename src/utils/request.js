// 訂製請求的實例

// 導入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus'
// 定義一個變數,紀錄公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({ baseURL })

import { useTokenStore } from '@/stores/token.js';
// 添加請求攔截器
instance.interceptors.request.use(
    (config) => {
        // 請求前的回調
        // 添加token
        const tokenStore = useTokenStore();
        // 判斷有沒有token
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token
        }
        return config;
    },
    (err) => {
        // 請求錯誤的回調
        Promise.reject(err);
    }
)

// 添加響應攔截器
instance.interceptors.response.use(
    result => {
        // 判斷業務狀態碼
        // 操作成功
        if (result.data.code === 0) {
            return result.data;
        }

        // 操作失敗
        // alert(result.data.message?result.data.message:'服務異常')
        ElMessage.error(result.data.message ? result.data.message : '服務異常')
        // 異步操作的狀態轉換為失敗
        return Promise.reject(result.data)
    },
    err => {
        alert('服務異常');
        return Promise.reject(err);// 異步的狀態轉成失敗的狀態
    }
)

export default instance;