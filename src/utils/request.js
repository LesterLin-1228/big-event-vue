// 訂製請求的實例

// 導入axios  npm install axios
import axios from 'axios';
// 定義一个變數,紀錄公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({baseURL})


//添加響應攔截器
instance.interceptors.response.use(
    result=>{
        return result.data;
    },
    err=>{
        alert('服務異常');
        return Promise.reject(err);// 異步的狀態轉成失敗的狀態
    }
)

export default instance;