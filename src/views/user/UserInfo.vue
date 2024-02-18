<script setup>
import { useUserInfoStore } from '@/stores/userInfo';
import { ref } from 'vue'
const userInfoStore = useUserInfoStore();
const userInfo = ref({ ...userInfoStore.info })
const rules = {
    nickname: [
        { required: true, message: '請輸入用戶暱稱', trigger: 'blur' },
        {
            pattern: /^\S{1,10}$/,
            message: '必须是1-10位的字，不包含空白',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: '請輸入信箱', trigger: 'blur' },
        { type: 'email', message: '信箱格式不正確', trigger: 'blur' }
    ]
}

// 修改個人訊息
import { userInfoUpdateService } from '@/api/user'
import { ElMessage } from 'element-plus';
// const updateUserInfo = async () => {
//     // 調用接口
//     let result = await userInfoUpdateService(userInfo.value);
//     ElMessage.success('修改成功');
//     // 修改pinia中的個人訊息
//     userInfoStore.setInfo(userInfo.value);
// }
// 優化點擊修改時再次驗證是否通過規則
const formRef = ref(null)
const updateUserInfo = async () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            let result = await userInfoUpdateService(userInfo.value);
            ElMessage.success('修改成功');
            userInfoStore.setInfo(userInfo.value);
        } else {
            ElMessage.error('格式錯誤');
        }
    });
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本資料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form ref="formRef" :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="登入名稱">
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用戶暱稱" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="用戶信箱" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>