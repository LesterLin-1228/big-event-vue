<script setup>
import { User, Lock, Message } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
// 控制註冊、登入和忘記密碼表單的顯示， 默認顯示登入
// const isRegister = ref(false)
const currentPage = ref('login');
const showPage = (page) => {
    currentPage.value = page;
};

// 定義數據模型
const registerData = ref({
    username: '',
    password: '',
    rePassword: '',
    email: ''
})

// 校驗密碼的函數
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('請再次確認密碼'))
    } else if (value !== registerData.value.password) {
        callback(new Error('請確認兩次輸入的密碼相同'))
    } else {
        callback()
    }
}

// 定義表單校驗規則
const rules = {
    username: [
        { required: true, message: '請輸入用戶名', trigger: 'blur' },
        { min: 5, max: 16, message: '請輸入5~16位非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '請輸入密碼', trigger: 'blur' },
        { min: 5, max: 16, message: '請輸入5~16位非空字符', trigger: 'blur' }
    ],
    rePassword: [
        { validator: checkRePassword, trigger: 'blur' }
    ],
    email: [
        { required: true, message: '請輸入信箱', trigger: 'blur' }
    ]
}

// 調用後端接口完成註冊
import { userRegisterService, userLoginService, userPwdForgotService } from '@/api/user.js'
const formRegister = ref(null)
const register = async () => {
    formRegister.value.validate(async (valid) => {
        if (valid) {
            // registerData是響應式對象，需要添加value獲取值
            let result = await userRegisterService(registerData.value);
            ElMessage.success('註冊成功')
        } else {
            ElMessage.error('請確認用戶名及密碼');
        }
    })

}

// 綁定數據，重複使用註冊表單的數據模型
// 表單數據校驗
// 登入函數
import { useTokenStore } from '@/stores/token.js'
import { useRouter } from 'vue-router' // useRouter是Vue框架中的一個函數，用於在Vue組件中獲取路由器（router）對象。
const router = useRouter()
const tokenStore = useTokenStore()
const formLogin = ref(null)
const login = async () => {
    formLogin.value.validate(async (valid) => {
        if (valid) {
            // 調用接口完成登入
            let result = await userLoginService(registerData.value);
            ElMessage.success('登入成功')
            // 把得到的token儲存到pinia中
            tokenStore.setToken(result.data)
            // 跳轉首頁 借助路由完成跳轉
            router.push('/')
        } else {
            ElMessage.error('請確認用戶名及密碼');
        }
    });
}

// 定義函數清空數據模型內的數據
const clearRegisterData = () => {
    registerData.value = {
        username: '',
        password: '',
        rePassword: ''
    }
}

// 忘記密碼送出郵件
const formForgotPwd = ref(null)
const sendMail = async () => {
    formForgotPwd.value.validate(async (valid) => {
        if (valid) {
            // 調用接口送出郵件
            let result = await userPwdForgotService(registerData.value);
            ElMessage.success('送出郵件成功')
            // 把得到的token儲存到pinia中
            tokenStore.setToken(result.data)
            router.push('/login')
        } else {
            ElMessage.error('請確認用戶名及信箱');
        }

    })

}


</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 登入表單 -->
            <el-form ref="formLogin" size="large" autocomplete="off" v-if="currentPage === 'login'" :model="registerData"
                :rules="rules">
                <el-form-item>
                    <h1>登入</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="請輸入用戶名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="請輸入密碼" show-password
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <!-- 登入按鈕 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登入</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-link type="info" :underline="false" @click="showPage('register'); clearRegisterData()">
                            註冊 →
                        </el-link>
                        <el-link type="primary" :underline="false" @click="showPage('forgotPwd')">忘記密碼？</el-link>
                    </div>
                </el-form-item>
            </el-form>
            <!-- 註冊表單 -->
            <el-form ref="formRegister" size="large" autocomplete="off" v-if="currentPage === 'register'"
                :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>註冊</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="請輸入用戶名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="請輸入密碼" show-password
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="請再次輸入密碼" show-password
                        v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- 註冊按鈕 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        註冊
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="showPage('login'); clearRegisterData()">
                        ← 登入
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 忘記密碼表單 -->
            <el-form ref="formForgotPwd" size="large" autocomplete="off" v-if="currentPage === 'forgotPwd'"
                :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>忘記密碼</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="請輸入用戶名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input name="email" :prefix-icon="Message" type="email" placeholder="請輸入信箱"
                        v-model="registerData.email"></el-input>
                </el-form-item>
                <!-- 忘記密碼按鈕 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="sendMail">送出郵件</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="showPage('login'); clearRegisterData()">
                        ← 登入
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>