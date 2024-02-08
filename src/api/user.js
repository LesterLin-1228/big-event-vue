// 導入request.js請求工具
import request from '@/utils/request.js'

// 提供調用註冊接口的函數
export const userRegisterService = (registerData)=>{
    // 借用UrlSearchParams完成傳遞
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key])
    }
    return request.post('/user/register',params);
}

// 提供調用登入接口的函數
export const userLoginService = (loginData)=>{
    const params = new URLSearchParams()
    for(let key in loginData){
        params.append(key,loginData[key])
    }
    return request.post('/user/login',params)
}