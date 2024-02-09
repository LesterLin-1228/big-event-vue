// 訂製請求的實例

// 導入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus'
// 定義一个變數,紀錄公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({baseURL})


//添加響應攔截器
instance.interceptors.response.use(
    result=>{
        // 判斷業務狀態碼
        // 操作成功
        if(result.data.code===0){
            return result.data;
        }

        // 操作失敗
        // alert(result.data.message?result.data.message:'服務異常')
        ElMessage.error(result.data.message?result.data.message:'服務異常')
        // 異步操作的狀態轉換為失敗
        return Promise.reject(result.data)
    },
    err=>{
        alert('服務異常');
        return Promise.reject(err);// 異步的狀態轉成失敗的狀態
    }
)

export default instance;