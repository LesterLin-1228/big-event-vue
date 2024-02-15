import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'
// 文章分類列表查詢
export const articleCategoryListService = () => {
    const tokenStore = useTokenStore()
    // 在pinia中定義的響應式數據不需要.value
    return request.get('/category', { headers: { 'Authorization': tokenStore.token } })
}