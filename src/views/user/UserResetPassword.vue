<script setup>
import { ref } from 'vue';
// 定義數據模型
const pwdData = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
})
// 校驗密碼的函數
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('請再次確認新密碼'))
    } else if (value !== pwdData.value.new_pwd) {
        callback(new Error('請確認兩次輸入的新密碼相同'))
    } else {
        callback()
    }
}
// 定義表單校驗規則
const rules = {
    old_pwd: [
        { required: true, message: '請輸入原密碼', trigger: 'blur' },
        { min: 5, max: 16, message: '請輸入5~16位非空字符', trigger: 'blur' }
    ],
    new_pwd: [
        { required: true, message: '請輸入新密碼', trigger: 'blur' },
        { min: 5, max: 16, message: '請輸入5~16位非空字符', trigger: 'blur' }
    ],
    re_pwd: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

import { userPwdUpdateService } from '@/api/user'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'
const formRef = ref(null)
const router = useRouter()
const updatePwd = async () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            let result = await userPwdUpdateService(pwdData.value);
            ElMessage.success('修改成功');
            router.push('/login')
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
                <span>重置密碼</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form ref="formRef" :model="pwdData" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="原密碼" prop="old_pwd">
                        <el-input v-model="pwdData.old_pwd" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="新密碼" prop="new_pwd">
                        <el-input v-model="pwdData.new_pwd" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="確認新密碼" prop="re_pwd">
                        <el-input v-model="pwdData.re_pwd" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePwd">修改密碼</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>