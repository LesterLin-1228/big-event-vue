<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'

// 文章分類數據模型
const categories = ref([])

// 用戶搜索時選中的分類id
const categoryId = ref('')

// 用戶搜索時選中的發布狀態
const state = ref('')

// 文章列表數據模型
const articles = ref([])

// 分頁條數據模型
const pageNum = ref(1) // 當前頁
const total = ref(20) // 總條數
const pageSize = ref(3) // 每頁條數

// 當每頁條數發生了變化，調用此函数
const onSizeChange = (size) => {
    pageSize.value = size
}
// 當前頁碼發生變化，調用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
}

// 調用接口獲取文章分類數據
import { articleCategoryListService } from '@/api/article.js'
const articleCategoryList = async () => {
    let result = await articleCategoryListService();

    categories.value = result.data;
}
articleCategoryList();

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜尋表單 -->
        <el-form inline>
            <el-form-item label="文章分類：">
                <el-select placeholder="請選擇" v-model="categoryId">
                    <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="發布狀態：">
                <el-select placeholder="請選擇" v-model="state">
                    <el-option label="已發布" value="已發布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜尋</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章標題" width="400" prop="title"></el-table-column>
            <el-table-column label="分類" prop="categoryId"></el-table-column>
            <el-table-column label="發布時間" prop="createTime"> </el-table-column>
            <el-table-column label="狀態" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary"></el-button>
                    <el-button :icon="Delete" circle plain type="danger"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="沒有數據" />
            </template>
        </el-table>
        <!-- 分頁條 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
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

    .el-select {
        --el-select-width: 220px;
    }
}
</style>