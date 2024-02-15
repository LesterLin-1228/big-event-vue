<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'
const categories = ref([

])

// 聲明一個異步函數
import { articleCategoryListService, articleCategoryAddService } from '@/api/article.js'
const articleCategoryList = async () => {
    let result = await articleCategoryListService();
    categories.value = result.data;
}
articleCategoryList();

//控制添加分類彈窗
const dialogVisible = ref(false)

//添加分類數據模型
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})
//添加分類表單校驗
const rules = {
    categoryName: [
        { required: true, message: '请输入分類名稱', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '请输入分類别名', trigger: 'blur' },
    ]
}

// 調用接口，添加表單
import { ElMessage } from 'element-plus';
const addCategory = async () => {
    // 調用接口
    let result = await articleCategoryAddService(categoryModel.value);
    ElMessage.success('添加成功');

    // 調用獲取所有文章分類的函數
    articleCategoryList();
    dialogVisible.value = false;
}

// 定義變數，控制標題的展示
const title = ref('')

// 展示編輯彈窗
const showDialog = (row) => {
    dialogVisible.value = true; title.value = '編輯分類'
    // 數據拷貝
    categoryModel.value.categoryName = row.categoryName;
    categoryModel.value.categoryAlias = row.categoryAlias;
    // 擴展id屬性，傳到後端完成分類的修改
    categoryModel.value.id = row.id;
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分類</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true; title = '添加分類'">添加分類</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categories" style="width: 100%">
            <el-table-column label="編號" width="100" type="index"> </el-table-column>
            <el-table-column label="分類名稱" prop="categoryName"></el-table-column>
            <el-table-column label="分類别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="沒有數據" />
            </template>
        </el-table>

        <!-- 添加分類彈窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="分類名稱" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分類别名" prop="categoryAlias">
                    <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addCategory"> 確認 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>