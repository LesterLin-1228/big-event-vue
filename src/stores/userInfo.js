import { defineStore } from 'pinia'
import { ref } from 'vue';
export const useUserInfoStore = defineStore('userInfo', () => {
    // 定義狀態相關的內容
    const info = ref({})

    const setInfo = (newInfo) => {
        info.value = newInfo
    }

    const removeInfo = () => {
        info.value = {}
    }

    return { info, setInfo, removeInfo }

}, { persist: true });