import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'
// 文章分類列表查詢
export const articleCategoryListService = () => {
    // const tokenStore = useTokenStore()
    // // 在pinia中定義的響應式數據不需要.value
    // return request.get('/category', { headers: { 'Authorization': tokenStore.token } })
    return request.get('/category')
}

// 文章分類添加
export const articleCategoryAddService = (categoryData) => {
    return request.post('/category', categoryData)
}

// 文章分類修改
export const articleCategoryUpdateService = (categoryData) => {
    return request.put('/category', categoryData)
}