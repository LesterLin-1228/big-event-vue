// 導入request.js請求工具
import request from '@/utils/request.js'

// 提供調用註冊接口的函數
export const userRegisterService = (registerDate)=>{
    // 借用UrlSearchParams完成傳遞
    const params = new URLSearchParams()
    for(let key in registerDate){
        params.append(key,registerDate[key])
    }
    return request.post('/user/register',params);
}